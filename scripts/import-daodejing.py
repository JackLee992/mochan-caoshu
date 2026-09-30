#!/usr/bin/env python3
"""Fetch the pinned Wikisource Wang Bi edition, preserving body paragraphs.

Only the 81 chapters' unannotated Laozi text is exported. No Wang Bi commentary,
colophons, phonetic glosses, website navigation or modern descriptions included.
Output: /tmp/mochan-daodejing.json (or an explicit first command-line argument).
Uses only the Python standard library.
"""
import hashlib
import difflib
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

REVISION = 2354026
TITLE = "道德經 (王弼本)"
SOURCE_URL = "https://zh.wikisource.org/wiki/道德經_(王弼本)"
STABLE_URL = f"https://zh.wikisource.org/w/index.php?title=道德經_(王弼本)&oldid={REVISION}"
NUMERALS = "一二三四五六七八九"


def chinese_number(n):
    if n < 10:
        return NUMERALS[n - 1]
    tens, ones = divmod(n, 10)
    return (NUMERALS[tens - 1] if tens > 1 else "") + "十" + (NUMERALS[ones - 1] if ones else "")


EXPECTED_HEADINGS = [chinese_number(n) + "章" for n in range(1, 82)]


class BodyParagraphs(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.sections = []
        self.active = None
        self.heading_tag = None
        self.heading_parts = []
        self.paragraph_parts = None
        self.dl_depth = 0
        self.suppression = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ("h1", "h2"):
            self.heading_tag = tag
            self.heading_parts = []
        if tag == "dl":
            self.dl_depth += 1
        if tag == "sup":
            self.suppression += 1
        if tag == "p" and self.active is not None and not self.dl_depth:
            self.paragraph_parts = []
        if tag == "br" and self.paragraph_parts is not None:
            self.paragraph_parts.append("\n")

    def handle_endtag(self, tag):
        if tag == self.heading_tag:
            heading = "".join(self.heading_parts)
            if tag == "h2" and any(h in heading for h in EXPECTED_HEADINGS):
                # Chapter headings cannot be confused with the later sound glosses.
                matching = [h for h in EXPECTED_HEADINGS if heading.startswith(h)]
                if not matching:
                    raise ValueError(f"Unrecognized chapter heading: {heading!r}")
                label = max(matching, key=len)
                number = EXPECTED_HEADINGS.index(label) + 1
                if number != len(self.sections) + 1:
                    raise ValueError(f"Chapter sequence broke at {heading!r}")
                self.active = {"number": number, "title": "第" + label, "paragraphs": []}
                self.sections.append(self.active)
            else:
                self.active = None
            self.heading_tag = None
        if tag == "p" and self.paragraph_parts is not None:
            paragraph = re.sub(r"\s+", "", "".join(self.paragraph_parts))
            if paragraph:
                self.active["paragraphs"].append(paragraph)
            self.paragraph_parts = None
        if tag == "sup":
            self.suppression -= 1
        if tag == "dl":
            self.dl_depth -= 1

    def handle_data(self, data):
        if self.suppression:
            return
        if self.heading_tag:
            self.heading_parts.append(data)
        if self.paragraph_parts is not None:
            self.paragraph_parts.append(data)


def main():
    query = urllib.parse.urlencode({"action": "parse", "oldid": REVISION,
                                  "prop": "text|wikitext|revid", "format": "json", "variant": "zh-hant"})
    request = urllib.request.Request("https://zh.wikisource.org/w/api.php?" + query,
                                     headers={"User-Agent": "MochanClassicFetcher/1.0"})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                payload = json.load(response)
            break
        except urllib.error.HTTPError as error:
            if error.code not in (429, 502, 503) or attempt == 2:
                raise
            retry = error.headers.get("Retry-After", "20")
            time.sleep(min(int(retry) if retry.isdigit() else 20, 60))
    data = payload["parse"]
    assert data["revid"] == REVISION
    parser = BodyParagraphs()
    parser.feed(data["text"]["*"])
    sections = parser.sections
    assert len(sections) == 81 and all(section["paragraphs"] for section in sections)
    # zh-hant render changes four historical source glyphs. Restore the exact
    # pinned source characters; the independent markup comparison below proves
    # no body character changed or disappeared during HTML extraction.
    source_glyphs = {19: ("慾", "欲"), 27: ("跡", "迹"),
                     60: ("蒞", "莅"), 64: ("慾", "欲")}
    for section in sections:
        if section["number"] in source_glyphs:
            rendered, original = source_glyphs[section["number"]]
            section["paragraphs"] = [paragraph.replace(rendered, original) for paragraph in section["paragraphs"]]
        section["text"] = "\n\n".join(section["paragraphs"])
        section["plainText"] = "".join(re.findall(r"[\u3400-\u9fff]", section["text"]))
        section["characterCount"] = len(section["plainText"])
        assert section["characterCount"] > 0
        assert not re.search(r"[<>{}\[\]]", section["text"])
    assert sections[0]["text"].startswith("道可道，非常道，名可名，非常名；")
    assert sections[0]["text"].endswith("玄之又玄，眾妙之門。")
    assert sections[-1]["text"].startswith("信言不美，")
    assert sections[-1]["text"].endswith("聖人之道，為而不爭。")
    # Independently extract only unindented body lines from the original wiki
    # markup, so an HTML layout change cannot silently import annotations.
    raw_parts = re.split(r"^==([^=\n]+章)==\s*$", data["wikitext"]["*"], flags=re.M)
    assert len(raw_parts) == 163
    raw_differences = []
    for index, section in enumerate(sections):
        assert raw_parts[index * 2 + 1] == EXPECTED_HEADINGS[index]
        body = re.split(r"^={1,2}[^=]", raw_parts[index * 2 + 2], flags=re.M)[0]
        lines = [line.strip() for line in body.splitlines()
                 if line.strip() and not line.lstrip().startswith(":")]
        raw_plain = "".join(re.findall(r"[\u3400-\u9fff]", "".join(lines)))
        if raw_plain != section["plainText"]:
            raw_differences.append({"chapter": index + 1, "changes": [
                {"source": raw_plain[a:b], "rendered": section["plainText"][x:y]}
                for operation, a, b, x, y in difflib.SequenceMatcher(None, raw_plain, section["plainText"]).get_opcodes()
                if operation != "equal"]})
    if raw_differences:
        print(json.dumps({"rawRenderedDifferences": raw_differences}, ensure_ascii=False, indent=2))
    assert not raw_differences, "Raw/rendered body differs; inspect variant conversion"
    all_plain = "".join(section["plainText"] for section in sections)
    source = {
        "id": "daodejing-wikisource", "label": "維基文庫：道德經（王弼本）",
        "url": SOURCE_URL, "revisionId": REVISION, "stableUrl": STABLE_URL,
        "role": "81章經文正文；排除王弼注、跋及經典釋文；頁面標示公有領域",
        "wikitextSha256": hashlib.sha256(data["wikitext"]["*"].encode("utf-8")).hexdigest(),
    }
    book = {
        "id": "daodejing", "title": "道德經", "shortTitle": "道德經",
        "attribution": "老子著 · 王弼本經文", "author": "老子",
        "edition": "王弼本（維基文庫所載華亭張氏原本，僅收經文）",
        "category": "道家經典", "sectionLabel": "章", "sourceURL": SOURCE_URL,
        "sections": sections, "sectionCount": 81, "characterCount": len(all_plain),
        "sourceIds": [source["id"]],
        "countNote": f"81章經文合計{len(all_plain)}字；不含章題、王弼注、跋、音義、標點與空白。",
        "editorialNotes": [
            "經文依維基文庫《道德經（王弼本）》固定修訂2354026的原文字形；與帛書本、郭店楚簡本及其他傳本有異文。",
            "保留來源經文標點和段落，移除王弼注、跋及經典釋文；不改寫、不增補正文。",
            "章題統一加「第」字以便閱讀，章題不屬正文。來源的「緜」「梲」等異體字保留。",
            "依原始維基文本恢復繁簡自動轉換的4處字形：第19、64章「慾」還原「欲」，第27章「跡」還原「迹」，第60章「蒞」還原「莅」。81章正文漢字均與原始維基文本逐字一致。",
        ],
    }
    output = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("/tmp/mochan-daodejing.json")
    output.write_text(json.dumps({"daodejing": book, "sources": [source]}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"output": str(output), "revisionId": REVISION, "sections": 81,
                      "characters": len(all_plain), "firstChapter": sections[0]["text"],
                      "lastChapter": sections[-1]["text"], "wikitextSha256": source["wikitextSha256"]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
