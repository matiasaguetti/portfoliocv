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
'support-sec-img-alt':'Icono seguridad'
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
'support-sec-img-alt':'Icon security'
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
'support-sec-img-alt':'Ícone segurança'

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
