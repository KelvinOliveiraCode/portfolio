/* arquivo.js — grade completa de repositórios da página /projetos/.
   Dados: data/repos.json (folhas), data/areas.json (ramos),
   data/live-pages.json (marca “no ar”), data/destaques.json (marca “caso”),
   data/i18n.json (rótulos). Filtro por área (botões aria-pressed),
   busca por nome e ?area= vindas de outras páginas.
   Descrições bilíngues chegam como “PT | EN” e são divididas no separador. */
(function () {
  'use strict';

  var PREFIX = document.body.dataset.prefix || '';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function get(url) {
    return fetch(url).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
  }
  function formatoKb(kb) {
    kb = Number(kb) || 0;
    return kb >= 1024 ? (kb / 1024).toFixed(1) + ' MB' : kb + ' KB';
  }
  function parteBilingue(desc, lang) {
    var s = String(desc || '');
    var i = s.indexOf(' | ');
    if (i === -1) return s;
    return lang === 'en' ? s.slice(i + 3) : s.slice(0, i);
  }

  var REPOS = null, AREAS = null, LIVE = null, DESTAQUES = null, DICT = null;
  var FILTRO = '';
  var BUSCA = '';
  var PRONTOS = false;

  function dict() {
    var lang = window.KO_LANG === 'en' ? 'en' : 'pt';
    return (DICT && DICT[lang]) || null;
  }

  function areaDoRepo(nome) {
    return AREAS && Object.prototype.hasOwnProperty.call(AREAS, nome) ? AREAS[nome] : null;
  }
  function liveDoRepo(nome) {
    if (!LIVE || !LIVE.pages) return null;
    for (var i = 0; i < LIVE.pages.length; i++) {
      if (LIVE.pages[i].repo === nome) return LIVE.pages[i].url;
    }
    return null;
  }
  function casoDoRepo(nome) {
    if (!DESTAQUES) return false;
    return DESTAQUES.order.indexOf(nome) !== -1;
  }

  function listarFiltrados() {
    var lang = window.KO_LANG === 'en' ? 'en' : 'pt';
    var q = BUSCA.trim().toLowerCase();
    return REPOS.filter(function (r) {
      if (FILTRO) {
        var areas = areaDoRepo(r.name) || [];
        if (areas.indexOf(FILTRO) === -1) return false;
      }
      if (q && r.name.toLowerCase().indexOf(q) === -1) return false;
      return true;
    }).map(function (r) { return { repo: r, lang: lang }; });
  }

  function cardHtml(item) {
    var lang = item.lang;
    var d = dict();
    var r = item.repo;
    var nome = esc(r.name);
    var url = 'https://github.com/KelvinOliveiraCode/' + encodeURIComponent(r.name);
    var area = (areaDoRepo(r.name) || []).filter(Boolean);
    var live = liveDoRepo(r.name);
    var eCaso = casoDoRepo(r.name);
    var ano = (r.created || '').slice(0, 4);

    var chips = [];
    if (r.language) chips.push('<span class="chip">' + esc(r.language) + '</span>');
    if (area.length && d) {
      for (var ai = 0; ai < area.length; ai++) {
        chips.push('<a class="chip area" href="?area=' + encodeURIComponent(area[ai]) + '">'
          + esc(d.areasNomes[area[ai]] || area[ai]) + '</a>');
      }
    }
    if (ano) chips.push('<span class="chip">' + ano + '</span>');
    chips.push('<span class="chip">' + esc(formatoKb(r.sizeKb)) + '</span>');
    if (live && d) chips.push('<span class="chip no-ar">' + esc(d.projetos.noAr) + '</span>');
    if (eCaso && d) chips.push('<span class="chip case">' + esc(d.projetos.caso) + '</span>');

    var links = '<a class="lnk" href="' + url + '" target="_blank" rel="noopener">GitHub ↗</a>';
    if (eCaso) links += '<a class="lnk" href="' + encodeURIComponent(r.name) + '/" data-pt="caso de estudo" data-en="case study">caso de estudo</a>';
    if (live) links += '<a class="lnk" href="' + esc(live) + '" target="_blank" rel="noopener" data-pt="página no ar" data-en="live page">página no ar</a>';

    return '<article class="card-a" data-nome="' + nome + '" data-area="' + esc((area[0] || '')) + '" data-live="' + (live ? 1 : 0) + '">'
      + '<h3><a href="' + url + '" target="_blank" rel="noopener">' + nome + '</a></h3>'
      + '<p data-pt="' + esc(parteBilingue(r.description, 'pt')) + '" data-en="' + esc(parteBilingue(r.description, 'en')) + '">'
      + esc(parteBilingue(r.description, lang)) + '</p>'
      + '<div class="linha-chips">' + chips.join('') + '</div>'
      + '<div class="linha-links">' + links + '</div>'
      + '</article>';
  }

  function rotulosFiltros() {
    var d = dict();
    if (!d) return;
    var mapa = {
      '': 'filtroTodos', 'dados': 'areaDados', 'backend': 'areaBackend',
      'web': 'areaWeb', 'cyber': 'areaCyber', 'infra': 'areaInfra', 'ti': 'areaTi'
    };
    var botoes = document.querySelectorAll('.filtro[data-area]');
    for (var i = 0; i < botoes.length; i++) {
      var chave = mapa[botoes[i].dataset.area];
      if (chave && d.projetos[chave]) botoes[i].textContent = d.projetos[chave];
    }
    var busca = document.getElementById('busca');
    if (busca) busca.placeholder = d.projetos.buscar || busca.placeholder;
  }

  function render() {
    var d = dict();
    var grid = document.getElementById('arquivo-grid');
    var contagem = document.getElementById('contagem');
    if (!grid || !REPOS) return;
    rotulosFiltros();

    var itens = listarFiltrados();

    if (itens.length === 0) {
      grid.innerHTML = '<p class="arquivo-vazio">' + esc(d && d.projetos.vazio ? d.projetos.vazio : '') + '</p>';
    } else {
      // o texto já sai no idioma vigente; data-pt/data-en cobrem trocas futuras
      grid.innerHTML = itens.map(cardHtml).join('');
    }

    if (contagem && d) {
      contagem.textContent = itens.length + ' / ' + REPOS.length + ' ' + (d.projetos.estruturaContar || 'repositórios')
        + (FILTRO && d.areasNomes[FILTRO] ? ' · ' + d.areasNomes[FILTRO] : '');
    }
  }

  function ligarFiltros() {
    var botoes = document.querySelectorAll('.filtro[data-area]');
    for (var i = 0; i < botoes.length; i++) {
      botoes[i].addEventListener('click', (function (btn) {
        return function () {
          FILTRO = btn.dataset.area || '';
          for (var j = 0; j < botoes.length; j++) {
            botoes[j].setAttribute('aria-pressed', String(botoes[j] === btn));
          }
          render();
        };
      })(botoes[i]));
    }
    var busca = document.getElementById('busca');
    if (busca) {
      busca.addEventListener('input', function () {
        BUSCA = busca.value;
        render();
      });
    }
  }

  function preselecionarArea() {
    try {
      var p = new URLSearchParams(location.search);
      var area = p.get('area');
      if (!area) return;
      var valida = ['', 'dados', 'backend', 'web', 'cyber', 'infra', 'ti'];
      if (valida.indexOf(area) === -1) return;
      FILTRO = area;
      var botoes = document.querySelectorAll('.filtro[data-area]');
      for (var i = 0; i < botoes.length; i++) {
        botoes[i].setAttribute('aria-pressed', String((botoes[i].dataset.area || '') === area));
      }
    } catch (e) { /* sem query string: segue no padrão */ }
  }

  Promise.all([
    get(PREFIX + 'data/repos.json'),
    get(PREFIX + 'data/areas.json'),
    get(PREFIX + 'data/live-pages.json'),
    get(PREFIX + 'data/destaques.json'),
    get(PREFIX + 'data/i18n.json')
  ]).then(function (rs) {
    REPOS = rs[0]; AREAS = rs[1]; LIVE = rs[2]; DESTAQUES = rs[3]; DICT = rs[4];
    if (!REPOS || !Array.isArray(REPOS.repos)) return;
    REPOS = REPOS.repos;
    REPOS.sort(function (a, b) { return a.name.localeCompare(b.name); });
    preselecionarArea();
    ligarFiltros();
    PRONTOS = true;
    render();
  });

  document.addEventListener('ko:lang', function () {
    if (PRONTOS) render();
  });
})();
