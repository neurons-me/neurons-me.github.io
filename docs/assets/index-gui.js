// neurons.me index (https://neurons-me.github.io/) on .GUI 4.2.0. Loaded by docs/index.html.
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
      h(Monad, { variant: "identity", kind: "me", seed: "jabellae", mode: "contained", size: Math.round(orb * 34 / 60) }));
  }
  // The monad card's mark: the .GUI Monad bubble itself (GUI.Widgets.Monad, Storybook All.This/monad.ai/monad.ai →
  // Bubble: variant "bubble"; kind resolves to "monad" there since the story has no global me, so it is passed here).
  // The widget draws a fixed 60px orb, so a 60px stage is scaled to the slot (0.8 → 48px, 0.567 → 34px on phones, the
  // .me orb's sizes). Same index-side tuning as the .me orb: full opacity, gentler float, a faint halo instead of the
  // widget's opacity/halo pulse; its own lava, blob and pixel-breath motions keep running.
  // Inner texture of the monad bubble (the light behind its pixel grid: the widget's ::before blob, glass shading
  // and "rorschachLava" layers). "widget" = as GUI draws it; "A" matte + grain; "B" diffuse fog; "C" frosted fine dots.
  // ?monadTexture=A|B|C|widget overrides it for a look.
  const MONAD_TEXTURE = "A";
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
    // the bubble 8% smaller than the .me orb: it fills its tile more (its glow and float reach farther)
    const box = small ? ICON.small.tile : ICON.tile, k = (small ? ICON.small.img + 3 : ICON.img) * 0.92 / 60;
    const blob = { "0%,100%": "50%", "25%": "55% 45% 60% 40% / 60% 55% 45% 40%", "50%": "50% 60% 40% 55% / 55% 40% 60% 45%", "75%": "45% 55% 40% 60% / 40% 60% 55% 50%" };
    const lift = { "0%,100%": [0, 1], "25%": [-2, 1.02], "50%": [-3, 1.04], "75%": [-2, 1.02] };
    return h(G.Box, { role: "img", "aria-label": fallback.alt, sx: (t) => {
        const halo = t.palette.mode === "dark" ? "159,246,255" : "0,90,122";
        return { position: "relative", zIndex: 0, isolation: "isolate", width: box, height: box, display: "flex", alignItems: "center", justifyContent: "center",
          "@keyframes monadOrbFloat": Object.fromEntries(Object.keys(blob).map((p) => [p, { transform: `translateY(${lift[p][0] / k}px) scale(${lift[p][1]})`, borderRadius: blob[p] }])),
          "@keyframes monadOrbHalo": { "0%,100%": { boxShadow: `0 0 3px rgba(${halo},0.14)` }, "50%": { boxShadow: `0 0 5px rgba(${halo},0.22)` } },
          "& .monad-tooltip": { display: "none" },
          "& div:has(> div[aria-hidden=true])": { opacity: "1 !important", animation: "monadOrbFloat 6s ease-in-out infinite, monadOrbHalo 4.5s ease-in-out infinite !important", "&:hover": { transform: "none" } },
          ...monadTexture(t.palette.mode === "dark") };
      } },
      h(G.Box, { sx: { width: 60, height: 60, flexShrink: 0, transform: `scale(${k})`, display: "flex" } },
        h(Monad, { variant: "bubble", kind: "monad", mode: "contained" })));
  }
  // The .me QR on the cleaker card: GUI.QRme (registry "QR.me", this.gui 4.2.0), the same component as the namespace
  // landing on cleaker.me (GUI.content.landing.qr.code). It paints from the .GUI theme palette, so it follows the
  // page's theme and light/dark. No flip here: the whole card is the link.
  function CleakerQRme({ value, title }) {
    // drawn at 112px (its module grid needs the room) and scaled into an ICON.img box, the share of its tile the images take, so its hole shows around it; on phones it is the card's media
    // (78px drawn, 64px on the narrowest), a real QR with its name small underneath, not an icon in a tile
    return h(G.Box, { sx: { width: ICON.img, height: ICON.img, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 0,
        [MOBILE]: { width: 78, height: 78 }, [NARROW]: { width: 64, height: 64 } } },
      // QR.me draws its frame past `diameter` (about 128px drawn for 112): the phone scales are taken from what is drawn
      h(G.Box, { sx: { flexShrink: 0, transform: "scale(.74)", [MOBILE]: { transform: "scale(.61)" }, [NARROW]: { transform: "scale(.5)" } } },
        h(G.QRme, { value, diameter: 112, variant: "md", hoverFlip: false, clickFlip: false, defaultFace: "qr", showAvatarLabel: false })));
  }
  const PAGE_TYPES = { ThemedImg, AudienceMark, NetgetMark, HeaderControls, MeMonad, MonadBubble, CleakerQRme };

  // ── content (from docs/index.html @ 6bee309) ──
  const STACK = [
    [".me", "Who am I.", "https://neurons-me.github.io/.me/", { monad: true, light: CL + "v1761149332/this.me-removebg-preview_2_j1eoiy.png", dark: CL + "v1760758662/this.me-removebg-preview_fvyeda.png" }],
    ["cleaker", "Here.", "https://neurons-me.github.io/Cleaker/", { qr: "https://cleaker.me", light: CL + "v1765054949/cleaker.me_gusn1q.png" }],
    ["monad", "Daemons.", "https://neurons-me.github.io/monad/", { bubble: true, light: CL + "v1778090977/monad.ai.profile-removebg-preview_np26yp.png" }],
    [".GUI", "Generative UI.", "https://neurons-me.github.io/GUI/", { light: CL + "v1760629119/this.gui.neurons.me_mkapde.png", zoom: 1.3 }],
    ["netget", "The Gateway.", "https://neurons-me.github.io/netget/", { netget: true }],
    ["mlearning.studio", "Training data.", "https://neurons-me.github.io/mlearning.studio/", { light: "/assets/mlearning-studio-icon.webp" }],
    [".wallet", "for .me", "https://neurons-me.github.io/.wallet/", { wallet: true, light: CL + "v1765902981/this.wallet_giyxtt.webp" }],
    ["All.This", "Learn more...", "https://github.com/neurons-me", { light: CL + "v1765903003/all.this_sr55ml.webp" }, true],
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
  const stackCard = ([title, desc, href, img, allThis]) => {
    // netget: the SVG already spells NETGET — no title text; on desktop its mark sits in a hole like the other icons.
    if (img && img.netget) {
      // netget, at every width: only its letters, centered and as wide as the card allows, on no background (the page
      // shows through), and the card's own border
      // (3px, the theme's primary color, as the letters) is the mark's frame. No title or description: the letters say
      // netget, and "The Gateway." stays in the link's label.
      return N("Card", { component: "a", href, title: "netget", "aria-label": "netget — " + desc, variant: "outlined",
        sx: { ...cardSx, display: "flex", flexDirection: "column", alignItems: "stretch", justifyContent: "center", px: 1.25,
          borderWidth: "3px", borderColor: "primary.main", bgcolor: "transparent", backgroundImage: "none", [MOBILE]: { px: 0.5, py: 1.5 } } }, [
        N("NetgetMark", { letters: true, sx: { display: "block" } }),
      ]);
    }
    return N("Card", { component: "a", href, variant: "outlined", sx: { ...cardSx, display: "flex", flexDirection: "column", gap: 1, px: 2, pt: 1.5, pb: 1,
        ...(allThis ? { borderColor: "text.disabled", background: "linear-gradient(180deg, rgba(127,127,127,0.02), rgba(127,127,127,0.06))" } : {}),
        [MOBILE]: { alignItems: "center", textAlign: "center", gap: 0.75, px: 0.75, py: 1.5, ...(img.qr ? { gap: 0.25, py: 1, justifyContent: "center" } : {}) } } }, [
      // every icon in the same tile, a hole in its card (HOLE): the orbs (.me, monad) and the QR included -- the same
      // container for every object, so they can stand as one kind of card anywhere (a network view, a video stream)
      img.wallet ? WalletTile() : N("Box", { sx: { width: ICON.tile, height: ICON.tile, borderRadius: "18px", ...HOLE, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          [MOBILE]: img.qr ? { width: "auto", height: "auto", p: "4px", borderRadius: "14px" } : { width: ICON.small.tile, height: ICON.small.tile, borderRadius: "14px" } } }, [
        img.qr && G.QRme ? N("CleakerQRme", { value: img.qr, title })
          : img.bubble ? N("MonadBubble", { fallback: { light: img.light, dark: img.dark, alt: title, sx: { width: ICON.img, height: ICON.img, objectFit: "contain", [MOBILE]: { width: ICON.small.img, height: ICON.small.img } } } })
          : img.monad ? N("MeMonad", { fallback: { light: img.light, dark: img.dark, alt: title, sx: { width: ICON.img, height: ICON.img, objectFit: "contain", [MOBILE]: { width: ICON.small.img, height: ICON.small.img } } } })
          // zoom: an image drawn with a wide transparent margin (.GUI uses ~70% of its canvas) scaled up, so it looks as big as the others
          : N("ThemedImg", { light: img.light, dark: img.dark, alt: title, sx: { width: ICON.img, height: ICON.img, objectFit: "contain", ...(img.zoom ? { transform: `scale(${img.zoom})` } : {}), [MOBILE]: { width: ICON.small.img, height: ICON.small.img } } }),
      ]),
      // the title 10px under the larger icon (2px over the card's 8px gap); less padding than before, so the card grows less
      // than the icon; phones keep the compact gap
      N("Typography", { variant: "subtitle1", sx: { fontWeight: allThis ? 800 : 700, fontSize: "0.95rem", lineHeight: 1.25, mt: 0.25,
          [MOBILE]: img.qr ? { mt: 0, fontSize: "0.65rem", fontWeight: 600, lineHeight: 1.1, letterSpacing: "0.02em", color: "text.secondary" } : { mt: 0, fontSize: "0.8rem", overflowWrap: "anywhere" } } }, [title]),
      N("Typography", { variant: "body2", color: "text.secondary", sx: { ...TWO_LINES, fontSize: "0.825rem", lineHeight: 1.5, [MOBILE]: { display: "none" } } }, [desc]),
    ]);
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
  const sourceNav = N("Box", { component: "nav", "aria-label": "Source code", sx: { display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", justifyContent: "flex-end" } }, [
    label("Source Code", { mb: 0, mr: 0.5 }),
    ...SOURCES.map(([aria, href, img]) => N("Link", { href, ariaLabel: aria, title: aria, underline: "none",
      sx: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: "50%", ...HOLE, opacity: 0.9, "&:hover": { opacity: 1, bgcolor: "action.selected" } } },
      [N("ThemedImg", { ...img, sx: { width: 18, height: 18, objectFit: "contain", display: "block" } })])),
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
      "& [role=option]": { color: I(P.text.primary), borderColor: I(P.divider) },
      "& [role=option]:hover, & [role=option][aria-selected=true]": { background: I(P.action.hover) },
      "& [role=option] > span:nth-of-type(2) > span:nth-of-type(2), & [role=option] > span:nth-of-type(3)": { color: I(P.text.secondary) },
      // netget's tile in the quick grid: its letters and border in the theme's primary color, as on its Docs card. The
      // tile's <img> (netget-letters-on-*.svg, a fixed fill) keeps the size and goes invisible; the same letters are
      // painted over it as a mask in the theme color (the cropped letters, so they line up with the image).
      '& [role=listbox] a[href$="/netget/"]': { borderColor: I(P.primary.main) },
      '& [role=listbox] a[href$="/netget/"] > span:first-child': { backgroundColor: P.primary.main,
        WebkitMaskImage: "url(./assets/netget-letters-on-dark.svg)", maskImage: "url(./assets/netget-letters-on-dark.svg)",
        WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "center", maskPosition: "center" },
      '& [role=listbox] a[href$="/netget/"] > span:first-child img': { opacity: 0 },
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
      N("SearchBar", { src: "/index.json", placeholder: "Search in All.This", themeMode: "auto", enableSlashShortcut: true }),
    ]),
    N("Box", { sx: { order: 3, [MOBILE]: { ml: "auto" } } }, [N("HeaderControls", {})]),
  ]);
  const mainSections = (top) => N("Box", { component: "main", sx: { maxWidth: 960, mx: "auto", px: { xs: 2, sm: 4 }, pt: { xs: 4, sm: 7 }, pb: 6 } }, [
    header,
    ...(top || []),
    N("Box", { component: "section" }, [
      N("Link", { href: "https://neurons-me.github.io/docs/", underline: "hover", color: "inherit", sx: { display: "inline-block", mb: 1.75, color: "text.secondary" } }, [label("Docs")]),
      // as many cards as fit, at least 150px each (the 109px icon + padding), at most 4: 4 -> 3 -> 2 as the window narrows,
      // never a jump from 4 to 2; phones keep their own compact three
      grid(4, STACK.map(stackCard), { gridAutoRows: "1fr",
        gridTemplateColumns: "repeat(auto-fill, minmax(max(150px, calc((100% - 48px) / 4)), 1fr))",
        [TABLET]: { gridTemplateColumns: "repeat(auto-fill, minmax(max(150px, calc((100% - 48px) / 4)), 1fr))" },
        [MOBILE]: { gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 1.25 } }),
    ]),
    demosSection,
    section("Architecture & Benchmarks", grid(2, ARCH.concat(BENCH).map(resourceCard))),
    section("NRP & Axioms", grid(2, NRP.map(resourceCard))),
    section("Essays & Notation", grid(2, ESSAYS.map(resourceCard))),
    section("Network", N("Box", { sx: { display: "grid", gridTemplateColumns: "1fr" } }, NETWORK.map(resourceCard))),
  ]);

  const content = mainSections();
  const SETTINGS = (o) => G.GUISettings({ includeAdminViewToggle: false, includeRuntimeControlsToggle: false, includeThemesLink: false, brandLogoSrc: GREY, brandHref: "https://neurons.me", ...o });
  const spec = N("Layout", {
    TopBar: false, LeftBar: false, RightBar: false,
    Footer: { brandLogo: GREY, brandHref: "https://neurons.me", brandLabel: "neurons.me", position: "static" },
  }, [content]);

  // theme: neurons.me; first visit follows the OS setting (GUI.Theme alone doesn't), ?mode= overrides for screenshots
  const KEY = "neurons-index-gui.themeMode";
  let stored = null; try { stored = localStorage.getItem(KEY); } catch (e) {}
  const mode = params.get("mode") || stored || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  try { if (params.get("mode")) localStorage.setItem(KEY, mode); } catch (e) {}
  // Theme id: ?theme=<id> (a GUI.GuiThemes id) picks one and persists it; otherwise a first visit gets neurons.me.
  // Seeding the page-scoped key keeps Theme from falling back to the shared this.gui:themeId another .GUI page on
  // this origin may have set (GUI storybook / Veracruz.Port).
  const ID_KEY = (window.__thisGuiThemeScope && window.__thisGuiThemeScope.themeIdKey) || "neurons-index-gui.themeId";
  const askedTheme = params.get("theme");
  try {
    if (askedTheme && THEMES.some((t) => t.themeId === askedTheme)) localStorage.setItem(ID_KEY, askedTheme);
    else if (!localStorage.getItem(ID_KEY)) localStorage.setItem(ID_KEY, "neurons.me");
  } catch (e) {}
  const PageTheme = ({ children }) => h(G.Theme, { initialThemeId: "neurons.me", initialMode: mode }, children);

  const INSPECTOR_ON = params.get("inspector") === "1";
  const GRID_ON = params.get("grid") === "1"; // like ?inspector=1: page-level start state for screenshots/links
  if (G.getInspectorEnabled() !== INSPECTOR_ON) G.setInspectorEnabled(INSPECTOR_ON);
  const ROOT = document.getElementById("root");
  const mountPage = () => G.mount(spec, ROOT, {
    gui: { ...G, Theme: PageTheme, registry: { ...G.Registry, ...PAGE_TYPES } },
    devtools: { enabled: true, inspector: INSPECTOR_ON, adminView: false, inspectorToggleVisible: false },
  });
  window.__handle = mountPage();
})();
