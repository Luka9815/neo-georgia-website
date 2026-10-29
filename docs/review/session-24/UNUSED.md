# Maintenance removal audit

Checked all current rendered HTML plus populated Event/Call/Resource/Story/Publication/FAQ fixtures in root and prefix layouts, then template/script/data references. Removed CSS selectors .photo-about and .news-panel: neither appears in that output or the source references. Preserve dynamic cards-*, page-*, source-* and status-* classes, script-added state classes and pseudo states. Keep all original image/font/EU/map/icon assets and historical scripts: source/provenance/review documentation references them, so no asset or historical-script deletion is justified. Review evidence folders are retained.

Removed translation keys: format, organiser, readMore, homeGuideTitle, homeGuideBody, openPublication, personGroups, projectUnknown, projectActionLinks, callsEmpty. Removed contactAddress/contactHours/contactEmail/contactPhone/hereList from translation files because facts moved to office.json or the neutral HERE state. Removed socialLinks.json after moving its list to office.json. No production content record is deleted.

Synthetic local-publication .txt fixtures are replaced by valid minimal one-page PDF fixtures so both CMS and build require PDF. The national romanisation helper moves from the importer to lib/romanise.js and is re-exported by the importer, preserving existing API tests.
