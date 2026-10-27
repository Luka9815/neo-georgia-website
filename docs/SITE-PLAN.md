# NEO Georgia website: site plan

Version 0.1, 24 October 2026, Luka Janjgava. Approved October 2026 (see docs/DECISIONS.md). Source: Google Drive Cowork/NEO/06 Website.

## Purpose and principles

The new site has one main job: help Georgian institutions and individuals find the right Erasmus+ opportunity, know its deadline, and get the guidance and materials from information days. Its second job is to show NEO activity and results to EACEA, the EU Delegation and the Ministry.

- **Georgian first, English in full parity** for all core pages. News may be Georgian only.

- **Enter each fact once.** A deadline or event is entered in one place and appears automatically on every page that needs it.

- **Official vs NEO guidance kept apart.** Every resource is labelled as official EACEA/EU information or NEO Georgia guidance, with a link to the original source.

- **Staff publish without code.** News, events, deadlines and resources are edited through a simple web editor.

- **Fast, mobile-first, accessible** (WCAG 2.1 AA target), free to run, no paid plugins.

- **EU visibility compliant** on every page: EU emblem, funding statement and EACEA disclaimer.

**Audiences:** students and graduates; academic and administrative staff; higher education institutions (international relations offices); VET institutions; youth organisations and youth workers; the Ministry, EU Delegation, EACEA and media.

## Sitemap

Seven top-level menu items replace the current twelve. URLs use English slugs in both languages (/ka/calls/, /en/calls/), so links stay short and readable instead of long percent-encoded Georgian strings.

| Menu (Georgian)      | Menu (English)      | URL             | Contains                                                                                                                             |
|----------------------|---------------------|-----------------|--------------------------------------------------------------------------------------------------------------------------------------|
| მთავარი              | Home                | /ka/ · /en/     | Entry points, next deadlines, upcoming events, latest news, one story                                                                |
| შესაძლებლობები       | Opportunities       | /opportunities/ | For individuals; for organisations; one page per action (/opportunities/cbhe/ etc.)                                                  |
| კონკურსები და ვადები | Calls and deadlines | /calls/         | Current call year grouped by Key Action; archive by year                                                                             |
| ღონისძიებები         | Events              | /events/        | Upcoming and past events; information day pages with all materials                                                                   |
| სიახლეები            | News                | /news/          | News; success stories (/stories/)                                                                                                    |
| რესურსები            | Resources           | /resources/     | Publications from 2014, information day materials, statistics, FAQ, education system in Georgia, horizontal priorities, useful links |
| ოფისის შესახებ       | About               | /about/         | NEO Georgia, team, Higher Education Reform Experts (/here/), services (VAT exemption, support letters), contact                      |

Footer on every page: contact details, social links, privacy and cookie notice, accessibility statement, language-prevails statement, EU emblem with funding statement and EACEA disclaimer.

**Where current content goes**

| Current menu item                              | New location                                                  |
|------------------------------------------------|---------------------------------------------------------------|
| სიახლეები                                      | News, split into News and Events by type                      |
| ეროვნული ოფისი, ოფისის საქმიანობა, გუნდი       | About                                                         |
| დღგ-გან გათავისუფლება, მხარდაჭერის წერილები    | About, Services                                               |
| პროგრამები (20 action tiles on the homepage)   | Opportunities, one structured page per action                 |
| დედლაინები                                     | Calls and deadlines                                           |
| უმაღლესი განათლების ექსპერტები                 | About, HEREs (with their own events and publications)         |
| პუბლიკაციები 2023-დან, 2014-2020               | Resources, Publications, one list filterable by year and type |
| სტატისტიკა, შეკითხვები                         | Resources, Statistics and FAQ                                 |
| ჰორიზონტალური პრიორიტეტები, განათლების სისტემა | Resources                                                     |
| საკონტაქტო                                     | About, Contact (also in the footer)                           |

## Content model

Content is stored as linked types, not free pages. An action page then shows its current deadline, upcoming information sessions, past recordings and Georgian success stories automatically, with no copying between pages.

| Type        | Key fields                                                                                                                                                                                                             | Appears on                                                    |
|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------|
| Action      | Title; Key Action (KA1, KA2, KA3, Jean Monnet); sectors (higher education, VET, school, adult, youth, sport); audience (individuals, organisations); summary; who can apply from Georgia; how to apply; official links | Opportunities pages                               |
| Call        | Action; call year; deadline date and time (Brussels time); official call link; notes. Status (upcoming, open, closed) is calculated from dates                                                                         | Calls and deadlines; action page; homepage "next deadlines"   |
| Event       | Title; type (information day, webinar, training, conference, Erasmus Days); dates; format (online, in person, hybrid); venue; organiser (NEO, EACEA, partner); registration link; agenda; related actions              | Events (upcoming and past, calculated); action page; homepage |
| Resource    | Title; file or link; type (presentation, recording, guide, template); source (official EACEA/EU, NEO Georgia guidance, partner); language; year; related event and actions                                             | Event page; action page; Resources                            |
| News        | Title; date; category; body; image; related actions                                                                                                                                                                    | News; action page; homepage                                   |
| Story       | Person or institution; action; year; short quote; body; photo (with consent)                                                                                                                                           | Stories; action page; homepage                                |
| Publication | Title; year; type (NEO report, HERE publication, brochure, statistics); file; language                                                                                                                                 | Resources, Publications (archive from 2014)                   |
| FAQ         | Question; answer; topic; related actions                                                                                                                                                                               | FAQ; action page                                              |
| Person      | Name in Georgian and English; role; group (NEO team, HERE); photo; email                                                                                                                                               | About, Team and HEREs                                         |
| Page        | Free text for stable pages (About, education system, VAT exemption, etc.)                                                                                                                                              | Where placed in the sitemap                                   |

**Languages:** every type has Georgian and English fields. Core types (Action, Call, Event, FAQ, Page, Person) must have both; News and Stories may be Georgian only. Names follow one fixed transliteration rule (the Georgian national system), applied the same way everywhere.

## Page templates

Fourteen templates cover the whole site; everything else is content.

1.  **Home**, top to bottom:

    1.  One-line purpose and two entry buttons: "I am a student or staff member" and "I represent an institution"

    2.  Next three deadlines

    3.  Next three events

    4.  Latest three news items

    5.  One success story

    6.  Key figures strip (projects, mobilities, institutions)

2.  **Opportunities hub**, grouped by sector with visible Key Action labels. Luka dropped filters on 2026-10-27 because there are nine Actions; revisit only after substantial listing growth (see DECISIONS.md).

3.  **Action page**: what it is, who can apply from Georgia, how to apply, then the automatic blocks (deadline, events, resources, stories, FAQ)

4.  **Calls and deadlines**: grouped by Key Action, Brussels time, link to the official call and Programme Guide

5.  **Events list**: upcoming first, then past, filterable by year and sector

6.  **Event page**: details, registration, agenda; after the event, the materials grouped as official EACEA vs NEO guidance

7.  **News list** and **news article**

8.  **Story**

9.  **Publications list**, filterable by year and type

10. **FAQ**, grouped by topic

11. **People list** (team, HEREs)

12. **Basic page**

13. **Contact**

14. **Not found (404)** in both languages

No image sliders and no pop-ups. Site-wide search across both languages, to be tested with Georgian text.

## Design direction

Clean and institutional: recognisably part of the Erasmus+ family, but simpler and faster than the official EU site.

- **Identity:** typographic office-name wordmark in the header (no graphic logo, Luka, 2026-10-27); EU emblem with "Funded by the European Union" in the footer, used exactly as the EU and EACEA visibility guidelines require (current versions to be checked before build).

- **Colour:** a small set of named colours (primary blue, one accent, neutrals) taken from the current Erasmus+ visual identity, all passing contrast checks.

- **Typography:** one self-hosted font family covering both Georgian and Latin, so both languages look consistent (candidates: FiraGO, Noto Sans Georgian). Georgian labels run longer than English, so menus and buttons are designed around the Georgian text. No automatic capitalisation of Georgian text, which browsers render in Mtavruli.

- **Accessibility:** WCAG 2.1 AA target: contrast, keyboard navigation, visible focus, alt text required for every image in the editor, captions or transcripts for recordings where possible.

- **Images:** real photos from NEO events and beneficiaries, compressed automatically; no stock photography.

## Technical summary and migration

The site is a static site (Eleventy) in a GitHub repository, published on free hosting, with a web-based editor for staff. There is no database or server to maintain or hack.

| Item            | Choice                                                                            | Status                         |
|-----------------|-----------------------------------------------------------------------------------|--------------------------------|
| Site generator  | Eleventy                                                                          | Decided                        |
| Code repository | GitHub, Luka's account during build, moved to an ERIDA/NEO organisation at launch | Decided                        |
| Hosting         | Netlify or Cloudflare Pages (free tier)                                           | To test in first build session |
| Staff editor    | Decap CMS or Pages CMS                                                            | To test together with hosting  |
| Search          | Static search index built with the site                                           | To test with Georgian          |
| Analytics       | Privacy-friendly, no cookie banner needed if cookieless                           | To choose                      |
| Accounts        | Hosting, editor and domain registered to an ERIDA/NEO email                       | Decided                        |

**Migration of existing content**

- Export posts, pages and files from the current WordPress site in structured form (WordPress export file or its built-in data feed). This needs admin access from the current host, or a public export if available.

- Convert posts automatically into News and Events; PDFs into Publications with year and type.

- Check whether the current English pages are maintained translations or automatic ones before migrating them.

- If the domain is kept, redirect every old URL to its new page so existing links and search rankings survive.

## Test version scope

The test version is a clickable site in both languages on a temporary address, enough to react to structure and design. It is not a finished site.

- [ ] Home with all six blocks

- [ ] Opportunities hub and 3 to 4 action pages (for example CBHE, ICM, Erasmus Mundus, Jean Monnet)

- [ ] Calls and deadlines for the current call year

- [ ] Events list and one complete information day page with materials

- [ ] News list seeded with about 10 migrated posts

- [ ] About, Team and Contact

- [ ] EU emblem, funding statement and disclaimer in the footer

- [ ] Staff editor working for News and Events

Later phases: full migration, publications archive, statistics, HEREs section, newsletter, and possibly a database and map of Erasmus+ projects in Georgia (as NEO Ukraine has).

## Decisions needed from Nino

1.  **Domain:** keep erasmus.org.ge (requires written agreement to transfer it from the current host before January) or start a new one. This is the most urgent item.

2.  **Actions to list:** which Erasmus+ actions are open to Georgia and should get their own page, confirmed against the current Programme Guide.

3.  **Prevailing language:** the current site says English prevails. Keep that, or make Georgian prevail?

4.  **Editors:** who on the NEO team will publish news and events, and whether they are comfortable signing in with a GitHub account (the simplest editor option needs one).

5.  **Logo and brand files:** who holds the NEO Georgia logo files, and whether a refresh is wanted.

6.  **Access to the current site:** can the current host provide admin access or a full export?

7.  **Phase 2 priorities:** newsletter, project database and map, statistics dashboard. Which matter most?

## Session 19 proposal: projects with Georgian participation and statistics

Planning only, 27 October 2026. Luka will supply the official Erasmus+ Project Results Platform CSV export. Session 18 adds no importer, network fetch, dataset, project/statistics route or public project record. The existing illustrative homepage figures remain subject to the Launch checklist and are not replaced with invented totals.

### Source and review boundary

Use the supplied official export as the only initial project source, covering completed and ongoing Erasmus+ projects with verified Georgian participation. Preserve the export date, source page, filters, programme periods, file checksum and supplied column headers in a private/local review manifest. Do not fetch the platform or individual project sites as part of builds, tests or CI. Do not commit the raw CSV if it contains personal names, emails or other fields outside the approved public model.

Before coding, inspect the real CSV's encoding, delimiter, quoting, headers, identifiers, date/amount formats and one-project versus one-participation row shape. Confirm that filtering by Georgia covers both coordinators and partners, that country codes distinguish GE from the US state, and whether partner lists are truncated. Compare retained records against source totals only when their units/coverage match. A partial or filtered export must carry that limitation; missing participants must not silently become zero participation. Record the export's coverage rather than claiming a complete national census.

### Proposed linked data model

Keep shared facts once and translated interface/editorial text separately. Proposed fields, subject to the supplied headers:

| Record | Fields to retain | Rules |
| --- | --- | --- |
| Project | official project reference/ID, stable ASCII slug, original title and language, acronym, programme period, action code, call year, start/end calendar dates, source status, official project URL, source summary/language if reuse is allowed | Official reference is the deduplication key. Preserve source status separately from computed date status. Missing dates/statuses stay unknown. Do not infer an Action mapping from free text. |
| Participation | project reference, source organisation ID if available, original organisation name, country code, role (coordinator/partner), city if supplied | Link many organisations to a project. Count a project once regardless of Georgian participant count; count each verified project/organisation pair once. Preserve unknown roles and source conflicts for review. |
| Organisation aliases | canonical organisation ID and name, source name variants, evidence and reviewer | Normalise surrounding whitespace for matching; do not automatically merge institutions by similar names. Luka approves aliases. Do not publish contact people or emails. |
| Project links | website/social URLs supplied by the export, kind, last checked date and review status | Keep only provided public HTTP(S) links, remove tracking parameters after review and publish only verified live links. No guessed domains, account names, embeds or tracking widgets. Source links remain separate from beneficiary sites. |
| Source provenance | official export name, snapshot date, checksum, source URL, filter/coverage notes, licence/reuse reference, import schema version | Publish a short source/update/coverage statement, without personal fields or the raw export. Keep rejected rows and raw audit details outside public content. |
| Editorial overlay | project reference, optional approved ka/en title/summary, approved Action relationships, reviewed external links, reviewer/date/reason | Merge after source validation; never overwrite imported provenance. Preserve source original text and label its language if no approved translation exists. Core page labels and navigation remain bilingual. |
| Optional funding | source grant/budget amount, currency, field definition and scope | Retain only if supplied and approved. A consortium grant is not funding to Georgia. No allocation to Georgian partners may be inferred, and funding totals stay omitted unless coverage and units are defensible. |

### Proposed pages

- `/ka/resources/projects/` and `/en/resources/projects/`: complete static lists of projects involving Georgia, with completed/ongoing/planned/unknown date status, original title, dates and Georgian participants. Optional local filters by year, mapped Action and status enhance the full list; the no-JavaScript list remains complete and keyboard accessible.
- `/<lang>/resources/projects/<slug>/`: project facts, coordinator and Georgian participants/roles, source attribution/update date, any approved bilingual summary and verified live website/social links supplied by the source. Do not represent unavailable English/Georgian editorial text as a translation; agree the source-language fallback with Luka first.
- `/<lang>/resources/statistics/`: accessible tables computed at build time from exactly the approved project/participation records used by the lists. Link every count to its underlying list or explain the query. Explain snapshot coverage, unknown fields and deduplication. Charts, if later requested, must have equivalent tables.

Link these from Resources and related Actions only after approval. Keep seven main navigation destinations. This proposal does not publish placeholder pages or make the new model editable in Pages CMS.

### Proposed offline import and update process

1. Luka supplies the official CSV with its export date, filters, coverage and terms/reuse information. Confirm the fields and decisions below before implementation.
2. In Session 19, add a manually invoked offline command, provisionally `node scripts/import-projects.js --input <local-csv> --out <review-directory>`. It must refuse public output paths, perform no network access and never run in normal builds/tests/CI. Tests would use small synthetic fixtures, not the real export.
3. Parse using the confirmed schema; reject missing required headers, malformed dates/URLs, duplicate/conflicting IDs and unsupported country/role values with row/field errors. Build review-only normalised project/participation files and a report of retained/rejected rows, duplicate candidates, missing fields and coverage. An incomplete import fails clearly and must not replace a previous approved snapshot.
4. Apply reviewed organisation aliases and editorial overlays by official reference. Produce an added/changed/removed report against the previous approved snapshot. Never silently delete published records absent from a new partial export or overwrite an approved translation/link correction.
5. Luka reviews the report, source terms, Action mappings and link checks. Promote only the approved normalised fields via a separate reviewed PR, with regenerated statistics, source/update text, clean builds and accessibility checks. Retain the previous approved snapshot until this review succeeds.
6. Repeat on an agreed schedule, proposed quarterly and after major award announcements. The daily site rebuild only refreshes date-derived statuses, not the dataset. Display the data snapshot date separately from the build date.

Manual additions live in a separate review overlay with official project reference, evidence, date and reviewer. If an ID is not in the export, keep the addition outside public data until Luka approves its official evidence, reuse and coverage classification. Do not invent an ID or merge by title. Reconcile by official reference when later exports contain the record. Decide explicitly whether approved additions enter published totals; never combine them silently with an export-only denominator.

### Source licensing and reuse, to confirm before promotion

Source pointers for Luka's supplied export: Erasmus+ Project Results Platform (`https://erasmus-plus.ec.europa.eu/projects`), its terms (`https://erasmus-plus.ec.europa.eu/projects/terms-use`) and the European Commission legal notice (`https://commission.europa.eu/legal-notice_en`). These are reference pointers, not a Session 18 verification of current terms. No project-data or terms fetch is performed for this plan.

The applicable export licence and attribution wording are unresolved until the supplied file and accompanying current terms are reviewed. Do not assume that the Commission's general reuse policy licenses every beneficiary summary, photograph, logo or linked website. Record the exact licence/version, attribution, modification notice and any third-party exclusions in the source manifest before publication. If metadata is confirmed under CC BY 4.0, retain attribution and a licence link, identify modifications and do not imply EU endorsement. Do not copy beneficiary media or full descriptions without confirmed reuse rights; publish minimal approved factual metadata and links if rights remain uncertain. Exclude personal contact data regardless of export availability. Licensing is a promotion gate, not something the future importer can infer.

### Decisions needed from Luka before Session 19

- Supply the official CSV, export date, active filters, programme coverage and accompanying reuse/attribution terms. Confirm whether it is complete for Georgian coordinators and partners, including any participant-column limits.
- Agree the initial programme periods/Actions and publication/update schedule. Confirm treatment of missing dates, cancelled projects and source status versus date-derived ongoing/completed labels.
- Approve organisation IDs/aliases, source Action-code mapping, bilingual editorial fields and the visible source-language fallback. No automatic translation is proposed.
- Approve external-link checking and manual additions, their evidence and inclusion in statistics. No network checking is authorised by this planning item.
- Agree statistics units: unique projects, verified Georgian project/organisation participations, unique Georgian institutions and breakdown by Action/year/status. Any call-year versus start-year chart must state its basis. Unknown values get an explicit category. Do not count participant headcounts or mobilities from project counts.
- Decide whether funding is needed at all. Confirm the source amount's scope/currency before any sum; never label consortium-wide grants as money awarded to Georgia.
- Approve the proposed pages, minimal public fields, licence/attribution and the review/promotion procedure before building them.
