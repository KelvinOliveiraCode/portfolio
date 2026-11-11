import pw from 'file:///C:/Users/Kelvin/AppData/Roaming/npm/node_modules/@playwright/test/index.js';
const { chromium } = pw;
import { mkdirSync } from 'node:fs';

const Alvos = [
  { slug: 'kodaros',   url: 'https://kelvinoliveiracode.github.io/kodaros-landing/' },
  { slug: 'garimpo',   url: 'https://garimpo-oficial.vercel.app/' },
  { slug: 'cloud4all', url: 'https://kelvinoliveiracode.github.io/cloud4all/' },
];
const OUT = 'C:/Users/Kelvin/Desktop/GitHub/portfolio/assets/projetos';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome' });
const erros = [];
for (const alvo of Alvos) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: 'pt-BR' });
  const page = await ctx.newPage();
  try {
    await page.goto(alvo.url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(2500);
    // hero: topo da pagina
    await page.screenshot({ path: OUT + '/' + alvo.slug + '-hero.jpg', type: 'jpeg', quality: 86, clip: { x: 0, y: 0, width: 1440, height: 900 } });
    // mid: scroll para uma secao mais abaixo
    await page.evaluate(() => window.scrollTo(0, Math.round(window.innerHeight * 1.15)));
    await page.waitForTimeout(1400);
    await page.screenshot({ path: OUT + '/' + alvo.slug + '-secao.jpg', type: 'jpeg', quality: 86 });
    // full page compacto (referencia)
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);
    await page.screenshot({ path: OUT + '/' + alvo.slug + '-full.jpg', type: 'jpeg', quality: 70, fullPage: true });
    console.log('OK ' + alvo.slug + ' title=' + (await page.title()));
  } catch (e) {
    erros.push(alvo.slug + ': ' + e.message.split('\n')[0]);
    console.log('FALHOU ' + alvo.slug + ': ' + e.message.split('\n')[0]);
  }
  await ctx.close();
}
await browser.close();
console.log('ERROS=' + JSON.stringify(erros));
