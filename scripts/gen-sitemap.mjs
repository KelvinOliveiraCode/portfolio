/* scripts/gen-sitemap.mjs · regenera sitemap.xml a partir das paginas
   HTML commitadas. Roda no deploy junto com sync-repos e gen-case-pages,
   entao o lastmod acompanha o build e nenhuma pagina nova fica de fora. */
import { readFileSync, writeFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const CANON = 'https://kelvinoliveiracode.github.io/portfolio';

// ordem de curadoria: home primeiro, depois as paginas raiz, depois os casos
const PAGINAS = [
  ['index.html', '1.0', 'weekly'],
  ['projetos/index.html', '0.9', 'weekly'],
  ['sobre/index.html', '0.8', 'monthly'],
  ['certificados/index.html', '0.8', 'monthly'],
];

function casos() {
  const base = join(RAIZ, 'projetos');
  return readdirSync(base, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(base, d.name, 'index.html')))
    .map((d) => 'projetos/' + d.name + '/index.html')
    .sort();
}

const TODAS = [...PAGINAS, ...casos().map((c) => [c, '0.6', 'monthly'])];
const hoje = new Date().toISOString().slice(0, 10);

const urls = TODAS.map(([rel, prio, freq]) => {
  const loc = rel === 'index.html' ? CANON + '/' : CANON + '/' + rel.replace('index.html', '');
  return '  <url><loc>' + loc + '</loc><lastmod>' + hoje + '</lastmod><changefreq>' + freq + '</changefreq><priority>' + prio + '</priority></url>';
}).join('\n');

const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + '\n</urlset>\n';

writeFileSync(join(RAIZ, 'sitemap.xml'), xml);
console.log('sitemap.xml: ' + TODAS.length + ' URLs geradas');
