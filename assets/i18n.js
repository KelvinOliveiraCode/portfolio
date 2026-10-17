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

  function aplicar(l) {
    var mapa = l === 'pt' ? 'pt' : 'en';

    document.documentElement.lang = l === 'pt' ? 'pt-BR' : 'en';
    window.KO_LANG = l;

    var els = document.querySelectorAll('[data-pt], [data-en]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];

      var v = el.getAttribute('data-' + mapa);
      if (v !== null) {
        if (v.indexOf('<') !== -1) el.innerHTML = v;
        else el.textContent = v;
      }

      var a = el.getAttribute('data-' + mapa + '-aria');
      if (a !== null) el.setAttribute('aria-label', a);

      var p = el.getAttribute('data-' + mapa + '-ph');
      if (p !== null) el.setAttribute('placeholder', p);
    }

    var btn = document.getElementById('lang-toggle');
    if (btn) {
      btn.textContent = l === 'pt' ? 'EN' : 'PT';
      btn.setAttribute('aria-label', l === 'pt' ? 'Switch to English' : 'Mudar para português');
      btn.setAttribute('title', l === 'pt' ? 'Switch to English' : 'Mudar para português');
    }

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
