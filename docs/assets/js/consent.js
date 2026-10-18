/*
 * neurons.me -- consent, and the Meta Pixel that depends on it.
 *
 * The pixel is NOT loaded until the visitor accepts: before that (and always after a rejection) nothing is requested from
 * Meta, no Meta cookie is set, nothing is sent. The choice is kept in this browser only (localStorage), is never sent anywhere,
 * and can be changed at any time from the "Privacy · Cookies" link that stays on every page.
 *
 * One file, loaded by one line on every page (the Jekyll layouts include it, the hand-written pages carry that line):
 *   <script src="/assets/js/consent.js" defer></script>
 */
(function () {
  'use strict';
  var PIXEL_ID = '2635461650224867';
  var KEY = 'neurons-consent-v1';
  var PRIVACY = '/privacy.html';
  var es = /^es\b/i.test((navigator.language || '') + '');
  var T = es ? {
    title: 'Cookies y privacidad',
    text: 'Usamos cookies de terceros (incluido Meta) para analítica y medición de anuncios. Solo se cargan si las aceptas.',
    accept: 'Aceptar', reject: 'Rechazar', more: 'Política de privacidad',
    link: 'Privacidad · Cookies', now: 'Ahora: ', on: 'aceptado', off: 'rechazado', none: 'sin decidir'
  } : {
    title: 'Cookies and privacy',
    text: 'We use third-party cookies (including Meta) for analytics and ad measurement. They only load if you accept.',
    accept: 'Accept', reject: 'Reject', more: 'Privacy policy',
    link: 'Privacy · Cookies', now: 'Now: ', on: 'accepted', off: 'rejected', none: 'undecided'
  };

  function read() {
    try { var v = JSON.parse(localStorage.getItem(KEY)); return v && typeof v.marketing === 'boolean' ? v : null; }
    catch (e) { return null; }
  }
  function write(marketing) {
    try { localStorage.setItem(KEY, JSON.stringify({ marketing: marketing, ts: Date.now() })); } catch (e) { /* no storage: asked again next visit */ }
  }

  function loadPixel() {
    if (window.fbq || document.getElementById('meta-pixel-loader')) return;
    var f = window, b = document, n;
    n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
    var t = b.createElement('script');
    t.async = true; t.id = 'meta-pixel-loader';
    t.src = 'https://connect.facebook.net/en_US/fbevents.js';
    var s = b.getElementsByTagName('script')[0];
    (s && s.parentNode ? s.parentNode : b.head).insertBefore(t, s || null);
    f.fbq('init', PIXEL_ID);
    f.fbq('track', 'PageView');
  }

  // Meta's cookies live on our own domain (set by its script): remove them when consent is withdrawn.
  function clearMetaCookies() {
    var host = location.hostname.split('.');
    var domains = [location.hostname];
    for (var i = 1; i < host.length - 1; i += 1) domains.push('.' + host.slice(i).join('.'));
    ['_fbp', '_fbc'].forEach(function (name) {
      domains.forEach(function (d) { document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + d; });
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    });
  }

  var css =
    '#neurons-consent{position:fixed;left:12px;right:12px;bottom:12px;z-index:2147483000;max-width:560px;margin:0 auto;padding:14px 16px;' +
    'border-radius:12px;font:14px/1.45 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#fff;color:#111;border:1px solid rgba(0,0,0,.2);box-shadow:0 8px 30px rgba(0,0,0,.25)}' +
    '#neurons-consent strong{display:block;margin-bottom:4px}#neurons-consent p{margin:0 0 10px}#neurons-consent a{color:inherit;text-decoration:underline}' +
    '#neurons-consent .nc-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}' +
    '#neurons-consent button{flex:1 1 120px;padding:9px 14px;border-radius:8px;border:1px solid currentColor;background:transparent;color:inherit;font:inherit;font-weight:600;cursor:pointer}' +
    '#neurons-consent button:focus-visible,#neurons-consent-open:focus-visible{outline:2px solid #2b7cff;outline-offset:2px}' +
    '#neurons-consent .nc-now{margin-top:8px;font-size:12px;opacity:.7}' +
    '#neurons-consent-open{position:fixed;right:10px;bottom:10px;z-index:2147482999;padding:4px 8px;border-radius:6px;font:11px/1.2 system-ui,sans-serif;' +
    'background:rgba(255,255,255,.85);color:#222;border:1px solid rgba(0,0,0,.25);cursor:pointer;opacity:.75}#neurons-consent-open:hover{opacity:1}' +
    '@media (prefers-color-scheme:dark){#neurons-consent{background:#161616;color:#eee;border-color:rgba(255,255,255,.25)}' +
    '#neurons-consent-open{background:rgba(22,22,22,.85);color:#ddd;border-color:rgba(255,255,255,.25)}}';

  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    for (var k in (attrs || {})) e.setAttribute(k, attrs[k]);
    if (text) e.textContent = text;
    return e;
  }

  function closeBanner() { var b = document.getElementById('neurons-consent'); if (b) b.parentNode.removeChild(b); }

  function decide(marketing) {
    var before = read();
    write(marketing);
    closeBanner();
    if (marketing) { loadPixel(); }
    else if ((before && before.marketing) || window.fbq) { clearMetaCookies(); location.reload(); }  // nothing of Meta stays in this page
  }

  function showBanner() {
    closeBanner();
    var cur = read();
    var box = el('div', { id: 'neurons-consent', role: 'dialog', 'aria-label': T.title });
    box.appendChild(el('strong', {}, T.title));
    var p = el('p', {}, T.text + ' ');
    p.appendChild(el('a', { href: PRIVACY }, T.more));
    box.appendChild(p);
    var row = el('div', { 'class': 'nc-row' });
    var no = el('button', { type: 'button' }, T.reject), yes = el('button', { type: 'button' }, T.accept);
    no.onclick = function () { decide(false); }; yes.onclick = function () { decide(true); };
    row.appendChild(no); row.appendChild(yes);   // same size, same weight
    box.appendChild(row);
    box.appendChild(el('div', { 'class': 'nc-now' }, T.now + (cur ? (cur.marketing ? T.on : T.off) : T.none)));
    document.body.appendChild(box);
    yes.focus();
  }

  function init() {
    var style = el('style'); style.textContent = css; document.head.appendChild(style);
    var open = el('button', { id: 'neurons-consent-open', type: 'button' }, T.link);
    open.onclick = showBanner;
    document.body.appendChild(open);
    var c = read();
    if (c && c.marketing) loadPixel();
    else if (!c) showBanner();
  }

  window.neuronsConsent = { open: showBanner, state: function () { var c = read(); return c ? (c.marketing ? 'accepted' : 'rejected') : 'undecided'; } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
