/* Engraving interactions — slow reveal, breathing gold word, cursor ring. */

(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- scroll reveal: section heads, panels, timeline ---- */
  var revealables = [].slice.call(document.querySelectorAll('section > .sec-head, .bcard, .pcard, .about-grid > div, .timeline .item, .hero-facts .fact'));

  if (reduce || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
          /* o delay do stagger travava o hover depois: limpa após o reveal */
          (function (el) {
            var wait = parseFloat(el.style.transitionDelay || '0') * 1000 + 1750;
            setTimeout(function () { el.style.transitionDelay = '0s'; }, wait);
          })(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });

    revealables.forEach(function (el, i) {
      el.classList.add('rv');
      el.style.transitionDelay = (i % 3) * 0.14 + 's';
      io.observe(el);
    });
  }

  /* ---- cursor ring disabled (prevents vertical size jump) ---- */
  // cursor ring code disabled to avoid layout shift on mousemove

  // 3D tilt effect disabled

  /* ---- plate: ASCII engraving video loops behind the page ---- */
  var plateVideo = document.querySelector('#plate video');
  if (plateVideo) {
    if (reduce) {
      plateVideo.removeAttribute('autoplay');
      plateVideo.pause();
    } else {
      /* iOS exige a propriedade muted, não só o atributo */
      plateVideo.muted = true;
      var tentaPlay = function () {
        var p = plateVideo.play();
        if (p && p.catch) p.catch(function () { /* autoplay bloqueado; cai no gesto abaixo */ });
      };
      tentaPlay();
      /* modo baixo consumo (iOS) / economia de dados (Android) bloqueiam autoplay:
         toca no primeiro toque ou scroll */
      var gesto = function () {
        tentaPlay();
        document.removeEventListener('touchstart', gesto);
        document.removeEventListener('scroll', gesto);
      };
      document.addEventListener('touchstart', gesto, { passive: true });
      document.addEventListener('scroll', gesto, { passive: true });
    }
  }

  /* ---- project filters: Todos/Python/Java/Excel/React ---- */
  var filterBox = document.querySelector('.filters');
  if (filterBox) {
    var fbtns = [].slice.call(filterBox.querySelectorAll('button[data-filter]'));
    var fcards = [].slice.call(document.querySelectorAll('.pcard'));
    filterBox.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('button[data-filter]') : null;
      if (!b) return;
      var f = b.getAttribute('data-filter');
      fbtns.forEach(function (x) {
        var on = x === b;
        x.classList.toggle('active', on);
        x.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      fcards.forEach(function (c) {
        if (f === 'all') { c.hidden = false; return; }
        var cats = (c.getAttribute('data-cat') || '').split(/\s+/);
        c.hidden = cats.indexOf(f) === -1;
      });
    });
  }

  /* ---- gold word in h1: slow celestial breathing ---- */
  if (!reduce) {
    var gold = document.querySelector('h1 .gold');
    if (gold) gold.classList.add('breathe-gold');
  }
})();
