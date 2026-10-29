# Session 23 photograph review, 29 October 2026

Baseline: origin/main f4d07a1, merged PR #22. Branch: codex/session-23-photos, incorporating origin/assets/commons-photos c4886d6. No launch or merge. Existing content records, project data, URLs, preview/siteLaunched=false, EU artwork and disclaimers remain unchanged. The source branch resolves the earlier Commons download block.

## Source verification and placements

All eight supplied JPEGs were fully decoded with Sharp, visually compared with the supplied subject records, and checked against the original or Commons-rendered 3840px dimensions. SHA-256 and actual dimensions are in source-verification.json. Authors, licences and source pages come from Luka's supplied Commons API extmetadata record, checked 29 October 2026. No new live Commons API check is claimed. Provenance from COMMONS-SOURCES.md is now in [the image README](../../../src/assets/images/README.md) and the runtime manifest. The supplied bytes are unchanged.

| Page | Photo | Framing |
| --- | --- | --- |
| Home | neo-tbilisi-panorama-sameba.jpg | Wide skyline suits desktop text and a 63%/48% mobile focal crop |
| About | neo-tsu-main-building.jpg | Gentler desktop/mobile ratios preserve the facade |
| Find student | neo-ilia-state-university.jpg | Full supplied 4:3 frame retained at both widths |
| Find university | neo-tsu-evening.jpg | Building and lights retained within the tree framing |
| Find youth | neo-tbilisi-rike-park.jpg | Paths, gardens and surrounding city remain visible |
| Find VET | neo-gtu-building.jpg | Columned facade and roof retained |
| Find sport | neo-batumi-skyline.jpg | Skyline retained above the water |
| Opportunities | neo-tbilisi-panorama-river.jpg | River/city focal point with a wider desktop frame |

The initial desktop crop cut into Campus E's already tightly framed upper facade. The final layout retains its complete supplied frame, and its credit describes resizing/reformatting accurately. Other cropped/overlaid CC BY-SA adaptations are marked modified and keep their source licence version. Credit every author, including Flowerx for the public-domain image. All placements link the licence and exact Commons file page in the page language. The footer-linked credits page lists all eight plus the retained permission-based NEO photo. NEO's News article has a source/permission credit; its Home/News cards use plain credit text to retain a single stretched link. No open licence is asserted for NEO.

The Home gradient is now 72% to 58% black rather than 90% to 82%. All text over that image is white. A worst-case white image pixel under the lightest overlay rounds to #6b6b6b, giving 5.33:1 contrast. Other hero titles sit outside the photos. The Home credit has an opaque dark background and clears the mobile buttons.

## Publication and build cache

Source JPEGs are never copied to _site. Only local generated AVIF/WebP/JPEG variants at 320/640/960/1280/1920/2560px are published, without enlargement. Page heroes/headers are eager/high-priority, News cards remain lazy. Source files are excluded by both the template ignore and passthrough filter.

The first build encodes all variants. Content/encoder-hashed variants are cached outside output and copied into each root/prefix build. The Pages job sets PORTAL_IMAGE_CACHE_DIR to runner.temp, avoiding repeated encoding across isolated test copies; the cache is not part of the uploaded artifact. Normal local builds default to .cache/portal-images. Source bytes or encoder changes invalidate the Image hash. No external image request, account or production dependency was added.

## Screenshots

before/ and after/ each contain 40 full-page captures: all eight photo placements, credits and the News index, in ka/en at 390/1280px. Their screenshots.json files record HTTP status and filenames. The before phase is the main baseline; both phases use JavaScript disabled, loaded fonts and decoded images. Reproduce with REVIEW_PHASE=before/after TEST_URL=http://127.0.0.1:8141 node scripts/review-session-23.js, from the appropriate checkout.


| Page | Language | Width | Before | After |
| --- | --- | ---: | --- | --- |
| home | ka | 390 | [Before](before/home-ka-390.png) | [After](after/home-ka-390.png) |
| about | ka | 390 | [Before](before/about-ka-390.png) | [After](after/about-ka-390.png) |
| student | ka | 390 | [Before](before/student-ka-390.png) | [After](after/student-ka-390.png) |
| university | ka | 390 | [Before](before/university-ka-390.png) | [After](after/university-ka-390.png) |
| youth | ka | 390 | [Before](before/youth-ka-390.png) | [After](after/youth-ka-390.png) |
| vet | ka | 390 | [Before](before/vet-ka-390.png) | [After](after/vet-ka-390.png) |
| sport | ka | 390 | [Before](before/sport-ka-390.png) | [After](after/sport-ka-390.png) |
| opportunities | ka | 390 | [Before](before/opportunities-ka-390.png) | [After](after/opportunities-ka-390.png) |
| credits | ka | 390 | [Before](before/credits-ka-390.png) | [After](after/credits-ka-390.png) |
| news | ka | 390 | [Before](before/news-ka-390.png) | [After](after/news-ka-390.png) |
| home | ka | 1280 | [Before](before/home-ka-1280.png) | [After](after/home-ka-1280.png) |
| about | ka | 1280 | [Before](before/about-ka-1280.png) | [After](after/about-ka-1280.png) |
| student | ka | 1280 | [Before](before/student-ka-1280.png) | [After](after/student-ka-1280.png) |
| university | ka | 1280 | [Before](before/university-ka-1280.png) | [After](after/university-ka-1280.png) |
| youth | ka | 1280 | [Before](before/youth-ka-1280.png) | [After](after/youth-ka-1280.png) |
| vet | ka | 1280 | [Before](before/vet-ka-1280.png) | [After](after/vet-ka-1280.png) |
| sport | ka | 1280 | [Before](before/sport-ka-1280.png) | [After](after/sport-ka-1280.png) |
| opportunities | ka | 1280 | [Before](before/opportunities-ka-1280.png) | [After](after/opportunities-ka-1280.png) |
| credits | ka | 1280 | [Before](before/credits-ka-1280.png) | [After](after/credits-ka-1280.png) |
| news | ka | 1280 | [Before](before/news-ka-1280.png) | [After](after/news-ka-1280.png) |
| home | en | 390 | [Before](before/home-en-390.png) | [After](after/home-en-390.png) |
| about | en | 390 | [Before](before/about-en-390.png) | [After](after/about-en-390.png) |
| student | en | 390 | [Before](before/student-en-390.png) | [After](after/student-en-390.png) |
| university | en | 390 | [Before](before/university-en-390.png) | [After](after/university-en-390.png) |
| youth | en | 390 | [Before](before/youth-en-390.png) | [After](after/youth-en-390.png) |
| vet | en | 390 | [Before](before/vet-en-390.png) | [After](after/vet-en-390.png) |
| sport | en | 390 | [Before](before/sport-en-390.png) | [After](after/sport-en-390.png) |
| opportunities | en | 390 | [Before](before/opportunities-en-390.png) | [After](after/opportunities-en-390.png) |
| credits | en | 390 | [Before](before/credits-en-390.png) | [After](after/credits-en-390.png) |
| news | en | 390 | [Before](before/news-en-390.png) | [After](after/news-en-390.png) |
| home | en | 1280 | [Before](before/home-en-1280.png) | [After](after/home-en-1280.png) |
| about | en | 1280 | [Before](before/about-en-1280.png) | [After](after/about-en-1280.png) |
| student | en | 1280 | [Before](before/student-en-1280.png) | [After](after/student-en-1280.png) |
| university | en | 1280 | [Before](before/university-en-1280.png) | [After](after/university-en-1280.png) |
| youth | en | 1280 | [Before](before/youth-en-1280.png) | [After](after/youth-en-1280.png) |
| vet | en | 1280 | [Before](before/vet-en-1280.png) | [After](after/vet-en-1280.png) |
| sport | en | 1280 | [Before](before/sport-en-1280.png) | [After](after/sport-en-1280.png) |
| opportunities | en | 1280 | [Before](before/opportunities-en-1280.png) | [After](after/opportunities-en-1280.png) |
| credits | en | 1280 | [Before](before/credits-en-1280.png) | [After](after/credits-en-1280.png) |
| news | en | 1280 | [Before](before/news-en-1280.png) | [After](after/news-en-1280.png) |

## Reproduction and measurement limits

Use Node 24 and npm ci. Clean _site before a final build. Set PORTAL_IMAGE_CACHE_DIR=/tmp/neo-portal-images (or another writable shared temporary directory) for the build and tests. Run npm run build and NODE_DISABLE_COMPILE_CACHE=1 npm test -- --test-concurrency=1. Repeat in an isolated complete source copy with PATH_PREFIX=/neo-georgia-website/ and SITE_URL=https://luka9815.github.io/neo-georgia-website/. Preserve docs/review/session-20/SOURCES.json in that copy. The shared cache reuses real encoded variants; it does not skip tests or replace photos with fixtures.

Run the complete npm run check:a11y against each server, with PATH_PREFIX set for the project layout. scripts/check-session-23.js supplements it with 80 checks per layout: 40 native checks with JavaScript disabled and 40 axe checks with JavaScript enabled, across both widths and languages, including retained News credits. The checks cover decoded dimensions, focusable licence links, source links, no original-source requests, no horizontal overflow, and Home white text/credit separation. Existing 320px, keyboard, no-JavaScript, forced colours, reduced motion, project/calendar/search and populated/empty fixture coverage remain.

Measure serially with other browser/build/test workers idle: REVIEW_PHASE=after LIGHTHOUSE_ROOT=/path/to/external/node_modules TEST_URL=http://127.0.0.1:8141 node scripts/measure-session-23.js. Lighthouse is external tooling, not a site dependency. The local uncompressed HTTP server uses default Lighthouse simulated mobile throttling and cold navigation. Navigation transfer totals are distinct from the stricter complete-Home measurement: 390px/DPR2, cache disabled, JavaScript disabled and every image forced eager, including News and EU footer. CDP encodedDataLength is checked against 500,000 bytes. All eight page/language scores must meet performance 90+ and accessibility 100.

These are local automated and crop-review results, not a hosted performance guarantee, complete manual WCAG audit or Nino's final content review. Recheck the source file pages before launch.

## Final validation

Clean root and project-prefix builds pass. Each full suite passes 172 tests with zero failures. Each complete browser sweep passes 109 pages with zero axe violations, including existing project/calendar/search/fixture checks and the corrected two-link credit pointer check in normal/forced colours. Each layout also passes 80 focused photo/News checks at 390/1280px: 40 with axe and 40 with JavaScript disabled. Raw results are in root-tests.txt, prefix-tests.txt, root-browser.txt, prefix-browser.txt, root-photo-browser.txt and prefix-photo-browser.txt. The Pages YAML parses and the affected search/workflow checks pass.

| Page | Language | Mobile performance before → after | Accessibility before → after | Navigation bytes before → after |
| --- | --- | --- | --- | ---: |
| home | ka | 99 → 99 | 100 → 100 | 192,526 → 206,161 |
| about | ka | 100 → 98 | 100 → 100 | 223,740 → 265,104 |
| opportunities | ka | 100 → 99 | 100 → 100 | 149,993 → 208,999 |
| find | ka | 100 → 99 | 100 → 100 | 195,380 → 204,344 |
| home | en | 98 → 99 | 100 → 100 | 167,393 → 181,007 |
| about | en | 100 → 99 | 100 → 100 | 186,264 → 227,818 |
| opportunities | en | 100 → 99 | 100 → 100 | 126,704 → 185,499 |
| find | en | 100 → 99 | 100 → 100 | 157,505 → 219,040 |

All eight trials meet performance 90+ and accessibility 100. These are single cold local Lighthouse 13.6.0 trials and can vary; no overall speed improvement is claimed. Full Home transfer includes every image, rather than only the initial viewport:

- ka: 274,749 → 288,384 bytes at 390px/DPR2, below 500,000 bytes.
- en: 233,455 → 247,069 bytes at 390px/DPR2, below 500,000 bytes.

The worst-case white Home text over a white photograph pixel beneath the minimum overlay is 5.33:1. Secondary headings remain outside images. Source originals are absent from both clean outputs, and no original-source HTTP request occurs during photo checks. Authored content, source project data, EU artwork and disclaimers have no diff from main.

