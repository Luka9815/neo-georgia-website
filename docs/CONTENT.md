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
- No sample images are published; sample people have no names, photos or contact details. Optional News images now use the shared path and language-specific alt contract below, with Eleventy Image responsive outputs. Do not add personal contact information to the public repository.

`lib/content.js` handles relationships, localisation and status. `src/_data/catalog.js` orders lists. `src/_data/views.js` declares routes. Each page type has a Nunjucks template in `src/pages/`, inheriting the shared `_includes/page.njk` wrapper; `_data/pageTypes.js` groups the central route list. Bodies remain Markdown strings. Session 10 adds Publications, FAQ, People and Contact; remaining templates and full field validation remain later work, not a production content schema.

## Current call edition

`src/_data/settings.json` defines `currentCallYear: 2026` and `siteLaunched: false`; `site.js` reads and validates them. Update this setting when NEO changes call edition, not automatically at New Year. The calls page shows the selected edition first, even if empty, followed by all other available years as archives in descending order. Action pages use the same selected edition. The home deadline block remains chronological across editions. The Pages CMS Settings entry exposes currentCallYear and optional logoPath. siteLaunched is not a CMS field and stays maintained in code; settings.content.merge preserves it when saving the year. The 2025 CBHE sample demonstrates archival rendering.

## Pages CMS configuration and validation

`.pages.yml` configures the hosted app at https://app.pagescms.org with GitHub sign-in. News and Events are JSON collections with filenames from `{fields.slug}.json`. Labels put Georgian first. Registration and translated agendas are optional for Events. Other fields are required except the whole English News object; its title and body are required once it has meaningful content. Empty optional English News objects are removed from the in-memory catalog so they cannot create empty English routes.

Both collections require slug, date and Georgian title/body. Actions are optional for News (general news such as Europe Day or TAM events may have none) and required for Events; any listed slug must be an existing action. Events additionally require end, timeZone, type, format, organiser and English title/body; both event languages also require venue. Registration and agenda are optional, and their empty blocks are hidden. A supplied registration link must use HTTPS. Slugs must match filenames. Published slugs should not be changed in the editor without a coordinated file rename.

The build validates files through loadContent before route generation. Errors identify the source file and field, including missing text, unknown action slugs, offsets, invalid calendar dates, unsupported event choices, DST gaps/overlaps and an end before the start. Required fields and allowed choices are checked in the CMS as well; the build is the final check. When adding a new Action, add its slug to both actions select lists in `.pages.yml` (News and Events); remove the options when removing an Action. A test compares its choices with the existing action slugs.

News uses a documented date field with `options.format: yyyy-MM-dd`. Event date/end use string fields and a strict pattern, not the date widget: the current widget passes through browser-local date-fns parsing, while text fields preserve the exact wall-clock string independently of the editor's browser zone. The build resolves only the chosen named time zone. This retains the earlier offset-free Event input rule.

Bodies use rich-text with `options.format: markdown` explicitly. Current CMS source sends `getMarkdown()` in that mode, its rich-text field passes that string through, and the JSON serializer writes it as a JSON string. It is not stored as HTML. `markdown-it` keeps `html: false`; tests check Markdown formatting and escaped script text. No HTML-rendering override was added. Inline rich-text media insertion stays disabled; use the separately validated optional News image field instead.

The News media library stores files in `src/assets/uploads` and writes `/assets/uploads` paths without a hard-coded project prefix. Eleventy's HTML base plugin adds PATH_PREFIX in generated pages. A copied-site test verifies a Markdown image path under the project prefix. The upload folder supports optional News images, not unprocessed body image insertion. Optional News images now use the validated image field described below.

The single-file Settings entry points to settings.json and exposes currentCallYear (an integer from 2000 to 2100) and optional logoPath. `settings.content.merge: true` is necessary: the documented default rewrites schema-only keys and would remove siteLaunched. This preserves unmanaged keys in News/Events too. Repository writers can still edit files directly; CMS field visibility is not a security boundary.

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


## Header logo setting

logoPath in settings.json defaults to an empty string, which keeps the text wordmark. A non-empty value must point to an existing local image under /assets/, without PATH_PREFIX. Rendering adds the prefix and uses each language's logoAlt text. The image is displayed with object-fit:contain inside a reserved 240x80 box, so its source aspect ratio is preserved. Only use a newly approved logo supplied for this project; no old-site logo has been downloaded or used. siteLaunched remains code-only and CMS merge mode preserves it.


## Action drafts and source evidence

Nine Action records use programmeYear, sectors and officialLinks (objects with url and translated labelKey). Each ka/en object contains title, summary, who and how; all four remain [DRAFT] until editorial review. Cards render summary directly, with no duplicated body. The comment field records the official 2026 Guide edition, PDF URL, supporting pages/clauses and verified action URLs. See ACTION-REVIEW.md before changing eligibility.

The shared Georgia authority exclusion is in src/_data/georgiaEligibility.json and appears on every Action page. Scope eligibility to the relevant strand, especially Erasmus Mundus and Jean Monnet. Do not infer coordinator eligibility from partner eligibility. Keep icm, cbhe and jean-monnet stable for existing sample relationships. A multi-sector action remains one JSON record; Virtual Exchanges appears in both higher education and youth groups. Both .pages.yml actions select lists contain all nine slugs and must be updated whenever an Action is added or removed.

The official Georgian and English originals, checksums, archive sources and dates are documented in src/assets/eu/README.md. Session 17 explicitly supersedes the earlier KA rejection: /ka/ uses the Commission Georgian artwork with alt “ევროკავშირი საქართველოსთვის”; /en/ uses English. Both carry the funding statement, so no adjacent repetition is shown. Keep originals unchanged; the existing image library sizes complete PNG derivatives with PATH_PREFIX, aspect ratio, whitespace and a white box preserved. The supplied Georgian disclaimer is unchanged.


## Manual WordPress migration review

The importer writes only below migration/review. It never publishes, changes src/content or changes the live redirect map. It downloads one selected review image per source when an eligible variant exists; PDFs and all other attachments remain listed only. Run it manually from the repository root on Node 24 after npm ci:

```sh
node --use-env-proxy scripts/import-wp.js
```

The proxy flag lets Node use standard proxy settings and also works without a proxy. Public access to https://erasmus.org.ge/wp-json/wp/v2/ and its image host is required. No WordPress login, token or external account is needed. The importer refuses CI and is not called by builds or npm test. Converter tests use saved fixtures and forbid network access.

### Window and API reads

The default window ends at one captured UTC run instant and starts twelve calendar months earlier, inclusive at the start and exclusive at the end. run.json records exact instants, run date, request outcomes and completeness. To freeze the window, pass an explicit UTC instant:

```sh
node --use-env-proxy scripts/import-wp.js --run-at 2026-10-26T16:46:45.58Z
```

This freezes the window, not the old site's content. The script still reads the live API. WordPress local-date filtering differs between installations, so requests include a two-day cushion and conversion filters date_gmt to the exact window. The News date keeps the source's local publication day. Missing GMT dates are failures, never assigned an invented time zone.

The client reads 100 records per page, serially, with at least 1.5 seconds between requests, bounded server-error retries and a 500-page safety limit per collection. The same limiter covers image downloads. It fetches posts, ?lang=ka and ?lang=en variants, categories, tags, media metadata and published top-level pages (parent=0). Explicit translation IDs can be fetched to inspect a related source, but they do not authorise merging it.

### Generated files and reruns

Output directories have symlink checks to prevent another destination. Reruns replace generated reports, News JSON and review images. Archive editorial changes before regenerating. Existing decisions.csv is preserved; a rerun writes a fresh decisions.template.csv for comparison, including changed slugs or suggestions. Human decisions are not silently rewritten or applied. The ignored .cache/source.json contains local raw recovery responses and must not be committed because public HTML may contain personal email addresses.

- REPORT.md: the quick keep/drop table comes first, one row per draft with date, cleaned title, slug, language, Event candidate, Actions, selected image and pair candidates. Detailed sections preserve every source, warnings, duplicate groups, failures and page suggestions.
- decisions.csv: slug, keep, type, actions, pair_with, notes. Set keep to y/n and type to news/event; Actions use semicolon-separated slugs. Type/Actions initially contain suggestions. Keep and pair_with start blank. These decisions do not publish, merge or alter future runs automatically.
- run.json: exact window/times, request outcomes, collection completeness, language findings, counts and image download totals. Failed collections or image downloads exit nonzero and do not imply an empty archive.
- news/<slug>.json: one review draft per source post. Clear Georgian title/body text is under ka. Clear Latin-script English-prose text with a Latin title is under en, explicitly marked CANDIDATE. Mixed bodies or mismatched title/body scripts stay under sourceText, with no fabricated language object. All variants retain shared date/actions, legacy provenance and migration evidence. These review records can intentionally fail the production News contract.
- inventory.json: every source, title/body script counts/proportions, language slot, candidate relationships, selected image and warnings. It also records duplicate title/body groups and unpaired English-body sources. No source is merged or dropped as a duplicate.
- images/<slug>.<ext>: at most one selected image per draft. The draft image object records its review-relative path, source URL, actual byte size, dimensions, selection reason and alt.ka/alt.en set to [ALT NEEDED].
- attachments.json: all image/PDF source URLs, API byte sizes/alt text and post usage. It includes variants and metadata even when only one image is selected for download.
- redirects.draft.json: old post URLs and proposed Georgian News targets only where a clear ka draft exists, plus all top-level page section suggestions. Unresolved language or section targets stay null. This file is not connected to src/_data/redirects.json; Georgian old paths and hosting compatibility require separate review.

### Language and candidate pairs

Detect title and body independently from visible text, excluding URL letters. A substantial mix of Georgian and Latin prose (at least 30 letters of each, each at least 15% of those two scripts) is labelled mixed. Script proportions do not prove a language; common English words provide an English-candidate clue. A Georgian heading no longer causes an English body to be stored in ka. Raw source text is preserved for review without translation or automatic splitting.

REPORT lists CANDIDATE pairs with confidence and evidence. Within-post candidates flag mixed sections, especially explicit For English Scroll Down or ENG markers. Cross-post candidates use complementary source scripts and same/adjacent publication dates plus shared media, sufficiently related legacy slugs or multiple event/Action keywords. Dates or a generic webinar word alone are insufficient. Even an explicit REST translation relation is only a candidate in this review pass. Reused graphics and concurrent events can produce false matches, so Luka must read both sources. English-body sources without a Georgian candidate are listed separately.

### Cleanup, slugs and suggestions

Cleanup removes leading title emoji while retaining numerical prefixes and body emoji. It removes only a leading standalone {DD.MM.YYYY} theme line, empty standalone info markers and repeated blank lines; meaningful dates and info markers with text remain. Turndown/Cheerio retain links and lists, remove style/script/widget debris, list omitted media, warn about simplified tables, remove tracking parameters and redact email addresses for this public repository. markdown-it still rejects raw HTML.

Prefer a clean lowercase ASCII WordPress slug after underscore-to-hyphen conversion. Preserve clean published slugs even when long. Otherwise romanise the title with the Georgian national table, remove ejective apostrophes for the site's ASCII contract and truncate at a word boundary within 60 characters. Only a single overlong token needs a hard cut. Reserve existing live News slugs and add deterministic collision suffixes. Keep the original slug under legacy regardless of the proposal.

Action matches use the nine existing slugs and evidence from categories, tags, titles and body. No match leaves actions:[] with a blocking warning. An event word plus a date creates only a type candidate, never an Event record. Editors must approve language, text, classification, dates, slugs and Action choices before any later promotion.

### Selected review images

Prefer the WordPress featured image, then an attached image, then the first eligible inline image. For that image choose its largest known variant no wider than 1024 px, preferring JPG/PNG/WebP and using GIF only as a fallback. HEIC, unknown dimensions and unsupported/oversized variants are skipped. Only HTTPS image URLs on the old-site host are fetched; external icons are not article-image substitutes. Downloaded bytes are format/dimension checked, bounded to 10 MiB per response and saved without recompression. A repeated source URL is fetched once per run but receives a separate per-draft filename. The report records both total saved-file bytes and actual network-download bytes.

Both image alt fields remain [ALT NEEDED]. Review rights and write proper Georgian/English alternatives before any separately authorised production image workflow. No image is added to src/assets, and no review image appears in the built site. Missing images and failed downloads remain explicit in the report; no substitute is invented.

### Earlier baseline

Session 7 reviewed 76 posts and wrote 72 drafts under ka, while four English-prose sources remained only in inventory. The session 8 pass corrects that classification, preserves every source in a separate draft and identifies mixed in-post English sections and pairing candidates. Current results and the exact regenerated window are in REPORT.md and HANDOVER.

## Session 10 supporting templates

Publications live at /ka/resources/publications/ and /en/resources/publications/. Shared fields: year (2014 to 2100), type (neo-report, here-publication, brochure, statistics), language (ka, en, ka/en), and file (existing /assets/publications/<slug>.pdf or a clearly labelled sample .txt). Both text objects contain title/body. Two sample text downloads demonstrate the archive without pretending to be approved publications. Lists are newest first. All files remain visible without JavaScript; year/type controls appear only after the local enhancement is ready. Empty results have a translated live count and a reset control.

FAQ uses the existing title/body, topic and actions contract. Topics are applications and mobility, with labels in each language file. When adding a topic, update validate-supporting.js and both faqTopics dictionaries. The grouped FAQ is under Resources; Action pages automatically select the same records by actions. Three [SAMPLE] FAQs replace example.json.

People use group (neo or here), translated title (name), role and body. Team lives at /about/team/ and HEREs at /here/ in both languages. Sample names are fictional and use the national Georgian romanisation, retaining ejective apostrophes in names. No photos, personal emails or telephone numbers are stored. Approved contact/photo support remains future work.

Contact lives under /about/contact/ and is linked from About and the footer. Address, office hours and email placeholders come from ka.json/en.json. example.org is reserved for examples. There is no form, map embed or third-party asset. Publications and FAQ are linked from Resources; Team, HEREs and Contact are linked from About. The seven top-level destinations are unchanged.

loadContent validates publication, FAQ and person text parity, their classifications, FAQ Action references and publication file existence before rendering. These three types remain JSON-edited; no new hosted CMS collections were added.


## Optional News image (session 13)

News may omit image entirely. A supplied image uses a single shared local source path and language-specific alt text:

```json
"image": {
  "src": "/assets/uploads/approved-news-photo.jpg",
  "alt": {
    "ka": "[SAMPLE] ქართული აღწერა.",
    "en": "[SAMPLE] English description."
  }
}
```

The path above illustrates the contract; that file is not supplied. Upload an approved local JPG/JPEG, PNG, WebP or AVIF below src/assets/uploads. ASCII filenames may contain letters, digits, underscores and hyphens, including subfolders. Do not include PATH_PREFIX. External URLs, traversal, missing files, unsupported extensions and symlinks outside uploads are rejected. Corrupt or undecodable images stop rendering. Alt text must be non-empty in Georgian, and also in English when the News has an English version. Any supplied [ALT NEEDED] is rejected. Empty optional CMS objects mean no image; partial image objects are validated.

Pages CMS has an optional სურათი (Image) object with a media picker and alt fields. English alt is conditionally required by the build when English News text is present; the CMS marks it optional because Georgian-only News is valid. Rich-text media insertion stays disabled. Keep image path/alt separate from body Markdown.

Only marked News components pass through @11ty/eleventy-img 7.1.1. It generates AVIF and WebP plus JPEG fallback for JPEG sources, otherwise PNG to retain transparency. Width candidates are 320, 640, 960 and 1280 px without enlarging smaller inputs. Generated files are written under the active output directory's assets/generated/news with hash filenames. Both cards and articles have sizes/srcset, intrinsic dimensions and async decoding. Article lead images load eagerly with high fetch priority; card images use lazy loading. CSS keeps aspect ratio. EU emblems use a separate marked whole-image PNG sizing transform with the same existing library; other unmarked images are untouched. Original uploads remain in the static asset tree.

Only neo-dissemination-event-2025.jpg is attached, with Luka's approved Georgian/English alternatives. The three text-heavy/redundant graphics are omitted and the Europe Day photograph is permanently omitted. No other review image or [ALT NEEDED] is copied into uploads. The synthetic image fixture remains isolated in temporary sites. NEWS-IMAGES.md records publication status.


## Sample News fixtures and archive formatting (session 17)

update-1, update-2 and update-3 live in test/fixtures/news, outside the production catalogue. Tests explicitly copy them into temporary sites for CMS, optional-English fallback and responsive-image coverage. No new draft/publishing field or title-prefix filter was introduced: every record in src/content/news is a real promoted post, including all five bilingual legacy records. Events remain in production pending the fixture-first cleanup in HANDOVER.

Cards derive up to 30 words from the first source prose paragraph and mark a longer excerpt with an ellipsis. Details retain the source fields and publication dates. The News renderer alone repairs malformed emphasis boundaries, standalone bold section headings, duplicate initial titles and the first project list marker; the stored body is not rewritten. See the visual review and editorial questions in docs/review/session-17.


## Event calendar exports

Static month tables and bilingual .ics downloads are built from the same Event data. Keep the slug stable once published: it defines the UID in both languages regardless of hosting. A download is a snapshot; editing or removing an Event requires a clean rebuild and does not recall earlier downloads. The upcoming feed follows the existing status through the Event end, including ongoing Events. Temporal rejects ambiguous/nonexistent wall times in the named timeZone. UTC ICS timestamps preserve those resolved instants; calendar applications display them in the user's zone.


## Historical News context notes

A News item may carry code-maintained historicalNote with a YYYY-MM-DD date and non-empty ka/en text. It renders separately above the unchanged source body and links to current Action pages. It is not a Pages CMS text field; the existing settings.content.merge=true preserves unmanaged keys on saves. Changes to the dated note require editorial review.


## Projects with Georgian participation (Session 19)

The supplied migration/source/erasmus-projects-georgia-2026-10-28.json is the source snapshot, with provenance/coverage in its README and the official XLS sample as column evidence. It is never copied into _site. lib/projects.js validates it at build start and projects only approved public facts; no source descriptions, results, contacts, beneficiary sites, images or grant amounts reach templates. The build reads local files only.

Original titles/names stay unchanged. Titles default to English; a conservative script check labels predominantly Georgian, Cyrillic (und-Cyrl), Armenian, Greek or Arabic titles accordingly. This is not a translation or a full Latin-language detector. Source timestamps encode Brussels midnight and are converted to calendar days in Europe/Brussels. Empty/null source cities are allowed and omitted. Preserve finalized/ongoing/terminated/unknown source status, displaying finalized as completed rather than recalculating status from dates.

Action mapping is exact and explicit in src/_data/projectActionMap.json. New labels stop the build until reviewed; do not infer Action eligibility from titles. PROJECT-ACTION-MAP.md lists all 39 source labels and mappings for review.

Public catalogue routes are the bilingual projects index and one table page per call year; rows link to the official project card. The bilingual statistics page and homepage figures use the same projected records. Count named organisations by source identifier, and named-institution participations by project/identifier pair. Exclude role country-mobility from institution counts and report those projects separately. Keep source names/roles intact, with no alias merging or manual additions.

Every catalogue/statistics page identifies the source, beneficiary submissions, NEO responsibility limit, snapshot day and separate build timestamp. The 2026/later years are incomplete and ongoing records may change. Source terms were checked 2026-10-28 at https://erasmus-plus.ec.europa.eu/projects/terms-use; do not infer blanket licensing for beneficiary content. Luka's approved factual field subset and attribution apply; no excluded content is reused.

Per-year tables remain outside Pagefind after size measurement; projects overview/statistics pages are indexed. All pages and year/Action navigation work without JavaScript. Native fragment links progressively filter Action/sector groups with CSS :has/:target; All projects resets the view. Older CSS engines still show the complete grouped list and honour anchors. CMS, image and redirect isolated build tests use a small synthetic project snapshot, not live fetches or a copy of the full source.

### Manual refresh, verified request (PR #19 review)

Luka supplied the exact request on 2026-10-28; migration/source/README.md records its endpoint, headers, body and response envelope. Use Node 24 from the repository root, outside CI:

```
NODE_USE_ENV_PROXY=1 node scripts/fetch-projects.js
```

No request template is needed. NODE_USE_ENV_PROXY makes Node 24 honour an inherited proxy; preserve CA trust. The command is not referenced by build/start/test scripts or the workflow, and importing its functions does not start the CLI. No live fetch was run in this review, as instructed.

The POST body uses from offsets 0/100/200, size 100, a string project.projectCallYear, index eplus2021, GE coordinator_or_partner organisation scope, empty keyword/sort/coordinator/partner, matchAllCountries=false and withAggregations=false. Response records are projectDocuments and total is an integer. Fetch each call year from 2014 through the current Tbilisi calendar year, with 500 ms between requests. Stop a year at from >= total or an empty page; require retrieved count == total for every year or abort the complete run. Short pages never change the 100-record offset increment. Totals changing mid-pagination, duplicate references, invalid data and unexpected/ambiguous organisation arrays also abort.

The full organisation array is recognised by the organisationName/organisationCountry/organisationRole schema and must be unambiguous; no response property name is invented. Snapshot validation runs before a candidate is written. Tests inject small projectDocuments responses and a fake fetch while global live fetch throws. They check the exact verified body and headers, dynamic year range, offsets/spacing, empty/short pages, per-year completeness, schema errors, slimming and differences.

Raw pages go to the already ignored migration/source/erasmus-projects-georgia-<Tbilisi-run-day>/ directory. Success writes snapshot.json and report.json there, with per-year totals and added/removed/changed references against the approved source. Failure records an incomplete report and never publishes a partial candidate. Existing run directories are not overwritten.

The candidate keeps the supplied slim audit schema, including its source grant field, but drops long descriptions/results/contacts and retains only coordinator/GE organisations plus aggregate count/countries. The separate public projection discards the audit grant field; it is never shown or summed. No approved source or public content is replaced automatically.

Review candidate differences, updated source terms, new labels and institution-versus-mobility-country counts before a separate promotion PR. If choosing a new dated source filename, update PROJECT_SOURCE, the source watch target and fixture-copy/test references. Refresh the source regression totals and mapping review deliberately, then rebuild/test/check both layouts. Daily builds reread the approved local snapshot only.


### Session 20 call dates

Call.deadline remains a required offset-free wall time with timeZone Europe/Brussels. Call.opens is optional: store an exact opening time only when verified. Without opens, status is open through the deadline and closed afterwards; no upcoming opening date is inferred. Real 2026 records carry sourceChecked and link to the exact Guide section; youth records also retain additionalSources for youth-worker mobility. Student application dates are set by their institution or consortium and must not be inferred from institutional grant deadlines.


### External Publications

Publication records may use an HTTPS url and required publisher instead of file, never both. The release candidate links to official external publications only; local publication files remain supported for isolated historical fixtures. year is the publication year, which can differ from the reporting year in the title. sourceChecked records link verification. Types include report. The archive note appears while fewer than three items are present.
