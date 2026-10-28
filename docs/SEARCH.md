# Georgian static search

## Session 14: nominative fallback, 2026-10-27

Luka authorised appending ა and ი to the end of the common ending list in src/assets/js/georgian-search.js. The same four-letter minimum, longest-ending priority, one removal per word, typed-query ranking and de-duplication apply. No index terms or page text change. This extends the session 12 rule, rather than introducing a linguistic stemmer.

The table below adds session 14 to the saved session 12 measurements. All five required queries now retrieve every page in their tested word family. This is a small corpus spot check, not a general Georgian-language benchmark. English controls are compared against session 12's complete ordered URL lists as well as against the as-typed API query. Current root/project-path browser evidence is saved in review/search-session-14.json.

## Session 12: approved production search, 2026-10-27

Luka has decided to ship Pagefind with the specified Georgian ending fallback. This supersedes the session 11 hold below and the dated decision “Pagefind held after Georgian inflection evaluation”. The earlier measurements remain historical evidence, not a current shipping prohibition.

`npm run build` runs Eleventy and then scripts/build-search.js. The existing Pages deployment runs that command, so no separate account, service or workflow stage is needed. The builder replaces stale search output and creates separate ka/en indexes, with forceLanguage, rootSelector main and .notice excluded. Redirects, 404 and search pages are omitted. Stored result URLs include PATH_PREFIX; the browser sets Pagefind baseUrl to / so Pagefind cannot prepend the project prefix a second time.

Both /ka/search/ and /en/search/ use the Pagefind JavaScript API with site-designed markup. The header links to search outside the seven-item menu. The input is labelled, Enter submits, results are links with titles and plain-text excerpts, and a polite atomic live region announces results/errors. No results markup is inserted as executable HTML. Without JavaScript, the hidden form is replaced by a short explanation and seven main-section links. Failed loading also exposes those links. Pagefind is imported only on submission, using the active language's index. Ordinary pages load no search modules or indexes.

### Query-only fallback

The single documented ending list and implementation are in src/assets/js/georgian-search.js. Session 12 supplied 18 endings; session 14 appends nominative ა and ი last. The list is sorted longest first, removes at most one ending per Georgian word, and only when at least four letters remain. Search runs the query as typed, then one variant with each eligible word shortened. Multiword queries stay multiword queries; this does not OR each word independently. Results retain typed-query ranking first and are de-duplicated. English queries run once unchanged. No index terms or page text are modified.

This is a small suffix heuristic, not a Georgian stemmer. Session 12 left nominative forms unchanged; session 14 adds only the two newly authorised endings to cover the measured base-form gaps.

### Before and after on actual content

The required word-family checks use the same nine mobility, seven cooperation and three Georgian Erasmus pages. Both build layouts are checked, with exact typed ranking preserved. English controls are compared by their complete ordered URL lists, not only their counts.

| Query | No fallback | Session 12 | Session 14 (+ა, ი) |
|---|---:|---:|---:|
| მობილობა | 6/9 (67%) | 6/9 (67%) | 9/9 (100%) |
| მობილობის | 7/9 (78%) | 9/9 (100%) | 9/9 (100%) |
| თანამშრომლობა | 5/7 (71%) | 5/7 (71%) | 7/7 (100%) |
| თანამშრომლობის | 3/7 (43%) | 7/7 (100%) | 7/7 (100%) |
| ერასმუსის | 2/3 (67%) | 3/3 (100%) | 3/3 (100%) |

English controls remain unchanged: mobility 9, cooperation 5, Erasmus 10 and მობილობა 0. The browser check also verifies keyboard submission, no-JavaScript links, active-language loading, no search requests from ordinary pages and project-path results. Session 12 raw measurements are in review/search-session-12.json; session 14 adds review/search-session-14.json.

### Search-page weight

Response body bytes for search modules and Pagefind assets are measured separately from shared HTML/CSS/fonts and HTTP headers. Modules load on search-page entry; the active-language runtime/index and all result fragments load after submission. Ordinary pages load none of these scripts. Counts include all returned result fragments for the first query (მობილობის or mobility), measured in session 12.

| Layout | Initial modules | After first Georgian query | After first English query |
|---|---:|---:|---:|
| / | 3,615 B | 200,027 B | 197,465 B |
| /neo-georgia-website/ | 3,615 B | 200,189 B | 197,571 B |

These are local, uncompressed application payloads, not a production network benchmark.

## Session 11 historical evaluation (superseded)

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


## Session 19 catalogue boundary

Index the bilingual projects indexes and statistics pages. Exclude per-year project tables: including them raises combined Pagefind assets from the pre-session 1,315,137 bytes to 3,235,348 bytes. The year tables remain complete static HTML with normal internal links, sitemap entries and language switches. Search does not promise individual project-title lookup; browse the year tables or use the official Project Results Platform for that. Final index sizes after exclusion are recorded in the Session 19 review report.
