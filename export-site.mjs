import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { promisify } from 'node:util';

const run = promisify(execFile);
const origin = 'https://mochan-caoshu.s419505080.chatgpt.site';
const output = resolve(import.meta.dirname, 'site');
const files = [
  ['/', 'index.html'],
  ['/style.css', 'style.css'],
  ['/app.js', 'app.js'],
  ['/content.json', 'content.json'],
  ['/assets/favicon.svg', 'assets/favicon.svg'],
  ['/assets/YuYouren.woff2', 'assets/YuYouren.woff2'],
  ['/assets/LongCang.woff2', 'assets/LongCang.woff2'],
  ['/assets/MaShanZheng.woff2', 'assets/MaShanZheng.woff2'],
  ['/assets/yu-couplet.jpg', 'assets/yu-couplet.jpg'],
];

// Use a fresh directory so an existing export can never be overwritten.
await mkdir(output);
await mkdir(resolve(output, 'assets'));

const records = await Promise.all(files.map(async ([requestPath, localPath]) => {
  const url = origin + requestPath;
  const { stdout } = await run('curl', [
    '--fail', '--silent', '--show-error', '--location', '--max-time', '45', '--', url,
  ], { encoding: 'buffer', maxBuffer: 32 * 1024 * 1024 });
  if (!stdout.length) throw new Error(`Empty response: ${requestPath}`);
  let data = stdout;
  let removedHostingScripts = 0;
  if (localPath === 'index.html') {
    const html = stdout.toString('utf8');
    if (!html.includes('墨禪') || !html.includes('id="reader-view"')) {
      throw new Error('The response is not the expected site HTML.');
    }
    data = Buffer.from(html.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, tag => {
      if (tag.includes('__CF$cv$params') && tag.includes('/cdn-cgi/challenge-platform/')) {
        removedHostingScripts++;
        return '';
      }
      return tag;
    }));
  }
  if (localPath === 'content.json') {
    const content = JSON.parse(data.toString('utf8'));
    if (!content.heart || content.diamond?.sections?.length !== 32) {
      throw new Error('The expected scripture data is incomplete.');
    }
  }
  if (localPath.endsWith('.woff2') && data.subarray(0, 4).toString() !== 'wOF2') {
    throw new Error(`Unexpected font response: ${localPath}`);
  }
  if (localPath.endsWith('.jpg') && data.subarray(0, 2).toString('hex') !== 'ffd8') {
    throw new Error(`Unexpected image response: ${localPath}`);
  }
  await writeFile(resolve(output, localPath), data, { flag: 'wx' });
  return {
    path: localPath,
    source: url,
    bytes: data.length,
    sha256: createHash('sha256').update(data).digest('hex'),
    sourceSha256: createHash('sha256').update(stdout).digest('hex'),
    removedHostingScripts,
  };
}));

await writeFile(resolve(import.meta.dirname, 'manifest.json'), JSON.stringify({
  source: origin,
  exportedAt: new Date().toISOString(),
  note: 'Public static deployment snapshot; not a Git history export. Only hosting-injected Cloudflare challenge scripts were removed.',
  files: records,
}, null, 2) + '\n', { flag: 'wx' });

console.log(JSON.stringify({
  directory: relative(process.cwd(), output),
  files: records.length,
  totalBytes: records.reduce((total, item) => total + item.bytes, 0),
  removedHostingScripts: records.reduce((total, item) => total + item.removedHostingScripts, 0),
}, null, 2));
