/* Engraving interactions — slow reveal, breathing gold word, cursor ring. */

(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- scroll reveal: section heads, panels, timeline ---- */
  var revealables = [].slice.call(document.querySelectorAll('section > .sec-head, .bcard, .pcard, .acard, .about-grid > div, .timeline .item, .hero-facts .fact'));

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

  /* ---- project filters + "mostrar mais" ---- */
  var filterBox = document.querySelector('.filters');
  if (filterBox) {
    var fbtns = [].slice.call(filterBox.querySelectorAll('button[data-filter]'));
    var fcards = [].slice.call(document.querySelectorAll('.pcard'));
    var moreBox = document.querySelector('.proj-more');
    var moreBtn = document.getElementById('proj-more-btn');
    var INITIAL = 6;
    var expanded = false;
    var current = 'all';

    /* rotulos PT/EN do botao: o texto base fica no HTML, o JS recalcula a contagem */
    var LABELS = { pt: { more: 'Mostrar mais', less: 'Mostrar menos' }, en: { more: 'Show more', less: 'Show less' } };

    function dict() {
      try { return localStorage.getItem('k-port-lang') === 'en' ? LABELS.en : LABELS.pt; }
      catch (e) { return LABELS.pt; }
    }

    /* aplica a categoria + o limite de 6 (limite so vale no filtro "Todos") */
    function render() {
      var visible = 0, hiddenCount = 0;
      var limited = current === 'all' && !expanded;
      fcards.forEach(function (c) {
        var cats = (c.getAttribute('data-cat') || '').split(/\s+/);
        var match = current === 'all' || cats.indexOf(current) !== -1;
        var collapsed = limited && visible >= INITIAL;
        c.hidden = !match;
        c.classList.toggle('collapsed', match && collapsed);
        if (match) {
          if (collapsed) { hiddenCount++; }
          else {
            visible++;
            /* cards que estavam com display:none nunca dispararam o
               IntersectionObserver do reveal: sem isto ficariam invisiveis */
            if (c.classList.contains('rv')) {
              c.classList.add('in');
              c.style.transitionDelay = '0s';
            }
          }
        }
      });

      if (!moreBox || !moreBtn) return;
      /* o botao so aparece no filtro "Todos" (nos demais, todos os cards
         da categoria ja cabem). Expandido, hiddenCount = 0, mas o botao
         precisa continuar visivel com o texto "Mostrar menos". */
      if (current !== 'all' || (!expanded && hiddenCount === 0)) {
        moreBox.hidden = true;
        return;
      }
      moreBox.hidden = false;
      var L = dict();
      moreBtn.textContent = expanded
        ? L.less
        : L.more + ' (' + hiddenCount + ')';
    }

    filterBox.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('button[data-filter]') : null;
      if (!b) return;
      fbtns.forEach(function (x) {
        var on = x === b;
        x.classList.toggle('active', on);
        x.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      current = b.getAttribute('data-filter');
      expanded = false;
      render();
    });

    if (moreBtn) {
      moreBtn.addEventListener('click', function () {
        expanded = !expanded;
        render();
        if (!expanded) {
          var sec = document.getElementById('projetos');
          if (sec) {
            var y = sec.getBoundingClientRect().top + window.pageYOffset - 70;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }
      });
    }

    render();

    /* o toggle de idioma reescreve o botao: mantem a contagem e o rotulo.
       O evento e disparado em window pelo lang.js, entao o listener fica
       em window: um evento nao desce de window para document. */
    window.addEventListener('k-port-lang', render);
    window.addEventListener('storage', function (e) { if (e.key === 'k-port-lang') render(); });
  }

  /* ---- gold word in h1: slow celestial breathing ---- */
  if (!reduce) {
    var gold = document.querySelector('h1 .gold');
    if (gold) gold.classList.add('breathe-gold');
  }
})();
