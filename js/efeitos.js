/* efeitos.js — revelação suave no scroll.
   Cada seção que ainda está abaixo da dobra ganha .revela nos filhos
   diretos (com stagger de 70 ms) e um IntersectionObserver solta .visto
   no contêiner quando ela entra na tela. O que já está na dobra na
   carga entra sem efeito — nada de piscar conteúdo visível.
   Na home o hero é uma camada fixa por cima do conteúdo: o fade de
   opacity ao rolar é um requisito de LAYOUT (não decoração), por isso
   roda antes do early-return de prefers-reduced-motion. */
(function () {
  'use strict';

  /* hero fixo da home: o opacity acompanha o scroll (0 → 40% da altura
     da viewport) e o conteúdo só é liberado (body.hero-saiu) quando o
     texto inicial está totalmente invisível — sem sobreposição */
  if (document.body.getAttribute('data-prefix') === '') {
    var hero = document.querySelector('.hero');
    if (hero) {
      document.body.classList.add('hero-espera');
      var fadeHero = function () {
        var limite = window.innerHeight * 0.4;
        var p = Math.min(1, window.scrollY / limite);
        hero.style.opacity = String(1 - p);
        hero.style.pointerEvents = p >= 1 ? 'none' : '';
        document.body.classList.toggle('hero-saiu', p >= 1);
      };
      fadeHero();
      window.addEventListener('scroll', fadeHero, { passive: true });
    }
  }

  var mql = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if ((mql && mql.matches) || !('IntersectionObserver' in window)) return;

  var SELETORES = '.secao, .bloco-id, .convite, .prev-next, .rodape';
  var containers = document.querySelectorAll(SELETORES);
  var dobra = window.innerHeight;

  var io = new IntersectionObserver(function (entradas) {
    for (var i = 0; i < entradas.length; i++) {
      if (entradas[i].isIntersecting) {
        entradas[i].target.classList.add('visto');
        io.unobserve(entradas[i].target);
      }
    }
  }, { threshold: 0.06, rootMargin: '0px 0px -6% 0px' });

  for (var i = 0; i < containers.length; i++) {
    var sec = containers[i];
    if (sec.getBoundingClientRect().top < dobra * 0.92) continue;

    var filhos = sec.children;
    var n = Math.min(filhos.length, 8);
    for (var j = 0; j < n; j++) {
      filhos[j].classList.add('revela');
      filhos[j].style.setProperty('--atraso', (j * 70) + 'ms');
    }
    io.observe(sec);
  }
})();
