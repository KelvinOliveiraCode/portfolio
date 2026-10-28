/* strip.js — faixa superior de troca rápida entre os destaques.
   Cada item: “Área: Nome” → /projetos/<slug>/. Vem de data/destaques.json
   (ordem curada) + data/areas.json. Página de caso marca aria-current.    */
(function () {
  'use strict';

  var PREFIX = document.body.dataset.prefix || '';
  var CASE_ATUAL = document.body.dataset.case || null;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  Promise.all([
    fetch(PREFIX + 'data/destaques.json').then(function (r) { return r.ok ? r.json() : null; }),
    fetch(PREFIX + 'data/areas.json').then(function (r) { return r.ok ? r.json() : null; }),
    fetch(PREFIX + 'data/i18n.json').then(function (r) { return r.ok ? r.json() : null; })
  ]).then(function (rs) {
    var destaques = rs[0], areas = rs[1], dict = rs[2];
    var faixa = document.getElementById('faixa-destaques');
    if (!faixa || !destaques) return;
    var nomes = dict && dict[window.KO_LANG === 'en' ? 'en' : 'pt'] ? dict[(window.KO_LANG === 'en' ? 'en' : 'pt')].areasNomes : {};

    function desenha(nomesAtuais) {
      nomes = nomesAtuais || nomes;
      var html = destaques.order.map(function (slug) {
        var t = destaques.textos[slug];
        if (!t) return '';
        var area = (areas[slug] || t.area || [''])[0] || '';
        var nomeArea = (nomes && nomes[area]) || area;
        var rotulo = (t.titulo && (t.titulo[window.KO_LANG === 'en' ? 'en' : 'pt'])) || slug;
        var atual = slug === CASE_ATUAL ? ' aria-current="page"' : '';
        return '<a class="pair"' + atual + ' href="' + PREFIX + 'projetos/' + slug + '/">' +
          '<small>' + esc(nomeArea) + ':</small> <span>' + esc(rotulo) + '</span></a>';
      }).filter(Boolean).join('');
      faixa.innerHTML = html;
    }

    desenha(nomes);
    document.addEventListener('ko:lang', function (ev) {
      var d = ev.detail && ev.detail.dicionario ? ev.detail.dicionario : null;
      desenha(d ? d.areasNomes : dict && dict.en.areasNomes);
    });
  });
})();
