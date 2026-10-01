import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { Script } from 'node:vm';

const root = resolve(import.meta.dirname, '..');
const site = resolve(root, 'site');
const manifest = JSON.parse(await readFile(resolve(root, 'manifest.json'), 'utf8'));
const paths = new Set(manifest.files.map(file => file.path));
const references = new Set();
let totalBytes = 0;

for (const file of manifest.files) {
  const data = await readFile(resolve(site, file.path));
  const hash = createHash('sha256').update(data).digest('hex');
  if (hash !== file.sha256 || data.length !== file.bytes) {
    throw new Error(`Snapshot mismatch: ${file.path}`);
  }
  totalBytes += data.length;
  if (/\.(html|css|js|json)$/.test(file.path)) {
    for (const match of data.toString('utf8').matchAll(/["'(](\/(?!\/)[^"'()\s<>]+\.(?:css|js|json|svg|jpg|png|webp|woff2?|ttf|otf))(?:\?[^"'()\s<>]*)?["')]/g)) {
      references.add(match[1].slice(1));
    }
  }
}

const diskFiles = (await readdir(site, { recursive: true, withFileTypes: true }))
  .filter(entry => entry.isFile());
if (diskFiles.length !== paths.size) {
  throw new Error('The site directory contains files not listed in the snapshot manifest.');
}
for (const reference of references) {
  if (!paths.has(reference)) throw new Error(`Unbundled resource: ${reference}`);
}
new Script(await readFile(resolve(site, 'app.js'), 'utf8'));
const content = JSON.parse(await readFile(resolve(site, 'content.json'), 'utf8'));
const expectedSections = { diamond: 32, daodejing: 81, lunyu: 20 };
if (!content.heart || content.heart.characterCount !== 260) throw new Error('Heart Sutra data is missing.');
for (const [book, count] of Object.entries(expectedSections)) {
  const volume = content[book];
  if (volume?.sections?.length !== count) throw new Error(`Expected ${count} sections in ${book}.`);
  let characters = 0;
  for (const [index, section] of volume.sections.entries()) {
    if (section.number !== index + 1 || !section.title || !section.paragraphs?.length || section.paragraphs.some(p => !p.trim())) {
      throw new Error(`Empty or misordered section: ${book} ${index + 1}`);
    }
    const plainText = [...section.paragraphs.join('\n').matchAll(/\p{Script=Han}/gu)].map(match => match[0]).join('');
    if (section.plainText !== plainText || section.characterCount !== [...plainText].length) {
      throw new Error(`Text or character-count mismatch: ${book} ${index + 1}`);
    }
    characters += section.characterCount;
  }
  if (volume.characterCount !== characters) throw new Error(`Incomplete volume count: ${book}`);
}
const poem = content.zhengdaoge;
if (!poem || poem.paragraphs?.length !== 64 || poem.characterCount !== 1813) {
  throw new Error('Complete Yongjia Zhengdao Ge data is missing.');
}
const poemPlain = [...poem.paragraphs.join('\n').matchAll(/\p{Script=Han}/gu)].map(match => match[0]).join('');
if (poemPlain !== poem.plainText || [...poemPlain].length !== 1813 ||
    createHash('sha256').update(poemPlain).digest('hex') !== '5d1b2ae70c15c7972f260cbf9274e52ad79c3278a4444dcc3fded73771632755') {
  throw new Error('Yongjia Zhengdao Ge differs from the pinned full source text.');
}
const html = await readFile(resolve(site, 'index.html'), 'utf8');
if (html.includes('__CF$cv$params') || html.includes('/cdn-cgi/challenge-platform/')) {
  throw new Error('Hosting-injected verification script still present.');
}

console.log(JSON.stringify({
  status: 'verified',
  snapshotFiles: paths.size,
  localResourceReferences: references.size,
  totalBytes,
  diamondChapters: content.diamond.sections.length,
  daodejingChapters: content.daodejing.sections.length,
  lunyuBooks: content.lunyu.sections.length,
  zhengdaogeCharacters: poem.characterCount,
  zhengdaogeParagraphs: poem.paragraphs.length,
  scriptSyntax: 'valid',
}, null, 2));
