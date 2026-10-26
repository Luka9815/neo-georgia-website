# Five approved News posts, session 9

The five keep=y rows in decisions.csv are the complete promotion scope. The CSV has no date column, so publication days come from each reviewed JSON record. Its Actions and slugs are used exactly. pair_with equal to its own slug means a split of one bilingual source, not two records. The Capacity Building source is English first. No translation, spelling correction or prose rewriting was performed. Section markers and divider lines were removed; existing source headings and body emoji remain.

## Titles for review

Only **Europe Day in Kutaisi, 24–25 October** is newly written, from its English body. The other four English titles are present in the source. The Georgian Capacity Building title is copied from its Georgian body because its source title field is English.

## Images

Session 9 omitted images because News had no image support. Session 13 adds the optional validated/responsive field, but all five posts remain without images pending Luka's selection and bilingual alt text. Downloaded review availability is listed in NEWS-IMAGES.md. No [ALT NEEDED] is published.

## Every body link

The Capacity Building post linked to four shorturl.at addresses. On 2026-10-27 Claude Code resolved each one (HTTP 302) and replaced it with the direct, parameter-free EU Funding & Tenders topic page, using the topic ID as link text:

| Source label | Former short URL | Direct topic page |
|---|---|---|
| CBHE | https://shorturl.at/KUPQy | ERASMUS-EDU-2026-CBHE-REGION-2 |
| CB VET | https://shorturl.at/euXGT | ERASMUS-EDU-2026-CB-VET-NE |
| CB Youth | https://shorturl.at/c3UWa | ERASMUS-YOUTH-2026-CB-NE |
| CB Sport | https://shorturl.at/zx4x2 | ERASMUS-SPORT-2026-CB |

No promoted body links to erasmus.org.ge, Google Drive or Facebook tracking. Legacy source URLs are used only in the five redirect mappings. The old emoji path is decoded for its static output directory; the encoded legacy URL therefore resolves on hosts that decode URL paths. GitHub Pages redirects are meta refresh pages, not HTTP 301 responses. Verify that emoji path on hosted Pages before domain migration.

## Sample News

Retain update-1, update-2 and update-3. CMS integration tests edit update-1 and the missing-English fallback test explicitly checks update-3. Moving those fixtures out of live sample content is a separate cleanup; this session does not remove test coverage to delete samples.
