# Accessibility review, 2026-10-29

Local Chromium/Playwright checks in both languages. No real screen reader was used. This does not replace Nino’s manual review or expand the accessibility statement. Full recorded Tab order, computed focus styles, landmark/heading/lang DOM data and resize/media results are in accessibility.json; Chromium accessibility-tree snapshots are in accessibility/. The shared bilingual 404 is one page with an English anchor. Browser-emulated 320 CSS px reflow approximates 400% zoom of a 1280px viewport; actual browser/OS zoom remains a manual launch check. 200% uses the root font-size setting. Native disclosure/search controls may add focus targets only after activation; the existing check:a11y interaction sweep covers those states. Forced colours and reduced motion are browser emulations, not an OS assistive-technology session.

| Page | Language | Tab targets recorded | 200% text (scroll/viewport) | 320px reflow | Forced colours | Reduced motion |
| --- | --- | ---: | --- | --- | --- | --- |
| home | ka | 44 | 1280/1280 | pass | emulated | emulated |
| action | ka | 23 | 1280/1280 | pass | emulated | emulated |
| calls | ka | 35 | 1280/1280 | pass | emulated | emulated |
| events | ka | 14 | 1280/1280 | pass | emulated | emulated |
| news | ka | 13 | 1280/1280 | pass | emulated | emulated |
| about | ka | 18 | 1280/1280 | pass | emulated | emulated |
| team | ka | 12 | 1280/1280 | pass | emulated | emulated |
| here | ka | 14 | 1280/1280 | pass | emulated | emulated |
| contact | ka | 12 | 1280/1280 | pass | emulated | emulated |
| privacy | ka | 14 | 1280/1280 | pass | emulated | emulated |
| search | ka | 14 | 1280/1280 | pass | emulated | emulated |
| notFound | ka | 14 | 1280/1280 | pass | emulated | emulated |
| home | en | 44 | 1280/1280 | pass | emulated | emulated |
| action | en | 23 | 1280/1280 | pass | emulated | emulated |
| calls | en | 35 | 1280/1280 | pass | emulated | emulated |
| events | en | 14 | 1280/1280 | pass | emulated | emulated |
| news | en | 13 | 1280/1280 | pass | emulated | emulated |
| about | en | 18 | 1280/1280 | pass | emulated | emulated |
| team | en | 12 | 1280/1280 | pass | emulated | emulated |
| here | en | 14 | 1280/1280 | pass | emulated | emulated |
| contact | en | 12 | 1280/1280 | pass | emulated | emulated |
| privacy | en | 14 | 1280/1280 | pass | emulated | emulated |
| search | en | 14 | 1280/1280 | pass | emulated | emulated |
| notFound | en | 9 | 1280/1280 | pass | emulated | emulated |

Keyboard order is recorded from skip link through header, main and footer for each page. Review the ordered targets and computed outline results in accessibility.json alongside the browser interaction/axe logs; automation alone cannot establish an entirely trap-free experience or readable focus in every assistive setup.

Computed focus review: every recorded Tab target has either its own visible outline or an ancestor card/tile outline or shadow; no uncovered target was found. All 24 checks have no document overflow at 200% text or 320 CSS px. Full numeric measurements and focus styles remain in accessibility.json. This confirms the tested states only; complete assistive-technology/trap review remains manual.
