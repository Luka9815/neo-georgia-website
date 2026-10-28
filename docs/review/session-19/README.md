# Session 19 review

Source branch: data/projects-snapshot-2026-10-28, commit 3cc2d40 (main 14902c4 plus the supplied data commit). No live project fetch was run. [Full Action mapping](../../PROJECT-ACTION-MAP.md) lists all 39 source labels/counts; [report.json](report.json) contains measurements and statistical breakdowns.

## Review fixes, 28 October 2026

Luka supplied the verified POST body, Origin and total/projectDocuments response fields on 2026-10-28. The manual refresh now uses that request directly, covers 2014 through the current Tbilisi year, advances from by 100 with 0.5-second spacing, and fails the whole run if any year's retrieved count differs from its total. Ten offline tests cover the exact body, headers, pagination, empty/short pages, failure guards and differences. No live fetch was run in this review, as instructed. The earlier missing-request gap is resolved; live service behaviour was not rechecked here. See migration/source/README.md and CONTENT.md for the request and candidate review process.

Visible bilingual notes beside the year and Action comparisons on both overview pages explain the source's missing KA107/2014–2020 higher education mobility cohort and the invalidity of comparisons across 2020/2021. The source totals remain unchanged.

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

## Initial Session 19 output and performance

| Root build measurement | Before | After |
| --- | ---: | ---: |
| HTML files | 81 | 111 |
| Build wall time | 6.361 s | 13.027 s |
| Total output bytes | 2,900,139 | 11,856,455 |
| Combined Pagefind bytes | 1,315,137 | 1,324,245 |

Final project-prefix output: 111 HTML files, 11,924,961 bytes, Pagefind 1,325,413 bytes. Its isolated build took 23.293 seconds while other validation ran. These are single local observations with variable host load, not controlled benchmarks. Output directories were clean. There are 30 added HTML pages: two indexes, 26 call-year tables and two statistics pages, rather than per-project detail pages.

The largest year page is Georgian 2022 at 579,207 bytes, below the 1,000,000-byte split threshold. Source rows remain complete in both languages. Including year tables in Pagefind measured 3,235,348 bytes, so exclude them and index the overview/statistics only. Year pages remain linked, in the sitemap and complete without JavaScript. Native fragment/CSS group selection supports Action-specific links and an All projects reset; older CSS engines retain full groups and anchor navigation.

After the review fixes, root output is 11,866,326 bytes and Pagefind 1,326,497 bytes; project-prefix output is 11,934,856 bytes and Pagefind 1,327,659 bytes. Both layouts still have 111 HTML files. These post-review values are also recorded separately in report.json.

## Validation

Root and project-prefix suites each pass all 136 tests. They include source facts/per-year totals, required-field/duplicate/status/GE/card/date failures, strict public projection, exact mapping coverage, institution/country-mobility counting, original titles, static rows/official links, attribution, homepage figures, page size limits and existing CMS/image/redirect/hosting/search contracts. Refresh logic uses small synthetic fixtures with live fetch forbidden. Both complete browser commands pass all 105 pages per layout with zero axe violations. This supersedes the initial root filter timing failure and focused rerun. Checks include 320 px overflow, skip links/language switches, no-JavaScript menus/controls, Publications, images, calendar/ICS, project Action/year/filter/reset/keyboard navigation and search. Separate no-JavaScript checks confirm that both coverage notes remain visible at 320 px on each overview page in both languages/layouts, including Action-filtered indexes. See report.json for the validation method.

The preview notice now distinguishes illustrative [SAMPLE] items and [DRAFT] content, rather than incorrectly describing the new factual catalogue/figures as illustrative. All nine Action records/shared eligibility, dependencies, EU artwork/disclaimer and AGENTS/CLAUDE guidance are unchanged. The launch flag remains false and hosted/manual launch tasks remain open.

Statistics captures in both languages at 320/1280 px were refreshed after the review coverage note. Project table row captures at 1280 px remain from the initial Session 19 validation; those rows are unchanged. Source titles/names stay unchanged; Georgian interface/readability still needs the existing manual launch review.
