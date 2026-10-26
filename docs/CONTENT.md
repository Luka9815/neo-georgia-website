# Content editing contract

One UTF-8 JSON file per item lives in `src/content/<type>/<slug>.json`. Types are action, call, event, resource, news, story, publication, faq, person and page. Empty types contain only `.gitkeep`. Filenames and `slug` use stable lowercase ASCII words separated by hyphens.

Shared facts sit at the top level. Only text is nested inside `ka` and `en`. Each language has `title` and `body`; body is Markdown, rendered with raw HTML disabled. Actions also have translated `summary`, `who` and `how`. Events have translated `venue` and `agenda`. Core types require both languages. News and stories may omit `en` entirely. Their English listings then exclude the item; the Georgian language switch links to the English section index. Do not add a blank English object.

Example shape:

```json
{
  "slug": "example",
  "actions": ["cbhe"],
  "date": "2026-10-26",
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
- News has a single shared publication `date` in `YYYY-MM-DD` format, without a time or offset. Stories and publications have a single shared `year`. News samples were migrated from instant dates to calendar dates for CMS editing.
- No sample images or people are included. When image support is implemented, use a shared path with required `alt.ka` and `alt.en`, and Eleventy Image for responsive outputs. Do not add personal contact information to the public repository.

`lib/content.js` handles relationships, localisation and status. `src/_data/catalog.js` orders lists. `src/_data/views.js` declares routes. Each page type has a Nunjucks template in `src/pages/`, inheriting the shared `_includes/page.njk` wrapper; `_data/pageTypes.js` groups the central route list. Bodies remain Markdown strings. The other seven page templates and full field validation remain later work, not a production content schema.

## Current call edition

`src/_data/settings.json` defines `currentCallYear: 2026` and `siteLaunched: false`; `site.js` reads and validates them. Update this setting when NEO changes call edition, not automatically at New Year. The calls page shows the selected edition first, even if empty, followed by all other available years as archives in descending order. Action pages use the same selected edition. The home deadline block remains chronological across editions. The Pages CMS Settings entry exposes only currentCallYear. siteLaunched is not a CMS field and stays maintained in code; settings.content.merge preserves it when saving the year. The 2025 CBHE sample demonstrates archival rendering.

## Pages CMS configuration and validation

`.pages.yml` configures the hosted app at https://app.pagescms.org with GitHub sign-in. News and Events are JSON collections with filenames from `{fields.slug}.json`. Labels put Georgian first. Registration and translated agendas are optional for Events. Other fields are required except the whole English News object; its title and body are required once it has meaningful content. Empty optional English News objects are removed from the in-memory catalog so they cannot create empty English routes.

Both collections require slug, date, at least one existing action and Georgian title/body. Events additionally require end, timeZone, type, format, organiser and English title/body; both event languages also require venue. Registration and agenda are optional, and their empty blocks are hidden. A supplied registration link must use HTTPS. Slugs must match filenames. Published slugs should not be changed in the editor without a coordinated file rename.

The build validates files through loadContent before route generation. Errors identify the source file and field, including missing text, unknown action slugs, offsets, invalid calendar dates, unsupported event choices, DST gaps/overlaps and an end before the start. Required fields and allowed choices are checked in the CMS as well; the build is the final check. When adding a new Action, add its slug to both actions select lists in `.pages.yml` (News and Events); remove the options when removing an Action. A test compares its choices with the existing action slugs.

News uses a documented date field with `options.format: yyyy-MM-dd`. Event date/end use string fields and a strict pattern, not the date widget: the current widget passes through browser-local date-fns parsing, while text fields preserve the exact wall-clock string independently of the editor's browser zone. The build resolves only the chosen named time zone. This retains the earlier offset-free Event input rule.

Bodies use rich-text with `options.format: markdown` explicitly. Current CMS source sends `getMarkdown()` in that mode, its rich-text field passes that string through, and the JSON serializer writes it as a JSON string. It is not stored as HTML. `markdown-it` keeps `html: false`; tests check Markdown formatting and escaped script text. No HTML-rendering override was added. Rich-text media insertion is disabled until bilingual image alt fields and the responsive image pipeline exist.

The future media library stores files in `src/assets/uploads` and writes `/assets/uploads` paths without a hard-coded project prefix. Eleventy's HTML base plugin adds PATH_PREFIX in generated pages. A copied-site test verifies a Markdown image path under the project prefix. The upload folder is reserved for future image support, not permission to publish unprocessed images now.

The single-file Settings entry points to settings.json and exposes only currentCallYear (an integer from 2000 to 2100). `settings.content.merge: true` is necessary: the documented default rewrites schema-only keys and would remove siteLaunched. This preserves unmanaged keys in News/Events too. Repository writers can still edit files directly; CMS field visibility is not a security boundary.

See the Georgian staff guide in EDITING.md and the hosted sign-in/create/delete test in HANDOVER.md. Source/configuration verification and local JSON/render tests passed; authenticated hosted editing and deployment remain Luka's test after merge.

### Documentation checked on 2026-10-26

The live documentation host returned 403 in this environment. Read the current documentation repository via GitHub instead: [documentation source](https://github.com/pagescms/website/tree/3b7864da39c63f8aa336371b812cdd0db5c69516/docs/configuration). GitHub resolves this repository to hunvreus/pagescms-website. All configuration keys used were checked in the following current documentation pages:

- [Content collections/files and format](https://pagescms.org/docs/configuration/content/), [filename tokens/field visibility](https://pagescms.org/docs/configuration/content/filename/), and [common field keys, required and patterns](https://pagescms.org/docs/configuration/content/fields/).
- [Object](https://pagescms.org/docs/configuration/fields/object/), [string](https://pagescms.org/docs/configuration/fields/string/), [text](https://pagescms.org/docs/configuration/fields/text/), [date and its formatting/default](https://pagescms.org/docs/configuration/fields/date/), [select values/multiple/min](https://pagescms.org/docs/configuration/fields/select/), [number bounds](https://pagescms.org/docs/configuration/fields/number/) and [rich-text format/media](https://pagescms.org/docs/configuration/fields/rich-text/).
- [Media input/output](https://pagescms.org/docs/configuration/media/) and [settings.content.merge](https://pagescms.org/docs/configuration/settings/).

Also inspected the [current CMS implementation](https://github.com/pagescms/pagescms/tree/6f4e860a35d934406580287e7042e5e111e207a1): `lib/config-schema.ts` (including defaults), `fields/core/date`, `fields/core/rich-text`, `components/ui/editor/index.tsx`, `lib/serialization.ts` and the files API save route. These confirm local date conversion, Markdown emission, unchanged JSON string serialization and preservation of unmanaged fields with merge enabled. The source repository resolves to hunvreus/pagescms. No claim is made about the exact currently deployed hosted-app revision.

## Legacy URL redirects on GitHub Pages

`src/_data/redirects.json` is an empty list until the WordPress export supplies old URLs. Add objects such as `{"from": "/old-cbhe/", "to": "/ka/opportunities/cbhe/"}`. Store paths relative to this site, without PATH_PREFIX. The build generates a static HTML stub at each old path with a meta refresh, canonical to the new URL and a visible link. Prefix handling is automatic.

Sources must end in a slash or .html and use ASCII path segments. Duplicate paths and collisions with existing pages stop the build; targets must be existing content pages, not other redirects. Do not add query-string routes, external URLs or redirect chains. Non-ASCII WordPress URLs and other filename formats need a separate migration check before import. These stubs do not send HTTP 301 responses. Revisit hosting if true 301 redirects become essential. Netlify files have been removed and remain recoverable from git history.


## Language policy and migration scope

The language policy page uses a shared policyKey reference to the same translation string as the footer. English prevails in case of discrepancy; Georgian remains the primary interface. Initial old-site News migration is limited to the last twelve months before the agreed export/migration date, which must be recorded with the import. This does not expire archived news automatically. The final domain decision is deferred until the site is built; erasmus.org.ge is likely, while the GitHub Pages URL remains configured.
