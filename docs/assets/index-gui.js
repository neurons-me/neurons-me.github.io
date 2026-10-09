// neurons.me index (https://neurons-me.github.io/) on .GUI 4.1.0. Loaded by docs/index.html.
// Everything renders through GUI.mount + GUI registry types (Layout/TopBar/Footer, Card, Box, Typography,
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
  // Search: the registry SearchBar entry (no new API) rendered as the TopBar's center action element.
  function TopSearch() {
    return G.Registry.SearchBar.resolve({ type: "SearchBar", props: { src: "https://neurons-me.github.io/index.json", placeholder: "Search in All.This", themeMode: "auto", enableSlashShortcut: true } });
  }
  const PAGE_TYPES = { ThemedImg, AudienceMark };

  // ── content (from docs/index.html @ 6bee309) ──
  const STACK = [
    [".me", "Own your knowledge.", "https://neurons-me.github.io/.me/", { light: CL + "v1761149332/this.me-removebg-preview_2_j1eoiy.png", dark: CL + "v1760758662/this.me-removebg-preview_fvyeda.png" }],
    ["cleaker", "Who am I, here.", "https://neurons-me.github.io/Cleaker/", { light: CL + "v1765054949/cleaker.me_gusn1q.png" }],
    ["monad", "Federated runtime surfaces.", "https://neurons-me.github.io/monad/", { light: CL + "v1778090977/monad.ai.profile-removebg-preview_np26yp.png" }],
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
    ["Robots that Understand Context", "https://neurons-me.github.io/.me/docs/Robots-That-Understand-Context.html", MEDIA + "robots_that_understand_context_gif.gif"],
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
    ["Robots — Human Version", "One object, four meanings, zero copies — how context algebra lets robots understand meaning by pointing to facts instead of duplicating them.", "https://neurons-me.github.io/robots/", { glyph: "🤖", size: "1.6rem" }],
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
        N("ThemedImg", { ...img, alt: title, sx: { width: 56, height: 56, objectFit: "contain", [MOBILE]: { width: 38, height: 38 } } }),
      ]),
      N("Typography", { variant: "subtitle1", sx: { fontWeight: allThis ? 800 : 700, fontSize: "0.95rem", lineHeight: 1.25, [MOBILE]: { fontSize: "0.8rem", overflowWrap: "anywhere" } } }, [title]),
      N("Typography", { variant: "body2", color: "text.secondary", sx: { fontSize: "0.825rem", lineHeight: 1.5, [MOBILE]: { display: "none" } } }, [desc]),
    ]);
  const demoCard = ([title, href, img]) =>
    N("Card", { component: "a", href, variant: "outlined", sx: { ...cardSx, display: "flex", flexDirection: "row", alignItems: "stretch", minHeight: 140, overflow: "hidden", p: 0 } }, [
      N("Box", { component: "img", src: img, alt: "", sx: { width: "clamp(140px, 45%, 240px)", height: 140, objectFit: "cover", flexShrink: 0, display: "block" } }),
      N("Box", { sx: { display: "flex", alignItems: "center", flex: 1, minWidth: 0, px: 2.5, py: 2 } }, [
        N("Typography", { component: "span", sx: { fontWeight: 900, fontSize: "clamp(0.95rem, 1vw + 0.75rem, 1.2rem)", lineHeight: 1.15 } }, [title]),
      ]),
    ]);
  const sourceRow = N("Box", { component: "section", sx: { mt: 5, display: "flex", alignItems: "center", gap: 1.75, flexWrap: "wrap" } }, [
    label("Source Code"),
    N("Box", { component: "nav", "aria-label": "Source code", sx: { display: "flex", alignItems: "center", gap: 0.5 } },
      SOURCES.map(([aria, href, img]) => N("Link", { href, ariaLabel: aria, underline: "none",
        sx: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 2, opacity: 0.85, "&:hover": { opacity: 1, bgcolor: "action.hover" } } },
        [N("ThemedImg", { ...img, sx: { width: 20, height: 20, objectFit: "contain", display: "block" } })]))),
  ]);

  const mainSections = (top) => N("Box", { component: "main", sx: { maxWidth: 960, mx: "auto", px: { xs: 2, sm: 4 }, pt: { xs: 2, sm: 3 }, pb: 6 } }, [
    N("Typography", { variant: "body2", color: "text.secondary" }, ["Go Algorithmic."]),
    ...(top || []),
    N("Box", { component: "section", sx: { mt: 3 } }, [
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
  const withMobileSearch = mainSections([N("Box", { sx: { mt: 1.5 } }, [N("SearchBar", { src: "https://neurons-me.github.io/index.json", placeholder: "Search in All.This", themeMode: "auto" })])]);
  const SETTINGS = (o) => G.GUISettings({ includeAdminViewToggle: false, includeRuntimeControlsToggle: false, includeThemesLink: false, brandLogoSrc: GREY, brandHref: "https://neurons.me", ...o });
  const NARROW = matchMedia("(max-width: 599.95px)"); // MUI "sm" breakpoint, where TopBar collapses its center
  const buildSpec = (narrow) => N("Layout", {
    TopBar: {
      title: "neurons.me",
      logo: LOGO,
      homeTo: "https://neurons-me.github.io/",
      collapsedIconCenter: "search",
      // desktop/tablet: SearchBar in the TopBar center. Below 600px the TopBar collapses center items into an
      // icon menu that renders the SearchBar as an empty popover, so on phones it moves into the content instead.
      elementsCenter: narrow ? [] : [{ type: "action", props: { label: "Search", icon: "search", tooltip: "Search in All.This", element: h(TopSearch) } }],
      // Below 600px TopBar 4.1.0 collapses its right side into a "…" menu that drops 'action' elements
      // (TopBar.tsx: "'action' elements are not included in collapsed menu"), so the theme toggle / settings /
      // inspector menu would be unreachable. On phones they go to the Footer, which keeps actions on mobile.
      collectionsRight: narrow ? [] : [SETTINGS({})],
    },
    Footer: { brandLogo: GREY, brandHref: "https://neurons.me", brandLabel: "neurons.me", position: "static", ...(narrow ? { rightCollections: [SETTINGS({ includeBrand: false })] } : {}) },
    LeftBar: false, RightBar: false,
  }, [narrow ? withMobileSearch : content]);

  // theme: neurons.me; first visit follows the OS setting (GUI.Theme alone doesn't), ?mode= overrides for screenshots
  const KEY = "neurons-index-gui.themeMode";
  let stored = null; try { stored = localStorage.getItem(KEY); } catch (e) {}
  const mode = params.get("mode") || stored || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  try { if (params.get("mode")) localStorage.setItem(KEY, mode); } catch (e) {}
  const PageTheme = ({ children }) => h(G.Theme, { initialThemeId: "neurons.me", initialMode: mode }, children);

  const INSPECTOR_ON = params.get("inspector") === "1";
  if (G.getInspectorEnabled() !== INSPECTOR_ON) G.setInspectorEnabled(INSPECTOR_ON);
  const ROOT = document.getElementById("root");
  const mountPage = () => G.mount(buildSpec(NARROW.matches), ROOT, {
    gui: { ...G, Theme: PageTheme, registry: { ...G.Registry, ...PAGE_TYPES } },
    devtools: { enabled: true, inspector: INSPECTOR_ON, adminView: false, inspectorToggleVisible: false },
  });
  window.__handle = mountPage();
  NARROW.addEventListener("change", () => { window.__handle && window.__handle.unmount && window.__handle.unmount(); window.__handle = mountPage(); });
})();
