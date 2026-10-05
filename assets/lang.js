/* PT/EN toggle - dicionario + persistencia. Textos PT espelham o HTML. */

(function () {
  'use strict';
  var I18N = {
    pt: {
      skip: 'Pular para o conteúdo',
      navBoot: 'Bootcamps',
      navProj: 'Projetos',
      navAreas: 'Áreas',
      navAbout: 'Sobre',
      navContato: 'Contato',
      eyebrow: 'Dados · IA · Cibersegurança · Redes & Infra · TI',
      heroTitle: 'Construo ferramentas que transformam<br>dados em <span class="gold">decisão</span>.',
      heroSub: 'Estudante de Ciência da Computação (IFPA) construindo pipelines de dados, modelos de machine learning, agentes de IA e laboratórios de segurança e infraestrutura. Quatro bootcamps corporativos com etapa seletiva — Santander, Bradesco, Riachuelo e CI&T — concluídos em 2026, na DIO.',
      heroTech: 'Python · React · Java · SQL · Excel · Power Query · scikit-learn · Spring Boot · Linux · Redes · PowerShell · Docker',
      btnProj: 'Ver projetos ↓',
      btnContato: 'Falar comigo ↓',
      factBoot: 'bootcamps com seleção',
      factProj: 'projetos publicados',
      factOpenB: 'Aberto',
      factOpen: 'estágio em dados, backend, cyber ou TI',
      factNum: 'sites KODAROS em produção',
      secBoot: 'Bootcamps com seleção',
      b1m: '52 horas · concluído em 18/07/2026',
      b1d: 'IA generativa, análise de dados (Excel, SQL, Power Query, Python) e cibersegurança aplicada ao setor financeiro. Projeto final: BIA, agente financeiro com validação anti-alucinação.',
      b2m: '35 horas · concluído em 20/07/2026',
      b2d: 'Do MVP ao produto: agentes de IA, SaaS com IA generativa, automação de workflows com n8n e vibe coding. Projeto final: ATS Resume Builder, gerador de currículos com deploy online.',
      b3m: '29 horas · concluído em 23/08/2026',
      b3d: 'Excel 365 e Power Query com IA no fluxo de trabalho: Copilot para consultas SQL e ETL, Claude Code e GPT Agents gerando relatórios. Quatro desafios práticos entregues.',
      b4m: '53 horas · concluído em 11/09/2026',
      b4d: 'Java moderno com Spring Boot e GitHub Copilot: 27 cursos, 2 desafios de projeto e 2 de código. Projetos: API REST com padrões GoF e assistente financeiro por voz com Spring AI.',
      secProj: 'Projetos',
      fLabel: 'Filtrar projetos',
      fAll: 'Todos',
      fDados: 'Dados & IA',
      fSeg: 'Cybersegurança',
      fBack: 'Backend Java',
      fFront: 'Frontend',
      fRedes: 'Redes & Infra',
      fTi: 'TI & Suporte',
      p1d: 'Pipeline completo de ML sobre 284.807 transações (0,17% fraudes) — ROC AUC 0.94, Recall 0.74: desbalanceamento, 3 modelos comparados e modelo final serializado.',
      p2d: 'Gerador de currículos compatível com sistemas ATS: coluna única, pré-visualização em tempo real e interface bilíngue PT/EN. Projeto final do bootcamp Riachuelo.',
      p3d: 'Assistente financeiro proativo que analisa histórico de transações, recomenda investimentos por perfil de risco e valida as próprias respostas em 4 camadas anti-alucinação. Projeto final do bootcamp Bradesco.',
      p4d: 'Dashboard de finanças pessoais: score financeiro, controle de orçamento por categoria, metas com projeção e assistente conversacional que responde perguntas sobre os dados do usuário.',
      p5d: 'Modelagem de negócio em planilha: simula a operação do Game Pass (planos, regiões, add-ons, ciclos de faturamento) com agregações automáticas e 6 gráficos executivos recalculados por parâmetro. Desafio Santander.',
      p6d: 'Simulador de carteira de fundos imobiliários com alocação por perfil de risco, fórmulas financeiras e manutenção da planilha automatizada por script Python. Desafio Santander.',
      p7d: 'API REST de pagamentos com 6 padrões GoF (Chain, Strategy, Observer, Builder, Factory, Singleton), 26 testes e CI verde. Desafio de projeto do bootcamp CI&amp;T.',
      p8d: 'Assistente financeiro que ouve, entende e responde por voz: transcrição local com Whisper, tool calling com Spring AI e resposta falada. Desafio de projeto do bootcamp CI&amp;T.',
      p9d: 'Evoluí da ideia ao ar: 4 sites de tecnologia e educação publicados e em produção. O portfólio que você vê é um deles; o Garimpo (curadoria de 32 ofertas) e outros completam o ecossistema. Arquitetura, branding, deploy e manutenção por conta própria.',
      p10d: 'Site de curadoria de ofertas com catálogo expandido, lançado em ago 2026 e em manutenção ativa.',
      i_rede_lab_topologiad: 'Validador de projeto de rede LAN: sub-redes, rotas, Vlans, trunk e capacidade.',
      i_modbus_scannerd: 'Protocolo Modbus TCP implementado do zero, com servidor de lab, scanner e leitura de medidores.',
      i_pentest_lab_scannerd: 'Audita um app vulneravel em lab local e confirma 11 falhas plantadas, cada uma com CWE e veredito.',
      i_wifi_site_surveyd: 'Mapa de calor de RSSI por andar, dimensionamento de access point e conflito de canal.',
      i_network_ci_pipelined: 'Validador de configuracao de rede para CI, com 24 regras e relatorio de achados.',
      i_threat_intel_dashboardd: 'Curador de inteligencia de ameaca ficticia: versao, faixa afetada e formula de risco.',
      i_config_backup_switchesd: 'Backup de configuracao de switch com deteccao por hash e normalizacao antes de comparar.',
      i_infra_as_code_labd: 'Laboratorio de IaC: plano, diff de tres estados e idempotencia de configuracao.',
      i_vpc_3_tier_segurad: 'Simulador de VPC em 3 camadas com firewall stateful, bastion e tracer de caminho.',
      i_certificador_cobre_simuladod: 'Certificacao de cabo: mapa de fiacao, NEXT, split pair e laudo com o limite estourado.',
      i_calculadora_enlace_cobred: 'Orcamento de perda do canal inteiro de um enlace de cobre, com laudo para conferencia manual.',
      i_siem_logs_labd: 'Pipeline de deteccao com 7 regras, correlacao temporal e alertas MITRE ATT&CK.',
      i_cftv_simulador_nvrd: 'Simulador de NVR com gravacao, busca por horario e 3 falhas plantadas de integridade.',
      i_camera_onboardingd: 'Onboarding de camera IP em lote, com nomenclatura padrao e inventario sem duplicar.',
      i_vms_integration_labsd: 'Laboratorio de integracao VMS com 4 incidentes correlacionados e trilha de auditoria com hash.',
      i_finops_dashboardd: 'Analise de fatura de nuvem ficticia: atribuicao de custo, anomalia por IQR e projecao do mes.',
      i_serverless_log_guardd: 'Funcao serverless simulada que normaliza evento, mascara dado sensivel e estima custo.',
      i_lab_backup_recuperacaod: 'Backup local com ciclo completo: hash, compressao, rotina GFS e restauracao verificada.',
      i_kb_searchd: 'Busca por similaridade em base de conhecimento, com TF-IDF e cosseno escritos a mao.',
      i_demand_limitingd: 'Simula tarifacao horaria e calcula corte de demanda para nao estourar a contratado.',
      i_helpdesk_ticketsd: 'Service desk local com fila por severidade, SLA de resposta e resolucao, MTTR e inventario.',
      i_workstation_onboardingd: 'Scripts PowerShell de preparo de estacao Windows, com dry-run por padrao e log datado.',
      i_rack_plannerd: 'Planejador de rack: altura em U, peso, amperagem por fase e temperatura estimada.',
      i_energy_dashboard_prediald: 'Dashboard web local de consumo de energia por andar, com linha de base e alerta de desvio.',
      n1d: 'PWA offline-first com 53 calculadoras de negócio (financeiras, logísticas, marketing e saúde), instalada como app e funcionando sem internet.',
      n2d: 'Flashcards técnicos offline de sistemas operacionais, arquitetura de computadores e inglês, com repetição espaçada e progresso salvo no navegador.',
      n3d: 'Organizador de IRPF em Excel com validações, hiperlinks e consolidado automático — automação de processo manual contábil.',
      n4d: 'Miniguia de engenharia de prompts com NotebookLM: 10 prompts testados, comparando a mesma pergunta em cinco formatos diferentes.',
      n5d: 'Prompt de análise de feedbacks bancários: extrai temas de CX, gera insights e prioriza o backlog de produto a partir de texto bruto.',
      secAreas: 'Áreas de interesse',
      ar1t: 'Dados & IA',
      ar1d: 'Pipelines e modelos de machine learning em Python (pandas, scikit-learn), análise e dashboards em Excel/Power Query com IA no fluxo, e agentes de IA com validação anti-alucinação. É onde comecei e onde mais tenho publicado.',
      ar2t: 'Backend Java',
      ar2d: 'APIs REST com Spring Boot, padrões GoF, testes automatizados e CI verde. Também Spring AI: tool calling, transcrição por voz e assistentes que respondem sobre dados do usuário.',
      ar3t: 'Cibersegurança',
      ar3d: 'Laboratórios de segurança aplicada: scanner de pentest com classificação CWE, pipeline de detecção com regras e correlação temporal, alertas MITRE ATT&CK, SIEM, threat intel e mascaramento de dados sensíveis.',
      ar4t: 'Redes & Infraestrutura',
      ar4d: 'Topologia LAN, VLANs e trunk, Modbus TCP do zero, survey de Wi-Fi por RSSI, certificação de cobre, VPC em 3 camadas com firewall stateful, IaC, FinOps e energy management predial.',
      ar5t: 'TI & Suporte',
      ar5d: 'Service desk com SLA, MTTR e inventário; automação de estações com PowerShell (dry-run por padrão); backup e recuperação com rotina GFS; onboarding em lote de câmeras IP e integração de VMS com trilha de auditoria.',
      ar6t: 'Frontend & Produto Digital',
      ar6d: 'React/TypeScript, PWAs offline-first e produtos do ecossistema KODAROS: ferramentas de negócio, curadoria de ofertas e este portfólio — da ideia ao deploy em produção.',
      secAbout: 'Sobre',
      a1: '<strong>De onde venho.</strong> Em 2026 fundei o ecossistema KODAROS — hoje 6 sites/produtos de tecnologia e educação publicados e em produção — e lancei o Garimpo, site de curadoria de ofertas com catálogo de 131 ofertas em 8 categorias. No mesmo período, passei na etapa seletiva de quatro bootcamps corporativos da DIO e a cada um saí com um projeto publicado.',
      a2: '<strong>O que faço.</strong> Pipelines de dados e modelos de ML em Python (pandas, scikit-learn), análise e dashboards em Excel/Power Query com IA no fluxo de trabalho (Copilot, Claude Code, GPT Agents), interfaces em React/TypeScript e PWAs, APIs REST em Java com Spring Boot — e, do outro lado da mesa, laboratórios de <strong>cibersegurança</strong> (pentest, SIEM, MITRE ATT&CK), <strong>redes</strong> (LAN, Modbus, Wi-Fi, VPC, IaC) e <strong>TI</strong> (service desk, automação de estações, backup e recuperação, CFTV/VMS). É onde minha base de Ciência da Computação encontra o mundo real.',
      a3: '<strong>Para onde vou.</strong> Busco estágio em análise/engenharia de dados, backend Java ou segurança e infraestrutura de TI — onde a teoria de Ciência da Computação encontra problemas reais.',
      aProof: 'KODAROS e Garimpo: repositórios em <a href="https://github.com/KelvinOliveiraCode" target="_blank" rel="noopener">github.com/KelvinOliveiraCode ↗</a>',
      t1: 'Ciência da Computação — IFPA',
      t1s: 'abr 2026 — dez 2029 · cursando',
      t2: 'Garimpo — curadoria de ofertas',
      t3: 'KODAROS — ecossistema de 6 sites',
      t4: 'Bootcamps DIO — Santander · Bradesco · Riachuelo · CI&amp;T',
      t5: 'Análise e Desenvolvimento de Sistemas — UNIASSELVI',
      t5s: '2026 — 2028 · cursando',
      secContato: 'Contato',
      contatoD: '<strong>Aberto a estágio</strong> em análise de dados, engenharia de dados, backend Java, cibersegurança ou TI/redes. Base em Ananindeua, PA. O caminho mais rápido é o LinkedIn — mas, se preferir, chame no WhatsApp.',
      waBtn: 'WhatsApp (91) 98613-4599',
      waAria: 'Chamar no WhatsApp',
      metaDesc: 'Portfólio de Kelvin Oliveira: projetos de dados e IA em Python, Excel e React, backend Java, cibersegurança, redes e infraestrutura. 4 bootcamps com seleção (Santander, Bradesco, Riachuelo, CI&T).',
    },
    en: {
      skip: 'Skip to content',
      navBoot: 'Bootcamps',
      navProj: 'Projects',
      navAreas: 'Areas',
      navAbout: 'About',
      navContato: 'Contact',
      eyebrow: 'Data · AI · Cybersecurity · Networks & Infra · IT',
      heroTitle: 'I build tools that turn<br>data into <span class="gold">decisions</span>.',
      heroSub: 'Computer Science student (IFPA) building data pipelines, machine learning models, AI agents and security/infrastructure labs. Four corporate bootcamps with a selection stage — Santander, Bradesco, Riachuelo and CI&T — completed in 2026 at DIO.',
      heroTech: 'Python · React · Java · SQL · Excel · Power Query · scikit-learn · Spring Boot · Linux · Networking · PowerShell · Docker',
      btnProj: 'View projects ↓',
      btnContato: 'Talk to me ↓',
      factBoot: 'selective bootcamps',
      factProj: 'published projects',
      factOpenB: 'Open',
      factOpen: 'internship in data, backend, cyber or IT',
      factNum: 'KODAROS sites in production',
      secBoot: 'Selective bootcamps',
      b1m: '52 hours · completed 18/07/2026',
      b1d: 'Generative AI, data analysis (Excel, SQL, Power Query, Python) and cybersecurity applied to finance. Final project: BIA, a finance agent with anti-hallucination validation.',
      b2m: '35 hours · completed 20/07/2026',
      b2d: 'From MVP to product: AI agents, SaaS with generative AI, n8n workflow automation and vibe coding. Final project: ATS Resume Builder, an online resume generator.',
      b3m: '29 hours · completed 23/08/2026',
      b3d: 'Excel 365 and Power Query with AI in the workflow: Copilot for SQL queries and ETL, Claude Code and GPT Agents generating reports. Four hands-on challenges delivered.',
      b4m: '53 hours · completed 11/09/2026',
      b4d: 'Modern Java with Spring Boot and GitHub Copilot: 27 courses, 2 project challenges and 2 code challenges. Projects: REST API with GoF patterns and a voice finance assistant with Spring AI.',
      secProj: 'Projects',
      fLabel: 'Filter projects',
      fAll: 'All',
      fDados: 'Data & AI',
      fSeg: 'Security',
      fBack: 'Java backend',
      fFront: 'Frontend',
      fRedes: 'Networking & infra',
      fTi: 'IT & Support',

      p1d: 'Full ML pipeline over 284,807 transactions (0.17% fraud) - ROC AUC 0.94, Recall 0.74: class imbalance, 3 compared models and a serialized final model.',
      p2d: 'ATS-compatible resume generator: single column, live preview and a bilingual PT/EN interface. Final project of the Riachuelo bootcamp.',
      p3d: 'Proactive finance assistant that reads transaction history, recommends investments by risk profile and validates its own answers in 4 anti-hallucination layers. Final project of the Bradesco bootcamp.',
      p4d: 'SaaS interface for a virtual finance assistant: charts, CSV import and an AI layer over the portfolio.',
      p5d: 'Sales dashboard for the Xbox Game Pass catalogue, with 7 KPIs sliced by parameter, built in Excel with SUMIFS.',
      p6d: 'Spreadsheet plus Python script for FII investment simulation, with cash flow, dividend yield and a rebalancing check.',
      p7d: 'REST payment API in Java 21 with Spring Boot 3.5, six GoF patterns and an idempotency key on every write.',
      p8d: 'Voice finance assistant: Spring AI with Whisper for transcription and edge-tts for the spoken answer.',
      p9d: 'Landing page of the KODAROS ecosystem with an interactive diagnostic pointing to the right service.',
      p10d: 'Deals curation site with an expanded catalogue, launched in Aug 2026 and actively maintained.',
      i_rede_lab_topologiad: 'Checks subnets, routes, VLANs, trunks and capacity of a network design, with a problem report.',
      i_modbus_scannerd: 'Lab server, scanner and meter reads, with the protocol implemented from scratch.',
      i_pentest_lab_scannerd: 'Audits a local lab with 11 planted flaws, each with a CWE and a verdict.',
      i_wifi_site_surveyd: 'RSSI heatmap, access point sizing and channel conflict detection.',
      i_network_ci_pipelined: 'Block parser, 24 network rules and a report that runs in a CI pipeline.',
      i_threat_intel_dashboardd: 'Compares version and affected range and scores risk with floor and ceiling, over fictitious data.',
      i_config_backup_switchesd: 'Compares normalized snapshots and raises an alert when the difference was not declared.',
      i_infra_as_code_labd: 'Plan, three-state diff and idempotency: what would change and what is already on the device.',
      i_vpc_3_tier_segurad: 'Stateful decision engine, bastion host and a tracer showing which rule blocked the traffic.',
      i_certificador_cobre_simuladod: 'Wiring map, NEXT, split pair and a report naming the limit that was exceeded.',
      i_calculadora_enlace_cobred: 'Adds up the insertion loss of the whole channel and issues a report with the arithmetic open for checking.',
      i_siem_logs_labd: 'Seven rules, temporal correlation and MITRE ATT&CK alerts over 2,378 synthetic events.',
      i_cftv_simulador_nvrd: 'Recording, time search and health checks for 24 simulated cameras, with 3 detected failures.',
      i_camera_onboardingd: 'Prepares cameras in batch, with standard naming, a duplicate-free inventory and a per-camera log.',
      i_vms_integration_labsd: 'Four correlated incidents and an append-only audit trail with chained hash.',
      i_finops_dashboardd: 'Attributes cost per project, flags anomalous spend with IQR and projects month end.',
      i_serverless_log_guardd: 'Receives an event, normalizes it, masks sensitive data, applies retention and estimates cost.',
      i_lab_backup_recuperacaod: 'Local backup with the full cycle: hash, compression, GFS rotation and verified restore.',
      i_kb_searchd: 'The technician types the symptom in plain language and gets the relevant procedures, with hand-written TF-IDF.',
      i_demand_limitingd: 'Simulates time-of-use pricing and spreads the cut across loads to stay under contracted demand.',
      i_helpdesk_ticketsd: 'Queue by severity and waiting time, first-response and resolution SLAs tracked apart, MTTR and inventory.',
      i_workstation_onboardingd: 'PowerShell scripts that dry-run by default, log with timestamps and verify the final state.',
      i_rack_plannerd: 'Rack units, weight, current per phase and estimated temperature, with a warning when it overflows.',
      i_energy_dashboard_prediald: 'Consumption per floor, baseline, tariff cost and deviation alerts, over local HTTP.',
      n1d: 'Offline-first PWA with 53 business calculators (finance, logistics, marketing and health), installable as an app and working without internet.',
      n2d: 'Offline technical flashcards on operating systems, computer architecture and English, with spaced repetition and progress saved in the browser.',
      n3d: 'Tax return organizer in Excel with validations, hyperlinks and automatic consolidation — automating a manual accounting process.',
      n4d: 'Prompt engineering miniguide with NotebookLM: 10 tested prompts, comparing the same question across five different formats.',
      n5d: 'Banking feedback analysis prompt: extracts CX themes, generates insights and prioritizes the product backlog from raw text.',
      secAreas: 'Areas of interest',
      ar1t: 'Data & AI',
      ar1d: 'Machine learning pipelines in Python (pandas, scikit-learn), Excel/Power Query analysis and dashboards with AI in the workflow, and AI agents with anti-hallucination validation. Where I started, and where I publish the most.',
      ar2t: 'Java Backend',
      ar2d: 'REST APIs with Spring Boot, GoF patterns, automated tests and green CI. Also Spring AI: tool calling, voice transcription and assistants that answer questions about user data.',
      ar3t: 'Cybersecurity',
      ar3d: 'Applied security labs: pentest scanner with CWE classification, detection pipeline with rules and temporal correlation, MITRE ATT&CK alerts, SIEM, threat intel and sensitive data masking.',
      ar4t: 'Networks & Infrastructure',
      ar4d: 'LAN topology, VLANs and trunks, Modbus TCP from scratch, Wi-Fi surveys by RSSI, copper certification, 3-tier VPC with stateful firewall, IaC, FinOps and building energy management.',
      ar5t: 'IT & Support',
      ar5d: 'Service desk with SLA, MTTR and inventory; workstation automation with PowerShell (dry-run by default); backup and recovery with GFS rotation; batch IP camera onboarding and VMS integration with audit trail.',
      ar6t: 'Frontend & Digital Products',
      ar6d: 'React/TypeScript, offline-first PWAs and KODAROS ecosystem products: business tools, deals curation and this portfolio — from idea to production deploy.',
      secAbout: 'About',
      a1: '<strong>Where I come from.</strong> In 2026 I founded the KODAROS ecosystem — 6 published tech and education sites/products in production today — and launched Garimpo, a deals curation site with 131 offers in 8 categories. In the same period, I passed the selection stage of four corporate DIO bootcamps, shipping a published project from each.',
      a2: '<strong>What I do.</strong> Data pipelines and ML models in Python (pandas, scikit-learn), Excel/Power Query analysis and dashboards with AI in the workflow (Copilot, Claude Code, GPT Agents), React/TypeScript interfaces and PWAs, REST APIs in Java with Spring Boot — and, on the other side of the table, labs in <strong>cybersecurity</strong> (pentest, SIEM, MITRE ATT&CK), <strong>networking</strong> (LAN, Modbus, Wi-Fi, VPC, IaC) and <strong>IT</strong> (service desk, workstation automation, backup and recovery, CFTV/VMS). That is where my Computer Science base meets the real world.',
      a3: '<strong>Where I\u2019m going.</strong> Seeking an internship in data analysis/engineering, Java backend, or security and IT infrastructure — where Computer Science theory meets real problems.',
      aProof: 'KODAROS and Garimpo: repositories at <a href="https://github.com/KelvinOliveiraCode" target="_blank" rel="noopener">github.com/KelvinOliveiraCode &#8599;</a>',
      t1: 'Computer Science — IFPA',
      t1s: 'apr 2026 - dec 2029 - enrolled',
      t2: 'Garimpo — deals curation',
      t3: 'KODAROS — 6-site ecosystem',
      t4: 'DIO Bootcamps — Santander · Bradesco · Riachuelo · CI&amp;T',
      t5: 'Systems Analysis and Development — UNIASSELVI',
      t5s: '2026 - 2028 - enrolled',
      secContato: 'Contact',
      contatoD: '<strong>Open to internships</strong> in data analysis, data engineering, Java backend, cybersecurity or IT/networking. Based in Ananindeua, PA. Fastest route is LinkedIn — or just message me on WhatsApp.',
      waBtn: 'WhatsApp (91) 98613-4599',
      waAria: 'Message on WhatsApp',
      metaDesc: 'Kelvin Oliveira\u2019s portfolio: data and AI projects in Python, Excel and React, Java backend, cybersecurity, networks and infrastructure. 4 selective bootcamps (Santander, Bradesco, Riachuelo, CI&T).',
    },
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
    /* avisa o engraving.js para o "mostrar mais (x)" recontar em PT/EN */
    try { window.dispatchEvent(new CustomEvent('k-port-lang', { detail: stored() })); }
    catch (e) { /* CustomEvent indisponivel */ }
  });

  if (stored() === 'en') apply('en');
})();

