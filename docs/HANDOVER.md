# Handover

Update at the end of every working session. Self-contained: another agent must be able to continue from this file, AGENTS.md and DECISIONS.md alone.

Last updated: 2026-10-26 (Claude, repository set-up)

## Current state

- Repository created and seeded with documentation only: AGENTS.md, CLAUDE.md, docs/ (HANDOVER, DECISIONS, CHANGELOG, SITE-PLAN). No code yet.
- Site plan v0.1 approved (docs/SITE-PLAN.md).
- Target: test version on a temporary address, then full site ready for the NEO team from January 2027.

## Next task: build session 1 (Codex)

Goal: a working skeleton and two preview deployments to choose hosting on evidence.

1. Scaffold Eleventy 3 (ESM) with `npm start` and `npm run build`; record the commands in AGENTS.md section 3.
2. Set up `/ka/` and `/en/` routing, root redirect to `/ka/`, language switcher, i18n string files, hreflang.
3. Propose and implement the content file layout for the types in AGENTS.md section 5 (language-independent fields stored once). Add 2 or 3 `[SAMPLE]` items per type for Action, Call, Event, News. Log the layout in DECISIONS.md.
4. Base layout: header with menu (7 items, both languages), footer with EU emblem placeholder, funding statement, English disclaimer and the Georgian `TODO` placeholder, contact block, and links to privacy, accessibility and prevailing-language notes.
5. Templates: Home (six blocks, with sample data), Calls and deadlines (grouped by Key Action, Brussels time, computed status), one Action page with its automatic blocks, 404 in both languages.
6. Add `netlify.toml` and Cloudflare Pages settings notes; write in HANDOVER how Luka connects each (do not create accounts).
7. Run the checks in AGENTS.md section 9; update HANDOVER, CHANGELOG and DECISIONS.

## Open tasks (after session 1)

- Choose hosting, then test Decap CMS and Pages CMS for News and Events editing.
- Remaining templates (events, event page with materials, news, story, publications, FAQ, people, basic page, contact).
- Search test with Georgian text.
- Design pass: colours from the Erasmus+ visual identity, font choice, contrast checks.
- Scheduled daily rebuild.
- Content migration script from the WordPress export, and redirect map if the domain is kept.

## Waiting on Nino / NEO (blocks launch, not the build)

- Domain decision and written transfer agreement with the current host.
- Admin access or a full export of the current WordPress site.
- NEO Georgia logo files.
- ERIDA/NEO email address for hosting, CMS, analytics and domain accounts.
- Prevailing language; list of actions to feature; who will edit content.
- Approved Georgian disclaimer text.

## Contacts and locations

- NEO working documents (grant application, annexes, site plan source): Google Drive, Cowork/NEO. Website code and its docs live only in this repository.
