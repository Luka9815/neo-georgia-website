import { load } from 'cheerio';
import { Temporal } from '@js-temporal/polyfill';

function visible(html) {
  const $ = load(String(html || ''), null, false);
  $('script, style, noscript').remove();
  $('br').replaceWith('\n');
  $('p, div, li, h1, h2, h3, h4').append('\n');
  return $.text().replace(/https?:\/\/\S+/g, ' ');
}

// Script proportions describe the source, not an approved translation.
// URLs are excluded so Latin link destinations cannot outweigh Georgian prose.
export function detectTextLanguage(html) {
  const text = visible(html);
  const georgian = (text.match(/\p{Script=Georgian}/gu) || []).length;
  const latin = (text.match(/\p{Script=Latin}/gu) || []).length;
  const total = georgian + latin;
  const georgianShare = total ? georgian / total : 0;
  const latinShare = total ? latin / total : 0;
  const englishWords = (
    text.match(
      /\b(?:the|and|of|to|for|with|from|this|is|will|on|in|at|you|your|our)\b/gi
    ) || []
  ).length;
  const mixed =
    georgian >= 30 &&
    latin >= 30 &&
    Math.min(georgianShare, latinShare) >= 0.15;
  const script = !total
    ? 'unknown'
    : mixed
      ? 'mixed'
      : georgian > latin
        ? 'georgian'
        : 'latin';
  return {
    script,
    language:
      script === 'georgian'
        ? 'ka'
        : script === 'latin' && englishWords >= 3
          ? 'en-candidate'
          : script,
    georgianLetters: georgian,
    latinLetters: latin,
    georgianShare: Number(georgianShare.toFixed(3)),
    latinShare: Number(latinShare.toFixed(3)),
    englishWordHits: englishWords,
    note: 'Script heuristic excluding URLs; English is a candidate, not editorial approval.',
  };
}

export function postLanguage(post) {
  const title = detectTextLanguage(post.title?.rendered);
  const body = detectTextLanguage(post.content?.rendered);
  const englishMarker =
    /for english.{0,5}scroll down|\bENG\b|english version/i.test(
      visible(post.content?.rendered)
    );
  const slot =
    title.script === 'georgian' && body.script === 'georgian'
      ? 'ka'
      : title.script === 'latin' && body.language === 'en-candidate'
        ? 'en'
        : 'sourceText';
  return {
    title,
    body,
    englishMarker,
    slot,
    label:
      slot === 'ka'
        ? 'ka'
        : slot === 'en'
          ? 'en CANDIDATE'
          : body.script === 'mixed'
            ? 'mixed ka/Latin'
            : `title ${title.script}; body ${body.script}`,
    needsReview: slot !== 'ka',
  };
}

const topics = {
  webinar: /webinar|ვებინარ/iu,
  conference: /conference|კონფერენც/iu,
  training: /training|ტრენინგ/iu,
  'information-day': /information (?:day|session)|საინფორმაციო (?:დღ|სესი)/iu,
  'europe-day': /europe day|ევროპის დღ/iu,
  'erasmus-days': /erasmus days|ერაზმუს.{0,5}დღე/iu,
  inclusion: /inclusi|ინკლუზ/iu,
  microcredentials: /micro.?credential|მიკროკრედიტ/iu,
  'artificial-intelligence':
    /artificial intelligence|ხელოვნურ.{0,12}ინტელექტ/iu,
  youth: /\byouth\b|ახალგაზრდ/iu,
  sport: /\bsport|სპორტ/iu,
};
const shared = (a, b) => [...a].filter((value) => b.has(value));
function slugTokens(slug) {
  return new Set(
    String(slug || '')
      .toLowerCase()
      .split(/[-_]+/)
      .filter(
        (token) =>
          token.length > 2 &&
          !['erasmus', 'program', 'programme', 'english', 'eng'].includes(token)
      )
  );
}
function mediaKeys(row) {
  return new Set(
    row.attachments
      .filter((asset) => asset.type === 'image')
      .map((asset) => {
        if (asset.mediaId) return `media:${asset.mediaId}`;
        return asset.url.split(/[?#]/)[0].replace(/-\d+x\d+(?=\.[^.]+$)/, '');
      })
  );
}
function dayDistance(a, b) {
  try {
    return Math.abs(
      Temporal.PlainDate.from(a).until(Temporal.PlainDate.from(b)).days
    );
  } catch {
    return Infinity;
  }
}

export function pairingCandidates(rows, sourceById, declaredPairs = []) {
  const candidates = [];
  const profiles = new Map(
    rows
      .filter((row) => row.news)
      .map((row) => {
        const source = sourceById.get(row.id);
        const text = visible(
          `${source.title?.rendered} ${source.content?.rendered}`
        );
        return [
          row.id,
          {
            row,
            media: mediaKeys(row),
            tokens: slugTokens(row.oldSlug),
            topics: new Set([
              ...Object.entries(topics)
                .filter(([, rule]) => rule.test(text))
                .map(([key]) => key),
              ...row.suggestedActions.map((item) => item.slug),
            ]),
          },
        ];
      })
  );
  for (const { row } of profiles.values()) {
    if (row.language.body.script === 'mixed') {
      candidates.push({
        status: 'CANDIDATE',
        kind: 'within-post',
        ka: row.id,
        en: row.id,
        confidence: row.language.englishMarker ? 'high' : 'medium',
        evidence: [
          row.language.englishMarker
            ? 'Both scripts plus an explicit English-section marker'
            : 'Substantial Georgian and Latin prose in the same body',
        ],
        note: 'Review the two source sections. No automatic splitting or translation.',
      });
    }
  }
  const values = [...profiles.values()];
  for (let index = 0; index < values.length; index++) {
    for (const other of values.slice(index + 1)) {
      const first = values[index];
      const roles = [first, other].find(
        (p) => p.row.language.body.script === 'latin'
      );
      if (!roles) continue;
      const en = roles;
      const ka = roles === first ? other : first;
      if (
        ka.row.language.body.georgianLetters +
          ka.row.language.title.georgianLetters <
        30
      )
        continue;
      const distance = dayDistance(ka.row.date, en.row.date);
      const media = shared(ka.media, en.media);
      const keywords = shared(ka.topics, en.topics);
      const tokens = shared(ka.tokens, en.tokens);
      const relatedSlug =
        ka.tokens.size &&
        en.tokens.size &&
        tokens.length >= 2 &&
        tokens.length / Math.min(ka.tokens.size, en.tokens.size) >= 0.6;
      const declared = declaredPairs.some(
        (p) => p.ka === ka.row.id && p.en === en.row.id
      );
      // A publication date alone, or a generic webinar word alone, is insufficient.
      if (
        !declared &&
        !(
          distance <= 1 &&
          (media.length || relatedSlug || keywords.length >= 2)
        )
      )
        continue;
      const evidence = [
        ...(Number.isFinite(distance)
          ? [`Publication dates ${distance} day(s) apart`]
          : []),
        ...(media.length
          ? [`${media.length} shared image/media identity(s)`]
          : []),
        ...(keywords.length
          ? [`Shared event/Action keywords: ${keywords.join(', ')}`]
          : []),
        ...(relatedSlug
          ? [`Related legacy slug tokens: ${tokens.join(', ')}`]
          : []),
        ...(declared ? ['Explicit REST translation relation'] : []),
      ];
      candidates.push({
        status: 'CANDIDATE',
        kind: 'cross-post',
        ka: ka.row.id,
        en: en.row.id,
        confidence:
          declared || (media.length && (relatedSlug || keywords.length >= 2))
            ? 'high'
            : 'medium',
        evidence,
        note: 'Clues can coincide for separate events or reused graphics. Luka must confirm; no records merged.',
      });
    }
  }
  return candidates;
}
