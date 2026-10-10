// Robots that understand context: .GUI page (this.gui@4.1.0, SRI-pinned in index.html, sha256-checked below)
// over the real, unmodified this.me@4.2.0 kernel from npm (jsDelivr, unpkg fallback; sha256-checked before import).
//
//   KERNEL (this.me):  robots-context-lab.js runs the steps of Robots_Contexts.ts on one kernel; every value shown
//                      comes from it (steps: what the script printed at that point; "Try it": live reads).
//   .GUI (this.gui):   the page is one spec resolved by GUI.mount (topbar, header, steps, source); live readouts are
//                      kernel reads through one .GUI runtime (GUI.createMeRuntime) over an explicit subscribe bridge.
//   me-syntax:         every line of .me code goes through the shared highlighter (/.me/assets/me-syntax/); a path
//                      that names a robot, a context or the canister selects it, and tapping one marks its code.

import { runScript, ROBOTS } from "./robots-context-lab.js";

const KERNEL = { version: "4.2.0", sha256: "8cc94d5273b05728713e7c06bcba6ab0d88c85d2a748dc885e7bca745605a61a",
  urls: ["https://cdn.jsdelivr.net/npm/this.me@4.2.0/dist/me.es.js", "https://unpkg.com/this.me@4.2.0/dist/me.es.js"] };
const GUI_PIN = { url: "https://cdn.jsdelivr.net/npm/this.gui@4.1.0/dist/this.gui.umd.js", sha256: "d50e32f6a4f7603804228c074fc59df1cfdea73a4f3d5ad93ba9475227b2a577" };
const SRC_URL = "https://raw.githubusercontent.com/neurons-me/.me/main/Typescript/tests/Demos/Robots_Contexts.ts";
const SRC_LINK = "https://github.com/neurons-me/.me/blob/main/Typescript/tests/Demos/Robots_Contexts.ts";

const G = window.GUI, h = React.createElement;
const { Box, Button, Typography, Link, Card, Chip, TextField, IconButton, Divider } = G.Atoms;
const { Table, TableBody, TableCell, TableHead, TableRow, Menu, MenuItem, ListItemIcon, ListItemText, Collapse } = G.Molecules;
const MONO = '"IBM Plex Mono", "SF Mono", ui-monospace, Menlo, Consolas, monospace';
const SYN = window.MeSyntax || null;
if (SYN && SYN.watchTheme) SYN.watchTheme();
const params = new URLSearchParams(location.search);

// ── tiny page store ──
function createStore(state) { const ls = new Set(); let v = 0; return { state, subscribe: (cb) => (ls.add(cb), () => ls.delete(cb)), version: () => v, set(p) { if (p) Object.assign(state, p); v++; ls.forEach((cb) => cb()); } }; }
const useStore = (s) => { React.useSyncExternalStore(s.subscribe, s.version); return s.state; };
const ui = createStore({ focus: null, kernel: { state: "loading" }, gui: { state: "checking" }, steps: [], ex: {}, src: null, transcript: "", results: [],
  lastOp: "— (state after the script: canister sterile, street clear)", prevRows: null, who: "nurse" });

// ── selection: one id for code and objects (robot:<id>, context:<name>, object:canister7) ──
const CONTEXTS = ["warehouse", "hospital", "street", "operatingRoom"];
let LAB = null;
function resolveInstance(path) {
  let m;
  if ((m = /^robots\.(\w+)$/.exec(path))) return ROBOTS.includes(m[1]) ? `robot:${m[1]}` : null;
  if ((m = /^robots\.(\w+)\.(target|context)$/.exec(path)) && LAB) { const p = LAB.me(path)?.__ptr; return p ? resolveInstance(p) : null; }   // the pointer → what it points to
  if ((m = /^contexts\.(\w+)$/.exec(path))) return CONTEXTS.includes(m[1]) ? `context:${m[1]}` : null;
  if (path === "objects.canister7") return "object:canister7";
  if (ROBOTS.includes(path)) return `robot:${path}`;   // softGripNames.loader, defineRobot("loader", …)
  return null;
}
const PATH_RE = /^[A-Za-z_$][\w$]*(?:\.[\w$]+)*$/;
function resolvePath(text) {   // a whole path, e.g. "robots.nurse.canProceed" → robot:nurse (its first prefix that names one)
  if (!PATH_RE.test(text)) return null; const segs = text.split(".");
  for (let i = 1; i <= segs.length; i++) { const id = resolveInstance(segs.slice(0, i).join(".")); if (id) return id; }
  return null;
}
const refTitle = (id) => { const [k, v] = id.split(":"); return k === "robot" ? `select robots.${v}` : k === "context" ? `select contexts.${v}` : `select objects.${v}`; };
const act = { focus: (id) => ui.set({ focus: id }) };

// ── .me code: me-syntax tokens (+ path strings that name an instance) → React, split into lines ──
function codeItems(code) {
  const opts = { resolve: (p) => resolveInstance(p) };
  return SYN.refs(code, opts).map((it) => {
    if (it.ref || !it.t || it.t.c !== "mes-str") return it;
    const id = resolvePath(it.t.v.slice(1, -1));
    return id ? { ref: id, toks: [it.t] } : it;
  });
}
function renderLines(code, focus) {
  if (!SYN) return String(code).split("\n").map((l) => [l]);
  const lines = [[]]; let n = 0;
  const tok = (t, out) => { if (t.brkBefore) out.push(h("wbr", { key: "b" + n })); out.push(t.c ? h("span", { key: "t" + n, className: t.c }, t.v) : t.v); if (t.brk) out.push(h("wbr", { key: "a" + n })); n++; };
  for (const it of codeItems(code)) {
    if (it.ref) {
      const id = it.ref, on = id === focus, inner = []; it.toks.forEach((t) => tok(t, inner));
      lines[lines.length - 1].push(h("span", { key: "r" + n++, className: "mes-ref" + (on ? " mes-ref-on" : ""), "data-me-ref": id, role: "button", tabIndex: 0, "aria-pressed": on ? "true" : "false", title: refTitle(id),
        onClick: (e) => { const s = window.getSelection(); if (s && !s.isCollapsed && String(s)) return; e.stopPropagation(); act.focus(id); },
        onKeyDown: (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); act.focus(id); } } }, inner));
      continue;
    }
    const parts = it.t.v.split("\n");
    parts.forEach((part, i) => { if (i > 0) lines.push([]); if (part) tok({ ...it.t, v: part, brk: i === parts.length - 1 && it.t.brk, brkBefore: i === 0 && it.t.brkBefore }, lines[lines.length - 1]); });
  }
  return lines;
}
// one line (or a few) of code, inline
function MeCode({ code, sx, className }) {
  const { focus } = useStore(ui);
  const lines = renderLines(code, focus);
  return h(Box, { component: "code", className: `me-code${className ? " " + className : ""}`, sx: { fontFamily: MONO, minWidth: 0, ...(sx || {}) } }, ...lines.flatMap((l, i) => (i ? ["\n", ...l] : l)));
}
// a block of the script, with its line numbers
function CodeBlock({ code, from = 1, maxHeight, id }) {
  const { focus } = useStore(ui), ref = React.useRef(null);
  const lines = renderLines(code, focus);
  React.useEffect(() => {   // tapping an object: scroll this block (not the page) to its first marked line
    const pre = ref.current, on = pre && pre.querySelector(".mes-ref-on"); if (!on) return;
    const a = pre.getBoundingClientRect(), b = on.getBoundingClientRect();
    if (b.top < a.top || b.bottom > a.bottom) pre.scrollTop += b.top - a.top - a.height / 3;
  }, [focus]);
  return h(Box, { component: "pre", ref, id, className: "me-code script", sx: { m: 0, py: 1, fontFamily: MONO, fontSize: 11.5, lineHeight: 1.55, border: 1, borderColor: "divider", borderRadius: 1, bgcolor: "background.paper", overflow: "auto", maxHeight: maxHeight || { xs: 280, sm: 520 } } },
    ...lines.map((l, i) => h(Box, { key: i, component: "span", className: "ln-row", sx: { display: "grid", gridTemplateColumns: "4.4ch minmax(0, 1fr)", columnGap: "1.2ch", pr: 1.5 } },
      h(Box, { component: "span", "aria-hidden": "true", sx: { color: "text.disabled", textAlign: "right", userSelect: "none" } }, from + i), h(Box, { component: "span", sx: { minWidth: 0 } }, ...(l.length ? l : ["\u200b"])))));
}
// a bare path or label ("robots.nurse", "objects.canister7 AFTER sterilization"): coloured, and the part that names an instance selects it
function PathCode({ text, sx }) {
  const { focus } = useStore(ui);
  const m = /^(\S+)(.*)$/s.exec(String(text)) || [, String(text), ""], id = resolvePath(m[1]);
  const kids = SYN ? SYN.render(h, m[1]) : [m[1]];
  const head = id ? h("span", { className: "mes-ref" + (id === focus ? " mes-ref-on" : ""), "data-me-ref": id, role: "button", tabIndex: 0, "aria-pressed": id === focus ? "true" : "false", title: refTitle(id),
    onClick: (e) => { e.stopPropagation(); act.focus(id); }, onKeyDown: (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); act.focus(id); } } }, ...kids) : h("span", null, ...kids);
  return h(Box, { component: "code", className: "me-code", sx: { fontFamily: MONO, ...(sx || {}) } }, head, m[2] ? h(Box, { component: "span", sx: { color: "text.secondary", fontFamily: "inherit" } }, m[2]) : null);
}
const fmt = (v) => (v === undefined ? "undefined" : typeof v === "string" ? JSON.stringify(v) : String(v));
const Val = ({ v, path }) => h(Box, { component: "span", className: SYN ? SYN.valueClass(v) : undefined, "data-me-path": path, "data-me-value": path ? String(v) : undefined }, fmt(v));

// ── kernel / .GUI build checks ──
async function sha256Hex(buf) { const d = await crypto.subtle.digest("SHA-256", buf); return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join(""); }
async function verifyGuiBuild() {
  const res = await fetch(GUI_PIN.url, { cache: "force-cache" }); if (!res.ok) throw new Error(`.GUI build: HTTP ${res.status}`);
  const hash = await sha256Hex(await res.arrayBuffer()); if (hash !== GUI_PIN.sha256) throw new Error(`.GUI build sha256 mismatch: got ${hash}`);
  return hash;
}
async function loadKernel() {
  const errors = [];
  for (const url of KERNEL.urls) {
    try {
      const res = await fetch(url, { cache: "force-cache" }); if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text(); const hash = await sha256Hex(new TextEncoder().encode(text));
      if (hash !== KERNEL.sha256) throw new Error(`sha256 mismatch: got ${hash}`);
      const blobUrl = URL.createObjectURL(new Blob([text], { type: "text/javascript" }));
      const mod = await import(blobUrl); URL.revokeObjectURL(blobUrl);
      const loadedUrl = res.url || url, version = (loadedUrl.match(/\/this\.me@([0-9]+\.[0-9]+\.[0-9]+[0-9A-Za-z.+-]*)\//) || [])[1] || "?";
      return { mod, host: new URL(loadedUrl).host, hash, url: loadedUrl, version };
    } catch (e) { errors.push(`${url}: ${e?.message || e}`); }
  }
  throw new Error("Could not load this.me@" + KERNEL.version + " — " + errors.join(" | "));
}

// ── icons: inline SVG (no icon font on this page) ──
const ICONS = {
  settings: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z",
  code: "M9.4 16.6 4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0 4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z",
  grid: "M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 20H4v-4h4v4zm0-6H4v-4h4v4zm0-6H4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4z",
  palette: "M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z",
  moon: "M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z",
  sun: "M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z",
  search: "M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
  down: "M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z",
  github: "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z",
};
function Ico({ kind, size = 18, off }) {
  return h("svg", { viewBox: kind === "github" ? "0 0 16 16" : "0 0 24 24", width: size, height: size, fill: "currentColor", "aria-hidden": "true", focusable: "false", style: { display: "block", flex: "none" } },
    h("path", { d: ICONS[kind] }), off ? h("path", { d: "M3 3 21 21", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" }) : null);
}

// ── search: the .GUI SearchBar (GUI.Components.SearchBar, the one on the neurons.me index / All.This) over the site
//    index (absolute URLs, so it works from either repo). A magnifier until opened ("/" opens it too); Escape closes it,
//    and so does leaving it while empty. On phones the open bar overlays the topbar, full width. ──
const SEARCH_SRC = "https://neurons-me.github.io/index.json";
// The SearchBar paints itself with fixed inline colours; re-skin it from the active theme (same rules as the index).
const searchSkin = (t) => {
  const P = t.palette, I = (v) => `${v} !important`, shadow = (t.shadows && t.shadows[8]) || "none";
  return {
    "& > div > div:first-of-type": { background: I(P.background.paper), borderColor: I(P.divider), color: I(P.text.primary), padding: I("6px 12px"), transition: "border-color 120ms ease" },
    "& > div > div:first-of-type:focus-within": { borderColor: I(P.primary.main) },
    "& input": { color: I(P.text.primary), caretColor: P.primary.main },
    "& input::placeholder": { color: P.text.secondary, opacity: 1 },
    "& [role=listbox]": { background: I(P.background.paper), borderColor: I(P.divider), boxShadow: I(shadow), color: P.text.primary },
    "& [role=listbox] > div": { color: I(P.text.secondary) },
    "& [role=option]": { color: I(P.text.primary), borderColor: I(P.divider) },
    "& [role=option]:hover, & [role=option][aria-selected=true]": { background: I(P.action.hover) },
    "& [role=option] > span:nth-of-type(2) > span:nth-of-type(2), & [role=option] > span:nth-of-type(3)": { color: I(P.text.secondary) },
  };
};
function TopSearch() {
  const SB = G.Components && G.Components.SearchBar;
  const [open, setOpen] = React.useState(false), box = React.useRef(null), btn = React.useRef(null);
  React.useEffect(() => { if (open) { const i = box.current && box.current.querySelector("input"); if (i) i.focus(); } }, [open]);
  React.useEffect(() => {
    if (open) return undefined;
    const k = (e) => { const t = e.target; if (e.key === "/" && !e.metaKey && !e.ctrlKey && !(t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable))) { e.preventDefault(); setOpen(true); } };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, [open]);
  if (!SB) return null;
  const close = (refocus) => { setOpen(false); if (refocus) setTimeout(() => btn.current && btn.current.focus(), 0); };
  if (!open) return h(G.Atoms.IconButton, { ref: btn, id: "site-search-open", size: "small", "aria-label": "Search", title: "Search (/)", onClick: () => setOpen(true), sx: { color: "text.secondary", p: { xs: .25, sm: .625 } } }, h(Ico, { kind: "search", size: 18 }));
  return h(G.Atoms.Box, { ref: box, id: "site-search", role: "search",
    onKeyDown: (e) => { if (e.key === "Escape") { e.preventDefault(); close(true); } },
    onBlur: (e) => { const nx = e.relatedTarget; if (nx && box.current && box.current.contains(nx)) return; const i = box.current && box.current.querySelector("input"); if (!i || !i.value.trim()) close(false); },
    sx: (t) => ({ zIndex: 1200, width: 300, minWidth: 0, flexShrink: 1, [t.breakpoints.down("sm")]: { position: "absolute", left: 8, right: 8, top: "50%", transform: "translateY(-50%)", width: "auto" },
      "& > div": { maxWidth: "none !important" }, ...searchSkin(t) }) },
    h(SB, { src: SEARCH_SRC, placeholder: "Search in All.This", themeMode: "auto", enableSlashShortcut: false }));
}
// ── chrome: topbar with the me:// path, Docs, GitHub, theme, light/dark, gear (Inspector, Grid Layout) ──
const LOGO = "https://res.cloudinary.com/dkwnxf6gm/image/upload/v1760629064/neurons.me_b50f6a.png";
const PATH_SEGMENTS = [
  { text: "me://", href: "https://neurons-me.github.io/.me/", title: ".me" },
  { text: "Demos", href: "https://neurons-me.github.io/.me/Demos/", title: ".me Demos" },
  { text: "Robots", href: "https://neurons-me.github.io/robots/", title: "Robots" },
  { text: "ContextLab", href: null, title: "This page" },
];
function TopBar(p) {
  const seg = (s, i) => [i > 0 && !PATH_SEGMENTS[i - 1].text.endsWith("://") ? h(Box, { component: "span", key: `sep${i}`, sx: { color: "text.disabled", mx: .15 } }, "/") : null,
    s.href ? h(Link, { key: s.text, href: s.href, underline: "hover", title: s.title, sx: { color: "primary.main", fontFamily: MONO, fontSize: { xs: 11, sm: 13 } } }, s.text)
      : h(Box, { component: "span", key: s.text, "aria-current": "page", sx: { color: "text.primary", fontFamily: MONO, fontSize: { xs: 11, sm: 13 }, fontWeight: 600 } }, s.text)];
  return h(Box, { component: "header", "data-gui-node-id": p["data-gui-node-id"], sx: { position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", gap: { xs: .25, sm: 1.25 }, px: { xs: .75, sm: 2.5 }, minHeight: 48, borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" } },
    h(Link, { href: "https://neurons-me.github.io/", title: "neurons.me", underline: "none", sx: { display: "inline-flex", lineHeight: 0, flexShrink: 0 } }, h("img", { src: LOGO, alt: "neurons.me", width: 28, height: 28, style: { display: "block", objectFit: "contain" } })),
    h(Box, { component: "nav", "aria-label": "me path", sx: { display: "inline-flex", alignItems: "center", minWidth: 0, overflowX: "auto", whiteSpace: "nowrap", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } } }, ...PATH_SEGMENTS.flatMap(seg)),
    h(Box, { sx: { ml: "auto", display: "inline-flex", alignItems: "center", gap: { xs: .25, sm: 1.25 }, flexShrink: 0 } },
      h(TopSearch),
      h(Link, { href: "https://neurons-me.github.io/.me/docs/", underline: "hover", sx: { fontFamily: MONO, fontSize: 12, color: "text.secondary" } }, "Docs"),
      h(Link, { href: "https://github.com/neurons-me/.me", underline: "none", target: "_blank", rel: "noopener", title: "GitHub · neurons-me/.me", "aria-label": "GitHub", sx: { display: "inline-flex", lineHeight: 0, color: "text.secondary", "&:hover": { color: "text.primary" } } }, h(Ico, { kind: "github", size: 18 })),
      h(Box, { "data-gui-inspector-control": "true", sx: { display: "inline-flex", alignItems: "center", gap: .25 } }, h(ThemePicker), h(ModeToggle), h(SettingsMenu))));
}
function ThemePicker() {
  const [anchor, setAnchor] = React.useState(null); const { themeId } = G.useThemeContext(); const close = () => setAnchor(null);
  return h(React.Fragment, null,
    h(Button, { id: "theme-picker", size: "small", variant: "outlined", "aria-label": `Theme: ${themeId}`, "aria-haspopup": "true", "aria-expanded": anchor ? "true" : "false", onClick: (e) => setAnchor(e.currentTarget),
      sx: { minWidth: 0, py: { xs: .5, sm: .25 }, px: { xs: .5, sm: .75 }, gap: .5, fontFamily: MONO, fontSize: 11, textTransform: "none", color: "text.secondary", borderColor: { xs: "transparent", sm: "divider" }, whiteSpace: "nowrap", "& .lbl": { display: { xs: "none", sm: "inline" } } } },
      h(Ico, { kind: "palette", size: 15 }), h(Box, { component: "span", className: "lbl" }, themeId), h(Box, { component: "span", className: "lbl" }, h(Ico, { kind: "down", size: 14 }))),
    h(Menu, { id: "theme-menu", anchorEl: anchor, open: !!anchor, onClose: close, anchorOrigin: { vertical: "bottom", horizontal: "right" }, transformOrigin: { vertical: "top", horizontal: "right" }, "data-gui-inspector-control": "true",
      slotProps: { list: { "aria-label": "Themes", dense: true }, paper: { sx: { width: 220, p: .5, mt: .5 } } } },
      h(G.ThemesCatalog, { sidebarView: "expanded", onThemeSelect: close })));
}
function ModeToggle() {
  const { mode, toggleMode } = G.useThemeContext(), dark = mode === "dark";
  return h(IconButton, { id: "theme-mode-toggle", size: "small", onClick: () => toggleMode(), "aria-label": dark ? "Switch to light mode" : "Switch to dark mode", title: dark ? "Light mode" : "Dark mode", sx: { color: "text.secondary", p: { xs: .5, sm: .625 } } }, h(Ico, { kind: dark ? "moon" : "sun", size: 18 }));
}
// The gear: Inspector and Grid Layout, as on the neurons.me index and the docs shell (the same GUI switches).
function SettingsMenu() {
  const sel = G.useOptionalSelection ? G.useOptionalSelection() : null;
  const [anchor, setAnchor] = React.useState(null), close = () => setAnchor(null);
  React.useEffect(() => { if (sel && params.get("grid") === "1" && !sel.gridEnabled) sel.setGridEnabled(true); }, []);
  const insp = Boolean(G.getInspectorEnabled()), grid = Boolean(sel && sel.gridEnabled);
  const items = [
    { key: "inspector", label: insp ? "Inspector · ON" : "Inspector · OFF", icon: h(Ico, { kind: "code", off: !insp }), onClick: () => G.toggleInspector() },
    sel && { key: "grid", label: grid ? "Grid Layout · ON" : "Grid Layout · OFF", icon: h(Ico, { kind: "grid", off: !grid }), onClick: () => sel.setGridEnabled(!grid) },
  ].filter(Boolean);
  return h(React.Fragment, null,
    h(IconButton, { id: "gui-settings", "aria-label": "GUI settings", title: "GUI settings", size: "small", onClick: (e) => setAnchor(e.currentTarget), sx: { color: "text.secondary", p: { xs: .5, sm: .625 } } }, h(Ico, { kind: "settings", size: 18 })),
    h(Menu, { id: "settings-menu", anchorEl: anchor, open: !!anchor, onClose: close, "data-gui-inspector-control": "true", anchorOrigin: { vertical: "bottom", horizontal: "right" }, transformOrigin: { vertical: "top", horizontal: "right" } },
      ...items.map((it) => h(MenuItem, { key: it.key, "data-settings-item": it.key, onClick: () => { close(); it.onClick(); } }, h(ListItemIcon, null, it.icon), h(ListItemText, null, it.label)))));
}

// ── header ──
const H2 = (children, sx) => h(Typography, { component: "p", sx: { fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em", color: "text.secondary", m: 0, mb: .75, display: "flex", gap: 1, alignItems: "baseline", flexWrap: "wrap", ...(sx || {}) } }, ...[].concat(children));
const STEP_LINKS = [["step-1", "1 · Shared object"], ["step-2", "2 · Contexts"], ["step-3", "3 · Robots + pointers"], ["step-4", "4 · Policies"], ["step-5", "5 · Live updates"], ["step-6", "6 · explain()"], ["source", "Source"]];
function Header(p) {
  const { kernel, results } = useStore(ui);
  const passed = results.filter((r) => r.pass).length, allOk = results.length && passed === results.length;
  const dot = kernel.state === "ok" ? "success.main" : kernel.state === "error" ? "error.main" : "warning.main";
  return h(Box, { component: "section", "data-gui-node-id": p["data-gui-node-id"], sx: { pt: 3.5, pb: 3.5 } },
    h(Typography, { component: "h1", sx: { fontSize: "clamp(2.2rem, 6vw, 3.4rem)", lineHeight: 1.05, letterSpacing: "-.03em", fontWeight: 800, m: 0, mb: 1.75 } }, "ContextLab for Robots"),
    h(Typography, { component: "p", sx: { m: 0, fontSize: ".95rem", color: "text.secondary" } }, "Syntax Demonstration"),
    h(Card, { id: "kstrip", variant: "outlined", "data-state": kernel.state, sx: { display: "flex", alignItems: "center", gap: 1.25, flexWrap: "wrap", mt: 2, px: 1.75, py: 1.25, fontSize: ".85rem", color: "text.secondary", bgcolor: "background.paper" } },
      h(Box, { component: "span", sx: { width: 8, height: 8, borderRadius: "50%", bgcolor: dot, flex: "none" } }),
      h(Box, { component: "span", id: "ktxt", sx: { flex: "1 1 0", minWidth: { xs: "calc(100% - 24px)", sm: 0 }, overflowWrap: "anywhere" } }, kernel.state === "ok"
        ? h(React.Fragment, null, "Kernel ", h("b", null, `this.me@${kernel.version}`), ` · dist/me.es.js from ${kernel.host} · sha256 ${kernel.hash.slice(0, 12)}… `, h("b", null, "verified"), " · unmodified")
        : kernel.state === "error" ? h(Box, { component: "span", sx: { color: "error.main" } }, kernel.text) : `Loading this.me@${KERNEL.version} and checking its sha256…`),
      results.length ? h(Chip, { id: "sum", size: "small", variant: "outlined", color: allOk ? "success" : "error", label: `${passed}/${results.length} asserts pass`, sx: { ml: "auto", fontFamily: MONO, fontSize: 11 } }) : null),
    h(Box, { component: "nav", "aria-label": "Steps", sx: { display: "flex", flexWrap: "wrap", gap: .75, mt: 1.75 } },
      ...STEP_LINKS.map(([id, label]) => h(Chip, { key: id, component: "a", href: `#${id}`, clickable: true, size: "small", variant: "outlined", label, sx: { color: "primary.main", fontSize: ".78rem" } }))));
}

// ── output objects (what the script printed at that step): cards, tables, the robot map, explain() ──
const selSx = (on) => (on ? { borderColor: "primary.main", boxShadow: (t) => `0 0 0 1px ${t.palette.primary.main}` } : {});
const CELL_SX = { fontFamily: MONO, fontSize: 11.5, py: .5, px: 1.25, whiteSpace: "nowrap", borderColor: "divider" };
const HEAD_SX = { ...CELL_SX, fontFamily: "inherit", fontSize: 10.5, color: "text.secondary", textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 500 };
const isFlat = (v) => v && typeof v === "object" && !Array.isArray(v) && Object.values(v).every((x) => x === null || typeof x !== "object");
function OutCard({ label, refId, children, className }) {
  const { focus } = useStore(ui), on = refId && refId === focus;
  return h(Card, { variant: "outlined", className: `out-card${className ? " " + className : ""}`, "data-me-ref": refId || undefined, "aria-selected": refId ? (on ? "true" : "false") : undefined,
    onClick: refId ? () => act.focus(refId) : undefined, sx: { overflow: "hidden", cursor: refId ? "pointer" : "default", bgcolor: "background.paper", transition: "box-shadow .15s, border-color .15s", ...selSx(on) } },
    h(Box, { sx: { px: 1.5, py: .75, borderBottom: 1, borderColor: "divider", fontSize: 12, overflowWrap: "anywhere" } }, label),
    children);
}
const kvTable = (obj) => h(Box, { sx: { overflowX: "auto" } }, h(Table, { size: "small" }, h(TableBody, null,
  ...Object.entries(obj).map(([k, v]) => h(TableRow, { key: k }, h(TableCell, { sx: { ...CELL_SX, color: "text.secondary", width: "1%" } }, k), h(TableCell, { className: "me-code", sx: CELL_SX }, h(Val, { v })))))));
function ShowBox({ item }) {
  const v = item.value, body = isFlat(v) ? kvTable(v) : v && typeof v === "object"
    ? h(Box, { component: "pre", sx: { m: 0, px: 1.5, py: 1, fontFamily: MONO, fontSize: 11.5, color: "text.secondary", overflowX: "auto" } }, JSON.stringify(v, null, 2))
    : h(Box, { className: "me-code", sx: { fontFamily: MONO, fontSize: 12.5, px: 1.5, py: .75 } }, h("span", { className: "mes-arrow" }, "→ "), h(Val, { v }));
  return h(OutCard, { label: h(PathCode, { text: item.label }), refId: resolvePath(String(item.label).split(" ")[0]) }, body);
}
function Matrix({ items }) {   // several show() objects with the same keys: keys as rows, one column per object
  const { focus } = useStore(ui), keys = Object.keys(items[0].value), ids = items.map((i) => resolvePath(String(i.label).split(" ")[0]));
  const colSx = (j) => (ids[j] && ids[j] === focus ? { bgcolor: "action.selected" } : {});
  return h(Card, { variant: "outlined", className: "out-matrix", sx: { bgcolor: "background.paper" } }, h(Box, { sx: { overflowX: "auto" } }, h(Table, { size: "small" },
    h(TableHead, null, h(TableRow, null, h(TableCell, { sx: HEAD_SX }), ...items.map((i, j) => h(TableCell, { key: j, "data-me-ref": ids[j] || undefined, onClick: ids[j] ? () => act.focus(ids[j]) : undefined, sx: { ...CELL_SX, cursor: ids[j] ? "pointer" : "default", ...colSx(j) } }, h(PathCode, { text: i.label }))))),
    h(TableBody, null, ...keys.map((k) => h(TableRow, { key: k }, h(TableCell, { sx: { ...CELL_SX, color: "text.secondary" } }, k),
      ...items.map((i, j) => h(TableCell, { key: j, className: "me-code", onClick: ids[j] ? () => act.focus(ids[j]) : undefined, sx: { ...CELL_SX, cursor: ids[j] ? "pointer" : "default", ...colSx(j) } }, h(Val, { v: i.value[k] })))))))));
}
const MAP_COLS = [["robot", "Robot"], ["context", "Context"], ["lift", "Lift"], ["soft", "Soft"], ["sterile", "Sterile"], ["yield", "Yield"], ["review", "Review"], ["proceed", "Proceed"]];
const mapColor = (k, v) => (k === "robot" || k === "context" ? "text.primary" : v.startsWith("✓") ? "success.main" : v.startsWith("✗") ? "error.main" : v.startsWith("●") ? "warning.main" : "text.secondary");
function MapTable({ title, rows, prev, live, id }) {
  const { focus } = useStore(ui);
  return h(Card, { variant: "outlined", id, className: "robot-map", sx: { bgcolor: "background.paper" } },
    h(Box, { sx: { px: 1.5, py: .75, borderBottom: 1, borderColor: "divider", fontSize: 13, fontWeight: 600 } }, title),
    h(Box, { sx: { overflowX: "auto" } }, h(Table, { size: "small" },
      h(TableHead, null, h(TableRow, null, ...MAP_COLS.map(([k, t]) => h(TableCell, { key: k, className: `c-${k}`, sx: { ...HEAD_SX, ...(k === "context" ? { display: { xs: "none", sm: "table-cell" } } : {}) } }, t)))),
      h(TableBody, null, ...rows.map((r, i) => {
        const rid = `robot:${r.id}`, cid = resolvePath(LAB ? LAB.me(`robots.${r.id}.context`)?.__ptr || "" : "");
        return h(TableRow, { key: r.id, hover: true, className: "map-row", "data-me-ref": rid, "aria-selected": focus === rid ? "true" : "false", onClick: () => act.focus(rid), sx: { cursor: "pointer", ...(focus === rid ? { bgcolor: "action.selected" } : {}) } },
          ...MAP_COLS.map(([k]) => {
            const changed = prev && prev[i] && prev[i][k] !== r[k];
            const sx = { ...CELL_SX, color: mapColor(k, r[k]), ...(changed ? { bgcolor: (t) => `color-mix(in srgb, ${t.palette.info.main} 16%, transparent)` } : {}), ...(k === "context" ? { display: { xs: "none", sm: "table-cell" } } : {}) };
            if (k === "context") return h(TableCell, { key: k, className: "c-context", "data-me-ref": cid || undefined, onClick: cid ? (e) => { e.stopPropagation(); act.focus(cid); } : undefined, sx: { ...sx, ...(cid && focus === cid ? { bgcolor: "action.selected" } : {}) } }, r.context);
            const cell = live ? h(LiveCell, { id: r.id, k, text: r[k] }) : r[k];
            return h(TableCell, { key: k, className: `c-${k}`, sx }, cell, k === "robot" ? h(Box, { component: "span", sx: { display: { xs: "block", sm: "none" }, color: "text.secondary", fontSize: 10 } }, r.context) : null);
          }));
      })))));
}
// a live map cell: the kernel value behind it, read through the .GUI runtime (data-me-* lets the checks compare)
const CELL_PATH = { robot: "name", lift: "canLift", soft: "needsSoftGrip", yield: "mustYield", review: "needsHumanReview", proceed: "canProceed" };
function LiveCell({ id, k, text }) {
  const path = CELL_PATH[k] ? `robots.${id}.${CELL_PATH[k]}` : null;
  const v = G.useMeValue(path || `robots.${id}.needsSterileHandling`), v2 = G.useMeValue(`robots.${id}.needsSterileClearance`);
  return h(Box, { component: "span", "data-me-path": path || `robots.${id}.needsSterileHandling||needsSterileClearance`, "data-me-value": String(path ? v : Boolean(v || v2)) }, text);
}
function ExplainBox({ path, p, id }) {
  const rid = resolvePath(path), ok = p.value;
  return h(OutCard, { refId: rid, className: "explain", label: h(Box, { component: "span", sx: { display: "inline-flex", flexWrap: "wrap", gap: .75, alignItems: "baseline" } },
      h(MeCode, { code: `explain("${path}")` }), h(Box, { component: "code", className: "me-code", sx: { fontFamily: MONO } }, h("span", { className: "mes-arrow" }, "→ "), h(Val, { v: ok }))) },
    h(Box, { sx: { px: 1.5, py: .75, borderBottom: 1, borderColor: "divider", fontSize: 12 } }, p.expression != null ? h(MeCode, { code: p.expression }) : h(Box, { component: "span", sx: { color: "text.secondary", fontFamily: MONO } }, "null")),
    h(Box, { sx: { overflowX: "auto" } }, h(Table, { size: "small" },
      h(TableHead, null, h(TableRow, null, ...["input", "value", "origin"].map((t) => h(TableCell, { key: t, sx: HEAD_SX }, t)))),
      h(TableBody, null, ...p.inputs.map((i, j) => h(TableRow, { key: j }, h(TableCell, { sx: CELL_SX }, h(MeCode, { code: i.label })), h(TableCell, { className: "me-code", sx: CELL_SX }, h(Val, { v: i.value })), h(TableCell, { sx: { ...CELL_SX, color: "text.secondary" } }, i.origin)))))),
    h(Box, { sx: { px: 1.5, py: .75, fontSize: 11.5, color: "text.secondary", fontFamily: MONO, overflowWrap: "anywhere" } }, "dependsOn: ",
      ...p.dependsOn.flatMap((d, j) => [j ? ", " : null, h(PathCode, { key: d, text: d })])));
}
function Checks({ list }) {
  return h(Card, { variant: "outlined", component: "ul", className: "checks", sx: { listStyle: "none", m: 0, p: 0, bgcolor: "background.paper", borderColor: (t) => `color-mix(in srgb, ${t.palette.success.main} 40%, transparent)` } },
    ...list.map((r, i) => h(Box, { component: "li", key: i, className: r.pass ? "pass" : "fail", sx: { display: "flex", gap: 1, px: 1.5, py: .5, fontSize: 11.5, borderBottom: 1, borderColor: "divider", "&:last-of-type": { borderBottom: 0 } } },
      h(Box, { component: "span", sx: { color: r.pass ? "success.main" : "error.main", fontWeight: 700, fontFamily: MONO } }, r.pass ? "✓" : "✗"),
      h(Box, { sx: { minWidth: 0 } }, h(MeCode, { code: r.source }), r.pass ? null : h(Box, { component: "span", sx: { color: "error.main", fontFamily: MONO } }, " — actual " + JSON.stringify(r.actual))))));
}
function Reveal({ label, children, id }) {   // a collapsed block (console output, the full script)
  const [open, setOpen] = React.useState(false);
  return h(Box, { id, className: "reveal" },
    h(Button, { size: "small", variant: "text", onClick: () => setOpen(!open), "aria-expanded": open ? "true" : "false", endIcon: h(Box, { component: "span", sx: { display: "inline-flex", transform: open ? "rotate(180deg)" : "none" } }, h(Ico, { kind: "down", size: 16 })),
      sx: { textTransform: "none", color: "text.secondary", px: .5, fontSize: 12.5 } }, label),
    h(Collapse, { in: open, unmountOnExit: true }, h(Box, { sx: { mt: .75 } }, children)));
}
const Console = ({ text, id }) => h(Box, { component: "pre", id, className: "console", sx: { m: 0, px: 1.75, py: 1.5, fontFamily: MONO, fontSize: 11.5, lineHeight: 1.55, border: 1, borderColor: "divider", borderRadius: 1, bgcolor: "background.paper", color: "text.secondary", overflow: "auto", maxHeight: 520 } }, text);

// ── one step of the script: its lines beside what they gave ──
function groupBlocks(items) {   // consecutive show() objects with the same keys (> 5) become one table
  const blocks = [];
  for (const it of items) {
    const last = blocks.at(-1), flat = it.type === "show" && isFlat(it.value) && Object.keys(it.value).length > 5;
    if (flat && last?.kind === "group" && JSON.stringify(Object.keys(last.items[0].value)) === JSON.stringify(Object.keys(it.value))) last.items.push(it);
    else if (flat) blocks.push({ kind: "group", items: [it] });
    else blocks.push({ kind: it.type, it });
  }
  return blocks;
}
function Step(p) {
  const { steps, ex } = useStore(ui), s = steps.find((x) => x.n === p.n); if (!s) return null;
  const e = ex[s.n], wide = s.n === 4 || s.n === 5;
  const scriptLabel = (r) => H2(["Script · lines ", `${r.from}–${r.to}`, h(Link, { key: "gh", href: `${SRC_LINK}#L${r.from}-L${r.to}`, underline: "hover", sx: { textTransform: "none", letterSpacing: 0, fontSize: 12 } }, "GitHub ↗")]);
  const body = groupBlocks(s.items).map((b, i) => {
    if (b.kind === "group") return b.items.length > 1 ? h(Matrix, { key: i, items: b.items }) : h(ShowBox, { key: i, item: b.items[0] });
    if (b.kind === "show") return h(ShowBox, { key: i, item: b.it });
    if (b.kind === "map") { const prev = /AFTER/.test(b.it.title) ? steps.flatMap((x) => x.items).find((x) => x.type === "map" && /BEFORE/.test(x.title))?.rows : null; return h(MapTable, { key: i, title: b.it.title, rows: b.it.rows, prev }); }
    if (b.kind === "explain") return h(ExplainBox, { key: i, path: b.it.path, p: b.it.printable });
    return null;
  });
  return h(Box, { component: "section", id: `step-${s.n}`, "data-gui-node-id": p["data-gui-node-id"], className: "step", sx: { py: 3.5, borderTop: 1, borderColor: "divider", scrollMarginTop: "56px" } },
    h(Typography, { component: "h2", sx: { fontSize: "clamp(1.25rem, 3vw, 1.6rem)", letterSpacing: "-.01em", fontWeight: 700, m: 0, mb: 1 } }, h(Box, { component: "span", sx: { color: "primary.main", fontFamily: MONO, mr: 1 } }, s.n), s.title.replace(/^\d\.\s*/, "")),
    s.notes.length ? h(Box, { component: "ul", sx: { m: 0, mb: 1.75, pl: 2.25, fontSize: ".92rem" } }, ...s.notes.map((n, i) => h("li", { key: i }, n))) : null,
    h(Box, { sx: { display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 2, alignItems: "start", "@media (min-width:1000px)": { gridTemplateColumns: wide ? "minmax(0, 1fr)" : "minmax(0, 5fr) minmax(0, 6fr)" }, "& > *": { minWidth: 0 } } },
      e ? h(Box, { className: "step-code" },
        e.pre ? h(Box, { sx: { mb: 1.5 } }, scriptLabel(e.pre), h(CodeBlock, { code: e.pre.text.join("\n"), from: e.pre.from, maxHeight: wide ? { xs: 280, md: 300 } : undefined })) : null,
        scriptLabel(e), h(CodeBlock, { code: e.text.join("\n"), from: e.from, maxHeight: wide ? { xs: 280, md: 300 } : undefined }))
        : h(Box, null, H2(["Script", h(Link, { key: "gh", href: SRC_LINK, underline: "hover", sx: { textTransform: "none", letterSpacing: 0, fontSize: 12 } }, "GitHub ↗")])),
      h(Box, { className: "out", sx: { display: "flex", flexDirection: "column", gap: 1.5 } }, H2("Output · read from the kernel", { mb: 0 }), ...body,
        s.checks.length ? h(React.Fragment, null, H2("Asserts", { mt: .5, mb: 0 }), h(Checks, { list: s.checks })) : null,
        h(Reveal, { label: "Console output" }, h(Console, { text: s.out.join("\n") })))),
    s.n === 5 ? h(Live) : null);
}

// ── step 5, interactive: the same kernel the script ran on ──
const kListeners = new Map();
function kernelSubscribe(path, cb) { const key = String(path).replace(/^me\//, "").replace(/\//g, "."); let s = kListeners.get(key); if (!s) kListeners.set(key, (s = new Set())); s.add(cb); return () => { s.delete(cb); if (!s.size) kListeners.delete(key); }; }
function announceAll() { for (const s of [...kListeners.values()]) [...s].forEach((cb) => cb()); }
function write(fn, op) {
  const prevRows = LAB.robotMapRows(); fn();
  ui.set({ prevRows, lastOp: op }); announceAll();
}
function Live() {
  const { lastOp, prevRows, who } = useStore(ui); if (!LAB) return null;
  const me = LAB.me, sterile = G.useMeValue("objects.canister7.sterile"), traffic = G.useMeValue("contexts.street.movingVehicles");
  const rows = LAB.robotMapRows(), trace = LAB.explainPrintable(`robots.${who}.canProceed`).printable;
  const btn = (id, label, code, onClick) => h(Button, { id, size: "small", variant: "outlined", onClick, sx: { textTransform: "none", borderRadius: 2, gap: 1, fontSize: 12.5, color: "text.primary", borderColor: "divider" } },
    label, h(MeCode, { code, sx: { fontSize: 11.5 } }));
  return h(Card, { id: "live", variant: "outlined", sx: { mt: 2.25, p: 2, bgcolor: "background.paper", borderColor: "primary.main" } },
    h(Typography, { component: "h3", sx: { m: 0, mb: .5, fontSize: "1.05rem", fontWeight: 700 } }, "Try it — change the world, read the robots again"),
    h(Typography, { component: "p", sx: { m: 0, mb: 1.5, color: "text.secondary", fontSize: ".88rem" } }, "Each button writes one value into the same kernel the script just ran on; the table, the filter and explain() are read back from it."),
    h(Box, { sx: { display: "flex", flexWrap: "wrap", gap: 1, mb: 1.5, alignItems: "center" } },
      btn("b-ster", sterile ? "Make canister non-sterile" : "Sterilize canister", `objects.canister7.sterile(${!sterile})`, () => write(() => me.objects.canister7.sterile(!sterile), `me.objects.canister7.sterile(${!sterile})`)),
      btn("b-traf", traffic ? "Clear the street" : "Send traffic", `contexts.street.movingVehicles(${!traffic})`, () => write(() => me.contexts.street.movingVehicles(!traffic), `me.contexts.street.movingVehicles(${!traffic})`))),
    h(Box, { sx: { display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 1.5, "@media (min-width:900px)": { gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)" }, "& > *": { minWidth: 0 } } },
      h(Box, { sx: { "@media (min-width:900px)": { gridColumn: "1 / -1" } } }, h(MapTable, { id: "live-map", title: "Robot map — live", rows, prev: prevRows, live: true })),
      h(Box, { sx: { display: "flex", flexDirection: "column", gap: 1.5 } },
        h(OutCard, { label: "last write" }, h(Box, { id: "lastop", sx: { px: 1.5, py: .75, fontSize: 11.5 } }, h(MeCode, { code: lastOp }))),
        h(ShowBox, { item: { label: "robots[canProceed == true].name", value: me("robots[canProceed == true].name") } })),
      h(Box, null, H2(["explain", h(TextField, { key: "who", id: "b-who", select: true, size: "small", value: who, onChange: (e) => ui.set({ who: e.target.value }), SelectProps: { MenuProps: { "data-gui-inspector-control": "true" } }, sx: { "& .MuiSelect-select": { py: .25, fontSize: 12, fontFamily: MONO } } },
        ...ROBOTS.map((r) => h(MenuItem, { key: r, value: r, sx: { fontFamily: MONO, fontSize: 12 } }, r)))]), h(ExplainBox, { path: `robots.${who}.canProceed`, p: trace }))));
}

// ── source ──
function Source(p) {
  const { src, transcript } = useStore(ui), code = (t) => h(Box, { component: "code", sx: { fontFamily: MONO, fontSize: ".85em" } }, t);
  return h(Box, { component: "section", id: "source", "data-gui-node-id": p["data-gui-node-id"], sx: { py: 3.5, borderTop: 1, borderColor: "divider", scrollMarginTop: "56px" } },
    h(Typography, { component: "h2", sx: { fontSize: "clamp(1.25rem, 3vw, 1.6rem)", fontWeight: 700, m: 0, mb: 1 } }, "Source"),
    h(Typography, { component: "p", sx: { m: 0, mb: 1.5, fontSize: ".92rem" } }, "Typescript/tests/Demos/Robots_Contexts.ts in ", h(Link, { href: SRC_LINK, underline: "hover" }, "neurons-me/.me"), " — run it with ", code("npx tsx tests/Demos/Robots_Contexts.ts"), " from ", code("Typescript/"),
      ". This page runs the same steps through ", h(Link, { href: "robots-context-lab.js", underline: "hover" }, "robots-context-lab.js"), ", a line-for-line port whose output matches the script's stdout byte for byte."),
    h(Reveal, { id: "fullsrc", label: "Full script" }, src ? h(CodeBlock, { id: "srcpre", code: src.replace(/\n$/, "") }) : h(Typography, { sx: { fontSize: ".9rem" } }, "Could not fetch the file here — ", h(Link, { href: SRC_LINK }, "read it on GitHub"), ".")),
    h(Reveal, { label: "Full console output (this run)" }, h(Console, { id: "transcript", text: transcript })));
}
const Footer = (p) => h(Box, { component: "footer", "data-gui-node-id": p["data-gui-node-id"], sx: { pt: 3.75, pb: 7.5, color: "text.secondary", fontSize: ".85rem", borderTop: 1, borderColor: "divider", mt: 2.5 } }, "sui.gn / neurons.me");

// ── source excerpts (split the real file at its section(...) calls) ──
function excerpts(src) {
  const lines = src.split("\n"), starts = [];
  lines.forEach((l, i) => { const m = l.match(/^section\("(\d)\./); if (m) starts.push([+m[1], i]); });
  const endScript = lines.findIndex((l, i) => i > (starts.at(-1)?.[1] ?? 0) && l.startsWith("console.log(`"));
  const map = {};
  starts.forEach(([n, i], k) => { const end = k + 1 < starts.length ? starts[k + 1][1] : endScript > 0 ? endScript : lines.length; let e = end; while (e > i && !lines[e - 1].trim()) e--; map[n] = { from: i + 1, to: e, text: lines.slice(i, e) }; });
  const fn = (name) => { const i = lines.findIndex((l) => l.startsWith(`function ${name}(`)); if (i < 0) return null; const e = lines.findIndex((l, j) => j > i && l === "}"); return { from: i + 1, to: e + 1, text: lines.slice(i, e + 1) }; };
  if (map[3]) map[3].pre = fn("defineRobot");
  if (map[4]) map[4].pre = fn("applyRobotPolicies");
  if (map[6]) map[6].pre = fn("showExplain");
  return map;
}

// ── page spec (GUI.mount) ──
const pageType = (type, Comp) => ({ type, resolve: (spec) => { const { key: _k, ...p } = spec.props || {}; return h(Comp, p); } });
const PAGE_TYPES = Object.fromEntries([["ClTopBar", TopBar], ["ClHeader", Header], ["ClStep", Step], ["ClSource", Source], ["ClFooter", Footer]].map(([t, C]) => [t, pageType(t, C)]));
const N = (type, id, props = {}, children) => ({ type, props: { ...props, "data-gui-node-id": id }, ...(children !== undefined ? { children: [].concat(children) } : {}) });
function pageSpec(live) {
  return N("Box", "page", { sx: { minHeight: "100vh", bgcolor: "background.default", color: "text.primary", lineHeight: 1.6 } }, [
    N("ClTopBar", "topbar"),
    N("Box", "wrap", { component: "main", sx: { width: "min(1120px, calc(100% - 32px))", mx: "auto" } }, [
      N("ClHeader", "header"),
      ...(live ? [1, 2, 3, 4, 5, 6].map((n) => N("ClStep", `step-${n}`, { n })) : []),
      N("ClSource", "source"),
      N("ClFooter", "footer"),
    ]),
  ]);
}
const PageTheme = ({ children }) => h(G.Theme, { initialThemeId: "neurons.me", initialMode: "dark" }, children);
const ROOT = document.getElementById("root"), MOUNT_GUI = { ...G, Theme: PageTheme, registry: { ...G.registry, ...PAGE_TYPES } };
const INSPECTOR_ON = params.get("inspector") === "1";
if (G.getInspectorEnabled() !== INSPECTOR_ON) G.setInspectorEnabled(INSPECTOR_ON);
const DEVTOOLS = { enabled: true, inspector: INSPECTOR_ON, adminView: false, inspectorToggleVisible: false };
let RT = null, FME = null;
const mountPage = () => G.mount(pageSpec(!!RT), ROOT, RT ? { gui: MOUNT_GUI, me: FME, runtime: RT, devtools: DEVTOOLS } : { gui: MOUNT_GUI, devtools: DEVTOOLS });
mountPage();

// ── run ──
const srcPromise = fetch(SRC_URL).then((r) => (r.ok ? r.text() : Promise.reject(new Error("HTTP " + r.status)))).catch(() => null);
try {
  const [k] = await Promise.all([loadKernel(), verifyGuiBuild().then((hash) => ui.set({ gui: { state: "ok", hash } }), (e) => { ui.set({ gui: { state: "error" } }); console.error(e); })]);
  ui.set({ kernel: { state: "ok", version: k.version, host: k.host, hash: k.hash, url: k.url } });
  const steps = []; let cur = null; const transcript = [];
  const hook = (type, data) => {
    if (type === "section") { cur = { title: data, n: +data[0], notes: [], items: [], checks: [], out: [] }; steps.push(cur); return; }
    if (!cur) return;
    if (type === "note") cur.notes.push(data); else if (type === "assert") cur.checks.push(data); else cur.items.push({ type, ...data });
  };
  const out = (s) => { transcript.push(s); if (cur) cur.out.push(s); };
  LAB = runScript(k.mod.default, { out, hook, check: () => {} });
  const src = await srcPromise;
  window.__robotsLab = { transcript: transcript.join("\n") + "\n", results: LAB.results, kernel: { version: k.version, sha256: k.hash, url: k.url }, ui, LAB,
    consistency: () => [...document.querySelectorAll("[data-me-path][data-me-value]")].map((e) => { const p = e.dataset.mePath, [a, b] = p.split("||");
      const kv = b ? String(Boolean(LAB.me(a) || LAB.me(a.replace(/[^.]+$/, b)))) : String(LAB.me(p)); return { path: p, dom: e.dataset.meValue, kernel: kv }; }).filter((x) => x.dom !== x.kernel) };
  FME = Object.assign((p) => LAB.me(p), { explain: (p) => LAB.me.explain(p) });   // read facade: the runtime never touches the kernel proxy's own keys
  RT = G.createMeRuntime(FME, { subscribe: kernelSubscribe });
  ui.set({ steps, ex: src ? excerpts(src) : {}, src, transcript: window.__robotsLab.transcript, results: LAB.results, prevRows: LAB.robotMapRows() });
  mountPage(); announceAll();
  window.__robotsLab.ready = true;
} catch (e) {
  ui.set({ kernel: { state: "error", text: String(e?.message || e) } });
  window.__robotsLab = { error: String(e && e.message || e) };
  console.error(e);
}
