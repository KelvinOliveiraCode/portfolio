/* Interações da página: revelação por scroll, contadores, progresso,
   seção ativa, vídeo de fundo, filtros do arquivo e voltar ao topo.
   Tudo respeita prefers-reduced-motion. */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------- revelação por scroll ----------------
     O IntersectionObserver é o acelerador, não a garantia: se ele não disparar
     (aba oculta, observer perdido, navegador antigo), a varredura por scroll
     acende o que está na tela. Nenhuma seção fica invisível para sempre. */
  var ALVOS = '.sec-head, .vcard, .acard, .area-card, .cert, .stack-cell, .formacao, .about-copy > p, .facts .fact, .mais .inner, .arquivo-bar';
  var pendentes = [];
  var regras = [];
  var io = null;

  function acender(el) {
    if (el.classList.contains('in')) return;
    el.classList.add('in');
    setTimeout(function () { el.style.transitionDelay = '0s'; }, 1500);
  }

  function revelar() {
    var alvos = $$(ALVOS);
    regras = $$('.rule');

    if (reduce || !('IntersectionObserver' in window)) {
      alvos.forEach(function (el) { el.classList.add('rv', 'in'); });
      regras.forEach(function (r) { r.classList.add('in'); });
      return;
    }

    alvos.forEach(function (el, i) {
      el.classList.add('rv');
      el.style.transitionDelay = (i % 4) * 0.11 + 's';
      pendentes.push(el);
    });

    io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        acender(e.target);
        io.unobserve(e.target);
        var k = pendentes.indexOf(e.target);
        if (k > -1) pendentes.splice(k, 1);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

    alvos.forEach(function (el) { io.observe(el); });

    var ioRegras = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        ioRegras.unobserve(e.target);
      });
    }, { threshold: 0.6 });

    regras.forEach(function (r) { ioRegras.observe(r); });
  }

  /* ---------------- varredura: a rede de segurança ---------------- */
  function varrer() {
    if (reduce) return;
    var h = window.innerHeight;

    for (var i = pendentes.length - 1; i >= 0; i--) {
      var el = pendentes[i];
      if (el.getBoundingClientRect().top < h * 0.94) {
        acender(el);
        if (io) io.unobserve(el);
        pendentes.splice(i, 1);
      }
    }

    for (var j = 0; j < regras.length; j++) {
      var g = regras[j];
      if (!g.classList.contains('in') && g.getBoundingClientRect().top < h * 0.94) g.classList.add('in');
    }

    for (var k = filaContadores.length - 1; k >= 0; k--) {
      var n = filaContadores[k];
      var b = n.getBoundingClientRect();
      if (b.top < h * 0.9 && b.bottom > -40) {
        animaContador(n);
        filaContadores.splice(k, 1);
      }
    }
  }

  /* ---------------- contadores ---------------- */
  var filaContadores = [];

  function animaContador(el) {
    if (el.dataset.animou === '1') return;
    el.dataset.animou = '1';

    var fim = parseFloat(el.getAttribute('data-count')) || 0;
    var sufixo = el.getAttribute('data-suffix') || '';

    if (reduce) { el.textContent = fim + sufixo; return; }

    var dur = 1300;
    var t0 = null;
    var finalizado = false;

    function finaliza() {
      if (finalizado) return;
      finalizado = true;
      el.textContent = fim + sufixo;
    }

    function passo(ts) {
      if (finalizado) return;
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3); // ease-out cubic
      if (p >= 1) { finaliza(); return; }
      el.textContent = Math.round(fim * e) + sufixo;
      requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
    // se o rAF estiver suspenso, o número final chega de qualquer forma
    setTimeout(finaliza, dur + 200);
  }

  function contadores() {
    filaContadores = $$('[data-count]');
    if (!filaContadores.length) return;

    if (reduce) {
      filaContadores.forEach(function (n) {
        n.textContent = (n.getAttribute('data-count') || '') + (n.getAttribute('data-suffix') || '');
        n.dataset.animou = '1';
      });
      filaContadores = [];
      return;
    }

    // O texto do HTML não é zerado: se nada disparar, o número real continua
    // na tela. A animação é um enfeite, não a fonte do dado.
    if (!('IntersectionObserver' in window)) return;

    var ioN = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        animaContador(e.target);
        ioN.unobserve(e.target);
        var k = filaContadores.indexOf(e.target);
        if (k > -1) filaContadores.splice(k, 1);
      });
    }, { threshold: 0.4 });

    filaContadores.forEach(function (n) { ioN.observe(n); });
  }

  /* ---------------- barra de progresso + voltar ao topo ----------------
     throttle por tempo, não por requestAnimationFrame: rAF é suspenso em aba
     de fundo e em alguns contextos embutidos, e aí a barra, a seção ativa e
     a revelação congelariam. O timer roda sempre. */
  function rolagem() {
    var barra = $('#progress');
    var topo = $('#topo');
    var ultimo = 0;
    var agendado = false;

    function atualiza() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      var alt = document.documentElement.scrollHeight - window.innerHeight;
      if (barra) barra.style.transform = 'scaleX(' + (alt > 0 ? Math.min(y / alt, 1) : 0) + ')';
      if (topo) topo.classList.toggle('mostra', y > window.innerHeight * 0.9);
      marcarAtivo(y);
      varrer();
    }

    window.addEventListener('scroll', function () {
      var agora = Date.now();
      if (agora - ultimo >= 60) { ultimo = agora; atualiza(); return; }
      if (agendado) return;
      agendado = true;
      setTimeout(function () { agendado = false; ultimo = Date.now(); atualiza(); }, 60);
    }, { passive: true });

    window.addEventListener('resize', atualiza, { passive: true });

    if (topo) {
      topo.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      });
    }

    atualiza();
  }

  /* ---------------- seção ativa na navegação ---------------- */
  var secoes = [];
  function marcarAtivo(y) {
    if (!secoes.length) return;
    // posição relativa ao documento: offsetTop seria relativo ao <main>,
    // que é o offsetParent por ter position: relative
    var limite = y + (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 66) + 120;
    var atual = null;
    for (var i = 0; i < secoes.length; i++) {
      if (secoes[i].el.getBoundingClientRect().top + y <= limite) atual = secoes[i];
    }
    secoes.forEach(function (s) {
      if (s.link) s.link.setAttribute('aria-current', s === atual ? 'true' : 'false');
    });
  }

  function navAtiva() {
    $$('.nav-links a').forEach(function (a) {
      var id = (a.getAttribute('href') || '').replace('#', '');
      var el = id ? document.getElementById(id) : null;
      if (el) secoes.push({ el: el, link: a });
    });
  }

  /* ---------------- vídeo de fundo: só carrega quando vale a pena ---------------- */
  function video() {
    var v = $('#plate-video');
    if (!v) return;

    var conexao = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    var economiza = conexao && (conexao.saveData || /2g/.test(conexao.effectiveType || ''));

    if (reduce || economiza) { v.remove(); return; } // o poster em CSS continua no lugar

    var webm = v.getAttribute('data-webm');
    var mp4 = v.getAttribute('data-mp4');

    function inicia() {
      if (v.dataset.pronto === '1') return;
      v.dataset.pronto = '1';
      if (webm) { var s1 = document.createElement('source'); s1.src = webm; s1.type = 'video/webm'; v.appendChild(s1); }
      if (mp4) { var s2 = document.createElement('source'); s2.src = mp4; s2.type = 'video/mp4'; v.appendChild(s2); }
      v.load();
      var p = v.play();
      if (p && p.catch) p.catch(function () { /* autoplay bloqueado: o poster fica */ });
    }

    // carrega depois do primeiro pintar, sem competir com o conteúdo
    if ('requestIdleCallback' in window) requestIdleCallback(inicia, { timeout: 2600 });
    else setTimeout(inicia, 1400);

    document.addEventListener('visibilitychange', function () {
      if (v.dataset.pronto !== '1') return;
      if (document.hidden) v.pause();
      else { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    });
  }

  /* ---------------- vitrine: destaques em lotes ----------------
     Os 24 destaques de uma vez deixavam a pagina longa; o primeiro lote
     cabe na tela e o resto chega no clique. */
  function vitrine() {
    var grade = $('#vitrine');
    var botao = $('#vitrine-mais');
    var nota = $('#vitrine-conta');
    if (!grade || !botao) return;

    var cartoes = $$('.vcard', grade);
    var INICIAL = 6;
    var PASSO = 6;
    var limite = INICIAL;

    function aplica() {
      var n = 0;
      cartoes.forEach(function (c, i) {
        var mostra = i < limite;
        c.hidden = !mostra;
        if (mostra) n++;
      });

      botao.hidden = n >= cartoes.length;

      if (nota) {
        // mantem a contagem mesmo quando todos apareceram: e a unica pista de
        // que a lista terminou depois que o botao some
        var t = window.KO_i18n ? window.KO_i18n.textos() : { exibindo: 'exibindo', de: 'de', destaques: 'destaques' };
        nota.innerHTML = t.exibindo + ' <b>' + n + '</b> ' + t.de + ' <b>' + cartoes.length + '</b> ' + t.destaques;
      }
    }

    botao.addEventListener('click', function () {
      limite += PASSO;
      aplica();
      varrer();
    });

    document.addEventListener('ko:lang', aplica);
    aplica();
  }

  /* ---------------- arquivo: filtros, busca, contagem e lotes ---------------- */
  function arquivo() {
    var grade = $('#arquivo');
    var contagem = $('#contagem');
    var campo = $('#busca-proj');
    var botoes = $$('#filtros button');
    if (!grade) return;

    var cards = $$('.acard', grade);
    var total = cards.length;
    var botaoMais = $('#arquivo-mais');
    var INICIAL = 12;   // o arquivo abre em um lote que cabe na tela
    var PASSO = 12;
    var filtro = 'todos';
    var termo = '';
    var limite = INICIAL;
    var vazio = null;

    function normaliza(s) {
      return (s || '').toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .trim();
    }

    function aplica() {
      var casaram = [];

      cards.forEach(function (c) {
        var areas = (c.getAttribute('data-area') || '').split(',');
        var vivo = c.getAttribute('data-live') === '1';
        var nome = c.getAttribute('data-nome') || '';

        var okArea = filtro === 'todos'
          || (filtro === 'vivos' ? vivo : areas.indexOf(filtro) !== -1);
        var okTermo = !termo || nome.indexOf(termo) !== -1
          || normaliza(c.textContent).indexOf(termo) !== -1;

        if (okArea && okTermo) casaram.push(c);
      });

      var mostrados = Math.min(limite, casaram.length);

      cards.forEach(function (c) {
        var pos = casaram.indexOf(c);
        c.hidden = pos === -1 || pos >= mostrados;
      });

      if (botaoMais) botaoMais.hidden = mostrados >= casaram.length;

      if (contagem && window.KO_i18n) {
        var t = window.KO_i18n.textos();
        contagem.innerHTML = (casaram.length === total && mostrados === total)
          ? '<b>' + total + '</b> ' + t.projetos
          : t.exibindo + ' <b>' + mostrados + '</b> ' + t.de + ' <b>' + casaram.length + '</b> ' + t.projetos;
      }

      if (casaram.length === 0) {
        if (!vazio) {
          var t2 = window.KO_i18n ? window.KO_i18n.textos() : { vazioTitulo: '', vazioDica: '' };
          vazio = document.createElement('div');
          vazio.className = 'vazio';
          vazio.innerHTML = t2.vazioTitulo + '<br><span style="font-size:.85em">' + t2.vazioDica + '</span>';
          grade.appendChild(vazio);
        }
        vazio.hidden = false;
      } else if (vazio) {
        vazio.hidden = true;
      }
    }

    // trocar de filtro ou de busca sempre volta ao primeiro lote
    function comeca() {
      limite = INICIAL;
      aplica();
      varrer();
    }

    botoes.forEach(function (b) {
      b.addEventListener('click', function () {
        filtro = b.getAttribute('data-filtro');
        botoes.forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
        comeca();
      });
    });

    if (campo) {
      var t = null;
      campo.addEventListener('input', function () {
        clearTimeout(t);
        t = setTimeout(function () { termo = normaliza(campo.value); comeca(); }, 140);
      });
    }

    if (botaoMais) {
      botaoMais.addEventListener('click', function () {
        limite += PASSO;
        aplica();
        varrer();
      });
    }

    document.addEventListener('ko:lang', function () {
      if (vazio) { grade.removeChild(vazio); vazio = null; }
      aplica();
    });

    aplica();
  }

  /* ---------------- início ---------------- */
  var iniciado = false;
  function inicio() {
    if (iniciado) return;
    iniciado = true;
    revelar();
    contadores();
    navAtiva();
    rolagem();
    marcarAtivo(window.pageYOffset || 0);
    varrer();
    video();
    vitrine();
    arquivo();
  }

  document.addEventListener('DOMContentLoaded', inicio);
  if (document.readyState !== 'loading') inicio();
})();
