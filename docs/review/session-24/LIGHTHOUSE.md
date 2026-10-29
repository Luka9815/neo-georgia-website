# Mobile Lighthouse, 2026-10-29

Lighthouse default simulated mobile, one cold local run per template/language, four categories, serially through LIGHTHOUSE_ROOT. Local uncompressed HTTP, not hosted performance. The shared bilingual 404 is audited twice using its English anchor for the second run. Preview/noindex intentionally limits SEO; no launch switch is enabled for these production-preview audits. Raw per-audit findings are in lighthouse.json and raw/lighthouse.log.

| Page | Language | Performance | Accessibility | Best practices | SEO |
| --- | --- | ---: | ---: | ---: | ---: |
| home | ka | 99 | 100 | 100 | 69 |
| opportunities | ka | 99 | 100 | 100 | 69 |
| action | ka | 100 | 100 | 100 | 69 |
| calls | ka | 100 | 100 | 100 | 69 |
| events | ka | 100 | 100 | 100 | 69 |
| news | ka | 100 | 100 | 100 | 69 |
| article | ka | 99 | 100 | 100 | 69 |
| resources | ka | 100 | 100 | 100 | 69 |
| publications | ka | 100 | 100 | 100 | 69 |
| faq | ka | 100 | 100 | 100 | 69 |
| statistics | ka | 100 | 100 | 100 | 69 |
| about | ka | 98 | 100 | 100 | 69 |
| team | ka | 100 | 100 | 100 | 69 |
| here | ka | 100 | 100 | 100 | 69 |
| contact | ka | 100 | 100 | 100 | 69 |
| search | ka | 98 | 100 | 100 | 69 |
| notFound | ka | 100 | 100 | 100 | 69 |
| home | en | 100 | 100 | 100 | 69 |
| opportunities | en | 99 | 100 | 100 | 69 |
| action | en | 100 | 100 | 100 | 69 |
| calls | en | 100 | 100 | 100 | 69 |
| events | en | 100 | 100 | 100 | 69 |
| news | en | 100 | 100 | 100 | 69 |
| article | en | 96 | 100 | 100 | 69 |
| resources | en | 100 | 100 | 100 | 69 |
| publications | en | 100 | 100 | 100 | 69 |
| faq | en | 100 | 100 | 100 | 69 |
| statistics | en | 100 | 100 | 100 | 69 |
| about | en | 99 | 100 | 100 | 69 |
| team | en | 100 | 100 | 100 | 69 |
| here | en | 100 | 100 | 100 | 69 |
| contact | en | 100 | 100 | 100 | 69 |
| search | en | 98 | 100 | 100 | 69 |
| notFound | en | 100 | 100 | 100 | 69 |

All 34 final runs meet performance 90+ (96–100), accessibility 100 and best practices 100. SEO is 69 throughout because the preview intentionally emits noindex and robots Disallow. This remains the only category below 90; the reviewed launched-state fixtures separately verify indexing/robots/sitemap behaviour. Initial runs under competing audit load are retained in lighthouse-initial.json/raw/lighthouse-initial.log and are not counted as the final measurements. No hosted performance guarantee or speed improvement is claimed.
