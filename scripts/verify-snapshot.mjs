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
    for (const match of data.toString('utf8').matchAll(/["'(](\/(?!\/)[^"'()\s<>]+\.(?:css|js|json|svg|jpg|png|webp|woff2?|ttf|otf))["')]/g)) {
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
if (!content.heart || content.diamond?.sections?.length !== 32) {
  throw new Error('Expected scripture data was not found.');
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
  scriptSyntax: 'valid',
}, null, 2));
