/* tree.js — explorador do portfólio em árvore interativa (padrão WAI-ARIA Tree View).
   Raiz: GitHub de Kelvin · ramos: áreas · folhas: repositórios públicos.
   Dados: data/repos.json (folhas, tamanhos), data/areas.json (ramos),
   data/live-pages.json (marca “no ar”), data/i18n.json (rótulos).
   O painel ao lado mostra o que faz, stack, tamanho e link.
   Teclado: ← recolhe/parente · → expande/filho · ↑↓ navega · Home/End · Enter aciona.
   Repositório sem área não entra na árvore — fica no relatório, sem adivinhação. */
(function () {
  'use strict';

  var PREFIX = document.body.dataset.prefix || '';
  var CASE_ATUAL = document.body.dataset.case || null;
  var ORDEM = ['dados', 'backend', 'web', 'cyber', 'infra', 'ti'];

  var REPOS = null, AREAS = null, LIVE = null, DICT = null;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function get(url) {
    return fetch(url).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
  }
  function estaNoAr(nome) {
    return !!(LIVE && LIVE.pages && LIVE.pages.some(function (p) { return p.repo === nome; }));
  }
  function formatKb(kb) { return kb >= 1024 ? (kb / 1024).toFixed(1) + ' MB' : kb + ' KB'; }

  /* ---------- construção ---------- */

  function itemNivel(li, nivel) {
    li.setAttribute('role', 'treeitem');
    li.tabIndex = -1;
    li.dataset.nivel = String(nivel);
    return li;
  }

  function setaSvg() {
    return '<svg class="setinha" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><path d="M9 5l7 7-7 7"/></svg>';
  }

  function construir() {
    var container = document.getElementById('arvore');
    if (!container) return;

    var porArea = {};
    ORDEM.forEach(function (a) { porArea[a] = []; });
    (REPOS.repos || []).forEach(function (r) {
      (AREAS[r.name] || []).forEach(function (a) {
        if (porArea[a]) porArea[a].push(r);
      });
    });
    ORDEM.forEach(function (a) { porArea[a].sort(function (x, y) { return x.name.localeCompare(y.name); }); });

    var liRaiz = itemNivel(document.createElement('li'), 1);
    liRaiz.innerHTML =
      '<button type="button" class="nodo" data-contexto=\'{"tipo":"raiz"}\'>' + setaSvg() +
        '<span class="marca-nodo">' + esc(DICT.arvore.raizNome) + '</span>' +
        '<span class="tamanho">' + REPOS.total + ' ' + esc(DICT.arvore.repositorios) + '</span>' +
      '</button><ul role="group"></ul>';

    var grupoRaiz = liRaiz.querySelector('[role="group"]');
    ORDEM.forEach(function (area) {
      var itens = porArea[area];
      if (!itens.length) return;
      var liArea = itemNivel(document.createElement('li'), 2);
      liArea.innerHTML =
        '<button type="button" class="nodo" data-contexto=\'{"tipo":"area","area":' + JSON.stringify(area) + '}\'>' + setaSvg() +
          '<span class="marca-nodo">' + esc(DICT.areasNomes[area] || area) + '</span>' +
          '<span class="tamanho">' + itens.length + ' ' + esc(DICT.arvore.repositorios) + '</span>' +
        '</button><ul role="group"></ul>';
      var grupoArea = liArea.querySelector('[role="group"]');
      itens.forEach(function (repo) {
        var liFolha = itemNivel(document.createElement('li'), 3);
        liFolha.dataset.repo = repo.name;
        liFolha.innerHTML =
          '<button type="button" class="nodo" data-contexto=\'{"tipo":"repo","name":' + esc(JSON.stringify(repo.name)) + '}\'>' +
            '<span class="marca-nodo">' + esc(repo.name) + '</span>' +
            (repo.language ? '<span class="versus">— ' + esc(repo.language) + '</span>' : '') +
            (repo.sizeKb ? '<span class="versus">· ' + formatKb(repo.sizeKb) + '</span>' : '') +
            (estaNoAr(repo.name) ? '<span class="no-ar">' + esc(DICT.strip.noAr) + '</span>' : '') +
          '</button>';
        if (repo.name === CASE_ATUAL) liFolha.setAttribute('aria-selected', 'true');
        grupoArea.appendChild(liFolha);
      });
      grupoRaiz.appendChild(liArea);
    });

    container.textContent = '';
    container.appendChild(liRaiz);
    container.setAttribute('role', 'tree');
    container.setAttribute('aria-label', DICT.arvore.etiqueta);
    liRaiz.tabIndex = 0; // único item focável na partida

    container.addEventListener('click', function (ev) {
      var botao = ev.target.closest('button.nodo');
      if (!botao) return;
      var li = botao.closest('li');
      if (li.dataset.nivel === '3') { selecionar(li); }
      else { alternar(li); pintarPainel(li); }
    });
    container.addEventListener('keydown', teclado);
  }

  /* --------- expandir/recolher --------- */

  function expandir(li, abrir) {
    var botao = li.querySelector('button.nodo');
    var grp = li.querySelector('[role="group"]');
    if (!grp) return;
    var aberto = grp.hidden === false;
    if (abrir === undefined) abrir = !aberto;
    if (abrir) { grp.hidden = false; botao.setAttribute('aria-expanded', 'true'); }
    else { grp.hidden = true; botao.setAttribute('aria-expanded', 'false'); }
  }

  function alternar(li) { expandir(li); }

  function visiveis() {
    return [].filter.call(document.querySelectorAll('#arvore li[role="treeitem"]'), function (i) {
      return !estaEscondido(i);
    });
  }
  function estaEscondido(li) {
    var p = li.parentElement;
    while (p && p !== document.body) {
      if (p.hidden) return true;
      p = p.parentElement;
    }
    return false;
  }

  /* ---------- seleção + painel ---------- */

  function selecionar(li) {
    [].forEach.call(document.querySelectorAll('#arvore li[aria-selected]'), function (i) { i.removeAttribute('aria-selected'); });
    li.setAttribute('aria-selected', 'true');
    focar(li);
    pintarPainel(li);
  }

  function focar(li) {
    [].forEach.call(document.querySelectorAll('#arvore li'), function (i) { if (i.dataset.nivel) i.tabIndex = -1; });
    li.tabIndex = 0;
    li.focus();
  }

  function pintarPainel(li) {
    var painel = document.getElementById('arvore-painel');
    if (!painel) return;
    var botao = li.querySelector('button.nodo');
    var cliques;
    try { cliques = JSON.parse(botao.getAttribute('data-contexto')); } catch (e) { return; }
    if (!cliques) return;

    var titulo, tamanho, desc, pilha = [], links = [];
    if (cliques.tipo === 'raiz') {
      titulo = DICT.arvore.raizNome;
      tamanho = REPOS.total + ' ' + DICT.arvore.repositorios;
      desc = DICT.arvore.raizDesc;
      links.push({ href: 'https://github.com/KelvinOliveiraCode', texto: DICT.arvore.abrirNoGithub });
    } else if (cliques.tipo === 'area') {
      var area = cliques.area;
      var liArea = li.querySelector('[role="group"]');
      var contagem = liArea ? liArea.querySelectorAll('li[data-nivel="3"]').length : (porAreaContagem(area));
      titulo = DICT.areasNomes[area] || area;
      tamanho = contagem + ' ' + DICT.arvore.repositorios;
      desc = DICT.arvore.areas[area] || '';
      links.push({ href: PREFIX + 'projetos/?area=' + area, texto: titulo + ' ↗' });
    } else {
      var nome = cliques.name;
      var repo = (REPOS.repos || []).filter(function (r) { return r.name === nome; })[0] || { name: nome };
      titulo = repo.name;
      tamanho = repo.sizeKb ? formatKb(repo.sizeKb) : '';
      desc = repo.description || DICT.arvore.semDescricao;
      pilha = [repo.language].filter(Boolean).concat((AREAS[nome] || []).map(function (a) { return DICT.areasNomes[a] || a; }));
      links.push({ href: 'https://github.com/KelvinOliveiraCode/' + repo.name, texto: DICT.arvore.abrirNoGithub });
      if (estaNoAr(repo.name)) links.push({ href: 'https://kelvinoliveiracode.github.io/' + repo.name + '/', texto: DICT.arvore.paginaNoAr });
    }

    painel.querySelector('.t').textContent = titulo;
    painel.querySelector('.tamanho-fila').textContent = tamanho;
    painel.querySelector('.o-que-faz p').textContent = desc;
    painel.querySelector('.pilha').innerHTML = pilha.map(function (p) { return '<span>' + esc(p) + '</span>'; }).join('');
    painel.querySelector('.pilha').hidden = !pilha.length;
    painel.querySelector('.links').innerHTML = links.map(function (l) {
      return '<a href="' + esc(l.href) + '">' + esc(l.texto) + '</a>';
    }).join('');
    painel.hidden = false;
  }

  function porAreaContagem(area) {
    var n = 0;
    (REPOS.repos || []).forEach(function (r) {
      if ((AREAS[r.name] || []).indexOf(area) !== -1) n++;
    });
    return n;
  }

  /* ---------- teclado padrão de Tree View ---------- */

  function teclado(ev) {
    var li = document.activeElement && document.activeElement.closest ? document.activeElement.closest('li[role="treeitem"]') : null;
    if (!li || !li.closest('#arvore')) {
      li = document.querySelector('#arvore li[tabindex="0"]');
      if (!li) return;
    }
    var k = ev.key;
    var tab = visiveis();
    var idx = tab.indexOf(li);

    if (k === 'ArrowDown' || k === 'ArrowUp') {
      ev.preventDefault();
      var alvo = tab[clamp(idx + (k === 'ArrowDown' ? 1 : -1), 0, tab.length - 1)];
      if (alvo) { focar(alvo); pintarPainel(alvo); }
      return;
    }
    if (k === 'ArrowRight') {
      ev.preventDefault();
      var grp = li.querySelector('[role="group"]');
      if (grp && grp.hidden) { expandir(li, true); }
      else if (grp) {
        var primeiro = grp.querySelector('li[role="treeitem"]');
        if (primeiro) { focar(primeiro); pintarPainel(primeiro); }
      }
      return;
    }
    if (k === 'ArrowLeft') {
      ev.preventDefault();
      var grpL = li.querySelector('[role="group"]');
      var aberto = grpL && !grpL.hidden;
      if (aberto) { expandir(li, false); }
      else {
        var pai = li.parentElement ? li.parentElement.closest('li[role="treeitem"]') : null;
        if (pai) { focar(pai); pintarPainel(pai); }
      }
      return;
    }
    if (k === 'Home') { ev.preventDefault(); if (tab[0]) { focar(tab[0]); pintarPainel(tab[0]); } return; }
    if (k === 'End') { ev.preventDefault(); if (tab[tab.length - 1]) { focar(tab[tab.length - 1]); pintarPainel(tab[tab.length - 1]); } return; }
    if (k === 'Enter' || k === ' ') {
      ev.preventDefault();
      if (li.dataset.nivel === '3') selecionar(li);
      else { alternar(li); pintarPainel(li); }
      return;
    }
  }

  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  /* ---------- arranque + reação ao idioma ---------- */

  function dictoVigente() {
    return window.KO_i18n && window.KO_i18n.textos().dicionario && window.KO_i18n.textos().dicionario.arvore
      ? window.KO_i18n.textos().dicionario : null;
  }

  function vezDoDicionario(ev) {
    var d = (ev && ev.detail && ev.detail.dicionario) || dictoVigente();
    if (d && d.arvore) { DICT = d; return true; }
    return false;
  }

  Promise.all([
    get(PREFIX + 'data/repos.json'),
    get(PREFIX + 'data/areas.json'),
    get(PREFIX + 'data/live-pages.json')
  ]).then(function (rs) {
    REPOS = rs[0]; AREAS = rs[1]; LIVE = rs[2];
    if (!REPOS || !AREAS) return;              // sem dados: página funciona sem a árvore
    var d = dictoVigente();
    if (d) { DICT = d; construir(); }
    // se o dicionário ainda não chegou (fetch lento), fica montado quando ko:lang disparar
  });

  document.addEventListener('ko:lang', function (ev) {
    if (!REPOS || !AREAS) return;
    var container = document.getElementById('arvore');
    if (!container) return;
    // guarda o item mostrado no painel para restaurar
    var atual = container.querySelector('li[data-repo][aria-selected="true"], li[tabindex="0"][data-repo]') ||
                container.querySelector('li[aria-selected="true"]');
    var atualRepo = atual ? atual.dataset.repo : null;
    if (vezDoDicionario(ev)) {
      construir();
      if (atualRepo) {
        var alvo = container.querySelector('li[data-repo="' + CSS.escape(atualRepo) + '"]');
        if (alvo) {
          var raiz = alvo;
          while (raiz && raiz.parentElement) {
            var paiLi = raiz.parentElement.closest('li[role="treeitem"]');
            if (paiLi) expandir(paiLi, true);
            raiz = paiLi;
          }
          focar(alvo); pintarPainel(alvo);
        }
      } else {
        var raizLi = container.querySelector('li[role="treeitem"]');
        if (raizLi) { raizLi.tabIndex = 0; pintarPainel(raizLi); }
      }
    }
  });
})();
