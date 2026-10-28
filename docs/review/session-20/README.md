# Session 20 release candidate

Base: origin/main c2d3b9d. Branch: codex/session-20-release-candidate. Fourteen content commits follow Luka’s numbered items; the final quality commit records validation, documentation and review findings. Do not merge or launch automatically.

The settled design and seven main destinations remain. All nine Action records retain exactly the source-checked wording after removing public draft prefixes. No public [SAMPLE]/[DRAFT] markers remain. The January 2027 preview notice, siteLaunched=false and noindex remain. Missing NEO facts use [TBC].

## Pages and content changed

Paths below exist under both /ka/ and /en/ unless marked removed. All public pages also receive the final preview notice, metadata description and footer contact/social cleanup.

| Page or section | Result |
| --- | --- |
| Home | Final copy, meaningful empty Calls/Events messages, no empty Stories block, preserved real project figures |
| Opportunities | Final individual guidance and unchanged sector design; nine source-checked Action pages with public draft prefixes removed |
| Calls | Eleven real 2026 records covering all nine Actions, both Erasmus Mundus lots and both youth mobility rounds; Brussels time and the 2027 expectation note |
| Events and Events calendar | Bilingual empty state and static empty ICS feed; three sample Event detail/ICS pairs per language removed |
| Stories | Sample story and empty indexes removed; language-specific navigation/listings/sitemap/search restore automatically with a first story |
| Resources/FAQ | Twelve bilingual official-source answers in Applications/Mobility groups, shared with related Actions |
| Resources | Four official external resource records, plus the explicitly requested local partner-tools/statistics navigation |
| Resources/Publications | Two verified external publications with publication year/publisher; historical handbook scope and archive note; sample .txt downloads removed |
| About/Team | Three role cards with explicit name and role email placeholders; one shared NEO contact line |
| HERE | Official network explanation and 2026–2027 Georgian membership placeholder, without a fictional profile |
| About | NEO/EACEA role, activities, ERIDA hosting from January 2027 and clear limits on selecting/funding projects |
| About/Contact | Address, phone, email and office-hours fields; no empty social navigation, forms or maps |
| Privacy | Dated static-site notice, GitHub Pages logging, external services, ICS, email handling and ERIDA controller placeholders |
| Accessibility | Dated WCAG 2.1 AA target, actual testing scope, known limits and reporting contact |
| Projects and Statistics | Dataset and coverage notes preserved; final shared preview/footer copy |
| News and utility pages | Promoted bodies/dates/figures/approved image unchanged; final shared preview/footer copy |

## Sources and facts to confirm

[SOURCES.md](SOURCES.md) lists all 27 official destinations with check date 2026-10-28, the verification scope and all eleven institutional deadlines in Brussels time and UTC. [SOURCES.json](SOURCES.json) is checked by the offline release-content test. Build/test/CI never fetch project data. No live project refresh was run.

[TBC.md](TBC.md) lists all 26 authored placeholder occurrences by file, field and occurrence. These are source occurrences, not repeated generated HTML instances. They cover the team’s three names/role emails, shared NEO contact, office address/phone/email/hours confirmation, Georgian HERE list and ERIDA legal code/address/privacy contact. The inventory test passes while values remain missing; launch requires confirmed values rather than guesses.

The verified publications are the Commission’s annual report 2024 (published in 2025) and ICM handbook version 6.1 (October 2024, for 2024/2025 calls). No Georgia country factsheet was verified, so none is invented or linked. No standalone EACEA HERE landing URL was verified; HERE links to the official Commission/EACEA-supported SPHERE network and the 2026 Guide. The Funding & Tenders destination returns a JavaScript shell; its official link is corroborated by EACEA, while authenticated application workflows were not tested. ERIDA hosting and the 2027-call expectation are facts/instructions supplied by Luka’s brief.

## Validation and preserved coverage

Both final full suites pass all 150 tests, using npm test -- --test-concurrency=1 in their matching root/project-prefix environments. An earlier parallel custom-domain build subprocess received SIGKILL; its isolated check and the final serial suites pass. Both clean production builds pass. Both complete browser commands pass all 95 non-redirect pages per layout with zero axe violations and all functional checks. Results are recorded in [report.json](report.json). Clean root and isolated project-prefix production builds are used. Both full test suites and complete browser commands run after the final terminology corrections. The browser command checks every non-redirect page, then no-JavaScript menus, Publications filters/reset, approved images, empty production calendar/feed, a populated fixture calendar with keyboard/download navigation, project filters/scrolling and search.

Sample-dependent tests remain isolated. Copied synthetic Call/Event dates keep past and upcoming states relative to the test year, so the January 2027 launch does not make these checks expire. Archived fixture JSON stays unchanged. Local publication downloads and resource-to-Event relationships remain exercised in private builds. Fixtures retain sample Call/Event/Story/Resource records, old publication files and baseline Action wording outside src. Tests cover non-empty home/Action relationships, CMS Event edits and optional fields, per-Event ICS/feed generation, DST boundaries in both languages and both empty/first-story states. Call opening times are optional when unverified, with explicit date/zone/relationship validation and preserved opening/deadline boundary coverage. No test coverage is removed to delete sample records. The project-row check indexes links once per year page while retaining every original-title/link assertion; this avoids repeated whole-table scans without sampling the data.

The project snapshot, source totals 606/7,124, public totals 6,764/605/5,079/106/2,045, all 39 Action mappings and the KA107 coverage note remain unchanged. Dependencies, CSS, approved EU artwork/disclaimers and promoted News source bodies remain unchanged.

The release checks follow actual Event/Story content and displayed contact/name values. They do not require the catalogue to remain empty or facts to remain [TBC]. Separate isolated empty/populated fixtures preserve both states, so genuine records and confirmed NEO facts can be supplied without changing those checks.

## Visual review

The 48 full-page captures cover Home, Opportunities, CBHE, Calls, empty Events, FAQ, About, Contact, Privacy, Accessibility, Projects index and Statistics in ka/en at 360 and 1280 px, with JavaScript disabled. [screenshots.json](screenshots.json) lists every route/file/size. Filenames use page-language-width.png, for example [home-ka-360.png](home-ka-360.png) and [calls-en-1280.png](calls-en-1280.png).

Each language/width set was reviewed as a contact sheet, with full-page captures retained for the lower sections. Long Georgian headings, card wrapping, the unchanged hero/navigation/footer, empty states, placeholders, policy text, source links and project comparisons were checked. There is no horizontal page overflow. The review aligned a few new Georgian Capacity Building labels with the established Action terminology. Existing Action wording and the stylesheet were not changed. Captures were regenerated after that correction.

These local automated and visual checks do not establish complete WCAG conformance, a new Lighthouse score or authenticated hosted CMS behaviour. Remaining manual assistive-technology/hosted checks are retained in the Launch checklist.

## Remaining launch stages

The canonical checklist in [HANDOVER](../../HANDOVER.md) now has four stages: Nino’s final whole-site review, confirmed values from TBC.md, the signed grant agreement check, and a separately reviewed launch change. The current source-based copy does not record Nino’s approval. Do not merge this PR or turn on indexing automatically.
