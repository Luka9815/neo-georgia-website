# AGENTS.md: NEO Georgia website

Canonical instructions for every coding agent (Codex, Claude Code, others). `CLAUDE.md` only points here. If anything in this file conflicts with a prompt, stop and flag it rather than guessing.

## 1. What this is

The new public website of the National Erasmus+ Office (NEO) Georgia, replacing the current WordPress site (erasmus.org.ge). It is rebuilt from scratch: nothing from the old theme, plugins or page structure is reused. Only content is migrated.

- Owner: ERIDA (Education, Research and International Development Association), host organisation of NEO Georgia. Coordinator: Dr Nino Inasaridze.
- Technical lead: Luka Janjgava.
- Funded under Erasmus+ (EACEA), NEO grant 2027-2029, Work Package 3 (Dissemination, Visibility and Exploitation of Results). The site is a grant deliverable: "NEO website (establishment, updates and maintenance report)".
- Must be ready for the NEO team to run from January 2027.

Read before working: `docs/HANDOVER.md` (current state and next task), `docs/DECISIONS.md` (what is settled), `docs/SITE-PLAN.md` (approved structure, content model and templates).

## 2. Working rules for agents

1. Start every session by reading `docs/HANDOVER.md` and `docs/DECISIONS.md`.
2. Never silently reverse a logged decision. If you think one is wrong, say so in your summary and propose a new DECISIONS entry.
3. When you make a choice that a future agent would need to know (library, folder layout, naming, data format), add a dated entry to `docs/DECISIONS.md` with one or two lines of reasoning.
4. End every session by updating `docs/HANDOVER.md` (current state, open tasks, next step) and adding a dated entry to `docs/CHANGELOG.md`.
5. Keep changes small and reviewable. One topic per commit, clear commit messages in English.
6. Do not add paid services, paid plugins, trackers, or dependencies that need an account, unless a DECISIONS entry allows it.
7. Never commit secrets, tokens or personal email addresses. The repository is public.
8. Before finishing, run `npm run build` and fix all errors. Run the checks in section 9.

## 3. Stack

| Item | Choice | Status |
|---|---|---|
| Site generator | Eleventy 3.x, Node LTS, ESM config (`eleventy.config.js`) | Decided |
| Templates | Nunjucks for layouts and partials; Markdown for body content | Default, change only with a DECISIONS entry |
| CSS | Plain modern CSS with custom properties. No CSS framework, no Tailwind | Default |
| JavaScript | None by default. Small progressive-enhancement scripts only where needed (filters, menu). Site must work without JS | Default |
| Hosting | GitHub Pages from this repository, deployed by GitHub Actions | Decided (session 3) |
| Staff editor (Git CMS) | Pages CMS with GitHub sign-in, News and Events | Configured; hosted editing to test |
| Search | Static index built at build time (Pagefind is the first candidate). Must be tested with Georgian text | To test |
| Analytics | Privacy-friendly and cookieless (candidates: Cloudflare Web Analytics, GoatCounter) | To choose |
| Images | Eleventy Image: responsive sizes, AVIF/WebP, width and height set, lazy loading below the fold | Default |

Commands (Node 24 LTS, pinned in `.nvmrc`; run from the repository root):

- `npm ci`: install the locked development dependencies (including Eleventy)
- `npm start`: local dev server
- `npm run build`: production build to `_site/`
- `npm test`: check generated pages, internal links, content relationships and date calculations after building
- `npm run check:a11y`: with `npm start` running, check pages using axe and Chromium (see docs/HANDOVER.md)

## 4. Languages and URLs

- Georgian (`ka`) is primary, English (`en`) secondary. Core content types (Action, Call, Event, FAQ, Page, Person) must exist in both languages. News and Stories may be Georgian only; the English listing then shows only English items, and never a broken link.
- URL pattern: `/ka/...` and `/en/...` with the same English slugs in both, for example `/ka/calls/` and `/en/calls/`. No Georgian characters in URLs.
- Root `/` redirects to `/ka/`.
- Every page has a language switcher that links to the same page in the other language, or to that section's index if no translation exists.
- `<html lang="ka">` or `lang="en"`; `hreflang` alternates in `<head>`.
- All interface strings (menu, buttons, labels, dates, footer) come from one translation file per language in `src/_data/`, never hard-coded in templates.
- Dates are written out in the page language (Georgian month names on `/ka/`).
- Georgian typography: never apply `text-transform: uppercase` or `capitalize` to Georgian text (browsers render it as Mtavruli). Design menus and buttons around the longer Georgian labels first.
- Person names follow the Georgian national transliteration system, applied the same way everywhere.
- Prevailing language in case of discrepancy: not yet decided (see DECISIONS). Leave a footer placeholder.

## 5. Content model

Content is stored as linked types, not free pages. Enter each fact once; templates assemble it wherever it is needed. Full field lists are in `docs/SITE-PLAN.md` ("Content model").

Types: Action, Call, Event, Resource, News, Story, Publication, FAQ, Person, Page.

Hard requirements:

- References between types use stable slugs (for example a Call refers to its Action by `action: cbhe`). An action page automatically lists its current call, upcoming and past events, resources, stories and FAQs.
- Language-independent facts (dates, deadline, links, files, related actions) are stored once per item, not once per language. Only text fields are duplicated per language.
- The file layout must be editable by the chosen Git CMS (both candidates must be considered until one is chosen) and readable by a non-developer opening the file on GitHub.
- Call deadlines are stored with an explicit time zone (Europe/Brussels) and shown as Brussels time, labelled as such.
- Status values (call: upcoming, open, closed; event: upcoming, past) are calculated, never typed in. Because the site is static, status must stay correct between deploys: use the daily GitHub Actions Pages deployment schedule and log the method in DECISIONS.
- Every Resource carries a `source` field: `official` (EACEA/EU), `neo` (NEO Georgia guidance) or `partner`, shown visibly on the page, with a link to the original for official items.
- Every image field requires alt text in both core languages.

## 6. Structure and templates

Sitemap, menu labels in both languages, and the 14 page templates are defined in `docs/SITE-PLAN.md`. Do not add top-level menu items without a DECISIONS entry. No image sliders, no pop-ups, no carousels.

Folder layout (session 1; content contract in `docs/CONTENT.md`):

```
src/
  _data/          site settings, i18n strings (ka.json, en.json)
  _includes/      shared layouts and partials
  pages/          one Nunjucks template per page type
  content/        one folder per content type, one JSON file per item
  assets/         css, fonts, images, icons, EU emblem files
lib/              shared content, date and status helpers
scripts/          browser accessibility check
test/             generated-site and content checks
docs/             HANDOVER, DECISIONS, CHANGELOG, SITE-PLAN, CONTENT
```

## 7. EU visibility and compliance (every page)

Source: EACEA visual identity 2021-2027, "European flag emblem and multilingual disclaimer" (https://www.eacea.ec.europa.eu/about-eacea/visual-identity/visual-identity-programming-period-2021-2027/european-flag-emblem-and-multilingual-disclaimer_en) and Article 17 of the grant agreement. Re-check both before launch.

- The footer of every page shows the EU emblem with the funding statement and the disclaimer.
- Use the official emblem files only (download from the EACEA page above; the Georgian version is under non-EU languages). Do not redraw, recolour, crop or distort. Use the Georgian file on `/ka/` and the English file on `/en/`. Store the originals in `src/assets/eu/` with a note of where they came from.
- Use "Funded by the European Union" (not "Co-funded") unless the grant agreement says otherwise. Flag this for confirmation once the grant agreement is signed.
- English disclaimer, verbatim:
  "Funded by the European Union. Views and opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European Union or the European Education and Culture Executive Agency (EACEA). Neither the European Union nor EACEA can be held responsible for them."
- Georgian disclaimer: EACEA publishes no official Georgian text. Use a placeholder clearly marked `TODO: Georgian disclaimer, to be approved by NEO` until the NEO provides an approved translation. Never machine-translate it into production.
- The emblem must be at least as prominent as other logos shown with it, and must not be linked to imply EU endorsement of third-party content.
- Footer also contains: contact details, social links, privacy and cookie notice, accessibility statement, prevailing-language statement.

## 8. Quality bar

- Mobile-first, responsive from 320 px wide.
- Accessibility target WCAG 2.1 AA: semantic HTML, one `h1` per page, logical heading order, colour contrast at least 4.5:1 for text, visible focus, full keyboard navigation, skip link, form labels, alt text, captions or transcripts for recordings where possible.
- Performance: no render-blocking third-party requests. Fonts self-hosted (candidates: FiraGO, or Noto Sans Georgian plus Noto Sans), subset where possible, `font-display: swap`. Lighthouse mobile score target 90+ in all categories.
- Privacy: no cookies unless strictly necessary. No Google Fonts, no embedded trackers. Embedded video (YouTube) only behind a click-to-load placeholder or via the privacy-enhanced domain.
- SEO basics: unique titles and descriptions per language, canonical URLs, `sitemap.xml`, `robots.txt`, Open Graph tags.
- 404 page in both languages.
- If the existing domain is kept, every old URL must redirect to its new page (redirect map generated from the WordPress export, kept in the repo).

## 9. Checks before finishing a session

- `npm run build` succeeds with no warnings you introduced.
- Both `/ka/` and `/en/` versions of every page you touched render, and the language switcher works.
- No broken internal links.
- EU footer present on every page you touched.
- Basic accessibility check on changed templates (axe or Lighthouse).
- `docs/HANDOVER.md` and `docs/CHANGELOG.md` updated.

## 10. Writing style for site text and docs

- British English for English text.
- No em dashes in any site text or documentation; use commas, colons, parentheses or separate sentences.
- Plain, short sentences. Erasmus+ terminology as used in the current Erasmus+ Programme Guide (for example "Capacity Building in Higher Education", "International Credit Mobility", "Key Action 1").
- Placeholder content must be obviously placeholder (prefixed `[SAMPLE]`), so it can never be mistaken for real information.
