// One-line include for generated doc sites (VitePress config `head`, TypeDoc `customJs`): loads the .GUI 4.1.0
// stack (SRI-pinned, same URLs as every other neurons.me page, so the browser cache is shared) and the docs shell.
// The page declares itself first:  window.NEURONS_DOCS = { host: "vitepress" | "typedoc", github, docs }
// The Jekyll theme layout writes the same tags statically instead (see neurons-me/_includes/docs-gui-head.html).
(function () {
  if (window.__docsGuiLoader) return; window.__docsGuiLoader = true;
  var V = "1"; // bump with docs-gui.js/css releases (GitHub Pages caches for 10 min)
  var HOST = "https://neurons-me.github.io";
  window.__thisGuiThemeScope = window.__thisGuiThemeScope || { scopeId: "neurons-index-gui", themeModeKey: "neurons-index-gui.themeMode", themeIdKey: "neurons-index-gui.themeId" };
  var head = document.head;
  function css(href, sri) { var l = document.createElement("link"); l.rel = "stylesheet"; l.href = href; if (sri) { l.integrity = sri; l.crossOrigin = "anonymous"; } head.appendChild(l); }
  var JS = [
    ["https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js", "sha384-DGyLxAyjq0f9SPpVevD6IgztCFlnMF6oW/XQGmfe+IsZ8TqEiDrcHkMLKI6fiB/Z"],
    ["https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js", "sha384-gTGxhz21lVGYNMcdJOyq01Edg0jhn/c22nsx0kyqP0TxaV5WVdsSH1fSDUf5YJj1"],
    ["https://cdn.jsdelivr.net/npm/this.gui@4.1.0/dist/this.gui.umd.js", "sha384-umBxi9YB2FkfPkyuR4Ej4TvKyweGkUbZnvIQh/ZzaF0YGstAGl5I6xJ9fnLC+76O"],
    [HOST + "/assets/docs-gui.js?v=" + V, null],
  ];
  css(HOST + "/assets/docs-gui.css?v=" + V);
  css("https://cdn.jsdelivr.net/npm/this.gui@4.1.0/dist/material-symbols.css", "sha384-dvUfVVY6nb2ef6F+dRTsSozZpefoOvMox4Ay4fQP86bSU+6yHovoYYKaRtwS+mca");
  (function next(i) { // in order; a failed CDN script stops the chain and the generator's own UI stays
    if (i >= JS.length) return;
    var s = document.createElement("script"); s.src = JS[i][0]; s.async = false;
    if (JS[i][1]) { s.integrity = JS[i][1]; s.crossOrigin = "anonymous"; }
    s.onload = function () { next(i + 1); };
    head.appendChild(s);
  })(0);
})();
