// Basic interactivity: year, language, animations on scroll, carousel
(function(){
  // Year
  document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());
  document.getElementById('year2') && (document.getElementById('year2').textContent = new Date().getFullYear());

  // Translations
  const i18n = {
    es: {
      'nav-home':'Inicio','nav-services':'Servicios','nav-portfolio':'Portfolio','nav-full':'Ver portfolio',
      'hero-title':'Diseñador Web, SEO & Content Strategist especializado en WordPress',
      'hero-sub':'Más de 8 años de experiencia en diseño web basado en WordPress. Amplia experiencia en el posicionamiento SEO técnico y estrategias de contenidos. He trabajado con empresas como Nomlogo, SeguroWP y Neoattack. Tengo conocimientos avanzados en CSS, PHP, HTML y creación de funciones personalizadas mediante JS.',
      'hero-cta-portfolio':'Ver portfolio','hero-cta-services':'Ver servicios',
      'services-title':'Servicios','services-sub':'Diseño UX/UI, desarrollo web en WordPress, auditorías SEO técnicas, estrategia de contenidos y creación de copy optimizado para buscadores.',
      'svc-web':'Diseño y desarrollo web (WordPress)','svc-web-desc':'Temas a medida, child-themes, optimización de Core Web Vitals y rendimiento. Entregables: HTML, CSS, JS y archivos del tema.',
      'svc-seo':'Posicionamiento SEO técnico','svc-seo-desc':'Auditorías, corrección de errores técnicos, optimización on-page y seguimiento con Search Console y Analytics. Planes orientados a resultados medibles.',
      'svc-content':'Estrategia y creación de contenido','svc-content-desc':'Mapas de contenido, clusterización por intención de búsqueda, redacción SEO y optimización de conversiones mediante pruebas A/B.',
      'mini-portfolio':'Portfolio','cta-more':'Ver portfolio completo','footer-cta':'Contacto','footer-email':'Escríbeme','footer-whatsapp':'WhatsApp',
      'nav-contact':'Contacto','pf-title':'Portfolio completo','pf-sub':'Proyectos seleccionados con descripción, tecnologías y resultados.','pf-case':'Ver case','contact-title':'Contacto','contact-sub':'¿Listo para trabajar? Contáctame por WhatsApp o correo.',
      // clients
      'clients-title':'Empresas con las que he trabajado',
      'clients-sub':'Proyectos y colaboraciones destacadas con clientes en diseño web, SEO y automatizaciones.',
      'neoattack-alt':'Logo Neoattack — cliente',
      'neoattack-aria':'Neoattack — sitio externo',
      'colorcopy-alt':'Logo Colorcopy Group — cliente',
      'colorcopy-aria':'Colorcopy Group — sitio externo',
      'ecoticias-alt':'Logo ECOticias — cliente',
      'ecoticias-aria':'ECOticias — sitio externo',
      //Support
      'support-title':'Soporte técnico',
'support-sub':'Atención rápida y profesional para mantener tu WordPress estable, integrado y seguro.',
'support-prob-title':'Problemas comunes en WordPress',
'support-prob-desc':'Errores frecuentes, conflictos de plugins o temas y soluciones rápidas para recuperar tu sitio.',
'support-prob-cta':'Ver problemas',
'support-prob-aria':'Ver problemas comunes en WordPress',
'support-prob-img-alt':'Icono problemas WordPress',
'support-int-title':'Integraciones',
'support-int-desc':'Conexiones con CRM, pasarelas de pago, plataformas de email y APIs a medida.',
'support-int-cta':'Ver integraciones',
'support-int-aria':'Ver integraciones disponibles',
'support-int-img-alt':'Icono integraciones',
'support-sec-title':'Problemas de seguridad y otros',
'support-sec-desc':'Hardening, backups, incidentes recientes y mitigación de vulnerabilidades.',
'support-sec-cta':'Ver seguridad',
'support-sec-aria':'Ver problemas de seguridad',
'support-sec-img-alt':'Icono seguridad',
      //Supoport-Problems
      // soporte - problemas
'sp-prob-meta-title':'Problemas comunes en WordPress — Soporte',
'sp-prob-meta-desc':'Lista de problemas frecuentes en WordPress y soluciones: rendimiento, seguridad, conflictos de plugins, backups y más.',
'sp-prob-title':'Problemas comunes en WordPress',
'sp-prob-sub':'Describo los problemas más frecuentes, su impacto y una estimación realista del tiempo de resolución. Si prefieres, solicito un diagnóstico rápido y te contacto.',
'sp-prob-hero-alt':'Soporte WordPress',
'sp-prob-list-title':'Problemas frecuentes',
'sp-prob-list-sub':'Cada ítem incluye causa habitual, impacto y tiempo estimado de resolución.',
'sp-prob-1-title':'Pantalla blanca (WSOD) / Error fatal',
'sp-prob-1-desc':'Causas: actualización de plugin/tema, error PHP o límite de memoria.',
'sp-prob-1-impact':'Alto',
'sp-prob-1-fix':'Solución típica: activar WP_DEBUG en staging, desactivar plugins por CLI/FTP, restaurar backup si es necesario.',
'sp-prob-1-time':'Tiempo estimado: 30–120 minutos.',
'sp-prob-2-title':'Rendimiento lento / Core Web Vitals bajos',
'sp-prob-2-desc':'Causas: imágenes sin optimizar, plugins pesados, hosting limitado, scripts bloqueantes.',
'sp-prob-2-fix':'Solución: optimizar imágenes, activar cache, usar CDN y auditar plugins.',
'sp-prob-2-time':'Tiempo estimado: 3–12 horas.',
'sp-prob-3-title':'Conflictos entre plugins y temas',
'sp-prob-3-desc':'Causas: APIs incompatibles, hooks mal empleados o versiones de PHP no compatibles.',
'sp-prob-3-fix':'Solución: debug incremental, revisar logs y aplicar fixes en child-theme.',
'sp-prob-3-time':'Tiempo estimado: 1–4 horas.',
'sp-prob-4-title':'Problemas tras actualizaciones',
'sp-prob-4-desc':'Causas: incompatibilidades o migraciones incompletas.',
'sp-prob-4-fix':'Solución: restaurar backup, test en staging y aplicar fixes.',
'sp-prob-4-time':'Tiempo estimado: 1–3 horas.',
'sp-prob-5-title':'Sitio comprometido / Malware',
'sp-prob-5-desc':'Causas: plugins vulnerables o credenciales filtradas.',
'sp-prob-5-fix':'Solución: aislamiento, limpieza manual + scanner, rotación de credenciales y hardening.',
'sp-prob-5-time':'Tiempo estimado: 4–40 horas.',
'sp-prob-6-title':'Problemas con pagos / checkout',
'sp-prob-6-desc':'Causas: configuración de pasarelas, SSL o webhooks.',
'sp-prob-6-fix':'Solución: revisar logs de gateway, probar sandbox y verificar endpoints.',
'sp-prob-6-time':'Tiempo estimado: 2–8 horas.',
'sp-prob-7-title':'Entregabilidad de emails',
'sp-prob-7-desc':'Causas: mala configuración SMTP o ausencia de SPF/DKIM.',
'sp-prob-7-fix':'Solución: configurar SMTP profesional y registros SPF/DKIM/DMARC.',
'sp-prob-7-time':'Tiempo estimado: 1–3 horas.',
'sp-prob-cta-title':'¿Necesitas soporte ahora?',
'sp-prob-cta-desc':'Solicita un diagnóstico rápido (revisión inicial de 30 minutos) y te propongo pasos concretos y presupuesto.',
'sp-prob-cta-email':'Escríbeme',
'sp-prob-cta-wa':'WhatsApp'
    },
    en: {
      'nav-home':'Home','nav-services':'Services','nav-portfolio':'Portfolio','nav-full':'See portfolio',
      'hero-title':'Web Designer, SEO & Content Strategist specialized in WordPress',
      'hero-sub':'Over 8 years of experience building WordPress-based websites. Technical SEO and content strategy expertise. Worked with Nomlogo, SeguroWP and Neoattack. Advanced skills in CSS, PHP, HTML and JS custom functions.',
      'hero-cta-portfolio':'See portfolio','hero-cta-services':'See services',
      'services-title':'Services','services-sub':'UX/UI design, WordPress development, technical SEO audits, content strategy and SEO copywriting.',
      'svc-web':'Web design & development (WordPress)','svc-web-desc':'Custom themes, child-themes, Core Web Vitals optimization and performance. Deliverables: HTML, CSS, JS and theme files.',
      'svc-seo':'Technical SEO','svc-seo-desc':'Audits, fixing technical issues, on-page optimization and tracking with Search Console & Analytics. Results-focused plans.',
      'svc-content':'Content strategy & creation','svc-content-desc':'Content maps, intent-driven clusters, SEO writing and conversion optimization via A/B testing.',
      'mini-portfolio':'Portfolio','cta-more':'See full portfolio','footer-cta':'Contact','footer-email':'Email me','footer-whatsapp':'WhatsApp',
      'nav-contact':'Contact','pf-title':'Full portfolio','pf-sub':'Selected projects with description, tech and results.','pf-case':'View case','contact-title':'Contact','contact-sub':'Ready to work? Contact me via WhatsApp or email.',
      // clients
      'clients-title':'Companies I\'ve worked with',
      'clients-sub':'Selected projects and collaborations in web design, SEO and automations.',
      'neoattack-alt':'Neoattack logo — client',
      'neoattack-aria':'Neoattack — external site',
      'colorcopy-alt':'Colorcopy Group logo — client',
      'colorcopy-aria':'Colorcopy Group — external site',
      'ecoticias-alt':'ECOticias logo — client',
      'ecoticias-aria':'ECOticias — external site',
      //Support
  'support-title':'Technical support',
'support-sub':'Fast, professional support to keep your WordPress stable, integrated and secure.',
'support-prob-title':'Common WordPress issues',
'support-prob-desc':'Frequent errors, plugin/theme conflicts and quick fixes to restore your site.',
'support-prob-cta':'See issues',
'support-prob-aria':'See common WordPress issues',
'support-prob-img-alt':'Icon common issues',
'support-int-title':'Integrations',
'support-int-desc':'Connections with CRMs, payment gateways, email platforms and custom APIs.',
'support-int-cta':'See integrations',
'support-int-aria':'See common integrations',
'support-int-img-alt':'Icon integrations',
'support-sec-title':'Security issues & more',
'support-sec-desc':'Hardening, backups, recent incidents and vulnerability mitigation.',
'support-sec-cta':'See security',
'support-sec-aria':'See security issues',
'support-sec-img-alt':'Icon security',
        //Support-Problems
        'sp-prob-meta-title':'Common WordPress issues — Support',
'sp-prob-meta-desc':'List of frequent WordPress issues and solutions: performance, security, plugin conflicts, backups and more.',
'sp-prob-title':'Common WordPress issues',
'sp-prob-sub':'I describe the most frequent issues, their impact and a realistic estimate of resolution time. If you prefer, request a quick diagnosis and I will contact you.',
'sp-prob-hero-alt':'WordPress support',
'sp-prob-list-title':'Frequent issues',
'sp-prob-list-sub':'Each item includes typical cause, impact and estimated resolution time.',
'sp-prob-1-title':'White screen (WSOD) / Fatal error',
'sp-prob-1-desc':'Causes: plugin/theme update, PHP error or memory limit.',
'sp-prob-1-impact':'High',
'sp-prob-1-fix':'Typical fix: enable WP_DEBUG in staging, disable plugins via CLI/FTP, restore backup if needed.',
'sp-prob-1-time':'Estimated time: 30–120 minutes.',
'sp-prob-2-title':'Slow performance / Low Core Web Vitals',
'sp-prob-2-desc':'Causes: unoptimized images, heavy plugins, limited hosting, render-blocking scripts.',
'sp-prob-2-fix':'Fix: optimize images, enable caching, use CDN and audit plugins.',
'sp-prob-2-time':'Estimated time: 3–12 hours.',
'sp-prob-3-title':'Plugin & theme conflicts',
'sp-prob-3-desc':'Causes: incompatible APIs, misused hooks or unsupported PHP versions.',
'sp-prob-3-fix':'Fix: incremental debugging, check logs and apply fixes in a child theme.',
'sp-prob-3-time':'Estimated time: 1–4 hours.',
'sp-prob-4-title':'Issues after updates',
'sp-prob-4-desc':'Causes: incompatibilities or incomplete migrations.',
'sp-prob-4-fix':'Fix: restore from backup, test in staging and apply compatible fixes.',
'sp-prob-4-time':'Estimated time: 1–3 hours.',
'sp-prob-5-title':'Compromised site / Malware',
'sp-prob-5-desc':'Causes: vulnerable plugins or leaked credentials.',
'sp-prob-5-fix':'Fix: isolate, clean (scanner + manual), rotate credentials and harden security.',
'sp-prob-5-time':'Estimated time: 4–40 hours.',
'sp-prob-6-title':'Payment / checkout issues',
'sp-prob-6-desc':'Causes: gateway settings, SSL or webhook configuration.',
'sp-prob-6-fix':'Fix: review gateway logs, test in sandbox and verify endpoints.',
'sp-prob-6-time':'Estimated time: 2–8 hours.',
'sp-prob-7-title':'Email deliverability',
'sp-prob-7-desc':'Causes: bad SMTP setup or missing SPF/DKIM.',
'sp-prob-7-fix':'Fix: configure professional SMTP and DNS records (SPF/DKIM/DMARC).',
'sp-prob-7-time':'Estimated time: 1–3 hours.',
'sp-prob-cta-title':'Need support now?',
'sp-prob-cta-desc':'Request a quick diagnosis (30-minute initial review) and I will propose concrete steps and a quote.',
'sp-prob-cta-email':'Email me',
'sp-prob-cta-wa':'WhatsApp'
    },
    pt: {
      'nav-home':'Início','nav-services':'Serviços','nav-portfolio':'Portfólio','nav-full':'Ver portfólio',
      'hero-title':'Designer Web, SEO & Content Strategist especializado em WordPress',
      'hero-sub':'Mais de 8 anos de experiência em design web baseado em WordPress. Experiência em SEO técnico e estratégias de conteúdo. Trabalhei com Nomlogo, SeguroWP e Neoattack. Conhecimentos avançados em CSS, PHP, HTML e funções JS personalizadas.',
      'hero-cta-portfolio':'Ver portfólio','hero-cta-services':'Ver serviços',
      'services-title':'Serviços','services-sub':'Design UX/UI, desenvolvimento WordPress, auditorias SEO técnicas, estratégia de conteúdo e copywriting SEO.',
      'svc-web':'Design e desenvolvimento web (WordPress)','svc-web-desc':'Temas personalizados, child-themes, otimização de Core Web Vitals e desempenho. Entregáveis: HTML, CSS, JS e arquivos do tema.',
      'svc-seo':'SEO técnico','svc-seo-desc':'Auditorias, correção de problemas técnicos, otimização on-page e acompanhamento com Search Console e Analytics.',
      'svc-content':'Estratégia e criação de conteúdo','svc-content-desc':'Mapas de conteúdo, clusterização por intenção, redação SEO e otimização de conversões via testes A/B.',
      'mini-portfolio':'Portfólio','cta-more':'Ver portfólio completo','footer-cta':'Contato','footer-email':'Escreva-me','footer-whatsapp':'WhatsApp',
      'nav-contact':'Contato','pf-title':'Portfólio completo','pf-sub':'Projetos selecionados con descrição, tecnologias e resultados.','pf-case':'Ver case','contact-title':'Contato','contact-sub':'Pronto para trabalhar? Contate-me por WhatsApp ou email.',
      // clients
      'clients-title':'Empresas com as quais trabalhei',
      'clients-sub':'Projetos e colaborações selecionadas em design web, SEO e automações.',
      'neoattack-alt':'Logo Neoattack — cliente',
      'neoattack-aria':'Neoattack — site externo',
      'colorcopy-alt':'Logo Colorcopy Group — cliente',
      'colorcopy-aria':'Colorcopy Group — site externo',
      'ecoticias-alt':'Logo ECOticias — cliente',
      'ecoticias-aria':'ECOticias — site externo',
      'support-title':'Suporte técnico',
      //Support
'support-sub':'Atendimento rápido e profissional para manter seu WordPress estável, integrado e seguro.',
'support-prob-title':'Problemas comuns no WordPress',
'support-prob-desc':'Erros frequentes, conflitos de plugins ou temas e soluções rápidas para recuperar o site.',
'support-prob-cta':'Ver problemas',
'support-prob-aria':'Ver problemas comuns no WordPress',
'support-prob-img-alt':'Ícone problemas WordPress',
'support-int-title':'Integrações',
'support-int-desc':'Conexões com CRM, gateways de pagamento, plataformas de e-mail e APIs sob medida.',
'support-int-cta':'Ver integrações',
'support-int-aria':'Ver integrações comuns',
'support-int-img-alt':'Ícone integrações',
'support-sec-title':'Problemas de segurança e outros',
'support-sec-desc':'Hardening, backups, incidentes recentes e mitigação de vulnerabilidades.',
'support-sec-cta':'Ver segurança',
'support-sec-aria':'Ver problemas de segurança',
'support-sec-img-alt':'Ícone segurança',
        //Support-Problems
        'sp-prob-meta-title':'Problemas comuns no WordPress — Suporte',
'sp-prob-meta-desc':'Lista de problemas frequentes em WordPress e soluções: performance, segurança, conflitos de plugins, backups e mais.',
'sp-prob-title':'Problemas comuns no WordPress',
'sp-prob-sub':'Descrevo os problemas mais frequentes, seu impacto e uma estimativa realista do tempo de resolução. Se preferir, solicite um diagnóstico rápido e eu entro em contato.',
'sp-prob-hero-alt':'Suporte WordPress',
'sp-prob-list-title':'Problemas frequentes',
'sp-prob-list-sub':'Cada item inclui causa típica, impacto e tempo estimado de resolução.',
'sp-prob-1-title':'Tela branca (WSOD) / Erro fatal',
'sp-prob-1-desc':'Causas: atualização de plugin/tema, erro PHP ou limite de memória.',
'sp-prob-1-impact':'Alto',
'sp-prob-1-fix':'Solução típica: ativar WP_DEBUG em staging, desativar plugins via CLI/FTP e restaurar backup se necessário.',
'sp-prob-1-time':'Tempo estimado: 30–120 minutos.',
'sp-prob-2-title':'Desempenho lento / Core Web Vitals baixos',
'sp-prob-2-desc':'Causas: imagens não otimizadas, plugins pesados, hospedagem limitada ou scripts bloqueantes.',
'sp-prob-2-fix':'Solução: otimizar imagens, ativar cache, usar CDN e auditar plugins.',
'sp-prob-2-time':'Tempo estimado: 3–12 horas.',
'sp-prob-3-title':'Conflitos entre plugins e temas',
'sp-prob-3-desc':'Causas: APIs incompatíveis, hooks mal utilizados ou versões de PHP não compatíveis.',
'sp-prob-3-fix':'Solução: debug incremental, checar logs e aplicar correções no child-theme.',
'sp-prob-3-time':'Tempo estimado: 1–4 horas.',
'sp-prob-4-title':'Problemas após atualizações',
'sp-prob-4-desc':'Causas: incompatibilidades ou migrações incompletas.',
'sp-prob-4-fix':'Solução: restaurar backup, testar em staging e aplicar correções compatíveis.',
'sp-prob-4-time':'Tempo estimado: 1–3 horas.',
'sp-prob-5-title':'Site comprometido / Malware',
'sp-prob-5-desc':'Causas: plugins vulneráveis ou credenciais vazadas.',
'sp-prob-5-fix':'Solução: isolar, limpar (scanner + manual), rotacionar credenciais e aplicar hardening.',
'sp-prob-5-time':'Tempo estimado: 4–40 horas.',
'sp-prob-6-title':'Problemas com pagamentos / checkout',
'sp-prob-6-desc':'Causas: configuração de gateway, SSL ou webhooks.',
'sp-prob-6-fix':'Solução: revisar logs do gateway, testar em sandbox e verificar endpoints.',
'sp-prob-6-time':'Tempo estimado: 2–8 horas.',
'sp-prob-7-title':'Entregabilidade de e-mails',
'sp-prob-7-desc':'Causas: má configuração SMTP ou ausência de SPF/DKIM.',
'sp-prob-7-fix':'Solução: configurar SMTP profissional e registros DNS (SPF/DKIM/DMARC).',
'sp-prob-7-time':'Tempo estimado: 1–3 horas.',
'sp-prob-cta-title':'Precisa de suporte agora?',
'sp-prob-cta-desc':'Solicite um diagnóstico rápido (revisão inicial de 30 minutos) e eu proponho passos concretos e orçamento.',
'sp-prob-cta-email':'Escreva-me',
'sp-prob-cta-wa':'WhatsApp'
    }
  };

  function setLang(lang){
    const map = i18n[lang] || i18n['es'];

    // Text nodes
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if(map[key]) el.textContent = map[key];
    });

    // Update image alt attributes
    document.querySelectorAll('[data-i18n-alt]').forEach(img => {
      const key = img.getAttribute('data-i18n-alt');
      if (map[key]) img.alt = map[key];
    });

    // Update aria-label attributes
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      if (map[key]) el.setAttribute('aria-label', map[key]);
    });

    // Set html lang attribute for accessibility / SEO
    document.documentElement.lang = lang;

    // persist preference
    try{ localStorage.setItem('site-lang', lang); }catch(e){ /* ignore */ }
  }

  // Language buttons
  document.querySelectorAll('.lang-btn').forEach(b=>{
    b.addEventListener('click', ()=> setLang(b.getAttribute('data-lang')));
  });

  // Detect preferred language (URL ?lang= override -> localStorage -> navigator.languages -> default 'es')
  async function detectPreferredLang() {
    const urlLang = new URLSearchParams(location.search).get('lang');
    if (urlLang && ['es','en','pt'].includes(urlLang)) return urlLang;

    try {
      const stored = localStorage.getItem('site-lang');
      if (stored && ['es','en','pt'].includes(stored)) return stored;
    } catch(e){ /* ignore */ }

    const nav = navigator.languages || [navigator.language || navigator.userLanguage || 'es'];
    for (let entry of nav) {
      if (!entry) continue;
      const code = entry.toLowerCase().split('-')[0];
      if (['es','en','pt'].includes(code)) return code;
    }
    return 'es';
  }

  // Initialize language asynchronously
  (async function initLanguage() {
    const lang = await detectPreferredLang();
    setLang(lang);
  })();

  // IntersectionObserver for scroll animations
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add('inview');
    });
  },{threshold:0.12});
  document.querySelectorAll('.animate').forEach(el=>io.observe(el));

  // Simple carousel control
  const track = document.getElementById('carouselTrack');
  if(track){
    let idx = 0;
    const items = track.querySelectorAll('.carousel-item');
    const prev = document.querySelector('.carousel-btn.prev');
    const next = document.querySelector('.carousel-btn.next');

    function show(i){
      idx = (i + items.length) % items.length;
      const item = items[idx];
      const offset = item.offsetLeft - 12;
      track.scrollTo({left: offset, behavior:'smooth'});
    }
    prev && prev.addEventListener('click', ()=> show(idx-1));
    next && next.addEventListener('click', ()=> show(idx+1));
    let timer = setInterval(()=> show(idx+1), 4500);
    track.addEventListener('mouseenter', ()=> clearInterval(timer));
    track.addEventListener('mouseleave', ()=> timer = setInterval(()=> show(idx+1), 4500));
  }

})();
