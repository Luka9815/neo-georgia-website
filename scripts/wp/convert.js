import { createHash } from 'node:crypto';
import { load } from 'cheerio';
import TurndownService from 'turndown';
import { Temporal } from '@js-temporal/polyfill';
import { languageOf } from './languages.js';
import { postLanguage, pairingCandidates } from './language-review.js';
import { oldSite } from './client.js';

// Georgian national romanisation: ejectives have apostrophes here. The URL
// slug subsequently drops apostrophes because the site accepts a-z, 0-9, '-'.
const alphabet = {
  ა: 'a',
  ბ: 'b',
  გ: 'g',
  დ: 'd',
  ე: 'e',
  ვ: 'v',
  ზ: 'z',
  თ: 't',
  ი: 'i',
  კ: "k'",
  ლ: 'l',
  მ: 'm',
  ნ: 'n',
  ო: 'o',
  პ: "p'",
  ჟ: 'zh',
  რ: 'r',
  ს: 's',
  ტ: "t'",
  უ: 'u',
  ფ: 'p',
  ქ: 'k',
  ღ: 'gh',
  ყ: "q'",
  შ: 'sh',
  ჩ: 'ch',
  ც: 'ts',
  ძ: 'dz',
  წ: "ts'",
  ჭ: "ch'",
  ხ: 'kh',
  ჯ: 'j',
  ჰ: 'h',
};
const email = /[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
export const redact = (value) =>
  String(value ?? '').replace(email, '[email removed]');

export function plainText(html) {
  const $ = load(String(html || ''), null, false);
  $('script, style, noscript').remove();
  $('br').replaceWith(' ');
  $('p, div, li, h1, h2, h3, h4, h5, h6, tr').append(' ');
  return redact($.text())
    .replace(/\u2014/g, ' - ')
    .replace(/\s+/g, ' ')
    .trim();
}
export function cleanTitle(html) {
  return plainText(html).replace(/^(?:[\p{Extended_Pictographic}\p{Regional_Indicator}\p{Emoji_Modifier}\uFE0F\u200D]\s*|[0-9#*]\uFE0F?\u20E3\s*)+/u, '').trim();
}

export function cleanThemeMarkdown(markdown) {
  return markdown
    .replace(/^(?:\s*(?:\*\*|__)?\{\d{1,2}\.\d{1,2}\.\d{4}\}(?:\*\*|__)?[ \t]*(?:\r?\n|$))+/, '')
    .replace(/^[ \t]*(?:\*\*|__)?[ \t]*ℹ\uFE0F?[ \t]*(?:\*\*|__)?[ \t]*$/gm, '')
    .replace(/\n(?:[ \t]*\n){2,}/g, '\n\n')
    .trim();
}

export function romanise(title) {
  return [...title.normalize('NFKC').toLowerCase()]
    .map((letter) => alphabet[letter] ?? letter)
    .join('');
}
export function uniqueSlug(title, id, used) {
  let base = romanise(plainText(title))
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/['’ʼ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  if (!base) base = `news-${id}`;
  base = base.slice(0, 60).replace(/-+$/g, '');
  let slug = base;
  for (let count = 2; used.has(slug); count++) {
    const suffix = `-${count}`;
    slug = base.slice(0, 60 - suffix.length).replace(/-+$/g, '') + suffix;
  }
  used.add(slug);
  return slug;
}

export function cleanUrl(value, base = oldSite) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value, base);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    if (url.username || url.password) return null;
    for (const key of [...url.searchParams.keys()]) {
      if (
        /^(utm_|fbclid$|gclid$|dclid$|msclkid$|mc_cid$|mc_eid$|_ga$|_gl$|_hs)/i.test(
          key
        ) ||
        /@/.test(url.searchParams.get(key))
      )
        url.searchParams.delete(key);
    }
    return url.href;
  } catch {
    return null;
  }
}
const assetType = (url) =>
  /\.pdf(?:[?#]|$)/i.test(url)
    ? 'pdf'
    : /\.(?:jpe?g|png|gif|webp|avif|svg|bmp)(?:[?#]|$)/i.test(url)
      ? 'image'
      : null;

export function htmlToMarkdown(html, base = oldSite) {
  const warnings = [];
  let text = String(html || '');
  if (text.match(email))
    warnings.push('Email addresses redacted for the public review repository.');
  if (text.includes('\u2014'))
    warnings.push('Em dashes replaced with spaced hyphens for project style.');
  text = redact(text).replace(/\u2014/g, ' - ');
  const shortcode =
    /\[\/?(?:vc_[\w-]+|elementor[\w-]*|gallery|caption|rev_slider|contact-form-7|wp_[\w-]+|su_[\w-]+)(?:\s[^\]]*)?\]/gi;
  if (shortcode.test(text))
    warnings.push(
      'WordPress/Elementor shortcode wrappers removed; review missing widget content.'
    );
  text = text.replace(shortcode, '');
  const $ = load(text, null, false);
  const attachments = [];
  const add = (url, alt, relationship, assumedType = null) => {
    const cleaned = cleanUrl(url, base);
    const type = cleaned && (assetType(cleaned) || assumedType);
    if (type)
      attachments.push({
        url: cleaned,
        type,
        alt: plainText(alt),
        relationship,
      });
    return cleaned;
  };
  $('img').each((_, element) => {
    const image = $(element);
    for (const name of ['src', 'data-src', 'data-lazy-src']) {
      if (image.attr(name))
        add(image.attr(name), image.attr('alt'), 'inline-image', 'image');
    }
    for (const name of ['srcset', 'data-srcset']) {
      for (const part of (image.attr(name) || '').split(',')) {
        const url = part.trim().split(/\s+/)[0];
        if (url) add(url, image.attr('alt'), 'image-variant', 'image');
      }
    }
    const parent = image.closest('a[href]');
    if (parent.length)
      add(parent.attr('href'), image.attr('alt'), 'linked-image');
  });
  if ($('img').length)
    warnings.push(
      'Images listed separately and omitted from Markdown; no files downloaded.'
    );
  const debris = $(
    'script, style, noscript, iframe, object, embed, svg, form, input, button, nav, [data-elementor-type="header"], [data-elementor-type="footer"]'
  );
  if (debris.length)
    warnings.push(
      'Scripts, embeds, forms or template navigation removed; review original for omitted content.'
    );
  debris.remove();
  $('img').remove();
  $('a[href]').each((_, element) => {
    const link = $(element);
    const href = link.attr('href');
    if (href.startsWith('#')) return;
    const cleaned = add(href, link.text(), 'document-link');
    if (cleaned) link.attr('href', cleaned);
    else {
      warnings.push(
        'Unsupported or contact link removed; visible text retained.'
      );
      link.replaceWith(link.contents());
    }
  });
  if ($('table').length)
    warnings.push(
      'Table converted to plain rows; check column relationships manually.'
    );
  $('table').each((_, element) => {
    const rows = $(element)
      .find('tr')
      .map((__, row) => {
        const paragraph = $('<p>');
        $(row)
          .children('th, td')
          .each((index, cell) => {
            if (index) paragraph.append(' | ');
            paragraph.append($(cell).contents());
          });
        return paragraph;
      })
      .get();
    const wrapper = $('<div>');
    for (const row of rows) wrapper.append(row);
    $(element).replaceWith(wrapper);
  });
  $('a')
    .filter((_, element) => !$(element).text().trim())
    .remove();
  $('*').each((_, element) => {
    for (const name of Object.keys(element.attribs || {})) {
      if (['style', 'class', 'id'].includes(name) || name.startsWith('data-'))
        $(element).removeAttr(name);
    }
    $(element)
      .contents()
      .filter((__, node) => node.type === 'comment')
      .remove();
  });
  $('p')
    .filter(
      (_, element) =>
        !$(element)
          .text()
          .replace(/\u00a0/g, '')
          .trim()
    )
    .remove();
  const turndown = new TurndownService({
    headingStyle: 'atx',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
  });
  const convertedMarkdown = turndown
    .turndown($.html())
    .replace(/\u00a0/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  const markdown = cleanThemeMarkdown(convertedMarkdown);
  if (markdown !== convertedMarkdown) warnings.push('Leading theme date, empty info markers or repeated blank lines removed.');
  return { markdown, attachments, warnings: [...new Set(warnings)] };
}

const actionRules = {
  icm: /\bICM\b|international credit mobility|საერთაშორისო კრედიტმობილ|კრედიტ.?მობილ/iu,
  'erasmus-mundus':
    /erasmus mundus|ერაზმუს მუნდუს|\bEMJM\b|\bEMDM\b|joint masters/iu,
  cbhe: /\bCBHE\b|capacity building in higher education|უმაღლეს.{0,35}(?:შესაძლებლობ|პოტენციალ).{0,20}(?:განვითარ|გაძლიერ)/iu,
  'jean-monnet': /jean monnet|ჟან მონე/iu,
  'cb-vet':
    /\bCB.?VET\b|capacity building.{0,20}vocational|პროფესიულ.{0,30}შესაძლებლობ/iu,
  'cb-youth':
    /capacity building.{0,20}youth|\bCBY\b|ახალგაზრდ.{0,30}შესაძლებლობ/iu,
  'youth-mobility':
    /youth exchanges?|youth.worker mobility|ახალგაზრდულ.{0,15}გაცვლ|ახალგაზრდულ.{0,20}მობილ/iu,
  'virtual-exchanges': /virtual exchanges?|ვირტუალურ.{0,12}გაცვლ/iu,
  'cb-sport': /capacity building.{0,20}sport|სპორტ.{0,30}შესაძლებლობ/iu,
};
export function suggestActions(post, categories, tags) {
  const fields = [
    ...categories
      .filter((term) => post.categories?.includes(term.id))
      .map((t) => ['category', t.name]),
    ...tags
      .filter((term) => post.tags?.includes(term.id))
      .map((t) => ['tag', t.name]),
    ['title', plainText(post.title?.rendered)],
    ['body', plainText(post.content?.rendered)],
  ];
  return Object.entries(actionRules).flatMap(([slug, rule]) => {
    const evidence = fields.flatMap(([source, value]) => {
      const match = String(value).match(rule);
      return match ? [{ source, match: redact(match[0]) }] : [];
    });
    return evidence.length ? [{ slug, status: 'suggested', evidence }] : [];
  });
}
export function eventCandidate(text) {
  const type = text.match(
    /information days?|webinars?|trainings?|conferences?|საინფორმაციო\s+დღ|ვებინარ|ტრენინგ|კონფერენც/iu
  );
  const date = text.match(
    /\b\d{4}-\d{2}-\d{2}\b|\b\d{1,2}[./]\d{1,2}[./]\d{2,4}\b|\b\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\b|\d{1,2}\s*(?:იანვ|თებერვ|მარტ|აპრილ|მაის|ივნის|ივლის|აგვისტ|სექტემბ|ოქტომბ|ნოემბ|დეკემბ)/iu
  );
  return {
    type: type && date ? 'event' : 'news',
    evidence: [type?.[0], date?.[0]].filter(Boolean),
  };
}

export function allPosts(collections) {
  const byId = new Map();
  for (const name of ['georgian', 'posts', 'english', 'translationLookup']) {
    for (const post of collections[name]?.items || []) {
      if (!byId.has(post.id)) byId.set(post.id, post);
    }
  }
  return [...byId.values()].sort((a, b) => a.id - b.id);
}

function mediaIndex(media) {
  const byUrl = new Map();
  const byId = new Map();
  for (const item of media) {
    byId.set(item.id, item);
    const url = cleanUrl(item.source_url);
    if (!url) continue;
    byUrl.set(url, {
      item,
      bytes: item.media_details?.filesize ?? item.filesize ?? null,
    });
    for (const size of Object.values(item.media_details?.sizes || {})) {
      const variant = cleanUrl(size.source_url || size.file, url);
      if (variant) byUrl.set(variant, { item, bytes: size.filesize ?? null });
    }
  }
  return { byUrl, byId };
}

export function convertPosts(collections, run, reservedSlugs = []) {
  const used = new Set(reservedSlugs);
  const index = mediaIndex(collections.media?.items || []);
  const posts = allPosts(collections);
  const sourceById = new Map(posts.map((post) => [post.id, post]));
  const results = [];
  for (const post of posts) {
    const row = {
      id: post.id,
      title: cleanTitle(post.title?.rendered),
      date: post.date?.slice(0, 10) || null,
      oldSlug: redact(post.slug),
      oldUrl: cleanUrl(post.link),
      warnings: [],
      attachments: [],
      status: 'not-converted',
      language: postLanguage(post),
    };
    try {
      if (!post.date_gmt || /^0000-/.test(post.date_gmt))
        throw new Error(
          'Missing publication date_gmt; exact window cannot be verified.'
        );
      const instant = Temporal.Instant.from(
        post.date_gmt.replace(/Z$/, '') + 'Z'
      );
      if (
        Temporal.Instant.compare(instant, run.window.startInclusive) < 0 ||
        Temporal.Instant.compare(instant, run.window.endExclusive) >= 0
      )
        continue;
      if (!row.oldUrl) throw new Error('Missing or invalid old URL.');
      const type = eventCandidate(
        plainText(post.content?.rendered) + ' ' + row.title
      );
      row.typeCandidate = type;
      const suggestions = suggestActions(
        post,
        collections.categories?.items || [],
        collections.tags?.items || []
      );
      row.suggestedActions = suggestions;
      const ka = htmlToMarkdown(post.content?.rendered, row.oldUrl);
      row.warnings.push(...ka.warnings);
      const rawAttachments = ka.attachments.map((asset) => ({
        ...asset,
        language: row.language.body.language,
      }));
      for (const gallery of (post.content?.rendered || '').matchAll(
        /\[gallery[^\]]*ids=["']([\d,\s]+)["'][^\]]*\]/gi
      )) {
        for (const id of gallery[1].split(',').map(Number)) {
          const media = index.byId.get(id);
          if (media?.source_url)
            rawAttachments.push({
              url: cleanUrl(media.source_url),
              type: 'image',
              alt: plainText(media.alt_text),
              relationship: 'gallery-shortcode',
              language: 'shared',
            });
          else
            row.warnings.push(
              `Gallery media ${id} was not returned by the media API.`
            );
        }
      }
      const featured = index.byId.get(post.featured_media);
      if (featured?.source_url)
        rawAttachments.push({
          url: cleanUrl(featured.source_url),
          type: 'image',
          alt: plainText(featured.alt_text),
          relationship: 'featured-image',
          language: 'shared',
        });
      for (const item of collections.media?.items || []) {
        if (
          (item.post || item.parent) === post.id &&
          /^(image\/|application\/pdf)/.test(item.mime_type || '')
        ) {
          rawAttachments.push({
            url: cleanUrl(item.source_url),
            type: item.mime_type === 'application/pdf' ? 'pdf' : 'image',
            alt: plainText(item.alt_text),
            relationship: 'attached-to-post',
            language: 'shared',
          });
        }
      }
      const urls = new Map();
      for (const asset of rawAttachments) {
        if (!asset.url) continue;
        const metadata = index.byUrl.get(asset.url);
        const existing = urls.get(asset.url);
        if (existing)
          existing.uses.push({
            language: asset.language,
            relationship: asset.relationship,
          });
        else
          urls.set(asset.url, {
            url: asset.url,
            type: asset.type,
            sizeBytes: metadata?.bytes ?? null,
            alt: asset.alt || plainText(metadata?.item.alt_text),
            mediaId: metadata?.item.id ?? null,
            uses: [
              { language: asset.language, relationship: asset.relationship },
            ],
            usedBy: [post.id],
          });
      }
      row.attachments = [...urls.values()];
      if (!row.title || !ka.markdown)
        throw new Error('Missing title or body after HTML cleanup.');
      Temporal.PlainDate.from(row.date);
      const slug = uniqueSlug(row.title, post.id, used);
      row.slug = slug;
      row.status = 'converted';
      if (row.language.needsReview) row.warnings.push('Language needs review. The source remains separate; no automatic split, translation or pairing.');
      if (!suggestions.length)
        row.warnings.push(
          'No Action matched. actions is empty; an editor must select a real Action before publication.'
        );
      if (type.type === 'event')
        row.warnings.push(
          'Possible Event: kept as a News-shaped review file, not converted to an Event.'
        );
      row.news = {
        slug,
        date: row.date,
        actions: suggestions.map((suggestion) => suggestion.slug),
        [row.language.slot]: { title: row.title, body: ka.markdown },
        legacy: {
          id: post.id,
          slug: row.oldSlug,
          url: row.oldUrl,

        },
        migration: {
          status: 'unreviewed',
          language: row.language,
          actionsStatus: 'suggested',
          suggestedActions: suggestions,
          typeCandidate: type,
          attachments: row.attachments,
          warnings: row.warnings,
        },
      };
    } catch (error) {
      row.status = 'failed';
      row.warnings.push(error.message);
    }
    results.push(row);
  }
  // Detect exact duplicate titles and bodies, but retain every source for review.
  const duplicates = [];
  for (const field of ['title', 'body']) {
    const groups = new Map();
    for (const row of results.filter((item) => item.news)) {
      const value = field === 'title' ? row.title : row.news[row.language.slot].body;
      const hash = createHash('sha256')
        .update(value.toLowerCase().replace(/\s+/g, ' ').trim())
        .digest('hex');
      groups.set(hash, [...(groups.get(hash) || []), row.id]);
    }
    for (const ids of groups.values())
      if (ids.length > 1) duplicates.push({ field, postIds: ids });
  }
  const pairCandidates = pairingCandidates(results, sourceById, run.languages.pairs);
  for (const row of results) {
    row.pairCandidates = pairCandidates.filter((pair) => pair.ka === row.id || pair.en === row.id);
    if (row.news) row.news.migration.pairCandidates = row.pairCandidates;
  }
  const englishWithoutCandidate = results.filter((row) => row.news && row.language.body.script === 'latin' && !row.pairCandidates.length).map((row) => row.id);
  return { results, duplicates, pairCandidates, englishWithoutCandidate };
}
