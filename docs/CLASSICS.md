# 经典正文、来源与字体处理

本页记录内容版本和再生成方法；发布状态及操作见 [NETLIFY.md](NETLIFY.md)。

## 收录范围

| 经典 | 当前版本 | 正文字数 | 结构 |
| --- | --- | ---: | --- |
| 心经 | 玄奘译通行本 | 260 | 正文及咒语 |
| 金刚经 | 江味农校定流通本 | 5179 | 32 分 |
| 道德经 | 王弼本，仅收经文 | 5297 | 81 章 |
| 论语 | 维基文库繁体整理本 | 15929 | 20 篇、501 章段 |

字数不含经题、篇章标题、译者署名、标点或空白。心经的 260 字包含咒语；既有心经和金刚经正文保持原版本。各书实际正文、分段、字数说明和来源记录集中在 `site/content.json`。

## 道德经

采用[维基文库《道德经（王弼本）》固定修订 2354026](https://zh.wikisource.org/w/index.php?title=道德經_(王弼本)&oldid=2354026)，所载华亭张氏原本。只提取 81 章经文，保留来源标点和正文段落，排除王弼注、跋及《经典释文》。不与帛书、郭店楚简或其他传本混称同一逐字版本。

原始维基文本 SHA-256：`4827e5a84b37fdeaa99706b7505b3719b5eb40e2da8e7b8a0a499944051af611`。导入时恢复繁简自动转换的 4 处字形：第 19、64 章「慾」还原「欲」，第 27 章「跡」还原「迹」，第 60 章「蒞」还原「莅」。脚本独立比对原始维基文本，检查 81 章正文汉字逐字一致，同时检查首末章与非空章节。

## 论语

只收通行二十篇，从《学而》至《尧曰》，保留繁体、古籍异体字、标点和章段；不收现代译文、校勘记、註疏链接、悬浮异文说明、导航，以及目录另列的后补《知道第二十二》。每篇固定来源如下；对应源页 HTML 的 SHA-256 保存在 `site/content.json` 的 `sources` 中。

| 篇名 | 维基文库固定修订 |
| --- | --- |
| 學而第一 | [2058123](https://zh.wikisource.org/w/index.php?title=%E8%AB%96%E8%AA%9E%2F%E5%AD%B8%E8%80%8C%E7%AC%AC%E4%B8%80&oldid=2058123) |
| 為政第二 | [2058121](https://zh.wikisource.org/w/index.php?title=%E8%AB%96%E8%AA%9E%2F%E7%88%B2%E6%94%BF%E7%AC%AC%E4%BA%8C&oldid=2058121) |
| 八佾第三 | [2200702](https://zh.wikisource.org/w/index.php?title=%E8%AB%96%E8%AA%9E%2F%E5%85%AB%E4%BD%BE%E7%AC%AC%E4%B8%89&oldid=2200702) |
| 里仁第四 | [2177314](https://zh.wikisource.org/w/index.php?title=%E8%AB%96%E8%AA%9E%2F%E9%87%8C%E4%BB%81%E7%AC%AC%E5%9B%9B&oldid=2177314) |
| 公冶長第五 | [973596](https://zh.wikisource.org/w/index.php?title=%E8%AB%96%E8%AA%9E%2F%E5%85%AC%E5%86%B6%E9%95%B7%E7%AC%AC%E4%BA%94&oldid=973596) |
| 雍也第六 | [10602494](https://zh.wikisource.org/w/index.php?title=%E8%AB%96%E8%AA%9E%2F%E9%9B%8D%E4%B9%9F%E7%AC%AC%E5%85%AD&oldid=10602494) |
| 述而第七 | [10602118](https://zh.wikisource.org/w/index.php?title=%E8%AB%96%E8%AA%9E%2F%E8%BF%B0%E8%80%8C%E7%AC%AC%E4%B8%83&oldid=10602118) |
| 泰伯第八 | [2120928](https://zh.wikisource.org/w/index.php?title=%E8%AB%96%E8%AA%9E%2F%E6%B3%B0%E4%BC%AF%E7%AC%AC%E5%85%AB&oldid=2120928) |
| 子罕第九 | [2018157](https://zh.wikisource.org/w/index.php?title=%E8%AB%96%E8%AA%9E%2F%E5%AD%90%E7%BD%95%E7%AC%AC%E4%B9%9D&oldid=2018157) |
| 鄉黨第十 | [1956464](https://zh.wikisource.org/w/index.php?title=%E8%AB%96%E8%AA%9E%2F%E9%84%89%E9%BB%A8%E7%AC%AC%E5%8D%81&oldid=1956464) |
| 先進第十一 | [10602404](https://zh.wikisource.org/w/index.php?title=%E8%AB%96%E8%AA%9E%2F%E5%85%88%E9%80%B2%E7%AC%AC%E5%8D%81%E4%B8%80&oldid=10602404) |
| 顏淵第十二 | [10602324](https://zh.wikisource.org/w/index.php?title=%E8%AB%96%E8%AA%9E%2F%E9%A1%8F%E6%B7%B5%E7%AC%AC%E5%8D%81%E4%BA%8C&oldid=10602324) |
| 子路第十三 | [1956460](https://zh.wikisource.org/w/index.php?title=%E8%AB%96%E8%AA%9E%2F%E5%AD%90%E8%B7%AF%E7%AC%AC%E5%8D%81%E4%B8%89&oldid=1956460) |
| 憲問第十四 | [10602030](https://zh.wikisource.org/w/index.php?title=%E8%AB%96%E8%AA%9E%2F%E6%86%B2%E5%95%8F%E7%AC%AC%E5%8D%81%E5%9B%9B&oldid=10602030) |
| 衞靈公第十五 | [2058122](https://zh.wikisource.org/w/index.php?title=%E8%AB%96%E8%AA%9E%2F%E8%A1%9E%E9%9D%88%E5%85%AC%E7%AC%AC%E5%8D%81%E4%BA%94&oldid=2058122) |
| 季氏第十六 | [2178436](https://zh.wikisource.org/w/index.php?title=%E8%AB%96%E8%AA%9E%2F%E5%AD%A3%E6%B0%8F%E7%AC%AC%E5%8D%81%E5%85%AD&oldid=2178436) |
| 陽貨第十七 | [1075085](https://zh.wikisource.org/w/index.php?title=%E8%AB%96%E8%AA%9E%2F%E9%99%BD%E8%B2%A8%E7%AC%AC%E5%8D%81%E4%B8%83&oldid=1075085) |
| 微子第十八 | [1311661](https://zh.wikisource.org/w/index.php?title=%E8%AB%96%E8%AA%9E%2F%E5%BE%AE%E5%AD%90%E7%AC%AC%E5%8D%81%E5%85%AB&oldid=1311661) |
| 子張第十九 | [1075051](https://zh.wikisource.org/w/index.php?title=%E8%AB%96%E8%AA%9E%2F%E5%AD%90%E5%BC%B5%E7%AC%AC%E5%8D%81%E4%B9%9D&oldid=1075051) |
| 堯曰第二十 | [2175814](https://zh.wikisource.org/w/index.php?title=%E8%AB%96%E8%AA%9E%2F%E5%A0%AF%E6%9B%B0%E7%AC%AC%E4%BA%8C%E5%8D%81&oldid=2175814) |

该整理本主文包含三处校订异文，必须随版本说明保留：

- 《里仁》第十四章「未為可知也」，传世本此处为「求」。
- 《季氏》第十一章「隱居以成其志」，传世本此处为「求」。
- 《尧曰》第二章「謂之貪」，传世本此处为「有司」。

因此 15929 字是以上固定来源的字数，不能称为所有《论语》版本的统一字数。古籍正文属公有领域；维基文库的现代整理与编辑文字另依其站点授权，引用时保留来源和固定版本链接。

## 再生成与合并

在仓库根目录运行。两个内容导入脚本仅使用 Python 标准库，需要联网读取固定来源。

```sh
python3 scripts/import-daodejing.py /tmp/mochan-daodejing.json
python3 scripts/import-lunyu.py
```

`import-daodejing.py` 的第一个位置参数是输出文件；省略时也写入 `/tmp/mochan-daodejing.json`。`import-lunyu.py` 无输出参数，固定写入 `/tmp/mochan-lunyu.json`。两者产生独立 JSON（书籍主字段与 `sources`），不会自动修改站点或发布。

重新导入后，将输出中的 `daodejing`、`lunyu` 主字段及来源记录按 `sources.id` 合并到 `site/content.json`，保留现有 `heart`、`diamond` 与其他来源，并保留网页需要的版本摘要字段。核对正文、字数和版本说明，再更新站点快照清单 `manifest.json` 及静态发布 ZIP。之后执行：

```sh
node scripts/verify-snapshot.mjs
```

该命令校验清单哈希、本地资源引用、脚本语法、章节顺序、非空段落和字数；它不会生成清单、打包或发布。完成本地及浏览器验证后，再按发布文档上传新包。

## 于右任字体：映射与实际字形

用户提供的「书体坊于右任标准草书」原 TTF 有 22153 个字符映射。进一步检查发现，其中 10794 个汉字共用「缺」字形作为占位，不能据此宣称这些字具有实际于右任草书字形。先前报告中的「100% 覆盖」只检查了 cmap 存在，不能作为真实字形覆盖的证明。

字体处理保留原 TTF 的全部字符映射与轮廓，转换为网页 WOFF2；不以筛选掉字符的子集冒充全量字库。CSS 的 `@font-face unicode-range` 排除共用占位字形的码位，真正的「缺」（U+7F3A）仍保留于右任字形。对于被排除的罕见字，网页交由设备楷体或衬线正体兜底，呈现正确原文，而不是把原文误显示成「缺」。正文中的这些字不改写、不删去；装置兜底也不应标称于右任草书。


全量转换使用 `scripts/build-yu-font.py`，依赖 FontTools 4.66.0 和 Brotli 1.2.0。在已具备依赖的环境运行：

```sh
python3 scripts/build-yu-font.py --source-zip '/path/to/于右任标准草书.zip' --content site/content.json --output /tmp/YuYouren-full.woff2 --report /tmp/YuYouren-report.json --unicode-range-output /tmp/YuYouren-range.css
```

脚本不提取原TTF到磁盘、不改写源包，不做Unicode子集化；只移除嵌入位图表，并逐一比较全部字形轮廓、横纵排度量、glyph顺序及cmap子表。核查通过后用输出覆盖 `site/assets/YuYouren.woff2`，把生成的 `unicode-range` 属性放到 `style.css` 的于右任字体声明，更新字体URL版本参数、清单和部署ZIP再发布。不要仅复制字体而省略占位过滤。

网页初始正文为空并隐藏，草书加载过程中显示状态提示，字库就绪后再展示原文；下载失败显示重新载入按钮。字号默认48，可调24–200，快捷字号64、96、160；主要阅读操作目标至少48像素高。样例页面同样等待各自字体加载，不以其他字体暂时替代。


## 无标点阅读排版

按用户选择，网页展示的经典正文和书体样例不显示标点。引号、括号、书名号与顿号直接移除；逗号、句号、分号、冒号、问号等停顿标记替换为换行，原段落之间保留空行。支持Unicode标点类别，包括《道德经》来源中的ASCII逗号及小型标点「﹑」「﹕」「﹗」。括号内正文汉字保留，字体不作繁简转换。

直排换列、横排换行；米字格按同一分行逐字排列。`site/content.json` 保留带来源标点的正文，显示转换不改写来源数据。已逐章核对四书共134个显示章节，去标点后的汉字序列与每章 `plainText` 严格一致，字数保持260/5179/5297/15929。
