# Interface design

## Font comparison, 26 October 2026

Both candidates were compared with Georgian navigation, mixed Georgian/Latin text, numerals and potentially confused Latin letters at 16, 20 and 32 px. The regular-face browser comparison is saved in review/session-5/font-comparison.png. FiraGO is narrower and fits more Latin text on a line. Noto has more open, generously spaced Georgian forms and a comfortable mixed-script reading rhythm; its wider Latin text needs room, so navigation wraps and mobile links are full-width.

Measured WOFF2 totals for normal-width regular (400) and bold (700), keeping shaping features and names:

| Candidate | Subsets | Bytes | Coverage and licence |
|---|---|---:|---|
| FiraGO 1.001 | Two combined Georgian/Latin faces | 118,736 | Modern Georgian and Latin; no Mtavruli glyphs in this release. SIL OFL 1.1. |
| Noto Sans Georgian + Noto Sans | Georgian-only and Latin faces at each weight | 99,184 | Modern/historic Georgian, Mtavruli and Latin. SIL OFL 1.1 for both families. |

Choose Noto, about 16.5% smaller overall with broader Georgian coverage. English pages normally need only the 67,112-byte Latin pair; mixed Georgian pages can load all four. Font files, font metadata and the full original OFL notices are under src/assets/fonts. Subsets retain copyright/name records. Self-hosting and subsetting are permitted by OFL 1.1. Do not remove licence notices or sell font files separately.

Sources:

- FiraGO: https://github.com/bBoxType/FiraGO, Fonts/FiraGO_TTF_1001/Roman/FiraGO-Regular.ttf and FiraGO-Bold.ttf; licence OFL.txt.
- Noto: https://github.com/google/fonts, ofl/notosansgeorgian/NotoSansGeorgian[wdth,wght].ttf and ofl/notosans/NotoSans[wdth,wght].ttf; each folder's OFL.txt.

Exact Noto source revision, source SHA-256 hashes, subset hashes and build-tool versions are in src/assets/fonts/manifest.json. Download those two TTFs from the recorded revision into a scratch folder as NotoSansGeorgian.ttf and NotoSans.ttf. Install the recorded fonttools[woff] and brotli versions outside the checkout, then run `python scripts/subset-fonts.py /path/to/ttfs`. This is a maintenance command, not a dependency of normal builds or CI. Verify source hashes before regenerating and update the manifest after any intentional font upgrade.

CSS registers four local faces with font-display: swap and script-specific unicode-range values. Relative font URLs resolve under both / and the Pages project prefix. No font CSS, CDN or third-party font request is used. Georgia's text never receives text-transform. Native uppercase content is supported without forcing Mtavruli on normal labels. Georgian editorial review of the final type treatment remains a human check.
