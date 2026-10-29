# Session 22 design polish review, 29 October 2026

Baseline: origin/main e166d94, merged PR #21. Branch: codex/session-22-polish. No launch or merge. Authored content, data, existing URLs, EU artwork/disclaimers and siteLaunched=false remain unchanged. Only the requested Home description placement changes; descriptions remain on Opportunities. New photo credits use /<lang>/about/credits/.

## Visual evidence

before/ and after/ each contain 24 full-page screenshots: Home, Find index, student audience, CBHE Action, News and About, in ka/en at 390/1280px. Each phase has screenshots.json with HTTP status and filenames. JavaScript is disabled, local fonts are ready and all images are decoded before capture. Reproduce with a local root server and REVIEW_PHASE=before/after TEST_URL=http://127.0.0.1:8141 node scripts/review-session-22.js. Capture the before phase from e166d94 and after from this branch.

Single-destination Action, audience, News, Resource and Publication cards use one stretched native link. Multi-destination Call/finder guidance retains explicit Action and source links to preserve approved destinations. No nested interactive controls or scripted card navigation. Mobile audiences use compact rows that can grow for long Georgian labels; desktop shows five columns. The Home hero retains an accurate caption for the approved NEO event rather than implying a campus photograph.


| Page | Language | Width | Before | After |
| --- | --- | ---: | --- | --- |
| home | ka | 390 | [Before](before/home-ka-390.png) | [After](after/home-ka-390.png) |
| action | ka | 390 | [Before](before/action-ka-390.png) | [After](after/action-ka-390.png) |
| find | ka | 390 | [Before](before/find-ka-390.png) | [After](after/find-ka-390.png) |
| audience | ka | 390 | [Before](before/audience-ka-390.png) | [After](after/audience-ka-390.png) |
| about | ka | 390 | [Before](before/about-ka-390.png) | [After](after/about-ka-390.png) |
| news | ka | 390 | [Before](before/news-ka-390.png) | [After](after/news-ka-390.png) |
| home | ka | 1280 | [Before](before/home-ka-1280.png) | [After](after/home-ka-1280.png) |
| action | ka | 1280 | [Before](before/action-ka-1280.png) | [After](after/action-ka-1280.png) |
| find | ka | 1280 | [Before](before/find-ka-1280.png) | [After](after/find-ka-1280.png) |
| audience | ka | 1280 | [Before](before/audience-ka-1280.png) | [After](after/audience-ka-1280.png) |
| about | ka | 1280 | [Before](before/about-ka-1280.png) | [After](after/about-ka-1280.png) |
| news | ka | 1280 | [Before](before/news-ka-1280.png) | [After](after/news-ka-1280.png) |
| home | en | 390 | [Before](before/home-en-390.png) | [After](after/home-en-390.png) |
| action | en | 390 | [Before](before/action-en-390.png) | [After](after/action-en-390.png) |
| find | en | 390 | [Before](before/find-en-390.png) | [After](after/find-en-390.png) |
| audience | en | 390 | [Before](before/audience-en-390.png) | [After](after/audience-en-390.png) |
| about | en | 390 | [Before](before/about-en-390.png) | [After](after/about-en-390.png) |
| news | en | 390 | [Before](before/news-en-390.png) | [After](after/news-en-390.png) |
| home | en | 1280 | [Before](before/home-en-1280.png) | [After](after/home-en-1280.png) |
| action | en | 1280 | [Before](before/action-en-1280.png) | [After](after/action-en-1280.png) |
| find | en | 1280 | [Before](before/find-en-1280.png) | [After](after/find-en-1280.png) |
| audience | en | 1280 | [Before](before/audience-en-1280.png) | [After](after/audience-en-1280.png) |
| about | en | 1280 | [Before](before/about-en-1280.png) | [After](after/about-en-1280.png) |
| news | en | 1280 | [Before](before/news-en-1280.png) | [After](after/news-en-1280.png) |

## Photography blocked

The Commons API request returned CONNECT HTTP 403 from envoy on 2026-10-29. The descriptive User-Agent and full query are in src/assets/images/README.md. No 429 or Retry-After was returned; no API metadata was received. Per Luka's instruction, stop new photography and use no substitute source. No new images or licences are claimed.

Exact selected file page for Luka to download into src/assets/images/source/: https://commons.wikimedia.org/wiki/File:Tbilisi_State_University.jpg (previously verified rugbyxm, CC BY 2.0, https://creativecommons.org/licenses/by/2.0/). Recheck current metadata, width of at least 1600px and visual suitability before acceptance. No other exact files were selected before the API block. The requested 6 to 8 new photos and About/Find/Opportunities/sector photo placements remain pending. Existing page captions and new bilingual footer-linked credits expose the approved NEO source without asserting an open licence.

## Reproduction and limits

Use Node 24 and npm ci. Clean _site before npm run build. Root tests: NODE_DISABLE_COMPILE_CACHE=1 npm test -- --test-concurrency=1. Prefix build/tests: PATH_PREFIX=/neo-georgia-website/ SITE_URL=https://luka9815.github.io/neo-georgia-website/, using an isolated complete source copy with the locked node_modules available. Preserve docs/review/session-20/SOURCES.json in that copy. Serve the generated output under the prefix and run TEST_URL=http://127.0.0.1:8142 PATH_PREFIX=/neo-georgia-website/ npm run check:a11y.

Browser checks use Chromium and axe with every rule enabled, covering every non-redirect route and the existing fixtures/enhancements. The portal checks add 320px normal/forced colours, JavaScript disabled, reduced motion, audience-row dimensions, whole-card focus, keyboard navigation, visible hero dimensions and pointer access to its credit. Contrast tests bound the hero's minimum 82% black overlay against a worst-case white pixel, plus the existing palette pairs. Screenshots and automated checks are local evidence, not a hosted guarantee or complete manual WCAG audit.

Lighthouse uses external Lighthouse 13.6.0 (not a production dependency), default simulated mobile throttling, cold navigation and a local uncompressed HTTP server. Run serially with other browser/build/test workers idle: REVIEW_PHASE=after LIGHTHOUSE_ROOT=/tmp/s22-lighthouse/node_modules TEST_URL=http://127.0.0.1:8141 node scripts/measure-session-22.js. before/lighthouse.json and after/lighthouse.json retain individual audit limits. The after run also measures complete Home transfer at 390px/DPR2 with JavaScript disabled, cache disabled and all images forced eager, including below-fold News and the EU footer. CDP encodedDataLength totals are checked against 500,000 bytes.

## Final validation

Clean builds pass in root and project-prefix layouts. Both full test runs pass 171 tests, zero failures. Both complete browser sweeps pass 109 pages with zero axe violations, plus the existing fixture and enhancement checks. Latest focused portal checks also pass in both layouts, including the image/credit hit tests. Full logs are in root-tests.txt, prefix-tests.txt, root-browser.txt and prefix-browser.txt. Original content/data/EU source paths have no diff from e166d94. The only new translation field is the requested credits label.

| Page | Language | Performance before → after | Accessibility before → after | Navigation bytes before → after |
| --- | --- | --- | --- | ---: |
| home | ka | 100 → 99 | 100 → 100 | 190,619 → 192,526 |
| action | ka | 99 → 100 | 100 → 100 | 143,871 → 149,650 |
| statistics | ka | 100 → 100 | 100 → 100 | 190,372 → 196,007 |
| find | ka | 100 → 100 | 100 → 100 | 189,745 → 195,380 |
| home | en | 99 → 98 | 100 → 100 | 163,397 → 167,393 |
| action | en | 100 → 100 | 100 → 100 | 118,768 → 124,349 |
| statistics | en | 100 → 100 | 100 → 100 | 156,396 → 161,833 |
| find | en | 100 → 100 | 100 → 100 | 152,068 → 157,505 |

All eight after scores meet performance 90+ and accessibility 100. Scores vary between cold local trials; the small Home change remains within the target, and no performance improvement is claimed. Navigation byte totals are distinct from the stricter complete-image budget below.

- Complete Home, ka: 274,749 bytes, below 500,000 bytes, at 390px/DPR2 with every image loaded.
- Complete Home, en: 233,455 bytes, below 500,000 bytes, at 390px/DPR2 with every image loaded.

Worst-case Home hero contrast is 13.58:1 for white text and 11.07:1 for inverse-muted text over a white photograph pixel beneath the minimum overlay. The caption has its own opaque background.

