# Test maintenance

No test file or existing axe rule/sweep was removed. TEST-CHANGES.txt lists every changed test and fixture.

| Test file | Change |
| --- | --- |
| actions.test.js | Historical nine-Action source check reads the isolated Session 24 snapshot; live rendering still follows actual records. |
| calls-2026.test.js | Historical eleven-call dates and invalid-date mutations use isolated records, independent of staff additions. |
| cms.test.js | Read file entries through the Settings group and named media configuration. |
| cms-coverage.test.js (new) | Collection slugs/translated text, all Action labels/options, selects, wall-clock inputs, fixed Brussels zone and office/PDF fields. |
| editorial-session-18.test.js | Build an isolated historical News snapshot for wording/hash/render regressions. |
| home-portal.test.js | Derive Action tile counts from current records. |
| launch.test.js (new) | Both launched layouts, filled office fixture, index/robots/sitemap rules and named unresolved-marker failure. |
| news-image.test.js | Require both alt languages even for Georgian-only News; retain unsafe-file/real-image builds. |
| office.test.js (new) | Office schema, field errors, transliteration, HTTPS social URLs and generated inventory. |
| polish.test.js | Derive compact Action counts from current content. |
| portal-images.test.js | News credit expectations follow actual Home top-three/archive selections and article records. |
| promoted-news.test.js | Historical five-post source/render/image expectations run in an isolated snapshot. |
| redirects.test.js | Launch checks move to dedicated complete launch fixtures; every included stub target/collision is checked in the active root/prefix output. |
| release-content.test.js | Counts, office facts, HERE state, social/source dates and external/local Publications follow current records. |
| release-fixtures.test.js | Explicit historical call-edition isolation; valid PDF fixture downloads. |
| schema-coverage.test.js (new) | Previously missing type validation, source dates, Story language/year/reference rules and optional Call opening values. |
| style.test.js (new) | Reject U+2014 in authored source/documentation text. |
| tbc.test.js | Inventory generation moves to report:tbc and office tests; production sample/draft check remains. |
| templates.test.js | New HERE path, current counts/dates/office values, social state and central role references. |
| translations.test.js (new) | Matching bilingual key paths and referenced interface keys. |

Supporting changes: scripts/fixture-site.js fixes the historical fixture call edition independently of staff Settings and continues named-zone/time-relative fixtures. National romanisation is shared from lib/romanise.js, preserving its importer API/tests. Publication fixtures are valid synthetic PDFs instead of plain-text downloads. Existing search, calendar, project, image and browser sweeps remain enabled.

The browser sweep’s editable-surface assertions now live in scripts/check-editable-surfaces.js, called by check:a11y. Publication year/type counts, image counts/detail routes and Action sector-card counts derive from current content, with the same no-JavaScript/filter/decode checks retained. No axe rule is removed. The standalone root/prefix supplemental logs verify this extracted helper as well.
