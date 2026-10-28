# portfolio-kelvin-v2

Portfólio multipágina de Kelvin Oliveira — HTML/CSS/JS puros, sem build, PT/EN.

Direção visual, em quatro linhas:
- Preto absoluto e branco, sem acento cromático; sans de sistema em toda a interface.
- Um único motivo decorativo: o planeta de Terra em pontos (canvas 2D) com órbita fechada, no hero de todas as páginas — nada sangra pela borda e nada cresce sem limite.
- Cada número do site rastreia uma fonte (`data/repos.json`, certificados com link de verificação); dado sem origem não entra.
- Movimento curto e opcional (respeita `prefers-reduced-motion`); contraste mínimo 4,5:1 em todo texto.

## Páginas

| Rota | O que é |
|------|---------|
| `/` | Home: capa com planeta, resumo, números e explorador em árvore do GitHub |
| `/projetos/` | Arquivo completo dos repositórios, com filtro por área e busca |
| `/projetos/<slug>/` | 11 casos de estudo (gerados por `scripts/gen-case-pages.mjs`) |
| `/sobre/` | Trajetória e competências por camada |
| `/certificados/` | 4 certificados DIO com link de verificação |
| `/404.html` | Página de erro autônoma, no mesmo visual do site |

## Dados

- `data/repos.json` — snapshot dos repositórios públicos, atualizado no deploy por `scripts/sync-repos.mjs` (GitHub API; em falha, mantém o snapshot commitado).
- `data/destaques.json` — textos curados dos casos; `scripts/gen-case-pages.mjs` gera as páginas a partir deles. Rerodar o gerador após editar.
- `data/areas.json`, `data/live-pages.json`, `data/i18n.json` — áreas, páginas no ar, rótulos de interface.

## Deploy

GitHub Actions (`.github/workflows/deploy.yml`) → GitHub Pages sob `/portfolio/`. O pipeline sincroniza `repos.json`, regenera as páginas de caso e publica.

## Desenvolvimento local

```bash
python scripts/servidor_local.py
# http://localhost:8791 (Cache-Control: no-store, sem cache velho de CSS/JS)
```

Ou, sem o script:

```bash
python -m http.server 8080
# abra http://localhost:8080/index.html
```
