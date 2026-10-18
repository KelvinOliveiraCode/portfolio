# portfolio

![linguagem: HTML](https://img.shields.io/badge/linguagem-HTML-blue)   ![status: concluido](https://img.shields.io/badge/status-concluido-green)   ![licenca: MIT](https://img.shields.io/badge/licenca-MIT-blue)

## Resumo

Pagina ou site estatico em HTML, CSS e JavaScript puro, sem dependencias de build. Portfólio, Kelvin Oliveira

## Problema / por que existe

O projeto entrega uma solucao web leve, hospedavel em qualquer servidor estatico (incluindo GitHub Pages), sem exigir servidor de aplicacao, banco de dados ou processo de build.

## Arquitetura

- `index.html`: ponto de entrada e estrutura da pagina.
- CSS: estilo e layout (modo claro/escuro quando aplicavel).
- JavaScript: interatividade e logica do lado do cliente.

Tudo vive em um ou poucos arquivos, facil de auditar linha por linha.

## Tecnologias

- HTML5
- CSS3
- JavaScript (vanilla)

## O que faz

Portfólio, Kelvin Oliveira

## Como rodar

Abra o arquivo `index.html` diretamente no navegador, ou sirva localmente:

```
python -m http.server 8080
# acesse http://localhost:8080
```

## Estrutura do projeto

- assets/ (13 arquivo(s))
- _fonte/ (7 arquivo(s))
- .github/ (1 arquivo(s))
- 404.html, index.html, README.en.md, README.md, sitemap.xml


## Trade-offs e decisões

- Um unico arquivo (ou poucos): facil de hospedar em qualquer lugar e de auditar.
- Sem build, sem servidor, sem banco de dados.
- Dados em snapshot (quando aplicavel), nao em tempo real.

## Limitações conhecidas

- Sem backend; funcionalidade limitada ao navegador.
- Dados estaticos ou em snapshot; confirme valores em fontes oficiais.

## Testes

Nenhum teste automatizado detectado.

## Licença

Distribuído sob a licenca MIT. Consulte o arquivo `LICENSE` do repositorio.

## Autor

Kelvin Oliveira, https://github.com/KelvinOliveiraCode
Portfolio: https://kelvinoliveiracode.github.io/portfolio/
