/* planeta.js — globo de Terra em canvas 2D, ancorado aos heros
   ([data-globe]). Único motivo decorativo do site: a esfera de pontos
   com os continentes reais, cercada por uma órbita também de pontos —
   a mesma linguagem visual, com escala fechada (nada sangra pela
   borda, nada cresce sem limite).

   A esfera é uma distribuição de Fibonacci (~2600 pontos); a máscara
   de continentes (256x128 bits, gerada de uma textura equiretangular
   real) decide terra e oceano: terra em pontos claros, oceano quase
   apagado, rotação lenta com inclinação fixa e luz no canto superior
   esquerdo.

   Cada [data-globe] é um quadrado: a esfera ocupa ~66% do lado e a
   órbita (elipse fina de pontos) se mantém inteira dentro da caixa,
   passando por trás e pela frente do planeta. Posição e tamanho ficam
   no CSS (.hero-cena); aqui só se desenha.

   prefers-reduced-motion: um único quadro estático. */
(function () {
  'use strict';

  var MASCARA_HEX = '0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000320080ff7f00000000000000000000000000000000000000000000000000c0ffffffffffff61000000000000000000000000000000000000000000000000f0ffffffffffffff0000400000be3b00001c0000000000000000000000000000f0ffbfffffffff0f0080ff070000000000f80700000000000000000000000080c1fff7ffffffff030000fe01000000000080070000000000000000000000e004f3ffe1ffffffff0700001c000000f8010008ff0000000000000000000000f01dd27f00c0ffffff070000000000801f0080ffff00000400000000000000001f00f6fe0380ffffff070000000000c003008cff1f0000000000000000000080ff1f30ff0f00ffffff010000000000e000007cfffefb0f000000000100000000f13f38ff7f00ffffff010400003f00c00000f0ffffff9f0100000000f8ff3ff0ff7f7038ff00feffff000000f0ff03003800e4ffffffffff1ef87e03fefffffeff1be03ff007fcff1f000000fcff1f80ff00feffffffffff9fffff7ff0ffffffffffff3fe01ffeff80110000feff1ffcff20f8ffffffffffffffff7efeffffffffffff1bf20ffc3f807f00007ffc60ff3f33d8ffffffffffffffff10e0ffffffffffdf39f303f807003f00c07ffedfffbfffffffffffffffffff7f00f0ffffffffff1f00df03f007000000f89fffffffffffffffffffffffffffff00e0ffffffffff0f003e00e003000000f80f9ffffffffefffffffffffffffe0f00e07ffeffffff0f003e068001000000f00fb0fffffffeffffffffffff3f7e0100000fc0ffffff1f00fe0f0000000030700ffcffffffffffffffffff1f000e0000c00d80ffffffff00fe1f0000000078008efeffffffffffffffffff07800f0000780000feffffff07ff3f000000007c0080ffffffffffffffffffff03800f0000060000faffffff1fff7f000000006e00d8ffffffffffffffffffff0f80070000010000f6ffffff1fffff00000000eec0fbffffffffffffffffffff3f80010000000000f0ffffff3fffff00000000e0f0ffffffffffffffffffffff2fc0000000000000e0ffffffffffcb0100000000ffffffffc1ffffffffffffff6f4000000000000080ffffffffffe303000000e0ffffffffc0ffffffffffffff2f0000000000000080ffffffffff130200000080ffffffd680ffffffffffffff270000000000000080ffffffffff1f0000000000ffff1ff180ffffffffffffff030200000000000080ffffffff7f060000000080fffd1ffdf0fbfffffffffffff10000000000000080ffffffff3f0000000000fedbf30ff0e3ffffffffffffff780000000000000080ffffffff1f0000000000fe43deefffc7ffffffffffff1f180000000000000080ffffffff070000000000fe40ccfdffc7ffffffffffff0f180000000000000000ffffffff010000000800fe40cefdff87ffffffffff030e180000000000000000feffffff0100000020007c7c86fdffdfffffffffff7b0c1e0000000000000000feffffff010000000000b8ff00b7feffffffffffff1fcc0f0000000000000000fcffff7f000000000000f87f0080feffffffffffff0be4070000000000000000f0ffbf3f000000000000feffc2017effffffffffff0372000000000000000000e0ffbf1f000000000000feffc70ffffcffffffffff0f30000000000000000000e0ff0f00000000000000ffffbffffffbffffffffff7f00000000000000000000c0ff0700000000000018fffffffffff3ffffffffff7f0000000000000000000080ff0300000000000098fffffffffee7ffffffffff3f0000000000000000000000fd03000000000000c0fffffffffd8ffffdffffff1f0000000000000000000000fb03000000000000e0fffffffffd8f01f87ffeff6f0000000000000000000000f207000000000000f0fffffffffbff07f83ffeff670000000000004000000000e003800000000000f0fffffffff7ff07f43ffeff200000000000000003000000e00f003c00000000e0fffffffff7ff01f01ffc07000000000000000002000000e09f017b03000000c0ffffffffe7ff01f00ff86760000000000000000000000080ff012301000060c0ffffffffcfff00f007f80f60000000000000000000000000fc0f001000000080ffffffffcf3f00f001e01f60000000000000000000000000c00f0010000080e0ffffffffff1f00f001e03f60000000000000000000000000000f0010000000c0ffffffffff0300e001403de0000000000000000000000000001c4000000000e0ffffffff7f5800e000403ec00300000000000000000000000018fc07000000c0ffffffffff1f00c0004012c00100000000000000000000000070fd07000000c0ffffffffff0f00c0004000900300000000000000000000000040ff3f00000080ffffffffff0f000002c000c00300000000000000000000000000ff3f00000000fff1ffffff0700000280010c0300000000000000000000000000feff070000000cc0ffffff03000000b8030e0000000000000000000000000000feff0700000000c0ffffff010000007003070000000000000000000000000000ffff0f0000000080ffffff0000000060820f0500000000000000000000004080ffff0f0000000080ffff3f00000000c0c0ef0d0000000000000000000000c0c0fff7070000000080ffff1f0000000080c1e7f4000000000000000000000000c0ffff470000000080ffff1f0000000080c174e51f0000000000000000000000c0ff8fff0e00000000ffff0f000000000003f6de3f1000000000000000000000c0ffffff1f00000000ffff0f000000000006a000fe1a0000000000000000000080ffffff7f00000000feff0f0000000000380000f0cd0000000000000000000080ffffff7f00000000feff0f0000000000f8bf0380010100000000000000000000ffffff7f00000000feff0f000000000000780300070600000000000000000000ffffff3f00000000feff1f0000000000002001000c0800000000000000000000feffff1f00000000feff1f04000000000000c020000000200000000000000000feffff0f00000000ffff1f0c000000000000e021000000000000000000000000feffff0f00000000ffff1f0c000000000000f660004000000000000000000000f8ffff0f00000000ffff0f0f000000000000ffe3008080000000000000000000e0ffff0f00000000ffff8307000000000080ffe7000040000000000000000000c0ffff0f00000000ffff81070000000000c0ffff010000000000000000000000c0ffff0f00000000feff80870100000000f0ffff032000000000000000000000c0ffff0700000000fcff81830000000000fcffff076000000000000000000000e0ffff0100000000fcff81030000000000feffff070000000000000000000000e0ff7f0000000000fcff80030000000000feffff0f0000000000000000000000e0ff3f0000000000fc7f00000000000000fefffb1f0000000000000000000000e0ff3f0000000000f87f00000000000000fefff11f0000000000000000000000e0ff1f0000000000f07f00000000000000fefff11f0000000000000000000000e0df1f0000000000f03f00000000000000fcfff71f0000000000000000000000e0ff070000000000f03f00000000000000fccfff1f0000000000000000000000e09f030000000000e00f00000000000000fc01ff0f0000000000000000000000f03f010000000000e003000000000000001c00fc0f0000000000000000000000f03f0000000000000000000000000000000000f4070008000000000000000000f87f0000000000000000000000000000000000f0070070000000000000000000f81f0000000000000000000000000000000000e0000078000000000000000000f807000000000000000000000000000000000000000030000000000000000000f80300000000000000000000000000000000008003001e000000000000000000f00300000000000000000000000000000000008001000f000000000000000000f80300000000000000000000000000000000000000c007000000000000000000fc0100000000000000000000000000000000000000c003000000000000000000fc01000000000000000000000000000000000000000000000000000000000000fc000000000000000000000000030000000000000000000000000000000000007c000000000000000000000000020000000000000000000000000000000000007c000000000000000000000000000000000000000000000000000000000000007800000000000000000000000000000000000000000000000000000000000000f001006000000000000000000000000000000000000000000000000000000000c001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000fc000000000000000000000000000000000000000000000000000000000000001e000000000000000000e000000080830100000000000000000000000000008017000000000000000000fe0700f8ffffffff7f00000000000000000000000080070000000000000080f0ffff83ffffffffffff3f0000000000000000000000f00f00000000000008c4ffffffffffffffffffffff0700000000000000000000fc1f00000080ffffffffffffffffffffffffffffffff03000000000000c08fc0fd1f000000c0ffffffffffffffffffffffffffffffff0100000000f46f83ffffff1f000000feffffffffffffffffffffffffffffff7f00000000feffffffffffff0f0000c0ffffffffffffffffffffffffffffffff0f000080c7ffffffffffffffff0100ffffffffffffffffffffffffffffffffff4f000080ffffffffffffffffffffc1ffffffffffffffffffffffffffffffffffdf0fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff3fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

  var COLS = 256, ROWS = 128;

  var reduzido = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var containers = (MASCARA_HEX && MASCARA_HEX.indexOf('_') !== 0)
    ? Array.prototype.slice.call(document.querySelectorAll('[data-globe]'))
    : [];
  if (!containers.length) return;

  /* ---------- máscara: hex -> bits (bit i = célula i tem terra) ---------- */
  var bits = new Uint8Array(COLS * ROWS >> 3);
  (function decodificar() {
    for (var i = 0; i < bits.length; i++) {
      bits[i] = parseInt(MASCARA_HEX.substr(i * 2, 2), 16);
    }
  })();

  function temTerra(lon, lat) {
    var col = ((lon + Math.PI) / (2 * Math.PI) * COLS) | 0;
    var row = ((Math.PI / 2 - lat) / Math.PI * ROWS) | 0;
    col = col < 0 ? 0 : (col >= COLS ? COLS - 1 : col);
    row = row < 0 ? 0 : (row >= ROWS ? ROWS - 1 : row);
    var i = row * COLS + col;
    return (bits[i >> 3] >> (i & 7)) & 1;
  }

  /* ---------- geometria: pontos da esfera (Fibonacci) ---------- */
  var N = 2600;
  var GIRAR_MAPA = -Math.PI * 0.72;  // qual hemisfério encara o espectador no início
  var pontos = [];
  var DOURADO = Math.PI * (3 - Math.sqrt(5));
  for (var i = 0; i < N; i++) {
    var y = 1 - (i / (N - 1)) * 2;          // de +1 (norte) a -1 (sul)
    var r = Math.sqrt(1 - y * y);
    var th = DOURADO * i;
    var p = { x: Math.cos(th) * r, y: y, z: Math.sin(th) * r };
    // classificação terra/oceano é fixa no globo: calculada uma vez
    var lat = Math.asin(y);
    var lon = Math.atan2(p.z, p.x) + GIRAR_MAPA;
    p.terra = temTerra(lon, lat);
    pontos.push(p);
  }

  /* ---------- câmera ---------- */
  var INCLINACAO = -0.35;    // eixo inclinado, como um planeta de verdade
  var VELOCIDADE = 0.022;    // rad/s — volta completa em ~4,8 min
  var LUZ = { x: -0.48, y: -0.4, z: 0.78 };  // normalizada, canto superior esquerdo
  var CLARO = '#f4f4f4';

  /* ---------- proporções da cena (quadrado) ----------
     raio da esfera = 0,33 do lado; órbita = elipse de 0,47 x 0,16
     girada -0,28 rad — a órbita inteira cabe na caixa, com folga. */
  var ESCALA_ESFERA = 0.33;
  var ORBITA_A = 0.47;
  var ORBITA_B = 0.16;
  var ORBITA_GIRO = -0.28;

  /* pontos da órbita, calculados uma vez em coordenadas unitárias */
  var ORBITA_PONTOS = 168;
  var orbita = [];
  for (var oi = 0; oi < ORBITA_PONTOS; oi++) {
    var a = (oi / ORBITA_PONTOS) * 6.2832;
    var ex = Math.cos(a) * ORBITA_A;
    var ey = Math.sin(a) * ORBITA_B;
    var gx = ex * Math.cos(ORBITA_GIRO) - ey * Math.sin(ORBITA_GIRO);
    var gy = ex * Math.sin(ORBITA_GIRO) + ey * Math.cos(ORBITA_GIRO);
    orbita.push({
      x: gx, y: gy,
      frente: gy > 0,             // metade de baixo passa na frente da esfera
      brilho: 0.55 + 0.45 * Math.sin(a)   // mais claro na metade da frente
    });
  }

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var segundo = 0;

  /* ---------- fábrica: um globo por contêiner [data-globe] ---------- */
  var globes = [];
  for (var gi = 0; gi < containers.length; gi++) {
    var container = containers[gi];
    var zona = document.createElement('div');
    zona.className = 'globo';
    zona.setAttribute('aria-hidden', 'true');
    var canvas = document.createElement('canvas');
    zona.appendChild(canvas);
    container.appendChild(zona);
    var ctx = canvas.getContext('2d');
    if (!ctx) { zona.remove(); continue; }
    globes.push({
      zona: zona, canvas: canvas, ctx: ctx,
      w: 0, h: 0, raio: 0, cx: 0, cy: 0, visivel: true
    });
  }
  if (!globes.length) return;

  /* não pinta globo fora da viewport */
  if ('IntersectionObserver' in window) {
    var ioVis = new IntersectionObserver(function (entradas) {
      for (var i = 0; i < entradas.length; i++) {
        for (var j = 0; j < globes.length; j++) {
          if (globes[j].zona === entradas[i].target) {
            globes[j].visivel = entradas[i].isIntersecting;
            if (reduzido && entradas[i].isIntersecting) desenhar(globes[j], segundo);
          }
        }
      }
    });
    for (var k = 0; k < globes.length; k++) ioVis.observe(globes[k].zona);
  }

  function redimensionar() {
    for (var i = 0; i < globes.length; i++) {
      var g = globes[i];
      var rect = g.zona.getBoundingClientRect();
      if (rect.width < 10 || rect.height < 10) continue;
      g.w = rect.width; g.h = rect.height;
      g.canvas.width = Math.round(g.w * dpr);
      g.canvas.height = Math.round(g.h * dpr);
      g.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.lado = Math.min(g.w, g.h);
      g.raio = g.lado * ESCALA_ESFERA;
      g.cx = g.w / 2;
      g.cy = g.h / 2;
    }
    desenharTodos();
  }

  /* ---------- órbita: mesma linguagem de pontos, escala fechada ---------- */
  function desenharOrbita(g, frente) {
    var lado = g.lado;
    for (var i = 0; i < orbita.length; i++) {
      var o = orbita[i];
      if (o.frente !== frente) continue;
      g.ctx.globalAlpha = frente ? 0.10 + 0.09 * o.brilho : 0.045 + 0.045 * o.brilho;
      g.ctx.fillStyle = CLARO;
      g.ctx.beginPath();
      g.ctx.arc(g.cx + o.x * lado, g.cy + o.y * lado,
        frente ? 1.15 : 1.0, 0, 6.2832);
      g.ctx.fill();
    }
    g.ctx.globalAlpha = 1;
  }

  function desenhar(g, t) {
    g.ctx.clearRect(0, 0, g.w, g.h);
    if (!g.raio) return;

    var cosT = Math.cos(INCLINACAO), sinT = Math.sin(INCLINACAO);
    var ang = t * VELOCIDADE;
    var cosA = Math.cos(ang), sinA = Math.sin(ang);

    desenharOrbita(g, false);   // metade de trás, oculta pela esfera

    for (var i = 0; i < N; i++) {
      var p = pontos[i];
      // rotação no eixo Y…
      var px = p.x * cosA + p.z * sinA;
      var pz = -p.x * sinA + p.z * cosA;
      // …e inclinação fixa no eixo X
      var ty = p.y * cosT - pz * sinT;
      var tz = p.y * sinT + pz * cosT;

      if (tz <= 0) continue;   // só o hemisfério da frente

      var luz = px * LUZ.x + ty * LUZ.y + tz * LUZ.z;   // -1..1
      var brilho = luz > 0 ? luz : 0;

      if (p.terra) {
        g.ctx.globalAlpha = 0.38 + 0.48 * brilho;
        g.ctx.fillStyle = CLARO;
        g.ctx.beginPath();
        g.ctx.arc(g.cx + px * g.raio, g.cy - ty * g.raio, 1.05 + 0.5 * brilho, 0, 6.2832);
        g.ctx.fill();
      } else {
        g.ctx.globalAlpha = 0.09;                      // oceano: silhueta sutil
        g.ctx.fillStyle = '#8a8a8a';
        g.ctx.beginPath();
        g.ctx.arc(g.cx + px * g.raio, g.cy - ty * g.raio, 0.85, 0, 6.2832);
        g.ctx.fill();
      }
    }

    desenharOrbita(g, true);    // metade da frente, por cima da esfera
    g.ctx.globalAlpha = 1;
  }

  function desenharTodos() {
    for (var i = 0; i < globes.length; i++) {
      if ((globes[i].visivel || reduzido) && globes[i].w >= 10) desenhar(globes[i], segundo);
    }
  }

  /* ---------- loop: 30 fps bastam e poupam bateria ---------- */
  var ultimoQuadro = 0, iniciado = false;

  function quadro(ts) {
    segundo = ts / 1000;
    if (ts - ultimoQuadro >= 33) {
      ultimoQuadro = ts;
      desenharTodos();
    }
    window.requestAnimationFrame(quadro);
  }

  function iniciar() {
    if (iniciado) return;
    iniciado = true;
    redimensionar();
    if (!reduzido) window.requestAnimationFrame(quadro);
  }

  window.addEventListener('resize', redimensionar);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
