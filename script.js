```javascript
// Basic interactivity: year, language, animations on scroll, carousel
(function(){
  // Year
  document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());
  document.getElementById('year2') && (document.getElementById('year2').textContent = new Date().getFullYear());

  // Translations
  const i18n = {
    es: {
      'nav-home':'Inicio','nav-services':'Servicios','nav-portfolio':'Portfolio','nav-full':'Ver portfolio',
      'hero-title':'Diseño web, SEO y contenidos que convierten','hero-sub':'Soy Matías, diseñador web y redactor SEO. Desarrollo sitios optimizados, escalables y con estrategia de contenido.','hero-cta-portfolio':'Ver portfolio','hero-cta-services':'Ver servicios',
      'services-title':'Servicios','services-sub':'Diseño UX/UI, desarrollo web, estrategia SEO y contenido optimizado para buscadores.',
      'svc-web':'Diseño y desarrollo web','svc-web-desc':'Sitios responsivos, velocidad optimizada y enfoque en conversión. Entregables: HTML, CSS, JS, WordPress (si aplica).',
      'svc-seo':'Posicionamiento SEO','svc-seo-desc':'Auditorías técnicas, optimización on-page, estrategia de palabras clave y seguimiento con Google Search Console y Analytics.',
      'svc-content':'Creación de contenido','svc-content-desc':'Artículos optimizados, guiones y contenidos para redes; enfoque en intención de búsqueda y tasa de conversión.',
      'mini-portfolio':'Portfolio','cta-more':'Ver portfolio completo','footer-cta':'Contacto','footer-email':'Escríbeme','footer-whatsapp':'WhatsApp',
      'nav-contact':'Contacto','pf-title':'Portfolio completo','pf-sub':'Proyectos seleccionados con descripción, tecnologías y resultados.','pf-case':'Ver case','contact-title':'Contacto','contact-sub':'¿Listo para trabajar? Contáctame por WhatsApp o correo.'
    },
    en: {
      'nav-home':'Home','nav-services':'Services','nav-portfolio':'Portfolio','nav-full':'See portfolio',
      'hero-title':'Web design, SEO & content that convert','hero-sub':'I’m Matías — web designer and SEO writer. I build optimized, scalable sites with content strategy.','hero-cta-portfolio':'See portfolio','hero-cta-services':'See services',
      'services-title':'Services','services-sub':'UX/UI design, web development, SEO strategy and search-optimized content.',
      'svc-web':'Web design & development','svc-web-desc':'Responsive sites, speed-optimised, conversion-focused. Deliverables: HTML, CSS, JS, WordPress (if needed).',
      'svc-seo':'SEO Optimization','svc-seo-desc':'Technical audits, on-page optimization, keyword strategy and tracking with Search Console & Analytics.',
      'svc-content':'Content creation','svc-content-desc':'SEO articles, scripts and social copy focused on intent and conversion.',
      'mini-portfolio':'Portfolio','cta-more':'See full portfolio','footer-cta':'Contact','footer-email':'Email me','footer-whatsapp':'WhatsApp',
      'nav-contact':'Contact','pf-title':'Full portfolio','pf-sub':'Selected projects with description, tech and results.','pf-case':'View case','contact-title':'Contact','contact-sub':'Ready to work? Contact me via WhatsApp or email.'
    },
    pt: {
      'nav-home':'Início','nav-services':'Serviços','nav-portfolio':'Portfólio','nav-full':'Ver portfólio',
      'hero-title':'Design web, SEO e conteúdo que convertem','hero-sub':'Sou Matías — designer web e redator SEO. Desenvolvo sites otimizados e escaláveis com estratégia de conteúdo.','hero-cta-portfolio':'Ver portfólio','hero-cta-services':'Ver serviços',
      'services-title':'Serviços','services-sub':'Design UX/UI, desenvolvimento web, estratégia SEO e conteúdo otimizado para buscadores.',
      'svc-web':'Design e desenvolvimento web','svc-web-desc':'Sites responsivos, velocidade otimizada e foco em conversão. Entregáveis: HTML, CSS, JS, WordPress (se necessário).',
      'svc-seo':'Posicionamento SEO','svc-seo-desc':'Auditorias técnicas, otimização on-page, estratégia de palavras-chave e seguimento com Search Console e Analytics.',
      'svc-content':'Criação de conteúdo','svc-content-desc':'Artigos otimizados, roteiros e conteúdo para redes; foco em intenção de busca e conversão.',
      'mini-portfolio':'Portfólio','cta-more':'Ver portfólio completo','footer-cta':'Contato','footer-email':'Escreva-me','footer-whatsapp':'WhatsApp',
      'nav-contact':'Contato','pf-title':'Portfólio completo','pf-sub':'Projetos selecionados com descrição, tecnologias e resultados.','pf-case':'Ver case','contact-title':'Contato','contact-sub':'Pronto para trabalhar? Contate-me por WhatsApp ou email.'
    }
  };

  function setLang(lang){
    const map = i18n[lang] || i18n['es'];
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if(map[key]) el.textContent = map[key];
    });
    // store preference
    try{localStorage.setItem('site-lang', lang)}catch(e){}
  }

  // Lang buttons
  document.querySelectorAll('.lang-btn').forEach(b=>{
    b.addEventListener('click', ()=> setLang(b.getAttribute('data-lang')));
  });
  // initial lang: URL param ?lang= or saved preference or navigator
  const urlParams = new URLSearchParams(location.search);
  const initial = urlParams.get('lang') || localStorage.getItem('site-lang') || (navigator.language||'es').slice(0,2);
  setLang(initial);

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
      const offset = item.offsetLeft - 12; // small padding
      track.scrollTo({left: offset, behavior:'smooth'});
    }
    prev && prev.addEventListener('click', ()=> show(idx-1));
    next && next.addEventListener('click', ()=> show(idx+1));
    // autoplay
    let timer = setInterval(()=> show(idx+1), 4500);
    track.addEventListener('mouseenter', ()=> clearInterval(timer));
    track.addEventListener('mouseleave', ()=> timer = setInterval(()=> show(idx+1), 4500));
  }

})();
```
