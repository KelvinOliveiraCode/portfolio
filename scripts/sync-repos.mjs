// scripts/sync-repos.mjs — roda no GitHub Actions (Node 20).
// Gera data/repos.json direto da API do GitHub. Se a API falhar, mantém
// o snapshot commitado e sai 0 — o deploy nunca quebra por limite de taxa.
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(ROOT, "data", "repos.json");
const USER = "KelvinOliveiraCode";
const TOKEN = process.env.GITHUB_TOKEN || "";

async function main() {
  const headers = { Accept: "application/vnd.github+json" };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;

  const repos = [];
  for (let page = 1; page <= 10; page++) {
    const url = `https://api.github.com/users/${USER}/repos?per_page=100&page=${page}`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`GitHub API ${res.status} (rate limit: ${res.headers.get("x-ratelimit-remaining")})`);
    const rows = await res.json();
    if (!rows.length) break;
    repos.push(...rows);
  }

  const data = {
    fetchedAt: new Date().toISOString().slice(0, 10),
    source: `https://api.github.com/users/${USER}/repos`,
    total: repos.filter(r => !r.fork).length,
    repos: repos.filter(r => !r.fork)
      .map(r => ({
        name: r.name,
        description: r.description,
        language: r.language,
        homepage: r.homepage || null,
        topics: r.topics || [],
        created: r.created_at,
        pushed: r.pushed_at,
        sizeKb: r.size,
        live: !!r.homepage
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  };

  await writeFile(OUT, JSON.stringify(data, null, 1) + "\n");
  console.log(`data/repos.json atualizado: ${data.total} repositorios (${data.fetchedAt})`);
}

main().catch(err => {
  console.error(`sync-repos falhou, mantendo snapshot commitado: ${err.message}`);
  process.exit(0); // snapshot já commitado cobre o deploy
});
