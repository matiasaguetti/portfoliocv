// Basic interactivity: year, language, animations on scroll, carousel
(function(){
  // Year
  document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());
  document.getElementById('year2') && (document.getElementById('year2').textContent = new Date().getFullYear());

  // Translations
  const i18n = {
    es: {
      'nav-home':'Inicio','nav-services':'Servicios','nav-portfolio':'Portfolio','nav-full':'Ver portfolio',
      'hero-title':'Diseñador Web, SEO & Content Strategist especializado en WordPress','hero-sub':'Más de 8 años de experiencia en diseño web basado en WordPress. Amplia experiencia en el posicionamiento SEO técnico y estrategias de contenidos. He trabajado con empresas como Nomlogo, SeguroWP y Neoattack. Tengo conocimientos avanzados en CSS, PHP, HTML y creación de funciones personalizadas mediante JS.','hero-cta-portfolio':'Ver portfolio','hero-cta-services':'Ver servicios',
      'services-title':'Servicios','services-sub':'Diseño UX/UI, desarrollo web en WordPress, auditorías SEO técnicas, estrategia de contenidos y creación de copy optimizado para buscadores.',
      'svc-web':'Diseño y desarrollo web (WordPress)','svc-web-desc':'Temas a medida, child-themes, optimización de Core Web Vitals y rendimiento. Entregables: HTML, CSS, JS y archivos del tema.',
      'svc-seo':'Posicionamiento SEO técnico','svc-seo-desc':'Auditorías, corrección de errores técnicos, optimización on-page y seguimiento con Search Console y Analytics. Planes orientados a resultados medibles.',
      'svc-content':'Estrategia y creación de contenido','svc-content-desc':'Mapas de contenido, clusterización por intención de búsqueda, redacción SEO y optimización de conversiones mediante pruebas A/B.',
      'mini-portfolio':'Portfolio','cta-more':'Ver portfolio completo','footer-cta':'Contacto','footer-email':'Escríbeme','footer-whatsapp':'WhatsApp',
      'nav-contact':'Contacto','pf-title':'Portfolio completo','pf-sub':'Proyectos seleccionados con descripción, tecnologías y resultados.','pf-case':'Ver case','contact-title':'Contacto','contact-sub':'¿Listo para trabajar? Contáctame por WhatsApp o correo.'
    },
    en: {
      'nav-home':'Home','nav-services':'Services','nav-portfolio':'Portfolio','nav-full':'See portfolio',
      'hero-title':'Web Designer, SEO & Content Strategist specialized in WordPress','hero-sub':'Over 8 years of experience building WordPress-based websites. Technical SEO and content strategy expertise. Worked with Nomlogo, SeguroWP and Neoattack. Advanced skills in CSS, PHP, HTML and JS custom functions.','hero-cta-portfolio':'See portfolio','hero-cta-services':'See services',
      'services-title':'Services','services-sub':'UX/UI design, WordPress development, technical SEO audits, content strategy and SEO copywriting.',
      'svc-web':'Web design & development (WordPress)','svc-web-desc':'Custom themes, child-themes, Core Web Vitals optimization and performance. Deliverables: HTML, CSS, JS and theme files.',
      'svc-seo':'Technical SEO','svc-seo-desc':'Audits, fixing technical issues, on-page optimization and tracking with Search Console & Analytics. Results-focused plans.',
      'svc-content':'Content strategy & creation','svc-content-desc':'Content maps, intent-driven clusters, SEO writing and conversion optimization via A/B testing.',
      'mini-portfolio':'Portfolio','cta-more':'See full portfolio','footer-cta':'Contact','footer-email':'Email me','footer-whatsapp':'WhatsApp',
      'nav-contact':'Contact','pf-title':'Full portfolio','pf-sub':'Selected projects with description, tech and results.','pf-case':'View case','contact-title':'Contact','contact-sub':'Ready to work? Contact me via WhatsApp or email.'
    },
    pt: {
      'nav-home':'Início','nav-services':'Serviços','nav-portfolio':'Portfólio','nav-full':'Ver portfólio',
      'hero-title':'Designer Web, SEO & Content Strategist especializado em WordPress','hero-sub':'Mais de 8 anos de experiência em design web baseado em WordPress. Experiência em SEO técnico e estratégias de conteúdo. Trabalhei com Nomlogo, SeguroWP e Neoattack. Conhecimentos avançados em CSS, PHP, HTML e funções JS personalizadas.','hero-cta-portfolio':'Ver portfólio','hero-cta-services':'Ver serviços',
      'services-title':'Serviços','services-sub':'Design UX/UI, desenvolvimento WordPress, auditorias SEO técnicas, estratégia de conteúdo e copywriting SEO.',
      'svc-web':'Design e desenvolvimento web (WordPress)','svc-web-desc':'Temas personalizados, child-themes, otimização de Core Web Vitals e desempenho. Entregáveis: HTML, CSS, JS e arquivos do tema.',
      'svc-seo':'SEO técnico','svc-seo-desc':'Auditorias, correção de problemas técnicos, otimização on-page e acompanhamento com Search Console e Analytics.',
      'svc-content':'Estratégia e criação de conteúdo','svc-content-desc':'Mapas de conteúdo, clusterização por intenção, redação SEO e otimização de conversões via testes A/B.',
      'mini-portfolio':'Portfólio','cta-more':'Ver portfólio completo','footer-cta':'Contato','footer-email':'Escreva-me','footer-whatsapp':'WhatsApp',
      'nav-contact':'Contato','pf-title':'Portfólio completo','pf-sub':'Projetos selecionados com descrição, tecnologias y resultados.','pf-case':'Ver case','contact-title':'Contato','contact-sub':'Pronto para trabalhar? Contate-me por WhatsApp ou email.'
    }
  };

  function setLang(lang){
    const map = i18n[lang] || i18n['es'];
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if(map[key]) el.textContent = map[key];
    });
    try{localStorage.setItem('site-lang', lang)}catch(e){}
  }

  document.querySelectorAll('.lang-btn').forEach(b=>{
    b.addEventListener('click', ()=> setLang(b.getAttribute('data-lang')));
  });
  const urlParams = new URLSearchParams(location.search);
  const initial = urlParams.get('lang') || localStorage.getItem('site-lang') || (navigator.language||'es').slice(0,2);
  setLang(initial);

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add('inview');
    });
  },{threshold:0.12});
  document.querySelectorAll('.animate').forEach(el=>io.observe(el));

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
