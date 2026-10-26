# News image availability, session 13

The optional News image pipeline is implemented, but none of the five promoted posts has an image attached. No migration review image has been copied to src/assets/uploads. Luka must select each image and supply approved Georgian and English alt text before a separate content update.

All five have a downloaded review file available:

| News slug | Review file | Publication status |
|---|---|---|
| europe-day-in-kutaisi | migration/review/images/europe-day-in-kutaisi.png | Waiting for selection and alt text |
| announcement-clarification-on-erasmus-opportunities-for-education-institutions-in-georgia | migration/review/images/announcement-clarification-on-erasmus-opportunities-for-education-institutions-in-georgia.png | Waiting for selection and alt text |
| neo-dissemination-event-2025 | migration/review/images/neo-dissemination-event-2025.jpg | Waiting for selection and alt text |
| eve-statistics | migration/review/images/eve-statistics.jpg | Waiting for selection and alt text |
| information-about-capacity-building-project-proposals | migration/review/images/information-about-capacity-building-project-proposals.png | Waiting for selection and alt text |

Source provenance, byte size and dimensions remain in the corresponding migration/review/news records. Review [ALT NEEDED] values are not production alt text and are rejected by publication validation.

Automated integration checks use test/fixtures/sample-news-image.png, a synthetic rectangle, only in isolated temporary sites. Both language versions and path layouts produce AVIF/WebP plus fallback, responsive widths, dimensions and correct language alt text. A local browser check of four bilingual fixture article/list pages passes axe, image decoding and 320 px overflow checks. The Georgian article was visually inspected at 320 px. The normal site's five promoted records remain unchanged and have no published image placeholder.
