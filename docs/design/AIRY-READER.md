# 墨禪 · 疏朗書卷設計

Generated with the built-in ImageGen tool. Desktop reference: airy-reader-desktop.png (1448 × 1086); mobile reference: airy-reader-mobile.png (747 × 2106). These are design references, never served as UI.

## Brief / prompt
Redesign the existing Chinese calligraphy reader into an airy scholarly reading room. Preserve 墨禪, 經卷臨賞 / 名家字帖 / 書體雅集, the four books and every reader control. Use open book navigation with a thin vermilion selection line, pale paper, readable Song headings, 18px controls with 48px targets, generous whitespace, large vertical calligraphy. Remove heavy dark bands, boxed books and deep shadows. Move chapter selection above the paper. On mobile, keep all four titles in one open horizontal row and stack controls. Do not add decorative illustrations, fake art or new product areas.

## Design system before implementation
- Color lock: warm off-white page #f8f7f2, near-white paper #fffefa, dark green ink #283b34, secondary #626d65, fine line #deded5, vermilion #98483b. No gradient or photo overlay.
- Layout: quiet header; desktop open left rail with intro and four books, fine vertical divider, open controls and unframed reading paper right. Mobile full-width intro, four text tabs, stacked controls, then paper.
- Spacing: 8 / 12 / 16 / 24 / 32 / 48px; desktop 4.5vw outer gutter, 28–32px column gap.
- Type: existing Songti SC serif for headings, PingFang TC for controls; main heading 30–32px, books 28px, nav/control 18px, metadata 14–16px. Reader remains adjustable 24–200px.
- Motifs: existing square 墨 seal, thin red book selection stroke, fine paper top/bottom rules, ample blank space. Existing code-native brand retained without redrawing a raster logo.
- Controls: square fine-border 48px buttons; selected state red border/text plus subtle warm tint; dark visible focus outline. Native select arrows; no new icon family. Loading spinner unchanged.
- Scope: static HTML app shell, existing app.js readers/gallery/typeface templates and state, shared CSS visual system. Full-font loading and retry, original image asset, text provenance and unpunctuated rendering unchanged.
- Allowed first-screen copy: existing brand, navigation, heading and supporting sentence, four book titles/metadata, font/size/layout/chapter labels and existing control labels, current chapter/book/attribution, paper reading hint. No extra marketing copy.

## Intentional practical differences from generated concept
- Retain the working size slider, numerical size output and 臨摹大字 preset omitted by ImageGen. Controls wrap at intermediate widths to retain 48px targets.
- Header nav moves to a second line on phones so all three 18px labels remain legible.
- Real YuYouren glyphs and source text determine the calligraphy, not the mockup's approximate generated lettering. Default remains Heart Sutra at 48px; reference comparison uses Dao chapter 1 at 96px.
- Source details remain below the paper in a full readable row; selected chapter retains complete title.
- Gallery/font views extend the same light paper, open dividers and existing content, with no new assets or features.

## Verification ledger
Compared the desktop concept and final browser full-page screenshot using `view_image` at a 1448 × 1086 desktop viewport. Also compared the mobile concept and browser screenshot at 390 × 844. IAB was available, so no Playwright Chromium fallback was needed.

| Point | Concept / render finding | Resolution |
| --- | --- | --- |
| Palette | Off-white page and near-white paper, dark ink and vermilion | Matches locked tokens; no dark toolbar or new image overlay |
| Composition | Open left book rail and reading canvas right | Implemented; mobile switches to four open title tabs |
| Typography | Song headings and large readable control text | All main controls 18px and measured 49px tall; tiny mobile nav in generated concept intentionally expanded |
| Containers | Fine rules, no book boxes, no paper shadow | Implemented throughout reader; font cards also become open ruled columns |
| Calligraphy | Large vertical ink columns, generous paper | Real 96px YuYouren rather than image lettering; 200px checked in both layouts |
| Responsive | Mobile stacked controls and four visible books | 320, 390, 700, 740, 768, 1024, 1280 widths tested without document overflow |
| Supporting pages | Same paper and ink language | Fixed four-character mobile sample wrapping by increasing its height; gallery index kept on one line |
| Copy | Existing nav, four books, title, control labels and source information | Removed redundant reader eyebrow/visible book prompt as shown in concept; kept accessible book-group label. Added 排版 from concept. No invented marketing copy |

Core flow checked: four books, 32/81/20 chapter choices, first/last disabled buttons, restoring the previous chapter after switching books, font sample -> reading, YuYouren/LongCang loading completion, 96/200px, both layouts and grid, original artwork dialog and 200% zoom. No browser warning/error log entries. app.js, content.json, all fonts and original photograph unchanged, preserving prior loading/error and full-text audits.

Intentional functional differences: slider/numeric output/160px preset retained; mobile navigation uses a second header row; chapter controls share a compact mobile row; chapter title and source metadata use actual data. Original-art link/source row remain below the paper rather than squeezed into the mockup footer. No unresolved material visual mismatch against this adapted design.


Production was separately checked at 1280px desktop and 390px mobile. Its screenshots are `../evidence/images/airy-design-live.jpg` and `../evidence/images/airy-design-mobile-live.jpg`; the latest production screenshot and original concept were inspected again with view_image before handoff.
