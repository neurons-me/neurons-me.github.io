// neurons.me docs shell on .GUI 4.1.0.
// Loaded by the neurons-me remote theme layout (readme/default) on every Jekyll doc page, after React,
// ReactDOM and this.gui (jsDelivr, SRI-pinned). It upgrades the server-rendered page in place:
//   - mounts a GUI Layout with the .GUI TopBar: logo + navigable me:// path, Docs, GitHub icon,
//     SearchBar (themed from tokens), light/dark, and a gear with themes (avatars), Inspector, Grid;
//   - moves the existing <main id="doc-content"> into the GUI layout untouched, and styles it from
//     the active theme's tokens (docs-gui.css reads the CSS variables set here);
//   - keeps the static topbar as the no-JS / CDN-failure fallback (it is only hidden once GUI mounted).
// Per-site settings come from window.NEURONS_DOCS (set by the layout from _config.yml me_theme).
//
// Bar mode (NEURONS_DOCS.host = "vitepress" | "typedoc"): for generated sites that own their content, nav and
// sidebar (VitePress guides, TypeDoc API). Only the TopBar (+ the mobile sub-bar) is mounted; the generator's
// own top nav is hidden, its CSS variables are fed from the GUI theme, and light/dark is kept in sync.
(function () {
  const CONTENT = document.getElementById("doc-content");
  const HOSTKIND = (window.NEURONS_DOCS || {}).host || (CONTENT ? "jekyll" : null);
  if (!HOSTKIND) return;
  if (!window.GUI || !window.React || !window.ReactDOM || typeof window.GUI.mount !== "function") return; // fallback stays

  const G = window.GUI, h = React.createElement, M = G.Molecules || {}, A = G.Atoms || {};
  const HOST = "https://neurons-me.github.io";
  const CFG = Object.assign({
    siteRoot: HOST + "/",
    docs: HOST + "/.me/docs/",
    github: "https://github.com/neurons-me",
    search: HOST + "/index.json",
    sitemap: HOST + "/sitemap.txt",
    logo: "https://res.cloudinary.com/dkwnxf6gm/image/upload/v1760629064/neurons.me_b50f6a.png",
  }, window.NEURONS_DOCS || {});
  const params = new URLSearchParams(location.search);
  const N = (type, props, children) => ({ type, props: props || {}, ...(children ? { children } : {}) });
  const MOBILE = "@media (max-width:599.95px)";
  const THEMES = (G.GuiThemes || []).filter((t) => t && t.themeId);

  // ── data: fetched with cache:"no-cache" so the browser revalidates (ETag/Last-Modified, 304 when unchanged)
  // instead of trusting GitHub Pages' max-age=600. The SearchBar gets `items`, not `src`, so it never
  // reads a stale index.json.
  const fresh = (url, as) => fetch(url, { cache: "no-cache" }).then((r) => (r.ok ? r[as]() : null)).catch(() => null);
  const searchItems = fresh(CFG.search, "json");
  const knownUrls = fresh(CFG.sitemap, "text").then((t) => new Set((t || "").split(/\s+/).filter(Boolean).map(decodeURI)));

  // ── me:// path: me:// → the site root; each segment links to its own level when that level is a page
  // (listed in the generated sitemap.txt); otherwise it is plain text. The last segment is the page itself.
  function crumbs() {
    const segs = decodeURI(location.pathname).split("/").filter(Boolean);
    const out = []; let acc = "/";
    segs.forEach((s, i) => {
      const last = i === segs.length - 1, isFile = last && /\.[a-z0-9]+$/i.test(s);
      acc += s + (isFile ? "" : "/");
      if (isFile && /^index\.html?$/i.test(s)) return;
      out.push({ label: isFile ? s.replace(/\.html?$/i, "") : s, url: HOST + acc, current: last });
    });
    return out;
  }
  // VitePress navigates client-side: re-render the path on pushState/replaceState/popstate.
  ["pushState", "replaceState"].forEach((k) => { const o = history[k]; history[k] = function () { const r = o.apply(this, arguments); dispatchEvent(new Event("docs-gui:nav")); return r; }; });
  addEventListener("popstate", () => dispatchEvent(new Event("docs-gui:nav")));
  function MePath({ compact }) {
    const [known, setKnown] = React.useState(null);
    const [, setPath] = React.useState(location.pathname);
    React.useEffect(() => { knownUrls.then(setKnown); const f = () => setPath(location.pathname); addEventListener("docs-gui:nav", f); return () => removeEventListener("docs-gui:nav", f); }, []);
    const linkSx = { color: "text.secondary", textDecoration: "none", borderRadius: 1, px: 0.25, "&:hover": { color: "primary.main", textDecoration: "underline" } };
    const parts = [h(G.Box, { component: "a", key: "me", href: HOST + "/", sx: { ...linkSx, fontWeight: 700, color: "text.primary" } }, "me://")];
    const cs = crumbs();
    cs.forEach((c, i) => {
      if (i > 0) parts.push(h(G.Box, { component: "span", key: "s" + i, "aria-hidden": "true", sx: { color: "text.disabled", px: 0.25 } }, "/"));
      const exists = c.current || !known || known.has(c.url) || known.has(c.url.replace(/\/$/, "/index.html"));
      parts.push(c.current
        ? h(G.Box, { component: "span", key: "c" + i, "aria-current": "page", sx: { color: "text.primary", fontWeight: 600 } }, c.label)
        : exists ? h(G.Box, { component: "a", key: "c" + i, href: c.url, sx: linkSx }, c.label)
          : h(G.Box, { component: "span", key: "c" + i, sx: { color: "text.secondary", px: 0.25 } }, c.label));
    });
    return h(G.Box, { component: "nav", "aria-label": "me:// path", "data-docs-mepath": "true",
      sx: { display: "flex", alignItems: "center", minWidth: 0, overflowX: "auto", whiteSpace: "nowrap", scrollbarWidth: "none",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: compact ? "0.82rem" : "0.9rem", "&::-webkit-scrollbar": { display: "none" } } }, parts);
  }
  // Brand slot: TopBar's `title` is typed string in 4.1.0 but rendered as a node, and its brand box is a <div>
  // when homeTo is null, so the logo + path go there (no nested links). Hidden < 600px by TopBar itself;
  // the mobile sub-bar below carries it there.
  function Brand() {
    return h(G.Box, { sx: { display: "flex", alignItems: "center", gap: 1.25, minWidth: 0, maxWidth: "calc(100vw - 520px)" } },
      h(G.Box, { component: "a", href: HOST + "/", "aria-label": "neurons.me home", sx: { display: "inline-flex", flexShrink: 0 } },
        h(G.Box, { component: "img", src: CFG.logo, alt: "neurons.me", sx: { width: 28, height: 28, objectFit: "contain", display: "block" } })),
      h(MePath));
  }

  // ── SearchBar re-skinned from theme tokens (4.1.0 paints two fixed palettes with inline styles).
  const searchThemeSx = (t) => {
    const P = t.palette, I = (v) => `${v} !important`, shadow = (t.shadows && t.shadows[8]) || "none";
    return {
      "& > div > div:first-of-type": { background: I(P.background.paper), borderColor: I(P.divider), color: I(P.text.primary) },
      "& > div > div:first-of-type:focus-within": { borderColor: I(P.primary.main) },
      "& input": { color: I(P.text.primary), caretColor: P.primary.main },
      "& input::placeholder": { color: P.text.secondary, opacity: 1 },
      "& > div > div:first-of-type > span:last-of-type:not(:first-of-type)": { background: I(P.action.hover), color: I(P.text.secondary) },
      "& [role=listbox]": { background: I(P.background.paper), borderColor: I(P.divider), boxShadow: I(shadow), color: P.text.primary },
      "& [role=listbox] > div": { color: I(P.text.secondary) },
      "& [role=option]": { color: I(P.text.primary), borderColor: I(P.divider) },
      "& [role=option]:hover, & [role=option][aria-selected=true]": { background: I(P.action.hover) },
      "& [role=option] > span:nth-of-type(2) > span:nth-of-type(2), & [role=option] > span:nth-of-type(3)": { color: I(P.text.secondary) },
    };
  };
  function DocsSearch({ width }) {
    const [items, setItems] = React.useState(null);
    React.useEffect(() => { searchItems.then((d) => setItems(Array.isArray(d) ? d : [])); }, []);
    // 4.1.0 exports SearchBar only as a registry entry ({type, resolve}); resolve() builds the element.
    return h(G.Box, { className: "docs-search", sx: (t) => ({ width: width || 260, maxWidth: "100%", ...searchThemeSx(t), [MOBILE]: { "& > div > div:first-of-type > span:last-of-type:not(:first-of-type)": { display: "none" } } }) },
      items ? G.Registry.SearchBar.resolve({ props: { items, placeholder: "Search in All.This", themeMode: "auto", enableSlashShortcut: true } }) : null);
  }

  // ── gear: themes with avatars, Inspector, Grid (GUISettings' own menu has a broken Themes link and no Grid).
  const menuHeading = (text) => h(G.Box, { component: "li", role: "presentation", sx: { px: 2, pt: 0.75, pb: 0.5, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "text.secondary" } }, text);
  function SettingsMenu() {
    const sel = G.useOptionalSelection ? G.useOptionalSelection() : null;
    const theme = G.useThemeContext();
    const [anchor, setAnchor] = React.useState(null);
    React.useEffect(() => { if (sel && params.get("grid") === "1" && !sel.gridEnabled) sel.setGridEnabled(true); }, []);
    React.useEffect(() => { if (params.get("menu") === "1") setAnchor(document.querySelector("[data-docs-gear]")); }, []);
    const insp = Boolean(G.getInspectorEnabled()), grid = Boolean(sel && sel.gridEnabled);
    const close = () => setAnchor(null);
    const pick = (id) => { close(); if (theme && id !== theme.themeId) theme.setThemeId(id); };
    const items = [
      { key: "inspector", label: insp ? "Inspector · ON" : "Inspector · OFF", icon: insp ? "code" : "code_off", onClick: () => G.toggleInspector() },
      sel && { key: "grid", label: grid ? "Grid Layout · ON" : "Grid Layout · OFF", icon: grid ? "grid_on" : "grid_off", onClick: () => sel.setGridEnabled(!grid) },
    ].filter(Boolean);
    return h(React.Fragment, null,
      h(A.IconButton, { "aria-label": "GUI settings", title: "GUI settings", "data-docs-gear": "true", color: "inherit", size: "small", onClick: (e) => setAnchor(e.currentTarget) }, h(G.Icon, { name: "settings" })),
      h(M.Menu, { anchorEl: anchor, open: Boolean(anchor), onClose: close, "data-gui-inspector-control": "true",
          slotProps: { paper: { sx: { minWidth: 220, maxWidth: "calc(100vw - 24px)", maxHeight: "calc(100vh - 96px)" } } } },
        ...(theme && THEMES.length ? [menuHeading("Theme"), ...THEMES.map((t) => {
          const on = t.themeId === theme.themeId, name = t.themeName || t.themeId;
          return h(M.MenuItem, { key: "t:" + t.themeId, role: "menuitemradio", "aria-checked": on, selected: on, onClick: () => pick(t.themeId), sx: { py: 0.5, minHeight: 0 } },
            h(M.ListItemIcon, null, t.badgeUrl ? h(A.Avatar, { src: t.badgeUrl, alt: "", sx: { width: 26, height: 26 } }) : h(A.Avatar, { sx: { width: 26, height: 26, fontSize: 12 } }, name[0])),
            h(M.ListItemText, { primaryTypographyProps: { sx: { fontSize: "0.9rem", fontWeight: on ? 700 : 400 } } }, name),
            on ? h(G.Box, { component: "span", sx: { ml: 1.5, display: "inline-flex", color: "primary.main" } }, h(G.Icon, { name: "check", fontSize: "1.1rem" })) : null);
        }), h(A.Divider, { key: "div", sx: { my: 0.5 } })] : []),
        ...items.map((it) => h(M.MenuItem, { key: it.key, onClick: () => { close(); it.onClick(); } },
          h(M.ListItemIcon, null, h(G.Icon, { name: it.icon })), h(M.ListItemText, null, it.label)))));
  }
  const SETTINGS = (o) => G.GUISettings({ includeAdminViewToggle: false, includeRuntimeControlsToggle: false, includeThemesLink: false, includeBrand: false, includeSettingsMenu: false, brandLogoSrc: CFG.logo, ...o });
  function Controls() {
    const els = SETTINGS().topBarRight({ slot: "topBarRight", collectionId: "GUISettings" });
    return h(G.Box, { "data-gui-inspector-control": "true", sx: { display: "inline-flex", alignItems: "center", gap: 0.25, color: "text.secondary" } },
      els.map((el, i) => h(G.Box, { key: i, title: el.props.tooltip, sx: { display: "inline-flex" } }, el.props.element)),
      h(SettingsMenu));
  }
  const GITHUB_SVG = "M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z";
  function GitHubLink() {
    return h(G.Box, { component: "a", href: CFG.github, "aria-label": "GitHub", title: "GitHub", target: "_blank", rel: "noopener",
        sx: { display: "inline-flex", p: 0.75, borderRadius: 1, color: "text.secondary", "&:hover": { color: "text.primary", bgcolor: "action.hover" } } },
      h("svg", { width: 20, height: 20, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true" }, h("path", { d: GITHUB_SVG })));
  }

  // ── mobile sub-bar (< 600px): GUI 4.1.0's collapsed TopBar drops `action` elements and hides the brand,
  // so path, search, light/dark and gear are rendered here, sticky under the TopBar.
  function MobileBar() {
    return h(G.Box, { "data-docs-mobilebar": "true", sx: { display: "none", [MOBILE]: { display: "flex" }, flexDirection: "column", gap: 1, px: 2, py: 1.25,
        position: HOSTKIND === "jekyll" ? "sticky" : "fixed", left: 0, right: 0, top: "var(--docs-topbar-h, 50px)", zIndex: HOSTKIND === "jekyll" ? 5 : 1100, bgcolor: "background.default", borderBottom: "1px solid", borderColor: "divider" } },
      h(G.Box, { sx: { display: "flex", alignItems: "center", gap: 1, minWidth: 0 } },
        h(G.Box, { component: "a", href: HOST + "/", "aria-label": "neurons.me home", sx: { display: "inline-flex", flexShrink: 0 } },
          h(G.Box, { component: "img", src: CFG.logo, alt: "neurons.me", sx: { width: 24, height: 24, objectFit: "contain" } })),
        h(MePath, { compact: true })),
      h(G.Box, { sx: { display: "flex", alignItems: "center", gap: 0.5 } },
        h(G.Box, { sx: { flex: 1, minWidth: 0 } }, h(DocsSearch, { width: "100%" })),
        h(GitHubLink),
        h(Controls)));
  }

  // ── content: the server-rendered <main> is moved (not re-rendered) into the layout, then themed via CSS variables.
  function DocContent() {
    const ref = React.useRef(null);
    const t = G.useThemeContext();
    const muiRef = React.useRef(null); // 4.1.0 exports no useTheme(); the sx callback receives the MUI theme.
    React.useLayoutEffect(() => {
      if (ref.current && CONTENT.parentNode !== ref.current) ref.current.appendChild(CONTENT);
      document.documentElement.classList.add("docs-gui-on"); // only now: a render error leaves the static page
      const bar = document.querySelector("#docs-gui-root header");
      if (bar && window.ResizeObserver) new ResizeObserver(() => document.documentElement.style.setProperty("--docs-topbar-h", bar.offsetHeight + "px")).observe(bar);
    }, []);
    React.useLayoutEffect(() => applyTheme(muiRef.current));
    return h(G.Box, { ref, className: "docs-gui-content", sx: (mui) => { muiRef.current = mui; return { flex: "1 1 auto", minWidth: 0, width: "100%", boxSizing: "border-box", maxWidth: 980, mx: "auto", px: { xs: 2, sm: 4 }, pt: { xs: 2, sm: 4 }, pb: 6 }; } });
  }
  // Feed the active GUI palette to the page's CSS: me-theme.css variables (Jekyll), VitePress or TypeDoc variables.
  function applyTheme(mui) {
    const P = mui && mui.palette; if (!P) return;
    const root = document.documentElement, s = root.style, dark = P.mode === "dark";
    const subtle = dark ? "rgba(255,255,255,0.045)" : "rgba(0,0,0,0.035)", code = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.055)";
    const font = (mui.typography && mui.typography.fontFamily) || "inherit";
    const vars = HOSTKIND === "vitepress" ? {
      "--vp-c-bg": P.background.default, "--vp-c-bg-alt": P.background.paper, "--vp-c-bg-soft": subtle, "--vp-c-bg-elv": P.background.paper,
      "--vp-c-text-1": P.text.primary, "--vp-c-text-2": P.text.secondary, "--vp-c-text-3": P.text.disabled || P.text.secondary,
      "--vp-c-divider": P.divider, "--vp-c-border": P.divider, "--vp-c-gutter": P.divider,
      "--vp-c-brand-1": P.primary.main, "--vp-c-brand-2": P.primary.light || P.primary.main, "--vp-c-brand-3": P.primary.dark || P.primary.main,
      "--vp-c-brand-soft": P.action.selected || subtle, "--vp-code-bg": code, "--vp-code-block-bg": P.background.paper,
      "--vp-c-default-soft": subtle, "--vp-font-family-base": font, "--vp-sidebar-bg-color": P.background.default,
    } : HOSTKIND === "typedoc" ? {
      "--color-background": P.background.default, "--color-background-secondary": P.background.paper, "--color-background-active": P.action.selected || subtle,
      "--color-background-warning": P.background.paper, "--color-text": P.text.primary, "--color-text-aside": P.text.secondary,
      "--color-link": P.primary.main, "--color-accent": P.divider, "--color-active-menu-item": P.action.selected || subtle,
      "--color-focus-outline": P.primary.main, "--color-code-background": code,
    } : {
      "--bg": P.background.default, "--fg": P.text.primary, "--muted": P.text.secondary, "--border": P.divider, "--subtle": subtle,
      "--accent": P.primary.main, "--code-bg": code, "--doc-font": font,
      "--hl-string": dark ? "#86efac" : "#0a7d3f", "--hl-number": dark ? "#fbbf24" : "#b45309", "--hl-comment": P.text.secondary,
    };
    Object.entries(vars).forEach(([k, v]) => s.setProperty(k, v));
    s.colorScheme = dark ? "dark" : "light";
    root.dataset.docsMode = dark ? "dark" : "light";
    if (HOSTKIND === "vitepress") { root.classList.toggle("dark", dark); try { localStorage.setItem("vitepress-theme-appearance", dark ? "dark" : "light"); } catch (e) {} }
    if (HOSTKIND === "typedoc") { root.dataset.theme = dark ? "dark" : "light"; try { localStorage.setItem("tsd-theme", dark ? "dark" : "light"); } catch (e) {} }
    if (CONTENT) swapPictures(dark);
  }
  // Bar mode: no content to host; this only feeds the theme and flags the page once mounted.
  function ThemeSync() {
    const muiRef = React.useRef(null);
    G.useThemeContext();
    React.useLayoutEffect(() => {
      document.documentElement.classList.add("docs-gui-on", "docs-gui-bar", "docs-gui-" + HOSTKIND);
      const hdr = document.querySelector("#docs-gui-root header"), mb = document.querySelector("#docs-gui-root [data-docs-mobilebar]");
      const measure = () => {
        const t = hdr ? hdr.offsetHeight : 0, m = mb && getComputedStyle(mb).display !== "none" ? mb.offsetHeight : 0;
        document.documentElement.style.setProperty("--docs-topbar-h", t + "px");
        document.documentElement.style.setProperty("--docs-chrome-h", t + m + "px");
      };
      measure();
      if (window.ResizeObserver) { const ro = new ResizeObserver(measure); hdr && ro.observe(hdr); mb && ro.observe(mb); }
      addEventListener("resize", measure);
    }, []);
    React.useLayoutEffect(() => applyTheme(muiRef.current));
    return h(G.Box, { sx: (mui) => { muiRef.current = mui; return { display: "none" }; } });
  }
  // <picture><source media="(prefers-color-scheme: dark)"> follows the OS, not the GUI mode: pick the source by mode.
  function swapPictures(dark) {
    CONTENT.querySelectorAll("picture").forEach((pic) => {
      const img = pic.querySelector("img"); if (!img) return;
      if (!img.dataset.lightSrc) img.dataset.lightSrc = img.getAttribute("src") || "";
      const ds = pic.querySelector('source[media*="prefers-color-scheme: dark"], source[data-dark-srcset]');
      if (!ds) return;
      if (!ds.dataset.darkSrcset) { ds.dataset.darkSrcset = ds.getAttribute("srcset") || ""; ds.removeAttribute("srcset"); }
      img.src = dark ? ds.dataset.darkSrcset : img.dataset.lightSrc;
    });
  }

  const PAGE_TYPES = { Brand, MePath, DocsSearch, Controls, GitHubLink, MobileBar, DocContent, ThemeSync };
  const action = (type) => ({ type: "action", props: { element: h(PAGE_TYPES[type]) } });
  const TOPBAR = {
    title: h(Brand), logo: "", homeTo: null,
    logoSx: { display: "none" }, titleSx: { color: "inherit", fontSize: "1rem", fontWeight: 400, overflow: "visible" },
    // Docs is a TopBar `link` so it also appears in the collapsed (< 600px) menu; GitHub is an icon-only
    // action (TopBarLink always shows its label on desktop), repeated in the mobile sub-bar.
    elementsRight: [{ type: "link", props: { label: "Docs", href: CFG.docs, icon: "menu_book" } }, action("GitHubLink"), action("DocsSearch"), action("Controls")],
  };
  const spec = HOSTKIND === "jekyll" ? N("Layout", {
    TopBar: TOPBAR,
    LeftBar: false, RightBar: false,
    Footer: { brandLogo: CFG.logo, brandHref: "https://neurons.me", brandLabel: "neurons.me", position: "static" },
  }, [N("MobileBar"), N("DocContent")]) : N("Layout", { TopBar: TOPBAR, LeftBar: false, RightBar: false, Footer: false }, [N("MobileBar"), N("ThemeSync")]);
  // (bar mode still goes through Layout: TopBar needs the router context Layout provides)

  // Theme state is shared with the index (same keys): a theme picked anywhere on the site follows you.
  const KEY = "neurons-index-gui.themeMode";
  let stored = null; try { stored = localStorage.getItem(KEY); } catch (e) {}
  const mode = params.get("mode") || stored || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  try { if (params.get("mode")) localStorage.setItem(KEY, mode); } catch (e) {}
  const ID_KEY = (window.__thisGuiThemeScope && window.__thisGuiThemeScope.themeIdKey) || "neurons-index-gui.themeId";
  const asked = params.get("theme");
  try {
    if (asked && THEMES.some((t) => t.themeId === asked)) localStorage.setItem(ID_KEY, asked);
    else if (!localStorage.getItem(ID_KEY)) localStorage.setItem(ID_KEY, "neurons.me");
  } catch (e) {}
  const PageTheme = ({ children }) => h(G.Theme, { initialThemeId: "neurons.me", initialMode: mode }, children);

  const INSPECTOR_ON = params.get("inspector") === "1";
  if (G.getInspectorEnabled() !== INSPECTOR_ON) G.setInspectorEnabled(INSPECTOR_ON);
  const root = document.createElement("div");
  root.id = "docs-gui-root";
  document.body.insertBefore(root, document.body.firstChild); // outside VitePress' #app, so hydration is untouched
  try {
    window.__docsGui = G.mount(spec, root, {
      gui: { ...G, Theme: PageTheme, registry: { ...G.Registry, ...PAGE_TYPES } },
      devtools: { enabled: true, inspector: INSPECTOR_ON, adminView: false, inspectorToggleVisible: false },
    });
  } catch (e) {
    root.remove(); // keep the static page
    console.error("docs-gui: mount failed", e);
  }
})();
