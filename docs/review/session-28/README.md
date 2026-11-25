# Session 28 review

The branch starts at main `61fb55d`. The two clean output layouts retain 307 HTML paths, with identical page H1s, preview notices, robots metadata, EU artwork alternatives and exact rendered disclaimer text. Each Pagefind index contains 39 pages in its own language. The site launch flag stays false. See [build comparison](builds.json).

## Screenshots and template review

The [template audit](AUDIT.md) includes findings and before/after pairs. The [strings list](STRINGS.md) contains the new Georgian and British English interface text for Luka. Each screenshot directory has a manifest.

| Phase | Template views | Captures | Evidence |
| --- | ---: | ---: | --- |
| Main before Session 28 | 140 | 76 | [walk](before/audit.json), [screenshots](before/screenshots.json) |
| Session 28 | 140 | 76 | [walk](after/audit.json), [screenshots](after/screenshots.json) |

Both phases include full-page Home, Opportunities, News, Action, Events and Contact screenshots at 390px and 1280px in Georgian and English. There are also hover and focus captures for both hero buttons and an audience card, plus representative article, statistics, Publications, Calls, Find, Stories and footer captures. The populated Story and Event views use isolated fixtures.

## Browser sweep recovery

The first concurrent browser sweeps exhausted the environment's memory at the project-year tables. The revised runner closes each page's context after its scan. It runs axe directly for documents without frames and preserves frame collection when frames are present. The rule set, viewport checks and populated fixtures stay in the queue. Use `A11Y_TRACE=1` for the same route-by-route progress in the logs.

## Responsive behaviour and contrast

The focused browser checks visit 16 templates across each of five widths from 320px to 1920px in both languages. A three-column Opportunity trial at 1280px gave four lines on the longest Georgian title. The two-column layout fits that title and the remaining Georgian titles within two lines at desktop sizes.

The weakest of the 20 computed button state pairs is 6.34:1. Sector ink on tint ranges from 6.01:1 to 7.15:1. The photo check calculates the foreground contrast against a white source pixel using the computed overlay. It measures 10.37:1 for Figures versus 5.15:1 to 7.10:1 at the hero text edge across the tested widths. The figures credit remains usable in forced colours. The News grid yields unequal heights where the rendered content differs, with a 16:9 slot on both card types.

The focused checks cover adjacent band backgrounds, stretched links, credit disclosures, forced colours, reduced motion and the return link with JavaScript enabled and disabled. See [root results](browser-root.json) and [prefix results](browser-prefix.json).

## Reproduction

Use Node 24, Chromium and the locked dependencies. Build each layout into a clean output directory using a separate checkout or source copy. The image cache can be shared.

```sh
npm ci
export PORTAL_IMAGE_CACHE_DIR=/tmp/neo28-images
npm run build
NODE_DISABLE_COMPILE_CACHE=1 npm test -- --test-concurrency=1
# With a local server using the root of the built site:
A11Y_WORKERS=1 TEST_URL=http://127.0.0.1:8080 npm run check:a11y
node scripts/check-session-28.js
node scripts/review-session-28.js

# In a separate source copy with a clean _site:
export PATH_PREFIX=/neo-georgia-website/
npm run build
NODE_DISABLE_COMPILE_CACHE=1 npm test -- --test-concurrency=1
# With the local server serving the same project prefix:
A11Y_WORKERS=1 TEST_URL=http://127.0.0.1:8080 npm run check:a11y
node scripts/check-session-28.js
```

For the before captures, build `61fb55d` into a clean directory, then run the review script from the Session 28 checkout with `REVIEW_PHASE=before REVIEW_ROOT=/path/to/baseline`. The script builds isolated populated examples for the templates that have no live records.

Run Lighthouse with the same 13.6.0 settings as Session 27. It uses twelve mobile and twelve desktop audits, each with a fresh Chrome profile, and applies the latest chronological measurement per target if a repeat is needed. Its dependency installation stays outside the project.

```sh
npm install --prefix /tmp/neo28-audit lighthouse@13.6.0
LIGHTHOUSE_ROOT=/tmp/neo28-audit/node_modules \
  REVIEW_OUTPUT=docs/review/session-28/after node scripts/measure-session-27.js
node scripts/compare-lighthouse-session-28.js docs/review/session-28/after/lighthouse.json
```

Luka owns the post-merge GitHub Pages run and live-site verification. The preview and local checks support review before that point.
