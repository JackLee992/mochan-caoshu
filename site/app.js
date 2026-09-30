const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const fonts = {
 yu: {name:'于右任標準草書',family:'YuYouren',class:'font-yu',sample:'色不異空，空不異色。',description:'標準草書全量字庫，適合逐字觀察與經文臨賞；生僻字以正體補讀。',source:'你提供的「于右任標準草書」字體包',note:'書體坊字體 · 字體生成示例'},
 longcang: {name:'龍藏草書',family:'LongCang',class:'font-longcang',sample:'心无挂碍，无有恐怖。',description:'筆勢連綿，疏密有致，可作草書風格參照。',source:'Long Cang · 陳小敏',note:'SIL OFL 1.1 · 示例使用簡體字'},
 mashan: {name:'馬善政毛筆體',family:'MaShanZheng',class:'font-mashan',sample:'如是我闻，一时佛在。',description:'渾厚的毛筆手寫書風，便於觀察提按與字形。',source:'Ma Shan Zheng · 馬善政',note:'SIL OFL 1.1 · 示例使用簡體字'},
 serif: {name:'宋體校讀',class:'font-serif',sample:'應無所住，而生其心。',description:'用清晰的正文字形核對草書中的字義與句讀。',source:'裝置內建宋體',note:'閱讀校對用'}
};
const works = [
 {id:'couplet',title:'草書五言聯',subtitle:'原作 · 一九三四年',author:'于右任',museum:'上海博物館藏',accession:'1934 · 依圖像來源記錄',image:'/assets/yu-couplet.jpg',source:'https://commons.wikimedia.org/wiki/File:%E4%BA%8E%E5%8F%B3%E4%BB%BB_%E8%8D%89%E4%B9%A6%E4%BA%94%E8%A8%80%E8%81%94_-%E4%B8%8A%E6%B5%B7%E5%8D%9A%E7%89%A9%E9%A6%86.jpg',description:'先觀兩聯的呼應，再留意字形的收放、長筆的轉折與筆畫之間的留白。',rights:'圖像來源 Wikimedia Commons · PD-Art / PD-China 標示'}
];
const bookInfo = {
 heart: {shortTitle:'心經',label:'般若 · 心經',unit:'章',sourceURL:'https://zh.wikisource.org/zh-hant/般若波羅蜜多心經_(玄奘譯)'},
 diamond: {shortTitle:'金剛經',unit:'分',sourceURL:'https://zh.wikisource.org/zh-hant/金剛般若波羅蜜經_(鳩摩羅什)'},
 daodejing: {shortTitle:'道德經',unit:'章',sourceURL:'https://zh.wikisource.org/zh-hant/道德經_(王弼本)'},
 lunyu: {shortTitle:'論語',unit:'篇',sourceURL:'https://zh.wikisource.org/zh-hant/論語'}
};
const chapterPositions = {};
let content, book='heart', chapter=0, font='yu', grid=false, vertical=true, activeView='reader';
const SIZE_MIN=24, SIZE_MAX=200;
const loadedFonts=new Set(['serif']), fontLoads=new Map();
let fontRequest=0;
function loadFont(key) {
 if(loadedFonts.has(key))return Promise.resolve();
 if(fontLoads.has(key))return fontLoads.get(key);
 const pending=Promise.resolve().then(()=>document.fonts.load(`48px "${fonts[key].family}"`,fonts[key].sample)).then(faces=>{
  if(!faces.length || faces.some(face=>face.status!=='loaded'))throw new Error('字體尚未就緒');
  loadedFonts.add(key);
 }).catch(error=>{fontLoads.delete(key);throw error});
 fontLoads.set(key,pending);
 return pending;
}
function showFontReady() {
 $('#scripture').hidden=false;
 $('#font-status').hidden=true;
 $('.scripture-scroll').setAttribute('aria-busy','false');
 $('#print-button').disabled=false;
}
function prepareReaderFont() {
 const request=++fontRequest, selectedFont=font;
 if(loadedFonts.has(selectedFont)){showFontReady();return}
 $('#scripture').hidden=true;
 $('#font-status').hidden=false;
 $('#font-loading-mark').hidden=false;
 $('#font-loading-message').textContent=fonts[selectedFont].name+'載入中，請稍候…';
 $('#font-retry').hidden=true;
 $('.scripture-scroll').setAttribute('aria-busy','true');
 $('#print-button').disabled=true;
 loadFont(selectedFont).then(()=>{if(request===fontRequest)showFontReady()}).catch(()=>{
  if(request!==fontRequest)return;
  $('#font-loading-mark').hidden=true;
  $('#font-loading-message').textContent='字體暫時未能載入，請點「重新載入」。';
  $('#font-retry').hidden=false;
  $('.scripture-scroll').setAttribute('aria-busy','false');
 });
}
function prepareFontPreviews() {
 $$('[data-preview-font]').forEach(el=>{
  if(el.dataset.previewState==='loading' || el.dataset.previewState==='ready')return;
  const key=el.dataset.previewFont;
  let status=el.previousElementSibling;
  if(!status?.classList.contains('font-preview-status')){
   status=document.createElement('p');
   status.className='font-preview-status'+(el.classList.contains('font-feature-calligraphy')?' featured-preview-status':'');
   status.setAttribute('role','status');
   el.insertAdjacentElement('beforebegin',status);
  }
  status.textContent='字體載入中…';status.hidden=false;el.hidden=true;
  el.dataset.previewState='loading';
  loadFont(key).then(()=>{el.dataset.previewState='ready';el.hidden=false;status.hidden=true}).catch(()=>{
   el.dataset.previewState='error';status.textContent='字體暫未載入，可重新開啟此頁重試。';
  });
 });
}
function setFontSize(value) {
 const size=Math.max(SIZE_MIN,Math.min(SIZE_MAX,Number(value)||48));
 document.documentElement.style.setProperty('--script-size',size+'px');
 document.documentElement.style.setProperty('--grid-rows',Math.max(1,Math.min(6,Math.floor(540/(size*1.8)))));
 $('#font-size').value=size;
 $('#size-value').value=size;
 $('#size-decrease').disabled=size<=SIZE_MIN;
 $('#size-increase').disabled=size>=SIZE_MAX;
 $$('[data-size]').forEach(el=>el.setAttribute('aria-pressed',Number(el.dataset.size)===size));
}
function chooseBook(id) {
 chapterPositions[book]=chapter;
 book=id;
 chapter=chapterPositions[id]||0;
 renderSutra();
}
const escapeHTML = (s) => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const external = (url,label) => `<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)}</a>`;
function setView(view) {
 activeView=view;
 if(view==='fonts')prepareFontPreviews();
 $$('.view').forEach(el=>el.hidden=el.id!==view+'-view');
 $$('.nav-item').forEach(el=>{const active=el.dataset.view===view;el.classList.toggle('active',active);active?el.setAttribute('aria-current','page'):el.removeAttribute('aria-current')});
}
$$('.nav-item').forEach(el=>el.addEventListener('click',()=>setView(el.dataset.view)));
$('.brand').addEventListener('click',e=>{e.preventDefault();setView('reader');window.scrollTo({top:0,behavior:'smooth'})});
$('.footer-brand').addEventListener('click',e=>{e.preventDefault();setView('reader');window.scrollTo({top:0,behavior:'smooth'})});
$('#reader-gallery').addEventListener('click',()=>{setView('gallery');window.scrollTo({top:0,behavior:'smooth'})});
function renderSutra() {
 if(!content || !content[book])return;
 const volume=content[book], info=bookInfo[book];
 const sections=volume.sections;
 const divided=Array.isArray(sections);
 chapter=divided?Math.max(0,Math.min(sections.length-1,chapter)):0;
 const section=divided?sections[chapter]:volume;
 $('#chapter-controls').hidden=!divided;
 if(divided){
  $('#chapter-select').innerHTML=sections.map((s,i)=>`<option value="${i}">${escapeHTML(s.title)}</option>`).join('');
  $('#chapter-select').value=chapter;
  $('#chapter-label').textContent=info.unit==='篇'?'選擇篇目':'選擇章節';
  $('#prev-chapter').textContent='上一'+info.unit;
  $('#next-chapter').textContent='下一'+info.unit;
 }
 $$('.book-card').forEach(el=>{const selected=el.dataset.book===book;el.classList.toggle('selected',selected);el.setAttribute('aria-pressed',selected)});
 $('#sutra-title').textContent=divided?section.title:volume.title;
 $('#sutra-attribution').textContent=volume.attribution;
 $('#book-label').textContent=divided?`${info.shortTitle} · 第 ${chapter+1} / ${sections.length} ${info.unit}`:info.label;
 $('.title-seal').textContent=book==='daodejing'?'道德':book==='lunyu'?'論語':'般若';
 $('#text-count').textContent=section.characterCount+' 字';
 $('#prev-chapter').disabled=chapter===0;
 $('#next-chapter').disabled=!divided || chapter===sections.length-1;
 const scripture=$('#scripture');
 scripture.className=`scripture ${vertical?'vertical':'horizontal'} ${fonts[font].class} ${grid?'grid':''}`;
 if(grid){scripture.innerHTML=[...section.plainText].map(ch=>`<span class="glyph">${escapeHTML(ch)}</span>`).join('')}
 else{scripture.textContent=section.paragraphs.join('\n\n')}
 $('#reader-note').textContent=font==='yu'?'于右任標準草書全量字庫 · 原字庫未收錄的草書以裝置正體補讀。':font==='serif'?'宋體用於校讀字義與句讀；可切換草書對照。':'字體生成示例 · 少數繁體字以裝置內建字體補讀。';
 $('#reading-hint').textContent=grid?'米字格臨賞 · 隱去標點':vertical?'經典直排，從右向左讀':'經典橫排，從左向右讀';
 $('#sutra-source').innerHTML=`${escapeHTML(volume.edition)} · ${external(volume.sourceURL||info.sourceURL,'原文來源')} · 字數不含書名、章目與標點。`;
 prepareReaderFont();
 requestAnimationFrame(()=>{$('.scripture-scroll').scrollLeft=0});
}
$$('.book-card').forEach(el=>el.addEventListener('click',()=>chooseBook(el.dataset.book)));
$('#chapter-select').addEventListener('change',e=>{chapter=Number(e.target.value);renderSutra()});
$('#prev-chapter').addEventListener('click',()=>{chapter=Math.max(0,chapter-1);renderSutra()});
$('#next-chapter').addEventListener('click',()=>{chapter=Math.min(content[book].sections.length-1,chapter+1);renderSutra()});
$('#font-select').addEventListener('change',e=>{font=e.target.value;renderSutra()});
$('#font-size').addEventListener('input',e=>setFontSize(e.target.value));
$('#size-decrease').addEventListener('click',()=>setFontSize(Number($('#font-size').value)-8));
$('#size-increase').addEventListener('click',()=>setFontSize(Number($('#font-size').value)+8));
$$('[data-size]').forEach(el=>el.addEventListener('click',()=>setFontSize(el.dataset.size)));
setFontSize(48);
$('#layout-toggle').addEventListener('click',e=>{vertical=!vertical;e.target.setAttribute('aria-pressed',vertical);e.target.textContent=vertical?'直排':'橫排';renderSutra()});
$('#grid-toggle').addEventListener('click',e=>{grid=!grid;e.target.setAttribute('aria-pressed',grid);renderSutra()});
$('#print-button').disabled=true;
$('#print-button').addEventListener('click',()=>window.print());
$('#font-retry').addEventListener('click',()=>location.reload());
function imageMarkup(work,className='') {
 return `<img class="${className}" src="${work.image}" alt="于右任《${escapeHTML(work.title)}》草書原作全幅" loading="lazy">`;
}
function renderGallery() {
 const featured=works[0];
 $('#gallery-view').innerHTML=`<div class="section-heading"><div><span class="eyebrow">名家字帖</span><h1>觀字形，賞行氣。</h1></div><p>于右任原作 · 經卷與筆墨相照</p></div>
 <div class="gallery-intro"><span class="gallery-index">一 幅 · 原 作</span><div><h2>于右任</h2><p>以標準草書為徑，從一字一畫讀懂筆勢。</p></div><span class="gallery-sideword">筆墨<br>有境</span></div>
 <div class="original-showcase"><button class="work-card featured-work" data-work="${works[0].id}" aria-label="放大欣賞于右任草書五言聯"><div class="art-mount">${imageMarkup(works[0])}<span class="art-corner">原作</span><span class="zoom-label">放大臨賞</span></div></button><div class="original-description"><span class="eyebrow">${works[0].subtitle}</span><h2>草書五言聯</h2><p class="original-meta">于右任 · 上海博物館藏<br>依 Wikimedia Commons 圖像記錄</p><div class="original-divider"></div><p>${works[0].description}</p><button class="primary-button" data-work="${works[0].id}">放大原作</button><p class="source-note">${external(works[0].source,'原圖與來源記錄')}</p><div class="collection-links"><h3>延伸館藏欣賞</h3>${external('https://digitalarchive.npm.gov.tw/Collection/Detail/31423?dep=P','寧靜以致遠 · 草書軸')}${external('https://digitalarchive.npm.gov.tw/Collection/Detail/18301?dep=P','君子所性 · 草書軸')}${external('https://digitalarchive.npm.gov.tw/Collection/Detail/18302?dep=P','雪浪上人詩 · 草書軸')}<small>國立故宮博物院 · 前往館藏頁面</small></div></div></div>
 <div class="study-note"><span class="small-seal">觀</span><div><h3>先看全幅，再觀一字。</h3><p>點開字帖後可放大原圖，細看結字、連筆與留白；畫面保留作品全幅。</p></div></div>
 <div class="reference-row"><div><span class="eyebrow">心經原作參考</span><h3>于右任《心經》</h3><p>另有草書《心經》研究圖版與行書六屏拍品記錄，可前往來源欣賞。</p></div><div class="reference-links">${external('https://cart.ntua.edu.tw/uploads/root/03%E6%B8%B8%E6%83%A0%E9%9B%85%EF%BC%9A%E5%BC%B5%E6%97%AD%E3%80%81%E5%90%B3%E9%8E%AE%E3%80%81%E4%BA%8E%E5%8F%B3%E4%BB%BB%E8%8D%89%E6%9B%B8%E5%BF%83%E7%B6%93%E4%B9%8B%E6%AF%94%E8%BC%83%2034.pdf','草書心經研究圖版')}${external('https://www.christies.com/en/lot/lot-6147146','行書心經六屏記錄')}</div></div>
 <p class="source-note">原作照片來源：Wikimedia Commons，頁面標示 PD-Art / PD-China。年代與藏館依圖像來源記錄。</p>`;
 $$('[data-work]').forEach(el=>el.addEventListener('click',()=>openWork(el.dataset.work)));
}
function openWork(id) {
 const w=works.find(x=>x.id===id);if(!w)return;
 $('#art-detail').innerHTML=`<div class="art-detail-heading"><span class="eyebrow">于右任 · ${w.subtitle}</span><h2>${w.title}</h2><p>${w.museum} · ${w.accession}</p></div><div class="art-zoom-controls"><label for="art-zoom">觀圖大小</label><input id="art-zoom" type="range" min="100" max="250" value="100"><output id="zoom-value">100%</output></div><div class="art-viewport" tabindex="0" aria-label="原作放大檢視區，可捲動觀看"><div class="art-image-wrap">${imageMarkup(w,'detail-image')}</div></div><p class="art-study">${w.description}</p><p class="source-note">${w.rights} · ${external(w.source,'查看原圖來源記錄')}</p>`;
 $('#art-zoom').addEventListener('input',e=>{$('.art-image-wrap').style.width=e.target.value+'%';$('#zoom-value').value=e.target.value+'%'});
 $('#art-dialog').showModal();
}
function renderFonts() {
 $('#fonts-view').innerHTML=`<div class="section-heading"><div><span class="eyebrow">書體雅集</span><h1>一字一畫，各有筆意。</h1></div><p>選一種書體，回到經卷慢讀。</p></div><div class="font-feature"><span class="font-feature-tag">你提供的字體</span><div class="font-feature-preview"><div class="font-feature-calligraphy font-yu" data-preview-font="yu" hidden>心無罣礙</div></div><div><span class="eyebrow">標準草書</span><h2>于右任標準草書</h2><p>以全量字庫臨賞佛典與國學經典，<br>逐字觀察結體，生僻字以正體補讀。</p><button class="primary-button" data-use-font="yu">以此書體讀經</button></div></div><div class="font-grid">${Object.entries(fonts).filter(([k])=>k!=='yu').map(([key,f])=>`<article class="font-card"><span class="eyebrow">${f.name}</span><p class="font-sample ${f.class}" data-preview-font="${key}"${key==='serif'?'':' hidden'}>${f.sample}</p><p>${f.description}</p><small>${f.note}</small><button data-use-font="${key}">用此書體臨賞</button></article>`).join('')}</div><div class="study-note"><span class="small-seal">辨</span><div><h3>字體與原作，各有所觀。</h3><p>字體展示固定字形，便於臨摹；原作則能呈現落筆、墨色和通篇行氣。于右任標準草書使用你提供字體包的全量字庫；原字庫缺少對應草書的字，以裝置正體補讀。龍藏、馬善政為不同書體。</p></div></div>`;
 $$('[data-use-font]').forEach(el=>el.addEventListener('click',()=>{font=el.dataset.useFont;$('#font-select').value=font;renderSutra();setView('reader');window.scrollTo({top:0,behavior:'smooth'})}));
}
function renderSources() {
 $('#sources-detail').innerHTML=`<span class="eyebrow">內容與來源</span><h2>展卷有據，觀字有本。</h2><h3>經典原文</h3><p>《心經》採玄奘譯通行本，正文與咒語合計二百六十字。《金剛經》採鳩摩羅什譯、江味農校定流通本，依三十二分閱讀；分目為後世通行編排。</p><p>${external('https://zh.wikisource.org/zh-hant/般若波羅蜜多心經_(玄奘譯)','維基文庫 · 心經')}<br>${external('https://zh.wikisource.org/zh-hant/金剛般若波羅蜜經_(鳩摩羅什)','維基文庫 · 金剛經')}</p><div id="classics-sources"></div><h3>原作圖像</h3><p>《草書五言聯》原作照片來自 Wikimedia Commons，來源記錄標示于右任、一九三四年、上海博物館藏。圖片頁面採 PD-Art / PD-China 標示；這不代表全球商業授權已核清。本站另提供國立故宮博物院館藏連結供延伸欣賞。</p><ul>${works.map(w=>`<li>${external(w.source,w.title)} · ${w.accession}</li>`).join('')}</ul><h3>書體</h3><p>「于右任標準草書」為你提供的書體坊字體包；網站目前僅供你私人使用。字體包未附商業授權文件，若日後公開或商用，應先確認字體授權範圍。</p><p>龍藏草書（Long Cang）與馬善政毛筆體（Ma Shan Zheng）採 SIL Open Font License 1.1；它們並非于右任書體。少數未收錄的繁體字會以裝置字體補讀。</p><p>${external('https://github.com/google/fonts/tree/main/ofl/longcang','龍藏字體與授權')}<br>${external('https://github.com/google/fonts/tree/main/ofl/mashanzheng','馬善政字體與授權')}</p>`;
}
$('#sources-button').addEventListener('click',()=>$('#sources-dialog').showModal());
$$('dialog .dialog-close').forEach(el=>el.addEventListener('click',()=>el.closest('dialog').close()));
$$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}));
renderGallery();renderFonts();renderSources();
fetch('/content.json').then(r=>{if(!r.ok)throw new Error('經文載入失敗');return r.json()}).then(data=>{content=data;
 $('#classics-sources').innerHTML=['daodejing','lunyu'].filter(id=>content[id]).map(id=>{const v=content[id];return `<h3>${escapeHTML(bookInfo[id].shortTitle)}</h3><p>${escapeHTML(v.edition)} · 全文 ${v.sections.length} ${bookInfo[id].unit}。${v.editionNote?escapeHTML(v.editionNote):''}</p><p>${external(v.sourceURL||bookInfo[id].sourceURL,'查看原文與版本')}</p>`}).join('');
 renderSutra()}).catch(()=>{$$('.book-card').filter(el=>el.dataset.book!=='heart').forEach(el=>el.disabled=true);$('#reader-note').textContent='經卷暫時無法載入，請重新整理。';$('#font-loading-mark').hidden=true;$('#font-loading-message').textContent='經典暫時未能載入，請點「重新載入」。';$('#font-retry').hidden=false;$('.scripture-scroll').setAttribute('aria-busy','false');});
