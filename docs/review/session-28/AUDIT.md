# Session 28 template audit

Both revisions were walked at 390px and 1280px, Georgian first. The per-view records include heading size and line height, document overflow, card and disclosure counts, and scroll regions. See [before](before/audit.json) and [after](after/audit.json). The baseline is main `61fb55d`.

| Finding | Change | Georgian before and after |
| --- | --- | --- |
| Hero CTA rules overrode the shared hover | Four button variants share hover, pressed, disabled and keyboard focus styles. Both Home buttons change fill, border and shadow on hover. | [Before](before/hero-primary-hover-ka-1280.jpg), [after](after/hero-primary-hover-ka-1280.jpg) |
| Card and control corner sizes and focus treatments varied | Cards, chips, controls and inputs share an 8px base radius and common focus treatment. Clickable cards use navy titles, whole-card focus and a tinted icon slot. | [Before](before/card-focus-ka-390.jpg), [after](after/card-focus-ka-390.jpg) |
| The Opportunities sector column took up space on sparse rows | Sector icons and markers sit with the heading. Horizontal Action cards use a two-column grid from 768px and keep the existing summaries. Three columns at 1280px gave three or four lines on three Georgian titles. | [Before](before/opportunities-ka-1280.jpg), [after](after/opportunities-ka-1280.jpg) |
| News mixed portrait ratios, text-only cards and a standing credit line | Cards share a 16:9 media slot, a chip/date row, three-line clamps and content-sized heights. The credit opens in place. | [Before](before/news-ka-1280.jpg), [after](after/news-ka-1280.jpg) |
| Home below the hero relied on white surfaces and blue links | Alternate the existing bands, add a river photo behind the figures, use sector tints and give the existing Calls and Events links a card surface. | [Before](before/home-ka-1280.jpg), [after](after/home-ka-1280.jpg) |
| Large Georgian title treatments and wide body lines made dense pages harder to read | Inner and Action title bands share a smaller responsive heading scale. Georgian heading line height and measure are tuned with the existing local fonts. Georgian paragraphs are capped at 68ch. | [Before](before/action-ka-1280.jpg), [after](after/action-ka-1280.jpg) |
| Event empty state was a line of text | Place the existing sentence and calendar link in a tinted panel with a decorative icon. Stories has the same fallback treatment in its template. | [Before](before/events-ka-390.jpg), [after](after/events-ka-390.jpg) |
| Statistics tables needed a consistent small-screen scroll treatment, and chart colours gave no sector distinction | Add named, focusable scroll regions, an edge and scrollbar affordance on mobile, and sector-coloured bars with the existing labels and numeric equivalents. | [Before](before/statistics-ka-390.jpg), [after](after/statistics-ka-390.jpg) |
| Contact details relied on stacked rules at all sizes | Use a tinted definition list that pairs labels and values on desktop and stacks on mobile. | [Before](before/contact-ka-1280.jpg), [after](after/contact-ka-1280.jpg) |
| Footer links and funding block needed clearer spacing | Align the navigation columns, give links an underline and colour change on interaction, and add breathing room above the funding artwork. | [Before](before/footer-ka-390.jpg), [after](after/footer-ka-390.jpg) |

## Templates walked

- Home, Opportunities, Action, Calls, Events, calendar, News list and article, Resources, Publications, Projects index and year, Statistics and participant map.
- FAQ, About, Team, HERE, Contact, all five Find audiences, Find landing, partner search, Search, Privacy, Accessibility, Credits and the two language sections of the shared 404.
- Populated Stories list and article, Event detail and an open Calls listing in isolated fixtures. Calls has no standalone Call route or separate table in the current sitemap. Its detail stays in the published listing and linked Action pages.
- Long-page return link with JavaScript and without it, plus both Home buttons, a clickable card, the two added photo disclosures, forced colours and reduced motion. See the focused browser reports.

## Considered and retained

- The empty production Stories collection keeps its existing conditional route and link behaviour. The empty template fallback can be reached in a preview with an explicitly supplied route. The populated list exercises it as a section template while publication remains conditional.
- Jean Monnet stays grouped under higher education. School and adult education appear as existing project sectors and use the same palette there. Existing map symbols represent locations and organisation counts.
- Explicit links remain on Call and Find result cards, where cards have several distinct destinations. A credited News card has a separate focus target for its attribution disclosure and one primary article target.
- The article photo credit stays adjacent to its photo. Existing action copy, figures, data coverage notes, translations, URLs, EU funding and disclaimer wording are carried through.
- Privacy, Accessibility and newer supporting templates inherit the common headings, controls and spacing. Their policy content and approved photo choices remain in the source records. The university Find page keeps its previously approved non-photo treatment.
