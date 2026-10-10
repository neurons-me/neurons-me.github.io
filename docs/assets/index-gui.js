// neurons.me index (https://neurons-me.github.io/) on .GUI 4.1.0. Loaded by docs/index.html.
// Everything renders through GUI.mount + GUI registry types (Layout/Footer, Card, Box, Typography,
// Link, Chip, SearchBar). Two small page-local types fill gaps the registry doesn't cover:
//   ThemedImg     — picks a light/dark image from GUI.useThemeContext().mode (no GUI image atom has that)
//   AudienceMark  — the two-circle SVG icon used on two Essays cards
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
  const MOBILE = "@media (max-width:480px)", TABLET = "@media (max-width:720px)";

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
    //  · orb 48px (34px on phones) and a gentler float (-3px, ×1.04) so it never leaves its 68/48px slot;
    //  · the widget's "glow" (opacity 0.3–0.5 pulse + white halo) replaced by a faint halo pulse, full opacity;
    //  · the ring at 80% of the orb (closer to its edge, farther from the dot), the dot at 22% of the ring, soft shadows;
    //  · ring box and ring inherit the orb's animated border-radius, so the ring morphs with the outer circle.
    const box = small ? 48 : 68, orb = small ? 34 : 48;
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
  function MonadBubble({ fallback }) {
    const Monad = (G.Widgets && G.Widgets.Monad) || G.Monad;
    const q = "(max-width:480px)", [small, setSmall] = React.useState(() => window.matchMedia(q).matches);
    React.useEffect(() => { const m = window.matchMedia(q), on = () => setSmall(m.matches); m.addEventListener("change", on); return () => m.removeEventListener("change", on); }, []);
    if (!Monad) return h(ThemedImg, fallback);
    const box = small ? 48 : 68, k = (small ? 34 : 48) / 60;
    const blob = { "0%,100%": "50%", "25%": "55% 45% 60% 40% / 60% 55% 45% 40%", "50%": "50% 60% 40% 55% / 55% 40% 60% 45%", "75%": "45% 55% 40% 60% / 40% 60% 55% 50%" };
    const lift = { "0%,100%": [0, 1], "25%": [-2, 1.02], "50%": [-3, 1.04], "75%": [-2, 1.02] };
    return h(G.Box, { role: "img", "aria-label": fallback.alt, sx: (t) => {
        const halo = t.palette.mode === "dark" ? "159,246,255" : "0,90,122";
        return { position: "relative", zIndex: 0, isolation: "isolate", width: box, height: box, display: "flex", alignItems: "center", justifyContent: "center",
          "@keyframes monadOrbFloat": Object.fromEntries(Object.keys(blob).map((p) => [p, { transform: `translateY(${lift[p][0] / k}px) scale(${lift[p][1]})`, borderRadius: blob[p] }])),
          "@keyframes monadOrbHalo": { "0%,100%": { boxShadow: `0 0 3px rgba(${halo},0.14)` }, "50%": { boxShadow: `0 0 5px rgba(${halo},0.22)` } },
          "& .monad-tooltip": { display: "none" },
          "& div:has(> div[aria-hidden=true])": { opacity: "1 !important", animation: "monadOrbFloat 6s ease-in-out infinite, monadOrbHalo 4.5s ease-in-out infinite !important", "&:hover": { transform: "none" } } };
      } },
      h(G.Box, { sx: { width: 60, height: 60, flexShrink: 0, transform: `scale(${k})`, display: "flex" } },
        h(Monad, { variant: "bubble", kind: "monad", mode: "contained" })));
  }
  const PAGE_TYPES = { ThemedImg, AudienceMark, HeaderControls, MeMonad, MonadBubble };

  // ── content (from docs/index.html @ 6bee309) ──
  const STACK = [
    [".me", "Own your knowledge.", "https://neurons-me.github.io/.me/", { monad: true, light: CL + "v1761149332/this.me-removebg-preview_2_j1eoiy.png", dark: CL + "v1760758662/this.me-removebg-preview_fvyeda.png" }],
    ["cleaker", "Who am I, here.", "https://neurons-me.github.io/Cleaker/", { light: CL + "v1765054949/cleaker.me_gusn1q.png" }],
    ["monad", "Federated runtime surfaces.", "https://neurons-me.github.io/monad/", { bubble: true, light: CL + "v1778090977/monad.ai.profile-removebg-preview_np26yp.png" }],
    [".GUI", "Generative User Interface.", "https://neurons-me.github.io/GUI/", { light: CL + "v1760629119/this.gui.neurons.me_mkapde.png" }],
    ["netget", "A Gateway To the Web. Routes http:https Requests.", "https://neurons-me.github.io/netget/", { light: CL + "v1778254832/me.docs.axioms__1_-removebg-preview_xvdqof.png", dark: CL + "v1778177581/ChatGPT_Image_May_7_2026_12_12_28_PM_xzkwtc.png" }],
    ["Explore All.This", "Across the neurons.me ecosystem.", "https://github.com/neurons-me", { light: CL + "v1765903003/all.this_sr55ml.webp" }, true],
  ];
  const SOURCES = [
    ["npm: @neurons.me", "https://www.npmjs.com/org/neurons.me", { light: "https://cdn.simpleicons.org/npm/CB3837" }],
    ["GitHub: neurons-me", "https://github.com/neurons-me", SI("github", "0f1720")],
    ["PyPI: neurons.me", "https://pypi.org/user/neurons.me/", { light: "https://cdn.simpleicons.org/pypi/3775A9" }],
    ["crates.io: neurons-me", "https://crates.io/users/neurons-me", SI("rust", "0f1720")],
  ];
  const MEDIA = "https://neurons-me.github.io/neurons-me/media/";
  const DEMOS = [
    ["Robots that Understand Context", "https://neurons-me.github.io/robots/", MEDIA + "robots_that_understand_context_gif.gif"],
    ["Smart Cities", "https://neurons-me.github.io/smart-cities/", MEDIA + "smart_cities.gif"],
    ["Social Networks", "https://neurons-me.github.io/.me/Typescript/typedocs/examples/Social_Graph.html", MEDIA + "SocialGraph.jpg"],
    ["Digital Space Algebra", "https://neurons-me.github.io/digital-space-algebra/", MEDIA + "Encrypted_Audience_Algebra.gif"],
    ["Wallet Split", "https://neurons-me.github.io/.me/Typescript/typedocs/examples/WalletSplit.html", MEDIA + "split_bill_wallet.gif"],
    ["Affinity Model", "https://neurons-me.github.io/.me/Typescript/typedocs/examples/Affinity-Model.html", MEDIA + "affinity_model.gif"],
  ];
  // resource: [title, desc (string | array with {code}), href, icon, chips?]
  // icon: { img: {light,dark} } | { glyph, size } | { mark: true } | { img, plate }
  const code = (t) => ({ code: t });
  const ARCH = [["Identity-Bound Secrets", "Proposed design for private roots, secret scopes, noise, and persistence — with package responsibilities and 11 acceptance criteria.", "https://neurons-me.github.io/architecture/identity-bound-secrets/", { glyph: "🔐", size: "1.6rem" }]];
  const BENCH = [
    ["Phase 2 · Disk & Write Pressure", "Incremental disk persistence, explain-lookup latency, and sustained write/rewrite pressure on the kernel.", "https://github.com/neurons-me/.me/tree/main/Typescript/tests/Phases", { img: SI("speedtest", "0f1720") }],
    ["Phase 3 · Vector Search", "Exact vs. IVF semantic search at scale — corpus, tuning, and cascade-dependency benchmarks.", "https://github.com/neurons-me/.me/tree/main/Typescript/tests/Phases", { img: SI("chartdotjs", "0f1720") }],
    ["Secret Scope & Scaling", "Push vs. pull and public vs. secret-scope cost — p50/p95/p99 latency baselines across node counts.", "https://github.com/neurons-me/.me/tree/main/Typescript/tests/Benchmarks", { img: SI("googleanalytics", "0f1720") }],
  ];
  const NRP = [
    ["NRP · Namespace Resolution Protocol", ["Mesh-aware resolution for ", code("me://"), " paths — discover, score, forward, learn. A living network of monads, not a static DNS table."], "https://neurons-me.github.io/NRP/", { glyph: "𓅓", size: "1.8rem" }],
    ["Axioms · The Kernel's Invariants", ["The non-negotiable guarantees ", code(".me"), " is built on — stealth disclosure, hash-chain integrity, deterministic conflict resolution."], "https://neurons-me.github.io/.me/docs/Axioms.html", { glyph: "𓊽", size: "1.8rem" }],
  ];
  const ESSAYS = [
    ["The Algebra of Encrypted Audiences III", "Two islands, one shared space — the connection between identities emerges from a verifiable intersection between their contexts, not from a central authority.", "https://neurons-me.github.io/encrypted-audiences/", { mark: true },
      [["ES", "https://neurons-me.github.io/algebra_audiencias_cifradas.html"], ["JA", "https://neurons-me.github.io/algebra_of_encrypted_audiences_ja.html"]]],
    ["The Equations — Visual Infographics Edition", "Every original formula on sui.gn, one glossary — context algebra, SpaceStructure, audience algebra, O(k) — imported results clearly marked, not claimed.", "https://neurons-me.github.io/Equations-Visual-Infographics-Edition.html", { glyph: "Σ", size: "1.8rem" },
      [["ES", "https://neurons-me.github.io/Equations-Visual-Infographics-Edition_es.html"], ["JA", "https://neurons-me.github.io/Equations-Visual-Infographics-Edition_ja.html"]]],
    ["Inverted Dependency Indexing — Visualized", "Why changing 1 node in 1,000,000 touches only 6, not 1,000,000 — the .me kernel's reverse index and O(k) mutation cost, in a hand-drawn precision visualization.", "https://neurons-me.github.io/Inverted-Dependency-Indexing-Beautiful-Viz.html", { glyph: "◉", size: "1.6rem" }],
    ["Robots — Human Version", "One object, four meanings, zero copies — how context algebra lets robots understand meaning by pointing to facts instead of duplicating them.", "https://neurons-me.github.io/Robots-Versi%C3%B3n-Humana.html", { glyph: "🤖", size: "1.6rem" }],
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
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    ...(cols > 2 ? { [TABLET]: { gridTemplateColumns: "repeat(2, 1fr)" } } : {}),
    [MOBILE]: { gridTemplateColumns: "1fr" },
    ...(extra || {}) } }, children);
  const cardSx = { textDecoration: "none", color: "inherit", height: "100%", borderRadius: "12px",
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
      bgcolor: icon.plate || "action.hover" } }, [inner]);
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
  const stackCard = ([title, desc, href, img, allThis]) =>
    N("Card", { component: "a", href, variant: "outlined", sx: { ...cardSx, display: "flex", flexDirection: "column", gap: 1, px: 2.5, py: 2.25,
        ...(allThis ? { borderColor: "text.disabled", background: "linear-gradient(180deg, rgba(127,127,127,0.02), rgba(127,127,127,0.06))" } : {}),
        [MOBILE]: { alignItems: "center", textAlign: "center", gap: 0.75, px: 0.75, py: 1.5 } } }, [
      N("Box", { sx: { width: 68, height: 68, borderRadius: "14px", bgcolor: "action.hover", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          [MOBILE]: { width: 48, height: 48, borderRadius: "10px" } } }, [
        img.bubble ? N("MonadBubble", { fallback: { light: img.light, dark: img.dark, alt: title, sx: { width: 56, height: 56, objectFit: "contain", [MOBILE]: { width: 38, height: 38 } } } })
          : img.monad ? N("MeMonad", { fallback: { light: img.light, dark: img.dark, alt: title, sx: { width: 56, height: 56, objectFit: "contain", [MOBILE]: { width: 38, height: 38 } } } })
          : N("ThemedImg", { ...img, alt: title, sx: { width: 56, height: 56, objectFit: "contain", [MOBILE]: { width: 38, height: 38 } } }),
      ]),
      N("Typography", { variant: "subtitle1", sx: { fontWeight: allThis ? 800 : 700, fontSize: "0.95rem", lineHeight: 1.25, [MOBILE]: { fontSize: "0.8rem", overflowWrap: "anywhere" } } }, [title]),
      N("Typography", { variant: "body2", color: "text.secondary", sx: { fontSize: "0.825rem", lineHeight: 1.5, [MOBILE]: { display: "none" } } }, [desc]),
    ]);
  const demoCard = ([title, href, img]) =>
    N("Card", { component: "a", href, variant: "outlined", sx: { ...cardSx, display: "flex", flexDirection: "row", alignItems: "stretch", minHeight: 140, overflow: "hidden", p: 0 } }, [
      // 2:3 like the portrait GIFs: the card is as tall as its image (~210px at 1280), as on the static page.
      N("Box", { component: "img", src: img, alt: "", sx: { width: "clamp(140px, 45%, 240px)", height: "auto", aspectRatio: "2 / 3", minHeight: 140, objectFit: "cover", flexShrink: 0, display: "block" } }),
      N("Box", { sx: { display: "flex", alignItems: "center", flex: 1, minWidth: 0, p: "clamp(14px, 2vw, 20px) clamp(20px, 3vw, 40px) clamp(14px, 2vw, 20px) clamp(14px, 2vw, 24px)" } }, [
        N("Typography", { component: "span", sx: { fontWeight: 900, fontSize: "clamp(0.95rem, 1vw + 0.75rem, 1.2rem)", lineHeight: 1.15, overflowWrap: "normal", wordBreak: "keep-all", hyphens: "none" } }, [title]),
      ]),
    ]);
  const sourceRow = N("Box", { component: "section", sx: { mt: 5, display: "flex", alignItems: "center", gap: 1.75, flexWrap: "wrap" } }, [
    label("Source Code"),
    N("Box", { component: "nav", "aria-label": "Source code", sx: { display: "flex", alignItems: "center", gap: 0.5 } },
      SOURCES.map(([aria, href, img]) => N("Link", { href, ariaLabel: aria, underline: "none",
        sx: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 2, opacity: 0.85, "&:hover": { opacity: 1, bgcolor: "action.hover" } } },
        [N("ThemedImg", { ...img, sx: { width: 20, height: 20, objectFit: "contain", display: "block" } })]))),
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
      N("SearchBar", { src: "https://neurons-me.github.io/index.json", placeholder: "Search in All.This", themeMode: "auto", enableSlashShortcut: true }),
    ]),
    N("Box", { sx: { order: 3, [MOBILE]: { ml: "auto" } } }, [N("HeaderControls", {})]),
  ]);
  const mainSections = (top) => N("Box", { component: "main", sx: { maxWidth: 960, mx: "auto", px: { xs: 2, sm: 4 }, pt: { xs: 4, sm: 7 }, pb: 6 } }, [
    header,
    ...(top || []),
    N("Box", { component: "section" }, [
      label("Stack", { mb: 1.75 }),
      grid(3, STACK.map(stackCard), { gridAutoRows: "1fr", [MOBILE]: { gridTemplateColumns: "repeat(3, 1fr)", gap: 1.25 } }),
    ]),
    sourceRow,
    section("Demos", grid(3, DEMOS.map(demoCard))),
    section("Architecture", grid(2, ARCH.map(resourceCard))),
    section("Benchmarks", grid(3, BENCH.map(resourceCard))),
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
