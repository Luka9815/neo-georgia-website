# Session 27 review, 30 October 2026

Branch codex/session-27-header starts at origin/main 6f331a8973d460e5c19e0a422957e69748391b38. Items 0 to 6 have separate commits; a final quality commit records measured refinements and evidence. Do not merge or launch automatically.

## Scope and retained content

The deferred 23-line dependency-free header enhancement has >96/<24 hysteresis, initial state, passive scroll/RAF scheduling and a header-only ResizeObserver for real sticky offsets. Without JavaScript, the complete full header works. Language switching is one named target-language link with a decorative globe. Native © disclosures retain author/licence/file/modification content, with unchanged full credits apart from withdrawn tsuEvening. News credits remain text. University Find uses the non-photo header until Luka supplies a verified replacement; the excluded original and historical provenance remain.

The footer keeps the language-page link and unchanged statement on that page, pending Nino's English/Georgian decision. Whole-image EU artwork is smaller, with unchanged files and disclaimer strings. Clean-builds.json checks unchanged content, EU/fonts, settings, office facts, project source and all existing translation values. Only two UI keys are added. There are still 16 office placeholders; preview/noindex and siteLaunched=false remain.

## Captures

56 PNGs: 28 before from the exact main baseline and 28 after. Each phase has screenshots.json. Seven states in both languages at 390/1280px: Home top, Home scrolled, hover, CBHE Action, university Find, About with an open credit and the footer. Baseline About shows the then-visible caption. Footer captures include the full footer element; other captures use a 900px viewport. Local fonts and images are decoded. The contact-sheet review and full-size captures show the intended hierarchy, retained bilingual content and photo crops.

## Geometry and accessibility

browser-root.json and browser-prefix.json retain the full focused native/axe results: 20 language/width/script configurations, each measuring full and scrolled states; 42 open-credit axe views per layout. Widths are 320/390/1024/1280/1920px. Keyboard Enter/Space, same-language targets, 44px controls, overflow, mid-page reload, hysteresis and Action-facts clearance are checked. Photo controls are also exercised without JavaScript, with reduced motion/forced colours and print. browser-*-header.json repeats geometry after animations and observed height variables have settled, avoiding a frame sampled during a transition under CPU load. The complete sweep additionally checks 360/600/768px native navigation and emblem prominence.

The retained Session 23 photo checker now covers seven active placements plus News: 72 bilingual/script/width views per layout, including 36 axe scans, credit focus/pointer access, decoded images and no source requests. No axe rule is removed. The full 109-page sweeps retain editable-surface, calendar, project, search, populated-fixture, skip-link, language, no-JavaScript and forced-colour checks.

footer-rendered-geometry.json measures blue bounds in the actual selected decoded PNG bitmap, including derivative rounding, at six widths. footer-source-geometry.json records the flag's blue-pixel bounds in each original, including anti-aliased edges, and the displayed-height calculation using actual browser image width. Disclaimer #4b5b70 on #ffffff has 6.93:1 contrast. Both original blue colours are preserved, without recolouring.

## Reproduce

Use Node 24 and npm ci. Set PORTAL_IMAGE_CACHE_DIR to a shared temporary path to reuse content-hashed encodings across isolated copies. Include .github, .pages.yml and docs/review/session-20/SOURCES.json in the prefix source copy; link the locked node_modules. Clean _site before each build. Root uses PATH_PREFIX=/; the prefix copy uses PATH_PREFIX=/neo-georgia-website/ and SITE_URL=https://example.org/neo-georgia-website/. Serve outputs at their matching URL prefixes.

```sh
npm run build
NODE_DISABLE_COMPILE_CACHE=1 npm test -- --test-concurrency=1
A11Y_WORKERS=1 TEST_URL=http://127.0.0.1:8080 npm run check:a11y
TEST_URL=http://127.0.0.1:8080 node scripts/check-session-23.js
node scripts/check-session-27-fixtures.js
node scripts/check-session-27.js
node scripts/measure-footer-session-27.js
REVIEW_PART=header node scripts/check-session-27.js
node scripts/measure-footer-session-27.js
REVIEW_ROOT=/tmp/neo27-before REVIEW_PHASE=before node scripts/review-session-27.js
REVIEW_PHASE=after node scripts/review-session-27.js
# External only, not a project dependency:
npm install --prefix /tmp/neo27-audit lighthouse@13.6.0
LIGHTHOUSE_ROOT=/tmp/neo27-audit/node_modules node scripts/measure-session-27.js
node scripts/compare-lighthouse-session-27.js
```

Lighthouse uses the same 13.6.0 serial cold-profile settings as Session 26: default simulated mobile, desktop 1350x940/1x with 40ms RTT and 10Mbps. Six routes in each language and device, 24 pairs, are compared against Session 26's final after matrix, not its older baseline. All attempted score/audit matrices are retained. Run with other browser/build/test workers idle. Local uncompressed HTTP scores do not establish hosted performance.

## Deployment and remaining review

GitHub API confirms Deploy GitHub Pages run 41048276503 at main 6f331a8 succeeded, completed 2026-10-30 11:32:40 UTC. Luka supplied the live-site confirmation in the brief; this environment's attempted live-page read was unavailable, so no independent live visual verification is claimed. After Luka merges this PR, the successful Pages run and live header/language/credit/footer changes must be checked. That post-merge work is explicitly handed to Luka. No merge or deployment is performed here.

Nino's language-precedence decision, replacement university JPEG/provenance, manual Georgian/readability and complete WCAG review, remaining office facts and all LAUNCH.md prerequisites remain open. Automated axe and Chromium media emulation do not replace a human screen-reader or hosted review.


## Measured header and footer

At 1280/1920px, both languages measure 149.42px full and 105.75px compact. At 390px they measure 130px and 120px; at 320px, 134.75px and 124.75px. At 1024px, Georgian navigation retains two rows (199.53px to 149px); English has one row (140.94px to 105px). Final height variables track these actual states, with a 16/17px gap to sticky Action facts. No-JavaScript measurements retain the full state.

Actual displayed flag heights, including whole-image PNG resize rounding:

| Viewport | Georgian flag | English flag |
| --- | ---: | ---: |
| 320px | 44.50px | 45.50px |
| 390px | 44.50px | 45.50px |
| 1280px | 55.16px | 56.40px |
| 1920px | 55.16px | 56.40px |

Every flag exceeds 38px. The 600px full Georgian wordmark is capped at 240px to preserve emblem prominence; above 48rem the cap is 17rem. Original artwork, white box and exact disclaimer wording remain unchanged.


## Browser-run recovery

Both complete 109-page queues passed every axe rule and the overflow/skip/language assertions. The root run then timed out after 30 seconds navigating to Statistics during the Projects fixture, while the other full sweep was running. The prefix run passed Projects, then reached an obsolete search check that counted client rectangles for the whole language link: decorative SVG plus span plus text produced three rectangles, rather than three text lines. The check now ranges over the label text and still requires one line at 320px. No accessibility rule or functional coverage is dropped and all default timeouts remain. Both layouts rerun the complete existing fixture set separately with scripts/check-session-27-fixtures.js. Raw initial and final logs are retained separately. The existing photo checker is also updated to open native credit disclosures before checking their links, and to omit the withdrawn university placement.

Fresh clean builds update the deliberately printed project buildTime. The root comparison records 30 timestamped HTML changes and 18 derived Pagefind artifacts; all other pages and all asset bytes match the tested output. Clean-builds.json records these expected differences, rather than claiming every byte is unchanged.


## Final results and Lighthouse variation

Clean root and prefix builds pass, with 309 HTML pages, 126 active Commons variants and 40 search pages per language in each output. All 205 tests pass per layout with no failures, skips or cancellations. Both 109-page browser queues pass all axe rules; both complete fixture sets pass on separate reruns. Each layout also passes 42 open-credit axe scenarios and 72 retained photo/News scenarios, including 36 additional axe scans. There are 56 requested before/after captures.

Two complete 24-run Lighthouse matrices and three isolated repeats use the same unchanged site, cold Chrome profiles and Session 26 settings, with other browser/build/test workers idle. The first matrix has Georgian mobile Opportunities/CBHE outliers (76/67); isolated CBHE returns 100 without a site change. The second matrix has a Georgian About outlier (69) and English Calls at 99; their isolated repeats return 98 and 100. Other one-point differences are retained in the raw matrices. These timing spikes did not reproduce on the isolated repeats; their cause is not established. This environment's scores vary, so they are observations rather than a stable hosted guarantee.

The final 24-target matrix uses the latest chronological sample for every target, never the maximum. All 24 final performance/accessibility pairs meet or exceed Session 26's final baseline: performance 98 to 100, accessibility 100. lighthouse-reports.json lists the source reports; after/lighthouse-initial.json, after/lighthouse-repeat.json, diagnostic/ and recheck-01/02 retain every original result, with full diagnostic reports. Reproduce the final comparison with:

```sh
node scripts/finalize-session-27-lighthouse.js docs/review/session-27/after/lighthouse-repeat.json docs/review/session-27/recheck-01/lighthouse.json docs/review/session-27/recheck-02/lighthouse.json
node scripts/compare-lighthouse-session-27.js
# To repeat one target with unchanged settings, for example:
REVIEW_PHASE=recheck LIGHTHOUSE_ROUTE=about/ LIGHTHOUSE_LANG=ka LIGHTHOUSE_DEVICE=mobile SAVE_LHR=1 node scripts/measure-session-27.js
```
