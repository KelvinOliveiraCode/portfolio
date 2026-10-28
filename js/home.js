/* home.js — grade de números da home.
   Fontes reais: data/repos.json (total de repositórios) e
   data/live-pages.json (páginas no ar, verificadas por HTTP 200).
   Bootcamps (4) e horas (169): estáticos,  
   vêm do index aprovado e nunca mudam aqui.
   No HTML já há valores de fallback (snapshot de 25/10/2026) — o JS só
   atualiza se os dados carregarem. */
(function () {
  'use strict';

  var PREFIX = document.body.dataset.prefix || '';

  function get(url) {
    return fetch(url).then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
  }

  function seta(id, valor) {
    var el = document.getElementById(id);
    if (!el || valor == null) return;
    el.textContent = String(valor);
  }

  Promise.all([
    get(PREFIX + 'data/repos.json'),
    get(PREFIX + 'data/live-pages.json')
  ]).then(function (rs) {
    var repos = rs[0], live = rs[1];

    var total = repos && repos.total != null
      ? repos.total
      : (repos && repos.repos ? repos.repos.length : null);
    seta('num-repos', total);

    seta('num-noar', live && live.pages ? live.pages.length : null);
  });
})();
