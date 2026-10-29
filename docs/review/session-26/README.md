# Session 26 visual redesign

Approved by Luka on 2026-10-30. Baseline origin/main: 53ed2e73de0ff560e3367a8815aa2ff650b42844. Reference: design/session-26-prototype, 49792765c230875387b0f0f746b604f375678eed, docs/design/session-26-prototype/{prototype.css,compare-home.png,compare-opportunities.png,compare-action-page.png,mobile-home.png}. Read and visually reviewed all five reference files. Production integrates the rules into site.css; prototype.css is not loaded or appended.

## Consolidation proof

Item 1 is a separate commit, before design changes. It merges repeated selectors, removes the obsolete in-main notice selector and overridden card-underline declaration, and orders styles as tokens, base, layout, header, components, page templates, utilities and responsive/system styles. Cascade dependencies were resolved explicitly rather than preserving layered overrides. All 72 before/consolidated screenshots match exactly after local fonts and every image decode. consolidation-diff.json records zero changed pixels for every capture. The declared tolerance was at most one pixel of height and 0.5% changed pixels at pixelmatch threshold 0.1, but no tolerance was needed for the final captures.

## Design and preserved invariants

See DESIGN.md for the new system and DECISIONS.md for each named supersession. Desktop hero text stays within the smaller of 46rem and 58% of the inner container. White-source-pixel contrast at its actual maximum right edge is 5.02:1 at 1024px, 5.01:1 at 1280px, 5.08:1 at 1440px and 5.81:1 at 1920px, in both languages. Pure tests parse the gradient stops; browser checks measure the rendered column.

At 320px the requested two-rem minimum made the longest Georgian Home word overflow without mid-word breaks, and the 1.05rem wordmark exceeded the funding emblem's height. The approved direction therefore has two recorded accessibility exceptions: a smaller headlines below 24rem and a smaller long Privacy title, and the prior compact mobile wordmark below 64rem. Desktop keeps the requested sizes. Sticky facts and sector labels clear the two-row header below 80rem; facts have bounded native scrolling.

Authored content, data, routes, translations, seven navigation destinations, fonts, colour tokens (apart from the navy alias and gold accent), EU originals/disclaimers, preview and siteLaunched=false remain. No production dependency or layout JavaScript is added. Exactly 16 office placeholders remain. Gold rules and icon tints are decorative; forced colours uses Canvas/CanvasText and Highlight.

## Evidence and reproduction

216 screenshots: before, consolidated and after, each with 12 routes, two language sweeps and 390/1280/1920px widths. Routes: Home, Opportunities, CBHE, Calls, Events, News list/article, Resources, About, Team, Contact and the existing shared bilingual 404. Each phase has screenshots.json. All fonts and images are decoded. The script suppresses refresh only in screenshot responses, preserving built markup. The shared 404 is captured in both language sweeps without changing its bilingual content.

Node 24.19.0 and npm ci. Use an independent source copy for the project-prefix build, linked to the locked node_modules, and a shared content-hashed image cache. Clean _site before each layout build. Commands:

```sh
npm ci
rm -rf _site
SITE_URL=https://example.org/ PATH_PREFIX=/ npm run build
SITE_URL=https://example.org/ PATH_PREFIX=/ PORTAL_IMAGE_CACHE_DIR=/workspace/neo-georgia-website/.cache/portal-images NODE_DISABLE_COMPILE_CACHE=1 npm test -- --test-concurrency=1
# Serve _site at /, then:
SITE_URL=https://example.org/ PATH_PREFIX=/ A11Y_WORKERS=1 TEST_URL=http://127.0.0.1:8080 PORTAL_IMAGE_CACHE_DIR=/workspace/neo-georgia-website/.cache/portal-images npm run check:a11y
# Repeat in the clean prefix copy with:
# SITE_URL=https://luka9815.github.io/neo-georgia-website/
# PATH_PREFIX=/neo-georgia-website/
# Mount its output at /neo-georgia-website/ for the browser sweep.
node scripts/check-session-26.js
node scripts/check-session-26-overflow.js
REVIEW_ROOT=/tmp/neo26-before REVIEW_PHASE=before node scripts/review-session-26.js
REVIEW_ROOT=/tmp/neo26-consolidated REVIEW_PHASE=consolidated node scripts/review-session-26.js
REVIEW_PHASE=after node scripts/review-session-26.js
node scripts/compare-session-26.js
# External audit installation, outside the repository:
npm install --prefix /tmp/neo26-audit lighthouse@13.6.0 pixelmatch@8.0.0 pngjs@7.0.0
LIGHTHOUSE_ROOT=/tmp/neo26-audit/node_modules REVIEW_ROOT=/tmp/neo26-before REVIEW_PHASE=before node scripts/measure-session-26.js
LIGHTHOUSE_ROOT=/tmp/neo26-audit/node_modules REVIEW_PHASE=after node scripts/measure-session-26.js
node scripts/compare-lighthouse-session-26.js
```

Lighthouse 13.6.0 runs serially with cold Chrome profiles, six requested routes in both languages, mobile default simulated settings and desktop 1350x940/1x with a 40ms RTT and 10Mbps throughput configuration. Scores are local uncompressed HTTP measurements, not hosted guarantees. No new Lighthouse dependency enters the lockfile. Full raw score/audit records are retained per phase. Browser crashes during concurrent axe runs led to serial reruns with A11Y_WORKERS=1; all rules, page coverage and existing fixture checks remain enabled.

Automated checks do not establish a complete manual WCAG audit or Nino's review. No hosted CMS, domain, signed-grant or launch operation is claimed. All remaining launch prerequisites and office facts are unchanged.

The Privacy page uses a stable page-slug class for its longer unbroken Georgian title, with clamp(1.4rem,4vw,3.4rem). Other inner titles scale down only below 24rem. A complete sweep confirms no overflow on all 109 real routes at 320px.

## Results

All 24 after Lighthouse performance/accessibility pairs meet or exceed the corresponding baseline: performance 98 to 100, accessibility 100. See LIGHTHOUSE.md, lighthouse-comparison.json and the full per-phase Lighthouse records. All 205 full tests pass in each layout. Browser geometry checks cover nine widths, actual hero contrast, EU prominence, title bands with a scrollbar present, sticky facts clearing the header, reduced motion and forced colours. All 216 screenshot responses are successful, and all 72 consolidation comparisons are exact.

Final complete npm run check:a11y sweeps pass in both layouts: 109 pages each with zero axe violations, retaining all editable-surface, image, calendar, project, search, populated-fixture, keyboard, language, no-JavaScript and forced-colour checks. Final reruns of all 205 tests pass per layout with no failures, skips or cancellations. Fresh root and prefix builds write 313 files each and Pagefind indexes 40 pages per language. clean-builds.json records the audited/clean-output checks. Logs include the resolved concurrent Chromium crashes separately from the successful final runs.
