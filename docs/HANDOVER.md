# Handover

Last updated: 2026-10-29 (Codex, Session 21 redesign)

## Current state

Branch codex/session-21-redesign starts at origin/main 0350527. PR #21 targets main. Luka’s Session 21 brief supersedes the Session 20 visual freeze; the approved content, project snapshot, existing URLs and seven main destinations remain unchanged. No merge or launch is authorised. siteLaunched=false, exact January 2027 notice, noindex and robots disallow remain. The previous handover is archived at archive/HANDOVER-SESSION-20.md.

## Per-item status

| Item | Implementation | Status |
| --- | --- | --- |
| Design system | Blue/teal/warm tokens, 8px scale, 75rem container, Noto, sticky native header, dark three-column footer and local Lucide icons | Implemented |
| 1. Home | Photo introduction, five audience choices, nine Action tiles, computed figures and mini-chart, News, compact empty Calls/Events | Implemented |
| 2. Actions | Icon/Key Action hero, eligibility/role/deadline/source sidebar, mapped-project count | Implemented |
| 3. Other templates | Shared portal system and native FAQ accordions, retaining every existing route and enhancement | Implemented |
| 4. Photos | One expressly approved NEO photograph with source/permission/credit/hash, responsive AVIF/WebP/JPEG | Implemented with the brief’s fewer-than-five fallback |
| 5. Finder | Bilingual /find/ and student/university/youth/vet/sport pages, static links and qualified next steps/contacts | Implemented |
| 6. Charts | Build-time year, Action/sector, status and top-15 organisation SVGs with equivalent tables | Implemented |
| 7. Map | Whole-border Georgia SVG, 40 reviewed GeoNames city/alias records, keyboard bubble/table links | Implemented, 38 unresolved locations explicit |

All numbered items have separate commits, plus the shared design-system and final quality/review commits. DECISIONS records each as (Luka), not Nino approval. DESIGN.md explains the current components, contrast pairs and budgets. review/session-21 contains before/after evidence, validation and measured limits.

## Content and data preserved

Nine source-checked Actions, eleven closed 2026 Calls, twelve FAQs, four official Resources, two external Publications, five approved bilingual News posts, role-based Team/HERE placeholders and final About/Contact/policy copy remain. No public sample/draft markers. The 26 authored TBC occurrences remain inventoried in review/session-20/TBC.md; do not invent missing NEO facts. Production Events/Stories are empty and fixture-backed; real future records restore their surfaces. Static ICS UIDs stay domain-independent and named-zone/DST rules remain unchanged.

Projects still use the approved 28 October 2026 snapshot: 6,764 projects, 605 named organisation identifiers, 5,079 institution participations, 106 Georgian-coordinated projects, 2,045 mobility-country projects. Raw 606/7,124 regression totals remain verified. Keep the KA107/2014–2020 warning beside year/Action comparisons and immediately under year charts. No live project fetch was performed or added to build/test/CI. Public projection, action mapping, funding exclusions and manual refresh guards are unchanged.

Top organisations count unique project references per named source ID and show the first submitted original name; no institution-name merging. Map counts each named ID once: 567 mapped, 38 unresolved (23 missing, 5 conflicts, 10 without reviewed alias/coordinate). The unresolved bubble is explicitly outside the geographic outline. Both bubble and table totals equal 605. See src/assets/maps/README.md for boundary, coordinate-cache provenance, aliases, limits and update instructions. Never guess coordinates or change the whole internationally recognised outline to a de facto clipped border.

The accepted photograph is the already approved adult NEO dissemination event. A licensed campus candidate was found but its download was denied by the environment’s network policy; no additional AV file with individual reuse rights confirmed was accepted. One photo is the brief’s permitted fallback, with icon/colour panels elsewhere. Source/permission/credit/date/hash are in portalPhotos.json and src/assets/images/README.md. Retain all approved original EU artwork and exact disclaimers, complete white-box emblem derivatives and the subordinate text wordmark. No programme logo, new NEO logo, external requests, trackers, analytics, cookies or new production dependencies. Fonts remain 99,184 bytes; evaluated FiraGO would raise that to 159,252 bytes and was declined.

## Editor and operations

Luka remains the sole editor. Pages CMS handles News, Events and Settings. Hosted News create/build/check/delete is confirmed; hosted Event and image round trips remain unconfirmed. Local fixtures do not establish hosted behaviour. The new finder guidance, approved-photo manifest and map aliases are reviewed JSON edits, not new CMS collections. See CONTENT.md and EDITING.md.

Keep the fixture-first sample content and all isolated populated/empty relationship, CMS, calendar/ICS and image tests. Fixture dates remain relative so coverage survives January 2027. Existing per-year projects stay outside Pagefind; finder routes are indexed in their own language. Search and Publications progressive enhancements are retained.

Main/manual/daily 04:15 UTC (08:15 Tbilisi) Pages deploys remain. Domain choice is not a current blocker; institutional ownership/transfer remains required when moving. Newsletter stays deferred.

## Validation and reproduction

Use Node 24 LTS and locked dependencies. Build/test never fetch project/map/photo data. Read review/session-21/README.md and report.json for final results and the baseline comparison.

Clean root: npm run build, then NODE_DISABLE_COMPILE_CACHE=1 npm test -- --test-concurrency=1. Set TEST_URL to a local server and run npm run check:a11y. Final full suites disable the local Node compile cache because a restored cache was observed to suppress per-case registration/output. This is an environment workaround, not a reduction of coverage.

Project prefix: PATH_PREFIX=/neo-georgia-website/ and SITE_URL=https://luka9815.github.io/neo-georgia-website/ for build/tests/browser checks. Serve beneath that prefix and use an isolated copy to preserve root output. Browser scans cover every non-redirect page, use two independent workers with full violation details (all rules still run), and retain all native menu, Publications, image, populated/empty calendar, projects and search checks. The portal check adds 320px no-JavaScript finder/FAQ/map/keyboard scrolling in normal/forced colours and reduced motion. Scroll assertions compare movement in either direction, allowing native scroll restoration.

Run scripts/review-session-21.js with REVIEW_PHASE=before/after and TEST_URL for the 24 captures per phase. Before Find did not exist and is honestly recorded as HTTP 404, not a previous design. scripts/measure-session-21.js uses an external Lighthouse installation via LIGHTHOUSE_ROOT, not a site dependency. Measure serially with build/test/browser workers idle; loaded timing trials are not comparable to the baseline. Local automated scores are not hosted performance guarantees or a complete manual WCAG audit.

## Launch checklist

Keep siteLaunched=false and the preview/noindex state until these four stages are complete.

1. **(a) Nino’s final review of the whole site:** review Georgian/English content, all nine source-checked Actions and their authority/applicant/partner qualifications, the official deadlines/resources/publications, ERIDA/NEO roles, policies, navigation and mobile views. Include the new design, finder roles/contacts, chart interpretation, city aliases/unresolved counts and approved-photo placements. Use ACTION-REVIEW.md and the Session 20 content plus Session 21 design review evidence. Final manual keyboard, screen-reader/language announcements, 200% text resize, 400% zoom/reflow, forced colours, reduced motion and Georgian readability review remain unconfirmed; automated axe does not replace them.
2. **(b) NEO facts from TBC.md:** supply the three team names/role emails, shared NEO contact, address, phone, email, hours confirmation, HERE membership and ERIDA legal code/address/rights contact. Apply approved values in both languages, regenerate TBC.md and verify no missing fact remains. Supply real social URLs or leave the block hidden.
3. **(c) Signed grant agreement check:** expected at the end of November 2026 (Nino via Luka). Confirm funding wording, visibility and website obligations against the signed agreement. Until then retain the current EACEA model Article 17 wording, approved artwork and unchanged supplied Georgian disclaimer.
4. **(d) Separate launch change:** after approval, prepare siteLaunched=true and removal of the preview notice as a reviewed change. Before launch, complete the outstanding hosted Event/image round trips, encoded legacy emoji redirect and daily-rebuild confirmation; verify hosted metadata, sitemap, bilingual 404, language switches, redirects, calendar/ICS, indexing, accessibility and performance. Run clean root/project builds, full tests and browser checks after final content edits. Do not claim these hosted results from local tests or merge automatically.

## After launch

Additional staff access/training follows only when the team changes. Newsletter remains deferred until ERIDA has an institutional email and a free service account registered to it; later review terms/privacy before adding a sign-up link. No newsletter, analytics or wider content promotion is authorised by this release-candidate brief.
