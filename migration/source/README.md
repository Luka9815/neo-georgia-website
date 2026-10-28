# Source data

## Erasmus+ projects with Georgian participation (retrieved 2026-10-28)

- `erasmus-projects-georgia-2026-10-28.json`: slimmed snapshot of all 6,764 projects returned by the Erasmus+ Project Results Platform for organisation country Georgia (GE), role coordinator or partner, call years 2014 to 2026 (index `eplus2021`, which covers both the 2014-2020 and 2021-2027 programmes).
- Retrieved from the platform's own search service, `https://ec.europa.eu/programmes/service/search/project/search`, which powers https://erasmus-plus.ec.europa.eu/projects. The platform's XLS export is capped at 1,000 projects per download, so it cannot return the full set in one file.
- Per-year totals match the platform's Call Years facet: 2014: 463, 2015: 435, 2016: 429, 2017: 460, 2018: 476, 2019: 417, 2020: 454, 2021: 294, 2022: 769, 2023: 731, 2024: 660, 2025: 741, 2026: 435.
- Long text fields (descriptions, results) are dropped. Organisations are reduced to the coordinator, every Georgian organisation, the total organisation count and the list of organisation countries.
- Raw per-year responses (about 108 MB) are kept locally in `erasmus-projects-georgia-2026-10-28/` and are git-ignored.
- `official-export-sample-call-year-2022.xls`: Luka's manual XLS export for call year 2022 (769 projects), kept as the reference for the platform's official export columns.

Content is as submitted by beneficiaries. Follow the platform disclaimer and terms of use before republishing any field.

Caution: `projectGrantedEuAmount` is the grant for the whole project, not Georgia's share. Mobility projects with external policy funds (KA171/KA107) cover many partner countries. Never sum grant amounts as "EU funding to Georgia".
