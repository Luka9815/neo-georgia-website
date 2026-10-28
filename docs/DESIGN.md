# Interface design

## Historical font comparison, 26 October 2026

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

Primary #003399 and its darker hover shade provide an Erasmus+ inspired institutional blue. One warm accent (#854600, with a pale #fff1d2 surface) and neutral ink, muted text, paper, surface and line tokens complete the palette. The palette does not imitate an EU emblem. Official unmodified funding artwork is kept in the separate EU footer block.

All allowed foreground/surface combinations are checked by test/contrast.test.js using WCAG relative luminance and a minimum 4.5:1 even for large text. Ink, muted, blue, blue-dark and accent may appear on paper, surface or accent-soft. Paper and inverse-muted may appear on blue or blue-dark. The lowest tested pair is muted on accent-soft, above 6:1. Line is a decorative divider, not a text colour. Status and source labels use the same palette plus explicit words, so colour does not carry their meaning alone.

## Shared components

Use the exact translated officeName as a typographic home-link wordmark, with no graphic logo or placeholder note, and an always-visible language switch. Keep the type modest and narrower than the EU funding emblem at every supported width. The E+ favicon is typography only. Desktop and mobile navigation share one macro and the same seven destinations. CSS shows one navigation at a time; the mobile version is native details/summary, closed initially, with full-width links. No script or CSS checkbox trick is needed. Keyboard activation, expanded state and focus work through native browser behaviour.

Cards distinguish type, title, date and action in that order. Call/Event status badges and resource source labels retain explicit text and reuse the tested palette. Cards grow with Georgian text rather than clipping it. The footer separates contact/legal links from the funding block. Session 17 uses the verified official Georgian Commission archive artwork on /ka/ and English on /en/, with accurate alternatives. Original bytes are retained; the existing image pipeline resizes complete PNGs without cropping, recolouring or removing whitespace. A white background box and the original aspect ratio are retained. Both artworks carry the funding statement, so adjacent repetition is omitted; the Georgian disclaimer remains unchanged. This explicitly supersedes the earlier KA artwork rejection recorded in DECISIONS. Source details are in src/assets/eu/README.md.

## Historical home page, superseded by Session 21

Keep the six approved blocks in order. A blue introduction gives the two audience paths clear priority, with a small guidance panel alongside on desktop and below on mobile. Listing headings link to their complete sections. Calls and Events use consistent date/status cards, News retains language filtering, the single story gets a quiet feature panel, and key figures carry an explicit illustrative-data note. All sample content remains labelled; no statistics, images or organisational claims have been invented.

No text is clipped to force identical card heights. Full-width mobile buttons, wrapped headings and the desktop hero split are sized around Georgian first. Surfaces and links follow the tested token combinations. Page scripts are unnecessary. scripts/capture-design.mjs captures both languages at 360 and 1280 px after fonts load, with page JavaScript disabled.


## Session 6 refinements

Below 600 px, hide the supplementary next-step panel so the primary purpose and audience paths take less vertical space. The same opportunities destination remains available in the hero buttons and menu. At 600 px and above the panel remains visible. Filled green #14532d with white text makes open calls the strongest status signal (9.11:1 contrast); other statuses keep their muted/pale treatments and all retain words. This adds a semantic status colour, not a second decorative brand accent. Card section labels are explicit only in the mixed home context; section listings and Action subsections keep status/source labels without redundant section names.


## Session 21 portal redesign, 29 October 2026

Luka's Session 21 brief supersedes the settled-design rule and earlier home block order. Retain all existing source content, data and URLs, seven main destinations and preview/noindex safeguards. Use deep blue #003399 and #05264f, teal #006b70 on #e9f5f3, warm deadline accent #854600 on #fff1d2 and existing neutrals. CSS custom properties define a 75rem content width and an eight-pixel spacing scale. All approved text/surface pairs, including teal, are tested at 4.5:1 minimum. Cards have equal-height grid tracks, visible borders, icon/image slots and hover/focus-within states, without clipping Georgian text.

Keep Noto Sans Georgian and Noto Sans for body and headings. Re-evaluated FiraGO 1.001 Bold from the upstream Fonts/FiraGO_TTF_1001/Roman/FiraGO-Bold.ttf on 2026-10-29: a combined Georgian/Latin WOFF2 subset with shaping features is 60,068 bytes. Added to the existing 99,184 bytes this is 159,252 bytes, exceeding the 140,000-byte total budget. Do not adopt it or download it at runtime. Larger, tighter Noto heading scales improve hierarchy within budget. No Georgian case transformation. Human Georgian proofreading remains part of Nino's review.

The slim sticky header has a blue colour bar, labelled search icon, compact ქა | EN control and native mobile details navigation. The footer has office, quick-link and legal columns on dark blue. Approved EU emblem originals, whole-image white-box derivatives and exact disclaimers are unchanged. Decorative Lucide SVG shapes are inline, with local originals and their ISC/Feather MIT notices in src/assets/icons. No icon font, third-party requests, trackers or programme logo. Reduced motion and forced-colour styles preserve native controls and focus.

### Current page composition and data visuals

Home uses full-width alternating bands around a 75rem container: photo introduction, five audience choices, nine distinct Actions grouped by their primary sector, computed figures and a year mini-chart, conditional Calls/Events, latest News and conditional Stories. Empty Calls/Events are one compact linked line each. Action pages add icon/Key Action heroes and facts sidebars, with all current-edition deadlines and shared source-derived project counts. Every other template inherits the same type, spacing, card, table and control system. FAQ uses native details/summary. None of these paths requires JavaScript. Existing optional search and filter enhancements remain.

New /find/ pages use stable English slugs in both languages, never audience detection. Full Action text is authoritative; short shared role summaries do not replace eligibility restrictions. Projects/statistics remain local snapshot projections, not live feeds.

Charts are SVG generated by lib/project-charts.js with titles, descriptions and printed numeric labels. Existing equivalent tables remain; Home’s mini-chart has a native disclosure table. The KA107/2020–2021 coverage break sits directly under the year visuals. Long names wrap without truncating original source wording. Chart scroll regions keep a readable minimum SVG width, accept keyboard scrolling at 320px and do not overflow the page. No chart library or client data fetch.

The participants map uses one whole national outline and no internal region paths. Its GeoNames city/alias table and Natural Earth provenance are committed. Bubble area is proportional to named source identifiers, including an explicitly non-geographic unresolved bubble, with native links into the equivalent city table. Label callouts and white halos keep text readable around clustered bubbles. Details and reconciliation are in src/assets/maps/README.md. SVGs use system colours in forced-colour mode.

### Photography and budget

One photograph, the already approved NEO dissemination event, is accepted for Home/About. Its original, bilingual alternatives, explicit site-reuse permission, visible credit, date and checksum are recorded. No additional suitably obtained and inspected image was accepted; icon/colour panels fill the remaining slots. This follows the brief’s fewer-than-five fallback. See src/assets/images/README.md for checked candidate sources and the blocked campus download. Complete images use the existing Eleventy Image dependency and local AVIF/WebP/JPEG variants. Hero is eager/high-priority; below-fold pictures are lazy. No cropping or unverified association with another event/person.

Total font files stay at 99,184 bytes. Mobile Home’s complete measured transfer must remain below 500,000 bytes, including the selected hero variant (a stricter check than excluding the largest hero variant). Lighthouse before/after and screenshot evidence is in review/session-21. Local results are not a hosted Lighthouse guarantee or a full manual WCAG audit.
