# Interface design

## Font comparison, 26 October 2026

Both candidates were compared with Georgian navigation, mixed Georgian/Latin text, numerals and potentially confused Latin letters at 16, 20 and 32 px. The regular-face browser comparison is saved in review/session-5/font-comparison.png. FiraGO is narrower and fits more Latin text on a line. Noto has more open, generously spaced Georgian forms and a comfortable mixed-script reading rhythm; its wider Latin text needs room, so navigation wraps and mobile links are full-width.

Measured WOFF2 totals for normal-width regular (400) and bold (700), keeping shaping features and names:

| Candidate | Subsets | Bytes | Coverage and licence |
|---|---|---:|---|
| FiraGO 1.001 | Two combined Georgian/Latin faces | 118,736 | Modern Georgian and Latin; no Mtavruli glyphs in this release. SIL OFL 1.1. |
| Noto Sans Georgian + Noto Sans | Georgian-only and Latin faces at each weight | 99,184 | Modern/historic Georgian, Mtavruli and Latin. SIL OFL 1.1 for both families. |

Choose Noto, about 16.5% smaller overall with broader Georgian coverage. The Latin pair is 67,112 bytes. The English interface also displays a Georgian language switch, so the measured English home loads the Georgian bold face too (83,452 bytes total). The Georgian home loads all four (99,184 bytes). Font files, font metadata and the full original OFL notices are under src/assets/fonts. Subsets retain copyright/name records. Self-hosting and subsetting are permitted by OFL 1.1. Do not remove licence notices or sell font files separately.

Sources:

- FiraGO: https://github.com/bBoxType/FiraGO, Fonts/FiraGO_TTF_1001/Roman/FiraGO-Regular.ttf and FiraGO-Bold.ttf; licence OFL.txt.
- Noto: https://github.com/google/fonts, ofl/notosansgeorgian/NotoSansGeorgian[wdth,wght].ttf and ofl/notosans/NotoSans[wdth,wght].ttf; each folder's OFL.txt.

Exact Noto source revision, source SHA-256 hashes, subset hashes and build-tool versions are in src/assets/fonts/manifest.json. Download those two TTFs from the recorded revision into a scratch folder as NotoSansGeorgian.ttf and NotoSans.ttf. Install the recorded fonttools[woff] and brotli versions outside the checkout, then run `python scripts/subset-fonts.py /path/to/ttfs`. This is a maintenance command, not a dependency of normal builds or CI. Verify source hashes before regenerating and update the manifest after any intentional font upgrade.

CSS registers four local faces with font-display: swap and script-specific unicode-range values. Relative font URLs resolve under both / and the Pages project prefix. No font CSS, CDN or third-party font request is used. Georgia's text never receives text-transform. Native uppercase content is supported without forcing Mtavruli on normal labels. Georgian editorial review of the final type treatment remains a human check.

## Colour system

Primary #003399 and its darker hover shade provide an Erasmus+ inspired institutional blue. One warm accent (#854600, with a pale #fff1d2 surface) and neutral ink, muted text, paper, surface and line tokens complete the palette. No EU emblem or logo has been copied into the design.

All allowed foreground/surface combinations are checked by test/contrast.test.js using WCAG relative luminance and a minimum 4.5:1 even for large text. Ink, muted, blue, blue-dark and accent may appear on paper, surface or accent-soft. Paper and inverse-muted may appear on blue or blue-dark. The lowest tested pair is muted on accent-soft, above 6:1. Line is a decorative divider, not a text colour. Status and source labels use the same palette plus explicit words, so colour does not carry their meaning alone.

## Shared components

Use a text-only NEO Georgia placeholder, a readable office name and an always-visible language switch. Desktop and mobile navigation share one macro and the same seven destinations. CSS shows one navigation at a time; the mobile version is native details/summary, closed initially, with full-width links. No script or CSS checkbox trick is needed. Keyboard activation, expanded state and focus work through native browser behaviour.

Cards distinguish type, title, date and action in that order. Call/Event status badges and resource source labels retain explicit text and reuse the tested palette. Cards grow with Georgian text rather than clipping it. The footer separates contact/legal links from the funding block. The emblem remains an explicit text placeholder; no imitation flag or logo is used.

## Home page

Keep the six approved blocks in order. A blue introduction gives the two audience paths clear priority, with a small guidance panel alongside on desktop and below on mobile. Listing headings link to their complete sections. Calls and Events use consistent date/status cards, News retains language filtering, the single story gets a quiet feature panel, and key figures carry an explicit illustrative-data note. All sample content remains labelled; no statistics, images or organisational claims have been invented.

No text is clipped to force identical card heights. Full-width mobile buttons, wrapped headings and the desktop hero split are sized around Georgian first. Surfaces and links follow the tested token combinations. Page scripts are unnecessary. scripts/capture-design.mjs captures both languages at 360 and 1280 px after fonts load, with page JavaScript disabled.
