# Como os dados e os cards são gerados

Esta pasta é a **oficina**: os dados brutos e os dois scripts que produzem o que está no site.
O site publicado não depende de nada daqui — `index.html` + `assets/` bastam.

```
_fonte/
├── _raw.json            retrato da API do GitHub no dia do download (100 repositórios)
├── _curadoria.json      texto curado em PT/EN dos 23 destaques + descrição das marcas
├── _acentos.json        acentuação e siglas corrigidas para os títulos em português
├── _titulos_en.json     tradução à mão dos títulos (slug nasce em português)
├── _desc_en.json        tradução à mão das descrições dos repositórios
├── _gen.ps1             _raw.json + _curadoria.json  ->  assets/projetos.js
├── _cards.ps1           assets/projetos.js  ->  cards injetados no index.html
├── _check_en.mjs        cobertura de descrições: todo PT tem o par em EN
└── _audit_en.mjs        auditoria no navegador: idioma, metadados, acessibilidade
```

## Rodar

Com PowerShell (os scripts descobrem a raiz sozinhos, na raiz do repositório ou dentro de `_fonte/`):

```powershell
# 1. gera assets/projetos.js
powershell -File _fonte/_gen.ps1

# 2. injeta os cards de vitrine e arquivo no index.html
powershell -File _fonte/_cards.ps1

# 3. confere a cobertura de descricoes em ingles
node _fonte/_check_en.mjs

# 4. audita a pagina em ingles num navegador de verdade
node _fonte/_audit_en.mjs
```

O `_audit_en.mjs` abre o `index.html` e o `404.html` no Chromium, força o modo
inglês e confere: texto visível sem português sobrando, `data-pt`/`data-en`
batendo com o que está na tela, atributos de acessibilidade (`aria-label`,
`title`, `alt`, `placeholder`) nos dois idiomas, `title`/`meta`/Open Graph/Twitter,
JSON-LD, contadores, busca e a persistência da escolha em `localStorage`
(`ko-lang`). Ele procura o Chromium instalado em `ms-playwright` e, se não achar,
usa o Chrome ou o Edge do sistema.

Os dois textos que sobram em português na versão inglesa são nomes próprios: a
instituição (Instituto Federal do Pará) e a linha de copyright do rodapé.

`_cards.ps1` é **idempotente**: ele restaura os marcadores `<!--#VITRINE#-->` e `<!--#ARQUIVO#-->`
antes de reinjetar, então pode rodar quantas vezes quiser sem sujar o HTML. O script também é quem
gera a linha de contagem e o botão "mostrar mais" de cada lista, sempre **depois** dos cartões.

`_raw.json` é um retrato, não uma fonte viva. Para atualizar de verdade, baixe de novo a API
(`https://api.github.com/users/KelvinOliveiraCode/repos?per_page=100`) e substitua o arquivo antes
de rodar `_gen.ps1`.

O retrato que está aqui já saiu sem os repositórios que não devem aparecer no site, e o mesmo vale
para a curadoria. Se você baixar a API de novo, crie `_fonte/_fora.local.txt` antes de rodar
`_gen.ps1`: é uma lista de slugs, um por linha (`#` comenta), e o que estiver nela fica fora da
vitrine, do arquivo e das contagens. Esse arquivo é local — não vai para o repositório publicado.

## Regras dos dados (nenhum texto foi inventado)

- **nome, linguagem, ano e URL**: valores reais da API;
- **selo "no ar"**: só depois de confirmar HTTP 200. As 5 que responderam 404 — `olaria`,
  `slidestage`, `finvibe-ai`, `opencode-browser-chat`, `livro-financeiro` — ficaram sem selo;
- **descrição**: usa o texto real do GitHub quando existe e diz algo (49 dos 100). Quando o campo é
  só `"Projeto funcional - <nome-do-repo>"`, o card não mostra descrição e o `title` do link fica vazio;
- **descrição em inglês**: vem de `_desc_en.json` (texto escrito à mão), ou do trecho depois do
  ` | ` na descrição do GitHub, ou da própria descrição quando ela já foi escrita em inglês;
- **títulos**: derivados do nome do repositório, com acento e sigla corrigidos à mão nos dois JSON;
- **23 destaques**: texto curado em PT e EN, escrito a partir do README e da descrição reais de cada
  repositório.

Os únicos textos em português na versão inglesa são nomes próprios: a instituição (Instituto Federal
do Pará) e a linha de copyright do rodapé.

## Verificação feita antes de publicar

- 100 repositórios, 11 páginas no ar, 23 destaques e 4 certificados conferidos um por um;
- 160 elementos de revelação acendem ao rolar, na ordem, sem deixar seção invisível;
- contadores chegam aos valores finais e, se o navegador não animar, o número real já está no HTML;
- filtro por área (6 áreas), busca sem acento e estado vazio funcionando;
- troca PT/EN em 552 elementos, com zero divergência entre o texto na tela e o atributo
  (`_audit_en.mjs` roda isso no navegador, nos dois idiomas);
- em inglês: `title`, `description`, Open Graph, Twitter e JSON-LD todos trocam junto, o `lang` do
  documento vira `en`, e a busca acha por título em inglês ("cybersecurity" → 17 projetos);
- a escolha persiste entre `index.html` e `404.html` pela chave `ko-lang` do `localStorage`;
- barra de progresso, seção ativa e botão de voltar ao topo reagindo ao scroll;
- **lotes medidos em navegador de verdade** (375×812, 768×1024 e 1440×900): vitrine 6 → 12 → 23 e
  arquivo 12 → 24; filtro "dados" mostra 20 de 20; busca "inadimplencia" acha 1 projeto; busca sem
  resultado mostra o estado vazio; filtro e busca voltam sempre ao primeiro lote;
- **zero rolagem horizontal** nas três larguras, em 14 alturas de página testadas — medido elemento
  por elemento, porque o `body` tem `overflow-x:hidden` e o `scrollWidth` sozinho não acusaria corte;
- **no celular a navegação virou trilha rolável** sob a marca e todo alvo de toque tem 44px ou mais;
- zero erro de JavaScript, zero tag não fechada e `JSON-LD` válido.
