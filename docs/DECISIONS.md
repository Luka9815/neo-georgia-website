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
- Hosting: Netlify or Cloudflare Pages (test both in the first build session).
- Staff editor: Decap CMS or Pages CMS (test with hosting; check whether editors need GitHub accounts).
- Bilingual file layout for content (must work with the chosen CMS).
- Search: Pagefind or alternative, after testing with Georgian.
- Analytics: cookieless option to choose.
- Scheduled daily rebuild method (so call and event status stays current).
- Domain: keep erasmus.org.ge (needs written transfer from current host before January 2027) or new domain. Decision by Nino; most urgent.
- Prevailing language in case of discrepancy (current site says English prevails). Decision by Nino.
- Actions that get their own page, confirmed against the current Programme Guide. Decision by Nino.
- Font: FiraGO or Noto Sans Georgian plus Noto Sans.
- Georgian disclaimer text (no official EACEA version).


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
