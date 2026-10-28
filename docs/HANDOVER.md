# Handover

Last updated: 2026-10-29 (Codex, Session 21 in progress)

## Session 21 progress

Started from origin/main 0350527 on codex/session-21-redesign. The design system replaces the Session 20 visual freeze under Luka’s explicit redesign brief. Existing content/data/URLs, EU visibility and all four Launch stages below remain. Design tokens, sticky header, compact language/search and footer are implemented; item 5’s bilingual static opportunity finder is implemented; item 4’s one-photo provenance/pipeline and About placement are implemented; item 6’s build-time charts and tables are implemented; remaining numbered items and final validation are in progress. No merge or launch is authorised.

## Session 20 baseline

The branch codex/session-20-release-candidate starts from origin/main c2d3b9d. Design is settled; no stylesheet or visual redesign is introduced. Georgian remains primary, English has core-page parity, and the seven main destinations remain unchanged. AGENTS.md is canonical and CLAUDE.md points to it. The public marker rule now follows Luka’s Session 20 brief: no [SAMPLE]/[DRAFT] markers, missing NEO facts use [TBC], and Action review status stays in ACTION-REVIEW.md.

siteLaunched=false, noindex and robots disallow remain. The small notice says the website opens in January 2027. This is a release candidate for Nino’s final whole-site review; no launch or merge is authorised by this session. The previous handover is archived at archive/HANDOVER-SESSION-19.md; its old sample/draft holds are superseded by the dated Session 20 decisions.

## Release content

- Nine Actions retain exactly the source-checked wording, with only public draft prefixes removed. ACTION-REVIEW.md contains Nino’s review list, including applicant/partner distinctions, the Georgian authority exclusion and CBHE Strand 3. The shared restriction stays on each Action.
- Eleven real 2026 institutional Call records cover all nine Actions, both Erasmus Mundus lots and both youth mobility rounds. All are closed at this snapshot. Keep currentCallYear=2026. The Calls page carries the requested 2027 expectation note. Each record has a verified Brussels deadline/source-check date; unverified opening times are omitted. Optional explicit opening times still support future upcoming states.
- Production Events are empty. The list and current-month calendar have a bilingual empty state; both language ICS feeds remain static empty downloads. Six old Event detail/ICS pairs are absent on clean output. Genuine future Events restore calendar entries and per-Event files automatically. Keep slugs stable: UID is neo-georgia-event-<slug>, independent of language, dates and hosting. Named-zone/DST, escaping and folding rules remain.
- Production Stories are empty. Indexes, home/Action listings, Resources links, sitemap and search restore the section automatically when stories in that language exist. A story without an alternate-language index switches to Resources. Empty optional pagination collections emit no routes.
- Twelve bilingual FAQs use official sources in the existing Applications/Mobility groups. Four external official Resources plus local partner-tools/statistics navigation replace samples. Two external Publications show year/publisher and an archive-since-2014 note. The ICM handbook is labelled as a 2024/2025-call publication; use the 2026 Guide for current eligibility. No publication copies or sample text files are hosted.
- Team has Coordinator, Programme Officer and Communications Officer role cards, with name/role email [TBC]. HERE has official network guidance and a 2026–2027 membership-list placeholder. About describes NEO’s role and ERIDA hosting from January 2027, as supplied by Luka. Contact has four final labelled fields and no social block until real links exist. Privacy and Accessibility are dated 28 October 2026 and describe actual behaviour, testing scope and known limits.
- review/session-20/TBC.md inventories 26 authored placeholder occurrences by file/field/occurrence. Re-run npm test to regenerate it after NEO supplies facts. It passes while placeholders exist; resolve them for launch rather than guessing. review/session-20/SOURCES.md lists 27 official source destinations and all call deadlines, checked 2026-10-28. No live project refresh was run.

## Preserved content and operations

Exactly five approved bilingual legacy News posts remain. Their bodies, figures, dates and approved photograph/alternatives are unchanged. Only neo-dissemination-event-2025.jpg is attached. Text-heavy graphics and the Europe Day photograph remain omitted. No additional migration promotion or image is authorised. Original evidence remains in migration/review.

Projects/statistics still use the approved 2026-10-28 local snapshot: 6,764 projects, 605 named organisations, 5,079 institution participations, 106 Georgian-coordinated projects and 2,045 mobility-country projects. Preserve raw 606/7,124 regression totals. The bilingual KA107/2014–2020 coverage note remains beside year/Action comparisons; HE mobility comparisons across 2020/2021 are not meaningful. Do not publish raw source objects, grant amounts, descriptions/results, contacts, beneficiary websites or media. The manual refresh uses Luka’s verified POST/Origin/body, total/projectDocuments, offsets 0/100/200, 500 ms spacing and 2014 through the current Tbilisi year. It fails any per-year total mismatch, writes ignored candidates/reports and never runs in build/test/CI.

Pagefind builds local ka/en indexes, excluding per-year project tables, utility pages and absent Stories. Georgian query fallback removes only one approved ending; English and original content remain unchanged. Only search pages load search modules. No analytics, cookies, submission forms, trackers or new dependencies are added. Browser-only search and GitHub Pages security logging are explained in Privacy.

Keep the approved original Georgian/English EU emblems, white-box/aspect-ratio derivatives and unchanged supplied disclaimers. The office-name wordmark remains subordinate to the emblem. No NEO graphic logo or programme artwork is authorised. Keep logoPath empty until separately approved.

GitHub Pages is enabled and hosted deployment works. Main pushes, manual dispatch and daily 04:15 UTC (08:15 Tbilisi) rebuilds deploy through official GitHub Actions. The current Pages address is acceptable; domain choice is not a current blocker. Institutional ownership/transfer remains required when a domain or repository move is chosen. Verify HTTPS, canonical/hreflang/sitemap, prefix, language switches and redirects after such a move.

## Editor and fixtures

Luka is the sole editor until further notice. Pages CMS edits News, Events and Settings; supporting records remain JSON-edited. News’s hosted create/build/check/delete round trip is confirmed. Hosted Event and image round trips remain unconfirmed; local fixtures do not establish hosted behaviour. See EDITING.md.

Sample Calls, Events, Stories, Resources, FAQ, People, Pages and publication text files are retained in test/fixtures/release-content and release-publications, outside public content. CMS/integration builds restore only needed fixtures. Non-empty home/relationship/ICS and calendar keyboard/download coverage remains isolated; production checks cover empty Events/Stories. Copied synthetic Call/Event dates keep past/upcoming states relative to the test year, preserving coverage after January 2027. Archived fixtures are unchanged. The year-table test indexes links once but still checks every source row. Do not remove test coverage to remove illustrative content.

The release checks follow actual Event/Story content and displayed contact/name values. They do not require the catalogue to remain empty or facts to remain [TBC]. Separate isolated empty/populated fixtures preserve both states, so genuine records and confirmed NEO facts can be supplied without changing those checks.

## Validation

Use Node 24 LTS and npm ci. Clean ignored _site before production builds.

Root: npm run build, npm test. Serve _site and run TEST_URL=<local server origin> npm run check:a11y.

Project prefix: use PATH_PREFIX=/neo-georgia-website/ and SITE_URL=https://luka9815.github.io/neo-georgia-website/ for build/tests/browser checks. Serve output beneath that prefix and set TEST_URL to its local origin. Use an isolated copy to avoid overwriting root output. The browser command checks every non-redirect page, then menus, Publications, approved images, empty and fixture calendars, projects and search. It uses /usr/bin/chromium, overridable with CHROMIUM_PATH.

Clean root/project-prefix builds pass, with all 150 tests passing per layout (the final suites use one worker). Both complete browser commands pass 95 pages per layout with zero axe violations and all functional checks. Final results are recorded in review/session-20/README.md and report.json. The review folder also contains the 48 requested full-page captures, both languages at 360/1280 px. These are local automated/visual checks, not a complete WCAG audit or hosted/manual CMS confirmation.

## Launch checklist

Keep siteLaunched=false and the preview/noindex state until these four stages are complete.

1. **(a) Nino’s final review of the whole site:** review Georgian/English content, all nine source-checked Actions and their authority/applicant/partner qualifications, the official deadlines/resources/publications, ERIDA/NEO roles, policies, navigation and mobile views. Use ACTION-REVIEW.md and review/session-20. Final manual keyboard, screen-reader/language announcements, 200% text resize, 400% zoom/reflow, forced colours, reduced motion and Georgian readability review remain unconfirmed; automated axe does not replace them.
2. **(b) NEO facts from TBC.md:** supply the three team names/role emails, shared NEO contact, address, phone, email, hours confirmation, HERE membership and ERIDA legal code/address/rights contact. Apply approved values in both languages, regenerate TBC.md and verify no missing fact remains. Supply real social URLs or leave the block hidden.
3. **(c) Signed grant agreement check:** expected at the end of November 2026 (Nino via Luka). Confirm funding wording, visibility and website obligations against the signed agreement. Until then retain the current EACEA model Article 17 wording, approved artwork and unchanged supplied Georgian disclaimer.
4. **(d) Separate launch change:** after approval, prepare siteLaunched=true and removal of the preview notice as a reviewed change. Before launch, complete the outstanding hosted Event/image round trips, encoded legacy emoji redirect and daily-rebuild confirmation; verify hosted metadata, sitemap, bilingual 404, language switches, redirects, calendar/ICS, indexing, accessibility and performance. Run clean root/project builds, full tests and browser checks after final content edits. Do not claim these hosted results from local tests or merge automatically.

## After launch

Additional staff access/training follows only when the team changes. Newsletter remains deferred until ERIDA has an institutional email and a free service account registered to it; later review terms/privacy before adding a sign-up link. No newsletter, analytics or wider content promotion is authorised by this release-candidate brief.
