# Handover

Last updated: 2026-10-30 (Codex, Session 27 header polish)

## Session 27 current state

Started from origin/main 6f331a8 on codex/session-27-header. Session 26 is merged and deployed. Session 27 implements items 0 to 6: progressive compact header, target-language link, native photo-credit disclosures, university Find fallback, language-policy placement and smaller EU footer. Keep siteLaunched=false, preview/noindex, routes, content, EU artwork and exact disclaimers. No replacement university JPEG has been supplied; both university Find pages use the non-photo header until Luka supplies a reviewed sharp daytime landscape, at least 2560px wide, with Commons file URL, author and verified licence. Do not substitute the About image.

Pages deploys failed from PR #23 to PR #27 because `${{ runner.temp }}` was used in job-level env. PR #25 (6f331a8) fixed this by setting the cache path in a step. First good deploy: 2026-10-30 11:32 UTC (15:32 Tbilisi). The API confirms success for [run 41048276503](https://github.com/Luka9815/neo-georgia-website/actions/runs/41048276503), completed 11:32:40 UTC. No workflow change is needed here.

Session 27 validation is complete: clean root/prefix builds, 205 tests per layout, all 109 real-page axe scans per layout with zero violations, and complete fixture reruns. Root's fixture navigation timeout and the prefix's obsolete whole-link line-count assertion are recorded with their successful reruns. Each layout also passes 42 open-credit axe scenarios and 72 photo/News cases (36 with axe). All 56 requested captures are in review/session-27. Header heights are 149.42px to 105.75px on wide desktop and 130px to 120px at 390px; every measured flag exceeds 38px and disclaimer contrast is 6.93:1.

All 24 final Lighthouse pairs meet Session 26's final baseline (performance 98 to 100, accessibility 100). Two full matrices plus three isolated repeats are retained, including large intermittent mobile timing outliers; the final comparison uses the latest chronological sample per target. No site change was made between audits. Review the variation and limits in review/session-27/README.md rather than treating local scores as a hosted guarantee. The PR is for review only. Post-merge Pages success and live verification are explicitly handed to Luka; no merge, launch or deployment is performed here.

## Session 26 merged baseline

Session 26 starts at origin/main 53ed2e7 (merged Session 25) on codex/session-26-design. Luka approved prototype 4979276 on 2026-10-30. The stylesheet is consolidated before redesign, with a separate baseline comparison. The new system uses an 82rem container, larger desktop scale, navy title/Action bands, a directional contrast-tested Home gradient, softer cards, sector rows, individual-route pills and navy figures. See DESIGN.md and the dated supersessions in DECISIONS.md. Mobile type exceptions preserve unbroken Georgian Home words at 320px and EU emblem prominence.

All content, translation strings, routes, fonts, original palette tokens, EU files/disclaimers, seven destinations, siteLaunched=false and preview bar remain unchanged. No production dependency or layout JavaScript is added. Exactly 16 office placeholders remain, and all launch prerequisites below still apply. Session 26 validation passes clean root/prefix builds, all 205 tests per layout and 109 browser pages per layout with zero axe violations. All 24 final Lighthouse pairs meet baseline (performance 98 to 100, accessibility 100). There are 144 requested before/after screenshots plus 72 exact consolidation captures. Evidence and reproduction are in review/session-26/README.md.

## Session 25 baseline


Session 24 is merged as PR #24, 661def8, verified against GitHub main. Session 25 starts from that commit on codex/session-25-follow-ups. Confirmed office address and hours supplied by Luka on 2026-10-29 now live in office.json. Exactly 16 central placeholders remain. Team cards use validated integer order, single role headings, labelled names and real-address mailto links. Every redirect stub follows its target language, with an accurate continuation link. Fifteen further approved WordPress page mappings are included; the excluded drafts/blank pages remain omitted.

Licence URLs store their trailing slash and the Programme Guide uses its final URL. See review/session-25/LINKS.md for Luka’s supplied Claude external review results and the manual checker’s incremental output, complete authored-link coverage, configurable project sample (default 200) and polite Erasmus+ host delay. EPALE stays unchanged, with a manual browser check assigned to Luka in LAUNCH.md. No fresh external network audit is claimed.

Session 25 validation: clean root and prefix builds, 201 tests per layout and 109 browser pages per layout with zero axe violations, retaining all existing fixture/rule checks. There are 48 bilingual before/after 390/1280px captures. Evidence, raw logs and reproduction are in review/session-25/README.md. siteLaunched remains false; preview/noindex and EU artwork/disclaimers remain. No launch, merge or hosted CMS operation is authorised.

## Session 23 baseline

Branch codex/session-23-photos starts from origin/main f4d07a1 (merged PR #22) and incorporates origin/assets/commons-photos c4886d6. Luka supplied eight Commons JPEGs and API attribution records. Full decoding, original/3840px dimensions, SHA-256 and visual-subject checks pass. No fresh live Commons metadata retrieval is claimed. Canonical provenance is src/assets/images/README.md, with runtime metadata in portalPhotos.json and reviewed placements in photoPlacements.json. The supplied COMMONS-SOURCES.md has been incorporated into the README. The previous handover is archived at archive/HANDOVER-SESSION-22.md.

Home uses the Sameba panorama: its wide composition works with both the desktop text and mobile crop. About uses the TSU main building. Student, university, youth, VET and sport Find pages use Ilia Campus E, TSU evening, Rike Park, GTU Building 0 and Batumi respectively. Opportunities uses the river panorama. Building focal points and gentler aspect ratios retain the facades; Campus E keeps its full supplied 4:3 frame because it is already tightly framed. The approved NEO dissemination image remains on its original News post/cards, with visible permission-based credit and unchanged alternative text.

All Commons placements have bilingual author/licence/file-page links and accurate modification notices. The footer-linked credits page lists all eight and the NEO permission-based image. Preserve exact attribution names and original CC BY-SA versions, including the public-domain author. Image adaptations retain their source licences; do not invent an open licence for the NEO photograph. Recheck the Commons file pages before launch.

Source JPEGs are build inputs only: source/ is excluded from passthrough and _site. Only responsive generated AVIF/WebP/JPEG variants, up to 2560px without enlargement, are deployed. Page hero/header images are eager/high-priority, News cards remain lazy. Home's minimum 58% black overlay with white text guarantees contrast over even a white image pixel; other header titles sit outside images. Eleventy Image caches content/encoder-hashed variants under .cache/portal-images and copies only variants into each output root. PORTAL_IMAGE_CACHE_DIR can share that cache across isolated quality builds; it never bypasses decoding/encoding for changed source bytes or encoder settings. The Pages job shares this cache through runner.temp across its build and isolated tests; it is not part of the uploaded artifact. Queue concurrency is two to bound memory. No new production dependency or external image request.

## Content and operations preserved

Keep siteLaunched=false, preview/noindex, existing routes, seven destinations, EU original artwork/whole-image derivatives and exact disclaimers unchanged. Nine Actions, eleven 2026 Calls, twelve FAQs, five bilingual News posts and all policy/role/contact content remain. The original 26 authored TBC occurrences originally mapped to 20 central office placeholders, now 16 after the confirmed address/hours; npm run report:tbc generates review/TBC.md. Production Events/Stories remain empty with fixture coverage; future genuine records restore them automatically. The 28 October project snapshot and all counts/mapping/coverage warnings are unchanged. No live project, map or photo fetch is added to builds/tests/CI.

Luka remains the sole Pages CMS editor. Hosted News create/build/check/delete is confirmed; hosted Event/image round trips remain unconfirmed. Daily Pages deploy remains 04:15 UTC (08:15 Tbilisi). Institutional ownership/transfer, final NEO facts, signed-grant review and hosted/manual checks remain as below. Newsletter/analytics remain deferred. No launch or merge is authorised by this session.

## Session 23 validation baseline

See review/session-23/README.md, report.json and raw logs for final results, before/after mobile measurements and 80 screenshot captures (all eight placements, credits and News, both languages at 390/1280px). Use Node 24 and npm ci. Clean _site before final builds. For full tests use NODE_DISABLE_COMPILE_CACHE=1 npm test -- --test-concurrency=1. Set PORTAL_IMAGE_CACHE_DIR to a shared temporary directory when testing isolated source copies to reuse content-hashed encodings; keep docs/review/session-20/SOURCES.json in those copies. Root/project-prefix builds still copy actual variants and run every existing test.

Run npm run check:a11y against the root server and against a prefix server with PATH_PREFIX=/neo-georgia-website/ and the corresponding SITE_URL. The complete sweeps retain every rule and all project/calendar/search/fixture/keyboard/forced-colour checks. scripts/check-session-23.js supplements them at 390/1280px with native checks without JavaScript and axe with JavaScript enabled, covering all photo headers plus retained News credits. Reproduce screenshots with scripts/review-session-23.js and REVIEW_PHASE=before/after. scripts/measure-session-23.js uses an external Lighthouse installation through LIGHTHOUSE_ROOT; run it serially with other workers idle. It also measures complete Home transfer with every image loaded. Local checks do not replace a hosted performance check or complete manual WCAG audit.

Final results: clean root and prefix builds pass, with 172 tests and 109 full browser pages per layout, zero axe violations. Each layout also passes 80 focused 390/1280px photo/News checks (40 axe, 40 without JavaScript). All eight mobile Lighthouse trials score performance 98–99 and accessibility 100. Complete Home transfer is 288,384 bytes (ka) and 247,069 bytes (en), below 500,000. Worst-case hero contrast is 5.33:1. Review/session-23 contains all 80 before/after captures, raw logs, source verification and before/after metrics. Both clean outputs exclude source originals.

## Prevailing language (closed 2026-10-30)

Luka decided to remove the prevailing-language statement entirely: the /language/ page, its footer link and the translation strings are gone. NEO Ukraine, Moldova and Armenia publish no such statement. The real page count is now 107 per layout (was 109). Nino may still raise it in her review; reintroducing it needs a new DECISIONS entry.

## Next step

Review the Session 27 PR on codex/session-27-header and evidence in review/session-27/README.md. After Luka merges it, confirm the Deploy GitHub Pages run succeeds and the live site shows the changes; this post-merge verification is explicitly handed to Luka because this session does not merge. Then obtain Nino’s content sign-off and approved office facts; follow LAUNCH.md in order. Do not merge or launch automatically. Hosted Event/image round trips, signed-grant review, domain and institutional transfer remain outside this session.

## Launch checklist

The ordered, checkable runbook is [LAUNCH.md](LAUNCH.md), with owners, verification and rollback for launch, domain move and repository transfer. These four approval stages remain required.

Keep siteLaunched=false and the preview/noindex state until these four stages are complete.

1. **(a) Nino’s final review of the whole site:** review Georgian/English content, all nine source-checked Actions and their authority/applicant/partner qualifications, the official deadlines/resources/publications, ERIDA/NEO roles, policies, navigation and mobile views. Include the new design, finder roles/contacts, chart interpretation, city aliases/unresolved counts and Commons photo placements. Use ACTION-REVIEW.md and the Session 20 content plus Session 21–23 design/photo review evidence. Include all Commons placements, source records, licences and adaptations. Final manual keyboard, screen-reader/language announcements, 200% text resize, 400% zoom/reflow, forced colours, reduced motion and Georgian readability review remain unconfirmed; automated axe does not replace them.
2. **(b) NEO facts from review/TBC.md:** supply phone and shared NEO email, ERIDA legal code and registered address, privacy and accessibility contacts, three team names and role emails, HERE members and social links. The office address and hours are confirmed separately and must not be reused as ERIDA’s registered address. Apply approved values in both languages, regenerate TBC.md and verify no missing fact remains. Supply real social URLs or leave the block hidden.
3. **(c) Signed grant agreement check:** expected at the end of November 2026 (Nino via Luka). Confirm funding wording, visibility and website obligations against the signed agreement. Until then retain the current EACEA model Article 17 wording, approved artwork and unchanged supplied Georgian disclaimer.
4. **(d) Separate launch change:** after approval, prepare siteLaunched=true and removal of the preview notice as a reviewed change. Before launch, complete the outstanding hosted Event/image round trips, encoded legacy emoji redirect and daily-rebuild confirmation; verify hosted metadata, sitemap, bilingual 404, language switches, redirects, calendar/ICS, indexing, accessibility and performance. Run clean root/project builds, full tests and browser checks after final content edits. Do not claim these hosted results from local tests or merge automatically.

## After launch

Additional staff access/training follows only when the team changes. Newsletter remains deferred until ERIDA has an institutional email and a free service account registered to it; later review terms/privacy before adding a sign-up link. No newsletter, analytics or wider content promotion is authorised by this release-candidate brief.

Session 24 final mobile Lighthouse: 34 serial template/language runs score performance 96–100, accessibility 100 and best practices 100. SEO remains 69 under the required preview/noindex state. All launch prerequisites remain in LAUNCH.md.
