import { cleanUrl } from './convert.js';
import { oldSite } from './client.js';

const format = (url) => {
  try {
    return new URL(url).pathname
      .match(/\.(jpe?g|png|webp|gif)$/i)?.[1]
      .toLowerCase()
      .replace('jpeg', 'jpg');
  } catch {
    return null;
  }
};
const allowedSource = (url) => {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === 'https:' &&
      [new URL(oldSite).hostname, 'www.' + new URL(oldSite).hostname].includes(
        parsed.hostname
      )
    );
  } catch {
    return false;
  }
};
function variants(media) {
  const original = cleanUrl(media.source_url);
  return [
    {
      url: original,
      width: media.media_details?.width,
      height: media.media_details?.height,
    },
    ...Object.values(media.media_details?.sizes || {}).map((size) => ({
      url: cleanUrl(size.source_url || size.file, original),
      width: size.width,
      height: size.height,
    })),
  ];
}

export function selectReviewImage(post, attachments, media) {
  const byId = new Map(media.map((item) => [item.id, item]));
  const choices = [];
  const addMedia = (item, reason) => {
    if (item)
      choices.push({ variants: variants(item), mediaId: item.id, reason });
  };
  addMedia(byId.get(post.featured_media), 'WordPress featured image');
  for (const item of media.filter(
    (item) =>
      (item.post || item.parent) === post.id &&
      item.mime_type?.startsWith('image/')
  ))
    addMedia(item, 'Image attached to this post');
  for (const attachment of attachments.filter(
    (item) => item.type === 'image'
  )) {
    const item = byId.get(attachment.mediaId);
    if (item) addMedia(item, 'First eligible inline image');
    else {
      const dimensions = attachment.url.match(/-(\d+)x(\d+)\.[^.]+$/);
      choices.push({
        variants: [
          {
            url: attachment.url,
            width: Number(dimensions?.[1]),
            height: Number(dimensions?.[2]),
          },
        ],
        mediaId: null,
        reason: 'Inline variant with dimensions in its filename',
      });
    }
  }
  for (const choice of choices) {
    const supported = choice.variants.filter(
      (item) =>
        item.url &&
        allowedSource(item.url) &&
        format(item.url) &&
        Number.isFinite(item.width) &&
        item.width > 0 &&
        item.width <= 1024
    );
    const preferred = supported.filter((item) =>
      ['jpg', 'png', 'webp'].includes(format(item.url))
    );
    const best = (preferred.length ? preferred : supported).sort(
      (a, b) => b.width - a.width || (b.height || 0) - (a.height || 0)
    )[0];
    if (best)
      return {
        ...best,
        extension: format(best.url),
        mediaId: choice.mediaId,
        reason: choice.reason,
      };
  }
  return null;
}

// Validate the received format and dimensions, not just API metadata or suffix.
export function imageDimensions(bytes) {
  if (
    bytes.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex')) &&
    bytes.length >= 24
  ) {
    return {
      format: 'png',
      width: bytes.readUInt32BE(16),
      height: bytes.readUInt32BE(20),
    };
  }
  if (bytes.length >= 10 && /^GIF8[79]a$/.test(bytes.toString('ascii', 0, 6))) {
    return {
      format: 'gif',
      width: bytes.readUInt16LE(6),
      height: bytes.readUInt16LE(8),
    };
  }
  if (
    bytes.length >= 30 &&
    bytes.toString('ascii', 0, 4) === 'RIFF' &&
    bytes.toString('ascii', 8, 12) === 'WEBP'
  ) {
    const type = bytes.toString('ascii', 12, 16);
    if (type === 'VP8X')
      return {
        format: 'webp',
        width: bytes.readUIntLE(24, 3) + 1,
        height: bytes.readUIntLE(27, 3) + 1,
      };
    if (type === 'VP8L' && bytes[20] === 0x2f)
      return {
        format: 'webp',
        width: 1 + bytes[21] + ((bytes[22] & 63) << 8),
        height:
          1 + (bytes[22] >> 6) + (bytes[23] << 2) + ((bytes[24] & 15) << 10),
      };
    if (type === 'VP8 ')
      return {
        format: 'webp',
        width: bytes.readUInt16LE(26) & 0x3fff,
        height: bytes.readUInt16LE(28) & 0x3fff,
      };
  }
  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    let index = 2;
    while (index + 8 < bytes.length) {
      if (bytes[index++] !== 0xff) break;
      while (bytes[index] === 0xff) index++;
      const marker = bytes[index++];
      if (marker === 0xda || marker === 0xd9) break;
      const length = bytes.readUInt16BE(index);
      if (length < 2 || index + length > bytes.length) break;
      if (
        [
          0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd,
          0xce, 0xcf,
        ].includes(marker)
      ) {
        return {
          format: 'jpg',
          height: bytes.readUInt16BE(index + 3),
          width: bytes.readUInt16BE(index + 5),
        };
      }
      index += length;
    }
  }
  throw new Error(
    'Response is not a supported JPG/PNG/WebP/GIF image with readable dimensions'
  );
}

export async function downloadReviewImages(
  rows,
  posts,
  media,
  client,
  writeReview
) {
  const cache = new Map();
  const result = {
    files: 0,
    totalFileBytes: 0,
    totalDownloadBytes: 0,
    failures: [],
  };
  for (const row of rows.filter((item) => item.news)) {
    const post = posts.find((item) => item.id === row.id);
    const selected = selectReviewImage(post, row.attachments, media);
    if (!selected) {
      row.image = {
        status: 'none',
        reason:
          'No supported image variant with a known width up to 1024 px; HEIC is skipped.',
      };
      row.warnings.push(row.image.reason);
      continue;
    }
    try {
      let bytes = cache.get(selected.url);
      if (!bytes) {
        bytes = await client.download(selected.url);
        result.totalDownloadBytes += bytes.length;
        cache.set(selected.url, bytes);
      }
      const dimensions = imageDimensions(bytes);
      if (dimensions.width > 1024 || !dimensions.width || !dimensions.height)
        throw new Error(
          'Downloaded image dimensions violate the 1024 px width limit'
        );
      if (dimensions.format !== selected.extension)
        throw new Error(
          'Downloaded format does not match the selected filename'
        );
      const path = `images/${row.slug}.${dimensions.format}`;
      writeReview(path, bytes);
      row.image = {
        status: 'downloaded',
        path,
        sourceUrl: selected.url,
        sizeBytes: bytes.length,
        width: dimensions.width,
        height: dimensions.height,
        mediaId: selected.mediaId,
        reason: selected.reason,
        alt: { ka: '[ALT NEEDED]', en: '[ALT NEEDED]' },
      };
      row.news.image = { ...row.image };
      result.files++;
      result.totalFileBytes += bytes.length;
    } catch (error) {
      row.image = {
        status: 'failed',
        sourceUrl: selected.url,
        reason: error.message,
      };
      row.warnings.push(`Image download failed: ${error.message}`);
      result.failures.push({
        collection: `image WP ${row.id}`,
        message: `${selected.url}: ${error.message}`,
      });
    }
    row.news.migration.image = row.image;
  }
  return result;
}
