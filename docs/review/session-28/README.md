# Session 28 review

The branch starts at main `61fb55d`. The two clean output layouts retain 307 HTML paths, with identical page H1s, preview notices, robots metadata, EU artwork alternatives and exact rendered disclaimer text. Each Pagefind index contains 39 pages in its own language. The site launch flag stays false. See [build comparison](builds.json).

## Screenshots and template review

The [template audit](AUDIT.md) includes findings and before/after pairs. The [strings list](STRINGS.md) contains the new Georgian and British English interface text for Luka. Each screenshot directory has a manifest.

| Phase | Template views | Captures | Evidence |
| --- | ---: | ---: | --- |
| Main before Session 28 | 140 | 76 | [walk](before/audit.json), [screenshots](before/screenshots.json) |
| Session 28 | 140 | 76 | [walk](after/audit.json), [screenshots](after/screenshots.json) |

Both phases include full-page Home, Opportunities, News, Action, Events and Contact screenshots at 390px and 1280px in Georgian and English. There are also hover and focus captures for both hero buttons and an audience card, plus representative article, statistics, Publications, Calls, Find, Stories and footer captures. The populated Story and Event views use isolated fixtures.

## Build and browser results

| Check | Root | Project prefix |
| --- | --- | --- |
| Clean build | [Passed](logs/root-build.log) | [Passed](logs/prefix-build.log) |
| Full tests | [213 passed](logs/root-tests.log) | [213 passed](logs/prefix-tests.log) |
| Full browser queue and fixture checks | [107 pages, zero axe violations](logs/root-a11y.log) | [107 pages, zero axe violations](logs/prefix-a11y.log) |
| Focused browser cases | [10 language/width combinations, 8 open-credit scans, 20 button state measurements](browser-root.json) | [10 language/width combinations, 8 open-credit scans, 20 button state measurements](browser-prefix.json) |

## Browser sweep recovery

The first concurrent browser sweeps exhausted the environment's memory at the project-year tables. The revised runner closes each page's context after its scan. It runs axe directly for documents without frames and preserves frame collection when frames are present. The rule set, viewport checks and populated fixtures stay in the queue. Use `A11Y_TRACE=1` for the same route-by-route progress in the logs.

## Responsive behaviour and contrast

The focused browser checks visit 16 templates across each of five widths from 320px to 1920px in both languages. A three-column Opportunity trial at 1280px gave four lines on the longest Georgian title. The two-column layout fits that title and the remaining Georgian titles within two lines at desktop sizes.

The weakest of the 20 computed button state pairs is 6.34:1. Sector ink on tint ranges from 6.01:1 to 7.15:1. The photo check calculates the foreground contrast against a white source pixel using the computed overlay. It measures 10.37:1 for Figures versus 5.15:1 to 7.10:1 at the hero text edge across the tested widths. The figures credit remains usable in forced colours. The News grid yields unequal heights where the rendered content differs, with a 16:9 slot on both card types.

The focused checks cover adjacent band backgrounds, stretched links, credit disclosures, forced colours, reduced motion and the return link with JavaScript enabled and disabled. See [root results](browser-root.json) and [prefix results](browser-prefix.json).

## Lighthouse

The final local matrix uses Lighthouse 13.6.0, Chromium 154 and the Session 27 settings. All 24 targets scored 100 for accessibility. Performance ranged from 95 to 100. Nineteen targets met or exceeded their Session 27 score. Five fell short after isolated reruns.

| Target | Session 27 | Session 28 |
| --- | ---: | ---: |
| Mobile Georgian Home | 99 | 95 |
| Mobile Georgian Opportunities | 99 | 98 |
| Mobile Georgian News article | 99 | 98 |
| Mobile English News article | 100 | 99 |
| Desktop Georgian Home | 100 | 98 |

The comparison uses the latest chronological sample for each route, language and device. Fresh main samples on this machine also varied relative to their historical scores. The no-JavaScript fallback had a desktop layout issue during an earlier trial. The final selector scopes its layout to the parsed fallback link and the browser evidence confirms that it takes zero space with JavaScript. The corrected Georgian desktop Home sample still had 0.085 cumulative layout shift. A heading-font preload trial gave the same mobile scores. The requested performance target remains unmet.

- [Final comparison](lighthouse-comparison.json)
- [Full serial matrix for the corrected build](after/lighthouse.json)
- [Isolated rechecks for the corrected build](lighthouse-recheck-04/lighthouse.json)
- [Concurrent diagnostic](lighthouse-concurrent/lighthouse.json), [first rechecks](lighthouse-recheck-01/lighthouse.json), [paired main samples](lighthouse-recheck-02/current-environment-baseline.json) and [paired Session 28 samples](lighthouse-recheck-02/lighthouse.json) from the earlier revision
- [Font and initial return-link state trial](lighthouse-trial/lighthouse.json) and [fallback diagnostic](lighthouse-fallback-diagnostic/lighthouse.json)

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
node scripts/compare-lighthouse-session-28.js \
  docs/review/session-28/after/lighthouse.json \
  docs/review/session-28/lighthouse-recheck-04/lighthouse.json
```

Luka owns the post-merge GitHub Pages run and live-site verification. The preview and local checks support review before that point.
