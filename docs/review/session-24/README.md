# Session 24 review

Started from merged Session 23, origin/main 58af202, on codex/session-24-launch-ready. Node 24.19.0 and npm ci. siteLaunched remains false in tracked settings. No merge, domain change, real 2027 Call, hosted CMS round trip, signed-grant check or Nino approval is claimed.

## Results and limits

Clean root and project-prefix builds pass. Each layout passes 197 full tests and the complete 109-page browser sweep with zero axe violations. Final CMS bound/guidance checks and document-style checks also pass. The launched root/prefix fixtures and the named-marker rejection are included in the test suite. Earlier interrupted attempts are retained as raw evidence, not counted as passes. Root and prefix outputs are now separate: the first root accessibility attempt was invalidated when a prefix build rewrote its served output; the final sweeps use stable independent copies.

- Office facts: 20 remaining central placeholders map to the original 26 authored occurrences. See ../TBC.md and npm run report:tbc.
- Legacy pages: 178 of 202 included under Luka-approved rules, 24 omitted with reasons. See [REDIRECTS-PAGES.md](../../../migration/review/REDIRECTS-PAGES.md). Targets/collisions/decoded Unicode remain validated.
- CMS: current source 6f4e860 checked 2026-10-29. One Settings group contains two single-file forms because a file entry has one path. No hosted-app revision or hosted Event/image result is claimed.
- External audit: 7,112 URLs inventoried, zero successful responses. All remain unverified. Representative curl requests returned CONNECT HTTP 403; Node fetch requests were cancelled. See LINKS.md, links.json and raw logs. This is not evidence that the source links are broken.
- Accessibility: 24 page/language checks record Tab order, focus/ancestor rings, DOM landmarks/headings/lang, Chromium accessibility snapshots, 200% text, 320 CSS px reflow, forced colours and reduced motion. No real screen reader or actual OS/browser 400% zoom was used. See ACCESSIBILITY.md; Nino’s manual review remains required.
- Serial mobile Lighthouse: all 34 template/language runs pass performance 90+ (96–100), accessibility 100 and best practices 100; SEO is 69 under the required preview/noindex/robots block. See LIGHTHOUSE.md and the final raw log.
- Photography/source rights and EU wording are unchanged. Screenshots are local evidence, not approval of office facts or grant wording.

## Captures

There are 192 full-page captures: 64 before, 64 after and 64 launched-fixture captures. Each phase covers Contact, Team, HERE old/new URLs, Privacy, Accessibility, credits, Calls, Home, About, Opportunities and all five Find audiences in ka/en at 390/1280px. The new HERE URL is absent in the baseline, so its baseline screenshot records the local server’s 404, not a deployed-site claim. The old HERE URL in after/launched captures follows the immediate meta refresh to the new page; raw HTML/redirect tests establish the stub itself. Launched captures use only test/fixtures/office-launched.json in an isolated source copy; the names/contacts/addresses are explicit fixtures and never public records.

Commands:

```sh
# Baseline copy from origin/main, with local node_modules and shared generated image cache
PORTAL_IMAGE_CACHE_DIR=/workspace/neo-georgia-website/.cache/portal-images npm run build
REVIEW_PHASE=before TEST_URL=http://127.0.0.1:8141 node scripts/review-session-24.js
# Current preview root served at 8142
TEST_URL=http://127.0.0.1:8142 node scripts/review-session-24.js
TEST_URL=http://127.0.0.1:8142 node scripts/accessibility-session-24.js
# Isolated siteLaunched=true + office-launched.json build served at 8143
REVIEW_PHASE=launched TEST_URL=http://127.0.0.1:8143 node scripts/review-session-24.js
```

Create isolated copies with scripts/fixture-site.js; buildFixtureSite honours the selected prefix. Do not change tracked settings for fixture captures. Baseline/current servers serve _site; the prefix server mounts its independent output at /neo-georgia-website/.

## Reproduction

```sh
npm ci
npm run report:tbc
rm -rf _site
SITE_URL=https://example.org/ PATH_PREFIX=/ npm run build
SITE_URL=https://example.org/ PATH_PREFIX=/ PORTAL_IMAGE_CACHE_DIR=/workspace/neo-georgia-website/.cache/portal-images NODE_DISABLE_COMPILE_CACHE=1 npm test -- --test-concurrency=1
SITE_URL=https://example.org/ PATH_PREFIX=/ TEST_URL=http://127.0.0.1:8142 PORTAL_IMAGE_CACHE_DIR=/workspace/neo-georgia-website/.cache/portal-images npm run check:a11y
# Repeat in a separate clean copy, mounted under the prefix on port 8144
SITE_URL=https://luka9815.github.io/neo-georgia-website/ PATH_PREFIX=/neo-georgia-website/ npm run build
SITE_URL=https://luka9815.github.io/neo-georgia-website/ PATH_PREFIX=/neo-georgia-website/ PORTAL_IMAGE_CACHE_DIR=/workspace/neo-georgia-website/.cache/portal-images NODE_DISABLE_COMPILE_CACHE=1 npm test -- --test-concurrency=1
SITE_URL=https://luka9815.github.io/neo-georgia-website/ PATH_PREFIX=/neo-georgia-website/ TEST_URL=http://127.0.0.1:8144 PORTAL_IMAGE_CACHE_DIR=/workspace/neo-georgia-website/.cache/portal-images npm run check:a11y
NODE_USE_ENV_PROXY=1 npm run check:links
PORTAL_IMAGE_CACHE_DIR=/workspace/neo-georgia-website/.cache/portal-images node scripts/audit-session-24-unused.js
# Run serially after all other checks finish; Lighthouse is installed outside this repo
LIGHTHOUSE_ROOT=/tmp/neo-session24-lighthouse/node_modules TEST_URL=http://127.0.0.1:8142 node scripts/measure-session-24.js
```

PROOFREADING.md records exact before/after wording changes. UNUSED.md lists removals and the root/prefix populated-fixture CSS audit. TEST-CHANGES.txt lists every changed test/fixture; SOURCE-CHANGES.txt lists source changes. Historical News and Action/source-deadline regressions run against isolated snapshots, while production rendering counts derive from current records. Existing fixture/rule coverage remains. The external-link checker is not part of CI/build.
