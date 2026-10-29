# Launch runbook

Keep src/_data/settings.json siteLaunched=false until the reviewed launch PR. No environment variable can enable launch. Nino approves content, Luka performs technical work, and the institutional account owner controls DNS, GitHub ownership and CMS access. Tick each step only after its verification is recorded.

## Launch day

1. [ ] **Nino, whole site and ACTION-REVIEW.md:** sign off Georgian/English wording, Action eligibility, institutional roles, policy text, photos, project/chart/map interpretation and mobile navigation (HANDOVER launch stage a). Complete keyboard, screen-reader/language, resize, reflow and Georgian readability review. **Verify:** dated sign-off/evidence linked in HANDOVER; local axe/Lighthouse alone is insufficient.
2. [ ] **NEO supplies facts; Luka or the authorised editor, Pages CMS Settings group:** fill Office details contact/legal data, privacy/accessibility contacts, Team role holders and HERE period/members. Team/HERE are sections of the office form. Supply real social links or leave their list empty. Settings contains currentCallYear separately. **Verify:** both languages and national name transliteration, then run npm run report:tbc until docs/review/TBC.md has zero rows. Do not fill invented facts merely to pass validation.
3. [ ] **Nino via Luka, signed grant agreement:** expected end of November 2026; verify funding wording, disclaimer and website obligations against the signed text. Change only what the agreement requires. **Verify:** record document version/date, relevant clauses and review outcome in DECISIONS; preserve the original emblem assets and supplied Georgian disclaimer until an authorised correction is necessary.
4. [ ] **Authorised editor, Calls and Settings:** follow EDITING.md “Adding the 2027 calls”: one verified 2027 Call per Action, Brussels local deadline, official HTTPS link and sourceChecked date. Leave 2026 records as archive. Set currentCallYear=2027 only after every record is saved. **Verify:** /ka/calls/ and /en/calls/, all Actions and archive years after deployment.
5. [ ] **Luka, hosted Pages CMS and deployed preview:** complete an Event create/save/deploy/check/delete round trip with real authorised test data; separately upload an approved image with ka/en alt text, inspect generated responsive variants, then remove any temporary entry. **Verify:** hosted commit, successful workflow, both languages, calendar/ICS and image paths/alt. Local fixtures do not establish this result.
6. [ ] **Luka and reviewer, separate launch PR:** set siteLaunched=true in settings.json, keep it outside CMS, and retain all final content changes in review. With Node 24 run npm ci, npm run report:tbc, then clean root and project-prefix builds, full tests and check:a11y. Commands are below. **Verify:** unresolved TBC/SAMPLE/DRAFT/ALT NEEDED markers fail the build with file/path/language. Inspect launched fixture evidence and all real final pages. Review, approve and merge this launch PR only after stages a–c and steps 1–5 are complete. Session 24 itself does not launch the site.
7. [ ] **Luka, live deployment URL:** after the successful Pages workflow, verify preview bar absent, index,follow on content pages, noindex on 404/redirects, robots Allow with absolute sitemap URL, every bilingual indexable page and hreflang alternate in sitemap, canonical/hreflang URLs, bilingual /404.html, equivalent language switches, calendar/ICS, search, EU footer and approved artwork on each template. Test at mobile/desktop widths and without JavaScript where supported. **Verify:** record actual live URLs/statuses/screenshots and workflow URL. Confirm a later scheduled daily rebuild ran (04:15 UTC, 08:15 Tbilisi), with date-driven call/event states refreshed.
8. [ ] **Luka, repository docs:** update HANDOVER, DECISIONS and CHANGELOG with approval, launch commit, deployment, verification and remaining limits. **Verify:** links resolve and next operator can reproduce the checks.

### Clean checks

Run a local server for each layout and use its URL in TEST_URL. Keep every existing axe rule and fixture sweep. PORTAL_IMAGE_CACHE_DIR may point to a shared local generated-image cache; it does not skip new encoding or content validation.

```sh
npm ci
npm run report:tbc
rm -rf _site
SITE_URL=https://example.org/ PATH_PREFIX=/ npm run build
NODE_DISABLE_COMPILE_CACHE=1 npm test -- --test-concurrency=1
TEST_URL=http://127.0.0.1:8080 npm run check:a11y
rm -rf _site
SITE_URL=https://example.org/neo-georgia-website/ PATH_PREFIX=/neo-georgia-website/ npm run build
SITE_URL=https://example.org/neo-georgia-website/ PATH_PREFIX=/neo-georgia-website/ NODE_DISABLE_COMPILE_CACHE=1 npm test -- --test-concurrency=1
SITE_URL=https://example.org/neo-georgia-website/ PATH_PREFIX=/neo-georgia-website/ TEST_URL=http://127.0.0.1:8080 npm run check:a11y
```

Replace example.org with the actual reviewed URL for final checks. A github.io SITE_URL warns but does not fail. The prefix server must mount _site at /neo-georgia-website/, matching deployment. Run npm run check:links separately when outbound access permits; inspect failures, redirect targets and report limits.

**Launch rollback, Luka:** revert the launch commit and redeploy the last reviewed preview. Confirm siteLaunched=false, preview bar, noindex and robots Disallow. Reverting content is a separate reviewed decision; preserve already published stable slugs. Crawlers may retain earlier indexing, so verify the deployed safeguards rather than promising immediate removal from search.

## Later domain move

Do this separately after institutional ownership/domain access is confirmed. HTML redirects only take effect for old WordPress links once their domain points to this GitHub Pages deployment; they are not HTTP 301 responses.

1. [ ] **Institutional domain/GitHub owner, registrar and owning GitHub account or organisation:** verify domain ownership using GitHub’s domain-verification TXT record before assigning the custom domain. Check apex/subdomain DNS instructions and current GitHub Pages IP records. **Verify:** GitHub reports the domain verified and DNS records match current documentation, including any AAAA/CNAME requirements. Do not copy unverified IP addresses from an old runbook.
2. [ ] **Luka with owner, repository Settings → Pages:** set the approved custom domain and configure the required DNS. Keep the old WordPress host and its recoverable configuration available. Enable Enforce HTTPS when GitHub’s certificate is ready. **Verify:** DNS check passes, HTTPS certificate covers the domain, and both apex/approved www behaviour follow the documented setup without mixed content.
3. [ ] **Luka, .github/workflows/deploy.yml:** set SITE_URL to the custom HTTPS root and PATH_PREFIX=/, rebuild and deploy. **Verify:** canonical, hreflang, sitemap and robots use the custom HTTPS root, assets load without the project prefix and both language routes work.
4. [ ] **Luka, old WordPress URLs on the actual domain:** use migration/review/REDIRECTS-PAGES.md and src/_data/redirects.json. Verify included URLs load their HTML meta-refresh stub and reach the approved existing destination; test /%f0%9f%93%a3-information-about-capacity-building-project-proposals/ and its decoded /📣-information-about-capacity-building-project-proposals/ path. **Verify:** no route collisions, chains or missing targets; screenshot/status evidence for representative rules and all encoded-path cases. Keep the old host available until verified.

**Source check, 2026-10-29:** the live GitHub documentation request was blocked at CONNECT with HTTP 403 in this environment ([request log](review/session-24/raw/github-domain-docs.log)). The steps above are a checklist to verify against current GitHub documentation, not a claim of successful live documentation inspection. The owner must check these pages before DNS changes:

- [Managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [Verifying your custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
- [Securing GitHub Pages with HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)

**Domain rollback, owner and Luka:** restore recorded pre-change DNS and the old host, revert custom-domain/workflow changes and redeploy the last working URL/prefix. Verify certificate, assets and bilingual navigation on the restored host. DNS caches take time; monitor both destinations and retain the domain-verification TXT record while ownership remains valid.

## Repository transfer

1. [ ] **Institutional owner:** create an ERIDA/NEO GitHub organisation registered to an institutional email, with appropriate owner recovery and access. Do not commit the email or credentials. **Verify:** the institution controls ownership and recovery.
2. [ ] **Current and institutional owners, GitHub repository transfer:** transfer the repository using GitHub’s current [transfer instructions](https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository). Record the old owner/name and workflow/domain settings first. **Verify:** repository history, branches, issues and access remain available at the new location. Recheck current transfer limits before proceeding.
3. [ ] **Institutional owner and Luka, repository/organisation settings:** re-enable Pages, Actions permissions and deployment environment settings as required. Reinstall or re-authorise Pages CMS for the organisation; add approved editors only. **Verify:** successful Pages workflow, CMS login/read/save/deploy round trip and expected editor permissions.
4. [ ] **Luka, workflow and links:** if there is no custom domain yet, update SITE_URL to the new organisation’s github.io URL and verify PATH_PREFIX. With a custom domain, verify ownership/HTTPS and keep that canonical URL. **Verify:** root/prefix builds, all live links, language switches, assets, robots and sitemap.
5. [ ] **Luka:** record the new owner, access responsibilities, settings, CMS app authorisation and verification in DECISIONS and HANDOVER. **Verify:** the institution can deploy and recover access without the previous personal account.

**Transfer rollback, owners and Luka:** if deployment or CMS access fails, restore authorisation/settings first; if necessary coordinate a transfer back under GitHub’s current rules and restore the previous workflow URL. Preserve history and published slugs. Do not delete either account or the old host until institutional deployment and editing are verified. Live transfer documentation was not verified in this environment; review it before acting.
