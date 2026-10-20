// confere cobertura: todo projeto com descricao PT precisa ter a versao EN
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(path.join(root, 'assets/projetos.js'), 'utf8');
const m = src.match(/window\.PORTFOLIO\s*=\s*(\{[\s\S]*?\});\s*$/m) || src.match(/window\.PORTFOLIO\s*=\s*(\{[\s\S]*?\});/);
const obj = JSON.parse(m[1]);
const lista = obj.projetos || obj.lista || obj;

let comPT = 0, comEN = 0;
const falta = [];
for (const p of lista) {
  if (p.d) {
    comPT++;
    if (p.de) comEN++;
    else falta.push(`${p.n} :: ${p.d}`);
  }
  // titulo em ingles tem que existir e ser diferente do slug cru
  if (!p.te || p.te === p.n) falta.push(`TITULO ${p.n}`);
}
console.log(`total ${lista.length} | com descricao PT ${comPT} | com descricao EN ${comEN}`);
console.log(`FALTANDO (${falta.length}):`);
falta.forEach(x => console.log(' - ' + x));

// PT e EN nao podem ser o mesmo texto
const iguais = lista.filter(p => p.d && p.de && p.d === p.de).map(p => `${p.n}\n     PT: ${p.d}\n     EN: ${p.de}`);
console.log(`IGUAIS (${iguais.length}):`);
iguais.forEach(x => console.log(' - ' + x));
