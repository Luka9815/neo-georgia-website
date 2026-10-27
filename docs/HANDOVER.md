# Handover

Last updated: 2026-10-27 (Codex, session 16: decisions, approved News photograph and launch preparation)

## Current state

- Eleventy 3 ESM on Node 24 LTS with Nunjucks, Markdown body fields in JSON, plain CSS and self-hosted Noto Sans fonts. AGENTS.md is canonical; CLAUDE.md points to it. Both remain consistent. Read DECISIONS.md before changing settled behaviour.
- Georgian is primary, with English parity for core types. Seven main navigation destinations, nine bilingual [DRAFT] Actions grouped by sector, calls, Events, News, Stories, Resources, Publications, FAQ, Team/HEREs and Contact are implemented. Supporting records remain JSON-edited; Pages CMS edits News, Events and Settings only. Content and editor contracts are in CONTENT.md and EDITING.md.
- Opportunities remain a complete static sector-grouped list. Luka dropped filters on 2026-10-27 because nine Actions do not justify them; revisit only after substantial growth. Every card shows the translated Key Action label from the existing keyAction field. Virtual Exchanges appears in two sectors, with one record.
- Only neo-dissemination-event-2025.jpg is attached to its News post. The session 14 Georgian and English alternatives are approved by Luka. The unchanged original is in src/assets/uploads; session 13 generates local AVIF/WebP/JPEG responsive output, intrinsic dimensions, eager article loading and lazy card loading. The clarification graphic, statistics chart and Capacity Building infographic are omitted. Europe Day stays without an image pending NEO consent confirmation. See NEWS-PROMOTION.md and NEWS-IMAGES.md.
- Exactly five bilingual old News posts are promoted under the existing CSV decisions. Other migration drafts and images remain outside public content. No new CSV decision, migration rerun or extra upload is authorised. Historical import evidence stays in migration/review and CONTENT.md; do not interpret suggestions as publication approval.
- Pagefind builds separate ka/en production indexes. Only search pages load search modules, and the active language index loads on submission. The Georgian query-only fallback removes at most one approved longest ending per word with at least four letters retained; nominative ა and ი are last. Typed results precede de-duplicated fallback matches. SEARCH.md and review/search-session-14.json retain measured recall and unchanged English URL evidence. Run a production build after content edits to refresh indexes.
- Calls and Events store offset-free wall-clock times with named timeZone values. Temporal rejects ambiguous/nonexistent times. currentCallYear selects the visible edition independently of the clock; daily rebuilds refresh computed statuses. Settings exposes currentCallYear and optional logoPath, while CMS merge mode preserves unmanaged keys.
- Hosting uses GitHub Pages and official GitHub Actions. Deploy on main push, manual dispatch and daily at 04:15 UTC (08:15 in Georgia). Builds use npm ci, build and tests; CI does not run browser accessibility checks. No Netlify/Cloudflare configuration, extra hosting account or deployment secret is needed.
- PATH_PREFIX defaults to /. The workflow derives the project prefix and Pages origin from repository owner/name. SITE_URL defaults to https://luka9815.github.io/neo-georgia-website/. HTML base rewriting covers internal assets/links; metadata and sitemap use the complete SITE_URL. For a custom domain, configure SITE_URL to the HTTPS root and PATH_PREFIX=/ and update workflow values. Recheck these after an institutional repository transfer.
- siteLaunched remains false in src/_data/settings.json, outside the CMS. All output is noindex and robots.txt disallows crawling. After all Launch checklist items are resolved and launch is approved, set true in a separate reviewed change. Redirects and the bilingual root 404 remain noindex. Root redirects to /ka/ without JavaScript; .nojekyll is deployed.
- Five approved decoded legacy paths generate static meta-refresh pages, not HTTP 301 responses. The four Capacity Building short links were resolved and replaced with direct official EU topic links on 2026-10-27; see NEWS-PROMOTION.md. Do not revive the obsolete short-link review task.
- English prevails in discrepancies. The exact supplied Georgian disclaimer is proofread by Luka and is a project translation. The original English Funded by the European Union beneficiary emblem appears on both languages with translated alternatives until the correct Georgian beneficiary file arrives. The KA country-branding file is not a substitute. Original artwork provenance is in src/assets/eu/README.md.

## Turn on GitHub Pages: completed

2026-10-27, confirmed by Luka: GitHub Pages is enabled with Source: GitHub Actions and the hosted deployment works. No activation or first-deployment task remains. Daily schedule monitoring is tracked only in the Launch checklist.

## Test Pages CMS: News completed

2026-10-27, confirmed by Luka: the hosted News create, build, check and delete round trip completed successfully. This confirmation covers the News round trip only. The unconfirmed Event round trip and image round trip are tracked only in the Launch checklist; local JSON/build checks do not establish those hosted results. Staff instructions remain in EDITING.md.

## Validation

Use Node 24 LTS from .nvmrc and npm ci. Remove ignored _site before the final build so obsolete pages cannot survive.

Root: npm run build, then npm test. Serve the built _site directory on a local HTTP server and run npm run check:a11y (TEST_URL defaults to http://127.0.0.1:8080).

Project layout: PATH_PREFIX=/neo-georgia-website/ SITE_URL=https://luka9815.github.io/neo-georgia-website/ npm run build, then npm test with the same variables. For browser checks, serve output under that URL prefix and set PATH_PREFIX and TEST_URL to the server origin. Tests also create isolated project-prefix and custom-domain builds and validate links, metadata, sitemap, legacy redirects, launch flags, CMS shapes and image output.

The accessibility script uses /usr/bin/chromium (override CHROMIUM_PATH). It checks every non-redirect page with axe, 320 px overflow, keyboard skip links and language switches, no-JavaScript navigation, Publications filters, search, visible Action labels and decoding of the approved News image. These are automated checks, not a complete WCAG audit.

## Session 16 automated results

Clean root and project builds pass, with all 98 tests in each layout, including isolated project-prefix/custom-domain checks. Axe 4.14.0 with Playwright 1.64.1 and Chromium 154 passes all 76 non-redirect pages per layout with zero violations, 320 px overflow, keyboard/language navigation, no-JavaScript menus/Action labels, Publications filters, search and actual News image decoding.

Ad hoc Lighthouse 13.0.1 audited 21 requested URLs (ten per language plus the shared bilingual root 404). Accessibility scores are 100 throughout. Unchanged pages score 98 to 100 for mobile performance. Georgian Publications initially scored 88 with intermittent CLS 0.2222; initialising the small enhancement after its form before list painting reduces measured CLS to 0.0036 to 0.0043. Three final Georgian runs score 99, 97 and 99; English scores 100. No new project dependency was added. The Georgian article photograph and Action labels were visually inspected at 320 px.

Method, per-page scores and initial/repeat/final evidence are in review/session-16/README.md and the adjacent JSON files. These are local automated observations, not a complete WCAG audit or hosted performance guarantee. Manual and hosted checks are recorded once in the Launch checklist below.

## Next task

Review this session's PR without automatic merging, then work through the Launch checklist. Opportunity filters are dropped; no target-group data expansion is required. Earlier session state and measurements remain in CHANGELOG and the subject documents, rather than duplicate launch lists here.

## Remaining work

The Launch checklist is the single list of launch blockers. Optional later work, such as image support beyond News, wider migration, additional search refinement or analytics, needs a separate brief and does not authorise additional content promotion. No analytics is currently installed; any future choice must preserve the privacy rules.

## Waiting on Nino / NEO

See Launch checklist items marked (b), including explicit confirmation of consent to reuse the Europe Day photograph of identifiable children. Until confirmed, omit that image. Working documents remain in Google Drive Cowork/NEO; code and implementation documentation live in this repository.

## Launch checklist

Keep siteLaunched=false until this single ordered list is complete. Sections (a), (b) and (c) identify the owner/type of work. Completed hosted activation and News round-trip checks are recorded above and are not repeated here. All sample records listed below need approved replacement or an explicit editorial decision to remove them, with dependent tests moved to isolated fixtures so coverage survives.

1. **(a) Luka hosted checks:** complete the Event round trip on a temporary branch. Verify the new-form timeZone default, select values, both language objects, minute-precision date/end values without offsets, optional agendas/registration and save/reopen/build behaviour before any real content merge.
2. **(a) Luka hosted checks:** upload an approved test image through Pages CMS, save and reopen it, inspect shared src and both language alternatives, verify responsive output in both languages after deployment and remove temporary test content. Do not use another review image for this test or leave test content published.
3. **(a) Luka hosted checks:** request the encoded historical emoji URL on GitHub Pages and verify its meta refresh reaches the intended bilingual News post. See NEWS-PROMOTION.md and src/_data/redirects.json; local output tests do not establish hosted decoding.
4. **(a) Luka hosted checks:** confirm at least one daily scheduled rebuild completes and refreshes time-sensitive statuses. Monitor failures and re-enable a schedule disabled after inactivity. The configured time is 04:15 UTC, 08:15 in Georgia.
5. **(a) Luka manual checks:** review keyboard focus visibility/order, screen-reader landmarks/headings, language announcements, search/live regions, Publications filters, 200% text resize and 400% zoom/reflow, forced colours, reduced motion and Georgian readability on mobile and desktop. Check image descriptions and document/recording accessibility; resolve findings before sign-off. Repeat performance and accessibility checks on final hosted content, since local lab scores do not establish deployed behaviour.
6. **(b) Nino / NEO:** approve all nine [DRAFT] Actions in both languages: icm, erasmus-mundus, cbhe, jean-monnet, cb-vet, cb-youth, youth-mobility, virtual-exchanges and cb-sport. Review eligibility and terminology against ACTION-REVIEW.md, including coordinator/partner distinctions, the Georgia authority exclusion and the CBHE Strand 3 EACEA clarification. Approve the historical clarification News text and the newly written English Europe Day title in NEWS-PROMOTION.md.
7. **(b) Nino / NEO:** replace every [SAMPLE] Call and Event: call/cbhe-2025, call/cbhe-2026, call/icm-2026, call/jean-monnet-2026; event/information-day, event/past-session, event/webinar. Supply approved dates, time zones, venues, links, agendas and relationships as appropriate.
8. **(b) Nino / NEO:** replace every [SAMPLE] News, Story and Resource: news/update-1, news/update-2, news/update-3; story/example; resource/guide, resource/session-notes. Retain missing-English and CMS coverage using isolated fixtures before removing live samples.
9. **(b) Nino / NEO:** replace every [SAMPLE] supporting record: faq/sample-application, faq/sample-guidance, faq/sample-mobility; person/sample-here, person/sample-team; publication/sample-brochure, publication/sample-report and their assets/publications/sample-brochure.txt and sample-report.txt files; page/about, page/accessibility and page/privacy. Supply approved profiles, useful accessible publications and final privacy/accessibility statements.
10. **(b) Nino / NEO:** approve replacement copy for every [SAMPLE] translation value in both src/_data/ka.json and en.json: sample, purpose, empty, contactPlaceholder, socialPlaceholder, sampleNumber, logoPlaceholder, homeHeadline, homeGuideTitle, homeGuideBody, figuresNote, contactAddress, contactHours and contactEmail. This includes the preview notice, opportunity-individuals placeholder, home figures, contact/social information and empty-state text. Remove unused placeholder keys or replace them explicitly; do not just strip markers from illustrative claims.
11. **(b) Nino / NEO:** supply the approved NEO logo with bilingual alternatives and permission to use it. Keep logoPath empty until approved; do not download the old site's logo.
12. **(b) Nino / NEO:** obtain the official Georgian Funded by the European Union beneficiary emblem from the EU Delegation or EACEA. Confirm its identity and provenance; the EU for Georgia country-branding artwork is not acceptable.
13. **(b) Nino / NEO:** decide the domain after the build and ensure ERIDA registration/ownership, with a written transfer agreement if retaining erasmus.org.ge. Confirm institutional repository ownership/transfer arrangements and any required old-site redirect coverage before domain migration.
14. **(b) Nino / NEO:** check the funding statement, emblem and disclaimer against the signed grant agreement and current Article 17/EACEA requirements. English prevails; do not silently change the supplied Georgian project disclaimer.
15. **(b) Nino / NEO:** confirm consent to reuse europe-day-in-kutaisi.png, which shows identifiable children, or confirm permanent omission. It remains unpublished until consent is confirmed. The other three omitted graphics are not pending selection.
16. **(b) Nino / NEO:** identify the staff editors and complete training with EDITING.md, GitHub access and repository-authorisation checks, ownership and a maintenance contact. Approve final bilingual content, privacy and accessibility statements and give launch sign-off after all findings are resolved.
17. **(c) Remaining code tasks:** after approved content/assets arrive, move sample-dependent tests to isolated fixtures, apply approved records and translations, integrate the approved logo and official Georgian beneficiary emblem without altering original artwork, and validate all production relationships, local files, alternatives, dates and links. Resolve code findings from the manual/hosted review; none may be waived by the automated scores.
18. **(c) Remaining code tasks:** implement the agreed final domain/repository configuration and authorised redirect coverage if required. Verify SITE_URL, PATH_PREFIX, deployment workflow, sitemap, canonical/hreflang/OG URLs, bilingual 404, language switches, root and legacy redirects at the final address. Run clean root/project builds, the full suite and browser checks after final edits. Only then prepare the separately approved siteLaunched=true change and verify indexing output.
