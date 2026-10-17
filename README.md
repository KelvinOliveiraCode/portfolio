# Portfólio — Kelvin Oliveira

![linguagem: HTML](https://img.shields.io/badge/linguagem-HTML-blue)
![status: concluido](https://img.shields.io/badge/status-concluido-green)
![licenca: MIT](https://img.shields.io/badge/licenca-MIT-blue)

Portfólio pessoal de uma página, bilíngue português/inglês, sem framework e sem passo de build. Reúne 97 repositórios públicos, nove com página publicada, quatro certificados de bootcamp e formas de contato.

## Problema / Por que existe

O site existe para reunir, em um único lugar que possa ser aberto e mostrado, o trabalho publicado — projetos com página ao vivo, o arquivo dos 97 repositórios públicos, certificados de bootcamp com link de verificação e canais de contato. Tudo sem depender de plataforma intermediária — o repositório é a fonte e o deploy sai direto dele.

## O que faz

- Apresenta o perfil em seis seções — Sobre, Competências, Projetos, Certificados, Áreas e Contato.
- Mostra uma vitrine de nove projetos com página publicada, com descrição, stack e links para o site e o código.
- Lista o arquivo completo dos 97 repositórios públicos com filtro por seis áreas, busca por nome (sem depender de acento), carregamento em lotes e estado vazio quando nada corresponde.
- Exibe quatro certificados DIO (Bradesco, Riachuelo, Santander e CI&T) com links diretos para verificação.
- Alterna entre português e inglês em 567 elementos da página, com a escolha salva no localStorage.
- Anima contadores (100+ repositórios, 12 páginas ao vivo, 4 bootcamps, 169 horas de formação) e revela elementos ao rolar, com fallback por scroll caso o navegador não suporte IntersectionObserver.

## Stack

- HTML5, CSS3 e JavaScript sem dependências externas
- Fonte Cormorant Garamond (Google Fonts)
- Ícones em SVG embutidos no HTML
- Metadados em JSON-LD (Pessoa), Open Graph e sitemap.xml
- Os dados dos projetos são gerados com dois scripts PowerShell (`_gen.ps1`, `_cards.ps1`) a partir de quatro arquivos JSON em `_fonte/`
- Publicado com GitHub Actions e GitHub Pages a cada push no branch `main` (`.github/workflows/deploy.yml`)

## Como funciona

A página é um único arquivo `index.html` com âncoras por seção. Não há build nem servidor; abre direto no navegador.

- Os 21 destaques da vitrine aparecem de seis em seis; o botão “Mostrar mais” revela o restante e some quando a lista acaba.
- O arquivo mostra os 97 repositórios de `assets/projetos.js`, gerado a partir de um retrato da API do GitHub. Filtra por área (Dados & IA, Backend, Web & Produto, Cibersegurança, Redes & Infra, TI & Suporte) e busca por nome com normalização sem acento. Filtro e busca sempre voltam ao primeiro lote.
- O idioma é trocado por `i18n.js`, que lê os atributos `data-pt` / `data-en`; o padrão é português, inglês quando o navegador não é PT, e a escolha persiste em `localStorage`.
- A revelação usa IntersectionObserver com varredura de segurança por scroll, de modo que nenhuma seção fica invisível. O vídeo de fundo carrega com `requestIdleCallback` e é removido em economia de dados ou movimento reduzido; o cartaz CSS fica no lugar do vídeo. Barra de progresso, seção ativa na navegação e botão voltar ao topo usam o scroll com throttle por tempo. No celular, alvos de toque têm 44px ou mais.
- Os números dos contadores já estão escritos no HTML; a animação é enfeite, não fonte do dado.
- Os selos “no ar” foram conferidos um por um por HTTP 200. Cinco repositórios devolveram 404 na verificação (`olaria`, `slidestage`, `finvibe-ai`, `opencode-browser-chat`, `livro-financeiro`) e ficaram sem selo.

## Como rodar

Abra `index.html` no navegador. Não há dependências, build nem servidor.

Para regenerar os dados dos projetos (por exemplo, atualizar o retrato da API do GitHub), rode os scripts do `_fonte/` com PowerShell, na raiz do repositório ou dentro de `_fonte/`.

```powershell
# 1. gera assets/projetos.js a partir de _raw.json e _curadoria.json
powershell -File _fonte/_gen.ps1

# 2. injeta os cards de vitrine e arquivo no index.html
powershell -File _fonte/_cards.ps1
```

`_cards.ps1` é idempotente — restaura os marcadores `<!--#VITRINE#-->` e `<!--#ARQUIVO#-->` antes de reinjetar, então pode rodar quantas vezes for necessário sem sujar o HTML.

`_raw.json` é um retrato estático da API (`https://api.github.com/users/KelvinOliveiraCode/repos?per_page=100`), não uma fonte ao vivo. Para atualizar de verdade, baixe o arquivo novamente, substitua `_raw.json` e rode `_gen.ps1`.

## Estrutura do projeto

```
portfolio-kelvin/
├── index.html              site publicado — página única, bilíngue PT/EN
├── 404.html                página de erro do GitHub Pages
├── sitemap.xml             URL canônico do site
├── README.md               este arquivo
├── assets/
│   ├── site.css            estilos
│   ├── site.js             interações — revelação, contadores, filtros, busca
│   ├── i18n.js             troca português/inglês
│   ├── projetos.js         dados dos 97 repositórios (gerado por _fonte/_gen.ps1)
│   ├── cert-bradesco.jpg, cert-cit.jpg, cert-riachuelo.jpg, cert-santander.jpg
│   ├── favicon.png, favicon-180.png
│   ├── gravura-poster.jpg, gravura.webm, gravura-lite.mp4
├── _fonte/                 oficina de dados (o site publicado não depende disso)
│   ├── _raw.json           retrato da API do GitHub (97 repositórios)
│   ├── _curadoria.json     textos curados dos 21 destaques (PT/EN)
│   ├── _acentos.json       correções de acento e sigla nos títulos PT
│   ├── _titulos_en.json    traduções à mão dos títulos
│   ├── _gen.ps1            _raw.json + _curadoria.json -> assets/projetos.js
│   └── _cards.ps1          assets/projetos.js -> cards injetados no index.html
└── .github/
    └── workflows/
        └── deploy.yml      publicação no GitHub Pages a cada push em main
```

## Trade-offs e decisões

- Sem framework e sem build, o site sobe direto do repositório via GitHub Actions. Ganha-se ausência de dependências; perde-se a praticidade de editar o arquivo à mão, já que o índice dos projetos é gerado por script.
- Vídeo de fundo só carrega quando vale a pena (`requestIdleCallback`, desativado em economia de dados e movimento reduzido); o cartaz em CSS substitui o vídeo quando não carrega.
- Animação de contador é decoração — o número final já está no HTML, então nada some se o navegador não animar.
- Filtro e busca do arquivo sempre voltam ao primeiro lote; o botão “Mostrar mais” some quando não há mais itens.
- O idioma fica em `localStorage`; o padrão é português.
- Os dados dos projetos são um retrato da API, baixado à mão; atualizar exige rebaixar o JSON e rodar os scripts de `_fonte/`.

## Limitações conhecidas

- Os projetos não são ao vivo — refletem o retrato em `_raw.json`. Repositórios criados depois da sessão não aparecem sem regenerar `assets/projetos.js`.
- Cinco repositórios devolveram HTTP 404 na verificação de página ao vivo (`olaria`, `slidestage`, `finvibe-ai`, `opencode-browser-chat`, `livro-financeiro`) e ficaram sem o selo “no ar”.
- O site é de página única — não há páginas individuais por projeto; cada item aponta para o GitHub ou para a página publicada quando existe.
- Não há testes automatizados para o site (HTML/CSS/JavaScript).
- A versão desktop do app de estudos (Java 21 + JavaFX + SQLite) é voltada a Windows (zip com JRE 21 embutido via `jpackage`); o comando de desenvolvimento pressupõe uma instalação local do Maven.

## Licença

MIT

## Autor

Kelvin Rebelo de Oliveira — github.com/KelvinOliveiraCode — kelvinrebelosw@gmail.com — Ananindeua, Pará
