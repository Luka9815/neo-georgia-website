# Changelog

Newest at the top. One entry per working session: date, who (agent or person), what changed.

## 2026-10-26 (Codex, build session 1)
- Built the Eleventy 3 ESM skeleton with Node 24, bilingual routing, translation dictionaries, same-page language switches and untranslated-news fallback.
- Added a CMS-neutral JSON content layout, shared facts and Markdown text fields, three sample Actions, Calls, Events and News items, and related Resource, Story, FAQ and Page samples.
- Added six-block homes, current-year grouped calls with Brussels dates and computed status, automatic action blocks, supporting listings/details, bilingual 404s, responsive CSS and the requested EU emblem placeholder and disclaimer footer.
- Added preview SEO metadata, sitemap, noindex safeguards, Netlify configuration and Cloudflare Pages connection instructions. No accounts, push or live deployment.
- Added generated-site tests and browser axe, keyboard, switch and 320 px overflow checks. Clean npm ci and npm run build passed; all 5 test groups passed; all 44 non-redirect pages passed axe with zero violations and passed the browser interaction/layout checks. Internal links, language versions and footer checks passed. git diff --check passed.
- Updated AGENTS commands, content documentation, decisions and handover. Logged the daily rebuild plan; activating the build hook, both live previews, final assets and CMS tests remain pending.

## 2026-10-26 (Claude)
- Repository seeded with AGENTS.md, CLAUDE.md, docs/HANDOVER.md, docs/DECISIONS.md, docs/CHANGELOG.md and docs/SITE-PLAN.md (site plan v0.1, converted from the approved Word version).
