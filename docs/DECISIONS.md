# Decisions log

Dated, newest at the bottom. Never delete or silently reverse an entry: add a new entry that supersedes it and say which one.

Format: `## YYYY-MM-DD: title`, then the decision and a short reason.

## 2026-10-24: Rebuild from scratch, not migrate the WordPress site
The current erasmus.org.ge (WordPress/Elementor) is poorly structured and hard to maintain. The new site is built from scratch; only content is migrated, through a structured export. In grant reporting this is presented as the establishment and further development of the NEO website (WP3), consistent with the application.

## 2026-10-24: Static site with Eleventy, code on GitHub
Eleventy static site in a GitHub repository. No database or server to maintain or secure, free hosting, same stack as geba.ge.

## 2026-10-24: Repository ownership
Repository lives on Luka's personal GitHub account (Luka9815) during the build and is transferred to an ERIDA/NEO GitHub organisation at launch. The transfer must be logged here and in HANDOVER.md.

## 2026-10-24: Accounts registered to an ERIDA/NEO email
Hosting, CMS, analytics and domain accounts are registered to an ERIDA/NEO email address, never a personal one, so the NEO keeps control after handover.

## 2026-10-24: Languages
Georgian primary, English secondary, full parity for core pages (Action, Call, Event, FAQ, Page, Person). News and Stories may be Georgian only.

## 2026-10-24: URLs use English slugs in both languages
`/ka/calls/`, `/en/calls/`. Avoids long percent-encoded Georgian URLs.

## 2026-10-24: Seven top-level menu items
Home, Opportunities, Calls and deadlines, Events, News, Resources, About. Replaces the current twelve. Details in SITE-PLAN.md.

## 2026-10-24: Content as linked types, each fact entered once
Action, Call, Event, Resource, News, Story, Publication, FAQ, Person, Page. Deadlines and events are entered once and shown wherever needed.

## 2026-10-24: No sliders, no pop-ups
Hurts accessibility and performance with no benefit for users.

## 2026-10 (approved): Site plan v0.1
docs/SITE-PLAN.md approved as the basis for the build.

## 2026-10-26: Division of work between agents
Codex does the bulk of the coding. Claude reviews changes against AGENTS.md, checks EU visibility, accessibility and Georgian text, and drafts the next task prompts. AGENTS.md is the single source of instructions; CLAUDE.md only points to it. Luka relays between assistants.

## 2026-10-26: Public repository
The repository is public. Acceptable for a public website and free tiers of hosting and CMS; consequence: no secrets, tokens or personal emails are ever committed.

## Open (not yet decided)
- Hosting: Netlify or Cloudflare Pages (test both in the first build session).
- Staff editor: Decap CMS or Pages CMS (test with hosting; check whether editors need GitHub accounts).
- Bilingual file layout for content (must work with the chosen CMS).
- Search: Pagefind or alternative, after testing with Georgian.
- Analytics: cookieless option to choose.
- Scheduled daily rebuild method (so call and event status stays current).
- Domain: keep erasmus.org.ge (needs written transfer from current host before January 2027) or new domain. Decision by Nino; most urgent.
- Prevailing language in case of discrepancy (current site says English prevails). Decision by Nino.
- Actions that get their own page, confirmed against the current Programme Guide. Decision by Nino.
- Font: FiraGO or Noto Sans Georgian plus Noto Sans.
- Georgian disclaimer text (no official EACEA version).
