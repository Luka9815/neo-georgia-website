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

- **Identity:** NEO Georgia logo in the header; EU emblem with "Funded by the European Union" in the footer, used exactly as the EU and EACEA visibility guidelines require (current versions to be checked before build).

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
