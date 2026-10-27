# Official partner shortcuts

Checked 27 October 2026 with the web tool. The eight destinations were identified from their intended official pages; the school search page was retrieved via its legacy redirect, while a direct follow-up checker returned 403. These checks do not cover authenticated account features. Links are shared in src/_data/partnerTools.json; bilingual names/descriptions are in the language files. No build-time or runtime network fetch is added.

| Tool | Checked destination | Result |
| --- | --- | --- |
| EU Funding & Tenders Portal | https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/how-to-participate/partner-search | Resolved |
| Erasmus+ Project Results Platform | https://erasmus-plus.ec.europa.eu/projects | Resolved |
| EPALE: adult education | https://epale.ec.europa.eu/en/partner-search | Resolved |
| European School Education Platform: partner search | https://school-education.ec.europa.eu/en/connect/partner-search | Intended page retrieved via legacy redirect; direct checker returned 403 |
| eTwinning: school community | https://school-education.ec.europa.eu/en/etwinning | Resolved |
| SALTO-Youth OTLAS | https://www.salto-youth.net/tools/otlas-partner-finding/ | Resolved |
| SALTO Education & Training | https://salto-et.net/ | Resolved |
| SALTO-Youth European Training Calendar | https://www.salto-youth.net/tools/european-training-calendar/ | Resolved |

The old school partner URL /en/networking/partner-finding redirected to /en/connect/partner-search and returned the intended partner-search page on both checks. Publish the current official destination. Direct checks of that current URL (with and without a trailing slash) returned 403 through the web tool, so direct automated access remains unconfirmed. This is recorded separately from the successful redirect/content evidence; recheck it in a normal browser before launch. eTwinning remains a separate school-community shortcut. The Funding & Tenders portal returns a JavaScript application shell.

The official Erasmus+ guidance at https://erasmus-plus.ec.europa.eu/resources-and-tools/how-to-apply links the Funding & Tenders partner search, Project Results Platform, SALTO Education & Training and SALTO-Youth training calendar. The two training calendars support meeting potential partners rather than acting as project databases. These links do not assert eligibility for Georgian applicants.
