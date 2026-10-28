# Handover

Last updated: 2026-10-28 (Codex, Session 19 projects and statistics)

## Current state

- Eleventy 3 ESM on Node 24 LTS with Nunjucks, Markdown body fields in JSON, plain CSS and self-hosted Noto Sans fonts. AGENTS.md is canonical; CLAUDE.md points to it. Both remain consistent. Read DECISIONS.md before changing settled behaviour.
- Georgian is primary, with English parity for core types. Seven main navigation destinations, nine bilingual [DRAFT] Actions grouped by sector, calls, Events, News, Stories, Resources, Publications, FAQ, Team/HEREs and Contact are implemented. Supporting records remain JSON-edited; Pages CMS edits News, Events and Settings only. Content and editor contracts are in CONTENT.md and EDITING.md.
- Opportunities remain a complete static sector-grouped list. Luka dropped filters on 2026-10-27 because nine Actions do not justify them; revisit only after substantial growth. Every card shows the translated Key Action label from the existing keyAction field. Virtual Exchanges appears in two sectors, with one record.
- Only neo-dissemination-event-2025.jpg is attached to its News post. The session 14 Georgian and English alternatives are approved by Luka. The unchanged original is in src/assets/uploads; session 13 generates local AVIF/WebP/JPEG responsive output, intrinsic dimensions, eager article loading and lazy card loading. The clarification graphic, statistics chart and Capacity Building infographic are omitted. The Europe Day photograph is permanently omitted by Luka. See NEWS-PROMOTION.md and NEWS-IMAGES.md.
- Exactly five bilingual old News posts are promoted under the existing CSV decisions. Other migration drafts and images remain outside public content. No new CSV decision, migration rerun or extra upload is authorised. Historical import evidence stays in migration/review and CONTENT.md; do not interpret suggestions as publication approval.
- Pagefind builds separate ka/en production indexes. Only search pages load search modules, and the active language index loads on submission. The Georgian query-only fallback removes at most one approved longest ending per word with at least four letters retained; nominative ა and ი are last. Typed results precede de-duplicated fallback matches. SEARCH.md and review/search-session-14.json retain measured recall and unchanged English URL evidence. Run a production build after content edits to refresh indexes.
- Calls and Events store offset-free wall-clock times with named timeZone values. Temporal rejects ambiguous/nonexistent times. currentCallYear selects the visible edition independently of the clock; daily rebuilds refresh computed statuses. Settings exposes currentCallYear and optional logoPath, while CMS merge mode preserves unmanaged keys.
- Hosting uses GitHub Pages and official GitHub Actions. Deploy on main push, manual dispatch and daily at 04:15 UTC (08:15 in Georgia). Builds use npm ci, build and tests; CI does not run browser accessibility checks. No Netlify/Cloudflare configuration, extra hosting account or deployment secret is needed.
- PATH_PREFIX defaults to /. The workflow derives the project prefix and Pages origin from repository owner/name. SITE_URL defaults to https://luka9815.github.io/neo-georgia-website/. HTML base rewriting covers internal assets/links; metadata and sitemap use the complete SITE_URL. For a custom domain, configure SITE_URL to the HTTPS root and PATH_PREFIX=/ and update workflow values. Recheck these after an institutional repository transfer.
- siteLaunched remains false in src/_data/settings.json, outside the CMS. All output is noindex and robots.txt disallows crawling. After all Launch checklist items are resolved and launch is approved, set true in a separate reviewed change. Redirects and the bilingual root 404 remain noindex. Root redirects to /ka/ without JavaScript; .nojekyll is deployed.
- Five approved decoded legacy paths generate static meta-refresh pages, not HTTP 301 responses. The four Capacity Building short links were resolved and replaced with direct official EU topic links on 2026-10-27; see NEWS-PROMOTION.md. Do not revive the obsolete short-link review task.
- English prevails in discrepancies. The exact supplied Georgian disclaimer is proofread by Luka and is a project translation. Luka explicitly reversed the earlier KA artwork rejection: the verified Commission Georgian funding emblem appears on /ka/ with alt “ევროკავშირი საქართველოსთვის”; /en/ keeps English. The existing image pipeline generates whole-image PNG size derivatives while original bytes, whitespace, aspect ratio and the white box remain intact. Adjacent statements are omitted because both artworks carry them. Original artwork provenance is in src/assets/eu/README.md.

## Session 17 identity and archive

The home-link wordmark uses officeName exactly: “ერაზმუს+ საქართველოს ეროვნული ოფისი” in Georgian and “National Erasmus+ Office Georgia” in English. The Georgian source differs from the prompt example; it is retained and flagged in DECISIONS. No NEO graphic logo will be designed or used, and no Erasmus+ programme artwork is used. logoPath is retained for a future approved logo, but remains empty. The E+ favicon uses type and site colours only. Browser checks compare wordmark/emblem dimensions and the emblem's white box at 320, 360, 600, 768, 1024 and 1280 px.

News now publishes exactly five bilingual legacy posts. update-1, update-2 and update-3 are moved intact to test/fixtures/news, copied only into isolated CMS/image/fallback test sites. Their public routes, sitemap entries and search documents are absent. Both News lists use source-only excerpts of up to 30 words; details show the stored publication day and readable 65ch text. Render-only cleanup removes an exact repeated title, makes standalone bold section labels navigable headings and repairs missing emphasis/line-break boundaries. No promoted body wording, fact, date or official topic link was changed. See review/session-17/README.md for the 360 px/desktop review and editorial questions.

Sample Events are still published: information-day, webinar and past-session (both languages). Proposed launch cleanup: first move their calendar, registration/agenda, CMS and relationship coverage into isolated fixture sites, then remove the live JSON, update production checks to use the remaining approved catalogue, clean output and verify their routes/search/sitemap entries are absent. Do not delete test coverage to remove samples. This session does not unpublish Events.

The branch starts from the initially fetched main and merges origin/assets/ka-emblem (23bda43, verified checksum). Session 16 was carried locally while GitHub still reported its PR open. The final fetch found main at 578e2fc with PRs #15 and #16 merged; that updated main is now merged into this working branch. Synchronisation added only the Session 15 changelog entry and did not change tested code. The PR targets the updated main; Codex did not merge any PR or change main.

## Turn on GitHub Pages: completed

2026-10-27, confirmed by Luka: GitHub Pages is enabled with Source: GitHub Actions and the hosted deployment works. No activation or first-deployment task remains. Daily schedule monitoring is tracked only in the Launch checklist.

## Test Pages CMS: News completed

2026-10-27, confirmed by Luka: the hosted News create, build, check and delete round trip completed successfully. This confirmation covers the News round trip only. The unconfirmed Event round trip and image round trip are tracked only in the Launch checklist; local JSON/build checks do not establish those hosted results. Staff instructions remain in EDITING.md.

## Validation

Use Node 24 LTS from .nvmrc and npm ci. Remove ignored _site before the final build so obsolete pages cannot survive.

Root: npm run build, then npm test. Serve the built _site directory on a local HTTP server and run npm run check:a11y (TEST_URL defaults to http://127.0.0.1:8080).

Project layout: PATH_PREFIX=/neo-georgia-website/ SITE_URL=https://luka9815.github.io/neo-georgia-website/ npm run build, then npm test with the same variables. For browser checks, serve output under that URL prefix and set PATH_PREFIX and TEST_URL to the server origin. Tests also create isolated project-prefix and custom-domain builds and validate links, metadata, sitemap, legacy redirects, launch flags, CMS shapes and image output.

The accessibility script uses /usr/bin/chromium (override CHROMIUM_PATH). It checks every non-redirect page with axe, 320 px overflow, keyboard skip links and language switches, no-JavaScript navigation, Publications filters, search, visible Action labels and decoding of the approved News image. These are automated checks, not a complete WCAG audit.

## Session 17 validation

Clean root and project builds pass, with all 102 tests in each layout, including the isolated project-prefix/custom-domain and responsive-image checks. Axe passes all 71 non-redirect pages per layout with zero violations. Browser checks include keyboard/language navigation, search, Publications filters, actual News image decoding, no-JavaScript controls/Action labels, 320 px overflow and EU emblem prominence/white-box checks at six widths from 320 to 1280 px. The five-post archive and both lists were visually reviewed in both languages at 360 and 1280 px with JavaScript disabled.

Original emblem checksums, derivative dimensions and files, exact office names, favicon, original News source wording/links/dates, five-card listings, absence of sample News routes and the isolated Georgian-only fallback are covered. The page count falls from 76 to 71 because the three Georgian/two English sample News routes are removed. Representative screenshots, per-route observations and content questions are in review/session-17/README.md. The Georgian disclaimer remains byte-for-byte the approved translation value.

Session 16's Lighthouse results in review/session-16 are historical measurements before this identity/archive work. They are not a new performance score for Session 17. The remaining manual and hosted checks appear only in the Launch checklist.

## Session 18 partner shortcuts

The bilingual Find partners page is linked from Opportunities and every Action. PARTNER-TOOLS.md records eight official destinations checked 2026-10-27. It adds navigation only; all Action wording stays unchanged. Recheck links during routine maintenance. Luka verified the current school partner-search URL in his normal browser on 2026-10-27. PARTNER-TOOLS.md retains the earlier automated 403 results as history; the normal-browser verification task is complete.

## Session 18 Event calendar

/events/ stays the default list. The bilingual /events/calendar/ tables and ICS downloads are built from the existing Event JSON without new dependencies or a network request. Per-language Event files live at /<lang>/events/<slug>/event.ics; the feed is /<lang>/events/upcoming.ics. UIDs are neo-georgia-event-<slug>, with no domain or @ part. Preserve Event slugs for stable UIDs across languages/hosts. Luka confirmed no ICS files have been published to users, so the pre-merge UID change has no subscriber impact. The daily rebuild refreshes the feed; downloads are snapshots. Calendar dates use the Event's named zone. Sample Events remain labelled and must be replaced or removed using the existing fixture-first Launch checklist. Removing them also removes their calendar entries and ICS files on a clean build.

## Session 19 projects and statistics

PR #19 review: visible bilingual notes beside the year and Action comparisons now explain that 2014–2020 international credit mobility with Georgia (KA107) is not identifiable in the source and is not counted. KA171 country entries do not make higher education mobility comparisons across 2020/2021 meaningful. No records/counts are changed.

Start from the supplied data branch 3cc2d40, main 14902c4 plus one source commit. PR #18 is merged. The search-service JSON replaces the expected CSV, with 6,764 projects and an official 2022 XLS sample. Read migration/source/README.md, CONTENT.md and the current implementation section in SITE-PLAN.md.

Bilingual projects indexes/year tables and statistics are built from validated local metadata only. Homepage figures are 6,764 projects, 605 named Georgian organisations and 106 Georgian-coordinated projects. Statistics also show 5,079 institution participations and 2,045 mobility-country projects separately. Preserve the raw 606/7,124 source totals in tests. No funding, descriptions, results, contacts, beneficiary websites/media, per-project detail pages or project CMS fields are published. All nine Actions retain [DRAFT] and unchanged wording.

PROJECT-ACTION-MAP.md lists all 39 exact source labels and their reviewed mapping for Luka. Original source titles/names remain unchanged, source status is preserved, calendar dates use Brussels and all public project/statistics pages carry source/snapshot/build attribution. Year tables are complete without JavaScript and excluded from Pagefind after size measurement. No live fetch belongs in a build, test or CI.

## Session 18 editorial changes

EVE Georgian now says seven participations across three funded projects without changing figures. Dissemination Georgian has only the ten spelling replacements listed with counts in CHANGELOG; published totals and time windows remain intact. The November 2025 clarification body is unchanged, with a separate bilingual note dated 2026-10-27 linking to current Action pages. Migration evidence remains unchanged. No Action wording changes are made.

## Session 18 scope

Restart from main eabf728 on codex/session-18-features. All nine Actions and the shared Georgia eligibility note retain [DRAFT] and unchanged wording. ACTION-REVIEW.md lists the session's Action wording changes separately: none. Projects and statistics are planning only, awaiting Luka's official CSV export; no importer or public dataset is authorised.

## Session 18 validation

Clean root and project-prefix builds pass, with all 111 tests in each layout. Axe passes all 75 non-redirect pages per layout, covering both languages with zero violations. Checks include 320 px overflow, skip links/language switches, no-JavaScript mobile/desktop menus, Publications, search, image decoding, and native calendar keyboard scrolling and ICS download navigation in both languages. Partner/calendar views were captured at 320/1280 px for visual review. These remain automated/local checks; the hosted/manual Launch checklist stays open.

ICS tests cover spring and autumn Brussels DST boundaries in both languages, rejected ambiguous/nonexistent wall times, Tbilisi UTC conversion, stable UIDs across dates/languages/hosts, RFC text escaping, CRLF and UTF-8 folding, generated per-Event/feed links, zero-duration Events and leap/multi-day month boundaries. Source-preservation tests allow only the logged News corrections, compare original numeric tokens and protect unchanged English/clarification bodies.

Action JSON and shared Georgia eligibility text are byte-for-byte unchanged from eabf728. AGENTS.md remains canonical and CLAUDE.md remains its pointer; both are unchanged and consistent. siteLaunched=false, migration evidence and dependencies are unchanged. No importer or project/statistics data/routes are added. One commit per brief item; the final item records validation findings, including unique calendar region labels and chronological feed sorting by resolved instants.

## PR #18 review fixes and validation, 27 October 2026

UIDs now use exactly neo-georgia-event-<slug>, with no domain or @ part. The Static Event calendar and iCalendar files decision records Luka's reasoning and confirms no subscriber impact because no ICS files have been published to users. Luka verified the school partner-search URL in his normal browser on 2026-10-27; PARTNER-TOOLS.md closes that check and retains automated 403 results as history.

After these fixes, clean root and project-prefix builds pass and all 111 tests pass in each layout. The project-prefix run uses an isolated copy of the committed branch so the two outputs remain independent. Browser checks pass all 75 non-redirect pages per layout, both languages, with zero axe violations, including 320 px overflow, keyboard/language navigation, no-JavaScript controls, calendar scrolling and ICS downloads. All eight generated ICS files per layout use the exact domain-independent UID form; named-zone/DST tests still pass in both languages.

Three separate review commits cover the UID correction, browser-verification record and validation results. Push to the same codex/session-18-features branch and keep PR #18 open for review. All nine Actions remain [DRAFT] and unchanged; the remaining Launch checklist and siteLaunched=false still apply.

## Session 19 validation, measurements and remaining capture

Clean root and project-prefix builds pass. Both full suites pass all 132 tests, including source/per-year facts, the strict public projection, complete exact-label mapping, institution-versus-mobility-country counts, complete static rows/original titles, page-size limits, attribution, homepage figures and seven offline manual-refresh checks. CMS/image/redirect isolated sites use small synthetic project snapshots.

Axe scans cover 105 non-redirect pages per layout, both languages, with zero violations. The project-prefix full browser command passes. In the root run, the complete scan preceded a render-state timing assertion in the new CSS filter check; waiting for rendered state fixes it, and both-language project/filter/reset/keyboard checks plus the remaining search stage pass on focused rerun. Full/targeted browser checks also cover 320 px overflow, keyboard/language navigation, no-JavaScript menus/controls, Publications, images and calendar downloads. Native Action/sector fragments filter groups with an All projects reset; older CSS engines retain the complete anchor-linked list.

There are 111 HTML files per layout (30 added), not thousands of project detail pages. Root output grows from 2,900,139 to 11,856,455 bytes; Pagefind from 1,315,137 to 1,324,245 bytes after excluding year tables. The largest year page is 579,207 bytes. Root single-run build time is 6.361 s before and 13.027 s after; final runs overlapped other validation and are not controlled benchmarks. Detailed counts, prefix sizes, mapping and representative captures are in review/session-19.

The supplied README omits the exact POST body, Origin, pagination fields and raw response paths. scripts/fetch-projects.js therefore requires a confirmed captured request configuration; no production template is invented, no live refresh was run and live reproduction remains unverified. It writes only ignored raw pages/candidates/reports and never replaces the approved source. Obtain and validate the capture before marking that part complete. Keep the PR in draft while this gap remains.

## Next task

Review the Session 19 draft PR and full Action mapping without automatic merging. Supply the missing production refresh capture and verify it before marking source reproduction complete, then work through the remaining Launch checklist. All nine Actions remain [DRAFT]. Opportunity filters remain dropped; no wider content promotion is authorised.

## Session 19 homepage figures

The homepage now uses the supplied snapshot: 6,764 projects, 605 named Georgian organisations and 106 Georgian-coordinated projects, all linking to statistics with snapshot date 28 October 2026. The illustrative figures/sampleNumber/figuresNote task is complete. Other sample translations and records remain on the Launch checklist.

## Remaining work

The Launch checklist is the single list of launch blockers. Optional later work, such as image support beyond News, wider migration, additional search refinement or analytics, needs a separate brief and does not authorise additional content promotion. No analytics is currently installed; any future choice must preserve the privacy rules.

## Waiting on Nino / NEO

The signed grant agreement is expected at the end of November 2026 (Nino via Luka, 2026-10-27). Keep the current EACEA model grant agreement Article 17 wording until then. Funding wording and website obligations must be rechecked against the signed agreement before launch. Review of the nine [DRAFT] Actions also remains open.

## Launch checklist

Keep siteLaunched=false until this single ordered list is complete. Completed Pages activation and the News create/build/check/delete round trip are recorded above. The current GitHub Pages address can remain in use; a domain change is not a present blocker.

1. **(a) Luka hosted checks:** complete the Event round trip on a temporary branch, including the new-form timeZone default, select values, both languages, minute-precision date/end values, optional agendas/registration and save/reopen/build behaviour.
2. **(a) Luka hosted checks:** complete the CMS image upload/save/reopen round trip with an approved test image, check shared src and both alternatives, inspect responsive output and remove temporary test content. Do not use another review image.
3. **(a) Luka hosted checks:** request the encoded historical emoji URL on Pages and verify it reaches the intended bilingual News post. Local output checks do not establish hosted URL decoding.
4. **(a) Luka hosted checks:** confirm a daily rebuild completes and refreshes time-sensitive statuses. Monitor failures and re-enable after inactivity if needed. The configured time is 04:15 UTC, 08:15 in Georgia.
5. **(a) Luka manual checks:** review keyboard focus, screen-reader landmarks/headings and language announcements, search/live regions, Publications filtering, calendar table navigation/scrolling and ICS downloads, 200% text resize, 400% zoom/reflow, forced colours, reduced motion and Georgian readability. Check document/recording accessibility and repeat final hosted accessibility/performance checks after content changes.
6. **(b) Nino / NEO:** review all nine [DRAFT] Actions in both languages: icm, erasmus-mundus, cbhe, jean-monnet, cb-vet, cb-youth, youth-mobility, virtual-exchanges and cb-sport. Use ACTION-REVIEW.md for coordinator/partner distinctions, the Georgia authority exclusion and CBHE Strand 3 clarification.
7. **(b) Nino / NEO:** confirm funding wording and website obligations against the signed grant agreement, expected at the end of November 2026, and current visibility requirements. Until then retain the current EACEA model grant agreement Article 17 wording. Keep the approved Georgian artwork and unchanged supplied disclaimer unless that review produces a new explicit decision.
8. **Editor status, confirmed 2026-10-27:** Luka is the sole editor until further notice (Nino via Luka). No additional editor names are needed for launch. Record Luka as the maintenance contact by role; additional editor access and training with EDITING.md move to after launch.
9. **(a) Luka editorial preparation:** replace or explicitly omit the remaining sample Calls/Events: call/cbhe-2025, call/cbhe-2026, call/icm-2026, call/jean-monnet-2026; event/information-day, event/past-session, event/webinar. Use the fixture-first Event removal proposal above. Supply approved dates, time zones, venues, links, agendas and relationships for retained production records.
10. **(a) Luka editorial preparation:** replace or omit story/example; resource/guide and resource/session-notes; faq/sample-application, faq/sample-guidance and faq/sample-mobility; person/sample-here and person/sample-team; publication/sample-brochure and publication/sample-report with their two sample text files; page/about, page/accessibility and page/privacy. These are the remaining 20 sample records when combined with the Calls/Events in item 9. News samples are already isolated fixtures, not launch content.
11. **(a) Luka editorial preparation:** replace or remove every remaining sample translation value in both languages: sample, purpose, empty, contactPlaceholder, socialPlaceholder, homeHeadline, homeGuideTitle, homeGuideBody, contactAddress, contactHours and contactEmail. The two unused logo placeholder/name keys are removed. Keep the noindex preview notice until the final launch copy is agreed; do not merely strip sample markers from illustrative claims.
12. **Editorial status, Session 18:** Luka approved the EVE Georgian seven-participations correction, enumerated dissemination spelling corrections and a dated bilingual context note above the unchanged historical clarification. Dissemination totals and time windows remain unchanged as published source figures. See CHANGELOG for each correction; all other content questions in review/session-17/README.md remain subject to editorial review.
13. **(c) Remaining code tasks:** move remaining sample-dependent checks into isolated fixtures before removing live samples, apply approved records/translations and validate relationships, local files, alternatives, dates and links. Resolve code findings from hosted/manual review.
14. **(c) Remaining code tasks:** run clean root/project builds, the full suite and browser checks after final content edits. At the current Pages address, verify metadata, sitemap, language switches, bilingual 404, root/legacy redirects, calendar/ICS downloads and launch indexing behaviour. After the remaining checks and approval, prepare siteLaunched=true as a separate reviewed change.

## Later Luka task: domain and institutional ownership

When a domain change is chosen later, ensure ERIDA registration/ownership and a written transfer agreement if retaining erasmus.org.ge. Confirm institutional repository transfer arrangements, authorised redirect coverage and website obligations, then update SITE_URL, PATH_PREFIX and workflow values. Verify the final address, HTTPS, canonical/hreflang/OG URLs, sitemap, language switches and redirects after the change. This is not a request for Nino to decide a domain now.


## Post-launch work

- Luka is the sole editor for now. When additional editors are named, arrange GitHub access and training using EDITING.md.
- Newsletter: deferred until ERIDA has an institutional email and a free mailing-service account registered to it, for example MailerLite free tier. Then review service terms, privacy/consent wording and add a sign-up link. No sending, form, account or sign-up link is implemented in Session 18.
