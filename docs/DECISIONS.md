# Decisions log

Dated, newest at the bottom. Never delete or silently reverse an entry: add a new entry that supersedes it and say which one.

Format: `## YYYY-MM-DD: title`, then the decision and a short reason.

## 2026-10-24: Rebuild from scratch, not migrate the WordPress site
The current erasmus.org.ge (WordPress/Elementor) is poorly structured and hard to maintain. The new site is built from scratch; only content is migrated, through a structured export. In grant reporting this is presented as the establishment and further development of the NEO website (WP3), consistent with the application.

## 2026-10-24: Static site with Eleventy, code on GitHub
Eleventy static site in a GitHub repository. No database or server to maintain or secure, free hosting, same stack as geba.ge.

## 2026-10-24: Repository ownership
Repository lives on Luka's personal GitHub account (Luka9815) during the build and is transferred to an ERIDA/NEO GitHub organisation at launch. The transfer must be logged here and in HANDOVER.md.

## 2026-10-24: Accounts registered to an ERIDA/NEO email
Hosting, CMS, analytics and domain accounts are registered to an ERIDA/NEO email address, never a personal one, so the NEO keeps control after handover.

## 2026-10-24: Languages
Georgian primary, English secondary, full parity for core pages (Action, Call, Event, FAQ, Page, Person). News and Stories may be Georgian only.

## 2026-10-24: URLs use English slugs in both languages
`/ka/calls/`, `/en/calls/`. Avoids long percent-encoded Georgian URLs.

## 2026-10-24: Seven top-level menu items
Home, Opportunities, Calls and deadlines, Events, News, Resources, About. Replaces the current twelve. Details in SITE-PLAN.md.

## 2026-10-24: Content as linked types, each fact entered once
Action, Call, Event, Resource, News, Story, Publication, FAQ, Person, Page. Deadlines and events are entered once and shown wherever needed.

## 2026-10-24: No sliders, no pop-ups
Hurts accessibility and performance with no benefit for users.

## 2026-10 (approved): Site plan v0.1
docs/SITE-PLAN.md approved as the basis for the build.

## 2026-10-26: Division of work between agents
Codex does the bulk of the coding. Claude reviews changes against AGENTS.md, checks EU visibility, accessibility and Georgian text, and drafts the next task prompts. AGENTS.md is the single source of instructions; CLAUDE.md only points to it. Luka relays between assistants.

## 2026-10-26: Public repository
The repository is public. Acceptable for a public website and free tiers of hosting and CMS; consequence: no secrets, tokens or personal emails are ever committed.

## Open (not yet decided)
- Search: Pagefind or alternative, after testing with Georgian.
- Analytics: cookieless option to choose.

## 2026-10-26: Session 1 content layout
Use one JSON file per item in `src/content/<type>/`, with shared facts at the top level and nested `ka` and `en` text objects. Bodies are Markdown strings rendered by markdown-it with raw HTML disabled. Both Decap and Pages CMS support JSON collections and nested object fields, so neither requires a translation plugin. See docs/CONTENT.md; authenticated editor testing remains open. This resolves the earlier open bilingual-layout item.

## 2026-10-26: Session 1 toolchain and rendering
Use Node 24 LTS, Eleventy 3 ESM, Nunjucks, plain CSS and system fonts for the skeleton. Keep package-lock.json and use npm ci. Generate routes from the content catalog; exclude untranslated News and Stories from English listings and use a section-index language fallback. No client JavaScript, images, trackers or remote fonts are needed in this skeleton. Final font and image-pipeline choices remain open.

## 2026-10-26: Sample preview safeguards and EU placeholder
All sample records and draft text begin with [SAMPLE]. Both previews are noindex with robots disallowing crawling until real content is approved. Use host build URLs for canonical metadata, overridable by SITE_URL. The handover explicitly requests an emblem placeholder for session 1; use labelled text, never a redrawn flag. Original EACEA assets and the approved Georgian disclaimer remain launch requirements.

## 2026-10-26: Computed statuses and daily rebuild plan
Compute call status from opens/deadline instants and event status from the event end. Calls store Europe/Brussels plus an explicit seasonal offset; format dates using the language files and Intl time-zone conversion. After selecting a host, add a daily GitHub Actions schedule at 04:15 UTC that POSTs to that host's build hook, stored only as a repository Actions secret named SITE_BUILD_HOOK. Enable workflow_dispatch for manual retries. Until that hook exists, a manual host rebuild is required to refresh time-sensitive statuses. This selects the rebuild method; activation remains open until hosting is connected.

## 2026-10-26: Portable hosting and repeatable checks
Both hosts build with npm run build and publish _site using Node 24. Share only the supported root 302 in _redirects. Netlify has language-specific 404 rules in netlify.toml; Cloudflare Pages uses the root Georgian 404 with an English 404 switch, avoiding unsupported 404 rules in its _redirects format. No host is selected until both live deployments are tested. Use node:test with Cheerio for generated-site checks and Playwright with axe for basic accessibility and 320 px layout checks.


## 2026-10-26: Editor-entered local call and event times
Supersedes the explicit-offset storage rule in the earlier computed-status decision. Store Call opens/deadline and Event date/end as YYYY-MM-DDTHH:mm plus a named timeZone. Resolve them with @js-temporal/polyfill at build time, including daylight saving; editors never type offsets. Reject nonexistent or ambiguous clock-change times instead of silently changing the entered time or guessing an occurrence. Runtime catalog values and HTML datetime attributes carry derived offsets; content files stay local. News dates retain their existing instant format.


## 2026-10-26: Explicit call edition and archives
Use currentCallYear in src/_data/site.js rather than the build clock. The selected edition stays first on the calls page and drives action-page current calls; all other available editions follow as archives in descending year order. This keeps an edition visible across New Year and provides a single setting for a later CMS settings screen. Keep home deadlines chronological across editions. Add one clearly labelled 2025 archive sample to exercise rendering.


## 2026-10-26: One template per page type
Replace the conditional src/pages.njk dispatcher with individual templates in src/pages/. Keep language setup and the base wrapper in _includes/page.njk and group the central route list through _data/pageTypes.js. News listing and article have separate templates. Reformat JavaScript and CSS for readability without changing behaviour; compare the generated DOM before and after the refactor.
## 2026-10-26: GitHub Pages hosting through GitHub Actions
Supersedes the hosting choice and host-specific routing in "Portable hosting and repeatable checks", and resolves the earlier open Netlify/Cloudflare hosting choice. Host this repository on GitHub Pages using GitHub Actions. Drop Netlify and Cloudflare Pages for now: no extra accounts are needed, and repository ownership carries hosting to ERIDA on transfer (the Pages address and settings must be checked after transfer). Revisit hosting only if proper HTTP 301 redirects for old erasmus.org.ge URLs become essential. Netlify configuration can be restored from git history if it is ever chosen again. The existing repeatable test strategy remains valid.

## 2026-10-26: Build-phase GitHub account and institutional domain
Supersedes "Accounts registered to an ERIDA/NEO email". During the build, the repository, GitHub Pages hosting and CMS run on Luka's own GitHub account. The domain must be registered to ERIDA, never to an individual. Transfer the repository and its hosting to ERIDA when ready; confirm Pages settings and any custom domain after transfer. This avoids creating extra service accounts during development while preserving institutional domain ownership.

## 2026-10-26: Scheduled rebuild in the Pages deployment workflow
Supersedes the hook-based daily rebuild plan in "Computed statuses and daily rebuild plan". Run the same GitHub Actions deployment workflow on pushes to main, daily at 04:15 UTC and through workflow_dispatch. Rebuild and deploy directly, without a build hook or a custom secret. Monitor scheduled runs because GitHub disables schedules in public repositories after 60 days without repository activity; re-enable the workflow from Actions when needed.

## 2026-10-26: Portable site path prefix
Keep route and content paths independent of hosting. Set Eleventy's pathPrefix from PATH_PREFIX (default /) and use its HTML base plugin to rewrite rendered internal links, assets and refresh targets, including Markdown links. SITE_URL is a complete base URL including its trailing path prefix, defaulting to https://luka9815.github.io/neo-georgia-website/. Absolute metadata uses that base; the workflow sets both values explicitly. For a custom domain, set PATH_PREFIX=/ and SITE_URL to its HTTPS root. Regression tests build both hosting layouts and check generated targets.


## 2026-10-26: GitHub Pages fallbacks and legacy URLs
Supersedes the host-specific 404 and root-redirect rules in "Portable hosting and repeatable checks". Use one root bilingual 404 (Georgian first, English second) and a static root index with meta refresh, target canonical and a visible Georgian-home link. Add .nojekyll to the uploaded output. Generate optional meta-refresh stubs from the initially empty redirects.json mapping; validate collisions and target pages. These are HTML redirects, not HTTP 301 responses. Remove netlify.toml and src/host/_redirects; restore them from git history only if Netlify is chosen again.


## 2026-10-26: Explicit launch-indexing setting
Supersedes the indexing and host-URL behaviour in "Sample preview safeguards and EU placeholder"; sample marking and the EU asset requirements remain unchanged. siteLaunched in src/_data/site.js defaults to false. While false, every page is noindex and robots.txt disallows crawling. Once NEO approves launch, set it true to allow content indexing; 404 and redirect pages remain noindex. SITE_URL defaults to the full GitHub Pages project address and can be changed to the institutional custom-domain root together with PATH_PREFIX=/.


## 2026-10-26: Pages CMS for News and Events
Resolve the earlier open staff-editor choice in favour of hosted Pages CMS with GitHub sign-in. Configure JSON collections and slug-based filenames, nested translations and Georgian-first field labels. The current documentation and save implementation were checked via their GitHub source because the documentation host returned 403; exact sources are recorded in CONTENT.md. Live authenticated editing remains Luka's test after merge.

## 2026-10-26: Markdown body storage and safe editing fields
Use rich-text with explicit options.format=markdown: current source emits getMarkdown() and JSON serialization preserves that string. Keep markdown-it html:false. Disable rich-text media insertion until bilingual alt fields and responsive images exist; reserve src/assets/uploads with public /assets/uploads paths so PATH_PREFIX is added at build time. Event dates stay pattern-validated strings to avoid the date widget's browser-local normalization. Select choices match the approved content model and existing action slugs.

## 2026-10-26: CMS settings preserve the launch flag
Supersedes the storage locations in "Explicit call edition and archives" and "Explicit launch-indexing setting". Move currentCallYear and siteLaunched to settings.json, read by site.js. Expose only currentCallYear in Pages CMS. Enable documented settings.content.merge=true so a CMS year edit preserves the code-maintained siteLaunched key; the default schema-only rewrite would delete it. Validate the year as an integer and the launch flag as a boolean.

## 2026-10-26: News publication days and editor validation
Supersedes the News-instant exception in "Editor-entered local call and event times". Store News date as a calendar day YYYY-MM-DD with no time or offset, and render that day without an invented clock time. Migrate existing samples. Validate News and Events before rendering with filename/field errors; reject missing required text, unknown actions, invalid or offset-bearing dates and invalid event classifications/ranges. Keep Event wall-clock timestamps and named-zone DST handling unchanged. Remove fixed sample-count and year assumptions from tests so staff can add content and change the CMS call year.


## 2026-10-26: Optional Event registration and agenda
Supersedes the required-registration/agenda part of "News publication days and editor validation". Registration and each translated agenda are optional in the CMS and build validation. Hide missing, empty or whitespace-only blocks; validate a supplied registration URL as HTTPS. This supports events before registration or an agenda is available.

## 2026-10-26: Self-hosted Noto for Georgian and Latin
Resolves the open font choice and replaces system fonts in "Session 1 toolchain and rendering". Choose Noto Sans Georgian plus Noto Sans, normal-width 400/700, subset to Georgian and Latin ranges and self-hosted WOFF2 with font-display: swap. Compared regular text at 16/20/32 px: FiraGO is compact; Noto's open Georgian forms and wider Latin suit readable institutional text with wrapping navigation. Noto's four subsets total 99,184 bytes versus FiraGO's 118,736 for equivalent two-weight coverage, and include Mtavruli missing from the inspected FiraGO release. Both licences are SIL OFL 1.1. Keep original licences, pinned source/checksum manifest and the maintenance subsetting script. See DESIGN.md and the comparison image.

## 2026-10-26: Blue, warm accent and neutral contrast tokens
Use Erasmus+ inspired #003399 blue, one warm accent and neutrals, without copying EU logos. Define colours as CSS custom properties and test every allowed text/surface combination at 4.5:1 or better, including badges and inverse buttons. Status/source words remain visible so meaning does not depend on colour. DESIGN.md lists the pair rules; decorative borders are not text colours.

## 2026-10-26: Georgian-first shared navigation and components
Use a native details/summary mobile menu and a desktop menu rendered from the same seven-link macro; CSS exposes only the appropriate one. Keep the language switch visible in both layouts and a labelled text-only NEO Georgia logo placeholder. Cards show type, dates, text status badges and visible resource source labels. Let long Georgian labels wrap. Separate the EU funding block from contact/legal content, retaining the official-emblem placeholder and disclaimer rules. No client JavaScript or remote assets are introduced.

## 2026-10-26: Institutional six-block home layout
Keep the approved content order and sample data. Move the home h1 into the blue purpose/audience hero, give each list a section-index link, feature one story on a quiet surface and label the figures as illustrative. Use a one-column mobile reading order and a desktop hero split; let Georgian headings and CTAs wrap. Use an explicit withoutStatus filter for the next-deadline list: Nunjucks rejectattr only tests attribute truthiness and the earlier equalto call hid all deadlines. Add a regression check for visible open/upcoming calls. Use only local fonts/CSS and native navigation. Save before/after screenshots of both languages at 360/1280 px, with fonts settled and no page JavaScript required for the final views.


## 2026-10-26: English prevails between language versions
Resolves the earlier open prevailing-language item. In a discrepancy between Georgian and English versions, English prevails. Publish the statement in both languages in the footer and /language/ page. Keep the wording in each language's translation file and reference it from the policy page so the policy cannot drift between locations. Georgian remains the primary interface language under "Languages".

## 2026-10-26: Last twelve months of News in the initial migration
Narrows the News migration scope in "Rebuild from scratch, not migrate the WordPress site" and the site plan migration outline. Migrate only old-site News published in the twelve months preceding the agreed migration/export date. Record that date and the exact import window when the export arrives. This is an initial import scope, not automatic deletion of future archived news; other content types retain their separate migration requirements.

## 2026-10-26: Domain decision after the site is built
Supersedes the earlier open domain item's urgent-decision timing. Defer the final domain decision until the site is built; taking over erasmus.org.ge is the likely direction, not a committed domain configuration. Keep the temporary GitHub Pages URL meanwhile. Institutional ownership and any written transfer agreement remain required under "Build-phase GitHub account and institutional domain".

## 2026-10-26: Project Georgian disclaimer proofread by Luka
Supersedes the Georgian TODO/approval requirement in "Sample preview safeguards and EU placeholder". The project supplies the Georgian translation and Luka proofreads it. Use the exact text supplied in this session; do not describe it as an official EACEA Georgian translation. Original official emblem files and grant-agreement funding wording still need their separate checks.

## 2026-10-26: Nine requested Action topics, source review pending
Resolves the earlier open choice of which Actions to feature: International Credit Mobility, Erasmus Mundus (Joint Masters and Design Measures together), Capacity Building in Higher Education, Jean Monnet Actions, Capacity Building in VET, Capacity Building in Youth, Youth mobility, Virtual Exchanges and Capacity Building in Sport. Eligibility still requires the official 2026 Programme Guide and per-action source comments before replacing samples. The selection itself does not establish Georgian applicant or partner eligibility.


## 2026-10-26: Optional approved header logo path
Extend "Georgian-first shared navigation and components" and the editable-field limit in "CMS settings preserve the launch flag". Keep the current wordmark while logoPath is empty. Expose an optional local /assets/ path in Settings for a future approved image, with language-specific alternative text and aspect-ratio-preserving layout. Validate that a supplied asset exists and let PATH_PREFIX apply at render time. siteLaunched stays code-only. Do not download or reuse the old site's NEO logo.


## 2026-10-26: Compact mobile hero and clearer card hierarchy
Refines "Institutional six-block home layout" by hiding the supplementary next-step panel below 600 px; primary audience links and menu remain available. Refines "Blue, warm accent and neutral contrast tokens" with a semantic green open-state badge, white text at 9.11:1 contrast, keeping the explicit status word. Other status colours remain quieter. Show card section names only when the caller requests mixed-list context (the home); keep status and source labels visible on all pages.


## 2026-10-26: Original official bilingual EU artwork
Supersedes the emblem-placeholder part of "Sample preview safeguards and EU placeholder" and "Georgian-first shared navigation and components". Use unmodified original PNGs from the official EACEA-linked Commission download centre. English uses its Funded by archive; the EACEA non-EU KA archive supplies artwork visibly labelled “ევროკავშირი საქართველოსთვის”. Retain those original bytes and accurate alt text, with the funding statement/disclaimer alongside. Record archive/member URLs, download date and checksums in assets/eu/README.md. Confirm funding wording and supplied KA artwork against the signed grant agreement before launch.

## 2026-10-26: Source-checked 2026 Action drafts and sector groups
Supersedes "Nine requested Action topics, source review pending". Replace the three samples with nine bilingual [DRAFT] records sourced to the official Programme Guide 2026 v1, with exact page/eligibility citations in comment fields and verified official links. Retain existing slugs for relationships. Group by four sectors; Virtual Exchanges appears in higher education and youth without duplicating its record. Store the shared Georgia authority exclusion once and render it on every Action. Distinguish direct applicants, partners and the two Erasmus Mundus strands; flag the CBHE Strand 3 authority requirement for EACEA review. Cards reuse summary, avoiding a duplicate body fact. See ACTION-REVIEW.md for the evidence and review scope.


## 2026-10-26: English beneficiary emblem on both languages until Georgian supplied
Supersedes "Original official bilingual EU artwork". The KA archive's “ევროკავშირი საქართველოსთვის” is EU Delegation country branding, not the required beneficiary funding emblem; remove it. Use the unmodified official English Funded by the European Union emblem on both language versions, with Georgian alt text “დაფინანსებულია ევროკავშირის მიერ” on /ka/. Keep the Georgian funding statement and disclaimer unchanged. Obtain the official Georgian Funded by the EU emblem file from the EU Delegation or EACEA, then replace the Georgian-page image and record its provenance.


## 2026-10-26: Manual WordPress dry run with an exact twelve-month window
Implements the import scope in "Last twelve months of News in the initial migration". Use a manually invoked Node script with serial paginated public REST reads and a 1.5-second request interval. Capture one UTC run instant and subtract twelve calendar months; filter publication date_gmt to the inclusive-start/exclusive-end window. Write only below migration/review, refuse CI/symlinked output, and keep raw recovery responses ignored there. No importer runs in builds, CI or npm test. Language pairing requires explicit REST translation relations and distinct content; query differences and duplicate posts are evidence for review, not guessed translations.


## 2026-10-26: Review-only Markdown conversion, romanised slugs and suggestions
Use Turndown as a development dependency with Cheerio cleanup. Retain links/lists, omit image embeds into a separate metadata inventory, strip scripts/widget debris and tracking parameters, and redact email addresses before committing public review text. Romanise modern Georgian with the national table, then remove ejective apostrophes for the site's ASCII slug contract; cap at 60 characters and resolve collisions deterministically, including existing News slugs. Keep old IDs/slugs/URLs under legacy. Action and Event classification is evidence-backed suggestion metadata, never an automatic publishing decision. An unmatched item has actions:[] and a clear blocking warning rather than an invented Action; these review files require approval and may intentionally fail publication validation. No attachment binaries are downloaded.


## 2026-10-26: Plain-language review report and explicit incomplete runs
Generate REPORT.md plus run.json, inventory.json and attachments.json below migration/review. Record every item and warning, exact title/body duplicate groups, request failures and attachment usage without downloading binaries. A failed collection is explicitly incomplete, returns a nonzero exit status, and never becomes a claim that the old archive is empty. The report explains Luka's manual review and preserves uncertain language/type/Action cases for that review.


## 2026-10-26: Draft legacy redirects stay outside live configuration
Generate migration/review/redirects.draft.json from the reviewed News slugs and published top-level WordPress pages (parent=0, all dates). Suggest page sections using SITE-PLAN "Where current content goes"; leave unmatched pages and sources without a Georgian draft at null instead of inventing targets. Event candidates need target review. Preserve full old post URLs, including Georgian paths, for later redirect-format/hosting review. Do not change src/_data/redirects.json or create routes in this dry run.


## 2026-10-26: Offline converter fixtures and conservative language review
Use saved synthetic HTML and in-memory REST-shaped fixtures to test cleanup, links/lists/tables, attachment metadata, the full modern Georgian romanisation table, Mtavruli/collision/length edge cases, exact window boundaries and verified-English-only conversion. Stub fetch to fail in this test file, so npm test cannot make network requests through the converter. The live dry run found four English-prose sources without translation metadata or linked Georgian versions; keep them in inventory for review rather than fabricate ka text or pair similar posts. Forty-four Georgian drafts have no supported Action suggestion and remain blocked for publication until an editor chooses one.


## 2026-10-26: Separate source-language detection and candidate pair review
Supersedes automatic verified-English attachment and the four-source-only assumption in "Offline converter fixtures and conservative language review". Detect title and body separately using visible prose, excluding URLs. Mixed bodies and mismatched titles/bodies stay under sourceText, so Latin prose is not silently put in ka. Clear English-prose records use an explicitly unapproved en candidate. Keep one draft per source post. Propose within-post and cross-post CANDIDATE pairs with script/section, date, topic, media and legacy-slug evidence and a confidence note; never split or merge automatically, even for an explicit REST relation. List Latin-body sources without a Georgian candidate separately.


## 2026-10-26: Remove theme-only dates and markers without removing body emoji
Extend "Review-only Markdown conversion, romanised slugs and suggestions". Strip only a leading standalone brace-wrapped DD.MM.YYYY theme date, standalone empty info markers and repeated blank lines. Clean leading title emoji, including joined emoji sequences; preserve numerical title prefixes, body emoji and info markers that have text. Keep meaningful dates inside the article.


## 2026-10-26: Prefer clean legacy slugs, word-boundary romanisation fallback
Supersedes the slug-generation part of "Review-only Markdown conversion, romanised slugs and suggestions". Reuse clean lowercase ASCII legacy slugs after converting underscores to hyphens. Preserve an already published clean slug even when long; the approximately 60-character limit applies to newly romanised title slugs. Truncate those at a word boundary, with a hard cut only for a single overlong token. Keep deterministic collision suffixes and reserve existing live News slugs. Preserve the original legacy value separately.


## 2026-10-26: Download only selected review images, never publish them
Supersedes the no-binary-download part of "Review-only Markdown conversion, romanised slugs and suggestions" and "Plain-language review report and explicit incomplete runs" for this authorised review pass. Select one image per source: featured first, then attached, then inline. Choose the largest known variant up to 1024 px, preferring JPG/PNG/WebP (GIF only as fallback), skipping HEIC and unknown/oversized variants. Download original bytes from the old-site image host with the shared polite request limiter, verify received format/dimensions and keep files under migration/review/images/<slug>.<ext>. Record source/byte size and both [ALT NEEDED] placeholders; leave every other attachment listed only. Reused URLs are fetched once per run; report network bytes and total saved-file bytes separately. These review images are not the production responsive-image workflow.


## 2026-10-26: Quick review table and decisions CSV
Put a one-row-per-draft summary at the top of REPORT.md, including language, type/Action suggestions, image and pairing candidates. Generate decisions.csv with slug, keep, type, actions, pair_with and notes. Leave keep/pair_with blank; type/Actions are editable suggestions, not decisions. Preserve an existing decisions.csv on reruns and write a fresh decisions.template.csv instead. Mixed/English-candidate drafts have no proposed Georgian redirect until language review. Neither CSV nor candidate pairs trigger content promotion or merging.


## 2026-10-26: Offline language, cleanup, slug and image regression checks
Extend the offline converter-fixture decision with mixed-body/title mismatch, within-post/cross-post candidate-only pairing, source-record preservation, theme cleanup and clean legacy slug cases. Use injected image bytes to test variant selection, byte deduplication, provenance/alt placeholders and rejection of actual widths above 1024 px without making network requests. Test the quick report/CSV row contract too. The final live import is a separate manual operation; verify downloaded images and saved-byte totals locally before committing review output.


## 2026-10-26: News may have no Action (Luka)
Relaxes the "select at least one existing action" check, which was an implementation choice, not a SITE-PLAN requirement. General NEO news (Europe Day, TAM, conferences, programme-wide announcements) fits none of the nine Actions, and forcing one would mislead readers and Action pages. News actions are optional (missing or empty list both accepted); any listed slug must still exist. Events still require at least one Action. The Pages CMS News field is no longer required.

## 2026-10-26: Migrate only old posts that exist in both languages (Luka)
Narrows the initial News import scope in "Last twelve months of News in the initial migration". Only old posts with a real Georgian and a real English version are migrated; Georgian-only and English-only posts are skipped, not translated. This does not change the rule that new News may be Georgian only. In decisions.csv, pair_with equal to the item's own slug means the post holds both languages in one body and its ka and en sections are to be split. Applied to the 2026-10-26 review: 5 of 76 posts qualify.

## 2026-10-26: Smaller footer disclaimer (Luka)
The EACEA disclaimer stays verbatim on every page but is set as secondary text (0.75rem, muted colour, 6.9:1 contrast), similar to NEO Moldova. The emblem and funding statement are unchanged.


## 2026-10-26: Five source-only bilingual News promotions
Apply only the five keep=y rows authorised for session 9. A self-referencing pair_with means split one bilingual body, including the English-first Capacity Building source; retain source wording and use existing source headings as titles where available. The sole new English title, Europe Day in Kutaisi, 24–25 October, awaits Luka's review. Reviewed JSON supplies dates because the CSV has no date column. Keep images out until News supports a bilingual-alt image contract.

## 2026-10-26: Static output for encoded legacy paths
Extend draft redirect validation to decoded Unicode letters, numbers, marks and emoji while retaining traversal/collision/target checks. Decode once before output so the one approved emoji legacy URL matches a static host's URL decoding. Keep redirect destinations limited to known pages and verify the emoji URL on hosted Pages. News rendering normalises heading levels to prevent source-format accessibility failures without rewriting text.


## 2026-10-26: Supporting templates follow the approved sitemap
Place Publications and FAQ under Resources, Team and Contact under About, and HEREs at /here/, linked from About. Reuse central bilingual routes, translation data and card components; retain seven top-level menu destinations. Publications progressively enhances a complete static list with local year/type filters; controls stay hidden until ready and empty results announce a count. Two [SAMPLE] text files demonstrate downloads without inventing approved publications.

## 2026-10-26: Supporting records and public contact placeholders
Extend build validation to publication, FAQ and person records, retaining existing shared-fact/translated-text layout. Publication files are local /assets/publications/ PDFs (or sample text), types match SITE-PLAN, FAQ topics have translated labels and Action links, and people have neo/here groups and translated roles. Fictional names follow national romanisation including ejective apostrophes. Contact address/hours/email are translated [SAMPLE] strings; use reserved example.org, no real contacts, photos, forms, maps or remote assets. Supporting records remain JSON-edited pending an approved CMS expansion.


## 2026-10-26: Pagefind held after Georgian inflection evaluation
Do not ship Pagefind or a search UI yet. The 1.5.2 experiment isolates languages and works with the project prefix, but მობილობა misses clarification/EVE News and თანამშრომლობის misses relevant Action pages. See SEARCH.md and the measured query table. Keep the exact development dependency and manual temporary build-time evaluator for reproducibility; normal builds publish no search assets. Recommend reviewed Georgian normalisation/word-family expansion or another local engine, with native-speaker acceptance queries before implementing template 14 and its keyboard/no-JavaScript flow. This resolves the first-candidate test, not the eventual search-engine choice.


## 2026-10-27: Luka approves Pagefind with a Georgian ending fallback
Supersedes “Pagefind held after Georgian inflection evaluation” and the session 11 shipping hold in SEARCH.md. Ship separate production ka/en indexes after Eleventy, excluding notices and utility pages, and site-designed API search pages with keyboard/live-region support and no-JavaScript section links. Apply only Luka's 18 specified endings in a query-only fallback, longest first, one ending per word and at least four letters left; typed-query results precede de-duplicated fallback matches. Keep the single list in src/assets/js/georgian-search.js. Nominative forms without an approved removable ending retain their measured gaps; do not silently add a linguistic normaliser. Only search pages load modules, and only the active language's index loads on submission. Indexed URLs already include PATH_PREFIX, so configure Pagefind baseUrl as /.

## 2026-10-27: Optional validated News images with responsive local output
News may have one shared image.src under /assets/uploads and alt.ka, plus alt.en when English News exists; reject missing files, unsafe/external paths and any [ALT NEEDED]. Use @11ty/eleventy-img 7.1.1 only for component-marked News images so the original EU artwork is untouched: AVIF/WebP plus JPEG fallback for JPEG sources or PNG otherwise (transparency), width candidates 320/640/960/1280 without enlargement, dimensions/sizes set, eager article lead and lazy cards. Resolve the actual Eleventy output directory and PATH_PREFIX for all generated paths. Expose the optional object in Pages CMS, with English alt conditionally required by build validation. Leave all five promoted posts without images until Luka selects review files and supplies alt text; NEWS-IMAGES.md records availability.


## 2026-10-27: Add authorised nominative endings to Georgian search
Extend “Luka approves Pagefind with a Georgian ending fallback” with Luka's session 14 instruction: append ა and ი last in the single ending list, keeping at least four letters and removing only one longest ending per word. Typed-query results stay first, English remains unchanged, and index/page text is untouched; SEARCH.md records the additional recall column and the measured scope.


## 2026-10-27: Keep image alternatives as review-only drafts
For session 14, place visually grounded Georgian/English alt drafts and image suitability/rights notes only in NEWS-PROMOTION.md. Do not attach images, modify migration review metadata or copy alternatives into News until Luka approves selection and wording; flag text/logo posters and the redundant chart rather than assuming every downloaded image should be used.


## 2026-10-27: Drop opportunity filters (Luka)
Supersedes the Opportunities hub filter requirement in SITE-PLAN and the opportunity-filter remaining task. With nine Actions, filters add little value; keep the complete sector-grouped listing with visible translated Key Action labels from keyAction. Revisit only if the listing grows substantially. No new target-group classifications are needed.

## 2026-10-27: Publish one approved News photograph and hold the Europe Day image (Luka)
Supersedes the publication hold in “Keep image alternatives as review-only drafts” only for neo-dissemination-event-2025.jpg. Attach it to the matching post using the session 14 Georgian and English alternatives as approved, through the session 13 optional image field and responsive pipeline. Omit the clarification graphic, statistics chart and Capacity Building infographic because they are text-heavy or redundant. Hold europe-day-in-kutaisi.png because it shows identifiable children; do not publish until NEO confirms consent to reuse. No other review image is authorised for upload.


## 2026-10-27: Initialise Publications filters before the first paint
Keep the complete no-JavaScript list and hidden-until-ready controls, but load the small local enhancement as a classic script immediately after the form instead of a deferred module. Lighthouse exposed intermittent layout shift when the module revealed the form after painting. Render the initial count statically, keep script scope private and synchronise the list after DOMContentLoaded. Validate filtering, reset and the no-JavaScript fallback.


## 2026-10-27: Use the Commission's Georgian EU funding emblem (Luka)
Supersedes “English beneficiary emblem on both languages until Georgian supplied” and its rejection of the KA artwork. The European Commission download centre linked from EACEA distributes co-funded_ka.zip, member Evrokavshiri Sakartvelostvis/horizontal/PNG/GEO-Funded by the EU-POS.png, as the Georgian Funded by the EU emblem. The EU Delegation's EU4Georgia Supplementary Visibility Guidelines (July 2026) give “ევროკავშირი საქართველოსთვის” as the Georgian funding statement. No literal Georgian Funded by emblem exists, and redrawing or translating the artwork is not allowed. Use the verified original on /ka/, with that exact alt text, and the English original on /en/. Keep original bytes, aspect ratio and the white background box; use the existing image pipeline only for whole-image PNG size derivatives. Both artworks carry the statement, so omit adjacent repetition and keep the Georgian disclaimer unchanged.

## 2026-10-27: Typographic office identity, no NEO graphic logo (Luka)
No NEO graphic logo will be designed or used. EU Delegation guidelines require its approval for project-specific logos, and the Erasmus+ programme logo is not for beneficiary use. Use the exact translated officeName as the accessible home-link wordmark with existing fonts/colours, subordinate to the EU emblem; keep logoPath only for a future approved logo. The current Georgian source is “ერაზმუს+ საქართველოს ეროვნული ოფისი”, which differs from the prompt's example “ეროვნული Erasmus+ ოფისი საქართველოში”; retain the source name. English is “National Erasmus+ Office Georgia”. Use a typography-only E+ favicon without EU flag or programme artwork.

## 2026-10-27: Permanently omit the Europe Day photograph (Luka)
Supersedes the Europe Day consent hold in “Publish one approved News photograph and hold the Europe Day image”. Do not use europe-day-in-kutaisi.png at all. Remove the consent request from NEO inputs and the launch checklist. The dissemination photograph remains the only approved News image.

## 2026-10-27: Keep sample News solely in isolated fixtures
Move update-1, update-2 and update-3 out of src/content/news into test/fixtures/news. Copy them into temporary sites for CMS, responsive-image and missing-English fallback checks; produce no public sample News URLs or search/sitemap entries. News cards use up to the first 30 words of the first source prose paragraph with an ellipsis when needed, rather than the full article; details retain wording, facts and dates. At render time only, suppress an exact duplicate initial title, promote standalone bold section lines to headings and repair missing Markdown emphasis/line-break boundaries. Sample Events remain explicitly listed for a later launch cleanup, with coverage moved to fixtures first.


## 2026-10-27: Session 18 Action review remains pending (Luka)
The recovered brief mentioned Nino's review via Luka, but the restart explicitly requires all nine Actions to retain [DRAFT]. No Action approval is recorded by this session. Preserve every Action text field and the shared Georgia eligibility note; list any proposed wording changes separately in ACTION-REVIEW.md for Nino. Partner-search navigation does not change eligibility or application wording.


## 2026-10-27: Signed grant agreement expected in late November (Nino via Luka)
The agreement is expected to be signed at the end of November 2026. Retain the current EACEA model grant agreement Article 17 funding and visibility wording until then. Recheck the funding statement and all website obligations against the signed agreement before launch; this does not approve launch or change the emblem/disclaimer.


## 2026-10-27: Luka is the sole editor for now (Nino via Luka)
Luka remains the only editor until further notice. Additional editor names/access are no longer a launch prerequisite; arrange staff access and EDITING.md training after launch when the team changes. Institutional ownership and maintenance responsibilities remain required.


## 2026-10-27: Official partner-search shortcuts (Nino via Luka)
Add bilingual /opportunities/find-partners/ under Opportunities and link it from all nine Action pages, preserving the seven main destinations and all Action wording. Only official EU/programme tools are listed, including the SALTO training calendars linked by Erasmus+. Public URL checks and redirects are recorded in PARTNER-TOOLS.md, dated 2026-10-27. This also records Nino's request via Luka for Events calendars, a newsletter, projects involving Georgia and statistics; the following items define their authorised scope.


## 2026-10-27: Static Event calendar and iCalendar files
Keep /events/ as the accessible default list. Add /events/calendar/ with build-time month tables, translated Monday-first weekdays, month anchors and keyboard-scrollable regions, without runtime scripts or a calendar dependency. Dates use each Event's named zone; multi-day events cover local dates with exclusive midnight ends. Include the current Tbilisi month even when empty.

Generate bilingual event.ics files per Event and upcoming.ics feeds during Eleventy builds. Resolve each raw wall time using the existing Temporal helper with disambiguation reject, then write UTC DTSTART/DTEND. UID is neo-georgia-event-<slug>, with no @ part, and stays identical across languages, builds, time changes and hosting changes. Never rename a published Event slug without a migration decision. DTSTAMP is the build instant; feeds include in-progress Events until their end, matching the existing upcoming status. Zero-duration Events omit DTEND. Use RFC 5545 CRLF, text escaping and 75-octet UTF-8 folding. Downloads are static snapshots, not a live subscription service.

PR #18 review correction, 2026-10-27 (Luka): the domain-independent UID above supersedes the original @events.erasmus.org.ge suffix. RFC 5545 permits a UID without an @ part. Permanent identifiers must not depend on a domain the site is leaving and ERIDA may never own. No ICS files have been published to users yet, so this change has no subscriber impact. Keep the fixed neo-georgia-event- namespace and published Event slugs stable from the first release.


## 2026-10-27: Defer newsletter pending an institutional account (Nino via Luka)
Do not implement newsletter sending, a sign-up form or a public sign-up link yet. After ERIDA has an institutional email and a free mailing-service account registered to it (for example MailerLite's free tier), review the current service terms and add a sign-up link with consent wording. Keep this on the post-launch list and preserve institutional control of the account.


## 2026-10-27: Projects and statistics remain a Session 19 plan (Luka)
SITE-PLAN.md proposes linked projects/participations, an offline review importer and statistics from the same approved data. Luka supplies the official CSV later. Session 18 must add no importer code, source/data fetch, public project/statistics dataset or pages. Real headers, coverage, participation limits and current reuse/attribution terms must be confirmed before implementation/promotion; manual additions need evidence and explicit review.


## 2026-10-27: Narrow promoted News corrections (Luka)
Authorise only the EVE Georgian sentence change from seven projects to seven participations across three funded projects, the enumerated Georgian dissemination spelling corrections in CHANGELOG, and a bilingual note dated 2026-10-27 above the unchanged November 2025 clarification body linking to current Action pages. Preserve all figures and dissemination totals as published source figures, including their time windows. This narrowly supersedes source-wording preservation for those corrections only; migration/review evidence remains unchanged. No Action wording correction is authorised.


## 2026-10-27: Calendar accessibility and feed ordering validation
Use one named region per scrollable month table, with an unlabelled outer section, to avoid duplicate landmark names. Order the upcoming ICS feed by the resolved UTC start instant, so mixed named zones retain chronological order. Keep the existing list as the default and all exports static.


## 2026-10-27: School partner URL verified in Luka's browser
Luka confirms https://school-education.ec.europa.eu/en/connect/partner-search works in his normal browser on 2026-10-27. Keep this current official URL. PARTNER-TOOLS.md preserves the earlier automated 403/legacy-redirect evidence separately; do not revive the completed normal-browser verification task.


## 2026-10-28: Session 19 public project fields and counts (Luka)
Supersedes the Session 18 planning-only hold and the expected CSV requirement for Session 19. Use the supplied search-service snapshot, since the official XLS export is capped at 1,000 rows. Publish only project reference/original title, programme period, Action labels, call year, calendar dates, source status, coordinator name/country, Georgian names/cities/roles, total organisation count and official card link. Omit funding entirely, including projectGrantedEuAmount, descriptions, results, images, logos, contacts and beneficiary websites. Validate the snapshot before rendering with field-level errors; never pass raw objects into templates. Original titles are unmodified, lang=en by default, with conservative script detection for non-Latin titles. Service timestamps consistently encode Brussels midnight; resolve calendar dates in Europe/Brussels rather than truncating UTC.

Luka's counting clarification: all 6,764 projects remain in totals. Show 605 named Georgian organisations and 5,079 institution project/organisation pairs. Exclude the synthetic Mobilities - Georgia identifier/role country-mobility from those institution counts. Report its 2,045 entries separately as mobility projects where Georgia is listed as a participating country without a named Georgian institution. Retain tests for the raw 606 source identifiers and 7,124 source pairs. Source status finalized maps to completed; ongoing/terminated/unknown retain their meanings and are not recomputed from end dates.


## 2026-10-28: Bilingual project attribution (Luka)
Every projects index, year table and statistics page identifies the Erasmus+ Project Results Platform with its source link, snapshot date 28 October 2026, information as submitted by beneficiaries, and a statement that the data are not endorsed by or the responsibility of the NEO. Show the snapshot day separately from the site build timestamp. Original source titles/names are not translated. The existing EU funding disclaimer remains unchanged.


## 2026-10-28: Exact project Action mapping (Luka)
Generate projectActionMap.json from the 39 distinct source labels. Map only equivalent Actions to the nine site slugs; all others get a sector without an Action. PROJECT-ACTION-MAP.md lists every label, count and mapping for PR review. The generic higher-education mobility label is KA131 in this snapshot and remains sector-only, while external-policy-funds mobility maps to icm. Partnerships for Creativity spans sectors and maps to other. Unknown future labels fail rather than being guessed. Action wording and [DRAFT] markers remain unchanged.


## 2026-10-28: Static project catalogue pages (Luka)
Publish bilingual projects indexes with counts and year links, plus one grouped accessible table page per call year. Rows link directly to official cards; no per-project detail pages. Keep seven main destinations. Resources links to the index; mapped Action pages link to that Action's static year index, whose links target the matching Action table group. All records and navigation work without JavaScript; omit optional filters for now. Check page sizes before shipping and propose a split if a year page exceeds about 1 MB.


## 2026-10-28: Statistics from the approved project records (Luka)
Compute statistics at build time from the same public projection used by the year tables: projects by call year, Action/sector, source status and programme period; named institution participations, unique source organisation identifiers and Georgian-coordinated projects. Apply Luka's 605/5,079 institution-count clarification and report 2,045 mobility-country projects separately. Use accessible tables and explain counting units, source status, incomplete 2026/later call years and changing ongoing records. Omit funding sums and optional charts.


## 2026-10-28: Replace illustrative homepage figures (Luka)
Use three computed figures linking to statistics: projects (6,764), named Georgian organisations (605) and Georgian-coordinated projects (106), with the data snapshot date. Remove sampleNumber and figuresNote from both language files and close only the illustrative-figures launch task. Keep other sample content/translation tasks and siteLaunched=false.


## 2026-10-28: Keep year tables outside Pagefind (Luka)
Index the projects index and statistics in both languages. Per-year tables increase Pagefind materially (1,315,137 bytes before Session 19 versus 3,235,348 bytes with year tables), so exclude projectYear routes from indexing. They remain static, linked and in the sitemap. Report final index sizes and keep project-title browsing in the year tables/official platform rather than claiming a complete local project search.

## 2026-10-28: Manual source refresh only (Luka)
Add scripts/fetch-projects.js for Node 24, outside build/test/CI, using the same endpoint and captured POST/Origin, per call year at size 100 with 0.5-second spacing. Keep raw pages ignored, regenerate the supplied slim schema, validate completeness and report per-year totals and differences before any reviewed promotion. Tests use synthetic data with live network forbidden.

Implementation note (Codex): the supplied README/snapshot metadata omit the transport body, Origin, pagination fields and response paths. The script therefore requires a confirmed captured configuration and refuses a missing or synthetic production request. No live request is made and no live reproduction is claimed. A production capture and validation remain unresolved; this is not a new guessed API contract or an approval to publish refreshed data automatically.


## 2026-10-28: Project build performance and final review evidence (Luka)
Report clean-build wall time, output size, Pagefind size and year-page sizes before/after Session 19. No year page exceeds about 1 MB (largest 579,207 bytes), so no split is needed. Full measurements, source/count/mapping checks and local browser evidence live in review/session-19. Keep source reproduction explicitly unverified until the missing captured protocol is supplied and validated.

Implementation notes (Codex): native fragment/CSS group selection with an All projects reset implements the requested Action-filtered links, superseding the earlier item-4 omission of optional group filters. No JavaScript is needed, and unsupported CSS engines retain full groups and anchors. Keep the preview notice but distinguish labelled illustrative/draft items from factual project records, superseding its inaccurate all-content-is-illustrative wording. All nine Actions and shared eligibility stay unchanged and [DRAFT]; source statuses, UI parity, existing EU visibility rules and siteLaunched=false remain intact.


## 2026-10-28: Higher education mobility coverage break (Luka)
The supplied snapshot contains zero KA107 projects and no 2014–2020 KA1 higher education mobility records. The platform does not list Georgian partner institutions on KA107 projects, while 2021–2027 KA171 projects appear through the Mobilities - Georgia country entry. International credit mobility with Georgia under the 2014–2020 programme is not identifiable in this source and is not counted. Show a visible bilingual note beside the year and Action comparisons on the projects index and statistics page: higher education mobility comparisons across 2020/2021 are not meaningful. Do not invent missing legacy records or alter the supplied totals.


## 2026-10-28: Verified project refresh request (Luka)
Supersedes the missing-capture/request-template implementation note in Manual source refresh only. Use Luka's verified POST to https://ec.europa.eu/programmes/service/search/project/search with Content-Type application/json and Origin https://erasmus-plus.ec.europa.eu. The exact body is recorded in migration/source/README.md: from=F, index=eplus2021, keyword/sort empty, matchAllCountries=false, project.projectCallYear as string Y, coordinator/partner empty objects, organisation GE/coordinator_or_partner, size=100 and withAggregations=false. Read total and projectDocuments; page F=0/100/200 until F>=total or an empty page, with 0.5-second spacing. Fetch 2014 through the current Tbilisi calendar year and fail the whole run if any retrieved year count differs from its total. Keep raw/candidate review, duplicate/schema guards and CI refusal. Do not run a live fetch in this review session.


## 2026-10-28: Session 20, release candidate and Action review (Luka)
Supersedes the earlier requirement to keep public [DRAFT] markers. Preserve the settled design and source-checked Action wording; remove public [DRAFT]/[SAMPLE] markers for the release candidate, keep review status in ACTION-REVIEW.md and keep siteLaunched=false/noindex. Use only [TBC] for facts NEO must supply, within final bilingual copy. Do not invent facts. Move sample-dependent coverage into isolated fixtures before removal. Nino reviews the whole candidate before a separate launch change.


## 2026-10-28: Session 20, verified 2026 Calls (Luka)
Replace the four illustrative calls with eleven real records covering all nine Actions, both Erasmus Mundus lots and both youth mobility rounds. Deadlines are checked against the official 2026 Guide sections on 2026-10-28 and use Europe/Brussels, including DST for October. Distinguish institutional calls from student applications. Keep currentCallYear=2026 and the requested expectation note for 2027. Opening times are optional when not verified; do not invent them merely to populate a field. Existing supplied opening-time fixtures retain boundary coverage.


## 2026-10-28: Session 20, empty Events and fixture coverage (Luka)
Remove the three illustrative Events only after preserving them and dependent resource/story/call content in isolated fixtures. Keep the current-month accessible calendar and a valid empty static ICS feed. Both list and calendar show the requested bilingual empty state. Preserve non-empty Event detail, relationship, per-Event ICS, CMS and keyboard/download coverage in isolated builds.


## 2026-10-28: Session 20, conditional Stories (Luka)
Remove the sample story after preserving relationship/mixed-home coverage in fixtures. Generate a language’s Stories index only when that language has a story; hide empty home/Action story sections and Resources navigation automatically, and omit absent routes from sitemap/search. Restore these surfaces when a first story is added. A missing-language story switch falls back to Resources if that language has no Stories index.


## 2026-10-28: Session 20, source-linked bilingual FAQ (Luka)
Replace the three samples with twelve bilingual FAQs in the existing Applications and Mobility groups. Base answers on the 2026 Guide and Commission student/application guidance, link each answer to an official source and record the check date. Keep Georgian authority restrictions and applicant/partner distinctions explicit; distinguish institutional deadlines from individual selection and explain that NEO does not select or fund projects.


## 2026-10-28: Session 20, official linked Resources (Luka)
Replace sample Resources with the official 2026 English Guide, EACEA how-to-apply, Funding & Tenders and Project Results Platform links. State English-only availability of the linked Guide in both languages. Expose the explicitly requested local partner-tools and statistics pages as section navigation, alongside the external resources, rather than hosting document copies or labelling local guidance as an official EU publication.


## 2026-10-28: Session 20, verified external Publications (Luka)
Replace sample publication records/files with two verified official publications: the Erasmus+ annual report 2024 (published 2025) and ICM handbook version 6.1 (October 2024, scoped to the 2024/2025 calls). Link externally and show publication year, language and publisher. Since fewer than three items are published, show the bilingual NEO archive-since-2014 note. Keep the handbook’s historical scope explicit and direct current eligibility to the 2026 Guide. A Georgia country factsheet was not verified and is not invented.


## 2026-10-28: Session 20, role-based NEO team (Luka)
Replace sample-team with Coordinator, Programme Officer and Communications Officer role cards. Names and role emails remain [TBC], shared facts rather than invented people. Render each name and role email explicitly and show one shared NEO contact line. Preserve the national transliteration check for future named profiles; role titles are translated rather than treated as people’s names.


## 2026-10-28: Session 20, HERE explanation and pending membership (Luka)
Replace the fictional HERE profile with a bilingual explanation, the official Commission/EACEA-supported SPHERE network page and the 2026 Guide’s HERE section. Keep the Georgian 2026–2027 membership list [TBC]. No standalone EACEA HERE landing URL could be verified; use the verified official Erasmus Networks destination rather than inventing a link or list.


## 2026-10-28: Session 20, final About page (Luka)
Publish final bilingual information on the EACEA-supported NEO’s information, guidance, applicant/beneficiary support, HERE coordination, monitoring and dissemination role. State that ERIDA hosts the office from January 2027, as supplied by Luka. Link the official Guide implementation and Commission management pages. Explain clearly that NEO does not evaluate, select or fund projects.


## 2026-10-28: Session 20, final contact layout and hidden social links (Luka)
Publish labelled Address, Phone, Email and Monday–Friday 10:00–18:00 office-hours fields, with [TBC] for unconfirmed NEO facts in both languages. Hide the social block entirely while no real URLs are supplied; keep an empty shared socialLinks list for future approved links. Add no dead icons, maps or forms.


## 2026-10-28: Session 20, static-site privacy notice (Luka)
Publish a dated bilingual privacy notice for the actual static site: no site cookies, analytics, tracking or submission forms; browser-only search; GitHub Pages security logs/IP processing with official policy links; external-site policies and static ICS downloads; proportionate email enquiry handling and rights contact. ERIDA is the controller, with legal code, registered address and rights contact [TBC]. Do not invent a retention period or claim that GitHub keeps no logs.


## 2026-10-28: Session 20, dated accessibility statement (Luka)
Publish a dated bilingual WCAG 2.1 AA target and an accurate account of automated axe, keyboard/focus, language switching, 320 px and no-JavaScript checks. State known limits for third-party PDFs/sites, untranslated source project names/titles, scrollable tables and JavaScript search. Keep the reporting contact [TBC]. Do not claim a complete WCAG audit or completed assistive-technology review.


## 2026-10-28: Session 20, final interface text and TBC inventory (Luka)
Replace all remaining sample interface copy with final British English and Georgian text. Keep the exact requested small January 2027 preview notice and noindex/siteLaunched=false. Remove obsolete sample/contact/social and illustrative-figure keys. Use meaningful empty states for home Calls/Events. Inventory every authored [TBC] occurrence by file, field and occurrence in a generated review document; the test must pass while placeholders remain. No invented NEO facts or public sample/draft markers are allowed.


## 2026-10-28: Session 20, release validation and final review (Luka)
Keep the settled design and seven main destinations. Validate clean root and project-prefix builds, full tests, complete browser checks and 48 bilingual 360/1280 px captures. Archive the old handover and replace the Launch checklist with four stages: Nino’s final whole-site review, confirmed TBC values, the signed grant agreement check and a separate launch change. Retain unconfirmed hosted/manual checks within those stages, without claiming they passed. Align AGENTS with the new public-marker rule, keep CLAUDE as its pointer, record all source/check-date and verification-limit evidence, push a review PR and do not merge.


## 2026-10-29: Session 21, portal design system (Luka)
Luka's redesign brief supersedes the Session 20 settled-design rule. Keep existing content, data, URLs, seven destinations, EU visibility and siteLaunched=false. Use plain CSS with blue/teal/warm tokens, eight-pixel spacing, a 75rem container, sticky native navigation, dark three-column footer and locally licensed Lucide icons. Retain Noto: the evaluated 60,068-byte FiraGO heading subset would raise total fonts to 159,252 bytes above the 140 KB budget. See DESIGN.md.


## 2026-10-29: Session 21 item 5, static opportunity finder (Luka)
Add bilingual /find/ and five audience pages using plain links, with matched Actions, applicant/partner qualifications, next steps and university/consortium/EACEA contacts. Keep the full Action text and authority exclusion authoritative. Erasmus Mundus Joint Masters and Design Measures remain distinct; individuals never apply for institutional grants. No script or new top-level destination.


## 2026-10-29: Session 21 item 4, approved photography (Luka)
Reuse the expressly approved NEO dissemination photograph with visible credit and a provenance/hash manifest on Home and About. One accepted image is fewer than five, so use icon/colour panels elsewhere. A CC BY campus candidate could not be downloaded under the network policy; no AV file with individual rights confirmed was accepted. Record the actual search outcome rather than invent licences. Use the existing Eleventy Image library for local AVIF/WebP/JPEG and eager hero/lazy below-fold loading.


## 2026-10-29: Session 21 item 6, build-time project charts (Luka)
Render SVG year, Action/sector, status and top-15 organisation charts from the approved local projection. Keep labelled values and all equivalent HTML tables, with the KA107 coverage warning directly beneath the year chart. Rank by distinct project references per named source ID, preserving the first submitted original name and not merging names. No chart library, client fetch or participant-count inference.


## 2026-10-29: Session 21 item 1, portal homepage (Luka)
Replace the former fixed home order with a credited photo introduction, five static audience paths, nine distinct Action icon tiles grouped by primary sector, computed figures and a year mini-chart with equivalent table and coverage note. Retain latest News and conditional Stories. Empty Calls/Events become compact lines rather than empty cards; real future records restore their sections.


## 2026-10-29: Session 21 item 2, Action hero and facts (Luka)
Add each Action’s icon/Key Action hero, a facts sidebar with unchanged full eligibility text, shared short Georgia-role guidance, all current-edition Brussels deadlines/statuses and exact official links. Link a computed mapped-project count to the existing Action/year project index. Counts describe the dated snapshot with its existing limits, not a complete census.


## 2026-10-29: Session 21 item 3, shared template restyling (Luka)
Apply the portal system across all existing templates without changing routes or authored content. FAQ answers become native details/summary accordions, preserving complete answers/source links and no-script access. Restyle Call/Event/Person cards, tables, filters, contact fields, search and policy prose with consistent surfaces and focus states. Keep working Publications, calendar, projects and search enhancements.


## 2026-10-29: Session 21 item 7, static Georgia participant map (Luka)
Use the committed public-domain Natural Earth 1:50m whole Georgian polygon, including Abkhazia and the Tskhinvali region/South Ossetia, with no internal divisions. Commit 40 GeoNames coordinate/alias records with source/check date and show source credits. Count named source IDs once: 567 mapped, 38 unresolved (23 missing, 5 conflicts, 10 unreviewed locations). Place unresolved counts outside the geographic outline and retain the city table/details, making both bubble and table totals 605. No guessed coordinates, name-based institution merges, tiles or external requests.


## 2026-10-29: Session 21, quality review and publication (Luka)
Validate clean root/project-prefix builds, all existing and new tests, complete browser checks, before/after captures and local mobile Lighthouse. Preserve no-JavaScript, keyboard, forced-colour and reduced-motion checks; return only full axe violation details while running every rule. Disable the restored local Node compile cache for full tests after observing suppressed parameterised-case output. Keep explicit limits: one approved photo, 38 unresolved map locations, a packaged coordinate check rather than live geocoding, and no hosted/manual audit claims. Publish one commit per item plus design-system and quality/evidence commits on codex/session-21-redesign, open PR #21 against main, and do not merge or launch. All four Launch stages remain.


## 2026-10-29: Session 22 item 1, card and navigation links (Luka)
Use a single native stretched title link for single-destination Action, News and audience cards, with a whole-card keyboard focus ring. Titles and navigation links underline on hover/focus; running-text links retain underlines. Multi-destination Call and finder guidance panels retain their explicit Action and official-source links, because collapsing them would remove approved destinations. No nested links or scripted card activation.


## 2026-10-29: Session 22 item 2, compact audiences (Luka)
Use approximately 68px icon/title/arrow rows on mobile and five compact columns at desktop. Allow Georgian labels to wrap and grow rather than clip text; remove the arrow's automatic top gap.


## 2026-10-29: Session 22 item 3, compact Home Actions (Luka)
Home shows the nine existing Actions as compact icon/name/Key Action tiles in sector grids. Keep the unchanged descriptions on Opportunities and the full Action pages; no content records or routes change.


## 2026-10-29: Session 22 item 4, full-width photographic hero (Luka)
Supersede Session 21's no-CSS-cropping/no-overlay rule for the Home placement only. The existing approved photograph fills the hero using object-fit:cover and a 50%/45% focal point. A minimum 82% black overlay guarantees 4.5:1 for both text colours even over white image pixels; the caption has an opaque background. Keep the complete original, accurate event alternative and visible credit. Mobile buttons fill the width. No new photo is implied.


## 2026-10-29: Session 22 item 5, text-only News cards (Luka)
Remove the placeholder icon panel when News has no approved image. Use a teal top border and equal grid tracks alongside image cards; preserve titles, dates and summaries without clipping.


## 2026-10-29: Session 22 item 6, shared spacing and preview bar (Luka)
Use 32px section spacing, baseline-aligned section links, 14px card corners and the existing soft shadow. Move the exact unchanged preview sentence into a slim full-width bar above the sticky header. Keep siteLaunched=false, noindex and EU artwork/disclaimers unchanged.


## 2026-10-29: Session 22 item 7, Commons blocker and credits (Luka)
Stop new photography after the Commons API CONNECT request returns HTTP 403. Do not use another source or invent candidate filenames/licences. Record the one exact previously verified TSU file page for manual download; six to eight new photographs and their placements remain blocked. Add bilingual footer-linked credits for the approved existing image and preserve page captions. New Commons files require API licence/dimension verification and visual review before pipeline integration.


## 2026-10-29: Session 22 quality and review (Luka)
Keep 48 bilingual before/after 390/1280px captures and reproducible root/prefix evidence under review/session-22. Both layouts pass 171 tests and 109 browser pages with zero axe violations; retain all rules and fixture coverage. All eight mobile Lighthouse trials meet performance 90+ (98–100 measured) and accessibility 100. Measure complete Home transfer with every image loaded: 274,749 bytes ka and 233,455 bytes en. Hero contrast is bounded over a worst-case white photo pixel at 13.58:1/11.07:1. Local checks do not replace hosted/manual review. Keep the Commons photography block explicit, push the seven item commits plus quality evidence, open a PR against main and do not merge.


## 2026-10-29: Session 23 item 1, supplied Commons assets (Luka)
Start from origin/main f4d07a1 and merge origin/assets/commons-photos c4886d6. Accept the eight supplied JPEGs after full decode, original/3840px dimension and visual-subject checks against Luka's Commons API metadata. Move COMMONS-SOURCES into assets/images/README.md, record hashes and actual dimensions, and exclude source/ from all deployed passthrough copies. Attribution verification comes from Luka's supplied records; do not claim a new live API check.


## 2026-10-29: Session 23 item 2, photo placements and lighter Home overlay (Luka)
Use the Sameba panorama on Home because its wide composition survives desktop text and mobile focal crops; reserve the TSU main building for About. Place Ilia, TSU evening, Rike Park, GTU and Batumi on the five requested Find audiences, and the river panorama on Opportunities. Keep the NEO image on its News post/cards. Store placements and focal points centrally. Secondary building headers use gentler desktop/mobile ratios to preserve facades. Lighten Home to 72%–58% black and make all overlaid text white; the worst-case white image pixel is #6b6b6b, to be checked at 4.5:1 minimum. Other header text stays outside photographs.


## 2026-10-29: Session 23 item 3, Commons attribution (Luka)
Use one bilingual credit macro on every placement and the footer-linked credits page. Preserve each Commons author name exactly, including the public-domain author, and link the supplied licence and exact file page. Label cropped/reformatted CC BY-SA adaptations as modified and retain the same image licence version; the Home credit additionally names the overlay. List all eight Commons records plus the existing permission-based NEO News image, without inventing an open licence for NEO.


## 2026-10-29: Session 23 item 4, responsive variants and local cache (Luka)
Generate local AVIF/WebP/JPEG at 320/640/960/1280/1920/2560px without enlargement. Only page hero/header images are eager/high-priority; News cards remain lazy. Keep originals out of output. Use Eleventy Image's source/encoder-content hashes with a local generated cache in .cache/portal-images, then copy only variants into the selected output root. PORTAL_IMAGE_CACHE_DIR may share that cache across isolated quality builds; no network fetch or skipped encoding is involved. Limit the Image queue to two sources to bound memory. Explicit encoder quality keeps the full mobile Home transfer under the existing 500,000-byte target; final measurements and worst-case contrast must pass before publication.


## 2026-10-29: Session 23 item 5, photograph regression checks (Luka)
Check all eight source hashes/dimensions and per-image README records, the exact placement map, every bilingual author/licence/file-page/modification credit, all six responsive widths in each format and prefix-safe generated paths. Assert source/ is absent from output. Add 390/1280px browser checks for decoded headers, credit focus, no source requests, no overflow and Home text/credit separation. Run axe with JavaScript enabled and native functionality checks with JavaScript disabled; retain the complete existing site/fixture sweeps and forced-colour checks. Record final results in the Session 23 review evidence.


## 2026-10-29: Session 23 item 6, final crop review and publication (Luka)
Keep Campus E's full source frame after review found that a desktop crop cut into its facade; describe that modification accurately. Add visible permission-based NEO News credits while retaining one link per card. Update the existing pointer check for both Commons credit links. Both clean layouts pass 172 tests, 109 full browser pages with zero axe violations, and 80 focused photo/News checks each. Eight cold mobile Lighthouse runs score performance 98–99 and accessibility 100; complete Home transfer is 288,384 bytes ka and 247,069 bytes en. Worst-case hero contrast is 5.33:1. Keep 80 before/after captures, provenance and raw results under review/session-23, and use a job-local generated-image cache in the Pages workflow. Push the six item commits and supplied asset history, open a PR against main and do not merge or launch. Hosted/manual review and the four launch stages remain.


## 2026-10-29: Session 24 item 1, central office facts (Luka)
Supersede “Supporting records and public contact placeholders” (2026-10-26) and the Session 20 scattered Person/contact/policy facts with src/_data/office.json and generated review/TBC.md. Store shared facts once, bilingual names explicitly, and show “The list of experts will be published once membership is confirmed.” / “ექსპერტების სია გამოქვეყნდება წევრობის დადასტურების შემდეგ.” for empty HERE membership.


## 2026-10-29: Session 24 item 2, reviewed one-switch launch (Luka)
Keep siteLaunched=false and outside CMS. A reviewed true value removes the preview and enables indexing/robots/hreflang sitemap, with authored and rendered marker checks that fail the build; github.io emits a warning only. No environment launch override exists.

## 2026-10-29: Session 24 item 3, staff collections and Settings group (Luka)
Supersede “Pages CMS for News and Events” (2026-10-26), expanding the News/Events-only CMS scope with the seven staff collections and office form. Source-verified CMS file entries save one path, so use one Settings group containing settings.json and office.json file entries; Team/HERE are office sections, with merge preserving siteLaunched. The build enforces integer years and cross-field rules unavailable in widgets.


## 2026-10-29: Session 24 item 4, approved WordPress page rules (Luka)
Wire the unambiguous top-level page mappings approved in the brief to validated HTML redirect stubs. Record every included/omitted row in migration/review/REDIRECTS-PAGES.md; leave ambiguous titles and unsupported programmes without a matching approved rule omitted. Move HERE now so the approved redirect targets exist.

## 2026-10-29: Session 24 item 5b, HERE under About (Luka)
Supersede “Supporting templates follow the approved sitemap” (2026-10-26) for HERE placement: use /ka/about/here/ and /en/about/here/ alongside Team/Contact, retaining redirect stubs at both former /here/ URLs. Central views drive switching, search and sitemap.

## 2026-10-29: Session 24 item 5, maintenance invariants (Luka)
Capitalise all three English modification sentences after the licence/source punctuation. Preserve historical source/deadline checks in isolated fixtures while rendering checks derive counts and contact facts from current content; staff additions and filled office facts must not freeze production counts.

Translation maintenance retains dynamic dictionary/state choices and checks identical bilingual key sets. Remove only keys without template, route, data or script references; preserve historical evidence and scripts referenced by documentation.

## 2026-10-29: Session 24 item 6, honest quality evidence (Luka)
Keep Action wording and EU text unchanged. Record wording changes and the bilingual glossary, enforce no U+2014, and run a manual external-link audit outside CI. Browser accessibility/resize/media evidence and serial mobile Lighthouse are local checks; state network limits and do not imply a real screen-reader or hosted review.


## 2026-10-29: Session 24 item 7, launch operations (Luka)
Use LAUNCH.md as the ordered runbook for launch, later domain move and institutional repository transfer, with named owners, verification and rollback. Correct Session 23’s merged status; retain Nino review, real facts, signed-grant review and hosted CMS checks as prerequisites, and record the blocked live GitHub documentation check.


## 2026-10-29: Session 24 final schema parity and fixture evidence (Luka)
Supersede the conditional English-alt rule in “Optional validated News images with responsive local output” (2026-10-27): all supplied images require ka/en alternatives. Require sourceChecked for Calls/FAQ/Resources/Publications and PDF-only local Publications, replacing historical text downloads with valid synthetic PDFs in isolated fixtures. Preserve News editorial regressions in isolated Session 24 snapshots so future staff records do not freeze archive counts.


## 2026-10-30: Session 25 item 1, confirmed office address and hours (Luka)
Luka confirmed on 2026-10-29: 47 Merab Kostava Street, Tbilisi, Georgia (მერაბ კოსტავას ქუჩა 47, თბილისი, საქართველო); Monday to Friday, 10:00 to 18:00 (ორშაბათიდან პარასკევის ჩათვლით, 10:00-დან 18:00-მდე). This supersedes the [TBC] status of contact.address and contact.hours in “Session 20, final contact layout and hidden social links” (2026-10-28). ERIDA’s registered address remains separately unconfirmed.


## 2026-10-30: Session 25 item 2, ordered Team role cards (Luka)
Supersede the role-card presentation in “Session 21 item 3, shared template restyling” (2026-10-29): show the role title once, labelled name, role email and body. Real role emails use mailto links; [TBC] stays plain text. Person records require integer order values; ascending order places Coordinator, Programme Officer, Communications Officer without relying on filenames.


## 2026-10-30: Session 25 item 3, target-language redirect stubs (Luka)
Supersede the Georgian-only chrome of “Session 24 item 4, approved WordPress page rules” (2026-10-29): every legacy stub, including former HERE routes, uses its target language and a translated “Continue to the new page” link. Root behaviour, noindex, canonical targets and all redirect validation remain unchanged.


## 2026-10-30: Session 25 item 4, remaining approved WordPress pages (Luka)
Supersede the omissions for the 15 paths listed in the Session 25 brief under “Session 24 item 4, approved WordPress page rules” (2026-10-29). Luka approved their Events, Opportunities, CB VET and Resources targets on 2026-10-29. Preserve exact encoded source paths and all decoded collision/target validation. Elementor drafts, placeholder-title page 34308 and blank /35915-2/ remain omitted; see migration/review/REDIRECTS-PAGES.md.

## 2026-10-30: Session 25 item 5, external-link review and sampling (Luka)
Supersede the exhaustive generated-link audit approach in “Session 24 item 6, honest quality evidence” (2026-10-29): check all hand-entered URLs and randomly sample generated project-result URLs, default 200, with incremental results and a polite Erasmus+ host delay. Record Luka’s supplied 2026-10-29 Claude review separately from local verification. Store final Guide/licence URLs in source; retain EPALE for a manual browser check. No network audit enters build, tests or CI.
