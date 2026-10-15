// Two islands, live: the unmodified this.me 4.2.1 from npm (shared loader /.me/assets/me-kernel, sha256 checked in
// this browser), four steps run in order. Every output below a step is computed here, now; nothing is pre-filled.
(function () {
  "use strict";
  var $ = function (q, el) { return (el || document).querySelector(q); };
  var steps = [].slice.call(document.querySelectorAll("#live .step"));
  var S = {}, done = 0;
  var short = function (h) { return h.slice(0, 8) + "…" + h.slice(-6); };
  var val = function (id) { return $("#" + id).value.trim(); };
  var q = JSON.stringify;
  var code = [
    function () { var a = val("ana-who") || "ana", b = val("bob-who") || "bob";
      return 'const ana = new ME("' + a + '", "' + "•".repeat(val("ana-secret").length) + '");\n' +
        'const bob = new ME("' + b + '", "' + "•".repeat(val("bob-secret").length) + '");\n' +
        'const p = await ana.prove({ expression: "' + a + '", rootNamespace: "cleaker.me" });\n' +
        'await ME.verifyEd25519Signature(p.publicKey, p.message, p.signature);'; },
    function () { return 'ana.diary["_"]("ana-diary-key");\nana.diary.note("meet at 9");\nana("diary.note");\nana.as(null)("diary.note");   // guest\nbob("diary.note");'; },
    function () { return 'const [kAna, kBob, kEve] = [await ME.generateP256KeyPair(), …, …];\n' +
      'const W = await ME.wrapSecretV1({ secret: "content-key-123", recipientPublicKey: kBob.publicKey, kid: "bob", class: "identity-key" });\n' +
      'await ME.unwrapSecretV1(W, kBob.privateKey, "utf8");\nawait ME.unwrapSecretV1(W, kEve.privateKey, "utf8");'; },
    function () { return 'ana.profile.city("Veracruz");\nconst snap = ana.exportSnapshot();\nbob.importSnapshot(snap);\nbob("profile.city");\nbob("diary.note");\nJSON.stringify(snap).includes("meet at 9");\nJSON.stringify(snap).includes("ana-diary-key");'; },
  ];
  var run = [
    async function (ME) {
      var a = val("ana-who") || "ana", b = val("bob-who") || "bob";
      S.ana = new ME(a, val("ana-secret")); S.bob = new ME(b, val("bob-secret"));
      var pa = await S.ana.prove({ expression: a, rootNamespace: "cleaker.me" });
      var pb = await S.bob.prove({ expression: b, rootNamespace: "cleaker.me" });
      var ok = await ME.verifyEd25519Signature(pa.publicKey, pa.message, pa.signature);
      var bad = await ME.verifyEd25519Signature(pa.publicKey, pa.message.replace(pa.namespace, pb.namespace), pa.signature);
      return [pa.namespace + "  identityHash " + short(pa.identityHash), pb.namespace + "  identityHash " + short(pb.identityHash),
        "signature " + short(pa.signature), "verify → " + ok, "verify, namespace swapped for " + pb.namespace + " → " + bad].join("\n");
    },
    async function () {
      S.ana.diary["_"]("ana-diary-key"); S.ana.diary.note("meet at 9");
      return ['ana("diary.note")           → ' + q(S.ana("diary.note")), 'ana.as(null)("diary.note")  → ' + String(S.ana.as(null)("diary.note")),
        'bob("diary.note")           → ' + String(S.bob("diary.note"))].join("\n");
    },
    async function (ME) {
      var ka = await ME.generateP256KeyPair(), kb = await ME.generateP256KeyPair(), ke = await ME.generateP256KeyPair(); void ka;
      var W = await ME.wrapSecretV1({ secret: "content-key-123", recipientPublicKey: kb.publicKey, kid: "bob", class: "identity-key" });
      var opened = await ME.unwrapSecretV1(W, kb.privateKey, "utf8"), eve;
      try { eve = "opened?! " + (await ME.unwrapSecretV1(W, ke.privateKey, "utf8")); } catch (e) { eve = "throws " + (e && e.name || "Error") + ": " + (e && e.message || e); }
      return ["wrap → { " + Object.keys(W).join(", ") + " }", "bob unwraps → " + q(opened), "eve unwraps → " + eve].join("\n");
    },
    async function () {
      S.ana.profile.city("Veracruz");
      var snap = S.ana.exportSnapshot(); S.bob.importSnapshot(snap); var j = JSON.stringify(snap);
      return ['bob("profile.city") → ' + q(S.bob("profile.city")), 'bob("diary.note")   → ' + String(S.bob("diary.note")),
        "snapshot " + j.length + " bytes · contains \"meet at 9\": " + j.includes("meet at 9") + " · contains \"ana-diary-key\": " + j.includes("ana-diary-key")].join("\n");
    },
  ];
  function paint(i) { var pre = $(".code", steps[i]); pre.textContent = code[i](); if (window.MeSyntax) window.MeSyntax.highlight(pre); }
  steps.forEach(function (st, i) { paint(i); });
  ["ana-who", "ana-secret", "bob-who", "bob-secret"].forEach(function (id) { $("#" + id).addEventListener("input", function () { paint(0); done = 0; S = {};
    steps.forEach(function (st) { var o = $(".out", st); o.hidden = true; o.textContent = ""; }); }); });
  var tip = $("#kernel-tip");
  function kstate() { var k = window.MeKernel && window.MeKernel.state; if (!k) return;
    tip.title = k.state === "ok" ? "this.me@4.2.1 from " + k.url + "\nsha256 " + k.hash + " (checked in this browser)" : k.state === "error" ? "kernel failed to load: " + k.text : "loading this.me@4.2.1…"; }
  if (window.MeKernel) { window.MeKernel.subscribe(kstate); kstate(); }
  async function upTo(i) {
    var ME = await window.MeKernel.load();
    for (var n = done; n <= i; n++) {
      var out = $(".out", steps[n]); out.hidden = false; out.classList.remove("err"); out.textContent = "running…";
      try { out.textContent = await run[n](ME); done = n + 1; } catch (e) { out.classList.add("err"); out.textContent = String(e && e.message || e); return; }
    }
  }
  // a step needs the ones before it: run from the first step not yet done (or afresh, if this one already ran)
  steps.forEach(function (st, i) { $("button", st).addEventListener("click", function () { if (i < done) { done = 0; S = {}; } upTo(i); }); });
})();
