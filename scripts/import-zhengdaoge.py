#!/usr/bin/env python3
"""Import the complete pinned Wikisource Yongjia Zhengdao Ge, without biography.

Writes /tmp/mochan-zhengdaoge.json, or the first positional output path.
Preserves source characters/punctuation; reader formatting is handled by app.js.
Requires only the Python standard library.
"""
import hashlib
import json
import re
import sys
import urllib.parse
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

REVISION = 2296512
TITLE = '永嘉證道歌'
SOURCE_URL = 'https://zh.wikisource.org/wiki/永嘉證道歌'
STABLE_URL = f'https://zh.wikisource.org/w/index.php?title=永嘉證道歌&oldid={REVISION}'
FIRST = '君不見。'
LAST = '未了吾今為君訣。'


def han(text):
    return ''.join(re.findall(r'[\u3400-\u9fff]', text))


class PoemParagraphs(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = None
        self.paragraphs = []
        self.reading = False
        self.finished = False

    def handle_starttag(self, tag, attrs):
        if tag == 'p':
            self.parts = []

    def handle_data(self, data):
        if self.parts is not None:
            self.parts.append(data)

    def handle_endtag(self, tag):
        if tag != 'p' or self.parts is None:
            return
        paragraph = re.sub(r'\s+', '', ''.join(self.parts))
        self.parts = None
        if paragraph == FIRST:
            self.reading = True
        if self.reading and not self.finished and paragraph:
            self.paragraphs.append(paragraph)
            if paragraph.endswith(LAST):
                self.finished = True


def main():
    query = urllib.parse.urlencode({'action': 'parse', 'oldid': REVISION,
                                   'prop': 'text|wikitext|revid', 'format': 'json'})
    request = urllib.request.Request('https://zh.wikisource.org/w/api.php?' + query,
                                     headers={'User-Agent': 'MochanClassicFetcher/1.0'})
    with urllib.request.urlopen(request, timeout=45) as response:
        payload = json.load(response)['parse']
    assert payload['revid'] == REVISION
    raw = payload['wikitext']['*']
    assert raw.count(FIRST) == 1 and raw.strip().endswith(LAST)
    body = raw[raw.index(FIRST):].strip()
    paragraphs = [p.strip() for p in re.split(r'\n\s*\n', body) if p.strip()]
    assert len(paragraphs) == 64
    assert not re.search(r'[{}<>\[\]]', body), 'Unexpected wiki markup in poem'
    text = '\n\n'.join(paragraphs)
    plain = han(text)
    assert len(plain) == 1813 and plain.startswith('君不見絕學無為閑道人')
    assert plain.endswith('莫將管見謗蒼蒼未了吾今為君訣')
    parser = PoemParagraphs()
    parser.feed(payload['text']['*'])
    assert parser.finished and parser.paragraphs == paragraphs, 'HTML/raw text differ'
    digest = hashlib.sha256(plain.encode()).hexdigest()
    volume = {
        'id': 'zhengdaoge', 'title': TITLE, 'shortTitle': '證道歌',
        'attribution': '唐 · 永嘉玄覺禪師撰', 'author': '永嘉玄覺',
        'edition': '維基文庫繁體整理本（固定修訂2296512）',
        'editionNote': '全文保留來源字形；與其他傳本有異文。',
        'category': '禪宗歌偈', 'sourceURL': SOURCE_URL,
        'paragraphs': paragraphs, 'paragraphCount': len(paragraphs),
        'text': text, 'plainText': plain, 'characterCount': len(plain),
        'sourceIds': ['zhengdaoge-wikisource'], 'plainTextSha256': digest,
        'countNote': '正文1813漢字；不含題名、作者、標點和空白。64段是來源分段，不是古籍章目。',
        'editorialNotes': ['僅收自「君不見」至「未了吾今為君訣」的歌文，不含無相大師行狀及注釋。',
                           '維基文庫原字形和分段保留；例如「五蘊」「此來」「貌頰」不混合改作其他傳本。',
                           '網頁按既有規則去標點並換行，來源JSON仍保留標點。']
    }
    source = {'id': 'zhengdaoge-wikisource', 'title': '維基文庫 · 永嘉證道歌',
              'url': SOURCE_URL, 'stableURL': STABLE_URL, 'revision': REVISION,
              'publicDomainOriginal': True,
              'wikitextSha256': hashlib.sha256(raw.encode()).hexdigest(),
              'plainTextSha256': digest, 'note': volume['countNote']}
    output = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('/tmp/mochan-zhengdaoge.json')
    output.write_text(json.dumps({'zhengdaoge': volume, 'sources': [source]}, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'output': str(output), 'revision': REVISION, 'paragraphs': len(paragraphs),
                      'characters': len(plain), 'plainTextSha256': digest,
                      'rawAndRenderedTextMatch': True}, ensure_ascii=False))


if __name__ == '__main__':
    main()
