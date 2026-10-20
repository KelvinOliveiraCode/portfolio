// Auditoria em ingles: confere se sobra portugues na tela, se todo atributo
// traduzido bate com o texto e se a meta/JSON-LD troca de verdade.
// Uso: node _fonte/_audit_en.mjs
import { createRequire } from 'module';
import { fileURLToPath, pathToFileURL } from 'url';
import fs from 'fs';
import path from 'path';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

// o playwright vive na instalacao global do npm nesta maquina
const req = createRequire('C:/Users/Kelvin/AppData/Roaming/npm/node_modules/@playwright/cli/');
const { chromium } = req('playwright');

const url = pathToFileURL(path.join(root, 'index.html')).href;

// o build do navegador instalado na maquina (1248) e' um_patch adiante do que
// o playwright global espera (1247): apontamos para o executavel direto.
const MS_PLAYWRIGHT = path.join(process.env.LOCALAPPDATA || '', 'ms-playwright');

function acharChrome() {
  // 1) build mais novo instalado (empate: o de numero maior)
  if (fs.existsSync(MS_PLAYWRIGHT)) {
    const dirs = fs.readdirSync(MS_PLAYWRIGHT)
      .filter(d => d.startsWith('chromium-'))
      .sort((a, b) => parseInt(b.replace(/\D+/g, ''), 10) - parseInt(a.replace(/\D+/g, ''), 10));
    for (const d of dirs) {
      const exe = path.join(MS_PLAYWRIGHT, d, 'chrome-win64', 'chrome.exe');
      if (fs.existsSync(exe)) return exe;
    }
  }
  // 2) chrome do sistema
  const comum = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe'
  ];
  for (const c of comum) if (fs.existsSync(c)) return c;
  return null; // deixa o playwright escolher (funciona se as versoes baterem)
}

const EXE = acharChrome();
if (EXE) console.log('# navegador: ' + EXE);

const browser = await chromium.launch(EXE ? { executablePath: EXE } : {});
const ctx = await browser.newContext({ locale: 'en-US' });
const page = await ctx.newPage();

const erros = [];
page.on('console', m => { if (m.type() === 'error') erros.push('console: ' + m.text()); });
page.on('pageerror', e => erros.push('pageerror: ' + e.message));

await page.addInitScript(() => { try { localStorage.setItem('ko-lang', 'en'); } catch (e) {} });
await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(600);

const r = await page.evaluate(() => {
  const out = { problemas: [], contagens: {}, meta: {}, ld: {} };

  const MARC = /\b(de|do|da|dos|das|com|para|por|que|nao|não|sao|são|tambem|também|voce|você|ate|até|entre|sobre|quando|onde|como|projeto|projetos|sistema|sistemas|gerador|dashboard|simulador|ferramentas|plataforma|codigo|código|mostrar|vazios|vazios|encontrado|filtro|arquivo|completo|repositorios|repositórios|publicos|públicos|descricao|descrição|buscar|busca)\b/i;

  // 1) texto visivel em portugues
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const alvos = [];
  while (walker.nextNode()) {
    const n = walker.currentNode;
    const p = n.parentElement;
    if (!p) continue;
    if (p.closest('script,style,noscript')) continue;
    if (p.closest('[data-pt],[data-en]')) continue; // verificado abaixo
    const t = (n.nodeValue || '').trim();
    if (!t) continue;
    if (MARC.test(t)) alvos.push({ tag: p.tagName, cls: p.className, txt: t.slice(0, 140) });
  }
  out.problemas.push(...alvos.map(a => `PT-texto: <${a.tag} class="${a.cls}"> ${a.txt}`));

  // 2) cada elemento com data-pt/data-en: o texto na tela tem que ser o da lingua
  const els = document.querySelectorAll('[data-pt],[data-en]');
  out.contagens.elementos = els.length;
  out.contagens.comEn = document.querySelectorAll('[data-en]').length;
  els.forEach(el => {
    const en = el.getAttribute('data-en');
    if (en === null) return;
    // quando o texto tem marcação, o i18n usa innerHTML: compara o HTML.
    const esperado = en.indexOf('<') !== -1 ? el.innerHTML.trim() : en.trim();
    const real = (en.indexOf('<') !== -1 ? el.innerHTML : el.textContent).trim();
    if (esperado !== real) {
      out.problemas.push(`TEXTO: <${el.tagName} class="${el.className}"> esperado="${esperado}" real="${real}"`);
    }
  });

  // 3) atributos: aria-label / title / placeholder / alt / content
  const ATRIBUTOS = { aria: 'aria-label', title: 'title', ph: 'placeholder', alt: 'alt', content: 'content' };
  for (const suf in ATRIBUTOS) {
    const real = ATRIBUTOS[suf];
    const sel = `[data-en-${suf}]`;
    document.querySelectorAll(sel).forEach(el => {
      const esperado = el.getAttribute('data-en-' + suf);
      const got = el.getAttribute(real);
      if (got !== esperado) out.problemas.push(`ATTR ${real}: <${el.tagName}> esperado="${esperado}" real="${got}"`);
    });
  }

  // 4) meta / title
  out.meta.title = document.title;
  out.meta.description = (document.querySelector('meta[name=description]') || {}).content;
  out.meta.ogTitle = (document.querySelector('meta[property="og:title"]') || {}).content;
  out.meta.ogDesc = (document.querySelector('meta[property="og:description"]') || {}).content;
  out.meta.ogLocale = (document.querySelector('meta[property="og:locale"]') || {}).content;
  out.meta.ogImageAlt = (document.querySelector('meta[property="og:image:alt"]') || {}).content;
  out.meta.twTitle = (document.querySelector('meta[name="twitter:title"]') || {}).content;
  out.meta.lang = document.documentElement.lang;

  // 5) JSON-LD
  const ld = document.querySelector('script[type="application/ld+json"]');
  try {
    const o = JSON.parse(ld.textContent);
    out.ld.jobTitle = o.jobTitle;
    out.ld.description = o.description;
  } catch (e) {
    out.problemas.push('JSON-LD invalido: ' + e.message);
  }

  // 6) titulos e atributos dos cards do arquivo
  const cards = document.querySelectorAll('.acard');
  out.contagens.acards = cards.length;
  cards.forEach(c => {
    const a = c.querySelector('h3 a');
    if (!a) return;
    if (a.getAttribute('title') && a.getAttribute('title') !== a.getAttribute('data-en-title')) {
      out.problemas.push(`CARD title: ${a.getAttribute('data-nome')} -> "${a.getAttribute('title')}"`);
    }
    const t = a.getAttribute('data-en');
    if (t && a.textContent.trim() !== t.trim()) out.problemas.push(`CARD texto: ${a.getAttribute('data-nome')}`);
  });

  // 7) contagens da vitrine/arquivo
  out.contagens.vitrine = (document.querySelector('#vitrine-conta') || {}).textContent;
  out.contagens.arquivo = (document.querySelector('#contagem') || {}).textContent;
  out.contagens.filtros = Array.from(document.querySelectorAll('#filtros button')).map(b => b.textContent.trim()).join(' | ');
  out.contagens.secNum = (document.querySelector('.sec-num') || {}).textContent;

  // 8) varredura ampla: todo atributo de acessibilidade em tela, procurando portugues
  //    lista curada: so palavras inequivocamente portuguesas (evita falso positivo
  //    em palavras iguais nos dois idiomas, como "dashboard", "system", "all")
  const PALAVRAS = /\b(nao|não|sao|são|tambem|também|voce|você|ate|até|repositorios|repositórios|publicos|públicos|descricao|descrição|vazios|encontrados|encontrado|exibindo|portugues|português|codigo|código|projetos|projeto|destaques|destaque|idioma|selecionar|limpar|voltar|abrir|buscar|busca|contato|mostrar|ferramentas|linguagem|inglês|ingles)\b/i;
  const ATRIB_VIS = ['aria-label', 'title', 'alt', 'placeholder', 'aria-description', 'aria-roledescription', 'aria-valuetext'];
  ATRIB_VIS.forEach(a => {
    document.querySelectorAll('[' + a + ']').forEach(el => {
      const v = el.getAttribute(a) || '';
      if (PALAVRAS.test(v)) {
        out.problemas.push(`ACESS ${a}: <${el.tagName} class="${el.className}"> "${v}"`);
      }
    });
  });

  // 9) titulos dos cards do arquivo: quando existem, tem que estar em ingles
  const cardsAll = document.querySelectorAll('.acard');
  out.contagens.cardTitles = cardsAll.length;
  let comTitle = 0;
  cardsAll.forEach(c => {
    const a = c.querySelector('h3 a');
    if (!a) { out.problemas.push('CARD sem h3 a: ' + c.getAttribute('data-nome')); return; }
    const t = (a.getAttribute('title') || '').trim();
    if (t) {
      comTitle++;
      if (PALAVRAS.test(t)) out.problemas.push(`CARD title PT: ${c.getAttribute('data-nome')} -> "${t}"`);
    }
    // o texto do h3 tem que ser o data-en
    const en = (a.getAttribute('data-en') || '').trim();
    if (!en) out.problemas.push('CARD sem data-en: ' + c.getAttribute('data-nome'));
    else if (a.textContent.trim() !== en) {
      out.problemas.push(`CARD texto divergente: ${c.getAttribute('data-nome')} "${a.textContent.trim()}" != "${en}"`);
    }
    // o title (descricao) tem que bater com o data-en-title
    const tEn = a.getAttribute('data-en-title');
    if (tEn !== null && tEn.trim() !== t) {
      out.problemas.push(`CARD title != data-en-title: ${c.getAttribute('data-nome')}`);
    }
  });
  out.contagens.cardsComTitle = comTitle;

  return out;
});

console.log('=== CONTAGENS ===');
console.log(JSON.stringify(r.contagens, null, 2));
console.log('=== META ===');
console.log(JSON.stringify(r.meta, null, 2));
console.log('=== JSON-LD ===');
console.log(JSON.stringify(r.ld, null, 2));
console.log('=== PROBLEMAS (' + r.problemas.length + ') ===');
r.problemas.slice(0, 60).forEach(p => console.log(' - ' + p));
if (erros.length) { console.log('=== ERROS JS ==='); erros.forEach(e => console.log(' - ' + e)); }

// ---------------- 404 ----------------
const url404 = pathToFileURL(path.join(root, '404.html')).href;
const p404 = await ctx.newPage();
await p404.addInitScript(() => { try { localStorage.setItem('ko-lang', 'en'); } catch (e) {} });
await p404.goto(url404, { waitUntil: 'load' });
await p404.waitForTimeout(200);
const r404 = await p404.evaluate(() => ({
  lang: document.documentElement.lang,
  title: document.title,
  desc: (document.querySelector('meta[name=description]') || {}).content,
  h1: (document.querySelector('h1') || {}).textContent,
  p: (document.querySelector('p') || {}).textContent,
  btn: (document.querySelector('.btn') || {}).textContent,
  toggle: (document.querySelector('#lang-toggle') || {}).textContent,
  toggleLabel: (document.querySelector('#lang-toggle') || {}).getAttribute ? document.querySelector('#lang-toggle').getAttribute('aria-label') : null
}));
console.log('=== 404 (EN) ===');
console.log(JSON.stringify(r404, null, 2));

// ---------------- PT: a troca de lingua nao pode quebrar nada ----------------
const ppt = await ctx.newPage();
await ppt.addInitScript(() => { try { localStorage.setItem('ko-lang', 'pt'); } catch (e) {} });
await ppt.goto(url, { waitUntil: 'load' });
await ppt.waitForTimeout(400);
const rpt = await ppt.evaluate(() => {
  const els = document.querySelectorAll('[data-pt]');
  let diff = [];
  els.forEach(el => {
    const pt = el.getAttribute('data-pt');
    const real = (pt.indexOf('<') !== -1 ? el.innerHTML : el.textContent).trim();
    if (pt.trim() !== real) diff.push(`<${el.tagName} class="${el.className}"> esperado="${pt.trim()}" real="${real}"`);
  });
  return {
    lang: document.documentElement.lang,
    title: document.title,
    elementos: els.length,
    divergentes: diff.length,
    detalhe: diff,
    vitrine: (document.querySelector('#vitrine-conta') || {}).textContent,
    arquivo: (document.querySelector('#contagem') || {}).textContent
  };
});
console.log('=== PT ===');
console.log(JSON.stringify(rpt, null, 2));

// ---------------- interacao: alternar o idioma em tela ----------------
// contexto novo, sem nenhum rastro de localStorage: e' a primeira visita
const ctx2 = await browser.newContext({ locale: 'en-US' });
const pi = await ctx2.newPage();
await pi.goto(url, { waitUntil: 'load' });
await pi.waitForTimeout(400);

const antes = await pi.evaluate(() => ({
  lang: document.documentElement.lang,
  title: document.title,
  h1: document.querySelector('h1').textContent,
  contagem: document.querySelector('#contagem').textContent,
  salvo: localStorage.getItem('ko-lang')
}));

await pi.click('#lang-toggle');
await pi.waitForTimeout(300);

const depois = await pi.evaluate(() => ({
  lang: document.documentElement.lang,
  title: document.title,
  h1: document.querySelector('h1').textContent,
  contagem: document.querySelector('#contagem').textContent,
  salvo: localStorage.getItem('ko-lang'),
  metaDesc: document.querySelector('meta[name=description]').content,
  ld: JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent).jobTitle
}));

console.log('=== TROCA DE IDIOMA (PT -> EN) ===');
console.log('antes:  ' + JSON.stringify(antes));
console.log('depois: ' + JSON.stringify(depois));

// recarrega: a preferencia tem que sobreviver
await pi.reload({ waitUntil: 'load' });
await pi.waitForTimeout(300);
const recarregado = await pi.evaluate(() => ({
  lang: document.documentElement.lang,
  title: document.title,
  salvo: localStorage.getItem('ko-lang')
}));
console.log('=== APOS RECARREGAR ===');
console.log(JSON.stringify(recarregado, null, 2));

// busca em ingles
const busca = await pi.evaluate(async () => {
  const campo = document.querySelector('#busca-proj');
  campo.value = 'dashboard';
  campo.dispatchEvent(new Event('input', { bubbles: true }));
  await new Promise(r => setTimeout(r, 200));
  const visiveis = Array.from(document.querySelectorAll('#arquivo .acard')).filter(c => !c.hidden);
  return { contagem: document.querySelector('#contagem').textContent, achou: visiveis.length, nomes: visiveis.map(c => c.getAttribute('data-nome')) };
});
console.log('=== BUSCA "dashboard" (EN) ===');
console.log(JSON.stringify(busca, null, 2));

// a busca tem que achar tambem por titulo ingles
const busca2 = await pi.evaluate(async () => {
  const campo = document.querySelector('#busca-proj');
  campo.value = 'cybersecurity';
  campo.dispatchEvent(new Event('input', { bubbles: true }));
  await new Promise(r => setTimeout(r, 200));
  const visiveis = Array.from(document.querySelectorAll('#arquivo .acard')).filter(c => !c.hidden);
  return { contagem: document.querySelector('#contagem').textContent, achou: visiveis.length };
});
console.log('=== BUSCA "cybersecurity" (EN) ===');
console.log(JSON.stringify(busca2, null, 2));

// ---------------- persistencia (contexto limpo, sem init script) ----------------
const ctx3 = await browser.newContext({ locale: 'en-US' });
const pp = await ctx3.newPage();
await pp.goto(url, { waitUntil: 'load' });
await pp.waitForTimeout(400);
const p1 = await pp.evaluate(() => ({ lang: document.documentElement.lang, salvo: localStorage.getItem('ko-lang'), title: document.title }));
await pp.click('#lang-toggle');
await pp.waitForTimeout(300);
const p2 = await pp.evaluate(() => ({ lang: document.documentElement.lang, salvo: localStorage.getItem('ko-lang'), title: document.title, h1: document.querySelector('h1').textContent }));
await pp.reload({ waitUntil: 'load' });
await pp.waitForTimeout(400);
const p3 = await pp.evaluate(() => ({ lang: document.documentElement.lang, salvo: localStorage.getItem('ko-lang'), title: document.title, h1: document.querySelector('h1').textContent }));
console.log('=== PERSISTENCIA (browser en-US) ===');
console.log('1a visita: ' + JSON.stringify(p1));
console.log('apos toggle: ' + JSON.stringify(p2));
console.log('apos reload: ' + JSON.stringify(p3));

// a 404 tem que respeitar a mesma preferencia
const p404b = await ctx3.newPage();
await p404b.goto(url404, { waitUntil: 'load' });
await p404b.waitForTimeout(200);
const r404b = await p404b.evaluate(() => ({ lang: document.documentElement.lang, h1: document.querySelector('h1').textContent, title: document.title }));
console.log('=== 404 APOS ESCOLHER EN NO INDEX ===');
console.log(JSON.stringify(r404b, null, 2));

await browser.close();
