import { redact } from './convert.js';

const text = (value) =>
  redact(value ?? 'not provided')
    .replace(/\u2014/g, ' - ')
    .replace(/\s+/g, ' ')
    .replace(/[\\`*_[\]<>|#]/g, '\\$&');

export function attachmentInventory(items) {
  const byUrl = new Map();
  for (const row of items) {
    for (const asset of row.attachments) {
      if (!byUrl.has(asset.url)) byUrl.set(asset.url, { ...asset, usedBy: [] });
      const target = byUrl.get(asset.url);
      target.usedBy = [...new Set([...target.usedBy, row.id])];
    }
  }
  return [...byUrl.values()];
}

export function renderDecisions(inventory) {
  const cell = (value) => '"' + String(value ?? '').replaceAll('"', '""') + '"';
  const rows = inventory.items
    .filter((row) => row.slug)
    .map((row) => [
      row.slug,
      '',
      row.typeCandidate.type,
      row.suggestedActions.map((action) => action.slug).join(';'),
      '',
      '',
    ]);
  return (
    'slug,keep,type,actions,pair_with,notes\n' +
    rows.map((row) => row.map(cell).join(',')).join('\n') +
    '\n'
  );
}

function summaryTable(items) {
  return [
    '## Quick keep/drop review',
    '',
    'Edit [decisions.csv](decisions.csv): keep uses y/n, type uses news/event, actions uses semicolon-separated slugs. Pair candidates are proposals; pair_with is blank until Luka confirms. Image alt text still needs review.',
    '',
    '| Date | Clean title | Proposed slug | Language | Event candidate | Suggested Actions | Image | Pair candidate |',
    '|---|---|---|---|---|---|---|---|',
    ...items
      .filter((row) => row.slug)
      .sort((a, b) => b.date.localeCompare(a.date) || a.id - b.id)
      .map((row) => {
        const candidates = row.pairCandidates
          .map((pair) =>
            pair.kind === 'within-post'
              ? `within-post (${pair.confidence})`
              : `WP ${pair.ka === row.id ? pair.en : pair.ka} (${pair.confidence})`
          )
          .join('; ');
        return `| ${row.date} | ${text(row.title)} | [${row.slug}](news/${row.slug}.json) | ${text(row.language.label)} | ${row.typeCandidate.type === 'event' ? 'yes' : 'no'} | ${row.suggestedActions.map((action) => action.slug).join(', ') || 'needs choice'} | ${row.image?.status === 'downloaded' ? `[yes](${row.image.path})` : 'no'} | ${candidates ? 'CANDIDATE ' + candidates : 'none'} |`;
      }),
    '',
  ];
}

export function renderReport(run, inventory, redirects) {
  const items = inventory.items;
  const assets = attachmentInventory(items);
  const lines = [
    '# WordPress News migration: review only',
    '',
    'Luka: these are proposals for review. Nothing has been published or copied into src/content/. Do not copy the files into the live content folder before checking language, classification, links, privacy and Actions.',
    '',
    ...summaryTable(items),
    ...(run.reviewNotes ? [run.reviewNotes, ''] : []),
    `Run date (UTC): ${run.runDate}. Started: ${run.startedAt}. Finished: ${run.finishedAt}.`,
    '',
    `Exact publication window: **${run.window.startInclusive} inclusive** to **${run.window.endExclusive} exclusive**. Twelve calendar months, not 365 days. The API query has a two-day cushion on each end for WordPress time-zone differences; only date_gmt inside the exact window is converted. The News date keeps the original WordPress local publication day.`,
    '',
    run.runAtOverride
      ? `The window end was explicitly supplied with --run-at: ${run.runAtOverride}.`
      : 'The window end was captured once when this manual run started.',
    '',
    '## Collection status',
    '',
    run.failures.length
      ? '**INCOMPLETE: one or more API collections failed. Zero retrieved records does not mean the old site has no posts. A successful rerun is needed before a migration can be approved.**'
      : 'All requested API collections completed. Conversion warnings still require review.',
    '',
    '| Collection | Records received | Complete | Expected API total |',
    '|---|---:|---|---:|',
    ...Object.entries(run.collections).map(
      ([name, value]) =>
        `| ${name} | ${value.count} | ${value.complete ? 'yes' : 'no'} | ${value.expectedTotal ?? 'unknown'} |`
    ),
    '',
    '## Counts from this run',
    '',
    `- Sources inside the window, plus sources whose date could not be verified: ${items.length}.`,
    `- News-shaped JSON files: ${run.counts.convertedNews}.`,
    `- Drafts stored under en (CANDIDATE): ${run.counts.withEnglish}.`,
    `- Likely Event sources: ${run.counts.eventCandidates}. These remain News-shaped candidates.`,
    `- Failed conversions: ${run.counts.failedConversions}.`,
    `- Unpaired English or uncertain language sources: ${items.filter((row) => row.language.needsReview).length}.`,
    `- Unique image/PDF URLs: ${assets.length}. Other attachments remain metadata only.`,
    `- Selected image files: ${run.images?.files || 0}; total saved size: ${run.images?.totalFileBytes || 0} bytes; total downloaded over the network: ${run.images?.totalDownloadBytes || 0} bytes (reused URLs fetched once).`,
    `- Duplicate title/body groups: ${inventory.duplicates.length}.`,
    '',
    '## Language finding',
    '',
    text(run.languages.conclusion),
    '',
    `Explicit English language fields on post IDs: ${run.languages.explicitEnglishIds.join(', ') || 'none observed'}.`,
    '',
    `Translation fields on post IDs: ${run.languages.translationFieldsOnIds.join(', ') || 'none observed'}.`,
    '',
    `The ?lang=en query returned ${run.languages.englishQuery.count} records; complete: ${run.languages.englishQuery.complete ? 'yes' : 'no'}. ${text(run.languages.englishQuery.note)}`,
    '',
    `Distinct ?lang=en IDs: ${run.languages.englishQuery.distinctIds.join(', ') || 'none observed'}.`,
    '',
    `Sources without Georgian text or explicit language metadata (possible standalone English): ${run.languages.unclassifiedIds.join(', ') || 'none observed'}. They are listed individually below, not paired by guesswork.`,
    '',
    'Explicit REST relations and heuristic clues are reported as CANDIDATE pairs only. Similar dates or a generic event word alone are insufficient; even strong media/topic/slug clues require manual confirmation. No translation was generated. Script-based English fields are unapproved candidates; mixed or mismatched title/body text stays under sourceText. All pairing clues, including explicit relations, require manual confirmation.',
    '',
    ...run.languages.pairs.map(
      (pair) =>
        `- Georgian source ${pair.ka} → English source ${pair.en}: ${text(pair.evidence)}.`
    ),
    ...run.languages.warnings.map(
      (warning) => `- Language warning: ${text(warning)}`
    ),
    '',
    '## CANDIDATE language pairs, not merged',
    '',
    ...(inventory.pairCandidates || []).flatMap((pair) => [
      `- **CANDIDATE** ${pair.kind}: WP ${pair.ka} ↔ WP ${pair.en}. Confidence: ${pair.confidence}. ${text(pair.evidence.join('; '))}. ${text(pair.note)}`,
    ]),
    '',
    '## English-only body sources without a Georgian candidate',
    '',
    ...(inventory.englishWithoutCandidate || []).map(
      (id) =>
        `- WP ${id}: ${text(items.find((row) => row.id === id)?.title)}. Review the source language/title; no Georgian translation created.`
    ),
    '',
    '## Every item',
    '',
  ];
  if (!items.length)
    lines.push(
      'No items were available for review in this run. See collection failures below.',
      ''
    );
  for (const row of items) {
    lines.push(
      `### WP ${row.id}: ${text(row.title || '(empty title)')}`,
      '',
      `- Published: ${text(row.date)}. Status: ${row.status}.`,
      `- Language: ${text(row.language.label)}. Title: ${row.language.title.script}; body: ${row.language.body.script} (${Math.round(row.language.body.latinShare * 100)}% Latin letters excluding URLs). Storage: ${row.language.slot}.`,
      `- Old URL: ${row.oldUrl || 'missing/invalid'}`,
      `- Old WordPress slug: ${text(row.oldSlug)}`,
      `- Proposed slug: ${row.slug || 'none; see warning/status'}`,
      `- JSON: ${row.slug ? `[news/${row.slug}.json](news/${row.slug}.json)` : 'not generated'}`,
      `- Suggested Actions: ${row.suggestedActions?.map((item) => item.slug).join(', ') || 'none; an editor must choose before publication'}.`,
      `- Type candidate: ${row.typeCandidate?.type || 'not assessed'}. Evidence: ${text(row.typeCandidate?.evidence.join('; ') || 'none')}.`,
      '- Suggestion evidence:'
    );
    for (const suggestion of row.suggestedActions || []) {
      for (const evidence of suggestion.evidence)
        lines.push(
          `  - ${suggestion.slug}: ${evidence.source}, ${text(evidence.match)}.`
        );
    }
    lines.push(
      `- Selected image: ${row.image?.status === 'downloaded' ? `[${row.image.path}](${row.image.path}), ${row.image.sizeBytes} bytes, ${row.image.width} × ${row.image.height} px. Source: ${row.image.sourceUrl}. Both alt fields: [ALT NEEDED].` : text(row.image?.reason || 'none selected')}`
    );
    lines.push('- Other attachments (listed only):');
    if (!row.attachments.length)
      lines.push(
        '  - None observed in HTML, featured media or media-parent metadata.'
      );
    for (const asset of row.attachments) {
      lines.push(
        `  - ${asset.type}: ${asset.url}`,
        `    Size: ${asset.sizeBytes == null ? 'not supplied by API' : `${asset.sizeBytes} bytes`}; alt: ${text(asset.alt || 'not supplied')}; used by WP ${row.id}; ${text(asset.uses.map((use) => `${use.language}/${use.relationship}`).join(', '))}.`
      );
    }
    lines.push('- Conversion warnings:');
    for (const warning of row.warnings.length
      ? row.warnings
      : ['No automatic warning; editorial review is still required.'])
      lines.push(`  - ${text(warning)}`);
    lines.push('');
  }
  lines.push(
    '## Duplicates',
    '',
    'No items are silently dropped or merged.',
    ''
  );
  if (!inventory.duplicates.length)
    lines.push(
      'No exact title/body duplicate group found among converted records. This is inconclusive if collection failed.',
      ''
    );
  for (const duplicate of inventory.duplicates)
    lines.push(
      `- Same normalised ${duplicate.field}: WP ${duplicate.postIds.join(', ')}.`
    );
  lines.push('', '## Failures', '');
  if (!run.failures.length && !run.counts.failedConversions)
    lines.push(
      'No collection or conversion failure recorded. Review warnings above.'
    );
  for (const failure of run.failures)
    lines.push(`- ${text(failure.collection)}: ${text(failure.message)}`);
  for (const row of items.filter((item) => item.status === 'failed'))
    lines.push(`- Conversion WP ${row.id}: ${text(row.warnings.join('; '))}`);
  lines.push(
    '',
    '## Old top-level pages and proposed sections',
    '',
    'These are section suggestions from SITE-PLAN, not live redirect rules. Unmatched pages have no target until Luka reviews them.',
    ''
  );
  if (!redirects?.pages.complete)
    lines.push(
      'The top-level page list is incomplete; see the failure details.',
      ''
    );
  for (const page of redirects?.pages.items || []) {
    lines.push(
      `- WP ${page.wpId}: ${text(page.title)}. ${page.from || 'missing URL'} → ${page.suggestedTargetSection || 'no target yet'}. ${text(page.reason)}.`
    );
  }
  lines.push(
    '',
    '## Luka’s review checklist',
    '',
    '1. Resolve failed collections first and rerun the manual importer. Archive any review notes before regenerating generated files.',
    '2. Read each title and body against its old URL. Check omitted embeds/tables, email redactions and links. Confirm proposed slugs, duplicate handling and any real English pair.',
    '3. Confirm each suggested Action. An empty actions list is intentional when there is no evidence and blocks publication. Decide whether each Event candidate belongs in News or should later become an Event with verified dates, zone and venue.',
    '4. Review the attachment inventory, rights, sizes and alt text. Only the selected review image was downloaded; all other attachments are listed only. Replace both [ALT NEEDED] fields and review rights before any later image/document promotion.',
    '5. Review redirects.draft.json separately. It is a proposal, not a live redirect configuration. No file is promoted automatically.',
    '',
    'Machine-readable details: run.json (window, requests and failures), inventory.json (every item), attachments.json (shared asset usage). Raw recovery responses are ignored in .cache/ and must not be committed.',
    ''
  );
  return lines.join('\n');
}
