/* gen-case-pages.mjs — gera as 11 páginas de caso de estudo em
   projetos/<slug>/index.html a partir dos dados curados:
     data/destaques.json  → textos do caso (título, o-que, entregas, métricas)
     data/repos.json      → linguagem, tamanho medido, descrição real
     data/areas.json      → área do repo
     data/i18n.json       → rótulos de interface PT/EN
   O HTML gerado é estático e commitado; nada aqui adivinha dado.
   Uso: node scripts/gen-case-pages.mjs                        */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const ler = (arq) => JSON.parse(readFileSync(join(RAIZ, 'data', arq), 'utf8'));

const destaques = ler('destaques.json');
const envelope = ler('repos.json');
const repos = envelope.repos || [];
const areas = ler('areas.json');
const dicto = ler('i18n.json');

const CANON = 'https://kelvinoliveiracode.github.io/portfolio';

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
function formatoKb(kb) {
  kb = Number(kb) || 0;
  return kb >= 1024 ? (kb / 1024).toFixed(1) + ' MB' : kb + ' KB';
}
/* o lead “Abstração: …” vira uma frase limpa na página de caso */
function semAbstracao(s, lang) {
  return String(s || '').replace(/^(?:Abstração|The abstraction):\s*/, '');
}
function repoDo(nome) {
  return repos.find((r) => r.name === nome) || null;
}
function areaDo(nome) {
  return Object.prototype.hasOwnProperty.call(areas, nome) ? areas[nome] : null;
}
function attrPtEn(pt, en) {
  return ` data-pt="${esc(pt)}" data-en="${esc(en)}"`;
}

const NAV_ICO_GITHUB = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 .5C5.7.5.5 5.6.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.6-3.9-1.6-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0C17.3 4.7 18.3 5 18.3 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.6 18.3.5 12 .5z"/></svg>';
const NAV_ICO_LINKEDIN = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" focusable="false"><path d="M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.9-3-1.9 0-2.2 1.4-2.2 2.9v5.7H9.2V9h3.4v1.6c.5-.9 1.7-1.9 3.5-1.9 3.7 0 4.4 2.4 4.4 5.6v6.1zM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM7.1 20.4H3.5V9h3.6v11.4z"/></svg>';

function rodape(prefix) {
  return `
<footer class="rodape">
  <div class="rodape-blurb">
    <p data-pt="© 2026 Kelvin Rebelo de Oliveira" data-en="© 2026 Kelvin Rebelo de Oliveira">© 2026 Kelvin Rebelo de Oliveira</p>
  </div>
  <div>
    <h3 data-pt="Páginas" data-en="Pages">Páginas</h3>
    <ul>
      <li><a href="${prefix}index.html" data-pt="Início" data-en="Home">Início</a></li>
      <li><a href="${prefix}sobre/" data-pt="Sobre" data-en="About">Sobre</a></li>
      <li><a href="${prefix}projetos/" data-pt="Projetos" data-en="Projects">Projetos</a></li>
      <li><a href="${prefix}certificados/" data-pt="Certificados" data-en="Certificates">Certificados</a></li>
    </ul>
  </div>
  <div>
    <h3 data-pt="Contato" data-en="Contact">Contato</h3>
    <ul>
      <li><a href="https://www.linkedin.com/in/kelvin-oliveira-code/" target="_blank" rel="noopener">LinkedIn — kelvin-oliveira-code</a></li>
      <li><a href="mailto:kelvinrebelosw@gmail.com">kelvinrebelosw@gmail.com</a></li>
      <li><a href="https://wa.me/5591986134599" target="_blank" rel="noopener">(91) 98613-4599</a></li>
      <li><a href="https://github.com/KelvinOliveiraCode" target="_blank" rel="noopener">GitHub — KelvinOliveiraCode</a></li>
      <li><a href="https://web.dio.me/users/kelvinrebelosw" target="_blank" rel="noopener">DIO — kelvinrebelosw</a></li>
    </ul>
  </div>
</footer>`;
}

function nav(prefix) {
  return `
<nav class="nav-bar" aria-label="Navegação principal" data-pt-aria="Navegação principal" data-en-aria="Main navigation">
  <ul class="nav-links">
    <li><a href="${prefix}index.html" data-pt="Início" data-en="Home">Início</a></li>
    <li><a href="${prefix}sobre/" data-pt="Sobre" data-en="About">Sobre</a></li>
    <li><a href="${prefix}projetos/" aria-current="page" data-pt="Projetos" data-en="Projects">Projetos</a></li>
    <li><a href="${prefix}certificados/" data-pt="Certificados" data-en="Certificates">Certificados</a></li>
  </ul>
  <div class="nav-end">
    <a class="ico" href="https://github.com/KelvinOliveiraCode" target="_blank" rel="noopener" aria-label="GitHub de Kelvin Oliveira" data-pt-aria="GitHub de Kelvin Oliveira" data-en-aria="Kelvin Oliveira's GitHub">${NAV_ICO_GITHUB}</a>
    <a class="ico" href="https://www.linkedin.com/in/kelvin-oliveira-code/" target="_blank" rel="noopener" aria-label="LinkedIn de Kelvin Oliveira" data-pt-aria="LinkedIn de Kelvin Oliveira" data-en-aria="Kelvin Oliveira's LinkedIn">${NAV_ICO_LINKEDIN}</a>
    <button id="lang-toggle" class="lang-btn" type="button" aria-live="polite">EN</button>
  </div>
</nav>`;
}

function convite() {
  return `
<section class="convite" id="contato">
  <span class="rotulo" data-pt="Contato" data-en="Contact">Contato</span>
  <h2 data-pt="Vamos conversar sobre o seu problema." data-en="Let's talk about your problem.">Vamos conversar sobre o seu problema.</h2>
  <p data-pt="Tenho interesse em oportunidades em dados, backend, cibersegurança e TI. Se o seu time precisa de alguém que já colocou projeto no ar e mantém tudo rodando, me chame." data-en="I'm interested in opportunities in data, backend, cybersecurity and IT. If your team needs someone who has already put projects live and keeps them running, get in touch.">Tenho interesse em oportunidades em dados, backend, cibersegurança e TI. Se o seu time precisa de alguém que já colocou projeto no ar e mantém tudo rodando, me chame.</p>
  <div class="acoes">
    <a class="btn-solido" href="https://www.linkedin.com/in/kelvin-oliveira-code/" target="_blank" rel="noopener" data-pt="LinkedIn ↗" data-en="LinkedIn ↗">LinkedIn ↗</a>
    <a class="btn-linha" href="mailto:kelvinrebelosw@gmail.com">kelvinrebelosw@gmail.com</a>
    <a class="btn-linha" href="https://wa.me/5591986134599" target="_blank" rel="noopener">WhatsApp</a>
    <a class="btn-linha" href="https://github.com/KelvinOliveiraCode" target="_blank" rel="noopener">GitHub</a>
  </div>
</section>`;
}

function gerarCaso(slug, anterior, proximo) {
  const t = destaques.textos[slug];
  if (!t) throw new Error('destaques.json não tem textos para ' + slug);
  const repo = repoDo(slug);
  const area = areaDo(slug);
  const areaChave = Array.isArray(area) ? (area[0] || null) : area;
  const areaNome = {
    pt: areaChave ? (dicto.pt.areasNomes[areaChave] || areaChave) : 'Projeto',
    en: areaChave ? (dicto.en.areasNomes[areaChave] || areaChave) : 'Project'
  };

  const titulo = { pt: t.titulo.pt, en: t.titulo.en };
  const lead = { pt: semAbstracao(t.oQue.pt, 'pt'), en: semAbstracao(t.oQue.en, 'en') };
  const lang = repo && repo.language ? repo.language : null;
  const tamanho = repo ? formatoKb(repo.sizeKb) : null;
  const ano = repo && repo.created ? repo.created.slice(0, 4) : null;
  const urlRepo = 'https://github.com/KelvinOliveiraCode/' + slug;

  const descMeta = {
    pt: lead.pt + (ano ? ` (${ano})` : ''),
    en: lead.en + (ano ? ` (${ano})` : '')
  };

  const badge = t.badge
    ? `<span class="badge-case"${attrPtEn(t.badge.pt, t.badge.en)}>${esc(t.badge.pt)}</span>`
    : '';

  const metaHero = [
    lang ? `<span>${esc(lang)}</span>` : null,
    tamanho ? `<span>${esc(tamanho)}</span>` : null,
    ano ? `<span>${ano}</span>` : null,
    `<a href="${urlRepo}" target="_blank" rel="noopener">GitHub ↗</a>`
  ].filter(Boolean).join('<span aria-hidden="true">·</span>');

  const numeros = (t.metricasExtras || []).length
    ? `<div class="numeros">
      ${(t.metricasExtras).map((m) => `
        <div class="numero">
          <b class="suave">${esc(m.v)}</b>
          <span${attrPtEn(m.pt, m.en)}>${esc(m.pt)}</span>
        </div>`).join('')}
    </div>`
    : '';

  const etapas = (t.entregas || []).map((e) => `
      <li><p${attrPtEn(e.pt, e.en)}>${esc(e.pt)}</p></li>`).join('');

  const stackChips = (t.stack || []).map((s) => `<span>${esc(s)}</span>`).join('');
  const papel = dicto.pt.caso.papel;
  const papelEn = dicto.en.caso.papel;

  const descRepo = repo && repo.description
    ? {
      pt: String(repo.description).split(' | ')[0],
      en: String(repo.description).includes(' | ') ? String(repo.description).split(' | ')[1] : String(repo.description)
    }
    : { pt: 'Repositório no GitHub.', en: 'Repository on GitHub.' };

  const linkAnterior = anterior
    ? `<a class="lado" href="../${anterior.slug}/">
        <small data-pt="anterior" data-en="previous">anterior</small>
        <span${attrPtEn(anterior.t.titulo.pt, anterior.t.titulo.en)}>${esc(anterior.t.titulo.pt)}</span>
      </a>`
    : '<span></span>';
  const linkProximo = proximo
    ? `<a class="lado fim" href="../${proximo.slug}/">
        <small data-pt="próximo" data-en="next">próximo</small>
        <span${attrPtEn(proximo.t.titulo.pt, proximo.t.titulo.en)}>${esc(proximo.t.titulo.pt)}</span>
      </a>`
    : '<span></span>';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title data-pt-content="${esc(titulo.pt)} — Kelvin Oliveira" data-en-content="${esc(titulo.en)} — Kelvin Oliveira">${esc(titulo.pt)} — Kelvin Oliveira</title>
<meta name="description" content="${esc(descMeta.pt)}"
      data-pt-content="${esc(descMeta.pt)}"
      data-en-content="${esc(descMeta.en)}">
<meta name="author" content="Kelvin Rebelo de Oliveira">
<meta name="theme-color" content="#000000">
<meta name="color-scheme" content="dark">
<link rel="canonical" href="${CANON}/projetos/${slug}/">
<link rel="icon" type="image/png" sizes="32x32" href="../../assets/favicon.png">
<link rel="apple-touch-icon" href="../../assets/favicon-180.png">

<meta property="og:type" content="article">
<meta property="og:title" content="${esc(titulo.pt)}" data-pt-content="${esc(titulo.pt)}" data-en-content="${esc(titulo.en)}">
<meta property="og:description" content="${esc(descMeta.pt)}" data-pt-content="${esc(descMeta.pt)}" data-en-content="${esc(descMeta.en)}">
<meta property="og:url" content="${CANON}/projetos/${slug}/">
<meta property="og:image" content="${CANON}/assets/gravura-poster.jpg">
<meta property="og:image:width" content="1920">
<meta property="og:image:height" content="1080">
<meta property="og:locale" content="pt_BR" data-pt-content="pt_BR" data-en-content="en_US">
<meta property="og:locale:alternate" content="en_US" data-pt-content="en_US" data-en-content="pt_BR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${CANON}/assets/gravura-poster.jpg">
<meta name="twitter:title" content="${esc(titulo.pt)}" data-pt-content="${esc(titulo.pt)}" data-en-content="${esc(titulo.en)}">
<meta name="twitter:description" content="${esc(descMeta.pt)}" data-pt-content="${esc(descMeta.pt)}" data-en-content="${esc(descMeta.en)}">

<link rel="stylesheet" href="../../css/tokens.css">
<link rel="stylesheet" href="../../css/site.css">
<link rel="stylesheet" href="../../css/paginas.css">
</head>
<body data-prefix="../../" data-case="${slug}">

<a class="skip" href="#inicio" data-pt="Pular para o conteúdo" data-en="Skip to content">Pular para o conteúdo</a>

<div id="faixa-destaques" class="topo-strip" aria-label="Destaques" data-pt-aria="Destaques" data-en-aria="Featured work"></div>

<div class="grao" aria-hidden="true"></div>

${nav('../../')}

<main id="inicio">

  <header class="hero">
    <div class="hero-texto">
      <span class="rotulo eyebrow" data-pt="Caso de estudo — ${esc(areaNome.pt)}" data-en="Case study — ${esc(areaNome.en)}">Caso de estudo — ${esc(areaNome.pt)}</span>${badge ? ' ' + badge : ''}
      <h1${attrPtEn(titulo.pt, titulo.en)}>${esc(titulo.pt)}</h1>
      <p class="linha-lead"${attrPtEn(lead.pt, lead.en)}>${esc(lead.pt)}</p>
      <p class="linha-meta">${metaHero}</p>
    </div>
    <div class="hero-cena" data-globe aria-hidden="true"></div>
  </header>
${numeros ? `
  <section class="secao" id="metricas">
    <div class="wrap-interno">
      <div class="secao-cab">
        <span class="num">01 — <span data-pt="Números" data-en="Numbers">Números</span></span>
        <h2 data-pt="O que os dados mostram." data-en="What the data shows.">O que os dados mostram.</h2>

      </div>
${numeros}
    </div>
  </section>
`: ''}

  <section class="secao" id="entregas">
    <div class="wrap-interno">
      <div class="secao-cab">
        <span class="num">${numeros ? '02' : '01'} — <span data-pt="O que foi entregue" data-en="What was delivered">O que foi entregue</span></span>
        <h2 data-pt="Entregas nomeadas." data-en="Deliverables, named.">Entregas nomeadas.</h2>

      </div>
      <ul class="etapas">${etapas}
      </ul>
    </div>
  </section>

  <section class="secao" id="stack-papel">
    <div class="wrap-interno">
      <div class="secao-cab">
        <span class="num">${numeros ? '03' : '02'} — <span data-pt="Stack & papel" data-en="Stack & role">Stack &amp; papel</span></span>
        <h2 data-pt="Com o que foi feito." data-en="What it was built with.">Com o que foi feito.</h2>

      </div>
      <div class="pilha" style="margin-top:var(--s-4);">${stackChips}</div>
      <div class="prosa" style="margin-top:var(--s-5);">
        <p${attrPtEn(papel, papelEn)}>${esc(papel)}</p>
      </div>
    </div>
  </section>

  <section class="secao" id="explorador">
    <div class="wrap-interno">
      <div class="secao-cab">
        <span class="num">${numeros ? '04' : '03'} — <span data-pt="No repositório" data-en="In the repository">No repositório</span></span>
        <h2 data-pt="O código por trás do caso." data-en="The code behind the case.">O código por trás do caso.</h2>
        <p class="medida" data-pt="O explorador abaixo abre o GitHub inteiro — este caso está pré-selecionado." data-en="The explorer below opens the whole GitHub — this case is pre-selected.">O explorador abaixo abre o GitHub inteiro — este caso está pré-selecionado.</p>

      </div>
      <div class="arvore-zona">
        <ul id="arvore"></ul>
        <aside id="arvore-painel" class="arvore-painel" aria-live="polite">
          <h3 class="t">${esc(slug)}</h3>
          <p class="tamanho-fila">${lang ? esc(lang) + ' · ' : ''}${tamanho ? esc(tamanho) : ''}</p>
          <div class="o-que-faz">
            <p${attrPtEn(descRepo.pt, descRepo.en)}>${esc(descRepo.pt)}</p>
          </div>
          <div class="pilha" hidden>${stackChips}</div>
          <div class="links"><a href="${urlRepo}" target="_blank" rel="noopener" data-pt="abrir no GitHub ↗" data-en="open on GitHub ↗">abrir no GitHub ↗</a></div>
        </aside>
      </div>
    </div>
  </section>

  <nav class="prev-next" aria-label="Casos anterior e próximo" data-pt-aria="Casos anterior e próximo" data-en-aria="Previous and next case">
${linkAnterior}
${linkProximo}
  </nav>

${convite()}

</main>
${rodape('../../')}

<script src="../../js/planeta.js" defer></script>
<script src="../../js/efeitos.js" defer></script>
<script src="../../js/i18n.js"></script>
<script src="../../js/strip.js"></script>
<script src="../../js/tree.js"></script>
</body>
</html>
`;
}

const ordem = destaques.order || [];
let feitos = 0;
for (let i = 0; i < ordem.length; i++) {
  const slug = ordem[i];
  const anterior = i > 0 ? { slug: ordem[i - 1], t: destaques.textos[ordem[i - 1]] } : null;
  const proximo = i < ordem.length - 1 ? { slug: ordem[i + 1], t: destaques.textos[ordem[i + 1]] } : null;
  const html = gerarCaso(slug, anterior, proximo);
  const pasta = join(RAIZ, 'projetos', slug);
  mkdirSync(pasta, { recursive: true });
  writeFileSync(join(pasta, 'index.html'), html, 'utf8');
  feitos++;
  console.log('ok', slug);
}
console.log('total:', feitos, 'páginas de caso');
