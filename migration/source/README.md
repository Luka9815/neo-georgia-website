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

## Verified refresh request (Luka, 2026-10-28)

POST `https://ec.europa.eu/programmes/service/search/project/search` with headers:

```
Content-Type: application/json
Origin: https://erasmus-plus.ec.europa.eu
```

For call year Y and numeric offset F, use exactly this body (Y is a string):

```text
{"from":F,"index":"eplus2021","keyword":"","matchAllCountries":false,"project":{"projectCallYear":"Y"},"coordinator":{},"partner":{},"organisation":{"organisationCountry":"GE","organisationRole":"coordinator_or_partner"},"size":100,"sort":"","withAggregations":false}
```

The response total is `total`; records are in `projectDocuments`. Request offsets 0, 100, 200 and so on until from >= total or an empty page is returned. Wait 0.5 seconds between requests, including across call years. Fetch call years 2014 through the current Tbilisi calendar year. Every year's retrieved count must equal its reported total, otherwise fail the whole run. Changing totals, duplicate references, invalid records and unexpected/ambiguous organisation structures also fail before a candidate is written.

Run manually from the repository root with Node 24:

```
NODE_USE_ENV_PROXY=1 node scripts/fetch-projects.js
```

The command uses the verified request directly, without a request-template file. Each project record's full organisation array is identified by the organisationName/organisationCountry/organisationRole field schema; an unrecognised or ambiguous structure is rejected. Raw pages, same-schema slim candidates and difference reports stay in the ignored dated run directory for review; the approved source is never replaced automatically. No refresh runs in build, test or CI. No live fetch was run in this review session, as instructed by Luka.

## Higher education mobility coverage

The snapshot contains zero KA107 projects and no 2014–2020 KA1 higher education mobility records. Georgian partner institutions are not listed on KA107 projects, so that programme's international credit mobility with Georgia is not identifiable in this source and is not counted. KA171 projects in 2021–2027 appear through the Mobilities - Georgia country entry. Comparisons of higher education mobility across 2020/2021 are not meaningful. The public projects index and statistics page state this limitation in both languages beside the relevant comparisons.
