"""Rebuild WOFF2 assets from downloaded upstream TTFs. No network calls.

Usage: python scripts/subset-fonts.py /path/to/downloaded/ttfs
Requires fonttools[woff] and brotli. See docs/DESIGN.md for sources and versions.
"""
import sys
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

sources = Path(sys.argv[1])
output = Path(__file__).resolve().parents[1] / "src/assets/fonts"
for family, stem, coverage in [
    ("NotoSansGeorgian", "noto-georgian", "U+10A0-10FF,U+1C90-1CBF,U+2D00-2D2F"),
    ("NotoSans", "noto-latin", "U+0020-024F,U+2000-206F,U+20AC,U+2190-2199"),
]:
    for weight in [400, 700]:
        font = instantiateVariableFont(
            TTFont(sources / f"{family}.ttf"),
            {"wght": weight, "wdth": 100}, inplace=True,
        )
        options = subset.Options()
        options.layout_features = ["*"]
        options.name_IDs = ["*"]
        options.name_legacy = True
        options.name_languages = ["*"]
        processor = subset.Subsetter(options=options)
        processor.populate(unicodes=subset.parse_unicodes(coverage))
        processor.subset(font)
        font.flavor = "woff2"
        font.save(output / f"{stem}-{weight}.woff2")
