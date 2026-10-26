# Content editing contract

One UTF-8 JSON file per item lives in `src/content/<type>/<slug>.json`. Types are action, call, event, resource, news, story, publication, faq, person and page. Empty types contain only `.gitkeep`. Filenames and `slug` use stable lowercase ASCII words separated by hyphens.

Shared facts sit at the top level. Only text is nested inside `ka` and `en`. Each language has `title` and `body`; body is Markdown, rendered with raw HTML disabled. Actions also have translated `summary`, `who` and `how`. Events have translated `venue` and `agenda`. Core types require both languages. News and stories may omit `en` entirely. Their English listings then exclude the item; the Georgian language switch links to the English section index. Do not add a blank English object.

Example shape:

```json
{
  "slug": "example",
  "actions": ["cbhe"],
  "date": "2026-10-26T12:00:00+04:00",
  "ka": {"title": "[SAMPLE] სათაური", "body": "[SAMPLE] ტექსტი"},
  "en": {"title": "[SAMPLE] Title", "body": "[SAMPLE] Markdown text"}
}
```

## Relationships and dates

- Calls and stories use `action`; events, news, resources and FAQs use `actions`, a list of action slugs.
- Resources may also use `event`, an event slug. `source` is `official`, `neo` or `partner`. Always provide `url`; official items link to their original EU source.
- Calls have `year`, `opens`, `deadline`, `timeZone: "Europe/Brussels"` and the official call `url`. Enter local wall-clock times as `YYYY-MM-DDTHH:mm`, for example `"deadline": "2026-12-15T17:00"`. Never enter a UTC offset or Z. The build resolves the named zone using Temporal and adds the correct seasonal offset to rendered machine-readable dates. Status is computed at build time, never saved.
- Events have `date`, `end`, `timeZone`, `type`, `format`, `organiser` and `registration`. Upcoming includes ongoing events until their end. Use the same offset-free local format for `date` and `end`; `timeZone` is required. Samples use Asia/Tbilisi. Status is computed at build time.
- A nonexistent spring-forward time or an ambiguous fall-back time stops the build with an error identifying the time and zone. Choose a valid, unambiguous time instead; the build never silently shifts it or guesses which occurrence is intended. Invalid dates, unknown zones and editor-entered offsets are also rejected.
- For Call/Event CMS fields use plain text inputs with a `YYYY-MM-DDTHH:mm` format hint, not date widgets that serialise an offset or UTC. Keep `timeZone` as a separate named-zone field.
- News has a single shared `date`; stories and publications have a single shared `year`.
- No sample images or people are included. When image support is implemented, use a shared path with required `alt.ka` and `alt.en`, and Eleventy Image for responsive outputs. Do not add personal contact information to the public repository.

`lib/content.js` handles relationships, localisation and status. `src/_data/catalog.js` orders lists. `src/_data/views.js` declares routes. Templates are Nunjucks; bodies remain Markdown strings. The other seven page templates and full field validation remain later work, not a production content schema.

## Current call edition

`src/_data/site.js` defines `currentCallYear: 2026` explicitly. Update this setting when NEO changes call edition, not automatically at New Year. The calls page shows the selected edition first, even if empty, followed by all other available years as archives in descending order. Action pages use the same selected edition. The home deadline block remains chronological across editions. A future CMS settings screen can expose this value; neither CMS is connected yet. The 2025 CBHE sample demonstrates archival rendering.

## Both CMS candidates

No CMS has been selected, installed or connected. This layout avoids CMS-specific translation plugins and can use native object fields in both candidates:

- Decap: a folder collection with `folder: src/content/news`, `format: json`, `extension: json`, `identifier_field: slug`, `slug: '{{slug}}'`. Use string fields for shared facts, list fields for `actions`, and object fields named `ka` and `en` containing `title` (string) and `body` (markdown). Make the English object optional for News and Stories.
- Pages CMS: a collection with `path: src/content/news`, `type: collection`, `format: json`, and a filename based on `fields.slug`. Use string/date fields for shared facts and object fields named `ka` and `en` containing `title` (string) and `body` (rich-text, stored as Markdown). Make `en` optional for News and Stories.

Use the same pattern for the remaining types. Test creating and editing News and Events with each candidate before choosing one. Verify JSON round trips, optional translations, relationship fields and preservation of local wall-clock times and named time zones. These mappings are a compatibility design, not a claim that authenticated editor workflows have been tested.
