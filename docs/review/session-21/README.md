# Session 21 review

29 October 2026. Base origin/main 0350527, branch codex/session-21-redesign, [PR #21](https://github.com/Luka9815/neo-georgia-website/pull/21). No merge or launch.

## Per-item result

| Item | Status | Commit |
| --- | --- | --- |
| Design system | Complete: tested blue/teal/warm palette, 8px scale, Noto, sticky header, three-column footer, local icons | cdfcc5e |
| 1. Home | Complete: photo introduction, audience and nine Action tiles, figures/mini-chart, News and compact empty updates | 97dd52d |
| 2. Actions | Complete: icon/Key Action heroes, eligibility/role/deadline/source sidebars, computed project links | 3643c63 |
| 3. Other templates | Complete: shared restyling and native FAQ accordions; existing routes/enhancements retained | 1500bd7 |
| 4. Photos | Complete using the permitted one-photo fallback; approved NEO image, responsive variants and provenance/credit | 7b3472d |
| 5. Finder | Complete: five bilingual static audience pages plus index, qualified roles/next steps/contacts | 98872c8 |
| 6. Charts | Complete: year, Action/sector, status and top-15 organisations; labelled SVG and equivalent tables | 36a38c8 |
| 7. Map | Complete: whole national outline, 40 reviewed coordinate records, keyboard links and table; 38 unresolved counts explicit | 1fccb8e |

A final quality/review commit contains evidence, tests and review fixes. Existing content records, the project snapshot/mapping, settings, EU originals/disclaimers, dependencies and old URLs are unchanged. New finder routes add 12 HTML pages. All nine Action bodies retain exact wording, and all 26 authored TBC occurrences remain. No new approval by Nino is inferred.

## Verification

Clean isolated root and project-prefix builds pass. Full npm test suites pass **167/167 each**, with zero failures. Both complete browser checks pass **107 non-redirect pages each**, zero axe violations, 320px overflow checks, skip/language keyboard navigation, native menus at six widths, Publications filters/reset, approved image decoding, empty/fixture calendars and ICS, projects and search. The new portal checks pass in both languages with page JavaScript disabled, normal/forced colours and reduced motion: finder navigation, FAQ Enter/Space, chart scrolling and SVG bubble/table links.

Full logs are in [logs](logs), structured results in [report.json](report.json), and file-size metrics in metrics-before.json, metrics-root.json and metrics-prefix.json. Existing source regression checks retain 6,764 projects, 605 named identifiers, 5,079 institution participations, 106 Georgian coordinators, 2,045 mobility-country entries and raw 606/7,124 totals. No live project refresh.

Use Node 24.19.0, Chromium 154.0.8037.57 and locked dependencies. Tests used NODE_DISABLE_COMPILE_CACHE=1 and --test-concurrency=1 because the restored local Node compile cache suppressed some parameterised-case output. Browser pages use two independent workers. All axe rules still run; returning full node details only for violations avoids carrying thousands of successful cell results back to Node. No test or rule is excluded.

Review fixes include the visible-text language name, unique landmark roles, date assertions scoped separately to sidebar/cards, readable city callouts and focus markers, a documented 0.005-degree simplified-coast tolerance for Batumi, and scrolling checks that handle native restoration at either edge. The two regional control points must remain strictly within the whole border.

## Lighthouse mobile and transfer

Default simulated mobile throttling, one cold navigation per page/language, local uncompressed HTTP serving, Lighthouse 13.6.0. Final after runs are serial, with build/test/browser workers idle. Scores are local samples, not field measurements or a complete WCAG audit. The first trial ran concurrently with heavy checks and produced unstable timing scores; its complete results remain in [lighthouse-loaded.json](after/lighthouse-loaded.json). It is not used as the comparable final measurement.

| Language | Page | Performance before → after | Accessibility before → after | Transfer bytes before → after |
| --- | --- | --- | --- | --- |
| ka | home | 100 → 91 | 100 → 100 | 160,530 → 190,619 |
| ka | action | 100 → 100 | 100 → 100 | 133,805 → 143,871 |
| ka | statistics | 100 → 100 | 100 → 100 | 134,470 → 190,372 |
| en | home | 83 → 100 | 100 → 100 | 175,583 → 163,397 |
| en | action | 96 → 100 | 100 → 100 | 109,664 → 118,768 |
| en | statistics | 100 → 92 | 100 → 100 | 110,664 → 156,396 |

Both final Home transfers are below 500,000 bytes **including the selected hero variant**, stricter than the requested exclusion of the largest variant. Fonts total 99,184 bytes against 140,000. The evaluated FiraGO heading subset would raise this to 159,252 bytes, so Noto is retained. No chart library or new production dependency.

## Images, map and source limits

One expressly approved NEO dissemination photograph is reused on Home/About with visible credit. It is not described as openly licensed. A CC BY campus candidate was verified, but its binary download was blocked by environment policy; no additional AV file with individual rights confirmed was accepted. Icon/colour panels are the brief’s permitted fallback. See [image provenance](../../../src/assets/images/README.md) and [source register](SOURCES.md).

Natural Earth supplies the single public-domain whole-border outline, including Abkhazia and the Tskhinvali region/South Ossetia without internal divisions. The committed GeoNames coordinate/alias table has 40 records. There are 567 mapped named organisation IDs plus 38 unresolved (23 missing, 5 conflicting, 10 without reviewed alias/coordinate). The unresolved bubble is non-geographic, above the outline; bubble/table totals are exactly 605. No guessed coordinates, name-based institution merges or third-party requests. The coordinate date records inspection of a packaged source, not a live refresh. See [map provenance and update method](../../../src/assets/maps/README.md).

## Before/after visual evidence

48 full-page PNGs: six requested page types, both languages, 360/1280px, page JavaScript disabled. Reviewed all 24 after views via four contact sheets, plus full-size Home/Action and map details. The Find audience route did not exist before; those four baseline captures show an explicitly recorded HTTP 404, not a fictional earlier Find design. The manifests record status/absence.

| Page | Language | Width | Before | After |
| --- | --- | --- | --- | --- |
| home | ka | 360 | [Before](before/home-ka-360.png) | [After](after/home-ka-360.png) |
| home | ka | 1280 | [Before](before/home-ka-1280.png) | [After](after/home-ka-1280.png) |
| home | en | 360 | [Before](before/home-en-360.png) | [After](after/home-en-360.png) |
| home | en | 1280 | [Before](before/home-en-1280.png) | [After](after/home-en-1280.png) |
| action | ka | 360 | [Before](before/action-ka-360.png) | [After](after/action-ka-360.png) |
| action | ka | 1280 | [Before](before/action-ka-1280.png) | [After](after/action-ka-1280.png) |
| action | en | 360 | [Before](before/action-en-360.png) | [After](after/action-en-360.png) |
| action | en | 1280 | [Before](before/action-en-1280.png) | [After](after/action-en-1280.png) |
| statistics | ka | 360 | [Before](before/statistics-ka-360.png) | [After](after/statistics-ka-360.png) |
| statistics | ka | 1280 | [Before](before/statistics-ka-1280.png) | [After](after/statistics-ka-1280.png) |
| statistics | en | 360 | [Before](before/statistics-en-360.png) | [After](after/statistics-en-360.png) |
| statistics | en | 1280 | [Before](before/statistics-en-1280.png) | [After](after/statistics-en-1280.png) |
| find | ka | 360 | [Before](before/find-ka-360.png) | [After](after/find-ka-360.png) |
| find | ka | 1280 | [Before](before/find-ka-1280.png) | [After](after/find-ka-1280.png) |
| find | en | 360 | [Before](before/find-en-360.png) | [After](after/find-en-360.png) |
| find | en | 1280 | [Before](before/find-en-1280.png) | [After](after/find-en-1280.png) |
| calls | ka | 360 | [Before](before/calls-ka-360.png) | [After](after/calls-ka-360.png) |
| calls | ka | 1280 | [Before](before/calls-ka-1280.png) | [After](after/calls-ka-1280.png) |
| calls | en | 360 | [Before](before/calls-en-360.png) | [After](after/calls-en-360.png) |
| calls | en | 1280 | [Before](before/calls-en-1280.png) | [After](after/calls-en-1280.png) |
| news | ka | 360 | [Before](before/news-ka-360.png) | [After](after/news-ka-360.png) |
| news | ka | 1280 | [Before](before/news-ka-1280.png) | [After](after/news-ka-1280.png) |
| news | en | 360 | [Before](before/news-en-360.png) | [After](after/news-en-360.png) |
| news | en | 1280 | [Before](before/news-en-1280.png) | [After](after/news-en-1280.png) |

## Still required before launch

HANDOVER retains the four stages: Nino’s whole-site review, confirmed TBC facts, the signed grant agreement check and a separate launch change. Manual screen-reader/zoom/Georgian review and outstanding hosted Event/image/redirect/rebuild checks remain explicit. Current preview/noindex state stays. No merge, launch, newsletter, tracking or wider migration is authorised.
