/* fundo.js · campo de pontos do fundo global.
   Mesma linguagem do planeta: branco/cinza sobre preto, pontos de
   1–2px, opacidade pela profundidade. Três camadas com parallax no
   scroll (a de trás anda menos e é mais apagada), cintilação lenta,
   constelação momentânea perto do cursor e um cometa ocasional com
   cauda pontilhada.

   Regras: canvas fixo atrás de tudo, 30fps, densidade reduzida no
   celular, pausa com a aba oculta e um único quadro estático em
   prefers-reduced-motion. Nada aqui é clicável ou legível por
   leitor de tela. */
(function () {
  'use strict';

  if (!document.body) return;

  var reduzido = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var canvas = document.createElement('canvas');
  canvas.className = 'fundo-campo';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);

  var ctx = canvas.getContext('2d');
  if (!ctx) { canvas.remove(); return; }

  var CLARO = '#f4f4f4';
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0, pequeno = false;
  var camadas = [];
  var rato = { x: -9999, y: -9999, ativo: false };
  var segundo = 0;
  var ultimoQuadro = 0;
  var parado = false;

  /* ---------- pontos ---------- */

  function criarCamada(qtd, raio, alfa, fator, fase) {
    var pts = [];
    for (var i = 0; i < qtd; i++) {
      pts.push({
        x: Math.random(),
        y: Math.random(),
        r: raio + Math.random() * 0.7,
        a: alfa * (0.55 + Math.random() * 0.45),
        tw: 0.4 + Math.random() * 1.6,       // velocidade da cintilação
        fase: Math.random() * 6.2832 + fase,
        deriva: 0.3 + Math.random() * 0.7
      });
    }
    return { pts: pts, fator: fator };
  }

  function construir() {
    W = window.innerWidth;
    H = window.innerHeight;
    pequeno = W < 760;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    camadas = [
      criarCamada(pequeno ? 34 : 88, 0.65, 0.14, 0.016, 0),
      criarCamada(pequeno ? 22 : 58, 0.9, 0.22, 0.042, 1.7),
      criarCamada(pequeno ? 14 : 40, 1.2, 0.30, 0.085, 3.1)
    ];

    if (reduzido) desenhar(0);
  }

  /* ---------- cometa ---------- */

  var cometa = { ativo: false, x: 0, y: 0, vx: 0, vy: 0, vida: 0, espera: 9 + Math.random() * 12 };

  function acenderCometa() {
    var daEsquerda = Math.random() < 0.6;
    cometa.ativo = true;
    cometa.vida = 0;
    cometa.x = daEsquerda ? -40 : W * (0.35 + Math.random() * 0.65);
    cometa.y = H * (0.06 + Math.random() * 0.45);
    var vel = 90 + Math.random() * 60;      // px/s, bem devagar
    var ang = (18 + Math.random() * 16) * Math.PI / 180;
    cometa.vx = Math.cos(ang) * vel * (daEsquerda ? 1 : -1);
    cometa.vy = Math.sin(ang) * vel;
  }

  function desenharCometa() {
    if (!cometa.ativo) {
      cometa.espera -= 0.033;
      if (cometa.espera <= 0) acenderCometa();
      return;
    }
    cometa.vida += 0.033;
    cometa.x += cometa.vx * 0.033;
    cometa.y += cometa.vy * 0.033;

    var cauda = 22;
    for (var i = cauda; i >= 0; i--) {
      var f = i / cauda;
      var x = cometa.x - cometa.vx * 0.004 * i * 2;
      var y = cometa.y - cometa.vy * 0.004 * i * 2;
      ctx.globalAlpha = 0.26 * (1 - f) * Math.min(1, cometa.vida * 1.6) * Math.min(1, (9 - cometa.vida) * 0.8);
      ctx.fillStyle = CLARO;
      ctx.beginPath();
      ctx.arc(x, y, i === 0 ? 1.6 : 1.0 * (1 - f * 0.5), 0, 6.2832);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    if (cometa.vida > 9 || cometa.x < -160 || cometa.x > W + 160 || cometa.y > H + 160) {
      cometa.ativo = false;
      cometa.espera = 12 + Math.random() * 16;
    }
  }

  /* ---------- desenho ---------- */

  function desenhar(t) {
    ctx.clearRect(0, 0, W, H);
    var scroll = window.scrollY || window.pageYOffset || 0;

    /* pontos das três camadas, com parallax e cintilação */
    var visiveis = [];
    for (var c = 0; c < camadas.length; c++) {
      var cam = camadas[c];
      var deslocamento = (scroll * cam.fator) % H;
      for (var i = 0; i < cam.pts.length; i++) {
        var p = cam.pts[i];
        var x = p.x * W + Math.sin(t * 0.05 * p.deriva + p.fase) * 2.4;
        var y = ((p.y * H - deslocamento) % H + H) % H;
        var brilho = 0.62 + 0.38 * Math.sin(t * p.tw * 0.5 + p.fase);
        ctx.globalAlpha = p.a * brilho;
        ctx.fillStyle = CLARO;
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, 6.2832);
        ctx.fill();
        if (c === 2) visiveis.push({ x: x, y: y });
      }
    }
    ctx.globalAlpha = 1;

    /* constelação momentânea: só os pontos da camada da frente,
       e só os que estão perto do cursor */
    if (!reduzido && rato.ativo && visiveis.length) {
      var perto = [];
      for (var v = 0; v < visiveis.length; v++) {
        var dx = visiveis[v].x - rato.x;
        var dy = visiveis[v].y - rato.y;
        if (dx * dx + dy * dy < 130 * 130) perto.push(visiveis[v]);
      }
      if (perto.length > 8) perto = perto.slice(0, 8);
      for (var a = 0; a < perto.length; a++) {
        for (var b = a + 1; b < perto.length; b++) {
          var ddx = perto[a].x - perto[b].x;
          var ddy = perto[a].y - perto[b].y;
          var d = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d > 118) continue;
          ctx.globalAlpha = 0.10 * (1 - d / 118);
          ctx.strokeStyle = CLARO;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(perto[a].x, perto[a].y);
          ctx.lineTo(perto[b].x, perto[b].y);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    }

    if (!reduzido) desenharCometa();
  }

  /* ---------- loop ---------- */

  function quadro(ts) {
    if (parado) return;
    segundo = ts / 1000;
    if (ts - ultimoQuadro >= 33) {
      ultimoQuadro = ts;
      desenhar(segundo);
    }
    window.requestAnimationFrame(quadro);
  }

  function parar() {
    if (parado) return;
    parado = true;
  }

  function voltar() {
    if (!parado) return;
    parado = false;
    ultimoQuadro = 0;
    window.requestAnimationFrame(quadro);
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) parar(); else voltar();
  });

  window.addEventListener('pointermove', function (ev) {
    rato.x = ev.clientX;
    rato.y = ev.clientY;
    rato.ativo = true;
  }, { passive: true });

  window.addEventListener('pointerleave', function () {
    rato.ativo = false;
  }, { passive: true });

  window.addEventListener('blur', function () { rato.ativo = false; });

  /* redimensionar com debounce: não recria pontos a cada pixel */
  var pedido = 0;
  window.addEventListener('resize', function () {
    if (pedido) return;
    pedido = window.requestAnimationFrame(function () {
      pedido = 0;
      var mudouMuito = Math.abs(window.innerWidth - W) > 80;
      W = window.innerWidth;
      H = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduzido || mudouMuito) construir();
    });
  }, { passive: true });

  construir();
  if (!reduzido) window.requestAnimationFrame(quadro);
})();
