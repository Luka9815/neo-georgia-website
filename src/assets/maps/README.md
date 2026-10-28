# Georgia participants map

Sources checked 2026-10-29. Static build-time SVG, no map service or tiles.

## Border

Natural Earth 1:50m admin-0 countries. https://www.naturalearthdata.com/downloads/50m-cultural-vectors/50m-admin-0-countries-2/ and https://www.naturalearthdata.com/about/terms-of-use/ (public domain). source.json records the exact upstream commit URL, original world-file SHA-256 and selection. georgia.geojson contains only the selected whole Georgian geometry. At this scale ADMIN=Georgia, SOV_A3=GEO is a single Polygon with one ring, including Abkhazia and the Tskhinvali region/South Ossetia. No merging is needed for this source. Do not substitute a de facto clipped boundary. There are no internal borders, separate region paths or different shading. Automated point-in-polygon controls for Sokhumi and Tskhinvali supplement visual review. This is an illustrative overview, not a cadastral boundary.

## Coordinates and aliases

GeoNames (https://www.geonames.org/about.html), CC BY 4.0. The committed src/_data/cityLocations.json contains 40 selected WGS84 records, original GeoNames IDs/links, bilingual labels, explicit reviewed spellings and check dates. Values were inspected in the local geonamescache 3.0.2 cities500.json snapshot (https://github.com/yaph/geonamescache); its source SHA-256 is recorded. No Python package is used by the site. The check date records inspection of this packaged source, not a claim of a live coordinate refresh. GeoNames’s primary search records corroborate the major cities and its primary terms establish attribution. Public credits appear beside the map.

Normalisation trims/collapses whitespace, applies Unicode NFKC and lowercases only for lookup. The table explicitly maps Tbilisi/TBILISI/Tiflis, common source typos, Zestafoni/ZESTAPONI, Tchiatura/Chiatura and other listed variants. No fuzzy matches, organisation-name merges or invented coordinates. A blank historical city can use the same ID's one agreed known city. Multiple different known cities, unreviewed place text and missing cities are unresolved.

The supplied project snapshot gives 605 distinct named identifiers: 567 map to reviewed cities; 38 are unresolved (23 missing, 5 with conflicting cities, 10 with no reviewed alias/coordinate). These 38 are an explicitly non-geographic bubble above the outline and a separate table row, so bubble/table totals are exactly 605. Do not position that bubble at a guessed centroid. The public details list the source place strings and reasons, without exposing organisation IDs. Source strings such as Gori distric or Village Vazisubani, Kakheti Region remain unresolved rather than guessed. GeoNames searches for the smaller settlements could not be read in this session; they remain explicit rather than being assigned coordinates.

## Reproduction

For an intentional maintenance update, download the pinned world GeoJSON in source.json outside the build, verify its SHA-256, select ADMIN=Georgia, retain its geometry and verify both control points and the whole outline. Install geonamescache==3.0.2 outside the checkout, verify cities500.json against the recorded hash and select only the recorded IDs/coordinates. Review every alias and unresolved source string before editing cityLocations.json. lib/participant-map.js reads these committed files without network calls or GIS dependencies. It groups source IDs once, projects the whole outline, scales bubble area linearly with count and supplies native SVG links to the city table. The unknown bubble uses the same scale.
