# Session 19 review

Source branch: data/projects-snapshot-2026-10-28, commit 3cc2d40 (main 14902c4 plus the supplied data commit). No live project fetch was run. [Full Action mapping](../../PROJECT-ACTION-MAP.md) lists all 39 source labels/counts; [report.json](report.json) contains measurements and statistical breakdowns.

## Remaining source-reproduction gap

The supplied README/snapshot metadata omit the exact POST body, Origin, pagination fields and raw response paths. The manual refresh command is implemented with a confirmed-request configuration guard, but no production request template is guessed or supplied. It refuses missing/unconfirmed/synthetic production requests, never runs in CI and has seven offline pagination/guard/difference tests. **Live reproduction remains pending a captured request/response contract and validation.** CONTENT.md documents the command and candidate review process. This gap does not affect the supplied snapshot's validated public tables/statistics.

## Public totals

| Measure | Count |
| --- | ---: |
| Unique projects | 6,764 |
| Named Georgian organisations, by source identifier | 605 |
| Named institution project/organisation pairs | 5,079 |
| Georgian-coordinated projects | 106 |
| Mobility-country projects without a named Georgian institution | 2,045 |
| Completed (source finalized) | 4,584 |
| Ongoing | 2,128 |
| Terminated | 52 |
| Programme period 2014–2020 | 3,134 |
| Programme period 2021–2027 | 3,630 |

Raw source regression checks retain 606 identifiers and 7,124 pairs, including the synthetic Georgia mobility-country entry. All 235 generic higher-education mobility records are KA131 and remain sector-only; all 2,045 mobility-country projects have no named Georgian institution. Project totals include them. The 2026/later call years are incomplete and source/ongoing records may change. Source status is not inferred from dates. No funding amount is shown or summed.

## Output and performance

| Root build measurement | Before | After |
| --- | ---: | ---: |
| HTML files | 81 | 111 |
| Build wall time | 6.361 s | 13.027 s |
| Total output bytes | 2,900,139 | 11,856,455 |
| Combined Pagefind bytes | 1,315,137 | 1,324,245 |

Final project-prefix output: 111 HTML files, 11,924,961 bytes, Pagefind 1,325,413 bytes. Its isolated build took 23.293 seconds while other validation ran. These are single local observations with variable host load, not controlled benchmarks. Output directories were clean. There are 30 added HTML pages: two indexes, 26 call-year tables and two statistics pages, rather than per-project detail pages.

The largest year page is Georgian 2022 at 579,207 bytes, below the 1,000,000-byte split threshold. Source rows remain complete in both languages. Including year tables in Pagefind measured 3,235,348 bytes, so exclude them and index the overview/statistics only. Year pages remain linked, in the sitemap and complete without JavaScript. Native fragment/CSS group selection supports Action-specific links and an All projects reset; older CSS engines retain full groups and anchor navigation.

## Validation

Root and project-prefix suites each pass all 132 tests. They include source facts/per-year totals, required-field/duplicate/status/GE/card/date failures, strict public projection, exact mapping coverage, institution/country-mobility counting, original titles, static rows/official links, attribution, homepage figures, page size limits and existing CMS/image/redirect/hosting/search contracts. Refresh logic uses small synthetic fixtures with live fetch forbidden. Axe scans cover 105 pages per layout with zero violations. The full project-prefix browser command passes. The root scan completed before a new filter assertion exposed a render-timing race; after waiting for rendered filter state, the project checks and remaining search stage were rerun successfully. Focused filter/reset checks pass in both layouts. Other browser checks cover 320 px overflow, keyboard/language navigation, no-JavaScript menus/controls, Publications, images and calendar downloads. See report.json for the validation method.

The preview notice now distinguishes illustrative [SAMPLE] items and [DRAFT] content, rather than incorrectly describing the new factual catalogue/figures as illustrative. All nine Action records/shared eligibility, dependencies, EU artwork/disclaimer and AGENTS/CLAUDE guidance are unchanged. The launch flag remains false and hosted/manual launch tasks remain open.

Representative captures: statistics in both languages at 320/1280 px, and project table rows at 1280 px. Source titles/names stay unchanged; Georgian interface/readability still needs the existing manual launch review.
