#!/usr/bin/env node
// gen-sitemap.mjs: build sitemap.xml for a GitHub Pages (Jekyll) site from
// the files that Pages will actually publish, with <lastmod> taken from the
// last git commit that touched each file. No dependencies (Node >= 18).
//
//   node scripts/gen-sitemap.mjs site <name> <repo-path>
//       Writes <repo-path>/<out> for the site <name> from scripts/sitemaps.json.
//   node scripts/gen-sitemap.mjs index <name>=<repo-path> ...
//       Reads each site's generated sitemap and writes docs/sitemap_index.xml
//       (lastmod = newest lastmod in that sitemap) and docs/sitemap.txt
//       (every URL from every sitemap, one per line).
//
// See scripts/README.md for the workflow.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const CONFIG = JSON.parse(readFileSync(join(HERE, 'sitemaps.json'), 'utf8'));
const PAGE_EXT = /\.(html?|md|markdown)$/i;
// Jekyll's own default excludes, plus build/tooling dirs that never publish.
const JEKYLL_EXCLUDES = ['Gemfile', 'Gemfile.lock', 'node_modules', 'vendor/bundle', 'vendor/cache', 'vendor/gems', 'vendor/ruby'];
// Repo meta files: Pages either does not publish them (optional-front-matter
// skips README/LICENSE/... without front matter) or they are not content.
const META_NAMES = /^(readme|license|licence|copying|changelog|contributing|code_of_conduct|security|agents|claude|issue_template|pull_request_template)$/i;

function die(msg) { console.error(`gen-sitemap: ${msg}`); process.exit(1); }

function git(repo, args) {
  return execFileSync('git', ['-C', repo, '-c', 'core.quotePath=false', ...args], { encoding: 'utf8', maxBuffer: 256 << 20 });
}

// Glob -> RegExp, anchored at the site source like Jekyll's `exclude` and
// `defaults.scope.path`: a pattern also matches everything below a directory
// it names. `**` crosses "/". With jekyllStar, `*` crosses "/" too (Ruby
// File.fnmatch without FNM_PATHNAME, which is what Jekyll uses for exclude).
function globRe(glob, jekyllStar) {
  const g = glob.replace(/^\.?\//, '').replace(/\/$/, '');
  let re = '';
  for (let i = 0; i < g.length; i++) {
    const c = g[i];
    if (c === '*' && g[i + 1] === '*') { re += '.*'; i++; }
    else if (c === '*') re += jekyllStar ? '.*' : '[^/]*';
    else if (c === '?') re += '[^/]';
    else re += c.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  }
  return new RegExp(`^${re}(?:/.*)?$`);
}
const matcher = (globs, jekyllStar = false) => { const res = globs.map((g) => globRe(g, jekyllStar)); return (p) => res.some((r) => r.test(p)); };

// Minimal reader for the two _config.yml keys that matter here:
//   exclude: [list]           and   defaults: [{scope: {path}, values: {sitemap: false}}]
function readJekyllConfig(file) {
  const out = { exclude: [], noSitemap: [] };
  if (!existsSync(file)) return out;
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
  let section = null; let scopePath = null;
  const unq = (s) => s.trim().replace(/^["']|["']$/g, '');
  for (const line of lines) {
    if (/^\S/.test(line)) { section = line.split(':')[0].trim(); scopePath = null; continue; }
    if (section === 'exclude') { const m = line.match(/^\s*-\s*(.+)$/); if (m) out.exclude.push(unq(m[1])); }
    if (section === 'defaults') {
      if (/^\s*-\s*scope:/.test(line)) scopePath = '';
      const p = line.match(/^\s+path:\s*(.*)$/); if (p) scopePath = unq(p[1]);
      if (/^\s+sitemap:\s*false\s*$/.test(line) && scopePath !== null) out.noSitemap.push(scopePath);
    }
  }
  return out;
}

function fmBlock(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : '';
}

function frontMatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\s*(\r?\n|$)/);
  if (!m) return null;
  const fm = {};
  for (const l of m[1].split(/\r?\n/)) { const kv = l.match(/^([A-Za-z_][\w-]*):\s*(.*)$/); if (kv) fm[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, ''); }
  return fm;
}

// Last commit date (ISO 8601 with offset) for every file under `src`, in one git call.
function lastCommitDates(repo, src) {
  const dates = new Map();
  const log = git(repo, ['log', '--format=%x01%cI', '--name-only', '--no-renames', 'HEAD', '--', src || '.']);
  let cur = null;
  for (const line of log.split('\n')) {
    if (line.startsWith('\x01')) cur = line.slice(1);
    else if (line && cur && !dates.has(line)) dates.set(line, cur);
  }
  return dates;
}

const encodePath = (p) => p.split('/').map(encodeURIComponent).join('/');
const xmlEsc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function buildSite(name, repo) {
  const site = CONFIG.sites[name];
  if (!site) die(`unknown site "${name}" (see scripts/sitemaps.json)`);
  const src = site.src || '';
  const root = join(repo, src);
  const jc = readJekyllConfig(join(root, '_config.yml'));
  const jekyllExcluded = matcher([...JEKYLL_EXCLUDES, ...jc.exclude], true);
  const siteExcluded = matcher(site.exclude || []);
  const isExcluded = (p) => jekyllExcluded(p) || siteExcluded(p);
  const noSitemap = matcher([...jc.noSitemap, ...(site.noSitemap || [])], true);
  const dates = lastCommitDates(repo, src);
  const tracked = git(repo, ['ls-files', '-z', '--', src || '.']).split('\0').filter(Boolean);
  const urls = new Map(); // url -> { lastmod, files[] }
  const vetoed = new Set();
  const skipped = { redirect: 0, noindex: 0, excluded: 0, meta: 0, frontmatter: 0 };
  const today = new Date().toISOString().slice(0, 10);
  const dirsWithIndex = new Set(tracked.map((f) => (src ? posix.relative(src, f) : f))
    .filter((r) => /(^|\/)index\.(html?|md|markdown)$/i.test(r)).map((r) => posix.dirname(r)));

  for (const file of tracked) {
    const rel = src ? posix.relative(src, file) : file;
    if (!PAGE_EXT.test(rel)) continue;
    const segs = rel.split('/');
    if (segs.some((s) => /^[_.#~]/.test(s))) continue; // Jekyll never publishes these
    if (isExcluded(rel)) { skipped.excluded++; continue; }
    if (posix.basename(rel) === '404.html' || noSitemap(rel)) { skipped.excluded++; continue; }
    const abs = join(repo, file);
    if (!existsSync(abs)) continue;
    const text = readFileSync(abs, 'utf8');
    const fm = frontMatter(text);
    const base = posix.basename(rel).replace(PAGE_EXT, '');
    const isMd = /\.(md|markdown)$/i.test(rel);
    let urlPath;
    if (META_NAMES.test(base)) {
      // readme-index: a README becomes the directory index only when no index exists.
      if (/^readme$/i.test(base) && !dirsWithIndex.has(posix.dirname(rel))) urlPath = posix.dirname(rel) === '.' ? '' : `${posix.dirname(rel)}/`;
      else { skipped.meta++; continue; }
    }
    if (urlPath === undefined) {
      if (fm && fm.permalink) urlPath = fm.permalink.replace(/^\//, '');
      else if (/^index$/i.test(base)) urlPath = posix.dirname(rel) === '.' ? '' : `${posix.dirname(rel)}/`;
      else urlPath = isMd ? rel.replace(PAGE_EXT, '.html') : rel;
    }
    const url = site.base + encodePath(urlPath);
    if (fm && (fm.sitemap === 'false' || fm.published === 'false')) { skipped.frontmatter++; continue; }
    // A redirect anywhere behind a URL vetoes it: when a VitePress .html stub
    // and its .md source share a URL, the .html is what Pages serves.
    // Covers <meta http-equiv=refresh>, redirect_to, and VitePress `head:` refresh.
    if ((fm && fm.redirect_to) || /<meta[^>]+http-equiv=["']?refresh/i.test(text) || /^\s*-?\s*http-equiv:\s*["']?refresh/im.test(fmBlock(text))) { skipped.redirect++; vetoed.add(url); continue; }
    if (/<meta[^>]+name=["']robots["'][^>]*noindex/i.test(text)) { skipped.noindex++; vetoed.add(url); continue; }
    let lastmod = dates.get(file);
    if (!lastmod) { console.warn(`gen-sitemap: ${file} has no commit yet; lastmod=${today}`); lastmod = today; }
    // A page that pulls in another file ({% include_relative README.md %})
    // changes when that file does.
    for (const m of text.matchAll(/\{%-?\s*include_relative\s+([^\s%]+)/g)) {
      const inc = dates.get(posix.normalize(posix.join(posix.dirname(file), m[1])));
      if (inc && Date.parse(inc) > Date.parse(lastmod)) lastmod = inc;
    }
    const prev = urls.get(url);
    if (!prev) urls.set(url, { lastmod, files: [rel] });
    else { prev.files.push(rel); if (Date.parse(lastmod) > Date.parse(prev.lastmod)) prev.lastmod = lastmod; }
  }

  for (const u of vetoed) urls.delete(u);
  const sorted = [...urls.entries()].sort(([a], [b]) => (a === site.base ? -1 : b === site.base ? 1 : a.localeCompare(b)));
  const xml = ['<?xml version="1.0" encoding="UTF-8"?>',
    `<!-- Generated by neurons-me.github.io/scripts/gen-sitemap.mjs (site "${name}"). Do not edit by hand. -->`,
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sorted.map(([u, v]) => `  <url><loc>${xmlEsc(u)}</loc><lastmod>${v.lastmod}</lastmod></url>`),
    '</urlset>', ''].join('\n');
  const out = join(repo, site.out);
  writeFileSync(out, xml);
  console.log(`${name}: ${sorted.length} URLs -> ${out} (skipped ${JSON.stringify(skipped)})`);
}

function readSitemap(file) {
  const xml = readFileSync(file, 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, '&'));
  const mods = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);
  const newest = mods.map((d) => ({ d, t: Date.parse(d) })).sort((a, b) => b.t - a.t)[0];
  return { locs, newest: newest ? newest.d : null };
}

function buildIndex(pairs) {
  const repos = Object.fromEntries(pairs.map((p) => { const i = p.indexOf('='); if (i < 0) die(`expected name=path, got ${p}`); return [p.slice(0, i), p.slice(i + 1)]; }));
  const idx = CONFIG.index;
  const entries = []; const all = [];
  for (const name of Object.keys(CONFIG.sites)) {
    const site = CONFIG.sites[name];
    if (!repos[name]) die(`index needs a checkout for every site; missing ${name}=<path>`);
    const sm = readSitemap(join(repos[name], site.out));
    entries.push({ loc: site.base + posix.basename(site.out), lastmod: sm.newest });
    all.push(...sm.locs);
  }
  const indexXml = ['<?xml version="1.0" encoding="UTF-8"?>',
    '<!-- Generated by scripts/gen-sitemap.mjs index. Do not edit by hand. -->',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map((e) => `  <sitemap><loc>${xmlEsc(e.loc)}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''}</sitemap>`),
    '</sitemapindex>', ''].join('\n');
  const rootRepo = repos[idx.repoSite];
  writeFileSync(join(rootRepo, idx.out), indexXml);
  const uniq = [...new Set(all)];
  writeFileSync(join(rootRepo, idx.txt), uniq.join('\n') + '\n');
  console.log(`index: ${entries.length} sitemaps -> ${idx.out}; ${uniq.length} URLs -> ${idx.txt}`);
}

const [cmd, ...args] = process.argv.slice(2);
if (cmd === 'site' && args.length === 2) buildSite(args[0], args[1]);
else if (cmd === 'index' && args.length) buildIndex(args);
else die('usage: gen-sitemap.mjs site <name> <repo-path> | index <name>=<repo-path> ...');
