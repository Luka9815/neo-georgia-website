# Georgian static search evaluation

Date: 2026-10-26. Candidate: Pagefind 1.5.2, pinned as a development dependency for a reproducible experiment.

**Decision: do not ship Pagefind yet.** Full words and prefixes work, but ordinary Georgian inflections miss relevant real content. No search page, header search, runtime script or generated index is published. This follows session 11's explicit quality gate. The search UI and its no-JavaScript fallback remain blocked pending an adequate Georgian engine or a reviewed normalisation approach.

## Method

Run `npm run evaluate:search -- --report=docs/review/search-session-11.json` after npm ci. Chromium defaults to /usr/bin/chromium, configurable with CHROMIUM_PATH. The manual command builds the actual site with Eleventy in temporary directories, then runs Pagefind after each build. It indexes 37 Georgian and 36 English pages separately, reading only main content and excluding the development notice, redirect stubs and 404. It does not change production builds or source content. It serves the temporary indexes on localhost, queries the browser runtime and deletes them afterwards. It requires local process/socket access, but no external request or account at evaluation runtime. Dependency installation requires the npm registry.

The experiment runs both `/` and `/neo-georgia-website/`. Every returned URL is checked for its own language/prefix and an existing built target. Non-local browser requests are blocked and recorded; none occurred. Counts are identical in the two layouts. Raw URLs, missed pages, timings and bytes are saved in [the measurement record](review/search-session-11.json).

## Results against actual Georgian content

No artificial search fixture or automatic translation was added. The five migrated News articles and existing Georgian Action drafts provide the test prose. Sample pages are included in the same whole-site index but are not the basis for rejecting the candidate.

| Query | Kind | Results in each layout | Observation |
|---|---|---:|---|
| ერასმუს | Full word / prefix | 3 | Finds Kutaisi, dissemination and News list |
| ერასმუსის | Inflected word | 2 | Finds Kutaisi and News list; no equivalent-form expansion |
| მობილობა | Full word | 6 | Misses the clarification and EVE articles, which use inflected forms |
| მობილობ | Partial word | 9 | Finds all nine pages containing this word family |
| მობილობის | Inflected word | 7 | Misses home and Opportunities, which use other forms |
| თანამშრომლობა | Full word | 5 | Misses clarification and EVE articles with inflected forms |
| თანამშრომლობის | Inflected word | 3 | Misses CB Youth and Erasmus Mundus Action pages, plus other relevant pages |
| საგანმანათლებლო | Full word | 5 | Finds the clarification article and related News content |
| mobility (English index) | English control | 9 | All returned paths are /en/ |
| მობილობა (English index) | Isolation control | 0 | No Georgian index leakage |

For the მობილობ family, the full-word query retrieves 6 of 9 pages (67%); the genitive retrieves 7 of 9 (78%). For თანამშრომლობ, full-word recall is 5 of 7 (71%), and genitive recall is 3 of 7 (43%). These are small, transparent word-family spot checks, not a general linguistic benchmark. They expose real omissions: a visitor typing მობილობა will not find the clarification or EVE article even though both discuss mobility. Requiring visitors to truncate to მობილობ is insufficient for public search.

The generated Georgian entry has `wasm: null`, while English selects `wasm: en`. The experiment demonstrates generic Georgian token/prefix matching, with no adequate equivalence between the tested Georgian inflections. It does not establish a Georgian stemming guarantee.

## Build and weight

One local build per layout, no network requests during building/indexing. These are local measurements, not production performance guarantees. Timings include process startup and may vary between runs.

| Layout | Eleventy build | Additional indexing | Generated ka index | Generated en index | ka first-query payload | en first-query payload |
|---|---:|---:|---:|---:|---:|---:|
| Root | 726 ms | 411 ms | 631,576 B | 692,120 B | 192,624 B | 193,861 B |
| Project prefix | 865 ms | 301 ms | 632,189 B | 692,572 B | 192,739 B | 193,965 B |

Generated sizes include optional bundled UI files, even though this experiment imports only the runtime. Payloads are response body bytes for runtime/index assets and all returned fragments for the first query (მობილობა or mobility), without HTTP headers or server transport compression. This is an upper bound for a UI that lazily loads only visible results. The baseline generated site was 919,301 B at root and 964,891 B with the prefix. Candidate indexes add about 1.26 MiB combined to the generated output and about 188 KiB for the first Georgian query. The experiment loads both languages to measure them; a future UI must load only the active language.

Because this candidate is rejected, the shipped page-weight/build-time increase is zero: normal `npm run build` remains Eleventy, with no Pagefind assets. The development dependency and manual evaluator remain for reproducibility. There is no search input that appears functional without adequate results.

## Recommendation and blocked work

Keep Pagefind as a candidate only. Test a language-aware normaliser or reviewed Georgian word-family expansion using a broader corpus and native-speaker relevance review. Do not silently strip Georgian suffixes: that can conflate unrelated terms. Compare another account-free local static engine if it provides stronger Georgian analysis. Define acceptance queries with NEO before choosing. No alternative engine is selected in this session.

Once quality is adequate, implement SITE-PLAN template 14 at matching /ka/search/ and /en/search/ routes, linked from the header without adding a top-level menu item. Require labelled keyboard-accessible controls/results, language-only indexes, a no-JavaScript explanation with main-section links, project-prefix checks, and an explicit payload budget. None of this conditional UI work is claimed complete here.
