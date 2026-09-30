const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const fonts = {
 yu: {name:'于右任標準草書',class:'font-yu',sample:'色不異空，空不異色。',description:'標準草書的字形，適合逐字觀察與經文臨賞。',source:'你提供的「于右任標準草書」字體包',note:'書體坊字體 · 字體生成示例'},
 longcang: {name:'龍藏草書',class:'font-longcang',sample:'心无挂碍，无有恐怖。',description:'筆勢連綿，疏密有致，可作草書風格參照。',source:'Long Cang · 陳小敏',note:'SIL OFL 1.1 · 示例使用簡體字'},
 mashan: {name:'馬善政毛筆體',class:'font-mashan',sample:'如是我闻，一时佛在。',description:'渾厚的毛筆手寫書風，便於觀察提按與字形。',source:'Ma Shan Zheng · 馬善政',note:'SIL OFL 1.1 · 示例使用簡體字'},
 serif: {name:'宋體校讀',class:'font-serif',sample:'應無所住，而生其心。',description:'用清晰的正文字形核對草書中的字義與句讀。',source:'裝置內建宋體',note:'閱讀校對用'}
};
const works = [
 {id:'couplet',title:'草書五言聯',subtitle:'原作 · 一九三四年',author:'于右任',museum:'上海博物館藏',accession:'1934 · 依圖像來源記錄',image:'/assets/yu-couplet.jpg',source:'https://commons.wikimedia.org/wiki/File:%E4%BA%8E%E5%8F%B3%E4%BB%BB_%E8%8D%89%E4%B9%A6%E4%BA%94%E8%A8%80%E8%81%94_-%E4%B8%8A%E6%B5%B7%E5%8D%9A%E7%89%A9%E9%A6%86.jpg',description:'先觀兩聯的呼應，再留意字形的收放、長筆的轉折與筆畫之間的留白。',rights:'圖像來源 Wikimedia Commons · PD-Art / PD-China 標示'}
];
let content, book='heart', chapter=0, font='yu', grid=false, vertical=true, activeView='reader';
const escapeHTML = (s) => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const external = (url,label) => `<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)}</a>`;
function setView(view) {
 activeView=view;
 $$('.view').forEach(el=>el.hidden=el.id!==view+'-view');
 $$('.nav-item').forEach(el=>{const active=el.dataset.view===view;el.classList.toggle('active',active);active?el.setAttribute('aria-current','page'):el.removeAttribute('aria-current')});
}
$$('.nav-item').forEach(el=>el.addEventListener('click',()=>setView(el.dataset.view)));
$('.brand').addEventListener('click',e=>{e.preventDefault();setView('reader');window.scrollTo({top:0,behavior:'smooth'})});
$('.footer-brand').addEventListener('click',e=>{e.preventDefault();setView('reader');window.scrollTo({top:0,behavior:'smooth'})});
$('#reader-gallery').addEventListener('click',()=>{setView('gallery');window.scrollTo({top:0,behavior:'smooth'})});
function renderSutra() {
 if(!content)return;
 const volume=content[book];
 const section=book==='heart'?volume:volume.sections[chapter];
 $('#chapter-controls').hidden=book==='heart';
 $$('.book-card').forEach(el=>{const selected=el.dataset.book===book;el.classList.toggle('selected',selected);el.setAttribute('aria-pressed',selected)});
 $('#sutra-title').textContent=book==='heart'?volume.title:section.title;
 $('#sutra-attribution').textContent=volume.attribution;
 $('#book-label').textContent=book==='heart'?'般若 · 心經':`金剛經 · 第 ${chapter+1} / 32 分`;
 $('#text-count').textContent=section.characterCount+' 字';
 $('#prev-chapter').disabled=chapter===0;
 $('#next-chapter').disabled=chapter===31;
 $('#chapter-select').value=chapter;
 const scripture=$('#scripture');
 scripture.className=`scripture ${vertical?'vertical':'horizontal'} ${fonts[font].class} ${grid?'grid':''}`;
 if(grid){scripture.innerHTML=[...section.plainText].map(ch=>`<span class="glyph">${escapeHTML(ch)}</span>`).join('')}
 else{scripture.textContent=section.paragraphs.join('\n\n')}
 $('#reader-note').textContent=font==='yu'?'于右任標準草書字體生成 · 名家原作另見「名家字帖」。':font==='serif'?'宋體用於校讀字義與句讀；可切換草書對照。':'字體生成示例 · 少數繁體字以裝置內建字體補讀。';
 $('#reading-hint').textContent=grid?'米字格臨賞 · 隱去標點':vertical?'經卷直排，從右向左讀':'經文橫排，從左向右讀';
 const url=book==='heart'?'https://zh.wikisource.org/zh-hant/般若波羅蜜多心經_(玄奘譯)':'https://zh.wikisource.org/zh-hant/金剛般若波羅蜜經_(鳩摩羅什)';
 $('#sutra-source').innerHTML=`${escapeHTML(volume.edition)} · ${external(url,'經文來源')} · 字數不含經題、分目與標點。`;
 requestAnimationFrame(()=>{$('.scripture-scroll').scrollLeft=0});
}
$$('.book-card').forEach(el=>el.addEventListener('click',()=>{book=el.dataset.book;renderSutra()}));
$('#chapter-select').addEventListener('change',e=>{chapter=Number(e.target.value);renderSutra()});
$('#prev-chapter').addEventListener('click',()=>{chapter=Math.max(0,chapter-1);renderSutra()});
$('#next-chapter').addEventListener('click',()=>{chapter=Math.min(31,chapter+1);renderSutra()});
$('#font-select').addEventListener('change',e=>{font=e.target.value;renderSutra()});
$('#font-size').addEventListener('input',e=>{document.documentElement.style.setProperty('--script-size',e.target.value+'px');$('#size-value').value=e.target.value});
$('#layout-toggle').addEventListener('click',e=>{vertical=!vertical;e.target.setAttribute('aria-pressed',vertical);e.target.textContent=vertical?'直排':'橫排';renderSutra()});
$('#grid-toggle').addEventListener('click',e=>{grid=!grid;e.target.setAttribute('aria-pressed',grid);renderSutra()});
$('#print-button').addEventListener('click',()=>window.print());
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
 $('#fonts-view').innerHTML=`<div class="section-heading"><div><span class="eyebrow">書體雅集</span><h1>一字一畫，各有筆意。</h1></div><p>選一種書體，回到經卷慢讀。</p></div><div class="font-feature"><span class="font-feature-tag">你提供的字體</span><div class="font-feature-calligraphy font-yu">心無罣礙</div><div><span class="eyebrow">標準草書</span><h2>于右任標準草書</h2><p>以字體生成《心經》《金剛經》，<br>逐字觀察結體，與清晰正文對讀。</p><button class="primary-button" data-use-font="yu">以此書體讀經</button></div></div><div class="font-grid">${Object.entries(fonts).filter(([k])=>k!=='yu').map(([key,f])=>`<article class="font-card"><span class="eyebrow">${f.name}</span><p class="font-sample ${f.class}">${f.sample}</p><p>${f.description}</p><small>${f.note}</small><button data-use-font="${key}">用此書體臨賞</button></article>`).join('')}</div><div class="study-note"><span class="small-seal">辨</span><div><h3>字體與原作，各有所觀。</h3><p>字體展示固定字形，便於臨摹；原作則能呈現落筆、墨色和通篇行氣。于右任標準草書來自你提供的字體包；龍藏、馬善政為不同書體。</p></div></div>`;
 $$('[data-use-font]').forEach(el=>el.addEventListener('click',()=>{font=el.dataset.useFont;$('#font-select').value=font;renderSutra();setView('reader');window.scrollTo({top:0,behavior:'smooth'})}));
}
function renderSources() {
 $('#sources-detail').innerHTML=`<span class="eyebrow">內容與來源</span><h2>展卷有據，觀字有本。</h2><h3>經文</h3><p>《心經》採玄奘譯通行本，正文與咒語合計二百六十字。《金剛經》採鳩摩羅什譯、江味農校定流通本，依三十二分閱讀；分目為後世通行編排。</p><p>${external('https://zh.wikisource.org/zh-hant/般若波羅蜜多心經_(玄奘譯)','維基文庫 · 心經')}<br>${external('https://zh.wikisource.org/zh-hant/金剛般若波羅蜜經_(鳩摩羅什)','維基文庫 · 金剛經')}</p><h3>原作圖像</h3><p>《草書五言聯》原作照片來自 Wikimedia Commons，來源記錄標示于右任、一九三四年、上海博物館藏。圖片頁面採 PD-Art / PD-China 標示；這不代表全球商業授權已核清。本站另提供國立故宮博物院館藏連結供延伸欣賞。</p><ul>${works.map(w=>`<li>${external(w.source,w.title)} · ${w.accession}</li>`).join('')}</ul><h3>書體</h3><p>「于右任標準草書」為你提供的書體坊字體包；網站目前僅供你私人使用。字體包未附商業授權文件，若日後公開或商用，應先確認字體授權範圍。</p><p>龍藏草書（Long Cang）與馬善政毛筆體（Ma Shan Zheng）採 SIL Open Font License 1.1；它們並非于右任書體。少數未收錄的繁體字會以裝置字體補讀。</p><p>${external('https://github.com/google/fonts/tree/main/ofl/longcang','龍藏字體與授權')}<br>${external('https://github.com/google/fonts/tree/main/ofl/mashanzheng','馬善政字體與授權')}</p>`;
}
$('#sources-button').addEventListener('click',()=>$('#sources-dialog').showModal());
$$('dialog .dialog-close').forEach(el=>el.addEventListener('click',()=>el.closest('dialog').close()));
$$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}));
renderGallery();renderFonts();renderSources();
fetch('/content.json').then(r=>{if(!r.ok)throw new Error('經文載入失敗');return r.json()}).then(data=>{content=data;$('#chapter-select').innerHTML=content.diamond.sections.map((s,i)=>`<option value="${i}">${s.title}</option>`).join('');renderSutra()}).catch(()=>{$$('[data-book="diamond"]').forEach(el=>el.disabled=true);$('#reader-note').textContent='經卷暫時無法載入，請重新整理。';});
