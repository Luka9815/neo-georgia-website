# Session 6 Action source review

Checked 2026-10-26 against the official English Erasmus+ Programme Guide 2026, Version 1 of 12 November 2025. The official download page identifies this edition as part of the 2026 call. Action landing pages were opened through links in the official Guide navigation and their titles checked.

- Edition page: https://erasmus-plus.ec.europa.eu/document/erasmus-programme-guide-2026
- Full source: https://erasmus-plus.ec.europa.eu/sites/default/files/2025-11/programme-guide-2026_en.pdf
- Download SHA-256: `8f14f67fc83d5081e7e85744ff39ae855aef34af8c842d22ba8c52e464c331a0`

All new Action titles, summaries, eligibility and application guidance are [DRAFT] in both languages. Each JSON comment cites the edition, exact PDF URL, pages, supporting eligibility clauses and checked official action URLs. This is a source-based draft for NEO review, not approval of a particular organisation or application. Review Georgian terminology before publication and re-check the Guide/call when the programme year changes.

## Shared Georgia restriction

Part A p.34 places Georgia in Region 2. Footnote 46 excludes Georgian authorities, defined there as central government, local authorities, agencies and state-owned enterprises, from all actions under this Guide. Store this qualification once in src/_data/georgiaEligibility.json and render it on every Action page. Do not turn it into an unsupported blanket exclusion of every public higher education institution. Check an entity's actual legal status.

## Applicant and partner distinctions

All roles below are subject to that shared restriction and the full action-specific conditions. Page numbers are the Guide's printed/PDF pages.

| Action | Source pages | Georgian organisation role in this draft |
|---|---|---|
| International Credit Mobility | 42, 50-53 | Recognised HEIs participate as sending/receiving partners; EU/associated ECHE HEI or accredited consortium coordinator applies. Individuals do not submit the institutional grant. |
| Erasmus Mundus | 274-275, 285-286 | Eligible Georgian HEIs can coordinate Joint Masters. For Design Measures only an EU/associated ECHE HEI applies; Georgian collaboration in programme design is not co-beneficiary status. |
| Capacity Building in Higher Education | 314, 319-320, 323-324 | Eligible HEIs/HEI organisations can coordinate; other eligible bodies join as partners. Strand 3 requires a national authority, so its compatibility with the Georgia exclusion must be confirmed with EACEA. |
| Jean Monnet Actions | 376-379 | Eligible HEIs can apply singly for Modules, Chairs and Centres of Excellence. The page scopes its claim to higher education teaching/research; other Jean Monnet strands have separate rules. |
| Capacity Building in VET | 332, 337-338 | Eligible VET/labour-market bodies can join as partners. Non-associated-country bodies cannot coordinate. |
| Capacity Building in Youth | 343, 347 | Eligible youth NGOs can coordinate directly. Other eligible bodies are partners. Footnote 432 bars Armenia/Azerbaijan coordination, not Georgia. |
| Youth mobility | 152, 156-158, 165, 170-171 | Georgian bodies can join Youth Exchanges and youth-worker mobility as partners; EU/associated body applies. Informal-group participation is described for Youth Exchanges only. |
| Virtual Exchanges | 216, 218-219 | Eligible HE/youth bodies can join Region 2 partnerships; coordinator must be EU/associated. Non-associated partners must belong to the same eligible region. |
| Capacity Building in Sport | 352, 354-355 | Eligible nonprofit sport bodies can coordinate directly; other eligible bodies join as partners. Footnote 436 does not bar Georgian coordination. |

## Content structure and review

Nine unique records appear in four sector groups: higher education, VET, youth and sport. Virtual Exchanges appears in two groups but has one record and one pair of translated pages. Retain icm, cbhe and jean-monnet slugs, so existing sample Calls, News, Events, FAQs and Stories remain valid without rewriting their references. Both CMS Action lists include all nine identifiers.

Shared links/facts live outside translation objects. Cards render summary directly instead of duplicating it into body. The short who/how text is scoped to the requested Action and does not pretend to reproduce every consortium, award or exclusion condition. Remaining calls/events/resources are explicitly [SAMPLE]. Automated tests check the record set, draft markers, source comments, sector groups, shared restriction, links and relationships; they cannot replace the human legal/editorial source review.

Initial proxy access failures were resolved before this review. No external account was created. Official emblems were also obtained; provenance is in src/assets/eu/README.md.
