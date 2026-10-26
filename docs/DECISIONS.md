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


## 2026-10-26: Session 1 content layout
Use one JSON file per item in `src/content/<type>/`, with shared facts at the top level and nested `ka` and `en` text objects. Bodies are Markdown strings rendered by markdown-it with raw HTML disabled. Both Decap and Pages CMS support JSON collections and nested object fields, so neither requires a translation plugin. See docs/CONTENT.md; authenticated editor testing remains open. This resolves the earlier open bilingual-layout item.

## 2026-10-26: Session 1 toolchain and rendering
Use Node 24 LTS, Eleventy 3 ESM, Nunjucks, plain CSS and system fonts for the skeleton. Keep package-lock.json and use npm ci. Generate routes from the content catalog; exclude untranslated News and Stories from English listings and use a section-index language fallback. No client JavaScript, images, trackers or remote fonts are needed in this skeleton. Final font and image-pipeline choices remain open.

## 2026-10-26: Sample preview safeguards and EU placeholder
All sample records and draft text begin with [SAMPLE]. Both previews are noindex with robots disallowing crawling until real content is approved. Use host build URLs for canonical metadata, overridable by SITE_URL. The handover explicitly requests an emblem placeholder for session 1; use labelled text, never a redrawn flag. Original EACEA assets and the approved Georgian disclaimer remain launch requirements.

## 2026-10-26: Computed statuses and daily rebuild plan
Compute call status from opens/deadline instants and event status from the event end. Calls store Europe/Brussels plus an explicit seasonal offset; format dates using the language files and Intl time-zone conversion. After selecting a host, add a daily GitHub Actions schedule at 04:15 UTC that POSTs to that host's build hook, stored only as a repository Actions secret named SITE_BUILD_HOOK. Enable workflow_dispatch for manual retries. Until that hook exists, a manual host rebuild is required to refresh time-sensitive statuses. This selects the rebuild method; activation remains open until hosting is connected.

## 2026-10-26: Portable hosting and repeatable checks
Both hosts build with npm run build and publish _site using Node 24. Share only the supported root 302 in _redirects. Netlify has language-specific 404 rules in netlify.toml; Cloudflare Pages uses the root Georgian 404 with an English 404 switch, avoiding unsupported 404 rules in its _redirects format. No host is selected until both live deployments are tested. Use node:test with Cheerio for generated-site checks and Playwright with axe for basic accessibility and 320 px layout checks.
