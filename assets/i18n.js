/* PT/EN — troca o texto de todo elemento que declara data-pt / data-en.
   A escolha fica no localStorage; o HTML já nasce em português. */
(function () {
  'use strict';

  var KEY = 'ko-lang';
  var lang = 'pt';

  try {
    var saved = localStorage.getItem(KEY);
    if (saved === 'en' || saved === 'pt') lang = saved;
    else if ((navigator.language || '').toLowerCase().indexOf('pt') !== 0) lang = 'en';
  } catch (e) { /* modo privado: segue no padrão */ }

  var TEXTOS = {
    pt: {
      projetos: 'projetos',
      exibindo: 'exibindo',
      de: 'de',
      destaques: 'destaques',
      noAr: 'no ar',
      vazioTitulo: 'Nenhum projeto encontrado com esse filtro.',
      vazioDica: 'Tente outra palavra ou volte para <b>Todos</b>.',
      verRepo: 'código',
      verSite: 'abrir site',
      areaLabel: 'Filtrar projetos'
    },
    en: {
      projetos: 'projects',
      exibindo: 'Showing',
      de: 'of',
      destaques: 'highlights',
      noAr: 'live',
      vazioTitulo: 'No project matches this filter.',
      vazioDica: 'Try another word or go back to <b>All</b>.',
      verRepo: 'code',
      verSite: 'open site',
      areaLabel: 'Filter projects'
    }
  };

  // data-<lang>-<sufixo> -> atributo real do elemento.
  // O seletor abaixo precisa cobrir TODOS esses sufixos: um elemento que so
  // declara data-pt-aria (sem data-pt) nao casa com [data-pt] e ficaria
  // com o texto em portugues para sempre.
  var ATRIBUTOS = {
    aria: 'aria-label',
    ph: 'placeholder',
    title: 'title',
    alt: 'alt',
    content: 'content'
  };

  // ---------- metadados (title, description, og, twitter) ----------
  // As tags de metadados nao aceitam data-pt/data-en, entao cada uma carrega
  // o par completo em atributos proprios: data-pt-content / data-en-content.
  function aplicarMeta(mapa) {
    var title = document.querySelector('title[data-pt-content]');
    if (title) {
      var t = title.getAttribute('data-' + mapa + '-content');
      if (t !== null) document.title = t;
    }

    var metas = document.querySelectorAll('meta[data-pt-content]');
    for (var i = 0; i < metas.length; i++) {
      var m = metas[i];
      var val = m.getAttribute('data-' + mapa + '-content');
      if (val !== null) m.setAttribute('content', val);
    }
  }

  function aplicar(l) {
    var mapa = l === 'pt' ? 'pt' : 'en';

    document.documentElement.lang = l === 'pt' ? 'pt-BR' : 'en';
    window.KO_LANG = l;

    var els = document.querySelectorAll(
      '[data-pt], [data-en], ' +
      '[data-pt-aria], [data-en-aria], [data-pt-ph], [data-en-ph], ' +
      '[data-pt-title], [data-en-title], [data-pt-alt], [data-en-alt], ' +
      '[data-pt-content], [data-en-content], ' +
      '[data-pt-ld], [data-en-ld]'
    );
    for (var i = 0; i < els.length; i++) {
      var el = els[i];

      var v = el.getAttribute('data-' + mapa);
      if (v !== null) {
        if (v.indexOf('<') !== -1) el.innerHTML = v;
        else el.textContent = v;
      }

      for (var k in ATRIBUTOS) {
        if (!Object.prototype.hasOwnProperty.call(ATRIBUTOS, k)) continue;
        var val = el.getAttribute('data-' + mapa + '-' + k);
        if (val !== null) el.setAttribute(ATRIBUTOS[k], val);
      }

      // JSON-LD: duas versoes completas do objeto, trocadas no lugar
      var ld = el.getAttribute('data-' + mapa + '-ld');
      if (ld !== null) el.textContent = ld;
    }

    var btn = document.getElementById('lang-toggle');
    if (btn) {
      btn.textContent = l === 'pt' ? 'EN' : 'PT';
      btn.setAttribute('aria-label', l === 'pt' ? 'Switch to English' : 'Switch to Portuguese');
      btn.setAttribute('title', l === 'pt' ? 'Switch to English' : 'Switch to Portuguese');
    }

    aplicarMeta(mapa);

    var fg = document.getElementById('filtros');
    if (fg) fg.setAttribute('aria-label', TEXTOS[mapa].areaLabel);

    try { localStorage.setItem(KEY, l); } catch (e) { /* ignora */ }

    document.dispatchEvent(new CustomEvent('ko:lang', { detail: { lang: l, textos: TEXTOS[mapa] } }));
  }

  function alternar() {
    lang = lang === 'pt' ? 'en' : 'pt';
    aplicar(lang);
  }

  function textos() { return TEXTOS[lang === 'pt' ? 'pt' : 'en']; }

  window.KO_i18n = { aplicar: aplicar, alternar: alternar, textos: textos };

  // espera o DOM para o primeiro passe (a página já vem em PT no HTML)
  document.addEventListener('DOMContentLoaded', function () {
    aplicar(lang);
    var btn = document.getElementById('lang-toggle');
    if (btn) btn.addEventListener('click', alternar);
  });

  // evita o "flash" de PT quando o idioma salvo é EN
  if (document.readyState === 'loading') {
    document.addEventListener('readystatechange', function once() {
      if (document.readyState !== 'loading') {
        document.removeEventListener('readystatechange', once);
        if (lang === 'en') aplicar('en');
      }
    });
  }
})();
