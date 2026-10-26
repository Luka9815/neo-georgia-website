# Five approved News posts, session 9

The five keep=y rows in decisions.csv are the complete promotion scope. The CSV has no date column, so publication days come from each reviewed JSON record. Its Actions and slugs are used exactly. pair_with equal to its own slug means a split of one bilingual source, not two records. The Capacity Building source is English first. No translation, spelling correction or prose rewriting was performed. Section markers and divider lines were removed; existing source headings and body emoji remain.

## Titles for review

Only **Europe Day in Kutaisi, 24–25 October** is newly written, from its English body. The other four English titles are present in the source. The Georgian Capacity Building title is copied from its Georgian body because its source title field is English.

## Images

The News type, editor and template do not yet support images. All five omit images; reviewed binaries remain outside the published tree. No [ALT NEEDED] text is published.

## Every body link

The five bodies contain four distinct destinations, repeated in the two Capacity Building language sections. All other promoted bodies have no Markdown links. All four were checked on 2026-10-26 with redirect-following HEAD requests. The environment proxy refused the destination with CONNECT 403, so availability and final destinations are unverified. These are not observed origin HTTP failures. Luka must verify them before merge; none has been dropped or replaced.

| Source label | Retained URL | Result |
|---|---|---|
| CBHE | https://shorturl.at/KUPQy | Network policy blocked verification |
| CB VET | https://shorturl.at/euXGT | Network policy blocked verification |
| CB Youth | https://shorturl.at/c3UWa | Network policy blocked verification |
| CB Sport | https://shorturl.at/zx4x2 | Network policy blocked verification |

No promoted body links to erasmus.org.ge, Google Drive or Facebook tracking. Legacy source URLs are used only in the five redirect mappings. The old emoji path is decoded for its static output directory; the encoded legacy URL therefore resolves on hosts that decode URL paths. GitHub Pages redirects are meta refresh pages, not HTTP 301 responses. Verify that emoji path on hosted Pages before domain migration.

## Sample News

Retain update-1, update-2 and update-3. CMS integration tests edit update-1 and the missing-English fallback test explicitly checks update-3. Moving those fixtures out of live sample content is a separate cleanup; this session does not remove test coverage to delete samples.
