# Official partner shortcuts

Checked 27 October 2026 with the web tool. The eight destinations were identified from their intended official pages. Luka verified the current school partner-search URL in his normal browser on 2026-10-27. Earlier automated checks retrieved that page through its legacy redirect, while direct automated requests returned 403. These checks do not cover authenticated account features. Links are shared in src/_data/partnerTools.json; bilingual names/descriptions are in the language files. No build-time or runtime network fetch is added.

| Tool | Checked destination | Result |
| --- | --- | --- |
| EU Funding & Tenders Portal | https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/how-to-participate/partner-search | Resolved |
| Erasmus+ Project Results Platform | https://erasmus-plus.ec.europa.eu/projects | Resolved |
| EPALE: adult education | https://epale.ec.europa.eu/en/partner-search | Resolved |
| European School Education Platform: partner search | https://school-education.ec.europa.eu/en/connect/partner-search | Verified in Luka's normal browser, 2026-10-27; earlier direct automated checker returned 403 |
| eTwinning: school community | https://school-education.ec.europa.eu/en/etwinning | Resolved |
| SALTO-Youth OTLAS | https://www.salto-youth.net/tools/otlas-partner-finding/ | Resolved |
| SALTO Education & Training | https://salto-et.net/ | Resolved |
| SALTO-Youth European Training Calendar | https://www.salto-youth.net/tools/european-training-calendar/ | Resolved |

The old school partner URL /en/networking/partner-finding redirected to /en/connect/partner-search and returned the intended partner-search page on both checks. Publish the current official destination. Earlier direct checks of that current URL (with and without a trailing slash) returned 403 through the web tool. Luka subsequently confirmed on 2026-10-27 that https://school-education.ec.europa.eu/en/connect/partner-search works in his normal browser. The requested browser check is complete; the automated 403 results remain historical evidence, not an outstanding browser-verification task. eTwinning remains a separate school-community shortcut. The Funding & Tenders portal returns a JavaScript application shell.

The official Erasmus+ guidance at https://erasmus-plus.ec.europa.eu/resources-and-tools/how-to-apply links the Funding & Tenders partner search, Project Results Platform, SALTO Education & Training and SALTO-Youth training calendar. The two training calendars support meeting potential partners rather than acting as project databases. These links do not assert eligibility for Georgian applicants.
