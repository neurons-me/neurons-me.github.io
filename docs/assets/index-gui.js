// neurons.me index (https://neurons-me.github.io/) on .GUI 4.4.5. Loaded by docs/index.html.
// Case 2 AppShell layout (namespace cleaker.me, brand neurons.me @ neurons-me.github.io).
// Everything renders through GUI.mount + GUI registry types (Layout/Footer, Card, Box, Typography,
// Link, Chip, SearchBar). Two small page-local types fill gaps the registry doesn't cover:
//   ThemedImg     — picks a light/dark image from GUI.useThemeContext().mode (no GUI image atom has that)
//   AudienceMark  — the two-circle SVG icon used on two Essays cards
//   NetgetMark    — netget wordmark (PNG mask + currentColor) for the Stack card; follows theme
(function () {
  // CDN failure → show the static fallback kept in <noscript id="static-index">.
  if (!window.GUI || !window.React || !window.ReactDOM || typeof window.GUI.mount !== "function") {
    const ns = document.getElementById("static-index"), root = document.getElementById("root");
    if (ns && root) root.innerHTML = ns.textContent;
    return;
  }
  const G = window.GUI, h = React.createElement;
  const params = new URLSearchParams(location.search);
  const N = (type, props, children) => ({ type, props: props || {}, ...(children ? { children } : {}) });
  const CL = "https://res.cloudinary.com/dkwnxf6gm/image/upload/";
  const LOGO = CL + "v1760629064/neurons.me_b50f6a.png";
  const GREY = CL + "v1760629056/neurons-grey_hxjcom.png";
  const SI = (slug, light, dark) => ({ light: `https://cdn.simpleicons.org/${slug}/${light}`, dark: `https://cdn.simpleicons.org/${slug}/${dark || "ffffff"}` });
  const MOBILE = "@media (max-width:480px)", TABLET = "@media (max-width:720px)", NARROW = "@media (max-width:360px)";
  // Stack card icons, "55%": the icon tile grew 55% of the way from its old size to the card's whole inner width
  // (desktop 84 -> 109 of 130px, phones 48 -> 73 of ~93px); the image, orb and QR inside keep their old proportion to it.
  const ICON = { tile: 109, img: 91, small: { tile: 73, img: 58 } };
  // An icon's tile as a hole in its card, not a layer on it: the page's own background (darker than the card in dark
  // mode, lighter in light) with a faint inner shadow at the top edge, instead of the lighter action.hover.
  const HOLE = { bgcolor: "background.default",
    boxShadow: (t) => t.palette.mode === "dark" ? "inset 0 1px 3px rgba(0,0,0,0.45)" : "inset 0 1px 3px rgba(15,23,32,0.10)" };

  // ── .me in secret mode ──
  // Typing a name into the .me card ("Who am I.") shows it at once as name.cleaker.me in the cleaker card's QR -- not
  // validated, just reflected. Adding the secret builds that .me in this page (this.me's two-argument constructor: the
  // compound seed of name + secret), so the same name and secret always reopen the same .me, here or on any cleaker.
  // It lives only in this page's memory: never stored (no localStorage, no URL), never sent; "destroy" drops it, and a
  // reload does too. Claiming it on cleaker.me is the cleaker card's step, not this one.
  const ME_LIB = { src: "https://cdn.jsdelivr.net/npm/this.me@4.2.1/dist/me.umd.js", integrity: "sha384-ElnWCZOb324gqFJ2M/Fxy4CZ6Si131WIbR54iYomzEbTloUDLfBzZ05qi1nZ7+4G" };
  const ME_NAMESPACE = "cleaker.me";
  const meStore = { username: "", held: null, listeners: new Set() };
  // ── a card that grows, the others pushed aside ──
  // A card can ask for more of the grid (cleaker: 1x2, twice as tall, once name.cleaker.me no longer fits along the
  // edge of its 1x1 QR). The grid flows the other cards on (grid-auto-flow: dense), each keeping its size, and they slide from
  // where they were to where they go (FLIP: their places are taken just before the change, then each is animated from
  // the old place to the new one).
  // grows little by little: while name.cleaker.me fits along the edge of the card's QR (up to ~17 characters) the card
  // keeps its size; past that, its side grows with the label (one character ~ 1/17 of the card), the QR drawn larger so
  // the label still fits its edge. The Docs row is a wrapping flex row: the card at the end of a full row moves down.
  // Two phases. The QR first grows inside its own card (drawn larger for the longer label, its dark margin shrinking
  // from ~28px to ~12px); only once it fills the card (a label ~25% past what fits at first) does the card grow, a few
  // pixels a character, pushing the others.
  const FITS = 17, IN_CARD = 1.25;
  const qrGrowthOf = (st) => { const handle = handleOf(st.held ? st.held.name : st.username); const len = handle ? handle.length + 1 + ME_NAMESPACE.length : 0; return Math.min(2.6, Math.max(1, len / FITS)); };
  // Off for now: cleaker keeps a card's size (its QR fixed, its edge saying only cleaker.me), so nothing grows or is
  // pushed. The mechanism (GrowCard, StackBeside, the FLIP push) stays for a card that needs the room.
  const GROW_ENABLED = false;
  const growthOf = (st) => GROW_ENABLED ? Math.max(1, qrGrowthOf(st) / IN_CARD) : 1;
  const grownOf = (st) => qrGrowthOf(st) > 1;
  const flip = { rects: null };
  const docsGrid = () => document.querySelector("[data-docs-row]");
  const snapshotDocs = () => { const g = docsGrid(); if (g) flip.rects = new Map([...g.querySelectorAll(".MuiCard-root")].map((c) => [c, c.getBoundingClientRect()])); };
  const playFlip = () => {
    const rects = flip.rects; flip.rects = null;
    if (!rects || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
    rects.forEach((r, el) => {
      // from where (and how big) it was to where it is: the others slide, the card that grew (or shrank) also scales
      const n = el.getBoundingClientRect(), dx = r.left - n.left, dy = r.top - n.top;
      const sx = n.width ? r.width / n.width : 1, sy = n.height ? r.height / n.height : 1;
      if (!(dx || dy || Math.abs(sx - 1) > 0.01 || Math.abs(sy - 1) > 0.01) || !el.animate) return;
      el.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, transformOrigin: "top left" }, { transform: "none", transformOrigin: "top left" }],
        { duration: 380, easing: "cubic-bezier(.2,.8,.2,1)" });
    });
  };
  const meSet = (patch) => {
    const was = growthOf(meStore);
    Object.assign(meStore, patch);
    if (growthOf(meStore) !== was) snapshotDocs();
    meStore.listeners.forEach((f) => f());
  };
  function useMeStore() {
    const [, bump] = React.useState(0);
    React.useEffect(() => { const f = () => bump((n) => n + 1); meStore.listeners.add(f); return () => { meStore.listeners.delete(f); }; }, []);
    return meStore;
  }
  // a name as a namespace handle: lowercase letters, digits and dashes (name.cleaker.me)
  const handleOf = (name) => String(name || "").trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 63);
  let meLib = null;
  const loadMe = () => meLib || (meLib = new Promise((resolve, reject) => {
    if (window.Me) return resolve(window.Me);
    const el = document.createElement("script");
    el.src = ME_LIB.src; el.integrity = ME_LIB.integrity; el.crossOrigin = "anonymous";
    el.onload = () => (window.Me ? resolve(window.Me) : reject(new Error(".me did not load")));
    el.onerror = () => { meLib = null; reject(new Error(".me did not load")); };
    document.head.appendChild(el);
  }));
  const identityHashOf = (me) => {
    const surface = me && me["!"];
    const id = surface && typeof surface.identity === "function" ? surface.identity() : null;
    return String((id && id.hash) || "");
  };

  // ── page-local registry types ──
  function ThemedImg({ light, dark, src, alt, sx }) {
    const mode = G.useThemeContext().mode;
    return h(G.Box, { component: "img", src: src || (mode === "dark" && dark ? dark : light), alt: alt || "", sx });
  }
  function AudienceMark({ width = 38, height = 30 }) {
    return h("svg", { width, height, viewBox: "0 0 40 32", "aria-hidden": "true" },
      h("circle", { cx: 15, cy: 16, r: 13, fill: "#83d6ec", fillOpacity: 0.82 }),
      h("circle", { cx: 25, cy: 16, r: 13, fill: "#f19b9b", fillOpacity: 0.82 }));
  }
  // Stack card mark for netget: original wordmark PNG used as a CSS mask so the letterforms
  // stay exact and background-color: currentColor tracks text.primary across themes.
  // No icon tile — the mark itself is the media.
  // `letters`: the same canvas without the frame (netget-letters.svg) -- on phones, where the card's border is the frame,
  // so the letters keep exactly their size and place.
  function NetgetMark({ sx, letters }) {
    const mask = letters ? "url(./assets/netget-letters.svg)" : "url(./assets/netget-mark.png)";
    return h(G.Box, {
      role: "img",
      "aria-hidden": "true",
      sx: {
        width: "100%", height: "auto", display: "block", flexShrink: 0,
        aspectRatio: "631 / 237",
        // the selected .GUI theme's primary color (neurons.me, Seafoam, ...), not the text color
        color: "primary.main",
        bgcolor: "currentColor",
        WebkitMaskImage: mask, WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center",
        maskImage: mask, maskSize: "contain",
        maskRepeat: "no-repeat", maskPosition: "center",
        ...(sx || {}),
      },
    });
  }
  // HeaderControls: GUISettings' light/dark toggle + a gear menu with the theme list, Inspector ON/OFF and Grid Layout ON/OFF,
  // rendered as a small row in the landing header instead of an app bar.
  // GUISettings' own gear menu (4.1.0) has a fixed item list with no Grid entry and no way to add items,
  // so the gear is rebuilt here from the same GUI pieces (Atoms.IconButton, Icon, Molecules.Menu/MenuItem/
  // ListItemIcon/ListItemText) with the same Inspector item, plus Grid wired to the devtools selection
  // context (GUI.useOptionalSelection().gridEnabled / setGridEnabled) — the same switch behind the
  // Inspector panel's "Grid on/off" button and Cleaker's Dev Tools "Layout Grid" toggle.
  const M = G.Molecules || {}, A = G.Atoms || {};
  // Theme list at the top of the gear: GUI.GuiThemes (the 4.1.0 catalog, in its own order) with each theme's
  // badgeUrl avatar (GUI.Atoms.Avatar), the same avatars GUI.ThemesCatalog shows. Picking one calls the page
  // Theme's setThemeId (GUI.useThemeContext) and keeps the current light/dark mode, as ThemesCatalog does;
  // Theme persists it to the page-scoped key in window.__thisGuiThemeScope (docs/index.html).
  const THEMES = (G.GuiThemes || []).filter((t) => t && t.themeId);
  const menuHeading = (text) => h(G.Box, { component: "li", role: "presentation", sx: { px: 2, pt: 0.75, pb: 0.5, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "text.secondary" } }, text);
  function SettingsMenu() {
    const sel = G.useOptionalSelection ? G.useOptionalSelection() : null;
    const theme = G.useThemeContext();
    const [anchor, setAnchor] = React.useState(null);
    React.useEffect(() => { if (sel && GRID_ON && !sel.gridEnabled) sel.setGridEnabled(true); }, []);
    const insp = Boolean(G.getInspectorEnabled());
    const grid = Boolean(sel && sel.gridEnabled);
    const items = [
      { key: "inspector", label: insp ? "Inspector · ON" : "Inspector · OFF", icon: insp ? "code" : "code_off", onClick: () => G.toggleInspector() },
      sel && { key: "grid", label: grid ? "Grid Layout · ON" : "Grid Layout · OFF", icon: grid ? "grid_on" : "grid_off", onClick: () => sel.setGridEnabled(!grid) },
    ].filter(Boolean);
    const close = () => setAnchor(null);
    const pickTheme = (id) => { close(); if (theme && typeof theme.setThemeId === "function" && id !== theme.themeId) theme.setThemeId(id); };
    const themeItems = theme && THEMES.length ? [
      menuHeading("Theme"),
      ...THEMES.map((t) => {
        const on = t.themeId === theme.themeId, name = t.themeName || t.themeId;
        return h(M.MenuItem, { key: "theme:" + t.themeId, "data-theme-item": t.themeId, role: "menuitemradio", "aria-checked": on, selected: on,
            onClick: () => pickTheme(t.themeId), sx: { py: 0.5, minHeight: 0 } },
          h(M.ListItemIcon, null, t.badgeUrl
            ? h(A.Avatar, { src: t.badgeUrl, alt: "", sx: { width: 26, height: 26 } })
            : h(A.Avatar, { sx: { width: 26, height: 26, fontSize: 12 } }, name[0])),
          h(M.ListItemText, { primaryTypographyProps: { sx: { fontSize: "0.9rem", fontWeight: on ? 700 : 400 } } }, name),
          on ? h(G.Box, { component: "span", sx: { ml: 1.5, display: "inline-flex", color: "primary.main" } }, h(G.Icon, { name: "check", fontSize: "1.1rem" })) : null);
      }),
      h(A.Divider, { key: "divider", sx: { my: 0.5 } }),
    ] : [];
    return h(React.Fragment, null,
      h(A.IconButton, { "aria-label": "GUI settings", title: "GUI settings", color: "inherit", size: "small", onClick: (e) => setAnchor(e.currentTarget) }, h(G.Icon, { name: "settings" })),
      h(M.Menu, { anchorEl: anchor, open: Boolean(anchor), onClose: close, "data-gui-inspector-control": "true",
          slotProps: { paper: { sx: { minWidth: 220, maxWidth: "calc(100vw - 24px)", maxHeight: "calc(100vh - 96px)" } } } },
        ...themeItems,
        ...items.map((it) => h(M.MenuItem, { key: it.key, "data-settings-item": it.key, onClick: () => { close(); it.onClick(); } },
          h(M.ListItemIcon, null, h(G.Icon, { name: it.icon })),
          h(M.ListItemText, null, it.label)))));
  }
  function HeaderControls() {
    const els = SETTINGS({ includeBrand: false, includeSettingsMenu: false }).topBarRight({ slot: "topBarRight", collectionId: "GUISettings" });
    // data-gui-inspector-control: GUI's inspector skips click-to-select inside these, so the switches
    // still work while the Inspector is ON (same flag GUI puts on its own Theme/Dev Tools launchers).
    return h(G.Box, { "data-gui-inspector-control": "true", sx: { display: "inline-flex", alignItems: "center", gap: 0.25, color: "text.secondary" } },
      els.map((el, i) => h(G.Box, { key: i, title: el.props.tooltip, sx: { display: "inline-flex" } }, el.props.element)),
      h(G.Box, { key: "settings", sx: { display: "inline-flex" } }, h(SettingsMenu)));
  }
  // The .me card's mark: the real .GUI identity monad (GUI.Widgets.Monad, the Storybook story
  // All.This/monad.ai/monad.ai → Identity: variant "identity", kind "me", seed "jabellae"), contained in the card's
  // icon box instead of floating. Its hover QR tooltip is hidden here (the card is a link), and the box isolates
  // its z-index 1400 so menus stay on top. Without the widget (older bundle) the .me logo stays.
  function MeMonad({ fallback }) {
    const Monad = (G.Widgets && G.Widgets.Monad) || G.Monad;
    const st = useMeStore();
    const seedOf = st.held ? st.held.hash : "jabellae";
    const q = "(max-width:480px)", [small, setSmall] = React.useState(() => window.matchMedia(q).matches);
    React.useEffect(() => { const m = window.matchMedia(q), on = () => setSmall(m.matches); m.addEventListener("change", on); return () => m.removeEventListener("change", on); }, []);
    if (!Monad) return h(ThemedImg, fallback);
    // Index-side tuning of the widget (selectors follow its DOM: orb > [aria-hidden] ring box > ring, dot):
    //  · orb ICON.img (ICON.small.img + 3 on phones) and a gentler float (-3px, ×1.04) so it never leaves its ICON.tile slot;
    //  · the widget's "glow" (opacity 0.3–0.5 pulse + white halo) replaced by a faint halo pulse, full opacity;
    //  · the ring at 80% of the orb (closer to its edge, farther from the dot), the dot at 22% of the ring, soft shadows;
    //  · ring box and ring inherit the orb's animated border-radius, so the ring morphs with the outer circle.
    const box = small ? ICON.small.tile : ICON.tile, orb = small ? ICON.small.img + 3 : ICON.img;
    const blob = { "0%,100%": "50%", "25%": "55% 45% 60% 40% / 60% 55% 45% 40%", "50%": "50% 60% 40% 55% / 55% 40% 60% 45%", "75%": "45% 55% 40% 60% / 40% 60% 55% 50%" };
    const lift = { "0%,100%": [0, 1], "25%": [-2, 1.02], "50%": [-3, 1.04], "75%": [-2, 1.02] };
    return h(G.Box, { role: "img", "aria-label": fallback.alt, sx: (t) => {
        const dark = t.palette.mode === "dark", halo = dark ? "255,255,255" : "0,90,122";
        return { position: "relative", zIndex: 0, isolation: "isolate", width: box, height: box, display: "flex",
          "@keyframes meOrbFloat": Object.fromEntries(Object.keys(blob).map((k) => [k, { transform: `translateY(${lift[k][0]}px) scale(${lift[k][1]})`, borderRadius: blob[k] }])),
          "@keyframes meOrbHalo": { "0%,100%": { boxShadow: `0 0 2px rgba(${halo},0.10)` }, "50%": { boxShadow: `0 0 4px rgba(${halo},0.16)` } },
          "& .monad-tooltip": { display: "none" }, "& div": { opacity: "1 !important" },
          "& div:has(> div[aria-hidden=true])": { animation: "meOrbFloat 6s ease-in-out infinite, meOrbHalo 4.5s ease-in-out infinite !important", "&:hover": { transform: "none" } },
          "& div[aria-hidden=true]": { width: "80% !important", height: "80% !important", borderRadius: "inherit" },
          "& div[aria-hidden=true] > div:first-of-type": { borderRadius: "inherit !important", borderWidth: `${small ? 2 : 2.5}px !important`,
            boxShadow: dark ? "0 0 3px rgba(180,230,230,0.22) !important" : "0 0 3px rgba(0,90,122,0.18) !important" },
          "& div[aria-hidden=true] > div:last-of-type": { width: "22% !important", height: "22% !important", boxShadow: dark ? "0 0 3px rgba(234,252,250,0.35) !important" : "0 0 3px rgba(0,90,122,0.3) !important" } };
      } },
      // the orb's pattern: your identity's fingerprint while you hold your .me, the default one otherwise
      h(Monad, { key: seedOf, variant: "identity", kind: "me", seed: seedOf, mode: "contained", size: Math.round(orb * 34 / 60) }));
  }
  // The monad card's mark: the .GUI Monad bubble itself (GUI.Widgets.Monad, Storybook All.This/monad.ai/monad.ai →
  // Bubble: variant "bubble"; kind resolves to "monad" there since the story has no global me, so it is passed here).
  // The widget draws a fixed 60px orb, so a 60px stage is scaled to the slot (0.8 → 48px, 0.567 → 34px on phones, the
  // .me orb's sizes). Same index-side tuning as the .me orb: full opacity, gentler float, a faint halo instead of the
  // widget's opacity/halo pulse; its own lava, blob and pixel-breath motions keep running.
  // Inner texture of the monad bubble (the light behind its pixel grid: the widget's ::before blob, glass shading
  // and "rorschachLava" layers). "widget" = as GUI draws it; "A" matte + grain; "B" diffuse fog; "C" frosted fine dots.
  // ?monadTexture=A|B|C|widget overrides it for a look.
  // Default "widget": texture A was written for the glass layers. On core="flat" those layers are gone, so A's mask
  // landed on the pixel grid and dissolved it. Keep A/B/C available as a query override.
  const MONAD_TEXTURE = "widget";
  const monadTexture = (dark) => {
    const pick = new URLSearchParams(location.search).get("monadTexture"), opt = /^(A|B|C|widget)$/.test(pick || "") ? pick : MONAD_TEXTURE;
    if (opt === "widget") return {};
    const ORB = "& div:has(> div[aria-hidden=true])", INNER = `${ORB} > div[aria-hidden=true]:first-of-type`;
    const tint = dark ? "255,255,255" : "0,60,80";
    // the inner layers: smaller (inset 9px instead of 5px of the 60px orb) and faded out at the edge, so no disc boundary
    const base = { [INNER]: { inset: "9px !important", WebkitMaskImage: "radial-gradient(circle, #000 38%, transparent 70%)", maskImage: "radial-gradient(circle, #000 38%, transparent 70%)" } };
    const grain = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 ${dark ? 1 : 0} 0 0 0 0 ${dark ? 1 : 0.24} 0 0 0 0 ${dark ? 1 : 0.31} 0 0 0 ${dark ? 0.16 : 0.2} 0'/%3E%3C/filter%3E%3Crect width='64' height='64' filter='url(%23n)'/%3E%3C/svg%3E")`;
    if (opt === "A") return { ...base,   // flat matte, faint grain, no highlight, no inkblot, no blob
      [`${ORB}::before`]: { display: "none" },
      [`${INNER} > div:first-of-type`]: { background: `${grain}, rgba(${tint},${dark ? 0.035 : 0.04}) !important`, backgroundSize: "32px 32px, auto", boxShadow: "none !important" },
      [`${INNER} > div:last-of-type`]: { display: "none" } };
    if (opt === "B") return { ...base,   // soft fog: wide, very blurred, low alpha; keeps the blob drift and the lava motion
      [INNER]: { ...base[INNER], WebkitMaskImage: "radial-gradient(circle, #000 20%, transparent 72%)", maskImage: "radial-gradient(circle, #000 20%, transparent 72%)" },
      [`${ORB}::before`]: { background: `radial-gradient(circle, rgba(${dark ? "159,246,255" : "0,90,122"},${dark ? 0.12 : 0.1}) 0%, transparent 70%) !important`, mixBlendMode: "normal !important" },
      [`${INNER} > div:first-of-type`]: { background: `radial-gradient(circle at 50% 46%, rgba(${tint},${dark ? 0.06 : 0.05}), transparent 70%) !important`, boxShadow: "none !important" },
      [`${INNER} > div:last-of-type`]: { background: `radial-gradient(ellipse at 45% 40%, rgba(${tint},0.05), transparent 60%), radial-gradient(ellipse at 58% 62%, rgba(${tint},0.04), transparent 60%) !important`, mixBlendMode: "normal !important" } };
    return { ...base,                     // C: frosted glass with a fine dot screen, low contrast; keeps the lava motion
      [`${ORB}::before`]: { display: "none" },
      [`${INNER} > div:first-of-type`]: { background: `radial-gradient(rgba(${tint},${dark ? 0.16 : 0.18}) 0.55px, transparent 0.9px) 0 0 / 2.5px 2.5px, rgba(${tint},${dark ? 0.03 : 0.035}) !important`, boxShadow: "none !important", backdropFilter: "blur(2px)" },
      [`${INNER} > div:last-of-type`]: { background: `repeating-linear-gradient(0deg, rgba(${tint},0.035) 0 0.6px, transparent 0.6px 2px) !important`, mixBlendMode: "normal !important", opacity: "1 !important" } };
  };
  function MonadBubble({ fallback }) {
    const Monad = (G.Widgets && G.Widgets.Monad) || G.Monad;
    const q = "(max-width:480px)", [small, setSmall] = React.useState(() => window.matchMedia(q).matches);
    React.useEffect(() => { const m = window.matchMedia(q), on = () => setSmall(m.matches); m.addEventListener("change", on); return () => m.removeEventListener("change", on); }, []);
    if (!Monad) return h(ThemedImg, fallback);
    // the bubble 8% smaller than the .me orb (its glow and float reach farther), then 21% smaller again; drawn at native size (no CSS scale, so no blur)
    const box = small ? ICON.small.tile : ICON.tile;
    const display = Math.round((small ? ICON.small.img + 3 : ICON.img) * 0.92 * 0.79);
    const blob = { "0%,100%": "50%", "25%": "55% 45% 60% 40% / 60% 55% 45% 40%", "50%": "50% 60% 40% 55% / 55% 40% 60% 45%", "75%": "45% 55% 40% 60% / 40% 60% 55% 50%" };
    const lift = { "0%,100%": 0, "25%": -2, "50%": -3, "75%": -2 };
    return h(G.Box, { role: "img", "aria-label": fallback.alt, sx: (t) => {
        return { position: "relative", zIndex: 0, isolation: "isolate", width: box, height: box, display: "flex", alignItems: "center", justifyContent: "center",
          "@keyframes monadOrbFloat": Object.fromEntries(Object.keys(blob).map((p) => [p, { transform: `translateY(${lift[p]}px)`, borderRadius: blob[p] }])),
          "& .monad-tooltip": { display: "none" },
          "& div:has(> div[aria-hidden=true])": { opacity: "1 !important", animation: "monadOrbFloat 6s ease-in-out infinite !important", "&:hover": { transform: "none" } },
          ...monadTexture(t.palette.mode === "dark") };
      } },
      h(G.Box, { sx: { width: display, height: display, flexShrink: 0, display: "flex" } },
        h(Monad, { variant: "bubble", kind: "monad", mode: "contained", core: "flat", size: display })));
  }
  // The .me QR on the cleaker card: GUI.QRme (registry "QR.me", this.gui 4.4.1), the same component as the namespace
  // landing on cleaker.me (GUI.content.landing.qr.code). It paints from the .GUI theme palette, so it follows the
  // page's theme and light/dark. No flip here: the whole card is the link.
  const CLEAKER_FACE = CL + "v1765054949/cleaker.me_gusn1q.png";
  function CleakerQRme({ value, title }) {
    // the name typed into the .me card, as its namespace: name.cleaker.me (reflected, not validated)
    const st = useMeStore();
    const handle = handleOf(st.held ? st.held.name : st.username);
    const where = handle ? `${handle}.${ME_NAMESPACE}` : ME_NAMESPACE;
    // the QR holds the namespace itself (name.cleaker.me), no https:// -- fewer modules, so it stays small
    value = where;
    // uniform scale into the card's tile: the whole mark (QR + "cleaker.me" under it) stays square, no stretch, with a
    // quiet zone around it (~8px a side on desktop, ~2px on phones so it still fills a compact card). No 0.94 cap — on
    // a wide card (212×188 at 1280) that left the QR small in the hole; the limit is the tile's shorter side.
    const grown = grownOf(st);
    const boxRef = React.useRef(null);
    const [fit, setFit] = React.useState(1);
    React.useLayoutEffect(() => {
      const tile = boxRef.current && boxRef.current.parentElement;
      const inner = boxRef.current && boxRef.current.firstElementChild;
      if (!tile || !inner || typeof ResizeObserver === "undefined") return undefined;
      const measure = () => {
        // layout sizes (clientWidth/offsetWidth), not getBoundingClientRect: while the card grows it is animated with a
        // scale transform, and a measure taken mid-animation would read it still small
        const phone = window.matchMedia && window.matchMedia("(max-width:480px)").matches;
        // phones: measure the card, not the auto-sized tile, so the QR can reach nearly to the card's edge as it did
        const box = (phone && tile.closest("a")) || tile;
        const r = { width: box.clientWidth, height: box.clientHeight };
        // the inner box is the unscaled mark (QR.me + its edge label); both sides, so scale stays uniform
        const w = inner.offsetWidth || 112, hh = inner.offsetHeight || w;
        const g = GROW_ENABLED ? qrGrowthOf(st) : 1;
        // `pad` is the total quiet zone (both sides together)
        const pad = phone ? 4 : 16;
        setFit(Math.max(0.3, Math.min(phone ? 3 : 2 * g, (r.width - pad) / w, (r.height - pad) / hh)));
      };
      measure();
      const ro = new ResizeObserver(measure); ro.observe(tile); ro.observe(inner);
      return () => ro.disconnect();
    }, [grown, qrGrowthOf(st), growthOf(st)]);
    // drawn at 112px (its module grid needs the room) and scaled uniformly into the tile; SVG stays sharp as it grows.
    // the mark is taken out of flow (position: absolute) so its unscaled 147px box cannot stretch a compact card;
    // on phones the wrapper keeps a fixed layout size and the visual scale fills the card.
    return h(G.Box, { ref: boxRef, sx: { width: "100%", height: "100%", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 0, minHeight: 0, minWidth: 0,
        [MOBILE]: { width: 78, height: 78 }, [NARROW]: { width: 64, height: 64 } } },
      h(G.Box, { sx: { position: "absolute", left: "50%", top: "50%", flexShrink: 0, aspectRatio: "1 / 1", transform: `translate(-50%, -50%) scale(${fit})`, transformOrigin: "center center", transition: "transform 380ms cubic-bezier(.2,.8,.2,1)" } },
        // the card IS the QR.me: the namespace around its edge (cleaker.me, or name.cleaker.me as it is typed, the root
        // in bold), and on hover it turns over to cleaker's own picture
        // drawn larger for a longer label, so its edge text still fits one line: QR.me's edge font is the square root of
        // the diameter, a character ~0.6 of it, so a label of n characters (+ its status dot) needs a diameter of about
        // (0.66 (n + 2))^2 -- the 0.66 leaves room for QR.me snapping to whole pixels a module
        h(G.QRme, { value, diameter: GROW_ENABLED && where.length > FITS ? Math.round(Math.pow(0.66 * (where.length + 2), 2)) : 112, variant: "md", hoverFlip: true, clickFlip: false, defaultFace: "qr", showAvatarLabel: false,
          // its edge says only cleaker.me: short, never wrapping a corner; the name is in the .me card, where it is typed
          perimeterLabel: ME_NAMESPACE, perimeterRootLabel: ME_NAMESPACE, username: handle || "cleaker", avatarSrc: CLEAKER_FACE, avatarAlt: "cleaker" })));
  }
  // The .me card's "Who am I.": a name field; selecting it brings a secret field under it. Enter with both builds the
  // .me (see the secret-mode note above); held, the card shows the name, a short fingerprint and "destroy".
  function MeIdentityField() {
    const st = useMeStore();
    const [focused, setFocused] = React.useState(false);
    const [secret, setSecret] = React.useState("");
    const [busy, setBusy] = React.useState(false);
    const [error, setError] = React.useState("");
    const secretRef = React.useRef(null);
    const field = (t) => ({ font: "inherit", fontSize: "0.825rem", lineHeight: 1.4, color: t.palette.text.primary, background: "transparent",
      border: 0, borderBottom: `1px dashed ${t.palette.divider}`, outline: "none", width: "100%", padding: 0, height: "1.5em", boxSizing: "border-box",
      "&::placeholder": { color: t.palette.text.secondary, opacity: 1 }, "&:focus": { borderBottomColor: t.palette.primary.main } });
    const open = async () => {
      const name = st.username.trim();
      if (!name || !secret || busy) return;
      setBusy(true); setError("");
      try {
        const lib = await loadMe();
        const ME = lib.default || lib;
        const me = new ME(name, secret, { namespace: ME_NAMESPACE });
        const hash = identityHashOf(me);
        if (!hash) throw new Error("this .me has no identity");
        setSecret("");
        meSet({ held: { name, hash, me } });
      } catch (e) {
        setError(String((e && e.message) || e));
      } finally {
        setBusy(false);
      }
    };
    if (st.held) {
      return h(G.Box, { sx: { display: "flex", alignItems: "center", gap: 1, minWidth: 0, fontSize: "0.825rem", lineHeight: 1.5 } }, [
        h(G.Box, { key: "who", sx: { minWidth: 0, flex: 1, overflow: "hidden" } }, [
          h(G.Box, { key: "n", component: "span", sx: { display: "block", color: "text.primary", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, st.held.name),
          h(G.Box, { key: "h", component: "span", title: st.held.hash, sx: { display: "block", color: "text.secondary", fontFamily: "monospace", fontSize: "0.7rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, st.held.hash.slice(0, 8) + "…" + st.held.hash.slice(-4)),
        ]),
        h(G.Box, { key: "x", component: "button", type: "button", onClick: () => { setSecret(""); meSet({ held: null, username: "" }); },
          sx: { font: "inherit", fontSize: "0.72rem", color: "text.secondary", background: "transparent", border: (t) => `1px solid ${t.palette.divider}`, borderRadius: "999px", px: 1, py: 0.25, cursor: "pointer", flexShrink: 0,
            "&:hover": { color: "error.main", borderColor: "error.main" } } }, "destroy"),
      ]);
    }
    const showSecret = focused || !!st.username || !!secret;
    return h(G.Box, { sx: { display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 },
        onFocus: () => setFocused(true),
        onBlur: (e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); } }, [
      h(G.Box, { key: "name", component: "input", type: "text", value: st.username, placeholder: "username", "aria-label": "username",
        autoComplete: "username", spellCheck: false, autoCapitalize: "none",
        onChange: (e) => meSet({ username: e.target.value }),
        onKeyDown: (e) => { if (e.key === "Enter" && secretRef.current) secretRef.current.focus(); },
        sx: field }),
      showSecret ? h(G.Box, { key: "secret", component: "input", type: "password", ref: secretRef, value: secret, placeholder: busy ? "opening…" : "secret", "aria-label": "secret",
        autoComplete: "current-password", disabled: busy,
        onChange: (e) => setSecret(e.target.value),
        onKeyDown: (e) => { if (e.key === "Enter") open(); },
        sx: field }) : null,
      error ? h(G.Box, { key: "err", component: "span", sx: { color: "error.main", fontSize: "0.7rem" } }, error) : null,
    ]);
  }
  function GrowCard({ children, style }) {
    const st = useMeStore();
    const f = growthOf(st);
    React.useLayoutEffect(() => { playFlip(); }, [f]);
    // the card fills its slot (its own height: 100% would read as auto here and leave it short)
    return h(G.Box, { style: { ...(style || {}), "--grow": f }, sx: { display: "flex", "& > *": { flex: 1, minWidth: 0, height: "auto !important", alignSelf: "stretch" } } }, children);
  }
  // .me and netget. While cleaker keeps a card's height they are two ordinary cards in the row (display: contents; each
  // keeps its place through `order`, netget first in the second row). Once cleaker is tall enough to fit a netget button
  // under .me (.me up to 212px with its secret field, + 16 + 44), they stack in the first column, as tall as cleaker:
  // .me at its own height, netget filling the rest -- a button at first, growing as cleaker grows, so the space under .me
  // is used instead of left empty. Not on phones.
  const STACK_AT = (212 + 16 + 44) / 188;
  function StackBeside({ children }) {
    const st = useMeStore();
    const f = growthOf(st);
    const stacked = f >= STACK_AT;
    return h(G.Box, { "data-stack": "", style: { "--stack-h": f, order: 0 }, sx: stacked
      ? { display: "flex", flexDirection: "column", gap: 2, flex: "0 0 calc((100cqw - 48px) / 4)", height: "calc(188px * var(--stack-h))", minWidth: 0,
          "@container (max-width: 647.98px)": { flex: "0 0 calc((100cqw - 32px) / 3)" },
          "@container (max-width: 481.98px)": { flex: "0 0 calc((100cqw - 16px) / 2)" },
          // over the row's own card sizing (which reaches these too, for the unstacked case)
          "& > *:first-of-type": { flex: "0 0 auto !important", minHeight: "188px !important" },
          "& > *:last-of-type": { flex: "1 1 auto !important", height: "auto !important", minHeight: "44px !important", py: 0.5 },
          [MOBILE]: { display: "contents" } }
      : { display: "contents" } }, children);
  }
  const PAGE_TYPES = { ThemedImg, AudienceMark, NetgetMark, HeaderControls, MeMonad, MonadBubble, CleakerQRme, MeIdentityField, GrowCard, StackBeside };
  // GuiPlayCard is assigned after it is defined (it needs cardSx).

  // ── content (from docs/index.html @ 6bee309) ──
  const STACK = [
    [".me", "Who am I.", "https://neurons-me.github.io/.me/", { monad: true, light: CL + "v1761149332/this.me-removebg-preview_2_j1eoiy.png", dark: CL + "v1760758662/this.me-removebg-preview_fvyeda.png" }],
    ["cleaker", "Here.", "https://neurons-me.github.io/Cleaker/", { qr: "https://cleaker.me", light: CL + "v1765054949/cleaker.me_gusn1q.png" }],
    ["monad", "Daemons.", "https://neurons-me.github.io/monad/", { bubble: true, light: CL + "v1778090977/monad.ai.profile-removebg-preview_np26yp.png" }],
    [".GUI", "Generative UI.", "https://neurons-me.github.io/GUI/", { gui: true }],
    ["netget", "The Gateway.", "https://neurons-me.github.io/netget/", { netget: true }],
    ["mlearning.studio", "Training data.", "https://neurons-me.github.io/mlearning.studio/", { light: "/assets/mlearning-studio-icon.webp" }],
    [".wallet", "for .me", "https://neurons-me.github.io/.wallet/", { wallet: true, light: CL + "v1765902981/this.wallet_giyxtt.webp" }],
    ["All.This", "Learn more...", "https://github.com/neurons-me", { graph: true, light: CL + "v1765903003/all.this_sr55ml.webp" }, true],
  ];
  const SOURCES = [
    ["npm: @neurons.me", "https://www.npmjs.com/org/neurons.me", { light: "https://cdn.simpleicons.org/npm/CB3837" }],
    ["GitHub: neurons-me", "https://github.com/neurons-me", SI("github", "0f1720")],
    ["PyPI: neurons.me", "https://pypi.org/user/neurons.me/", { light: "https://cdn.simpleicons.org/pypi/3775A9" }],
    ["crates.io: neurons-me", "https://crates.io/users/neurons-me", SI("rust", "0f1720")],
  ];
  const MEDIA = "https://neurons-me.github.io/neurons-me/media/";
  const DEMOS = [
    ["Robots that understand .me", "https://neurons-me.github.io/robots/", "https://neurons-me.github.io/.me/Demos/Robots/Space/assets/space-robots-og-4.2.png"],
    ["Smart Cities", "https://neurons-me.github.io/smart-cities/", MEDIA + "smart_cities.gif"],
    ["Social Graphs", "https://neurons-me.github.io/social-graphs/", MEDIA + "SocialGraph.jpg"],
    ["Digital Space Algebra", "https://neurons-me.github.io/digital-space-algebra/", MEDIA + "Encrypted_Audience_Algebra.gif"],
    ["Wallet Split", "https://neurons-me.github.io/.me/Typescript/typedocs/examples/WalletSplit.html", MEDIA + "split_bill_wallet.gif"],
    ["Affinity Model", "https://neurons-me.github.io/.me/Typescript/typedocs/examples/Affinity-Model.html", MEDIA + "affinity_model.gif"],
  ];
  // resource: [title, desc (string | array with {code}), href, icon, chips?]
  // icon: { img: {light,dark} } | { glyph, size } | { mark: true } | { img, plate }
  const code = (t) => ({ code: t });
  const ARCH = [["Identity-Bound Secrets", "Proposed design for private roots, secret scopes, noise, and persistence — with package responsibilities and 11 acceptance criteria.", "https://neurons-me.github.io/architecture/identity-bound-secrets/", { glyph: "🔐", size: "1.6rem" }]];
  const BENCH = [
    ["Benchmarks", "The .me benchmark hub: kernel benchmarks, GTFS / Madrid on real transit data, the performance phases (disk, write pressure, vector search) and secret-scope cost, each with its script and kernel version.", "https://neurons-me.github.io/.me/docs/Benchmarks/", { img: SI("speedtest", "0f1720") }],
  ];
  const NRP = [
    ["NRP · Namespace Resolution Protocol", ["Mesh-aware resolution for ", code("me://"), " paths — discover, score, forward, learn. A living network of monads, not a static DNS table."], "https://neurons-me.github.io/NRP/", { glyph: "○", size: "2.3rem" }],
    ["Axioms · The Kernel's Invariants", ["The non-negotiable guarantees ", code(".me"), " is built on — stealth disclosure, hash-chain integrity, deterministic conflict resolution."], "https://neurons-me.github.io/.me/docs/Axioms.html", { glyph: "𓊽", size: "1.8rem" }],
  ];
  const ESSAYS = [
    ["The Algebra of Encrypted Audiences III", "Two islands, one shared space — the connection between identities emerges from a verifiable intersection between their contexts, not from a central authority.", "https://neurons-me.github.io/encrypted-audiences/", { mark: true },
      [["ES", "https://neurons-me.github.io/algebra_audiencias_cifradas.html"], ["JA", "https://neurons-me.github.io/algebra_of_encrypted_audiences_ja.html"]]],
    ["The Equations — Visual Infographics Edition", "Every original formula on sui.gn, one glossary — context algebra, SpaceStructure, audience algebra, O(k) — imported results clearly marked, not claimed.", "https://neurons-me.github.io/Equations-Visual-Infographics-Edition.html", { glyph: "Σ", size: "1.8rem" },
      [["ES", "https://neurons-me.github.io/Equations-Visual-Infographics-Edition_es.html"], ["JA", "https://neurons-me.github.io/Equations-Visual-Infographics-Edition_ja.html"]]],
    ["Inverted Dependency Indexing — Visualized", "Why changing 1 node in 1,000,000 touches only 6, not 1,000,000 — the .me kernel's reverse index and O(k) mutation cost, in a hand-drawn precision visualization.", "https://neurons-me.github.io/Inverted-Dependency-Indexing-Beautiful-Viz.html", { glyph: "◉", size: "1.6rem" }],
    ["Robots × Encrypted Audiences — Infographic", "One canister, four robots, one context graph — how .me paths let robots share meaning through pointers, mapped onto the algebra of encrypted audiences.", "https://neurons-me.github.io/Robots-%C3%97-Encrypted-Audiences-Infographic.html", { mark: true, small: true }],
    ["Smart Cities — A City That Behaves Like a Living System", "Syntax, Madrid GTFS, and human fares — city data as live .me dependencies. Start at the Smart Cities hub.", "https://neurons-me.github.io/smart-cities/", { glyph: "🏙️", size: "1.6rem" }],
    ["me.explain() — Why Did You Say That?", "AI chain-of-thought is generated narration, not a record of computation. me.explain() is a verifiable lookup into the actual dependency graph — story vs. ledger.", "https://neurons-me.github.io/me.explain.why.did.you.say.that.html", { glyph: "🔍", size: "1.6rem" }],
    ["me.explain(path)", "The minimal version: the call, the return shape, one line on what it means — for when you just need the syntax.", "https://neurons-me.github.io/me.explain.html", { glyph: "🔍", size: "1.6rem" }],
    ["me.whatever(what)", "The calling syntax of .me — Subject-Verb-Object path calls and the operator table (@, _, ~, ->, =, ?, -), minimal.", "https://neurons-me.github.io/me.whatever.what.html", { glyph: "🔤", size: "1.6rem" }],
    ["Namespace", "Which tree of meaning you're addressing — <handle>.<root>, resolved from identity, never guessed from the URL.", "https://neurons-me.github.io/Namespace.html", { glyph: "🧭", size: "1.6rem" }],
    ["Get .me started", "Install .me and build your first kernel — TypeScript, Rust, or Python (not yet available), one clone away.", "https://neurons-me.github.io/Get.me.started.html", { glyph: "🚀", size: "1.6rem" }],
    ["SEED → Monad — Minimal, Pure, Sovereign", "What a seed actually is, what grows from it — identityHash, the monad bubble — and what it does not protect.", "https://neurons-me.github.io/SEED-Monad-Minimal.html", { glyph: "◎", size: "1.6rem" }],
    ["README-—-Zero-Marketing.html", "me.users.ana.age(22) me.people[\"[i]\"][\"=\"](\"isAdult\",\"age>=18\") me(\"people[age>=18].name\")", "https://neurons-me.github.io/README-—-Zero-Marketing.html", { glyph: "∴", size: "1.6rem" }],
  ];
  const NETWORK = [["neurons.me", "The live network. Run a monad. Claim your namespace.", "https://neurons.me", { img: { light: CL + "v1760629040/media.neurons.me_copy_tgilfg.png" }, plate: "#e8edf2" }]];

  // ── builders ──
  const label = (text, extra) => N("Typography", { variant: "overline", component: "h2", color: "text.secondary",
    sx: { display: "block", letterSpacing: "0.14em", fontWeight: 700, lineHeight: 1.6, fontSize: "0.7rem", ...(extra || {}) } }, [text]);
  const section = (title, grid) => N("Box", { component: "section", sx: { mt: 5 } }, [label(title, { mb: 1.75 }), grid]);
  const grid = (cols, children, extra) => N("Box", { sx: {
    display: "grid", gap: 2,
    // minmax(0, 1fr), not 1fr: a plain 1fr column grows to its longest unbreakable word (an essay's file name), and that
    // widened the whole page column past the screen, cutting off every section on narrow windows
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    ...(cols > 2 ? { [TABLET]: { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" } } : {}),
    [MOBILE]: { gridTemplateColumns: "1fr" },
    ...(extra || {}) } }, children);
  const cardSx = { textDecoration: "none", color: "inherit", height: "100%", borderRadius: "12px", minWidth: 0, overflowWrap: "anywhere",
    transition: "box-shadow 130ms ease, border-color 130ms ease, transform 130ms ease",
    "&:hover": { borderColor: "primary.main", boxShadow: 3, transform: "translateY(-1px)", textDecoration: "none" } };
  const descNode = (d) => N("Typography", { variant: "body2", color: "text.secondary", sx: { fontSize: "0.78rem", lineHeight: 1.4 } },
    (Array.isArray(d) ? d : [d]).map((x) => typeof x === "string" ? x
      : N("Box", { component: "code", sx: { fontFamily: "monospace", fontSize: "0.95em", px: 0.5, borderRadius: 1, bgcolor: "action.hover" } }, [x.code])));
  const iconBox = (icon) => {
    const inner = icon.img ? N("ThemedImg", { ...icon.img, sx: { width: 38, height: 38, objectFit: "contain" } })
      : icon.mark ? N("AudienceMark", icon.small ? { width: 34, height: 27 } : {})
      : N("Typography", { component: "span", sx: { fontSize: icon.size || "1.6rem", lineHeight: 1 } }, [icon.glyph]);
    return N("Box", { sx: { width: 50, height: 50, borderRadius: "10px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
      ...(icon.plate ? { bgcolor: icon.plate } : HOLE) } }, [inner]);
  };
  const resourceCard = ([title, desc, href, icon, chips]) => {
    const card = N("Card", { component: "a", href, variant: "outlined", sx: { ...cardSx, display: "flex", alignItems: "center", gap: 1.75, px: 2, py: 1.75, minHeight: 78 } }, [
      iconBox(icon),
      N("Box", { sx: { display: "flex", flexDirection: "column", minWidth: 0, flex: 1, gap: 0.25, ...(chips ? { pr: 8 } : {}) } }, [
        N("Typography", { variant: "subtitle2", sx: { fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.3 } }, [title]),
        descNode(desc),
      ]),
    ]);
    if (!chips) return card;
    return N("Box", { sx: { position: "relative" } }, [card,
      N("Box", { sx: { position: "absolute", top: 14, right: 14, display: "flex", gap: 0.75 } },
        chips.map(([t, u]) => N("Chip", { label: t, component: "a", href: u, clickable: true, size: "small", color: "primary", variant: "outlined", sx: { fontWeight: 700, fontSize: "0.68rem", height: 22 } })))]);
  };
  // a Stack card's description: two lines at most (the row's cards keep one height); longer text ends in "…"
  const TWO_LINES = { display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" };
  // .wallet: what a wallet holds, drawn as a .me graph. "+" (the wallet, open to more) is the root node in the tile's
  // bottom-left corner, over the "." of ".wallet"; its nodes branch from it within 90 degrees (up to right) on a quarter
  // ellipse that uses the tile's width. Currencies are coins in the theme's primary color, symbol cut out in the page's
  // own color: the dollar ($, and its stablecoins), Ethereum (the chain .wallet speaks today, the largest), Bitcoin
  // faded (not implemented yet). Institutions are another kind of node: PayPal (the provider .wallet integrates today,
  // its monogram) as a square card that keeps PayPal's own colors (a brand, not a currency), on a dashed edge -- a relation, not something held.
  // Stripe or a bank join as more squares.
  const WALLET_SVG = '<svg viewBox="0 0 120 100" preserveAspectRatio="xMinYMax meet" xmlns="http://www.w3.org/2000/svg"><line class="wl-line" x1="12.4" y1="78.1" x2="18.8" y2="32.2"/><line class="wl-line" x1="17.5" y1="80.4" x2="48.5" y2="44.4"/><g opacity=".4"><line class="wl-line" x1="20.2" y1="84.1" x2="79.4" y2="59.4"/></g><line class="wl-line" x1="21.0" y1="87.6" x2="89.0" y2="84.9" stroke-dasharray="3 2.4"/><circle class="wl-root" cx="11" cy="88" r="10" fill="none" stroke-width="2.2"/><path class="wl-root-plus" d="M6 88 h10 M11 83 v10" stroke-width="2.6" stroke-linecap="round"/><circle class="wl-edge" cx="20.8" cy="18.8" r="14"/><circle class="wl-coin" cx="20.8" cy="17.4" r="14"/><circle cx="20.8" cy="17.4" r="12.0" fill="none" class="wl-ring" stroke-width="0.89"/><text class="wl-sym" x="20.8" y="17.4" text-anchor="middle" dominant-baseline="central" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="19.1">$</text><circle class="wl-edge" cx="62.2" cy="30.5" r="20"/><circle class="wl-coin" cx="62.2" cy="28.5" r="20"/><circle cx="62.2" cy="28.5" r="17.1" fill="none" class="wl-ring" stroke-width="1.27"/><g transform="translate(62.2 28.5) scale(0.909)"><path class="wl-sym" d="M0 -14 L9 1 L0 6 L-9 1 Z"/><path class="wl-sym" d="M0 8.5 L9 3.2 L0 15 L-9 3.2 Z" opacity=".85"/></g><g opacity=".4"><circle class="wl-edge" cx="93.2" cy="55.0" r="14"/><circle class="wl-coin" cx="93.2" cy="53.6" r="14"/><circle cx="93.2" cy="53.6" r="12.0" fill="none" class="wl-ring" stroke-width="0.89"/><text class="wl-sym" x="93.2" y="53.6" text-anchor="middle" dominant-baseline="central" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="19.1">₿</text></g><rect class="wl-pp-edge" x="91.4" y="72.8" width="27" height="27" rx="6.5"/><rect class="wl-pp" x="91.4" y="70.8" width="27" height="27" rx="6.5"/><g transform="translate(95.6 74.8) scale(0.372)"><path fill-rule="evenodd" d="M38.168 13.352c-1.596-.842-3.535-1.346-5.644-1.346h-12.6l-4.218 26.92H6.413L12 3.032h15.05c5.065 0 9.056 2.827 10.518 6.755a9.643 9.643 0 0 1 .6 3.565Z" class="pp1"/><path d="M43.527 23.671A12.848 12.848 0 0 1 30.814 34.44h-5.188L23.459 47.9h-9.235l1.482-8.973 1.747-11.148.363-2.312h7.468c7.753 0 12.884-6.562 12.884-12.114l.005.002c3.817 1.964 6.038 5.944 5.354 10.317Z" class="pp2"/><path d="M38.167 13.352c-1.596-.841-3.534-1.346-5.644-1.346H19.924l-2.11 13.46h7.47c7.752 0 12.883-6.562 12.883-12.114Z" class="pp3"/></g></svg>';
  const WalletTile = () => N("Box", { "aria-hidden": "true", sx: { width: "100%", height: ICON.tile, borderRadius: "18px", ...HOLE, flexShrink: 0, p: "6px", boxSizing: "border-box",
      "& svg": { width: "100%", height: "100%", display: "block" },
      // PayPal keeps its own colors (a brand, not a currency), in its two official versions: light mode, its
      // monogram's three blues on a white square; dark mode, its dark blue square with the monogram in white
      "& .wl-pp": { fill: (t) => t.palette.mode === "dark" ? "#002991" : "#ffffff" },
      "& .wl-pp-edge": { fill: (t) => t.palette.mode === "dark" ? "#00124a" : "#9aa6b2" },
      "& .pp1": { fill: (t) => t.palette.mode === "dark" ? "#ffffff" : "#002991" },
      "& .pp2": { fill: (t) => t.palette.mode === "dark" ? "rgba(255,255,255,0.55)" : "#60CDFF" },
      "& .pp3": { fill: (t) => t.palette.mode === "dark" ? "rgba(255,255,255,0.8)" : "#008CFF" },
      "& .wl-coin": { fill: (t) => t.palette.primary.main },
      "& .wl-edge": { fill: (t) => t.palette.primary.main, filter: "brightness(0.6)" },
      "& .wl-ring": { stroke: (t) => t.palette.background.default, strokeOpacity: 0.35 },
      "& .wl-sym": { fill: (t) => t.palette.background.default },
      "& .wl-line": { stroke: (t) => t.palette.text.secondary, strokeOpacity: 0.55, strokeWidth: 1.3 },
      "& .wl-root, & .wl-root-plus": { stroke: (t) => t.palette.primary.main },
      [MOBILE]: { width: ICON.small.tile, height: ICON.small.tile, borderRadius: "14px" } },
    dangerouslySetInnerHTML: { __html: WALLET_SVG } });
  // All.This: one light becoming many. Left, a cold field in the theme's primary color -- pixel stars and floating
  // isometric cubes -- and one thin beam reaching a burst of light (a glow, rays of uneven length, a white core). Right,
  // the burst opens into organic strands in the theme's palette (primary, secondary, info, success, warning, error),
  // some branching, ending in glowing nodes, small cubes or diamonds among colored specks. Generated once with a fixed
  // seed (so it never changes between loads); colors read from the active theme. The tile as wide as the card.
  const ALLTHIS_SVG = '<svg viewBox="0 0 180 130" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="at-glow"><stop offset="0" class="at-glow0"/><stop offset=".3" class="at-glow1"/><stop offset="1" class="at-glow2"/></radialGradient></defs><rect class="at-star" x="36.5" y="72.4" width="1.6" height="1.6" opacity="0.52"/><rect class="at-star" x="66.3" y="26.5" width="1.6" height="1.6" opacity="0.63"/><rect class="at-star" x="61.7" y="14.7" width="1.2" height="1.2" opacity="0.34"/><rect class="at-star" x="42.9" y="113.4" width="0.9" height="0.9" opacity="0.61"/><rect class="at-star" x="32.3" y="59.2" width="0.9" height="0.9" opacity="0.62"/><rect class="at-star" x="64.5" y="10.8" width="0.9" height="0.9" opacity="0.36"/><rect class="at-star" x="20.9" y="6.7" width="1.6" height="1.6" opacity="0.45"/><rect class="at-star" x="46.7" y="27.2" width="0.9" height="0.9" opacity="0.63"/><rect class="at-star" x="40.0" y="85.1" width="1.6" height="1.6" opacity="0.64"/><rect class="at-star" x="33.1" y="71.4" width="0.9" height="0.9" opacity="0.67"/><rect class="at-star" x="26.3" y="31.5" width="1.2" height="1.2" opacity="0.27"/><rect class="at-star" x="44.7" y="16.4" width="0.9" height="0.9" opacity="0.76"/><rect class="at-star" x="31.6" y="121.8" width="0.9" height="0.9" opacity="0.38"/><rect class="at-star" x="71.6" y="9.5" width="1.6" height="1.6" opacity="0.84"/><rect class="at-star" x="32.4" y="12.1" width="0.9" height="0.9" opacity="0.72"/><rect class="at-star" x="23.0" y="13.8" width="1.2" height="1.2" opacity="0.26"/><rect class="at-star" x="33.3" y="117.4" width="0.9" height="0.9" opacity="0.40"/><rect class="at-star" x="10.5" y="10.4" width="1.6" height="1.6" opacity="0.36"/><rect class="at-star" x="44.4" y="58.5" width="0.9" height="0.9" opacity="0.84"/><rect class="at-star" x="59.9" y="55.0" width="1.6" height="1.6" opacity="0.32"/><rect class="at-star" x="34.1" y="29.4" width="1.2" height="1.2" opacity="0.77"/><rect class="at-star" x="75.1" y="76.5" width="0.9" height="0.9" opacity="0.38"/><rect class="at-star" x="32.2" y="108.9" width="0.9" height="0.9" opacity="0.28"/><rect class="at-star" x="13.8" y="57.8" width="0.9" height="0.9" opacity="0.71"/><rect class="at-star" x="27.3" y="39.7" width="0.9" height="0.9" opacity="0.29"/><rect class="at-star" x="18.4" y="81.9" width="0.9" height="0.9" opacity="0.61"/><rect class="at-star" x="30.5" y="59.2" width="1.6" height="1.6" opacity="0.75"/><rect class="at-star" x="13.0" y="50.9" width="0.9" height="0.9" opacity="0.44"/><rect class="at-star" x="19.9" y="78.7" width="0.9" height="0.9" opacity="0.35"/><rect class="at-star" x="49.5" y="71.7" width="1.6" height="1.6" opacity="0.78"/><rect class="at-star" x="47.7" y="55.3" width="0.9" height="0.9" opacity="0.32"/><rect class="at-star" x="40.9" y="34.6" width="1.6" height="1.6" opacity="0.40"/><rect class="at-star" x="64.0" y="77.0" width="1.2" height="1.2" opacity="0.56"/><rect class="at-star" x="71.8" y="124.2" width="0.9" height="0.9" opacity="0.39"/><rect class="at-star" x="44.4" y="108.7" width="0.9" height="0.9" opacity="0.42"/><rect class="at-star" x="70.9" y="28.3" width="0.9" height="0.9" opacity="0.29"/><rect class="at-star" x="33.4" y="33.9" width="0.9" height="0.9" opacity="0.36"/><rect class="at-star" x="30.3" y="73.9" width="0.9" height="0.9" opacity="0.31"/><rect class="at-star" x="13.2" y="58.8" width="1.2" height="1.2" opacity="0.64"/><rect class="at-star" x="54.2" y="75.5" width="0.9" height="0.9" opacity="0.60"/><rect class="at-star" x="71.3" y="61.9" width="1.2" height="1.2" opacity="0.67"/><rect class="at-star" x="74.2" y="5.6" width="0.9" height="0.9" opacity="0.54"/><rect class="at-star" x="57.1" y="42.5" width="0.9" height="0.9" opacity="0.30"/><rect class="at-star" x="43.4" y="94.4" width="0.9" height="0.9" opacity="0.73"/><rect class="at-star" x="70.7" y="46.6" width="1.6" height="1.6" opacity="0.79"/><rect class="at-star" x="67.5" y="54.7" width="0.9" height="0.9" opacity="0.77"/><rect class="at-star" x="45.4" y="80.5" width="1.6" height="1.6" opacity="0.48"/><rect class="at-star" x="3.9" y="12.0" width="0.9" height="0.9" opacity="0.63"/><rect class="at-star" x="76.5" y="112.1" width="1.2" height="1.2" opacity="0.48"/><rect class="at-star" x="57.4" y="75.0" width="1.6" height="1.6" opacity="0.53"/><rect class="at-star" x="43.1" y="67.3" width="0.9" height="0.9" opacity="0.44"/><rect class="at-star" x="9.5" y="5.8" width="0.9" height="0.9" opacity="0.55"/><rect class="at-star" x="48.5" y="117.1" width="1.2" height="1.2" opacity="0.79"/><rect class="at-star" x="30.2" y="20.8" width="0.9" height="0.9" opacity="0.56"/><rect class="at-star" x="58.8" y="45.5" width="1.6" height="1.6" opacity="0.55"/><rect class="at-star" x="20.9" y="53.2" width="1.2" height="1.2" opacity="0.37"/><rect class="at-star" x="34.9" y="102.9" width="0.9" height="0.9" opacity="0.78"/><rect class="at-star" x="31.4" y="75.3" width="1.2" height="1.2" opacity="0.38"/><rect class="at-star" x="13.0" y="46.5" width="0.9" height="0.9" opacity="0.68"/><rect class="at-star" x="73.3" y="37.3" width="0.9" height="0.9" opacity="0.32"/><rect class="at-star" x="37.9" y="117.8" width="1.6" height="1.6" opacity="0.48"/><rect class="at-star" x="41.5" y="86.3" width="1.6" height="1.6" opacity="0.44"/><rect class="at-star" x="64.3" y="37.5" width="0.9" height="0.9" opacity="0.66"/><rect class="at-star" x="23.8" y="46.9" width="0.9" height="0.9" opacity="0.63"/><rect class="at-star" x="33.0" y="26.5" width="1.2" height="1.2" opacity="0.39"/><rect class="at-star" x="13.4" y="8.8" width="0.9" height="0.9" opacity="0.52"/><rect class="at-star" x="49.6" y="84.2" width="1.2" height="1.2" opacity="0.83"/><rect class="at-star" x="53.7" y="27.7" width="1.6" height="1.6" opacity="0.40"/><rect class="at-star" x="55.9" y="96.6" width="0.9" height="0.9" opacity="0.36"/><rect class="at-star" x="23.2" y="45.9" width="0.9" height="0.9" opacity="0.49"/><rect class="at-star" x="61.6" y="115.4" width="0.9" height="0.9" opacity="0.50"/><rect class="at-star" x="69.1" y="51.1" width="1.6" height="1.6" opacity="0.52"/><rect class="at-star" x="49.3" y="115.8" width="1.6" height="1.6" opacity="0.58"/><rect class="at-star" x="51.3" y="65.3" width="1.2" height="1.2" opacity="0.53"/><rect class="at-star" x="51.2" y="28.4" width="0.9" height="0.9" opacity="0.38"/><rect class="at-star" x="69.6" y="124.6" width="1.2" height="1.2" opacity="0.57"/><rect class="at-star" x="61.5" y="42.7" width="0.9" height="0.9" opacity="0.46"/><rect class="at-star" x="9.1" y="57.7" width="1.6" height="1.6" opacity="0.71"/><rect class="at-star" x="39.1" y="6.5" width="0.9" height="0.9" opacity="0.51"/><rect class="at-star" x="5.6" y="69.1" width="0.9" height="0.9" opacity="0.53"/><rect class="at-star" x="77.0" y="114.7" width="1.6" height="1.6" opacity="0.82"/><rect class="at-star" x="39.5" y="120.7" width="0.9" height="0.9" opacity="0.70"/><rect class="at-star" x="35.5" y="72.3" width="0.9" height="0.9" opacity="0.56"/><rect class="at-star" x="65.4" y="72.4" width="1.2" height="1.2" opacity="0.65"/><rect class="at-star" x="73.7" y="110.9" width="0.9" height="0.9" opacity="0.43"/><rect class="at-star" x="13.4" y="70.5" width="1.2" height="1.2" opacity="0.59"/><rect class="at-star" x="17.9" y="69.5" width="0.9" height="0.9" opacity="0.61"/><rect class="at-star" x="5.1" y="123.2" width="1.6" height="1.6" opacity="0.58"/><rect class="at-star" x="76.2" y="18.1" width="0.9" height="0.9" opacity="0.66"/><rect class="at-star" x="7.9" y="69.8" width="1.6" height="1.6" opacity="0.80"/><path class="at-cube-t" d="M36.0 24.0 l5.5 -3.2 l5.5 3.2 l-5.5 3.2 Z"/><path class="at-cube-l" d="M36.0 24.0 l5.5 3.2 v5.5 l-5.5 -3.2 Z"/><path class="at-cube-r" d="M41.5 27.2 l5.5 -3.2 v5.5 l-5.5 3.2 Z"/><path class="at-cube-t" d="M50.0 96.0 l4.4 -2.6 l4.4 2.6 l-4.4 2.6 Z"/><path class="at-cube-l" d="M50.0 96.0 l4.4 2.6 v4.4 l-4.4 -2.6 Z"/><path class="at-cube-r" d="M54.4 98.6 l4.4 -2.6 v4.4 l-4.4 2.6 Z"/><path class="at-cube-t" d="M60.0 40.0 l3.0 -1.7 l3.0 1.7 l-3.0 1.7 Z"/><path class="at-cube-l" d="M60.0 40.0 l3.0 1.7 v3.0 l-3.0 -1.7 Z"/><path class="at-cube-r" d="M63.0 41.7 l3.0 -1.7 v3.0 l-3.0 1.7 Z"/><path class="at-cube-t" d="M40.0 62.0 l2.8 -1.6 l2.8 1.6 l-2.8 1.6 Z"/><path class="at-cube-l" d="M40.0 62.0 l2.8 1.6 v2.8 l-2.8 -1.6 Z"/><path class="at-cube-r" d="M42.8 63.6 l2.8 -1.6 v2.8 l-2.8 1.6 Z"/><path class="at-cube-t" d="M66.0 112.0 l2.4 -1.4 l2.4 1.4 l-2.4 1.4 Z"/><path class="at-cube-l" d="M66.0 112.0 l2.4 1.4 v2.4 l-2.4 -1.4 Z"/><path class="at-cube-r" d="M68.4 113.4 l2.4 -1.4 v2.4 l-2.4 1.4 Z"/><path class="at-cube-t" d="M56.0 12.0 l2.2 -1.3 l2.2 1.3 l-2.2 1.3 Z"/><path class="at-cube-l" d="M56.0 12.0 l2.2 1.3 v2.2 l-2.2 -1.3 Z"/><path class="at-cube-r" d="M58.2 13.3 l2.2 -1.3 v2.2 l-2.2 1.3 Z"/><path class="at-cube-t" d="M38.0 118.0 l2.0 -1.2 l2.0 1.2 l-2.0 1.2 Z"/><path class="at-cube-l" d="M38.0 118.0 l2.0 1.2 v2.0 l-2.0 -1.2 Z"/><path class="at-cube-r" d="M40.0 119.2 l2.0 -1.2 v2.0 l-2.0 1.2 Z"/><path class="at-cube-t" d="M10.0 40.0 l4.6 -2.7 l4.6 2.7 l-4.6 2.7 Z"/><path class="at-cube-l" d="M10.0 40.0 l4.6 2.7 v4.6 l-4.6 -2.7 Z"/><path class="at-cube-r" d="M14.6 42.7 l4.6 -2.7 v4.6 l-4.6 2.7 Z"/><path class="at-cube-t" d="M18.0 86.0 l3.4 -2.0 l3.4 2.0 l-3.4 2.0 Z"/><path class="at-cube-l" d="M18.0 86.0 l3.4 2.0 v3.4 l-3.4 -2.0 Z"/><path class="at-cube-r" d="M21.4 88.0 l3.4 -2.0 v3.4 l-3.4 2.0 Z"/><path class="at-cube-t" d="M6.0 110.0 l2.6 -1.5 l2.6 1.5 l-2.6 1.5 Z"/><path class="at-cube-l" d="M6.0 110.0 l2.6 1.5 v2.6 l-2.6 -1.5 Z"/><path class="at-cube-r" d="M8.6 111.5 l2.6 -1.5 v2.6 l-2.6 1.5 Z"/><path class="at-cube-t" d="M22.0 14.0 l2.4 -1.4 l2.4 1.4 l-2.4 1.4 Z"/><path class="at-cube-l" d="M22.0 14.0 l2.4 1.4 v2.4 l-2.4 -1.4 Z"/><path class="at-cube-r" d="M24.4 15.4 l2.4 -1.4 v2.4 l-2.4 1.4 Z"/><path class="at-beam" d="M2 82.0 C 30 88.0, 58 64.0, 81.0 66.0" fill="none" stroke-width=".9"/><g fill="none" stroke-linecap="round"><path class="at-c0" d="M86.0 66.0 C88.7 47.1 83.9 27.0 95.3 8.9" stroke-width="0.97"/><path class="at-c1" d="M86.0 66.0 C75.2 38.5 99.3 27.6 112.2 10.6" stroke-width="1.17"/><path class="at-c2" d="M92.2 31.9 C90.4 15.5 100.1 10.7 114.3 10.2" stroke-width="0.88"/><path class="at-c2" d="M86.0 66.0 C85.2 48.2 101.6 41.2 109.7 28.5" stroke-width="1.31"/><path class="at-c3" d="M86.0 66.0 C109.2 61.7 123.9 47.7 132.3 25.5" stroke-width="1.24"/><path class="at-c4" d="M86.0 66.0 C101.0 62.4 112.1 52.2 124.3 43.0" stroke-width="1.38"/><path class="at-c5" d="M86.0 66.0 C105.2 60.6 124.4 55.3 141.5 43.3" stroke-width="0.95"/><path class="at-c1" d="M117.4 56.1 C123.7 66.2 134.7 52.5 141.7 60.8" stroke-width="0.71"/><path class="at-c0" d="M86.0 66.0 C112.1 85.2 125.7 36.0 152.2 53.8" stroke-width="0.87"/><path class="at-c2" d="M122.0 58.1 C133.1 61.3 143.6 68.1 156.3 63.7" stroke-width="0.65"/><path class="at-c1" d="M86.0 66.0 C104.0 49.3 118.6 72.0 135.8 70.4" stroke-width="1.36"/><path class="at-c3" d="M113.6 63.6 C120.4 66.8 125.5 73.3 134.1 73.2" stroke-width="1.02"/><path class="at-c2" d="M86.0 66.0 C106.5 49.4 117.5 75.4 134.5 76.8" stroke-width="0.87"/><path class="at-c3" d="M86.0 66.0 C111.2 59.8 114.5 100.1 141.3 92.0" stroke-width="0.93"/><path class="at-c4" d="M86.0 66.0 C87.5 103.6 125.4 92.4 143.5 109.0" stroke-width="0.84"/><path class="at-c5" d="M86.0 66.0 C99.7 77.8 104.2 96.9 119.3 108.2" stroke-width="1.16"/><path class="at-c1" d="M103.5 89.6 C110.9 89.4 117.3 91.9 123.1 96.5" stroke-width="0.87"/><path class="at-c0" d="M86.0 66.0 C80.0 91.0 111.8 98.3 111.9 121.1" stroke-width="0.87"/><path class="at-c2" d="M98.9 96.7 C92.0 104.2 103.3 112.5 97.8 120.3" stroke-width="0.65"/><path class="at-c1" d="M86.0 66.0 C72.6 88.7 98.1 104.5 96.6 125.7" stroke-width="1.34"/></g><rect class="at-n0" x="94.0" y="7.6" width="2.6" height="2.6" transform="rotate(45 95.3 8.9)"/><g class="at-ncube2"><path class="at-cube-t" d="M112.1 10.2 l2.2 -1.3 l2.2 1.3 l-2.2 1.3 Z"/><path class="at-cube-l" d="M112.1 10.2 l2.2 1.3 v2.2 l-2.2 -1.3 Z"/><path class="at-cube-r" d="M114.3 11.5 l2.2 -1.3 v2.2 l-2.2 1.3 Z"/></g><g class="at-ncube1"><path class="at-cube-t" d="M110.0 10.6 l2.2 -1.3 l2.2 1.3 l-2.2 1.3 Z"/><path class="at-cube-l" d="M110.0 10.6 l2.2 1.3 v2.2 l-2.2 -1.3 Z"/><path class="at-cube-r" d="M112.2 11.9 l2.2 -1.3 v2.2 l-2.2 1.3 Z"/></g><g class="at-ncube2"><path class="at-cube-t" d="M107.5 28.5 l2.2 -1.3 l2.2 1.3 l-2.2 1.3 Z"/><path class="at-cube-l" d="M107.5 28.5 l2.2 1.3 v2.2 l-2.2 -1.3 Z"/><path class="at-cube-r" d="M109.7 29.8 l2.2 -1.3 v2.2 l-2.2 1.3 Z"/></g><circle class="at-n3" cx="132.3" cy="25.5" r="3.4" opacity=".28"/><circle class="at-n3" cx="132.3" cy="25.5" r="1.7"/><g class="at-ncube4"><path class="at-cube-t" d="M122.1 43.0 l2.2 -1.3 l2.2 1.3 l-2.2 1.3 Z"/><path class="at-cube-l" d="M122.1 43.0 l2.2 1.3 v2.2 l-2.2 -1.3 Z"/><path class="at-cube-r" d="M124.3 44.3 l2.2 -1.3 v2.2 l-2.2 1.3 Z"/></g><circle class="at-n1" cx="141.7" cy="60.8" r="3.4" opacity=".28"/><circle class="at-n1" cx="141.7" cy="60.8" r="1.7"/><circle class="at-n5" cx="141.5" cy="43.3" r="3.4" opacity=".28"/><circle class="at-n5" cx="141.5" cy="43.3" r="1.7"/><circle class="at-n2" cx="156.3" cy="63.7" r="3.4" opacity=".28"/><circle class="at-n2" cx="156.3" cy="63.7" r="1.7"/><circle class="at-n0" cx="152.2" cy="53.8" r="3.4" opacity=".28"/><circle class="at-n0" cx="152.2" cy="53.8" r="1.7"/><circle class="at-n3" cx="134.1" cy="73.2" r="3.4" opacity=".28"/><circle class="at-n3" cx="134.1" cy="73.2" r="1.7"/><g class="at-ncube1"><path class="at-cube-t" d="M133.6 70.4 l2.2 -1.3 l2.2 1.3 l-2.2 1.3 Z"/><path class="at-cube-l" d="M133.6 70.4 l2.2 1.3 v2.2 l-2.2 -1.3 Z"/><path class="at-cube-r" d="M135.8 71.7 l2.2 -1.3 v2.2 l-2.2 1.3 Z"/></g><g class="at-ncube2"><path class="at-cube-t" d="M132.3 76.8 l2.2 -1.3 l2.2 1.3 l-2.2 1.3 Z"/><path class="at-cube-l" d="M132.3 76.8 l2.2 1.3 v2.2 l-2.2 -1.3 Z"/><path class="at-cube-r" d="M134.5 78.1 l2.2 -1.3 v2.2 l-2.2 1.3 Z"/></g><circle class="at-n3" cx="141.3" cy="92.0" r="3.4" opacity=".28"/><circle class="at-n3" cx="141.3" cy="92.0" r="1.7"/><rect class="at-n4" x="142.2" y="107.7" width="2.6" height="2.6" transform="rotate(45 143.5 109.0)"/><g class="at-ncube1"><path class="at-cube-t" d="M120.9 96.5 l2.2 -1.3 l2.2 1.3 l-2.2 1.3 Z"/><path class="at-cube-l" d="M120.9 96.5 l2.2 1.3 v2.2 l-2.2 -1.3 Z"/><path class="at-cube-r" d="M123.1 97.8 l2.2 -1.3 v2.2 l-2.2 1.3 Z"/></g><circle class="at-n5" cx="119.3" cy="108.2" r="3.4" opacity=".28"/><circle class="at-n5" cx="119.3" cy="108.2" r="1.7"/><g class="at-ncube2"><path class="at-cube-t" d="M95.6 120.3 l2.2 -1.3 l2.2 1.3 l-2.2 1.3 Z"/><path class="at-cube-l" d="M95.6 120.3 l2.2 1.3 v2.2 l-2.2 -1.3 Z"/><path class="at-cube-r" d="M97.8 121.6 l2.2 -1.3 v2.2 l-2.2 1.3 Z"/></g><g class="at-ncube0"><path class="at-cube-t" d="M109.7 121.1 l2.2 -1.3 l2.2 1.3 l-2.2 1.3 Z"/><path class="at-cube-l" d="M109.7 121.1 l2.2 1.3 v2.2 l-2.2 -1.3 Z"/><path class="at-cube-r" d="M111.9 122.4 l2.2 -1.3 v2.2 l-2.2 1.3 Z"/></g><g class="at-ncube1"><path class="at-cube-t" d="M94.4 125.7 l2.2 -1.3 l2.2 1.3 l-2.2 1.3 Z"/><path class="at-cube-l" d="M94.4 125.7 l2.2 1.3 v2.2 l-2.2 -1.3 Z"/><path class="at-cube-r" d="M96.6 127.0 l2.2 -1.3 v2.2 l-2.2 1.3 Z"/></g><rect class="at-n5" x="125.1" y="126.0" width="1.1" height="1.1" opacity="0.51"/><rect class="at-n4" x="102.2" y="52.2" width="1.1" height="1.1" opacity="0.41"/><rect class="at-n2" x="144.3" y="94.1" width="1.1" height="1.1" opacity="0.62"/><rect class="at-n5" x="134.9" y="96.9" width="1.1" height="1.1" opacity="0.59"/><rect class="at-n2" x="100.4" y="34.6" width="1.1" height="1.1" opacity="0.68"/><rect class="at-n4" x="135.2" y="122.0" width="1.1" height="1.1" opacity="0.82"/><rect class="at-n5" x="100.5" y="58.2" width="1.1" height="1.1" opacity="0.44"/><rect class="at-n0" x="142.8" y="96.6" width="1.1" height="1.1" opacity="0.59"/><rect class="at-n1" x="171.8" y="51.1" width="1.1" height="1.1" opacity="0.83"/><rect class="at-n3" x="138.1" y="76.8" width="1.1" height="1.1" opacity="0.87"/><rect class="at-n4" x="127.8" y="68.3" width="1.1" height="1.1" opacity="0.56"/><rect class="at-n2" x="137.1" y="63.0" width="1.1" height="1.1" opacity="0.68"/><rect class="at-n2" x="116.1" y="91.4" width="1.1" height="1.1" opacity="0.41"/><rect class="at-n5" x="157.7" y="75.5" width="1.1" height="1.1" opacity="0.48"/><rect class="at-n2" x="156.1" y="51.6" width="1.1" height="1.1" opacity="0.77"/><rect class="at-n2" x="96.3" y="124.6" width="1.1" height="1.1" opacity="0.44"/><rect class="at-n3" x="169.0" y="56.4" width="1.1" height="1.1" opacity="0.53"/><rect class="at-n0" x="156.2" y="9.5" width="1.1" height="1.1" opacity="0.87"/><rect class="at-n1" x="153.4" y="61.1" width="1.1" height="1.1" opacity="0.70"/><rect class="at-n3" x="101.8" y="80.2" width="1.1" height="1.1" opacity="0.46"/><rect class="at-n1" x="165.2" y="47.5" width="1.1" height="1.1" opacity="0.46"/><rect class="at-n3" x="129.6" y="85.5" width="1.1" height="1.1" opacity="0.70"/><rect class="at-n2" x="146.4" y="87.2" width="1.1" height="1.1" opacity="0.79"/><rect class="at-n2" x="137.1" y="125.7" width="1.1" height="1.1" opacity="0.77"/><rect class="at-n2" x="112.3" y="17.9" width="1.1" height="1.1" opacity="0.79"/><rect class="at-n2" x="145.1" y="47.8" width="1.1" height="1.1" opacity="0.70"/><rect class="at-n1" x="153.6" y="89.3" width="1.1" height="1.1" opacity="0.72"/><rect class="at-n1" x="156.0" y="27.2" width="1.1" height="1.1" opacity="0.65"/><rect class="at-n5" x="147.5" y="27.9" width="1.1" height="1.1" opacity="0.42"/><rect class="at-n3" x="97.2" y="37.1" width="1.1" height="1.1" opacity="0.41"/><rect class="at-n2" x="95.2" y="31.2" width="1.1" height="1.1" opacity="0.44"/><rect class="at-n4" x="99.3" y="86.5" width="1.1" height="1.1" opacity="0.52"/><rect class="at-n2" x="175.4" y="63.0" width="1.1" height="1.1" opacity="0.51"/><rect class="at-n0" x="121.2" y="94.9" width="1.1" height="1.1" opacity="0.80"/><rect class="at-n1" x="130.0" y="104.3" width="1.1" height="1.1" opacity="0.62"/><rect class="at-n1" x="155.5" y="51.6" width="1.1" height="1.1" opacity="0.58"/><rect class="at-n2" x="147.6" y="124.7" width="1.1" height="1.1" opacity="0.55"/><rect class="at-n1" x="156.5" y="104.8" width="1.1" height="1.1" opacity="0.61"/><rect class="at-n2" x="123.4" y="15.8" width="1.1" height="1.1" opacity="0.44"/><rect class="at-n3" x="99.1" y="72.8" width="1.1" height="1.1" opacity="0.81"/><rect class="at-n0" x="131.4" y="104.5" width="1.1" height="1.1" opacity="0.44"/><rect class="at-n0" x="110.1" y="84.8" width="1.1" height="1.1" opacity="0.75"/><rect class="at-n2" x="134.1" y="97.2" width="1.1" height="1.1" opacity="0.54"/><rect class="at-n5" x="104.1" y="47.7" width="1.1" height="1.1" opacity="0.56"/><rect class="at-n3" x="169.0" y="43.3" width="1.1" height="1.1" opacity="0.68"/><rect class="at-n2" x="170.1" y="118.7" width="1.1" height="1.1" opacity="0.62"/><circle cx="84" cy="66" r="20" fill="url(#at-glow)"/><g class="at-rays" stroke-linecap="round"><line x1="86.5" y1="66.0" x2="98.8" y2="66.0" stroke-width="1.00"/><line x1="86.3" y1="66.9" x2="89.2" y2="67.9" stroke-width="0.60"/><line x1="85.9" y1="67.6" x2="88.3" y2="69.6" stroke-width="0.60"/><line x1="85.2" y1="68.2" x2="87.0" y2="71.2" stroke-width="0.60"/><line x1="84.4" y1="68.5" x2="85.5" y2="74.5" stroke-width="0.60"/><line x1="83.6" y1="68.5" x2="82.5" y2="74.3" stroke-width="0.60"/><line x1="82.8" y1="68.2" x2="81.4" y2="70.5" stroke-width="0.60"/><line x1="82.1" y1="67.6" x2="79.6" y2="69.7" stroke-width="0.60"/><line x1="81.7" y1="66.9" x2="78.5" y2="68.0" stroke-width="0.60"/><line x1="81.5" y1="66.0" x2="71.8" y2="66.0" stroke-width="1.00"/><line x1="81.7" y1="65.1" x2="78.4" y2="64.0" stroke-width="0.60"/><line x1="82.1" y1="64.4" x2="79.5" y2="62.2" stroke-width="0.60"/><line x1="82.8" y1="63.8" x2="81.5" y2="61.7" stroke-width="0.60"/><line x1="83.6" y1="63.5" x2="82.8" y2="59.3" stroke-width="0.60"/><line x1="84.4" y1="63.5" x2="85.4" y2="58.1" stroke-width="0.60"/><line x1="85.2" y1="63.8" x2="87.4" y2="60.2" stroke-width="0.60"/><line x1="85.9" y1="64.4" x2="90.3" y2="60.7" stroke-width="0.60"/><line x1="86.3" y1="65.1" x2="90.4" y2="63.7" stroke-width="0.60"/></g><circle class="at-core" cx="84" cy="66" r="3.3"/></svg>';
  const PALETTE_KEYS = ["primary", "secondary", "info", "success", "warning", "error"];
  // The tile fills the room the card has left (no description under All.This) but never sets the card's height: the
  // drawing is laid over the tile (absolute), so on a wide card its proportion (taller than wide) cannot stretch the
  // row -- and with it every card, since a row of cards is as tall as its tallest.
  const AllThisTile = () => N("Box", { "aria-hidden": "true", sx: { position: "relative", width: "100%", flex: 1, minHeight: ICON.tile, borderRadius: "18px", ...HOLE, flexShrink: 0,
      // the drawing covers the whole tile (preserveAspectRatio slice): it is drawn wider than any tile, its outer sides
      // bleed (stars, cubes, specks), so a square tile trims only those and a wide one shows them
      overflow: "hidden",
      "& svg": { position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" },
      // one color in (the theme's primary), the burst, and the theme's palette out -- one color per strand, ending in a node
      "& .at-star": { fill: (t) => t.palette.mode === "dark" ? "#dfe9f3" : t.palette.primary.dark || t.palette.primary.main },
      "& .at-cube-t": { fill: (t) => t.palette.primary.main },
      "& .at-cube-l": { fill: (t) => t.palette.primary.main, filter: "brightness(0.72)" },
      "& .at-cube-r": { fill: (t) => t.palette.primary.main, filter: "brightness(0.5)" },
      "& .at-beam": { stroke: (t) => t.palette.mode === "dark" ? "#ffffff" : t.palette.primary.main, strokeOpacity: 0.9 },
      ...Object.fromEntries(PALETTE_KEYS.map((key, i) => [`& .at-ncube${i} path`, { fill: (t) => (t.palette[key] && t.palette[key].main) || t.palette.primary.main }])),
      ...Object.fromEntries(PALETTE_KEYS.map((key, i) => [`& .at-c${i}`, { stroke: (t) => (t.palette[key] && t.palette[key].main) || t.palette.primary.main }])),
      ...Object.fromEntries(PALETTE_KEYS.map((key, i) => [`& .at-n${i}`, { fill: (t) => (t.palette[key] && t.palette[key].main) || t.palette.primary.main }])),
      "& .at-glow0": { stopColor: (t) => t.palette.mode === "dark" ? "#ffffff" : t.palette.primary.main, stopOpacity: 0.95 },
      "& .at-glow1": { stopColor: (t) => t.palette.primary.main, stopOpacity: 0.55 },
      "& .at-glow2": { stopColor: (t) => t.palette.primary.main, stopOpacity: 0 },
      "& .at-rays": { stroke: (t) => t.palette.mode === "dark" ? "#ffffff" : t.palette.primary.main, strokeOpacity: 0.85 },
      "& .at-core": { fill: (t) => t.palette.mode === "dark" ? "#ffffff" : t.palette.background.paper },
      [MOBILE]: { width: ICON.small.tile, height: ICON.small.tile, minHeight: ICON.small.tile, flex: "none", borderRadius: "14px" } },
    dangerouslySetInnerHTML: { __html: ALLTHIS_SVG } });
  // Live docs path: https://neurons-me.github.io/GUI/ (200). https://neurons-me.github.io/.GUI/ is 404.
  const GUI_DOCS = "https://neurons-me.github.io/GUI/";
  function GuiPlayCard({ style, className }) {
    const theme = G.useThemeContext();
    const sel = G.useOptionalSelection ? G.useOptionalSelection() : null;
    const [phone, setPhone] = React.useState(() => window.matchMedia("(max-width:480px)").matches);
    React.useEffect(() => {
      const mq = window.matchMedia("(max-width:480px)");
      const on = () => setPhone(mq.matches);
      if (mq.addEventListener) mq.addEventListener("change", on); else mq.addListener(on);
      return () => { if (mq.removeEventListener) mq.removeEventListener("change", on); else mq.removeListener(on); };
    }, []);
    const [insp, setInsp] = React.useState(() => Boolean(G.getInspectorEnabled && G.getInspectorEnabled()));
    const grid = Boolean(sel && sel.gridEnabled);
    const currentId = theme && theme.themeId;
    const pickTheme = (id) => { if (theme && typeof theme.setThemeId === "function" && id !== currentId) theme.setThemeId(id); };
    const toggleInsp = () => {
      if (typeof G.toggleInspector === "function") G.toggleInspector();
      else if (typeof G.setInspectorEnabled === "function") G.setInspectorEnabled(!insp);
      setInsp(Boolean(G.getInspectorEnabled && G.getInspectorEnabled()));
    };
    const toggleGrid = () => { if (sel && typeof sel.setGridEnabled === "function") sel.setGridEnabled(!grid); };
    const A = G.Atoms || {};
    const IconButton = A.IconButton || G.IconButton;
    const Avatar = A.Avatar || G.Avatar;
    const Card = G.Card || (G.Components && G.Components.Card) || A.Card;
    const toolBtn = (opts) => h(IconButton || "button", {
      type: "button", size: "small", color: opts.on ? "primary" : "inherit",
      "aria-label": opts.label, "aria-pressed": !!opts.on, title: opts.label,
      onClick: (e) => { e.preventDefault(); e.stopPropagation(); opts.onClick(e); },
      sx: { p: 0.5, borderRadius: 1, ...(opts.on ? { bgcolor: "action.selected" } : {}) },
    }, h(G.Icon, { name: opts.icon, fontSize: 18 }));
    return h(Card, {
      variant: "outlined",
      style, className,
      "data-gui-inspector-control": "true",
      "data-gui-card": "gui-play",
      sx: {
        ...cardSx, cursor: "default", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 0.75, px: 1.5, pt: 1.25, pb: 1,
        "&:hover": { borderColor: "primary.main", boxShadow: 3, transform: "none", textDecoration: "none" },
        [MOBILE]: { px: 0.75, py: 1, gap: 0.5 },
      },
    }, [
      h(G.Box, { sx: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 0.75, minWidth: 0 } }, [
        // title and the Docs + gear row all go to /GUI/ (https://neurons-me.github.io/GUI/; /.GUI is 404)
        h(G.Link, { href: GUI_DOCS, underline: "hover", color: "inherit", "aria-label": ".GUI docs",
          sx: { fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.2, minWidth: 0, [MOBILE]: { fontSize: "0.8rem" } } }, [".GUI"]),
        h(G.Box, { sx: { display: "inline-flex", alignItems: "center", gap: 0.5, flexShrink: 0 } }, [
          h(G.Link, { href: GUI_DOCS, underline: "hover", color: "primary", "aria-label": ".GUI docs", sx: { fontSize: "0.75rem", fontWeight: 700 } }, ["Docs"]),
          h(G.Link, { href: GUI_DOCS, "aria-label": ".GUI docs", title: ".GUI docs",
            sx: { display: "inline-flex", alignItems: "center", color: "primary.main", lineHeight: 0, "&:hover": { opacity: 0.85 } } },
            h(G.Icon, { name: "settings", fontSize: 18 })),
        ]),
      ]),
      h(G.Box, { role: "listbox", "aria-label": "Themes", onClick: (e) => e.stopPropagation(),
        sx: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 0.5, justifyItems: "center" } },
        THEMES.map((t) => {
          const on = t.themeId === currentId;
          const name = t.themeName || t.themeId;
          return h(IconButton || "button", {
            key: t.themeId, size: "small", role: "option", "aria-selected": on, type: "button",
            "aria-label": "Theme " + name, title: name, onClick: (e) => { e.preventDefault(); e.stopPropagation(); pickTheme(t.themeId); },
            sx: { p: 0.25, borderRadius: "50%", outline: on ? "2px solid" : "2px solid transparent", outlineColor: on ? "primary.main" : "transparent", outlineOffset: 1 },
          }, Avatar ? h(Avatar, { src: t.badgeUrl, alt: "", sx: { width: 22, height: 22 } }) : name[0]);
        })),
      h(G.Box, { onClick: (e) => e.stopPropagation(), sx: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 0.25, mt: 0.25 } }, [
        G.ThemeModeToggle ? h(G.ThemeModeToggle, { variant: phone ? "minimal" : "switchMinimal", iconSize: "small", "aria-label": "Toggle light and dark" }) : null,
        h(G.Box, { sx: { display: "flex", alignItems: "center" } }, [
          toolBtn({ label: insp ? "Inspector on" : "Inspector off", icon: "code", on: insp, onClick: toggleInsp }),
          sel ? toolBtn({ label: grid ? "Grid on" : "Grid off", icon: "grid_on", on: grid, onClick: toggleGrid }) : null,
        ].filter(Boolean)),
      ].filter(Boolean)),
    ]);
  }

  PAGE_TYPES.GuiPlayCard = GuiPlayCard;

  const stackCard = ([title, desc, href, img, allThis]) => {
    if (img && img.gui) return N("GuiPlayCard", {});
    // netget: the SVG already spells NETGET — no title text; on desktop its mark sits in a hole like the other icons.
    if (img && img.netget) {
      // netget, at every width: only its letters, centered and as wide as the card allows, on no background (the page
      // shows through), and the card's own border
      // (3px, the theme's primary color, as the letters) is the mark's frame. No title or description: the letters say
      // netget, and "The Gateway." stays in the link's label.
      return N("Card", { component: "a", href, title: "netget", "aria-label": "netget — " + desc, variant: "outlined",
        sx: { ...cardSx, display: "flex", flexDirection: "column", alignItems: "stretch", justifyContent: "center", px: 1.25,
          borderWidth: "3px", borderColor: "primary.main", bgcolor: "transparent", backgroundImage: "none", [MOBILE]: { px: 0.5, py: 1.5 } } }, [
        // the letters fit whatever height the card has: a full card, or a button under monad beside a grown cleaker
        N("NetgetMark", { letters: true, sx: { display: "block", width: "78% !important", alignSelf: "center", maxHeight: "100%", minHeight: 0, flexShrink: 1 } }),
      ]);
    }
    // the .me card holds fields, so it is not itself a link (a click in a field would navigate): its title is
    const meCard = !!(img && img.monad);
    const card = N("Card", { ...(meCard ? { component: "div" } : { component: "a", href }), ...(img.qr ? { "aria-label": title + " — " + desc, title } : {}), variant: "outlined", sx: { ...cardSx, display: "flex", flexDirection: "column", gap: 1, px: 2, pt: 1.5, pb: 1,
        ...(meCard ? { cursor: "default", "&:hover": { transform: "none" } } : {}),
        // cleaker: the card is its QR.me alone (it already says cleaker.me around its edge), centered
        ...(img.qr ? { alignItems: "center", justifyContent: "center", p: "3px" } : {}),
        ...(allThis ? { borderColor: "text.disabled", background: "linear-gradient(180deg, rgba(127,127,127,0.02), rgba(127,127,127,0.06))" } : {}),
        [MOBILE]: { alignItems: "center", textAlign: "center", gap: 0.75, px: 0.75, py: 1.5, ...(img.qr ? { gap: 0.25, py: 1, justifyContent: "center" } : {}) } } }, [
      // every icon in the same tile, a hole in its card (HOLE): the orbs (.me, monad) and the QR included -- the same
      // container for every object, so they can stand as one kind of card anywhere (a network view, a video stream)
      img.wallet ? WalletTile() : img.graph ? AllThisTile() : N("Box", { sx: { width: ICON.tile, height: ICON.tile, borderRadius: "18px", ...HOLE, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          // cleaker has no title or description: its tile is the whole card
          // its dark reaches nearly to the card's corners (3px in, corners following the card's 12px)
          ...(img.qr ? { width: "100%", height: "auto", flex: 1, alignSelf: "stretch", borderRadius: "10px" } : {}),
          [MOBILE]: img.qr ? { width: "auto", height: "auto", p: "4px", borderRadius: "14px" } : { width: ICON.small.tile, height: ICON.small.tile, borderRadius: "14px" } } }, [
        img.qr && G.QRme ? N("CleakerQRme", { value: img.qr, title })
          : img.bubble ? N("MonadBubble", { fallback: { light: img.light, dark: img.dark, alt: title, sx: { width: ICON.img, height: ICON.img, objectFit: "contain", [MOBILE]: { width: ICON.small.img, height: ICON.small.img } } } })
          : img.monad ? N("MeMonad", { fallback: { light: img.light, dark: img.dark, alt: title, sx: { width: ICON.img, height: ICON.img, objectFit: "contain", [MOBILE]: { width: ICON.small.img, height: ICON.small.img } } } })
          // zoom: an image drawn with a wide transparent margin (.GUI uses ~70% of its canvas) scaled up, so it looks as big as the others
          : N("ThemedImg", { light: img.light, dark: img.dark, alt: title, sx: { width: ICON.img, height: ICON.img, objectFit: "contain", ...(img.zoom ? { transform: `scale(${img.zoom})` } : {}), [MOBILE]: { width: ICON.small.img, height: ICON.small.img } } }),
      ]),
      // the title 10px under the larger icon (2px over the card's 8px gap); less padding than before, so the card grows less
      // than the icon; phones keep the compact gap
      img.qr ? null : N("Typography", { variant: "subtitle1", sx: { fontWeight: allThis ? 800 : 700, fontSize: "0.95rem", lineHeight: 1.25, mt: 0.25, ...(allThis ? { textAlign: "center" } : {}),
          [MOBILE]: img.qr ? { mt: 0, fontSize: "0.65rem", fontWeight: 600, lineHeight: 1.1, letterSpacing: "0.02em", color: "text.secondary" }
            : title.length > 12
              // a long title (mlearning.studio) on one line: its size from the card's width (a third of the row, less its
              // padding), ~0.56em a character, at most the others' 0.8rem
              ? { mt: 0, whiteSpace: "nowrap", fontSize: `min(0.8rem, calc(((100cqw - 20px) / 3 - 12px) / ${(title.length * 0.56).toFixed(2)}))` }
              : { mt: 0, fontSize: "0.8rem", overflowWrap: "anywhere" } } },
        [meCard ? N("Link", { href, underline: "hover", color: "inherit" }, [title]) : title]),
      // All.This has no description: its picture grows into that room and the title sits at the card's bottom
      img.graph || img.qr ? null
        // .me: "Who am I." is where you say who you are (MeIdentityField: name, then secret)
        : meCard ? N("Box", { sx: { minWidth: 0, [MOBILE]: { display: "none" } } }, [N("MeIdentityField", {})])
        : N("Typography", { variant: "body2", color: "text.secondary", sx: { ...TWO_LINES, fontSize: "0.825rem", lineHeight: 1.5, [MOBILE]: { display: "none" } } }, [desc]),
    ].filter(Boolean));
    // cleaker grows (GrowCard) when a name is typed: its QR then holds name.cleaker.me
    return img.qr ? N("GrowCard", {}, [card]) : card;
  };
  const demoCard = ([title, href, img]) =>
    N("Card", { component: "a", href, variant: "outlined", sx: { ...cardSx, display: "flex", flexDirection: "row", alignItems: "stretch", minHeight: 140, overflow: "hidden", p: 0 } }, [
      // 2:3 like the portrait GIFs: the card is as tall as its image (~210px at 1280), as on the static page.
      N("Box", { component: "img", src: img, alt: "", sx: { width: "clamp(140px, 45%, 240px)", height: "auto", aspectRatio: "2 / 3", minHeight: 140, objectFit: "cover", flexShrink: 0, display: "block" } }),
      N("Box", { sx: { display: "flex", alignItems: "center", flex: 1, minWidth: 0, p: "clamp(14px, 2vw, 20px) clamp(20px, 3vw, 40px) clamp(14px, 2vw, 20px) clamp(14px, 2vw, 24px)" } }, [
        N("Typography", { component: "span", sx: { fontWeight: 900, fontSize: "clamp(0.95rem, 1vw + 0.75rem, 1.2rem)", lineHeight: 1.15, overflowWrap: "normal", wordBreak: "keep-all", hyphens: "none" } }, [title]),
      ]),
    ]);
  // Source Code: no card of its own -- its registry icons (npm, GitHub, PyPI, crates.io; the icons say which, so no text
  // names them) sit at the right end of the Demos heading, on the same line, under a "Source Code" label like the
  // section's own.
  const sourceNav = N("Box", { component: "nav", "aria-label": "Source code", sx: { display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", justifyContent: "flex-end", [MOBILE]: { display: "none" } } }, [
    label("Source Code", { mb: 0, mr: 0.5 }),
    ...SOURCES.map(([aria, href, img]) => N("Link", { href, ariaLabel: aria, title: aria, underline: "none",
      sx: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: "50%", ...HOLE, opacity: 0.9, "&:hover": { opacity: 1, bgcolor: "action.selected" } } },
      [N("ThemedImg", { ...img, sx: { width: 18, height: 18, objectFit: "contain", display: "block" } })])),
  ]);
  // phones: Source Code is a card in the Docs row instead, the ninth slot the three-a-row leaves empty -- its four
  // registry icons two by two in the same tile as every other card, "Source Code" as its title. Desktop keeps it
  // beside Demos (four a row leaves no empty slot there).
  const sourceCard = N("Box", { component: "nav", "aria-label": "Source code", style: { order: 99 },
      sx: { display: "none", [MOBILE]: { display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5, py: 1, px: 0.75,
        border: 1, borderColor: "divider", borderRadius: "12px", bgcolor: "background.paper" } } }, [
    N("Box", { sx: { width: "100%", height: 83, borderRadius: "14px", ...HOLE, flexShrink: 0, boxSizing: "border-box", p: "6px",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px", placeItems: "center" } },
      SOURCES.map(([aria, href, img]) => N("Link", { href, ariaLabel: aria, title: aria, underline: "none",
        sx: { display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", borderRadius: "50%", "&:hover": { bgcolor: "action.selected" } } },
        [N("ThemedImg", { ...img, sx: { width: 20, height: 20, objectFit: "contain", display: "block" } })]))),
    N("Typography", { variant: "subtitle1", sx: { fontWeight: 700, fontSize: "0.8rem", lineHeight: 1.25, mt: 0, whiteSpace: "nowrap" } }, ["Source Code"]),
  ]);
  const demosSection = N("Box", { component: "section", sx: { mt: 5 } }, [
    N("Box", { sx: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5, flexWrap: "wrap", mb: 1.75 } }, [label("Demos", { mb: 0 }), sourceNav]),
    grid(3, DEMOS.map(demoCard)),
  ]);

  // GUI 4.1.0's SearchBar paints itself with inline styles from two fixed palettes (light: #fff / #0f1720 / teal,
  // dark: #111a1f / #e8eded / #4fd1c5): only light vs dark follows the theme, never the theme's own colors, so it
  // looked right only in neurons.me. Inline styles can only be beaten with !important, so the page re-skins it
  // here from the active MUI theme (paper, divider, text, primary, action tokens). Selectors follow the
  // SearchBar's DOM: root > [input row, listbox (quick access or results)].
  const searchThemeSx = (t) => {
    const P = t.palette, I = (v) => `${v} !important`, shadow = (t.shadows && t.shadows[8]) || "none";
    return {
      "& > div > div:first-of-type": { background: I(P.background.paper), borderColor: I(P.divider), color: I(P.text.primary), transition: "border-color 120ms ease" },
      "& > div > div:first-of-type:focus-within": { borderColor: I(P.primary.main) },
      "& input": { color: I(P.text.primary), caretColor: P.primary.main },
      "& input::placeholder": { color: P.text.secondary, opacity: 1 },
      "& > div > div:first-of-type > span:last-of-type:not(:first-of-type)": { background: I(P.action.hover), color: I(P.text.secondary) },
      "& [role=listbox]": { background: I(P.background.paper), borderColor: I(P.divider), boxShadow: I(shadow), color: P.text.primary },
      "& [role=listbox] > div": { color: I(P.text.secondary) },
      // no border color forced here: SearchBar (colors "theme") draws the dividers, and a tile's own frame (netget) in the accent
      "& [role=option]": { color: I(P.text.primary) },
      "& [role=option]:hover, & [role=option][aria-selected=true]": { background: I(P.action.hover) },
      "& [role=option] > span:nth-of-type(2) > span:nth-of-type(2), & [role=option] > span:nth-of-type(3)": { color: I(P.text.secondary) },
    };
  };
  // Landing header (replaces the app TopBar): big logo + title + tagline, search on the same row
  // (full width below it at <=480px, like the old page), small theme/settings controls.
  const header = N("Box", { component: "header", sx: { display: "flex", alignItems: "center", gap: 1.75, flexWrap: "wrap", mb: 5 } }, [
    N("Link", { href: "https://neurons-me.github.io/", ariaLabel: "neurons.me home", underline: "none", sx: { display: "inline-flex", flexShrink: 0 } }, [
      N("Box", { component: "img", src: LOGO, alt: "neurons.me", sx: { width: 44, height: 44, objectFit: "contain", display: "block" } }),
    ]),
    N("Box", { sx: { minWidth: 0 } }, [
      N("Typography", { component: "h1", sx: { fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1, color: "text.primary" } }, ["neurons.me"]),
      N("Typography", { component: "p", color: "text.secondary", sx: { fontSize: "0.9rem", mt: 0.5 } }, ["Go Algorithmic."]),
    ]),
    N("Box", { className: "index-search", sx: (t) => ({ ml: "auto", width: 280, maxWidth: "40vw", order: 2, [MOBILE]: { order: 4, ml: 0, width: "100%", maxWidth: "100%" }, ...searchThemeSx(t) }) }, [
      N("SearchBar", { src: "/index.json", placeholder: "Search in All.This", themeMode: "auto", enableSlashShortcut: true, density: "compact", colors: "theme" }),
    ]),
  ]);
  const mainSections = (top) => N("Box", { component: "main", sx: { maxWidth: 960, mx: "auto", px: { xs: 2, sm: 4 }, pt: { xs: 4, sm: 7 }, pb: 6 } }, [
    header,
    ...(top || []),
    N("Box", { component: "section" }, [
      N("Link", { href: "https://neurons-me.github.io/docs/", underline: "hover", color: "inherit", sx: { display: "inline-block", mb: 1.75, color: "text.secondary" } }, [label("Docs")]),
      // as many cards as fit, at least 150px each (the 109px icon + padding), at most 4: 4 -> 3 -> 2 as the window narrows,
      // never a jump from 4 to 2; phones keep their own compact three
      // a wrapping row, not a grid: a card can grow by any amount (cleaker, as its name gets longer) and the cards after
      // it flow on, the one at the end of a full row moving down; every card keeps its own size. Widths as the grid had:
      // 4 a row, 3 below 648px of row, 2 below 482px; phones 3 compact.
      N("Box", { "data-docs-row": "", sx: { display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 2, containerType: "inline-size",
        [MOBILE]: { gap: 1.25 },
        "& > *:not([data-stack]), & > [data-stack][style] > *": { boxSizing: "border-box", minWidth: 0, maxWidth: "100%",
          flex: "0 0 calc((100cqw - 48px) / 4 * var(--grow, 1))", minHeight: "calc(188px * var(--grow, 1))",
          "@container (max-width: 647.98px)": { flex: "0 0 calc((100cqw - 32px) / 3 * var(--grow, 1))" },
          "@container (max-width: 481.98px)": { flex: "0 0 calc((100cqw - 16px) / 2 * var(--grow, 1))" },
          // phones: the compact three a row (wins over the 2-a-row container rule above, which a phone's row also matches)
          [MOBILE]: { flex: "0 0 calc((100cqw - 20px) / 3 * var(--grow, 1)) !important", minHeight: "calc(120px * var(--grow, 1))" } } } },
        (() => {
          // each card's place in the row as `order` (STACK's order), so netget can sit in .me's column when stacked and
          // still be the first card of the second row otherwise
          const cards = STACK.map(stackCard).map((c, i) => ({ ...c, props: { ...c.props, style: { ...(c.props.style || {}), order: i } } }));
          return [N("StackBeside", {}, [cards[0], cards[4]]), cards[1], cards[2], cards[3], ...cards.slice(5), sourceCard];
        })()),
    ]),
    demosSection,
    section("Architecture & Benchmarks", grid(2, ARCH.concat(BENCH).map(resourceCard))),
    section("NRP & Axioms", grid(2, NRP.map(resourceCard))),
    section("Essays & Notation", grid(2, ESSAYS.map(resourceCard))),
    section("Network", N("Box", { sx: { display: "grid", gridTemplateColumns: "1fr" } }, NETWORK.map(resourceCard))),
  ]);

  const content = mainSections();
  const SETTINGS = (o) => G.GUISettings({ includeAdminViewToggle: false, includeRuntimeControlsToggle: false, includeThemesLink: false, brandLogoSrc: GREY, brandHref: "https://neurons.me", ...o });

  // Case 2 (Getting Started/Namespace · "2 · Namespace + site with .GUI"): this site is a .GUI app,
  // reached through the namespace cleaker.me. AppShell itself ships on this.gui/runtime (ESM), not the
  // UMD, so the home composes the same shell from the UMD exports (Layout, SiteBrand, QrBadge,
  // NamespaceRoutePanel, placeMarks). Namespace routes open over the home view; "/" / Home never opens that panel.
  const APP_NAMESPACE = "apps.neurons-me.github.io";
  const CLEAKER_NS = "cleaker.me";
  const APP_SURFACE = "neurons-me.github.io";
  const APP_POSITION = CLEAKER_NS + " @ " + APP_SURFACE;
  // No left rail: Monad and the other categories are already listed in the home content.

  function renderSpec(node, key) {
    if (node == null || node === false) return null;
    if (typeof node === "string" || typeof node === "number") return node;
    if (Array.isArray(node)) return node.map((n, i) => renderSpec(n, i));
    if (React.isValidElement && React.isValidElement(node)) return node;
    if (typeof node !== "object") return null;
    const typeName = node.type;
    const registry = (G.Registry || G.registry || {});
    const reg = registry[typeName];
    // Registry entries are {type, meta, resolve} specs, not components. Prefer G[Name] (the React component).
    const resolved = (reg && typeof reg.resolve === "function") ? null : (typeof reg === "function" || (reg && reg.$$typeof) ? reg : null);
    const type = PAGE_TYPES[typeName] || G[typeName] || resolved || (G.Components && G.Components[typeName]) || (G.Atoms && G.Atoms[typeName]) || (G.Molecules && G.Molecules[typeName]) || typeName;
    const props = { ...(node.props || {}) };
    if (key != null && props.key == null) props.key = key;
    const ch = node.children;
    const kids = ch == null ? null : Array.isArray(ch) ? ch.map((n, i) => renderSpec(n, i)) : [renderSpec(ch)];
    return kids ? h(type, props, ...kids) : h(type, props);
  }

  function BrandWhere({ where }) {
    return h(G.Box, { component: "span", title: APP_POSITION, "data-gui-node-id": "GUI.window.layout.marks.brand.where",
      sx: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", fontSize: 13, color: "text.secondary", whiteSpace: "nowrap" } }, where);
  }
  function IdentityLabel({ text }) {
    return h(G.Box, { component: "span", title: APP_POSITION, "data-gui-node-id": "GUI.window.layout.bars.top.namespace",
      "data-gui-component": "namespace",
      sx: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", fontSize: 13, fontWeight: 600, color: "text.primary", whiteSpace: "nowrap" } }, text);
  }

  // 4.4.5 UMD does not export CleakerQrMenu / panelPositionFor. Namespace passes
  // layout.left (Monad etc.) and layout.search into CleakerQrMenu, but the menu
  // never renders those fields (only layout.brand, in the position grid). Theme
  // is not a menu slot at all (ThemeLauncher lives in the left-rail footer).
  // This site-side menu is the closest composition: ThemeModeToggle + SearchBar +
  // Monad, opened from the identity QR, without a second neurons.me brain in the top bar.
  const MONAD_HREF = "https://neurons-me.github.io/monad/";
  function QrToolsMenu({ onClose, menuRef }) {
    const Paper = G.Paper;
    const Box = G.Box;
    const Typography = G.Typography;
    const Icon = G.Icon;
    const ThemeModeToggle = G.ThemeModeToggle;
    const Link = G.Link;
    return h(Paper, {
      ref: menuRef,
      elevation: 0,
      role: "dialog",
      "aria-label": "QR menu",
      "data-gui-node-id": "GUI.window.layout.marks.identity.menu",
      sx: {
        position: "fixed",
        top: 52,
        right: 0,
        left: "auto",
        zIndex: (th) => (th.zIndex && th.zIndex.modal || 1300) + 1,
        p: 1.25,
        width: 272,
        maxWidth: "calc(100vw - 16px)",
        display: "flex",
        flexDirection: "column",
        gap: 1.25,
        bgcolor: "background.default",
        backgroundImage: "none",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "none",
        borderRadius: "12px",
      },
    }, [
      h(Box, { sx: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, pr: 0.25 } }, [
        h(Typography, { variant: "caption", sx: { fontWeight: 600, fontSize: "0.85rem" } }, ["Theme"]),
        ThemeModeToggle ? h(ThemeModeToggle, { variant: "switchMinimal", iconSize: "small", "aria-label": "Toggle light and dark" }) : null,
        h(Box, {
          component: "button", type: "button", "aria-label": "Close", title: "Close", onClick: onClose,
          sx: { display: "flex", p: 0.5, ml: "auto", border: 0, borderRadius: 1, background: "transparent", color: "text.secondary", cursor: "pointer", "&:hover": { bgcolor: "action.hover", color: "text.primary" } },
        }, Icon ? h(Icon, { name: "close", fontSize: "1.25rem" }) : "×"),
      ]),
      h(Link || "a", {
        href: MONAD_HREF,
        underline: "none",
        color: "inherit",
        "aria-label": "monad",
        title: "monad",
        "data-gui-node-id": "GUI.window.layout.marks.identity.menu.monad",
        sx: { display: "flex", alignItems: "center", gap: 1, p: 0.75, px: 1, border: "1px solid", borderColor: "divider", borderRadius: 1, color: "inherit", textDecoration: "none", "&:hover": { bgcolor: "action.hover" } },
      }, [
        Icon ? h(Icon, { name: "orb:monad", fontSize: 20 }) : null,
        h(Typography, { variant: "body2", sx: { fontWeight: 600 } }, ["monad"]),
      ]),
    ].filter(Boolean));
  }

  function HomeApp() {
    const [narrow, setNarrow] = React.useState(() => window.matchMedia("(max-width: 599px)").matches);
    const [qrMenuOpen, setQrMenuOpen] = React.useState(false);
    const qrCellRef = React.useRef(null);
    const menuRef = React.useRef(null);
    React.useEffect(() => {
      const mq = window.matchMedia("(max-width: 599px)");
      const on = () => setNarrow(mq.matches);
      if (mq.addEventListener) mq.addEventListener("change", on); else mq.addListener(on);
      return () => { if (mq.removeEventListener) mq.removeEventListener("change", on); else mq.removeListener(on); };
    }, []);
    React.useEffect(() => {
      if (!qrMenuOpen) return;
      const onPtr = (e) => {
        const t = e.target;
        if (qrCellRef.current && qrCellRef.current.contains(t)) return;
        if (menuRef.current && menuRef.current.contains(t)) return;
        setQrMenuOpen(false);
      };
      const onKey = (e) => { if (e.key === "Escape") setQrMenuOpen(false); };
      document.addEventListener("pointerdown", onPtr);
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("pointerdown", onPtr);
        document.removeEventListener("keydown", onKey);
      };
    }, [qrMenuOpen]);
    const Layout = G.Layout || (G.Registry && G.Registry.Layout);
    const SiteBrand = G.SiteBrand;
    const QrBadge = G.QrBadge;
    const BarBrandCell = G.BarBrandCell;
    const FloatingMark = G.FloatingMark;
    const placeMarks = G.placeMarks;
    const marksInBars = G.marksInBars;
    const goHomeNav = (e) => { if (e && e.preventDefault) e.preventDefault(); };
    const brand = SiteBrand
      ? h(SiteBrand, { label: "neurons.me", href: "/", logo: LOGO, onClick: goHomeNav })
      : h("a", { href: "/", title: "neurons.me", onClick: goHomeNav }, h("img", { src: LOGO, alt: "neurons.me", width: 28, height: 28 }));
    const qrValue = "https://" + CLEAKER_NS + "/?at=" + encodeURIComponent(window.location.origin);
    const qr = QrBadge
      ? h(QrBadge, { value: qrValue, clickFlip: false, hoverFlip: false, cursor: "pointer" })
      : h(G.QRme, { variant: "topbar", value: qrValue, clickFlip: false, hoverFlip: false, cursor: "pointer" });
    // Pure QR at top-right (no "cleaker.me" label; name stays on title/aria). Brand takes the other end.
    const identity = h(BarBrandCell || G.Box, {
      ref: qrCellRef,
      component: "button", type: "button", title: CLEAKER_NS, "aria-label": CLEAKER_NS,
      "aria-haspopup": "dialog", "aria-expanded": qrMenuOpen,
      onClick: (e) => { if (e && e.preventDefault) e.preventDefault(); setQrMenuOpen((open) => !open); },
      "data-gui-node-id": "GUI.window.layout.marks.identity",
      sx: { width: 48, height: 48, minWidth: 48, flex: "none", p: 0, m: 0, border: 0, background: "none", color: "inherit", cursor: "pointer" },
    }, qr);
    const placement = typeof placeMarks === "function"
      ? placeMarks({ identity: "top-right", bars: { top: true, left: false }, narrow, brand: true })
      : { identity: "top.end", brand: "top.start" };
    const marks = typeof marksInBars === "function"
      ? marksInBars(placement, {
          identity,
          brand,
          brandText: h(BrandWhere, { where: "@" + APP_SURFACE }),
        }, { topText: true })
      : { topStart: [{ type: "action", props: { element: brand } }], topEnd: [{ type: "action", props: { element: identity } }], leftFooter: [], float: null };
    const shell = h(Layout, {
      TopBar: {
        hideBrand: true,
        noBorder: true,
        toolbarSx: { pl: 0.25 },
        // Brand stays in the layout (placeMarks / top.start) but is visually hidden so only the hero logo shows.
        elementsLeftSx: { pl: 1, visibility: "hidden", pointerEvents: "none" },
        elementsLeft: [...(marks.topStart || [])],
        ...((marks.topEnd && marks.topEnd.length) ? { elementsRight: marks.topEnd } : {}),
      },
    }, renderSpec(content));
    return h(G.Box, { sx: { minHeight: "100vh", bgcolor: "background.default", color: "text.primary" } }, [
      shell,
      marks.float && FloatingMark ? h(FloatingMark, { corner: marks.float.corner }, marks.float.element) : null,
      qrMenuOpen ? h(QrToolsMenu, { onClose: () => setQrMenuOpen(false), menuRef }) : null,
    ].filter(Boolean));
  }

  // theme: default neurons.me; first visit follows prefers-color-scheme (do not pre-seed themeMode).
  // ?mode= is an explicit choice and is persisted, same as the in-shell toggle.
  const KEY = "neurons-index-gui.themeMode";
  const askedMode = params.get("mode");
  try { if (askedMode === "dark" || askedMode === "light") localStorage.setItem(KEY, askedMode); } catch (e) {}
  // Theme id: ?theme=<id> picks one and persists it; otherwise a first visit gets neurons.me.
  // Seeding the page-scoped key keeps Theme from falling back to the shared this.gui:themeId another .GUI page on
  // this origin may have set (GUI storybook / Veracruz.Port). Never seeds seafoam.
  const ID_KEY = (window.__thisGuiThemeScope && window.__thisGuiThemeScope.themeIdKey) || "neurons-index-gui.themeId";
  const askedTheme = params.get("theme");
  try {
    if (askedTheme && THEMES.some((t) => t.themeId === askedTheme)) localStorage.setItem(ID_KEY, askedTheme);
    else if (!localStorage.getItem(ID_KEY)) localStorage.setItem(ID_KEY, "neurons.me");
  } catch (e) {}
  // Do not pass initialMode unless ?mode= (or a stored toggle) is an explicit choice; otherwise Theme follows the OS.
  const PageTheme = ({ children }) => {
    const stored = (() => { try { return localStorage.getItem(KEY); } catch (e) { return null; } })();
    const props = { initialThemeId: "neurons.me" };
    if (stored === "dark" || stored === "light") props.initialMode = stored;
    return h(G.Theme, props, children);
  };

  const INSPECTOR_ON = params.get("inspector") === "1";
  const GRID_ON = params.get("grid") === "1"; // like ?inspector=1: page-level start state for screenshots/links
  if (G.getInspectorEnabled() !== INSPECTOR_ON) G.setInspectorEnabled(INSPECTOR_ON);
  const ROOT = document.getElementById("root");
  const spec = N("HomeApp", {});
  const mountPage = () => G.mount(spec, ROOT, {
    gui: { ...G, Theme: PageTheme, registry: { ...G.Registry, ...PAGE_TYPES, HomeApp } },
    devtools: { enabled: true, inspector: INSPECTOR_ON, adminView: false, inspectorToggleVisible: false },
  });
  window.__handle = mountPage();
})();
