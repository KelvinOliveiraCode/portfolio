/* i18n.js — troca PT/EN do site inteiro.
   Fonte de tradução: data/i18n.json (dicionário de rótulos de interface).
   A prosa longa das páginas viaja embutida no HTML por data-pt/data-en,
   então o site funciona mesmo sem o JSON. O prefixo de profundidade das
   subpáginas vem de <body data-prefix="..."> (ex.: "../"). */
(function () {
  'use strict';

  var KEY = 'ko-lang';
  var lang = 'pt';
  var dicto = { pt: {}, en: {} };
  var domPronto = false, jsonPronto = false;

  try {
    var saved = localStorage.getItem(KEY);
    if (saved === 'en' || saved === 'pt') lang = saved;
    else if ((navigator.language || '').toLowerCase().indexOf('pt') !== 0) lang = 'en';
  } catch (e) { /* modo privado: segue no padrão */ }

  var PREFIX = (document.body.dataset.prefix || '');

  // data-<lang>-<sufixo> -> atributo real do elemento. Os sufixos precisam
  // estar todos no seletor abaixo, senão elementos que só declaram
  // data-pt-aria ficariam presos no texto inicial para sempre.
  var ATRIBUTOS = { aria: 'aria-label', ph: 'placeholder', title: 'title', alt: 'alt', content: 'content' };

  function aplicarMeta(mapa) {
    var title = document.querySelector('title[data-pt-content]');
    if (title && title.getAttribute('data-' + mapa + '-content')) document.title = title.getAttribute('data-' + mapa + '-content');
    var metas = document.querySelectorAll('meta[data-pt-content]');
    for (var i = 0; i < metas.length; i++) {
      var val = metas[i].getAttribute('data-' + mapa + '-content');
      if (val !== null) metas[i].setAttribute('content', val);
    }
  }

  function aplicar(l, inicial) {
    lang = l;
    var mapa = l === 'pt' ? 'pt' : 'en';

    document.documentElement.lang = l === 'pt' ? 'pt-BR' : 'en';
    window.KO_LANG = l;

    var els = document.querySelectorAll(
      '[data-pt], [data-en], [data-pt-aria], [data-en-aria], [data-pt-ph], [data-en-ph],' +
      ' [data-pt-title], [data-en-title], [data-pt-alt], [data-en-alt],' +
      ' [data-pt-content], [data-en-content], [data-pt-ld], [data-en-ld]'
    );
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var v = el.getAttribute('data-' + mapa);
      if (v !== null) {
        if (v.indexOf('<') !== -1) el.innerHTML = v; else el.textContent = v;
      }
      for (var k in ATRIBUTOS) {
        if (!Object.prototype.hasOwnProperty.call(ATRIBUTOS, k)) continue;
        var val = el.getAttribute('data-' + mapa + '-' + k);
        if (val !== null) el.setAttribute(ATRIBUTOS[k], val);
      }
      var ld = el.getAttribute('data-' + mapa + '-ld');
      if (ld !== null) el.textContent = ld;
    }

    var btn = document.getElementById('lang-toggle');
    if (btn) {
      btn.textContent = l === 'pt' ? 'EN' : 'PT';
      btn.setAttribute('aria-label', l === 'pt' ? 'Switch to English' : 'Switch to Portuguese');
    }
    aplicarMeta(mapa);

    if (!inicial) { try { localStorage.setItem(KEY, l); } catch (e) { /* ignora */ } }

    document.dispatchEvent(new CustomEvent('ko:lang', { detail: { lang: l, dicionario: dicto[mapa] || {} } }));
  }

  function alternar() { aplicar(lang === 'pt' ? 'en' : 'pt'); }

  function talvez() {
    if (domPronto && jsonPronto) aplicar(lang, true);
  }

  fetch(PREFIX + 'data/i18n.json', { cache: 'no-cache' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (j) { if (j) { dicto.pt = j.pt || {}; dicto.en = j.en || {}; } })
    .catch(function () { /* prosa embutida cobre a página */ })
    .finally(function () { jsonPronto = true; talvez(); });

  function quandoDom() {
    domPronto = true;
    var botao = document.getElementById('lang-toggle');
    if (botao) botao.addEventListener('click', alternar);
    talvez();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', quandoDom);
  else quandoDom();

  window.KO_i18n = { aplicar: aplicar, alternar: alternar, textos: function () { return { lang: lang, dicionario: dicto[lang === 'pt' ? 'pt' : 'en'] || {} }; } };
})();
