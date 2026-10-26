# Session 5 visual review

Before images were captured from the session 4 main baseline (11425f2) before the visual work. After images show the session 5 home design with local fonts settled and page JavaScript disabled. All are full-page screenshots at device scale 1, with a 900 px viewport height; widths are listed below. The mobile menu is closed initially. All content is sample content and the EU emblem is still a clearly labelled placeholder.

| Language | Viewport width | Before | After |
|---|---:|---|---|
| Georgian, /ka/ | 360 px | [Before](before-ka-360.png) | [After](after-ka-360.png) |
| Georgian, /ka/ | 1280 px | [Before](before-ka-1280.png) | [After](after-ka-1280.png) |
| English, /en/ | 360 px | [Before](before-en-360.png) | [After](after-en-360.png) |
| English, /en/ | 1280 px | [Before](before-en-1280.png) | [After](after-en-1280.png) |

[Font comparison](font-comparison.png): FiraGO versus the selected Noto Georgian/Latin faces at 16, 20 and 32 px. See [DESIGN.md](../../DESIGN.md) for licence, subset-size and readability findings.

Reproduce final home screenshots with a local dev server running: `TEST_URL=http://127.0.0.1:8080 node scripts/capture-design.mjs after`. Set PATH_PREFIX as well if the server uses the project path. The script checks before/after arguments to avoid accidental filename changes. Existing before images remain the historical baseline, so set SCREENSHOT_DIR=/tmp/neo-comparison when comparing a future session.

## Local mobile Lighthouse run

Lighthouse 13.5.0, system Chromium, built static site served locally, default mobile simulation. These measurements are not a hosted-site or real-device guarantee.

| Home | Performance | Accessibility | Best practices | SEO | LCP | CLS |
|---|---:|---:|---:|---:|---:|---:|
| Georgian | 99 | 100 | 96 | 66 | 1.7 s | 0.005 |
| English | 99 | 100 | 96 | 66 | 1.6 s | 0 |

The SEO score reflects the deliberately unlaunched, noindex state. The local server has no production cache policy and returned a missing-favicon console error; production headers/assets should be assessed on the hosted site. No indexing setting was changed to raise a test score.
