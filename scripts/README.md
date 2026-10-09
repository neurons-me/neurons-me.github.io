# Sitemaps

`gen-sitemap.mjs` builds the sitemaps for neurons-me.github.io and every
project site under it. It reads the files Pages will publish, not the live
site, and needs no dependencies (Node 18+). Per-site settings are in
`sitemaps.json`.

| File | Repo | What it is |
| --- | --- | --- |
| `docs/sitemap_index.xml` | neurons-me.github.io | Sitemap index. `docs/robots.txt` points here. One entry per site below. |
| `docs/sitemap.xml` | neurons-me.github.io | Root site (`/`, `/NRP/`, `/smart-cities/`, …). |
| `sitemap.xml` | .me, GUI, Cleaker, monad, netget, mlearning.studio, all.this, neurons-me | One per project site (`/.me/sitemap.xml`, …). |
| `docs/sitemap.txt` | neurons-me.github.io | Plain list of every URL in all the sitemaps above. Kept because it was submitted before; not in robots.txt. |

All of them are generated. Do not edit them by hand.

## What goes in

A page is listed when Jekyll would publish it and it is real content:

- `.html`, `.md` and `.markdown` files tracked in git under the site source;
- not under `_*` or `.*`, not in `_config.yml` `exclude`, not in the site's
  `exclude` globs in `sitemaps.json`;
- not matched by a `_config.yml` `defaults` scope with `sitemap: false`
  (the root site uses this for `infoGraphics/` and the Google verification file);
- no `sitemap: false`, `published: false` or `redirect_to` in front matter;
- not a `<meta http-equiv="refresh">` redirect stub, not `noindex`, not `404.html`;
- not README/LICENSE/CHANGELOG/AGENTS-style repo files, except a README that is
  its directory's index (the readme-index behaviour of Pages).

URLs follow Pages: `index.*` becomes the directory URL, `.md` becomes `.html`,
`permalink` wins. When a `.md` and its built `.html` give the same URL (VitePress
typedocs), the URL is listed once.

`<lastmod>` is the date of the last git commit that touched the page (newest of
the files behind the URL). No `changefreq` or `priority`: Google ignores them.

## Workflow

Commit the content first, because lastmod comes from git. Then, with every repo
checked out locally:

```sh
node scripts/gen-sitemap.mjs site root             /path/to/neurons-me.github.io
node scripts/gen-sitemap.mjs site .me              /path/to/.me
node scripts/gen-sitemap.mjs site GUI              /path/to/GUI
node scripts/gen-sitemap.mjs site Cleaker          /path/to/Cleaker
node scripts/gen-sitemap.mjs site monad            /path/to/monad
node scripts/gen-sitemap.mjs site netget           /path/to/netget
node scripts/gen-sitemap.mjs site mlearning.studio /path/to/mlearning.studio
node scripts/gen-sitemap.mjs site all.this         /path/to/all.this
node scripts/gen-sitemap.mjs site neurons-me       /path/to/neurons-me
node scripts/gen-sitemap.mjs index root=/path/to/neurons-me.github.io .me=/path/to/.me \
  GUI=/path/to/GUI Cleaker=/path/to/Cleaker monad=/path/to/monad netget=/path/to/netget \
  mlearning.studio=/path/to/mlearning.studio all.this=/path/to/all.this neurons-me=/path/to/neurons-me
```

Commit and publish each project's `sitemap.xml` before the root repo, so that
every sitemap the index lists already exists.

A project repo only needs a new run when its pages change. The index and
`sitemap.txt` need a run whenever any project sitemap changes.

## Why not jekyll-sitemap

The Pages plugin gives static `.html` pages the build time as lastmod and
Markdown pages none, and `jekyll-last-modified-at` is not on the Pages plugin
whitelist. Generating the file from git gives real dates without changing how
Pages builds the sites. To automate it, a GitHub Action could run the same
commands on push; that would also need a token with write access to every
project repo.
