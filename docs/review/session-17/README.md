# Session 17 identity and News archive review

Reviewed 2026-10-27 on the production build with Playwright 1.64.1 and Chromium 154.0.8037.57. All five promoted posts were inspected in Georgian and English at 360 px and 1280 px after local fonts loaded, with JavaScript disabled. Both News lists were inspected at both widths too: 24 page/width combinations, without horizontal overflow. archive-checks.json records headings, calendar dates, paragraph/list counts and article link destinations. Representative full-page captures are included below; no review photograph other than the approved dissemination image was copied into uploads.

## Scope and outcome

| Post | Stored publication day | Georgian, 360/1280 px | English, 360/1280 px |
|---|---|---|---|
| europe-day-in-kutaisi | 2025-10-27 | Checked | Checked |
| announcement-clarification-on-erasmus-opportunities-for-education-institutions-in-georgia | 2025-11-17 | Checked | Checked |
| neo-dissemination-event-2025 | 2025-12-24 | Checked | Checked |
| eve-statistics | 2025-12-26 | Checked | Checked |
| information-about-capacity-building-project-proposals | 2026-02-09 | Checked | Checked |

Each list has exactly five cards, newest first, with its existing title, translated calendar day and an excerpt of up to 30 source words. The one approved image is lazy on cards and eager on the matching article. All other posts have no image, including permanent omission of the Europe Day photograph. Detail text uses a 65ch reading width and retains source paragraphs, lists, links, emoji, wording, facts and dates. No new News is expected until January 2027; no stored date was changed to make the archive look newer.

Formatting fixes are render-only: remove an exact duplicate initial title, promote standalone bold section lines to headings, separate malformed leading bold labels from their following sentence, repair the Georgian first project list marker before the source's items 2 and 3, and space the colon before a link label. All four Capacity Building links retain their direct official EU topic URLs and topic-ID labels. No literal Markdown emphasis markers remain in the articles. Sequential headings, source wording/link preservation and calendar dates have regression tests.

The preview notice and shared sample contact/legal content remain visible because this is still a noindex development site. They are not sample News records and are inventoried in HANDOVER. Final launch copy is a separate task; this session does not turn siteLaunched on or silently relabel illustrative content as real.

## Editorial questions, no corrections made

- **EVE participation wording:** the Georgian paragraph says “ჯამში ჩართულია 7 პროექტი”, while English describes seven participations across three funded projects. Confirm whether Georgian should refer to participations rather than seven projects. Values and wording are untouched.
- **Dissemination totals:** the higher-education paragraph gives 6,747 outbound and 2,992 inbound in the 2021–2027 programme period, then cumulative totals of 13,259 and 6,850. The cumulative time window is not explicit. Confirm the periods rather than assuming a counting error or replacing either total. The 19 December event date and 24 December publication day are distinct and retained.
- **Historical clarification:** the November 2025 text describes eligibility broadly, including schools and vocational providers. It is preserved as dated News; check how readers should distinguish it from the current Action eligibility and Georgia authority exclusion. No new eligibility interpretation is inserted.
- **Source-language proofreading:** apparent Georgian spelling/grammar issues in the dissemination source remain unchanged, for example “ერივნული”. Any correction requires an editorial content update, outside this formatting pass. The English Europe Day title and all other titles remain as previously stored.

## Sample publishing and fallback coverage

update-1, update-2 and update-3 were still public when this session began. They are now moved byte-for-byte to test/fixtures/news. They generate no production article routes, cards, sitemap entries or Pagefind documents. CMS/date/optional-English and responsive-image tests copy the fixtures into isolated temporary sites. The Georgian-only update-3 fixture still switches to the English News index and has no English article or listing entry. All five real posts have English versions, so no real production post needs that fallback currently.

Three sample Events are still published in both languages: information-day, webinar and past-session. HANDOVER proposes a fixture-first launch cleanup: move calendar, registration/agenda, CMS and relationship coverage to isolated sites, remove the live JSON only after that coverage passes, clean output and verify old routes/search/sitemap entries are absent. No Event content was removed in this session.

## Identity and compliance

The asset branch's original funded-ka.png is 4246 × 890 px and hashes to 5d787b78f89af4c09b5d8ecc52e711eae1c84348e09511fe27a8b3a12863c517. The original is unchanged. The existing image library generates complete PNG size derivatives, preserving whitespace, aspect ratio and a white box. The Georgian alt is “ევროკავშირი საქართველოსთვის”; English keeps its original artwork. Both contain the funding statement, so adjacent repetition is omitted. The exact Georgian project disclaimer remains unchanged. See src/assets/eu/README.md and the explicit superseding DECISIONS entry for the source and Luka's approval.

The header home link uses officeName exactly. Georgian is “ერაზმუს+ საქართველოს ეროვნული ოფისი”, which differs from the example in the brief; English is “National Erasmus+ Office Georgia”. The wordmark uses existing fonts/colours and is subordinate to the EU emblem. The E+ favicon has typography only, without flag or programme artwork. logoPath stays available for a future approved logo and remains empty. The browser check verifies both wordmark dimensions do not exceed the emblem and checks its white background at 320, 360, 600, 768, 1024 and 1280 px.

## Validation

Clean builds, the full test suite and axe run in root and project-path layouts. Final command outcomes are recorded in HANDOVER and CHANGELOG. The page count drops by five because the three Georgian/two English sample News article routes are removed. No dependency, account, tracking script or launch-flag change was introduced. Automated results do not replace the remaining screen-reader, zoom, document accessibility and hosted CMS/redirect checks.

## Representative captures

- [Georgian News list, 360 px](ka-list-360.png)
- [English News list, 1280 px](en-list-1280.png)
- [Georgian Europe Day article, 360 px](ka-europe-day-in-kutaisi-360.png)
- [English Capacity Building article, 1280 px](en-information-about-capacity-building-project-proposals-1280.png)
