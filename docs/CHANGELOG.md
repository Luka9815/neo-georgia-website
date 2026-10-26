# Changelog

Newest at the top. One entry per working session: date, who (agent or person), what changed.

## 2026-10-26 (Codex, session 3: GitHub Pages)
- Logged explicit superseding hosting, account, daily rebuild, routing and indexing decisions. GitHub Pages runs from Luka's repository through GitHub Actions; the domain must belong to ERIDA. Netlify and Cloudflare are dropped for now.
- Added the Pages deployment workflow: push to main, daily 04:15 UTC and manual dispatch; Node 24 from .nvmrc, npm cache, npm ci, build, tests, official artifact upload and deploy actions, minimal scoped permissions and serialized deployments. No check:a11y in CI, build hook or custom secret. Workflow URL values follow the repository owner/name, and hidden files are included in the artifact.
- Added PATH_PREFIX (default /), Eleventy HTML base rewriting and complete SITE_URL metadata, with project-path and custom-domain-root regression builds. The default URL is the GitHub Pages project address.
- Added .nojekyll, a static root home redirect, one bilingual root 404 and empty redirects.json with validated legacy meta-refresh stubs. Removed Netlify configuration and _redirects; both remain in git history. These redirects do not provide HTTP 301 responses.
- Added siteLaunched=false as the indexing control. Tested false and true in isolated builds; redirects and 404 stay noindex after launch.
- Replaced both old hosting guides with GitHub Pages activation and schedule re-enabling instructions. Next task: Pages CMS for News and Events.
- Validation: npm run build and npm test passed in both root and /neo-georgia-website/ layouts, all 14 tests passed in each. npm run check:a11y passed all 42 non-redirect pages in both layouts with zero axe violations, no 320 px overflow and working keyboard skip links/language switches. Internal links, assets, metadata, sitemap, root refresh, bilingual 404 and legacy redirects passed. Workflow YAML and required triggers were checked; current official action interfaces were inspected. git diff --check passed.
- GitHub still reported PR #2 open, so the six session 3 commits depend on its four session 2 commits. No PR was merged, Pages setting changed or hosted deployment run by Codex. Turn on Pages and verify the first hosted run after review and merge.

## 2026-10-26 (Codex, session 2 fixes)
- Migrated Call opens/deadline and Event date/end to offset-free local wall-clock times plus their named time zone. Added the Temporal polyfill to derive seasonal offsets, compare instants and render machine-readable dates. Editors never enter offsets; invalid, nonexistent and ambiguous times fail clearly.
- Added tests for Brussels spring and autumn clock changes, boundary statuses, Tbilisi, unsafe editor input and derived HTML offsets. Updated the content contract and superseded the old explicit-offset decision.
- Added explicit currentCallYear (2026), current-edition-first calls with descending archives, matching action-page selection and a 2025 archive sample with rendering tests. Home deadlines remain chronological across editions.
- Split the conditional page dispatcher into one Nunjucks template per page type with a shared wrapper and central route grouping. Reformatted JavaScript and CSS, adding short logic comments. All 45 generated HTML documents match the pre-refactor DOM structure, attributes and text apart from whitespace.
- Corrected HANDOVER: session 1 is merged into main via PR #1, with session 2 on a separate review branch. Refreshed the date model, sample counts, call edition and source-layout notes. Updated AGENTS, CONTENT and DECISIONS.
- Validation: npm run build passed without Eleventy warnings; npm test passed all 8 groups; npm run check:a11y passed all 44 non-redirect pages with zero axe violations, no 320 px overflow, working keyboard skip links and language switches. Browser tests used the installed Chromium and the dev server on port 8081. git diff --check passed.
- No external accounts or live-host deployments. Hosting/CMS comparison, final EU assets and build-hook activation remain pending. Session 2 is submitted as a PR against main; no automatic merge.

## 2026-10-26 (Codex, build session 1)
- Built the Eleventy 3 ESM skeleton with Node 24, bilingual routing, translation dictionaries, same-page language switches and untranslated-news fallback.
- Added a CMS-neutral JSON content layout, shared facts and Markdown text fields, three sample Actions, Calls, Events and News items, and related Resource, Story, FAQ and Page samples.
- Added six-block homes, current-year grouped calls with Brussels dates and computed status, automatic action blocks, supporting listings/details, bilingual 404s, responsive CSS and the requested EU emblem placeholder and disclaimer footer.
- Added preview SEO metadata, sitemap, noindex safeguards, Netlify configuration and Cloudflare Pages connection instructions. No accounts, push or live deployment.
- Added generated-site tests and browser axe, keyboard, switch and 320 px overflow checks. Clean npm ci and npm run build passed; all 5 test groups passed; all 44 non-redirect pages passed axe with zero violations and passed the browser interaction/layout checks. Internal links, language versions and footer checks passed. git diff --check passed.
- Updated AGENTS commands, content documentation, decisions and handover. Logged the daily rebuild plan; activating the build hook, both live previews, final assets and CMS tests remain pending.

## 2026-10-26 (Claude)
- Repository seeded with AGENTS.md, CLAUDE.md, docs/HANDOVER.md, docs/DECISIONS.md, docs/CHANGELOG.md and docs/SITE-PLAN.md (site plan v0.1, converted from the approved Word version).
