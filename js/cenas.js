/* cenas.js · cenas pontilhadas das seções da home.
   Um único canvas 2D por cena, um único requestAnimationFrame para
   todas: só desenha a cena que está na viewport, a 30fps, e para
   quando a aba fica oculta. prefers-reduced-motion desenha um quadro
   estático. Mesma paleta do planeta (branco #f4f4f4 sobre preto),
   pontos de 1–2px com opacidade por profundidade.

   Nenhuma cena tem texto, link ou foco: todas são aria-hidden e
   pointer-events: none. A interação com a lista de agentes é feita
   nos próprios itens acessíveis, não no canvas. */
(function () {
  'use strict';

  var reduzido = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var CLARO = '#f4f4f4';
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var cenas = [];
  var ultimo = 0;
  var parado = false;
  var relogio = 0;

  /* ---------- infraestrutura comum ---------- */

  function ponto(ctx, x, y, r, alfa) {
    ctx.globalAlpha = alfa;
    ctx.fillStyle = CLARO;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 6.2832);
    ctx.fill();
  }

  function criar(el, desenhar) {
    if (!el || el.dataset.cenaPronta === '1') return null;
    el.dataset.cenaPronta = '1';
    var canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    el.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    if (!ctx) { canvas.remove(); return null; }

    var cena = {
      el: el, canvas: canvas, ctx: ctx,
      w: 0, h: 0, visivel: false, inicio: null, desenhar: desenhar
    };
    cenas.push(cena);
    medir(cena);

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entradas) {
        cena.visivel = entradas[0].isIntersecting;
        if (reduzido && cena.visivel) desenharCena(cena, 0);
      }, { rootMargin: '100px 0px', threshold: 0 });
      io.observe(el);
    } else {
      cena.visivel = true;
      if (reduzido) desenharCena(cena, 0);
    }

    if (reduzido) desenharCena(cena, 0);
    return cena;
  }

  function medir(cena) {
    var r = cena.el.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) return;
    cena.w = r.width;
    cena.h = r.height;
    cena.canvas.width = Math.round(r.width * dpr);
    cena.canvas.height = Math.round(r.height * dpr);
    cena.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function desenharCena(cena, t) {
    if (!cena.w || !cena.h) medir(cena);
    if (!cena.w || !cena.h) return;
    cena.ctx.clearRect(0, 0, cena.w, cena.h);
    cena.desenhar(cena.ctx, cena.w, cena.h, t, cena);
    cena.ctx.globalAlpha = 1;
  }

  function quadro(ts) {
    if (parado) return;
    if (!ultimo) ultimo = ts;
    relogio = ts / 1000;
    if (ts - ultimo >= 33) {
      ultimo = ts;
      for (var i = 0; i < cenas.length; i++) {
        var c = cenas[i];
        if (!c.visivel) continue;
        if (c.inicio === null) c.inicio = relogio;
        desenharCena(c, relogio - c.inicio);
      }
    }
    window.requestAnimationFrame(quadro);
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { parado = true; return; }
    if (parado) {
      parado = false;
      ultimo = 0;
      window.requestAnimationFrame(quadro);
    }
  });

  var pedidoRedim = 0;
  window.addEventListener('resize', function () {
    if (pedidoRedim) return;
    pedidoRedim = window.requestAnimationFrame(function () {
      pedidoRedim = 0;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      for (var i = 0; i < cenas.length; i++) {
        medir(cenas[i]);
        if (reduzido && cenas[i].visivel) desenharCena(cenas[i], 0);
      }
    });
  }, { passive: true });

  /* ---------- 01 · três discos empilhados em perspectiva ---------- */
  /* Cada disco é uma elipse de pontos; os pontos de cima e de baixo
     deslizam devagar entre as camadas (os dois lados da mesma pilha). */

  function cenaPilha(ctx, w, h, t) {
    var cx = w / 2, cy = h / 2;
    var base = Math.min(w, h);
    var rx = base * 0.36, ry = base * 0.105;
    var gap = base * 0.115;

    for (var camada = 0; camada < 3; camada++) {
      var yBase = cy + (camada - 1) * gap;
      var giro = t * 0.16 + camada * 0.9;
      var pontos = 54;
      for (var i = 0; i < pontos; i++) {
        var a = (i / pontos) * 6.2832 + giro;
        var prof = Math.sin(a);
        var x = cx + Math.cos(a) * rx;
        var flutua = Math.sin(t * 0.42 + i * 0.55 + camada * 1.7) * gap * 0.16;
        var y = yBase + prof * ry + flutua;
        var alfa = 0.10 + 0.20 * ((prof + 1) / 2);
        ponto(ctx, x, y, 0.9 + 0.45 * ((prof + 1) / 2), alfa);
      }
    }

    /* um fio de pontos ligando as bordas da pilha, para dar volume */
    for (var k = 0; k < 22; k++) {
      var ang = (k / 22) * 6.2832;
      var x2 = cx + Math.cos(ang) * rx * 0.98;
      var y2 = cy - gap + Math.sin(ang) * ry;
      var y3 = cy + gap + Math.sin(ang) * ry;
      ctx.globalAlpha = 0.06;
      ctx.strokeStyle = CLARO;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2, y3);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  /* ---------- 02 · mini sistema solar ---------- */
  /* Centro = KODAROS; quatro órbitas pontilhadas, um corpo em cada. */

  function cenaSistema(ctx, w, h, t) {
    var cx = w / 2, cy = h / 2;
    var base = Math.min(w, h);
    var maxR = base * 0.44;
    var raios = [0.30, 0.48, 0.66, 0.84, 1];
    var voltas = [0.34, 0.24, 0.18, 0.14, 0.10]; // rad/s
    var fases = [0.4, 2.1, 4.0, 5.2, 1.2];

    /* núcleo: pequeno enxame de pontos */
    for (var c = 0; c < 14; c++) {
      var ac = (c / 14) * 6.2832 + t * 0.12;
      var rc = base * 0.012 + (c % 3) * 1.4;
      ponto(ctx, cx + Math.cos(ac) * rc, cy + Math.sin(ac) * rc * 0.9,
        c === 0 ? 1.7 : 1, c === 0 ? 0.8 : 0.35);
    }

    for (var o = 0; o < raios.length; o++) {
      var rx = maxR * raios[o], ry = rx * 0.62;
      var qtd = 48 + o * 12;
      for (var i = 0; i < qtd; i++) {
        var a = (i / qtd) * 6.2832;
        var prof = Math.sin(a);
        ponto(ctx, cx + Math.cos(a) * rx, cy + prof * ry,
          0.65 + 0.3 * ((prof + 1) / 2), 0.06 + 0.05 * ((prof + 1) / 2));
      }
      /* corpo da órbita */
      var ang = t * voltas[o] + fases[o];
      var bx = cx + Math.cos(ang) * rx;
      var by = cy + Math.sin(ang) * ry;
      var frente = Math.sin(ang) > 0;
      for (var p = 0; p < 6; p++) {
        var pa = (p / 6) * 6.2832 + t * 0.4;
        ponto(ctx, bx + Math.cos(pa) * 2.4, by + Math.sin(pa) * 2.4,
          0.8, frente ? 0.35 : 0.18);
      }
      ponto(ctx, bx, by, 1.9, frente ? 0.85 : 0.45);
    }
  }

  /* ---------- 03 · corpos dos cards ---------- */

  function cenaPlanetaAnel(ctx, w, h, t) {
    var cx = w / 2, cy = h / 2;
    var raio = Math.min(w, h) * 0.24;
    var N = 240;
    var giro = t * 0.10;
    var incl = -0.32;
    var cosI = Math.cos(incl), sinI = Math.sin(incl);
    var luz = { x: -0.5, y: -0.4, z: 0.76 };

    /* anel: metade de trás primeiro */
    var anelA = raio * 1.55, anelB = raio * 0.42, giroAnel = -0.24;
    function anel(frente) {
      for (var i = 0; i < 64; i++) {
        var a = (i / 64) * 6.2832;
        var ex = Math.cos(a) * anelA;
        var ey = Math.sin(a) * anelB;
        var gx = ex * Math.cos(giroAnel) - ey * Math.sin(giroAnel);
        var gy = ex * Math.sin(giroAnel) + ey * Math.cos(giroAnel);
        var ehFrente = gy > 0;
        if (ehFrente !== frente) continue;
        ponto(ctx, cx + gx, cy + gy, frente ? 1.0 : 0.8,
          frente ? 0.20 + 0.12 * Math.sin(a) : 0.08);
      }
    }
    anel(false);

    for (var k = 0; k < N; k++) {
      var y0 = 1 - (k / (N - 1)) * 2;
      var r0 = Math.sqrt(1 - y0 * y0);
      var th = Math.PI * (3 - Math.sqrt(5)) * k;
      var px = Math.cos(th) * r0;
      var pz = Math.sin(th) * r0;
      var rx = px * Math.cos(giro) + pz * Math.sin(giro);
      var rz = -px * Math.sin(giro) + pz * Math.cos(giro);
      var ty = y0 * cosI - rz * sinI;
      var tz = y0 * sinI + rz * cosI;
      if (tz <= 0) continue;
      var b = Math.max(0, rx * luz.x + ty * luz.y + tz * luz.z);
      ponto(ctx, cx + rx * raio, cy - ty * raio, 0.85 + 0.55 * b, 0.22 + 0.62 * b);
    }
    anel(true);
  }

  function cenaCristal(ctx, w, h, t) {
    var cx = w / 2, cy = h / 2;
    var R = Math.min(w, h) * 0.28;
    var ay = t * 0.28, ax = Math.sin(t * 0.11) * 0.35;
    var cosY = Math.cos(ay), sinY = Math.sin(ay);
    var cosX = Math.cos(ax), sinX = Math.sin(ax);

    /* octaedro: 6 vértices, 12 arestas */
    var v = [
      [0, 1, 0], [1, 0, 0], [0, 0, 1], [-1, 0, 0], [0, 0, -1], [0, -1, 0]
    ];
    var arestas = [
      [0, 1], [0, 2], [0, 3], [0, 4],
      [1, 2], [2, 3], [3, 4], [4, 1],
      [5, 1], [5, 2], [5, 3], [5, 4]
    ];

    function projetar(p) {
      var x = p[0] * cosY + p[2] * sinY;
      var z = -p[0] * sinY + p[2] * cosY;
      var y = p[1] * cosX - z * sinX;
      var z2 = p[1] * sinX + z * cosX;
      return { x: cx + x * R, y: cy - y * R, z: z2 };
    }

    for (var a = 0; a < arestas.length; a++) {
      var p1 = projetar(v[arestas[a][0]]);
      var p2 = projetar(v[arestas[a][1]]);
      var passos = 9;
      for (var s = 0; s <= passos; s++) {
        var f = s / passos;
        var x = p1.x + (p2.x - p1.x) * f;
        var y = p1.y + (p2.y - p1.y) * f;
        var z = p1.z + (p2.z - p1.z) * f;
        ponto(ctx, x, y, 0.8 + 0.35 * ((z + 1) / 2), 0.13 + 0.30 * ((z + 1) / 2));
      }
    }
    for (var vi = 0; vi < v.length; vi++) {
      var pv = projetar(v[vi]);
      ponto(ctx, pv.x, pv.y, 1.5, 0.55 + 0.3 * ((pv.z + 1) / 2));
    }
  }

  function cenaNuvem(ctx, w, h, t) {
    var cx = w / 2, cy = h / 2;
    var base = Math.min(w, h);
    var nos = [];
    var semente = 7;
    function rnd() {
      semente = (semente * 9301 + 49297) % 233280;
      return semente / 233280;
    }
    for (var i = 0; i < 26; i++) {
      var a = rnd() * 6.2832;
      var r = Math.sqrt(rnd()) * base * 0.34;
      nos.push({
        x: cx + Math.cos(a) * r,
        y: cy + Math.sin(a) * r * 0.62,
        fase: rnd() * 6.2832,
        z: rnd()
      });
    }
    /* arestas entre vizinhos */
    var arestas = [];
    for (var n = 0; n < nos.length; n++) {
      for (var m = n + 1; m < nos.length; m++) {
        var dx = nos[n].x - nos[m].x, dy = nos[n].y - nos[m].y;
        if (dx * dx + dy * dy < Math.pow(base * 0.16, 2)) arestas.push([n, m]);
      }
    }
    /* deriva lenta dos nós */
    for (var d = 0; d < nos.length; d++) {
      nos[d].dx = Math.sin(t * 0.25 + nos[d].fase) * 3;
      nos[d].dy = Math.cos(t * 0.19 + nos[d].fase) * 2.4;
    }

    for (var e = 0; e < arestas.length; e++) {
      var a1 = nos[arestas[e][0]], a2 = nos[arestas[e][1]];
      ctx.globalAlpha = 0.055;
      ctx.strokeStyle = CLARO;
      ctx.lineWidth = 0.55;
      ctx.beginPath();
      ctx.moveTo(a1.x + a1.dx, a1.y + a1.dy);
      ctx.lineTo(a2.x + a2.dx, a2.y + a2.dy);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    for (var q = 0; q < nos.length; q++) {
      var no = nos[q];
      ponto(ctx, no.x + no.dx, no.y + no.dy, 1.1 + no.z * 0.7, 0.18 + no.z * 0.30);
    }

    /* pulsos viajando por algumas arestas */
    for (var pi = 0; pi < 8; pi++) {
      var aresta = arestas[(pi * 13) % arestas.length];
      if (!aresta) continue;
      var de = nos[aresta[0]], para = nos[aresta[1]];
      var ciclo = (t * 0.34 + pi * 0.37) % 1;
      var f = ciclo < 0.5 ? ciclo * 2 : (1 - ciclo) * 2;
      var px = de.x + de.dx + (para.x + para.dx - de.x - de.dx) * f;
      var py = de.y + de.dy + (para.y + para.dy - de.y - de.dy) * f;
      ponto(ctx, px, py, 1.5, 0.55 * (1 - Math.abs(f * 2 - 1) * 0.6));
    }
  }

  /* ---------- 08 · Traycer + cinco satélites ---------- */
  /* A cena mais importante: órbitas pontilhadas, pulsos que saem do
     centro e acendem o satélite correspondente ao item da lista. */

  var AGENTES = ['claude', 'codex', 'opencode', 'deepseek', 'hermes'];
  var cenaAgentes = null;

  function cenaOrbitaAgentes(ctx, w, h, t) {
    var cx = w / 2, cy = h / 2;
    var maxR = Math.min(w, h) * 0.45;
    var raios = [0.46, 0.60, 0.74, 0.88, 1.0];
    var voltas = [0.11, 0.085, 0.065, 0.052, 0.042];
    var fases = [-1.1, 0.3, 1.7, 3.0, 4.4];
    var destaque = cenaAgentes ? cenaAgentes.destaque : -1;

    /* órbitas: elipses achatadas e inclinadas, pontos apagados */
    for (var o = 0; o < raios.length; o++) {
      var rx = maxR * raios[o];
      var ry = rx * 0.72;
      var qtd = 70 + o * 10;
      var ativa = destaque === o;
      for (var i = 0; i < qtd; i++) {
        var a = (i / qtd) * 6.2832;
        var prof = Math.sin(a);
        ponto(ctx, cx + Math.cos(a) * rx, cy + prof * ry,
          0.65 + 0.3 * ((prof + 1) / 2),
          (ativa ? 0.20 : 0.085) + 0.075 * ((prof + 1) / 2));
      }
    }

    /* centro: núcleo de pontos, respirando devagar */
    for (var c = 0; c < 24; c++) {
      var ac = (c / 24) * 6.2832 + t * 0.05;
      var rc = 5 + (c % 4) * 2.2 + Math.sin(t * 0.6 + c) * 0.9;
      ponto(ctx, cx + Math.cos(ac) * rc, cy + Math.sin(ac) * rc * 0.9,
        c === 0 ? 2.2 : 1, c === 0 ? 0.95 : 0.34);
    }

    for (var s = 0; s < AGENTES.length; s++) {
      var ang = t * voltas[s] + fases[s];
      var bx = cx + Math.cos(ang) * maxR * raios[s];
      var by = cy + Math.sin(ang) * maxR * raios[s] * 0.72;
      var ativo = destaque === s;
      var frente = Math.sin(ang) > 0;
      var brilho = ativo ? 1 : (frente ? 0.70 : 0.42);

      /* satélite: enxame de 9 pontos + núcleo */
      for (var k = 0; k < 9; k++) {
        var ka = (k / 9) * 6.2832 + t * 0.3;
        var kr = ativo ? 7.4 : 5.2;
        ponto(ctx, bx + Math.cos(ka) * kr, by + Math.sin(ka) * kr * 0.9,
          0.8, brilho * (ativo ? 0.9 : 0.62));
      }
      ponto(ctx, bx, by, ativo ? 3.0 : 2.2, brilho);
      if (ativo) {
        ponto(ctx, bx, by, 9, 0.14);
        ponto(ctx, bx, by, 15, 0.06);
        /* fio pontilhado ligando o centro ao satélite ativo */
        for (var fio = 1; fio < 26; fio++) {
          var ff = fio / 26;
          ponto(ctx, cx + (bx - cx) * ff, cy + (by - cy) * ff, 0.7, 0.18);
        }
      }

      /* pulsos do centro até o satélite */
      for (var p = 0; p < 4; p++) {
        var ciclo = (t * (ativo ? 0.55 : 0.30) + s * 0.27 + p * 0.25) % 1;
        var ease = ciclo * ciclo * (3 - 2 * ciclo);
        var px = cx + (bx - cx) * ease;
        var py = cy + (by - cy) * ease;
        var alfaP = (ativo ? 0.9 : 0.42) * Math.sin(Math.PI * ciclo);
        ponto(ctx, px, py, ativo ? 1.9 : 1.25, alfaP);
      }
    }
  }

  /* ---------- 04 · ícones de domínio (SVG) ---------- */

  function svgIcone(tipo) {
    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 48 48');
    svg.setAttribute('width', '48');
    svg.setAttribute('height', '48');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.classList.add('ico-pontos');
    svg.dataset.tipo = tipo;

    function dot(x, y, r, a) {
      var c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', x.toFixed(2));
      c.setAttribute('cy', y.toFixed(2));
      c.setAttribute('r', (r || 1).toFixed(2));
      c.setAttribute('fill', '#f4f4f4');
      c.setAttribute('opacity', (a == null ? 0.75 : a).toFixed(2));
      return c;
    }
    function linha(x1, y1, x2, y2, passos, a) {
      passos = passos || 10;
      for (var i = 0; i <= passos; i++) {
        var f = i / passos;
        svg.appendChild(dot(x1 + (x2 - x1) * f, y1 + (y2 - y1) * f, 0.8, a));
      }
    }
    function circulo(cx, cy, r, qtd, a, inicio) {
      for (var i = 0; i < qtd; i++) {
        var ang = ((i / qtd) * 6.2832) + (inicio || 0);
        svg.appendChild(dot(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r, 0.8, a));
      }
    }

    if (tipo === 'cubo') {
      /* isométrico: face de cima + duas laterais, em pontos */
      var topo = [[24, 7], [40, 15], [24, 23], [8, 15]];
      var baixo = [[8, 15], [8, 31], [24, 39], [40, 31], [40, 15], [24, 23]];
      for (var i = 0; i < topo.length; i++) {
        var a1 = topo[i], a2 = topo[(i + 1) % topo.length];
        linha(a1[0], a1[1], a2[0], a2[1], 7, 0.7);
      }
      linha(8, 15, 8, 31, 8, 0.5); linha(8, 31, 24, 39, 7, 0.5);
      linha(24, 39, 40, 31, 7, 0.5); linha(40, 31, 40, 15, 8, 0.5);
      linha(24, 23, 24, 39, 8, 0.4);
      svg.classList.add('gira');
    } else if (tipo === 'janela') {
      linha(6, 10, 42, 10, 18, 0.7); linha(6, 10, 6, 38, 14, 0.55);
      linha(42, 10, 42, 38, 14, 0.55); linha(6, 38, 42, 38, 18, 0.55);
      for (var d = 0; d < 3; d++) svg.appendChild(dot(10 + d * 3, 14, 0.9, 0.65));
      linha(10, 22, 28, 22, 9, 0.35); linha(10, 27, 24, 27, 7, 0.3);
      linha(10, 32, 20, 32, 5, 0.25);
    } else if (tipo === 'engrenagem') {
      circulo(24, 24, 12, 26, 0.55);
      circulo(24, 24, 6, 14, 0.35, 0.2);
      for (var g = 0; g < 8; g++) {
        var ag = (g / 8) * 6.2832;
        linha(24 + Math.cos(ag) * 13, 24 + Math.sin(ag) * 13,
          24 + Math.cos(ag) * 18, 24 + Math.sin(ag) * 18, 3, 0.6);
      }
      svg.classList.add('gira');
    } else if (tipo === 'camadas') {
      for (var c in [0, 1, 2]) {
        var oy = Number(c) * 8;
        var pts = [[24, 8 + oy], [40, 16 + oy], [24, 24 + oy], [8, 16 + oy]];
        for (var p2 = 0; p2 < pts.length; p2++) {
          var b1 = pts[p2], b2 = pts[(p2 + 1) % pts.length];
          linha(b1[0], b1[1], b2[0], b2[1], 6, 0.62 - Number(c) * 0.12);
        }
      }
    } else if (tipo === 'escudo') {
      var esq = [[24, 5], [9, 11], [9, 24], [24, 43], [39, 24], [39, 11]];
      for (var e2 = 0; e2 < esq.length; e2++) {
        var c1 = esq[e2], c2 = esq[(e2 + 1) % esq.length];
        linha(c1[0], c1[1], c2[0], c2[1], 8, 0.62);
      }
      var scan = document.createElementNS(NS, 'line');
      scan.setAttribute('x1', '9'); scan.setAttribute('x2', '39');
      scan.setAttribute('y1', '12'); scan.setAttribute('y2', '12');
      scan.setAttribute('stroke', '#ffffff');
      scan.setAttribute('stroke-width', '0.7');
      scan.setAttribute('opacity', '0.5');
      scan.classList.add('varredura');
      svg.appendChild(scan);
    } else if (tipo === 'dados') {
      var pos = [[12, 14], [20, 10], [30, 16], [36, 11], [16, 24], [26, 22],
        [34, 27], [11, 33], [21, 35], [31, 36], [39, 34], [25, 29]];
      for (var dp = 0; dp < pos.length; dp++) {
        svg.appendChild(dot(pos[dp][0], pos[dp][1], 0.9, 0.22 + (dp % 4) * 0.12));
      }
      linha(16, 24, 26, 22, 6, 0.16); linha(26, 22, 34, 27, 5, 0.16);
      var fora = dot(38, 8, 1.8, 0.9);
      fora.classList.add('pisca');
      svg.appendChild(fora);
    } else if (tipo === 'hexagono') {
      for (var hx = 0; hx < 6; hx++) {
        var a3 = (hx / 6) * 6.2832 - Math.PI / 2;
        var a4 = ((hx + 1) / 6) * 6.2832 - Math.PI / 2;
        linha(24 + Math.cos(a3) * 17, 24 + Math.sin(a3) * 17,
          24 + Math.cos(a4) * 17, 24 + Math.sin(a4) * 17, 9, 0.62);
      }
      circulo(24, 24, 4, 10, 0.3, 0.4);
    } else if (tipo === 'redes') {
      svg.appendChild(dot(24, 34, 1.6, 0.9));
      for (var r = 1; r <= 3; r++) {
        var raio = r * 6.5;
        for (var q = 0; q < 7 + r * 2; q++) {
          var aq = Math.PI + (q / (6 + r * 2)) * Math.PI;
          svg.appendChild(dot(24 + Math.cos(aq) * raio, 34 + Math.sin(aq) * raio,
            0.7, 0.45 - r * 0.09));
        }
      }
    }

    return svg;
  }

  /* ---------- 05 · mostruário: grade 5x4 que vira wireframe ---------- */

  function cenaMostruario(ctx, w, h, t) {
    var cols = 5, linhas = 4;
    var margemX = Math.max(18, w * 0.08);
    var margemY = Math.max(18, h * 0.10);
    var larg = w - margemX * 2;
    var alt = h - margemY * 2;

    var grade = [];
    for (var l = 0; l < linhas; l++) {
      for (var c = 0; c < cols; c++) {
        grade.push({
          x: margemX + (larg / (cols - 1)) * c,
          y: margemY + (alt / (linhas - 1)) * l
        });
      }
    }

    /* três wireframes desenhados com os mesmos 20 pontos */
    var layoutCabecalho = [];
    for (var i = 0; i < 20; i++) {
      if (i < 5) layoutCabecalho.push({ x: margemX + larg * (i / 4), y: margemY });
      else if (i < 15) {
        var j = i - 5;
        layoutCabecalho.push({
          x: margemX + larg * 0.25 + (j % 3) * larg * 0.18,
          y: margemY + alt * (0.28 + Math.floor(j / 3) * 0.11)
        });
      } else layoutCabecalho.push({
        x: margemX + larg * ((i - 15) / 4), y: margemY + alt * 0.86
      });
    }

    var layoutCards = [];
    for (var k = 0; k < 20; k++) {
      var card = k % 3;
      var dentro = Math.floor(k / 3);
      var baseX = margemX + larg * (0.02 + card * 0.34);
      var baseY = margemY + alt * (0.18 + (dentro % 2) * 0.34);
      layoutCards.push({
        x: baseX + larg * 0.27 * (0.15 + (dentro % 2) * 0.7),
        y: baseY + alt * 0.18 * (Math.floor(dentro / 2) % 2)
      });
    }

    var ciclo = (t * 0.085) % 3;
    var de, para, fase;
    if (ciclo < 1) { de = grade; para = layoutCabecalho; fase = ciclo; }
    else if (ciclo < 2) { de = layoutCabecalho; para = layoutCards; fase = ciclo - 1; }
    else { de = layoutCards; para = grade; fase = ciclo - 2; }
    var f = fase < 0.15 ? 0 : fase > 0.85 ? 1 : (fase - 0.15) / 0.7;
    f = f * f * (3 - 2 * f);

    for (var p = 0; p < 20; p++) {
      var x = de[p].x + (para[p].x - de[p].x) * f;
      var y = de[p].y + (para[p].y - de[p].y) * f;
      var brilho = 0.28 + 0.34 * (p % 5) / 4;
      ponto(ctx, x, y, 1.15, brilho);
    }
  }

  /* ---------- 06 · árvore radial que cresce ---------- */

  function cenaArvore(ctx, w, h, t) {
    var cx = w / 2, cy = h * 0.54;
    var R = Math.min(w * 0.30, h * 0.46);
    var progresso = Math.min(1, t / 2.6);
    var ease = 1 - Math.pow(1 - progresso, 3);

    function ramo(x0, y0, ang, comp, forca) {
      var passos = Math.max(5, Math.round(comp / 7));
      for (var i = 1; i <= passos; i++) {
        var f = (i / passos) * forca;
        if (f > 1) f = 1;
        ponto(ctx, x0 + Math.cos(ang) * comp * f,
          y0 + Math.sin(ang) * comp * f,
          0.75, 0.12 + 0.26 * f);
      }
    }

    /* raiz: pequeno enxame */
    for (var r = 0; r < 12; r++) {
      var ar = (r / 12) * 6.2832 + t * 0.06;
      var rr = 2 + (r % 3) * 1.6;
      ponto(ctx, cx + Math.cos(ar) * rr, cy + Math.sin(ar) * rr, 0.9,
        r === 0 ? 0.95 : 0.35);
    }

    var ramos = 6;
    for (var b = 0; b < ramos; b++) {
      var ang = (b / ramos) * 6.2832 - Math.PI / 2 + 0.25;
      var comprimento = R * (0.82 + (b % 3) * 0.07);
      var local = Math.max(0, Math.min(1, (ease - b * 0.02) / (1 - b * 0.02)));
      ramo(cx, cy, ang, comprimento, local);

      if (local > 0.45) {
        var fm = (local - 0.45) / 0.55;
        var mx = cx + Math.cos(ang) * comprimento * 0.55;
        var my = cy + Math.sin(ang) * comprimento * 0.55;
        var perto = Math.min(1, fm * 1.4);
        ramo(mx, my, ang - 0.46, comprimento * 0.34, perto);
        ramo(mx, my, ang + 0.46, comprimento * 0.34, perto);

        var fimX = cx + Math.cos(ang) * comprimento;
        var fimY = cy + Math.sin(ang) * comprimento;
        for (var folha = 0; folha < 4; folha++) {
          var fa = ang + (folha - 1.5) * 0.38;
          var fr = comprimento * (0.10 + (folha % 2) * 0.05);
          var fx = fimX + Math.cos(fa) * fr;
          var fy = fimY + Math.sin(fa) * fr;
          var pulso = 0.26 + 0.26 * Math.sin(t * 0.85 + b * 1.3 + folha * 2.1);
          ponto(ctx, fx, fy, 1.2, pulso * Math.min(1, fm * 2));
        }
      }
    }
  }

  /* ---------- 07 · papel: três nós e um check ---------- */

  function cenaPapel(ctx, w, h, t) {
    var y = h / 2;
    var margem = Math.max(36, w * 0.12);
    var xs = [margem, w / 2, w - margem];

    for (var i = 0; i < xs.length - 1; i++) {
      for (var p = 0; p <= 26; p++) {
        var f = p / 26;
        ponto(ctx, xs[i] + (xs[i + 1] - xs[i]) * f, y, 0.7, 0.10);
      }
    }
    for (var n = 0; n < xs.length; n++) {
      ponto(ctx, xs[n], y, 2.0, 0.75);
      for (var a = 0; a < 8; a++) {
        var ang = (a / 8) * 6.2832 + t * 0.1;
        ponto(ctx, xs[n] + Math.cos(ang) * 6.5, y + Math.sin(ang) * 6.5, 0.7, 0.22);
      }
    }

    /* ponto viajando entre os nós e virando um check no último */
    var ciclo = (t * 0.16) % 1;
    var trecho = ciclo < 0.5 ? 0 : 1;
    var f2 = ciclo < 0.5 ? ciclo / 0.5 : (ciclo - 0.5) / 0.5;
    var ease = f2 * f2 * (3 - 2 * f2);
    var px = xs[trecho] + (xs[trecho + 1] - xs[trecho]) * ease;
    ponto(ctx, px, y, 2.3, 0.95);

    if (ciclo > 0.86) {
      var cf = (ciclo - 0.86) / 0.14;
      var comprimento = 13 * Math.min(1, cf * 1.8);
      for (var d = 0; d < 12; d++) {
        var dd = (d / 11) * comprimento;
        var x1 = xs[2] - 6 + dd * 0.55;
        var y1 = y - 2 + dd * 0.55;
        ponto(ctx, x1, y1, 1.15, 0.85 * Math.min(1, cf * 2));
        if (d > 5) {
          var x2 = xs[2] + 1 + (dd - 6) * 1.4;
          var y2 = y + 4 - (dd - 6) * 1.25;
          ponto(ctx, x2, y2, 1.15, 0.85 * Math.min(1, cf * 2));
        }
      }
    }
  }

  /* ---------- 09 · bootcamps: órbita aberta e cometa ---------- */

  function cenaBootcamps(ctx, w, h, t) {
    var margem = Math.max(30, w * 0.08);
    var yBase = h * 0.70;
    var cx = w / 2, cy = yBase;
    var rx = (w - margem * 2) / 2;
    var ry = h * 0.44;
    var paradas = 4;

    /* trilha: arco aberto de pontos */
    for (var i = 0; i <= 90; i++) {
      var f = i / 90;
      var ang = Math.PI + f * Math.PI;
      var x = cx + Math.cos(ang) * rx;
      var y = cy + Math.sin(ang) * ry;
      ponto(ctx, x, y, 0.7, 0.10 + 0.06 * Math.sin(f * Math.PI));
    }

    /* progresso pelo scroll da seção */
    var r = ctx.canvas.getBoundingClientRect();
    var vh = window.innerHeight || 800;
    var prog = (vh * 0.82 - r.top) / (r.height + vh * 0.28);
    prog = Math.max(0, Math.min(1, prog));

    for (var s = 0; s < paradas; s++) {
      var fs = paradas === 1 ? 0 : s / (paradas - 1);
      var as = Math.PI + fs * Math.PI;
      var sx = cx + Math.cos(as) * rx;
      var sy = cy + Math.sin(as) * ry;
      var aceso = prog >= fs - 0.02;
      ponto(ctx, sx, sy, aceso ? 2.6 : 1.8, aceso ? 0.9 : 0.28);
      if (aceso) {
        for (var halo = 0; halo < 6; halo++) {
          var ha = (halo / 6) * 6.2832 + t * 0.15;
          ponto(ctx, sx + Math.cos(ha) * 6, sy + Math.sin(ha) * 6, 0.7, 0.18);
        }
      }
    }

    /* cometa percorrendo a trilha conforme o scroll */
    var angC = Math.PI + prog * Math.PI;
    var cxp = cx + Math.cos(angC) * rx;
    var cyp = cy + Math.sin(angC) * ry;
    for (var c = 12; c >= 0; c--) {
      var fc = prog - c * 0.008;
      if (fc < 0) continue;
      var ac = Math.PI + fc * Math.PI;
      var tx = cx + Math.cos(ac) * rx;
      var ty = cy + Math.sin(ac) * ry;
      ponto(ctx, tx, ty, c === 0 ? 1.9 : 1.0 - c * 0.04, (c === 0 ? 0.95 : 0.30) * (1 - c / 14));
    }
  }

  /* ---------- 10 · contato: ondas de rádio ---------- */

  function cenaContato(ctx, w, h, t) {
    var cx = w / 2, cy = h / 2;
    var maxR = Math.min(w, h) * 0.46;
    ponto(ctx, cx, cy, 2.0, 0.8);
    for (var onda = 0; onda < 5; onda++) {
      var fase = ((t * 0.12 + onda / 5) % 1);
      var r = maxR * (0.15 + fase * 0.85);
      var alfa = 0.22 * (1 - fase);
      var qtd = 18 + Math.floor(fase * 42);
      for (var i = 0; i < qtd; i++) {
        var a = (i / qtd) * 6.2832;
        ponto(ctx, cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0.75, alfa);
      }
    }
  }

  /* ---------- montagem ---------- */

  function iniciar() {
    var mapa = {
      pilha: cenaPilha,
      sistema: cenaSistema,
      kodaros: cenaPlanetaAnel,
      garimpo: cenaCristal,
      cloud4all: cenaNuvem,
      agentes: cenaOrbitaAgentes,
      mostruario: cenaMostruario,
      arvore: cenaArvore,
      papel: cenaPapel,
      bootcamps: cenaBootcamps,
      contato: cenaContato
    };

    var alvos = document.querySelectorAll('[data-cena]');
    for (var i = 0; i < alvos.length; i++) {
      var tipo = alvos[i].dataset.cena;
      if (!mapa[tipo]) continue;
      var cena = criar(alvos[i], mapa[tipo]);
      if (tipo === 'agentes') cenaAgentes = cena;
    }

    /* ícones de domínio: injetados no início de cada item, sem texto */
    var dominios = document.querySelectorAll('[data-dominio]');
    for (var d = 0; d < dominios.length; d++) {
      var li = dominios[d];
      if (li.querySelector('.ico-pontos')) continue;
      var ico = document.createElement('span');
      ico.className = 'dom-ico';
      ico.setAttribute('aria-hidden', 'true');
      ico.appendChild(svgIcone(li.dataset.dominio));
      li.insertBefore(ico, li.firstChild);
    }

    /* hover/foco na lista de agentes acende o satélite correspondente */
    if (cenaAgentes) {
      var itens = document.querySelectorAll('[data-agente]');
      for (var a = 0; a < itens.length; a++) {
        (function (item) {
          var idx = AGENTES.indexOf(item.dataset.agente);
          if (idx < 0) return;
          item.addEventListener('mouseenter', function () { cenaAgentes.destaque = idx; });
          item.addEventListener('mouseleave', function () { cenaAgentes.destaque = -1; });
          item.addEventListener('focusin', function () { cenaAgentes.destaque = idx; });
          item.addEventListener('focusout', function () { cenaAgentes.destaque = -1; });
        })(itens[a]);
      }
    }

    /* hero: reação leve ao mouse (CSS transform no canvas do planeta) */
    var globo = document.querySelector('.hero-cena .globo canvas');
    if (globo && !reduzido) {
      globo.style.transition = 'transform 380ms cubic-bezier(0.22, 1, 0.36, 1)';
      window.addEventListener('pointermove', function (ev) {
        var nx = (ev.clientX / window.innerWidth - 0.5) * 2;
        var ny = (ev.clientY / window.innerHeight - 0.5) * 2;
        globo.style.transform = 'translate3d(' + (nx * -5).toFixed(2) + 'px,' +
          (ny * -4).toFixed(2) + 'px,0) scale(1.008)';
      }, { passive: true });
    }

    if (!reduzido) window.requestAnimationFrame(quadro);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
