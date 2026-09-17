/* PT/EN toggle — dicionário + persistência. Textos PT espelham o HTML. */

(function () {
  'use strict';
  var I18N = {
    pt: {
      navBoot: 'Bootcamps',
      navProj: 'Projetos',
      navAbout: 'Sobre',
      eyebrow: 'Dados · Inteligência Artificial · Software',
      heroTitle: 'Construo ferramentas que transformam<br>dados em <span class="gold">decisão</span>.',
      heroSub: 'Estudante de Ciência da Computação (IFPA) construindo pipelines de dados, modelos de machine learning e agentes de IA. Quatro bootcamps corporativos com etapa seletiva — Santander, Bradesco, Riachuelo e CI&T — concluídos em 2026, na DIO.',
      btnProj: 'Ver projetos ↓',
      factBoot: 'bootcamps com seleção',
      factProj: 'projetos publicados',
      factGrad: 'graduações em curso',
      factLang: 'linguagem principal',
      factEngB: 'Inglês',
      factEng: 'intermediário–avançado',
      secBoot: 'Bootcamps com seleção',
      secBootNum: '01 — FORMAÇÃO APLICADA',
      secProj: 'Projetos',
      secProjNum: '02 — CONSTRUÍDO',
      secAbout: 'Sobre',
      secAboutNum: '03 — TRAJETÓRIA',
      fAll: 'Todos',
      fLabel: 'Filtrar projetos',
      b1m: '52 horas · concluído em 18/07/2026',
      b1d: 'IA generativa, análise de dados (Excel, SQL, Power Query, Python) e cibersegurança aplicada ao setor financeiro. Projeto final: BIA, agente financeiro com validação anti-alucinação.',
      b2m: '35 horas · concluído em 20/07/2026',
      b2d: 'Do MVP ao produto: agentes de IA, SaaS com IA generativa, automação de workflows com n8n e vibe coding. Projeto final: ATS Resume Builder, gerador de currículos com deploy online.',
      b3m: '29 horas · concluído em 23/08/2026',
      b3d: 'Excel 365 e Power Query com IA no fluxo de trabalho: Copilot para consultas SQL e ETL, Claude Code e GPT Agents gerando relatórios. Quatro desafios práticos entregues.',
      b4m: '53 horas · concluído em 11/09/2026',
      b4d: 'Java moderno com Spring Boot e GitHub Copilot: 27 cursos, 2 desafios de projeto e 2 de código. Projetos: API REST com padrões GoF e assistente financeiro por voz com Spring AI.',
      p1t: 'Detecção de fraude em cartão de crédito',
      p1d: 'Pipeline completo de ML sobre dataset público de 284.807 transações (0,17% fraudes): tratamento de desbalanceamento, comparação de modelos, otimização de hiperparâmetros e serialização do modelo final.',
      p2t: 'ATS Resume Builder',
      p2d: 'Gerador de currículos compatível com sistemas ATS: coluna única, pré-visualização em tempo real, exportação PDF A4 e interface bilíngue PT/EN. Projeto final do bootcamp Riachuelo, com deploy online.',
      p3t: 'BIA — Banco Inteligente Assistente',
      p3d: 'Assistente financeiro proativo que analisa histórico de transações, recomenda investimentos por perfil de risco e valida as próprias respostas em 4 camadas anti-alucinação. Projeto final do bootcamp Bradesco.',
      p4t: 'FinVibe AI',
      p4d: 'Dashboard de finanças pessoais: score financeiro, controle de orçamento por categoria, metas com projeção e assistente conversacional que responde perguntas sobre os dados do usuário.',
      p5t: 'Dashboard de vendas — Xbox Game Pass',
      p5d: 'Modelagem de negócio em planilha: simula a operação do Game Pass (planos, regiões, add-ons, ciclos de faturamento) com agregações automáticas e 6 gráficos executivos recalculados por parâmetro. Desafio Santander.',
      p6t: 'Simulador de investimentos em FIIs',
      p6d: 'Simulador de carteira de fundos imobiliários com alocação por perfil de risco, fórmulas financeiras e manutenção da planilha automatizada por script Python. Desafio Santander.',
      p7t: 'KodaPay — API de pagamentos',
      p7d: 'API REST de pagamentos com 6 padrões GoF (Chain, Strategy, Observer, Builder, Factory, Singleton), 26 testes e CI verde. Desafio de projeto do bootcamp CI&amp;T.',
      p8t: 'KodaBudget — finanças por voz',
      p8d: 'Assistente financeiro que ouve, entende e responde por voz: transcrição local com Whisper, tool calling com Spring AI e resposta falada. Desafio de projeto do bootcamp CI&amp;T.',
      a1: '<strong>De onde venho.</strong> Em 2026 fundei o ecossistema KODAROS — hoje 4 sites de tecnologia e educação publicados e em produção — e lancei o Garimpo, site de curadoria de ofertas com catálogo de 32 produtos. No mesmo período, passei na etapa seletiva de quatro bootcamps corporativos da DIO e a cada um saí com um projeto publicado.',
      a2: '<strong>O que faço.</strong> Pipelines de dados e modelos de ML em Python (pandas, scikit-learn), análise e dashboards em Excel/Power Query com IA no fluxo de trabalho (Copilot, Claude Code, GPT Agents), e interfaces em React/TypeScript para colocar essas análises na mão do usuário.',
      a3: '<strong>Para onde vou.</strong> Busco estágio em análise ou engenharia de dados, onde a teoria de Ciência da Computação encontra problemas reais.',
      t1: 'Ciência da Computação — IFPA',
      t2: 'Garimpo — curadoria de ofertas',
      t3: 'KODAROS — ecossistema de 4 sites',
      t4: 'Bootcamps DIO — Santander · Bradesco · Riachuelo · CI&amp;T',
      t5: 'Análise e Desenvolvimento de Sistemas — UNIASSELVI',
      metaDesc: 'Portfólio de Kelvin Oliveira: projetos de dados e IA em Python, Excel e React. 4 bootcamps com seleção (Santander, Bradesco, Riachuelo, CI&T).'
    },
    en: {
      navBoot: 'Bootcamps',
      navProj: 'Projects',
      navAbout: 'About',
      eyebrow: 'Data · Artificial Intelligence · Software',
      heroTitle: 'I build tools that turn<br>data into <span class="gold">decisions</span>.',
      heroSub: 'Computer Science student (IFPA) building data pipelines, machine learning models and AI agents. Four corporate bootcamps with a selection stage — Santander, Bradesco, Riachuelo and CI&T — completed in 2026 at DIO.',
      btnProj: 'View projects ↓',
      factBoot: 'selective bootcamps',
      factProj: 'published projects',
      factGrad: 'degrees in progress',
      factLang: 'main language',
      factEngB: 'English',
      factEng: 'intermediate–advanced',
      secBoot: 'Selective bootcamps',
      secBootNum: '01 — APPLIED TRAINING',
      secProj: 'Projects',
      secProjNum: '02 — BUILT',
      secAbout: 'About',
      secAboutNum: '03 — JOURNEY',
      fAll: 'All',
      fLabel: 'Filter projects',
      b1m: '52 hours · completed 18/07/2026',
      b1d: 'Generative AI, data analysis (Excel, SQL, Power Query, Python) and cybersecurity applied to finance. Final project: BIA, a finance agent with anti-hallucination validation.',
      b2m: '35 hours · completed 20/07/2026',
      b2d: 'From MVP to product: AI agents, SaaS with generative AI, n8n workflow automation and vibe coding. Final project: ATS Resume Builder, an online resume generator.',
      b3m: '29 hours · completed 23/08/2026',
      b3d: 'Excel 365 and Power Query with AI in the workflow: Copilot for SQL queries and ETL, Claude Code and GPT Agents generating reports. Four hands-on challenges delivered.',
      b4m: '53 hours · completed 11/09/2026',
      b4d: 'Modern Java with Spring Boot and GitHub Copilot: 27 courses, 2 project challenges and 2 code challenges. Projects: REST API with GoF patterns and a voice finance assistant with Spring AI.',
      p1t: 'Credit card fraud detection',
      p1d: 'End-to-end ML pipeline over a public dataset of 284,807 transactions (0.17% fraud): imbalance handling, model comparison, hyperparameter tuning and final model serialization.',
      p2t: 'ATS Resume Builder',
      p2d: 'ATS-friendly resume generator: single column, real-time preview, A4 PDF export and PT/EN bilingual interface. Final project of the Riachuelo bootcamp, deployed online.',
      p3t: 'BIA — Smart Bank Assistant',
      p3d: 'Proactive finance assistant that analyzes transaction history, recommends investments by risk profile and validates its own answers in 4 anti-hallucination layers. Final project of the Bradesco bootcamp.',
      p4t: 'FinVibe AI',
      p4d: 'Personal finance dashboard: finance score, budget control by category, goal projections and a conversational assistant that answers questions about your data.',
      p5t: 'Xbox Game Pass sales dashboard',
      p5d: 'Spreadsheet business modeling: simulates the Game Pass operation (plans, regions, add-ons, billing cycles) with automatic aggregations and 6 executive charts recalculated by parameter. Santander challenge.',
      p6t: 'FII investment simulator',
      p6d: 'Real-estate fund portfolio simulator with risk-profile allocation, financial formulas and spreadsheet maintenance automated by a Python script. Santander challenge.',
      p7t: 'KodaPay — payments API',
      p7d: 'Payments REST API with 6 GoF patterns (Chain, Strategy, Observer, Builder, Factory, Singleton), 26 tests and green CI. Project challenge from the CI&amp;T bootcamp.',
      p8t: 'KodaBudget — voice finance',
      p8d: 'Finance assistant that listens, understands and speaks: local transcription with Whisper, tool calling with Spring AI and spoken answers. Project challenge from the CI&amp;T bootcamp.',
      a1: '<strong>Where I come from.</strong> In 2026 I founded the KODAROS ecosystem — 4 published tech and education sites in production today — and launched Garimpo, a deals curation site with a 32-product catalog. In the same period, I passed the selection stage of four corporate DIO bootcamps, shipping a published project from each.',
      a2: '<strong>What I do.</strong> Data pipelines and ML models in Python (pandas, scikit-learn), Excel/Power Query analysis and dashboards with AI in the workflow (Copilot, Claude Code, GPT Agents), and React/TypeScript interfaces that put those analyses in the user\u2019s hands.',
      a3: '<strong>Where I\u2019m going.</strong> Seeking an internship in data analysis or data engineering, where Computer Science theory meets real problems.',
      t1: 'Computer Science — IFPA',
      t2: 'Garimpo — deals curation',
      t3: 'KODAROS — 4-site ecosystem',
      t4: 'DIO Bootcamps — Santander · Bradesco · Riachuelo · CI&amp;T',
      t5: 'Systems Analysis and Development — UNIASSELVI',
      metaDesc: 'Kelvin Oliveira\u2019s portfolio: data and AI projects in Python, Excel and React. 4 selective bootcamps (Santander, Bradesco, Riachuelo, CI&T).'
    }
  };

  var btn = document.getElementById('lang-toggle');
  if (!btn) return;

  function stored() {
    try { return localStorage.getItem('k-port-lang') || 'pt'; }
    catch (e) { return 'pt'; }
  }

  function apply(lang) {
    var dict = I18N[lang] || I18N.pt;
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var k = nodes[i].getAttribute('data-i18n');
      if (dict[k] !== undefined) nodes[i].innerHTML = dict[k];
    }
    var labelled = document.querySelectorAll('[data-i18n-aria]');
    for (var j = 0; j < labelled.length; j++) {
      var ka = labelled[j].getAttribute('data-i18n-aria');
      if (dict[ka] !== undefined) labelled[j].setAttribute('aria-label', dict[ka]);
    }
    var meta = document.querySelector('meta[name="description"]');
    if (meta && dict.metaDesc) meta.setAttribute('content', dict.metaDesc);
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
    btn.textContent = lang === 'en' ? 'PT' : 'EN';
    btn.setAttribute('aria-label', lang === 'en' ? 'Mudar para português' : 'Switch to English');
    try { localStorage.setItem('k-port-lang', lang); } catch (e) { /* privado */ }
    /* h1 recriado perde a respiração dourada — restaura */
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var gold = document.querySelector('h1 .gold');
    if (gold && !reduce) gold.classList.add('breathe-gold');
  }

  btn.addEventListener('click', function () {
    apply(stored() === 'en' ? 'pt' : 'en');
  });

  if (stored() === 'en') apply('en');
})();
