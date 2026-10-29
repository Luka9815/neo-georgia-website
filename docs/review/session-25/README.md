# Session 25 review follow-ups

Baseline: origin/main 661def8818aeadf77ffeaf8716e5ef75f4a9fefa (merged PR #24), verified through the GitHub API. PR #25 is not incorporated and .github/workflows/deploy.yml is untouched. Node 24.19.0, npm ci; no dependency changes.

## Changes

Office address and hours are Luka’s confirmed facts from 2026-10-29, logged in the dated 2026-10-30 decisions. Exactly 16 authored office placeholders remain; legal.registeredAddress remains [TBC]. Team cards use integer Person order, single role headings, labelled names and mailto only for real role emails. All stubs retain validated targets, noindex and canonical; their language follows their target. Root behaviour is preserved. Fifteen further WordPress pages use exact draft-encoded paths and the approved targets. The report retains the excluded drafts, placeholder-title 34308 and blank /35915-2/.

A local inventory-only check found exactly 54 hand-entered URLs and 6,764 generated project-result URLs; default selection contains all 54 plus 200 distinct project URLs, with no network request made. LINKS.md attributes the supplied external results to Luka’s review, performed by Claude on an outbound-capable network. It documents checker configuration and incremental output. No fresh external audit, hosted CMS round trip, domain check, signed-grant review, real screen-reader audit or Nino review is claimed. EPALE remains a manual browser check for Luka. Remaining office facts: phone, email, ERIDA legal code and registered address, privacy/accessibility contacts, team names and role emails, HERE members and social links. No new NEO facts, launch switch or preview removal.

## Screenshots

48 captures: before/after, 390/1280px, Georgian/English sweeps of Contact, footer, Team, former HERE stub, /contact/ legacy stub and Credits. The legacy /contact/ target is Georgian in both sweeps, as required by target-language rendering. The before build is an isolated archive of origin/main. Only meta-refresh navigation is suppressed in the browser screenshot response so the actual stub can be seen; built files, canonical, lang and visible links remain unchanged. Each phase includes screenshots.json with routes, response status and html language. Representative captures were visually inspected for wrapping, ordered role cards, confirmed Georgian contact details, English stub chrome and Credits. Footer retains its existing shared email, navigation and EU artwork.

## Reproduction

Use a separate clean source copy for each layout, linked to the installed node_modules. Share PORTAL_IMAGE_CACHE_DIR to reuse content/encoder-hashed image variants. Tests keep all existing fixtures and rules.

```sh
npm ci
npm run report:tbc
rm -rf _site
SITE_URL=https://example.org/ PATH_PREFIX=/ npm run build
SITE_URL=https://example.org/ PATH_PREFIX=/ PORTAL_IMAGE_CACHE_DIR=/workspace/neo-georgia-website/.cache/portal-images NODE_DISABLE_COMPILE_CACHE=1 npm test -- --test-concurrency=1
# Serve _site at the root, then run:
SITE_URL=https://example.org/ PATH_PREFIX=/ TEST_URL=http://127.0.0.1:8080 PORTAL_IMAGE_CACHE_DIR=/workspace/neo-georgia-website/.cache/portal-images npm run check:a11y
# In the independent prefix copy, clean _site and repeat with:
# SITE_URL=https://luka9815.github.io/neo-georgia-website/
# PATH_PREFIX=/neo-georgia-website/
# Mount that output at /neo-georgia-website/ for check:a11y.
REVIEW_ROOT=/tmp/neo-session25-before REVIEW_PHASE=before node scripts/review-session-25.js
REVIEW_PHASE=after node scripts/review-session-25.js
```

The screenshot script starts and closes its own local server. The manual link checker remains outside build/test/CI execution. Selection tests import only its inert helpers and make no network requests.

## Final validation

Fresh independent root and project-prefix builds pass: 313 generated files each, Pagefind 40 pages per language. All 309 HTML files per layout match the tested output after normalising only the displayed millisecond build timestamp. See clean-builds.json and logs/root-build.log, logs/prefix-build.log.

Full tests pass in both layouts: 201 tests each, zero failures, skips or cancellations. The corrected launch/Team selection also passes all 11 focused tests. Raw logs retain all existing fixture coverage. npm run report:tbc reports exactly 16 occurrences, git diff --check passes, no added U+2014, no dependency change and no deploy-workflow change.

Complete npm run check:a11y passes in both layouts: 109 pages each, zero axe violations. Existing editable-surface, image decoding, calendar, project, search, populated fixture, keyboard, language switching, 320px, no-JavaScript and forced-colour checks all pass. See logs/root-a11y.log and logs/prefix-a11y.log. Automated checks do not establish a complete manual WCAG audit.
