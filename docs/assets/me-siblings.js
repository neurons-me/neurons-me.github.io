// me:// sibling switcher, shared by every .GUI topbar on neurons-me.github.io and /.me/ (landing-gui.js, docs-gui.js,
// /.me/assets/landing-gui/landing-gui.js and the demo pages). A small ▾ after a path segment lists the other pages at
// the same level: the children of the segment before it. Lists come from the real landing pages' cards; a segment only
// gets the ▾ when it is in its parent's list. Topbars load this file on demand and call MeSiblings.node(path, i),
// where path is [{ text, href }] (href null = this page). Needs window.React + window.GUI (this.gui 4.2.0).
(function () {
  if (window.MeSiblings) return;
  var ME = "https://neurons-me.github.io";
  var ROBOTS = [["ContextLab", "/robots/context-lab/"], ["Space", "/.me/Demos/Robots/Space/"], ["Warehouse", "/.me/Demos/Robots/Warehouse/"], ["Swarm", "/.me/Demos/Robots/Swarm/"]];
  var CITIES = [["Veracruz.Port", "/.me/Demos/SmartCities/Veracruz.Port/"], ["AI-Decides", "/.me/Demos/SmartCities/AI-Decides/"], ["AntCity", "/.me/Demos/SmartCities/AntCity/"],
    ["CityDelivery", "/.me/Demos/SmartCities/CityDelivery/"], ["SelfCleaningCity", "/.me/Demos/SmartCities/SelfCleaningCity/"], ["GTFS Madrid", "/.me/Tests/gtfs-madrid-universe.html"]];
  // parent path → its children (one level). Aliases: /.me/Demos/Robots/ and /.me/Demos/SmartCities/ redirect to the hubs.
  var MAP = {
    "/.me/": [["Docs", "/.me/docs/"], ["Demos", "/.me/Demos/"], ["Benchmarks", "/.me/docs/Benchmarks/"], ["Tests", "/.me/tests/"]],
    "/.me/Demos/": [["SmartCities", "/smart-cities/"], ["Robots", "/robots/"], ["SocialGraphs", "/social-graphs/"], ["DigitalSpaceAlgebra", "/digital-space-algebra/"],
      ["WalletSplit", "/.me/Typescript/typedocs/examples/WalletSplit.html"], ["AffinityModel", "/.me/Demos/AffinityModel/"], ["Shops", "/.me/Typescript/typedocs/examples/Shops_Admin.html"]],
    "/robots/": ROBOTS, "/.me/Demos/Robots/": ROBOTS,
    "/smart-cities/": CITIES, "/.me/Demos/SmartCities/": CITIES,
    "/social-graphs/": [["AffinityModel", "/.me/Demos/AffinityModel/"], [".wallet Split", "/.wallet/paypal/split/"], ["Robots × Encrypted Audiences", "/social-graphs/robots-encrypted-audiences/"], ["Encrypted Audiences", "/encrypted-audiences/"]],
    "/.me/docs/Benchmarks/": [["Kernel", "/.me/docs/Benchmarks/benchmarks.html"], ["GTFS", "/.me/docs/Benchmarks/GTFS/"], ["Phases", "/.me/docs/Benchmarks/Phases/"], ["Secret-Scope", "/.me/docs/Benchmarks/Secret-Scope/"]],
    // Tests hub = test-pages/index.html (permalink /.me/tests/): five categories plus the last run (same order as the hub).
    "/.me/tests/": [["Axioms", "/.me/tests/axioms/"], ["Identity", "/.me/tests/identity/"], ["Space Algebra", "/.me/tests/space-algebra/"],
      ["Guarantees", "/.me/tests/guarantees/"], ["Security", "/.me/tests/security/"], ["Last run", "/.me/tests/runs/2026-10-26/"]],
  };
  var pathOf = function (u) { try { return decodeURI(new URL(u, location.href).pathname).replace(/index\.html?$/i, ""); } catch (e) { return null; } };
  var norm = function (t) { return String(t || "").toLowerCase().replace(/[^a-z0-9]/g, ""); };
  function list(P, i) {
    var parent = i > 0 && P[i - 1] && P[i - 1].href && MAP[pathOf(P[i - 1].href)];
    var here = pathOf(P[i].href || location.href), any = false;
    var items = (parent || []).map(function (x) { var cur = pathOf(ME + x[1]) === here || norm(x[0]) === norm(P[i].text); any = any || cur; return { text: x[0], href: ME + x[1], current: cur }; });
    if (any) return items;
    // A top-level page shown deeper (me:// / Docs / Benchmarks): fall back to the me:// list when its path is in it.
    return i > 0 && parent !== MAP["/.me/"] && MAP["/.me/"].some(function (x) { return pathOf(ME + x[1]) === here; }) ? list([{ href: ME + "/.me/" }, P[i]], 1) : null;
  }
  var h = React.createElement, G = window.GUI, Menu = G.Molecules.Menu, MenuItem = G.Molecules.MenuItem, Box = G.Atoms.Box, IconButton = G.Atoms.IconButton;
  var MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", n = 0;
  var chevron = h("svg", { viewBox: "0 0 24 24", width: 16, height: 16, fill: "currentColor", "aria-hidden": "true", style: { display: "block" } }, h("path", { d: "M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z" }));
  function Switcher(p) {
    var st = React.useState(null), anchor = st[0], setAnchor = st[1], idr = React.useRef("me-sib-" + (++n)), id = idr.current;
    var close = function () { setAnchor(null); }, label = "Pages at the same level as " + p.label;
    return h(React.Fragment, null,
      h(IconButton, { size: "small", "data-sibling-switcher": p.label, "aria-label": label, title: "Same level", "aria-haspopup": "menu", "aria-expanded": anchor ? "true" : "false", "aria-controls": anchor ? id : undefined,
        onClick: function (e) { setAnchor(anchor ? null : e.currentTarget); },
        sx: { color: "text.secondary", p: 0, ml: .1, width: { xs: 32, sm: 24 }, height: { xs: 32, sm: 24 }, borderRadius: 1, flexShrink: 0, "&:hover": { color: "text.primary" } } }, chevron),
      h(Menu, { id: id, anchorEl: anchor, open: !!anchor, onClose: close, "data-gui-inspector-control": "true", marginThreshold: 8,
        anchorOrigin: { vertical: "bottom", horizontal: "left" }, transformOrigin: { vertical: "top", horizontal: "left" },
        slotProps: { list: { "aria-label": label, dense: true }, paper: { sx: { mt: .5, minWidth: 200, maxWidth: "calc(100vw - 16px)" } } } },
        p.items.map(function (it) {
          return h(MenuItem, { key: it.href, component: "a", href: it.href, selected: it.current, "aria-current": it.current ? "page" : undefined, onClick: close,
            sx: { fontFamily: MONO, fontSize: 13, minHeight: 36, gap: 1, color: it.current ? "text.primary" : "text.secondary", fontWeight: it.current ? 700 : 400, whiteSpace: "normal" } },
            h(Box, { component: "span", "aria-hidden": "true", sx: { width: 8, flexShrink: 0, color: "primary.main" } }, it.current ? "\u2022" : ""), it.text);
        })));
  }
  window.MeSiblings = { MAP: MAP, list: list, Switcher: Switcher,
    node: function (P, i) { var items = list(P, i); return items ? h(Switcher, { key: "sib" + i, items: items, label: P[i].text }) : null; } };
  dispatchEvent(new Event("me-siblings"));
})();
