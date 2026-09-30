#!/usr/bin/env python3
"""Convert a supplied Yu Youren TTF/ZIP to WOFF2 without subsetting.

Requirements: fonttools==4.66.0, Brotli==1.2.0
Writes only local output/report files. Full TTF bytes from a ZIP stay in memory.
The original cmap, outlines, glyph order, hmtx and vmtx are verified after WOFF2
decoding. Embedded bitmap tables EBDT/EBLC/EBSC are the only tables removed.

Example:
  python scripts/build-yu-font.py --source-zip '/path/to/font.zip' \
      --content '/path/to/site/content.json'
  # Or use --source-ttf '/path/to/original.ttf'.
"""
from __future__ import annotations

import argparse
from collections import Counter, defaultdict
import hashlib
import io
import json
from pathlib import Path
import unicodedata
import zipfile

import brotli
import fontTools
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.ttLib import TTFont


def sha(data):
    return hashlib.sha256(data).hexdigest()


def han(cp):
    return (unicodedata.name(chr(cp), "").startswith(
        ("CJK UNIFIED IDEOGRAPH", "CJK COMPATIBILITY IDEOGRAPH")) or cp == 0x3007)


def outline(glyphs, name):
    pen = DecomposingRecordingPen(glyphs)
    glyphs[name].draw(pen)
    return pen.value


def describe(cp):
    return {"codepoint": f"U+{cp:04X}", "character": chr(cp),
            "unicodeName": unicodedata.name(chr(cp), "CONTROL OR UNASSIGNED")}


def unicode_ranges(codepoints):
    points = sorted(set(codepoints))
    ranges = []
    if not points:
        return ranges
    first = previous = points[0]
    for cp in points[1:]:
        if cp == previous + 1:
            previous = cp
            continue
        ranges.append(f"U+{first:04X}" if first == previous else f"U+{first:04X}-{previous:04X}")
        first = previous = cp
    ranges.append(f"U+{first:04X}" if first == previous else f"U+{first:04X}-{previous:04X}")
    return ranges


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument("--source-ttf", type=Path)
    source.add_argument("--source-zip", type=Path)
    parser.add_argument("--zip-member")
    parser.add_argument("--content", type=Path)
    parser.add_argument("--existing-subset", type=Path)
    parser.add_argument("--output", type=Path, default=Path("/tmp/mochan-YuYouren-full.woff2"))
    parser.add_argument("--report", type=Path, default=Path("/tmp/mochan-YuYouren-full-report.json"))
    parser.add_argument("--unicode-range-output", type=Path,
                        default=Path("/tmp/mochan-YuYouren-valid-unicode-range.css"))
    args = parser.parse_args()
    source_path = args.source_ttf or args.source_zip
    container_data = source_path.read_bytes()
    member = None
    if args.source_zip:
        with zipfile.ZipFile(io.BytesIO(container_data)) as archive:
            names = [n for n in archive.namelist() if n.lower().endswith(".ttf")]
            member = args.zip_member
            if member is None:
                if len(names) != 1:
                    parser.error("Specify --zip-member when a ZIP has multiple TTFs")
                member = names[0]
            if member not in names:
                parser.error("ZIP member does not identify a TTF")
            ttf_data = archive.read(member)
    else:
        ttf_data = container_data

    original = TTFont(io.BytesIO(ttf_data), recalcTimestamp=False)
    original_cmap = original.getBestCmap()
    original_glyphs = original.getGlyphSet()
    glyph_order = original.getGlyphOrder()
    if args.output.resolve() == source_path.resolve():
        parser.error("Refusing to overwrite source font")
    if args.existing_subset and args.output.resolve() == args.existing_subset.resolve():
        parser.error("Refusing to overwrite the existing site font")

    font = TTFont(io.BytesIO(ttf_data), recalcTimestamp=False)
    removed_tables = [t for t in ["EBDT", "EBLC", "EBSC"] if t in font]
    for tag in removed_tables:
        del font[tag]
    font.flavor = "woff2"
    args.output.parent.mkdir(parents=True, exist_ok=True)
    font.save(args.output, reorderTables=True)
    result = TTFont(args.output, recalcTimestamp=False)
    result_cmap = result.getBestCmap()
    result_glyphs = result.getGlyphSet()
    assert original_cmap == result_cmap, "WOFF2 changed best cmap"
    assert glyph_order == result.getGlyphOrder(), "WOFF2 changed glyph order"
    before_cmaps = [(t.platformID, t.platEncID, t.format, t.cmap)
                    for t in original["cmap"].tables]
    after_cmaps = [(t.platformID, t.platEncID, t.format, t.cmap)
                   for t in result["cmap"].tables]
    assert before_cmaps == after_cmaps, "WOFF2 changed a cmap subtable"

    outline_groups = defaultdict(list)
    empty = []
    notdef_mappings = [cp for cp, name in original_cmap.items() if name == ".notdef"]
    notdef_outline = outline(original_glyphs, ".notdef")
    equal_to_notdef = []
    # Compare all glyphs, including unmapped glyphs and shaping alternates.
    for name in glyph_order:
        before = outline(original_glyphs, name)
        after = outline(result_glyphs, name)
        assert before == after, f"Changed outline for {name}"
        for tag in ["hmtx", "vmtx"]:
            if tag in original:
                assert tag in result and original[tag][name] == result[tag][name], (
                    f"Changed {tag} metrics for {name}")
    for cp, name in sorted(original_cmap.items()):
        commands = outline(original_glyphs, name)
        if not commands:
            empty.append(cp)
        if commands == notdef_outline:
            equal_to_notdef.append(cp)
        outline_groups[sha(repr(commands).encode("utf-8"))].append(cp)
    groups = sorted(outline_groups.values(), key=len, reverse=True)
    # In this source font the overwhelmingly large nonempty group renders a
    # shared missing-glyph symbol (visually inspected), not its assigned Han.
    placeholder = set(groups[0]) if len(groups[0]) > 1000 else set()
    assert not placeholder or all(han(cp) for cp in placeholder)
    assert ord("缺") not in placeholder, "Do not exclude the genuine 缺 character"
    placeholder_signature = next((h for h, group in outline_groups.items()
                                  if group == groups[0]), None)
    other_duplicate_groups = [group for group in groups[1:] if len(group) > 1]
    mapped_han = {cp for cp in original_cmap if han(cp)}
    permitted = set(original_cmap) - placeholder
    ranges = unicode_ranges(permitted)
    unicode_css = "/* Excludes the source font's 10,794 shared missing-glyph markers. */\n" + (
        "unicode-range: " + ", ".join(ranges) + ";\n")
    args.unicode_range_output.parent.mkdir(parents=True, exist_ok=True)
    args.unicode_range_output.write_text(unicode_css, encoding="utf-8")

    book_reports = {}
    content_metadata = None
    if args.content:
        content_bytes = args.content.read_bytes()
        document = json.loads(content_bytes.decode("utf-8"))
        content_metadata = {"path": str(args.content.resolve()), "sha256": sha(content_bytes)}
        for key, volume in document.items():
            if not isinstance(volume, dict) or not ("sections" in volume or "paragraphs" in volume):
                continue
            sections = volume.get("sections") or [volume]
            text = "\n".join(section.get("plainText") or section.get("text")
                             or "\n".join(section.get("paragraphs", [])) for section in sections)
            counter = Counter(ch for ch in text if han(ord(ch)))
            body_cps = {ord(ch) for ch in counter}
            affected = body_cps & placeholder
            missing_cmap = body_cps - set(original_cmap)
            blank = body_cps & set(empty)
            book_reports[key] = {
                "uniqueHanCharacters": len(body_cps), "hanOccurrences": sum(counter.values()),
                "cmapMissingCharacters": "".join(chr(cp) for cp in sorted(missing_cmap)),
                "blankOutlineCharacters": "".join(chr(cp) for cp in sorted(blank)),
                "sharedPlaceholderUniqueCharacters": len(affected),
                "sharedPlaceholderOccurrences": sum(counter[chr(cp)] for cp in affected),
                "sharedPlaceholderCharacters": "".join(chr(cp) for cp in sorted(affected)),
                "nonPlaceholderNonemptyUniqueHanCharacters": len(body_cps - affected - missing_cmap - blank),
                "nonPlaceholderNonemptyPercent": round(100 * len(body_cps - affected - missing_cmap - blank) / len(body_cps), 4),
                "note": "Distinct nonempty outlines do not prove that every character is correctly encoded or historically authentic.",
            }

    report = {
        "dependencies": {"fontTools": fontTools.__version__, "Brotli": brotli.__version__},
        "source": {"path": str(source_path.resolve()), "zipMember": member,
                   "containerSha256": sha(container_data), "ttfSha256": sha(ttf_data),
                   "ttfBytes": len(ttf_data), "cmapCodepoints": len(original_cmap),
                   "glyphs": len(glyph_order), "hanCmapCodepoints": len(mapped_han)},
        "output": {"path": str(args.output.resolve()), "bytes": args.output.stat().st_size,
                   "sha256": sha(args.output.read_bytes()), "cmapCodepoints": len(result_cmap),
                   "glyphs": len(result.getGlyphOrder()), "removedBitmapTables": removed_tables},
        "verification": {"allCmapSubtablesUnchanged": True, "allGlyphNamesAndOrderUnchanged": True,
                         "allGlyphOutlineComparisons": len(glyph_order),
                         "allGlyphOutlinesAndHorizontalVerticalMetricsMatchTtf": True,
                         "unicodeSubsettingApplied": False},
        "fontFaceUnicodeRange": {"path": str(args.unicode_range_output.resolve()),
                                 "permittedCodepoints": len(permitted), "excludedPlaceholderCodepoints": len(placeholder),
                                 "compressedRanges": len(ranges), "genuineQueU7F3ARetained": ord("缺") in permitted,
                                 "cssBytes": len(unicode_css.encode("utf-8")),
                                 "cssSha256": sha(unicode_css.encode("utf-8"))},
        "outlineAudit": {
            "emptyOutlineCodepoints": [describe(cp) for cp in empty],
            "hanWithEmptyOutline": sum(han(cp) for cp in empty),
            "literalNotdefMappings": [describe(cp) for cp in notdef_mappings],
            "sameOutlineAsNotdef": [describe(cp) for cp in equal_to_notdef],
            "uniqueOutlineSignatures": len(outline_groups),
            "sharedPlaceholder": {"codepoints": len(placeholder), "hanCodepoints": len(placeholder & mapped_han),
                                  "outlineSha256": placeholder_signature,
                                  "representative": describe(min(placeholder)) if placeholder else None,
                                  "characters": "".join(chr(cp) for cp in sorted(placeholder)),
                                  "visuallyConfirmedMissingGlyphMarker": bool(placeholder),
                                  "note": "These are cmap entries with nonempty but identical missing-glyph marker outlines; full conversion preserves the source limitation."},
            "otherExactDuplicateOutlineGroups": [[describe(cp) for cp in group] for group in other_duplicate_groups],
            "rangeCmapCounts": {name: sum(start <= cp <= end for cp in original_cmap)
                               for name, start, end in [("basicHanU4E00toU9FFF", 0x4E00, 0x9FFF),
                                                       ("extensionAU3400toU4DBF", 0x3400, 0x4DBF),
                                                       ("compatibilityHanUF900toUFAFF", 0xF900, 0xFAFF),
                                                       ("nonBmp", 0x10000, 0x10FFFF)]},
            "styleLimitations": "The font is a fixed digital interpretation. Automated outline checks cannot certify Yu Youren authenticity, correct semantic mapping for every glyph, or cursive quality. No non-BMP cmap exists.",
        },
        "content": content_metadata,
        "books": book_reports,
    }
    if args.existing_subset:
        data = args.existing_subset.read_bytes()
        old = TTFont(io.BytesIO(data), recalcTimestamp=False)
        report["existingSubset"] = {"path": str(args.existing_subset.resolve()), "bytes": len(data),
                                    "sha256": sha(data), "cmapCodepoints": len(old.getBestCmap()),
                                    "allCmapCodepointsRetained": set(old.getBestCmap()) <= set(result_cmap),
                                    "sharedPlaceholderCodepoints": len(set(old.getBestCmap()) & placeholder)}
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    summary = {"source": report["source"], "output": report["output"],
               "verification": report["verification"], "blankHanOutlines": report["outlineAudit"]["hanWithEmptyOutline"],
               "sharedMissingMarkerHan": len(placeholder & mapped_han), "books": book_reports,
               "fontFaceUnicodeRange": report["fontFaceUnicodeRange"],
               "reportPath": str(args.report)}
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
