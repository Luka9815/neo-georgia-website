# Session 16 local launch review, 2026-10-27

## Method and scope

The production build was served locally with Python's static HTTP server. Existing Playwright 1.64.1 and axe-core 4.14.0 checked every non-redirect page in both root and project-path layouts. Chromium was 154.0.8037.57 on Debian 13, using /usr/bin/chromium and --no-sandbox in the managed container. The 76-page scope includes both language versions of every requested template and the shared bilingual /404.html. There are no separate language-specific 404 files.

The existing script checks axe rules, 320 px overflow, skip-link keyboard activation, language switches, no-JavaScript menus, Publications combinations/reset/fallback and search. Session 16 extends it to decode the actual approved News picture in both article/list contexts and verify all ten visible Action cards (nine records, one in two sectors) have visible Key Action labels with JavaScript disabled. The Georgian photograph/article and labels were also visually inspected at 320 px. No automated WCAG failures were found. Manual checks remain in HANDOVER's Launch checklist, including screen readers, focus appearance, zoom/reflow, forced colours and editorial review of alternatives and documents.

Lighthouse 13.0.1 was installed ad hoc under /tmp/neo-lighthouse with npm install --prefix /tmp/neo-lighthouse lighthouse@13.0.1. It was not added to package.json or the lockfile. Each run used Lighthouse's default mobile simulated throttling and only the performance/accessibility categories. Scores are local lab observations; they do not establish deployed performance, a complete WCAG audit, or approval of [SAMPLE]/[DRAFT] material. No SEO score was used while siteLaunched=false deliberately blocks indexing.

## Findings and code change

performance.json preserves the initial 21-URL run, including the Georgian Publications score of 88 and CLS 0.2222. publications-recheck.json preserves three pre-change repeats (88, 99, 88), showing intermittent shift as the deferred module revealed the filter form after paint. Other requested pages scored 98 to 100 for performance and all 21 scored 100 for accessibility.

The Publications enhancement is now a small classic script immediately after its form. It reveals the ready controls during parsing, renders the initial count statically and synchronises the complete list after DOMContentLoaded. Without JavaScript the controls remain hidden and the full publication list stays available. publications-after.json contains three Georgian repeats after this change: 99, 97, 99, with CLS 0.0036 to 0.0043. English scored 100 with CLS 0.0028. Both languages still pass the existing filter/reset/no-JavaScript browser checks.

The table uses the initial run for unchanged pages and the post-change runs for Publications. The root 404 contains both Georgian and English text; it was audited once as the shared route.

| URL | Final performance | Accessibility |
|---|---:|---:|
| /ka/ | 98 | 100 |
| /ka/opportunities/ | 98 | 100 |
| /ka/opportunities/cbhe/ | 98 | 100 |
| /ka/calls/ | 99 | 100 |
| /ka/news/ | 98 | 100 |
| /ka/news/neo-dissemination-event-2025/ | 98 | 100 |
| /ka/events/ | 99 | 100 |
| /ka/resources/publications/ | 97 to 99 | 100 |
| /ka/resources/faq/ | 99 | 100 |
| /ka/about/contact/ | 99 | 100 |
| /en/ | 100 | 100 |
| /en/opportunities/ | 100 | 100 |
| /en/opportunities/cbhe/ | 100 | 100 |
| /en/calls/ | 99 | 100 |
| /en/news/ | 99 | 100 |
| /en/news/neo-dissemination-event-2025/ | 99 | 100 |
| /en/events/ | 99 | 100 |
| /en/resources/publications/ | 100 | 100 |
| /en/resources/faq/ | 99 | 100 |
| /en/about/contact/ | 99 | 100 |
| /404.html | 99 | 100 |

## Reproduction

From the repository root on Node 24:

```sh
npm ci
npm run build
npm test
python -m http.server 8080 --bind 127.0.0.1 --directory _site
```

In another terminal:

```sh
npm run check:a11y
npm install --prefix /tmp/neo-lighthouse --no-audit --no-fund lighthouse@13.0.1
node docs/review/session-16/run-performance.mjs
```

The performance runner writes /tmp/session-16-performance.json by default so a rerun does not overwrite committed evidence. PERFORMANCE_REPORT, TEST_URL, CHROMIUM_PATH, LIGHTHOUSE_MODULE and CHROME_LAUNCHER_MODULE can override the report path, origin or installed tools. The runner audits the full 21-URL root layout; the pre/post Publications repeats used the same settings restricted to those routes. Raw full Lighthouse reports were temporary; committed JSON retains scores, FCP/LCP/TBT/CLS, warnings and binary failures/opportunities. Timings can vary with the host load.

For project-path browser validation, build with PATH_PREFIX=/neo-georgia-website/ and SITE_URL=https://luka9815.github.io/neo-georgia-website/, then serve the generated directory under /neo-georgia-website/ on a separate local origin. Set PATH_PREFIX=/neo-georgia-website/ and TEST_URL to that origin for npm run check:a11y. npm test under the same build variables also exercises both isolated prefix/custom-domain builds and responsive image output.

## Final checks

Clean production builds and all 98 tests pass in root and project layouts, including the two isolated prefix/custom-domain checks. Browser accessibility outcomes are also recorded in HANDOVER. No new dependency, external account or tracking request was introduced. Review image binaries and the CSV decisions are untouched; only the one explicitly approved source photograph is copied into uploads.
