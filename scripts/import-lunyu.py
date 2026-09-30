#!/usr/bin/env python3
"""Reproduce Mochan Analects data from pinned Wikisource chapter revisions.
Uses only Python standard library. Keeps source main text, omits footnotes,
variant tooltips, chapter labels and navigation. No modern translation included.
"""
import concurrent.futures
import hashlib
import json
from html.parser import HTMLParser
from pathlib import Path
import re
import time
import urllib.error
import urllib.parse
import urllib.request

CHAPTERS = [
    ('學而第一',2058123), ('為政第二',2058121), ('八佾第三',2200702),
    ('里仁第四',2177314), ('公冶長第五',973596), ('雍也第六',10602494),
    ('述而第七',10602118), ('泰伯第八',2120928), ('子罕第九',2018157),
    ('鄉黨第十',1956464), ('先進第十一',10602404), ('顏淵第十二',10602324),
    ('子路第十三',1956460), ('憲問第十四',10602030), ('衞靈公第十五',2058122),
    ('季氏第十六',2178436), ('陽貨第十七',1075085), ('微子第十八',1311661),
    ('子張第十九',1075051), ('堯曰第二十',2175814),
]
AGENT = 'MochanClassics/1.0 (public-domain-text-curation)'
VOID = {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
EXCLUDED = {'variant-tooltip','reference','references','reflist','mw-editsection','mw-cite-backlink'}
HAN = re.compile(r'[\u3400-\u4dbf\u4e00-\u9fff\U00020000-\U0002ee5f]')
LABEL = re.compile(r'^[一二三四五六七八九十]+之[一二三四五六七八九十]+$')

class Node:
    def __init__(self,tag='',attrs=()):
        self.tag = tag
        self.attrs = dict(attrs)
        self.children = []
    def text(self):
        classes = set(self.attrs.get('class','').split())
        if self.tag in {'style','script'} or classes.intersection(EXCLUDED):
            return ''
        return ''.join(child if isinstance(child,str) else child.text() for child in self.children)

class Tree(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node('root')
        self.stack = [self.root]
    def handle_starttag(self,tag,attrs):
        n=Node(tag,attrs); self.stack[-1].children.append(n)
        if tag not in VOID: self.stack.append(n)
    def handle_startendtag(self,tag,attrs):
        self.stack[-1].children.append(Node(tag,attrs))
    def handle_endtag(self,tag):
        for i in range(len(self.stack)-1,0,-1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                break
    def handle_data(self,data):
        self.stack[-1].children.append(data)

def walk(node):
    if node.tag == 'table': return  # navigation and Public-domain license boilerplate
    yield node
    for child in node.children:
        if isinstance(child,Node): yield from walk(child)

def get_json(params):
    url='https://zh.wikisource.org/w/api.php?'+urllib.parse.urlencode(params)
    req=urllib.request.Request(url,headers={'User-Agent':AGENT})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req,timeout=45) as response:
                data=json.load(response)
            time.sleep(0.7)
            return data
        except urllib.error.HTTPError as error:
            if error.code != 429 or attempt == 4: raise
            time.sleep(min(20,5*(attempt+1)))

def download(entry):
    number, (title, revision) = entry
    # Original page text is already Traditional Chinese; omit variant conversion
    # so semantic words such as 云 do not get mechanically changed to 雲.
    result=get_json({'action':'parse','oldid':revision,'prop':'text|revid',
                     'format':'json','disableeditsection':1})
    assert 'error' not in result, result.get('error')
    parsed=result['parse']; assert parsed['revid']==revision
    html=parsed['text']['*']; parser=Tree(); parser.feed(html)
    paragraphs=[]; chapter_labels=[]; chapter_paragraphs=[]; active=False; current=[]
    for node in walk(parser.root):
        if node.tag == 'div' and LABEL.fullmatch(node.attrs.get('id','')):
            if current: chapter_paragraphs.append(current)
            current=[]; active=True; chapter_labels.append(node.attrs['id'])
        elif node.tag in {'h2','h3','h4'} and active:
            if current: chapter_paragraphs.append(current); current=[]
            active=False
        elif node.tag=='p' and active:
            text=re.sub(r'\s+','',node.text())
            if re.match(r'^此(?:先秦)?作品在全世界都属于公有领域', text) or text == 'PublicdomainPublicdomainfalsefalse':
                continue
            if text:
                assert not re.search('[a-zA-Z0-9<>]', text), (title, text)
                paragraphs.append(text); current.append(text)
    if current: chapter_paragraphs.append(current)
    assert paragraphs and len(chapter_labels)==len(chapter_paragraphs), (title,len(chapter_labels),len(chapter_paragraphs))
    text='\n\n'.join(paragraphs); plain=''.join(HAN.findall(text))
    source_url='https://zh.wikisource.org/wiki/'+urllib.parse.quote(parsed['title'],safe='/')
    stable_url='https://zh.wikisource.org/w/index.php?'+urllib.parse.urlencode({'title':parsed['title'],'oldid':revision})
    section={'number':number,'title':title,'paragraphs':paragraphs,'text':text,
             'plainText':plain,'characterCount':len(plain), 'chapterCount':len(chapter_labels),
             'sourceURL':source_url,'revisionId':revision,'stableURL':stable_url,
             'chapterLabels':chapter_labels,
             'chapters':[{'number':i+1,'label':label,'paragraphs':ps} for i,(label,ps) in enumerate(zip(chapter_labels,chapter_paragraphs))]}
    source={'id':'lunyu-wikisource-'+str(number),'label':'維基文庫：論語/'+title,
            'url':source_url,'revisionId':revision,'stableUrl':stable_url,
            'role':'第'+str(number)+'篇主字段原文；排除校勘記和懸浮異文註釋',
            'htmlSha256':hashlib.sha256(html.encode()).hexdigest()}
    return section,source

def main():
    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
        pairs=list(pool.map(download,enumerate(CHAPTERS,1)))
    sections=[s for s,_ in pairs]; sources=[s for _,s in pairs]
    assert len(sections)==20 and sections[0]['title']=='學而第一' and sections[-1]['title']=='堯曰第二十'
    assert all(s['paragraphs'] and s['characterCount']>0 for s in sections)
    book={'id':'lunyu','title':'論語','shortTitle':'論語','category':'儒家',
          'sectionLabel':'篇','attribution':'孔子及其弟子言行 · 弟子與再傳弟子編錄',
          'edition':'維基文庫繁體整理本（二十篇）','sections':sections,
          'characterCount':sum(s['characterCount'] for s in sections),
          'sectionCount':20,'chapterCount':sum(s['chapterCount'] for s in sections),
          'sourceIds':[s['id'] for s in sources],
          'sourceURL':'https://zh.wikisource.org/wiki/%E8%AB%96%E8%AA%9E',
          'countNote':'二十篇正文漢字合計；不含篇題、章號、序說、標點、空白、校勘記、註釋及後補知道篇。',
          'editorialNotes':[
              '正文依各篇固定版本取得，保留繁體及古籍異體字；標點與章段沿用來源。每章正文段落保留，不收現代譯文。',
              '移除來源頁面的校勘記、註疏連結、註號、懸浮異文說明、導航及公有領域頁腳，保留其所附正文。',
              '來源正文包含校訂異文：里仁第四第十四章作「未為可知也」（傳世本「求」）；季氏第十六第十一章作「隱居以成其志」（傳世本「求」）；堯曰第二十第二章作「謂之貪」（傳世本「有司」）。不能混稱其他版本逐字全文。',
              '只收通行二十篇（學而至堯曰），不收維基文庫目錄另列的後補知道第二十二。',
              '古籍正文屬公有領域；維基文庫現代編輯文字及整理另依其站點授權，引用保留來源與固定版本連結。'
          ]}
    payload={'lunyu':book,'sources':sources}
    out=Path('/tmp/mochan-lunyu.json')
    out.write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'output':str(out),'sections':len(sections),
        'chapters':book['chapterCount'],'characters':book['characterCount'],
        'first':sections[0]['title'],'last':sections[-1]['title'],
        'counts':[(s['title'],s['chapterCount'],s['characterCount']) for s in sections]},ensure_ascii=False))

if __name__ == '__main__': main()
