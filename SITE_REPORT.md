# SITE_REPORT.md — Segunda onda da reescrita de copy (branch `docs/site-copy-rewrite`)

Zona alterada: `index.html`, `sobre/index.html`, `projetos/index.html`, `certificados/index.html`, `404.html`.
Zonas intocadas: `data/`, `js/`, `projetos/*/index.html`, `destaques.json`, CSS e logicas.
Cada trecho trocou PT e EN juntos (data-pt/data-en / data-*-content), sem tocar ids/classes.

## Tabela de mudanças

| Arquivo | Trecho anterior | Trecho novo |
|---|---|---|
| index.html (head) | `<title>` "Kelvin Oliveira — Software, dados & IA, web e cibersegurança" | "Kelvin Oliveira — Engenheiro de Sistemas de IA" (EN: "AI Systems Engineer") |
| index.html (meta description) | "Portfólio de Kelvin Oliveira: um arquivo de 103 repositórios..." | Frase oficial integral: "Engenheiro de Sistemas de IA — Workflows Agênticos e Arquitetura Multiagente aplicados à criação e ao desenvolvimento de softwares, sites, sistemas, infraestrutura, cibersegurança, dados, backend e redes." |
| index.html (og:title, twitter:title) | descritivo antigo | Rótulo curto: "Kelvin Oliveira — Engenheiro de Sistemas de IA" (EN "AI Systems Engineer") |
| index.html (JSON-LD, 3x) | jobTitle "Desenvolvedor de Software"/"Software Developer", description antiga | jobTitle "Engenheiro de Sistemas de IA"/"AI Systems Engineer", description = frase oficial; knowsAbout ganhou "AI Systems Engineering", "Agentic Workflows", "Multi-Agent Architecture" |
| index.html (hero eyebrow) | "Software · Dados & IA · Web · Cibersegurança · Infraestrutura" | Rótulo curto: "Engenheiro de Sistemas de IA" (EN "AI Systems Engineer") |
| index.html (hero subtítulo, ~L87) | "Curso Ciência da Computação no IFPA. Escrevo Python, Java..." | Frase oficial integral + "Cursando Ciência da Computação no IFPA. Construo cada projeto orquestrando agentes de IA que implementam em Python, Java, TypeScript e Rust, e levo cada um até o fim." |
| index.html (h2 §01) | "Programo os dois lados da mesma pilha." | "Construo os dois lados da mesma pilha." |
| index.html (§01 parágrafo, ~L109) | "...Fora da aula, escrevo Python..." | "...Construo cada projeto orquestrando agentes de IA que implementam em Python, Java, TypeScript e Rust, e levo cada um até o fim — do pipeline de dados à API em Spring Boot..." |
| index.html (h2 §02) | "Um arquivo do trabalho inteiro, não uma vitrine." | "O trabalho inteiro, repositório por repositório." |
| index.html (§04 parágrafo, ~L190) | "Sozinho, do começo ao fim: desenho, escrevo, documento... laudo antes de comemorar o número" | "Projeto individual: desenhei a solução, orquestrei os agentes que a implementaram, revisei e mantenho o código. No portfólio, isso significa testar quando o risco pede, publicar o deploy direto do meu repositório, sem plataforma no meio, e manter a documentação em português e inglês em dia antes de medir cada resultado." |
| index.html (contato) | "oportunidades em dados, backend, cibersegurança e TI" | "oportunidades em IA e agentes, dados, backend, cibersegurança e TI" (IA em primeiro, alinhado ao posicionamento) |
| sobre/index.html (meta description) | "A trajetória de Kelvin Oliveira..." | Frase oficial integral (PT/EN) |
| sobre/index.html (hero subtítulo, ~L67) | "Curso Ciência da Computação no IFPA e Análise... Fora da aula, escrevo..." | Frase oficial integral + "Cursando Ciência da Computação no IFPA e Análise e Desenvolvimento de Sistemas na Uniasselvi. Construo cada projeto orquestrando agentes de IA que implementam em Python, Java, TypeScript e Rust, e levo cada um até o fim." |
| sobre/index.html (trajetória, ~L88) | mesmo parágrafo "Sozinho, do começo ao fim: desenho, escrevo..." | Mesmo texto "Projeto individual: desenhei a solução, orquestrei os agentes..." usado na home |
| sobre/index.html (competências) | 9 células: Linguagens; Dados & ML; Backend; Web & Produto; Cibersegurança; Redes & Infraestrutura; DevOps & Sistema; Idiomas; Documentação | 8 células na ordem do posicionamento: 01 IA e agentes (novo: Agentes de IA, Workflows agênticos, Arquitetura multiagente, RAG, Spring AI, Prompt engineering, GitHub Copilot, Claude Code & GPT Agents) · 02 Software e backend · 03 Web e produto · 04 Dados & ML · 05 Cibersegurança · 06 Redes e infraestrutura · 07 Cloud (Terraform, IaC, FinOps, VPC 3 camadas, Docker, GitHub Actions, Linux) · 08 Produto e negócio (Análise de negócio, Dashboards, KPIs & SLA, Helpdesk, Windows Server, Active Directory) |
| sobre/index.html (contato) | idem home | idem home |
| projetos/index.html (meta description) | "Arquivo completo dos 103 repositórios..." | Frase oficial integral (PT/EN) |
| projetos/index.html (contato) | idem | idem |
| certificados/index.html (meta description) | "Quatro bootcamps corporativos da DIO..." | Frase oficial integral (PT/EN) |
| certificados/index.html (contato) | idem | idem |
| 404.html (meta description) | "A página que você procurou não existe..." | Frase oficial integral (PT/EN) |

## Verificação de competências contra repositórios (data/repos.json)

- Terraform/IaC/FinOps **mantidos**: sustentados por `iac-terraform-github-actions`, `infra-as-code-lab`, `finops-dashboard`, `finops-alerta-orcamento`.
- Agentes/IA: `dio-lab-bia-do-futuro` (BIA), `agente-suporte-bancario-rag` (RAG), `prompt-analise-feedbacks-bancarios-dio`, bootcamps Riachuelo/Santander/CI&T.
- Windows Server / Active Directory mantidos: `reset-senha-ad-automacao`, `workstation-onboarding`, `inventario-ativos-ti`.
- Removedos da grade: `ffmpeg`, `Node.js` (sem repo claro que sustente), células "Idiomas", "Documentação" e itens "README bilíngue / Laudo técnico / ADRs / Diagramas / JSON-LD / SEO técnico" (a reorganização definiu exatamente 8 grupos).

## Grep final (critério 8)

`grep -rniE "escrev|à mão|by hand|Curso Ciência" index.html sobre/ projetos/index.html certificados/ 404.html` → **vazio** (0 ocorrências). Nenhuma citação histórica desses padrões permanece nas páginas-alvo. Referência legítima do TF-IDF no `projetos/*/` (fora do escopo) não aparece nas cinco páginas editadas.

---

# Terceira onda — branch `docs/site-copy-wave-3`

Escopo: fechar a dívida da onda 1 (páginas de caso), corrigir números que envelheceram, separar o papel do autor dos bootcamps e tirar do ar um link morto.

Zona alterada: `index.html`, `sobre/index.html`, `projetos/index.html`, `certificados/index.html`, `data/destaques.json`, `data/i18n.json`, `data/live-pages.json`, `scripts/gen-case-pages.mjs` e as 11 páginas de caso regeneradas por ele.
Zonas intocadas: CSS, `js/`, `data/repos.json` (dados crus da API do GitHub) e a lógica de layout.

## Mudanças

| Arquivo | Antes | Depois |
|---|---|---|
| `index.html` (og/twitter description) | resumo parcial | frase oficial completa, PT e EN |
| `index.html` (§números) | "103 repositórios" sem data; "13 páginas" sem método | "103 repositórios" com nota "contagem de 01/11/2026"; "13 páginas, cada URL testada com HTTP 200 em 01/11/2026" |
| `index.html` (§06) | "Meu papel" diluído entre os bootcamps | §06 "Meu papel" separada; nova §07 "Bootcamps" com os 4 bootcamps da DIO e o projeto entregue em cada um |
| `index.html` (rodapé) | "GitHub de Kelvin" | "Meu GitHub" (primeira pessoa consistente) |
| `sobre/`, `projetos/`, `certificados/` (head) | descriptions antigas | frase oficial; `projetos` com title "Projetos — Kelvin Oliveira, Engenheiro de Sistemas de IA" |
| `data/destaques.json` | "à mão"/"by hand", "laudo" | "do zero"/"próprio", "relatório" |
| `data/i18n.json` | "laudo por CWE" | "relatório por CWE" |
| `data/live-pages.json` | `verifiedAt` desatualizado | `2026-11-01`, 13 páginas verificadas (inclui chopp-gourmet, esquematicoedu, kodaros-mostruario, techcards) |
| `scripts/gen-case-pages.mjs` | contato sem "IA e agentes"; descrição do repo copiada crua | contato atualizado; `ajustarDescricao()` normaliza "escrito à mão"→"implementado do zero" e "laudo"→"relatório" na descrição vinda do GitHub |
| `projetos/*/index.html` (11) | "laudo por CWE", "TF-IDF à mão", "construído à mão" | regeneradas, sem os termos banidos |
| Todas as 16 páginas HTML | link `web.dio.me/users/kelvinrebelosw` (HTTP 404) e no `sameAs` do JSON-LD | link removido; perfil DIO virou pergunta em `SITE_NEEDS_INPUT.md` |

## Verificação executada nesta onda

- `node scripts/gen-case-pages.mjs` → exit 0, 11 páginas.
- Validação de `data/*.json` e dos blocos JSON-LD (PT e EN) → todos parseiam.
- Crawl das 16 páginas HTML: 236 links internos, **0 quebrados**; 41 URLs externas, **1 não-200** (`linkedin.com/in/kelvin-oliveira-code/` responde 999 para requisições automáticas — bloqueio anti-bot, esperado; aberto manualmente responde normal).
- Grep de termos banidos → restam apenas as 3 descrições cruas em `data/repos.json` (texto da API do GitHub, não é copy do autor — ver `SITE_NEEDS_INPUT.md` item 8) e a própria regra de substituição no script.

## Segunda passada da onda 3 (mesma branch)

Pedido do dono: tirar travessão do texto (sinal de IA) e parar de listar linguagens fixas.

| Antes | Depois |
|---|---|
| travessão `—` em títulos, rótulos de seção, rodapé e prosa (483 ocorrências, 106 strings únicas) | `·` em títulos e numeração de seção (`01 · Quem sou`), `:` em rótulo e valor (`LinkedIn: kelvin-oliveira-code`), `Caso de estudo · Dados & IA`), e prosa reescrita com ponto, vírgula, dois-pontos ou parênteses. **Zero travessão** em todas as 16 páginas HTML e em `data/destaques.json` e `data/i18n.json` |
| "…que implementam na tecnologia que o projeto pedir — Python, Java, TypeScript, Rust, JavaScript, HTML, PowerShell ou planilhas — e levo cada um até o fim." | "…que implementam na stack que o projeto pedir, seja linguagem, framework ou outra ferramenta, e levo cada um até o fim." (EN: "in whatever stack the project calls for, whether a language, a framework or another tool, and I take each one all the way.") |
| frase oficial de posicionamento com travessão após o cargo | dois-pontos: "Engenheiro de Sistemas de IA: Workflows Agênticos…" (as palavras não mudaram) |
| descrições de repositório vinham cruas do GitHub | `ajustarDescricao()` em `scripts/gen-case-pages.mjs` normaliza travessão (`Nome: descrição`); `js/arquivo.js` e `js/tree.js` ganharam `semTravessao()` para o explorador e a árvore, que renderizam descrição em tempo de execução |

`data/repos.json` segue como espelho fiel da API do GitHub (58 travessões). Nada disso chega ao leitor: a normalização acontece na geração das páginas de caso e na renderização do explorador.

- `js/tree.js`: o separador de linguagem no nó da árvore (`versus`) passou de `—` para `·`, igual ao separador de tamanho ao lado. Era o único travessão que ainda chegava à tela.
- `README.md` e `README.en.md`: separador do parágrafo de abertura trocado por dois-pontos. Comentários de `js/*.js` e `css/*.css` mantêm o travessão (não são copy). `SITE_REPORT.md` e `SITE_NEEDS_INPUT.md` mantêm quando citam o próprio caractere.
