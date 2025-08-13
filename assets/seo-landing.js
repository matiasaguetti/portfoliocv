// assets/seo-landing.js
// Cliente para seo-landing.html
(function(){
  // --- Config: actualiza si tu función Netlify usa otra URL
  const FUNCTION_URL = 'https://matiasaguet-ti.netlify.app/.netlify/functions/seo-analyze';

  // --- Utilidades
  function $id(id){ return document.getElementById(id); }
  function t(key){ // traducción: busca window.TRANSLATIONS o fallback local
    try {
      const lang = (window.currentLang || localStorage.getItem('site_lang') || document.documentElement.lang || 'es');
      if (window.TRANSLATIONS && window.TRANSLATIONS[key] && window.TRANSLATIONS[key][lang]) return window.TRANSLATIONS[key][lang];
      // fallback dictionary (mínimo)
      const dict = {
        "seo_audit_title": { es: "Auditoría SEO Rápida", en:"Quick SEO Audit", pt:"Auditoria SEO Rápida" },
        "seo_audit_heading": { es:"Chequeo SEO Rápido", en:"Quick SEO Check", pt:"Verificação SEO Rápida" },
        "seo_audit_subheading": { es:"Analiza rápidamente título, meta, H1, imágenes y elementos técnicos clave.", en:"Quickly analyze title, meta, H1, images and technical elements.", pt:"Analise rapidamente título, meta, H1, imagens e elementos técnicos." },
        "seo_audit_label": { es:"Introduce la URL:", en:"Enter the URL:", pt:"Digite o URL:" },
        "seo_audit_button": { es:"Analizar", en:"Analyze", pt:"Analisar" },
        "seo_audit_hint": { es:"Análisis server-side. El informe puede tardar unos segundos.", en:"Server-side analysis. The report may take a few seconds.", pt:"Análise server-side. O relatório pode demorar alguns segundos." }
      };
      return (dict[key] && dict[key][lang]) ? dict[key][lang] : key;
    } catch(e){ return key; }
  }

  // --- i18n: aplica data-i18n
  function applyTranslations(lang){
    window.currentLang = lang;
    localStorage.setItem('site_lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      const str = t(key);
      if (el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase()==='textarea') {
        el.placeholder = str;
      } else {
        el.textContent = str;
      }
    });
    // title meta
    const titleKey = document.querySelector('[data-i18n="seo_audit_title"]');
    if (titleKey) document.title = t('seo_audit_title');
  }

  // init language switcher
  const langSel = document.getElementById('languageSwitcher');
  if (langSel){
    const current = localStorage.getItem('site_lang') || (document.documentElement.lang || 'es');
    langSel.value = current;
    applyTranslations(current);
    langSel.addEventListener('change', (e) => applyTranslations(e.target.value));
  } else {
    // apply without switcher
    applyTranslations(localStorage.getItem('site_lang') || document.documentElement.lang || 'es');
  }

  // --- DOM refs
  const form = $id('seoForm');
  const target = $id('targetUrl');
  const submitBtn = $id('seoSubmit');
  const output = $id('seoOutput');
  const seoSummary = $id('seoSummary');
  const seoPretty = $id('seoPretty');
  const seoJson = $id('seoJson');
  const downloadPdf = $id('downloadPdf');
  const sendToEmailBtn = $id('sendToEmail');
  const resultsTitle = $id('resultsTitle');

  // defensive
  if (!form || !target || !submitBtn){
    console.warn('seo-landing.js: elementos principales no encontrados. Comprueba IDs (seoForm/targetUrl/seoSubmit).');
    return;
  }

  // small helper escape
  function esc(s){ return String(s||''); }

  // render pretty cards
  function renderPretty(result){
    if (!seoPretty) return;
    seoPretty.innerHTML = '';
    const cards = [];

    // summary card
    const c1 = document.createElement('div'); c1.className='card';
    c1.innerHTML = `<h4>Resumen</h4>
      <div><strong>URL:</strong> <a href="${esc(result.meta.url)}" target="_blank" rel="noopener">${esc(result.meta.url)}</a></div>
      <div><strong>Puntuación:</strong> ${result.score}</div>
      <div><strong>Title len:</strong> ${result.meta.titleLength} • <strong>H1:</strong> ${result.meta.h1Count}</div>
    `;
    cards.push(c1);

    // SEO details
    const c2 = document.createElement('div'); c2.className='card';
    c2.innerHTML = `<h4>SEO técnico</h4>
      <div><strong>Meta desc len:</strong> ${result.meta.metaDescLength}</div>
      <div><strong>Imágenes:</strong> ${result.meta.imagesTotal} (sin alt: ${result.meta.imagesMissingAlt})</div>
      <div><strong>Palabras:</strong> ${result.meta.wordCount}</div>
      <div><strong>Enlaces internos:</strong> ${result.meta.internalLinks}</div>
    `;
    cards.push(c2);

    // recommendations
    const c3 = document.createElement('div'); c3.className='card';
    c3.innerHTML = `<h4>Recomendaciones</h4>
      <ul>${(result.suggestions||[]).map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`;
    cards.push(c3);

    cards.forEach(card => seoPretty.appendChild(card));
    if (seoJson) seoJson.textContent = JSON.stringify(result, null, 2);
  }

  // show results with animation
  function showResults(){
    if (!output) return;
    output.style.display = 'block';
    output.classList.remove('fade-in');
    // force reflow
    void output.offsetWidth;
    output.classList.add('fade-in');
  }

  // generate PDF using jsPDF
  async function generatePdf(report){
    try{
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({unit:'pt', format:'a4'});
      const margin = 40; let y = 48;

      // logo
      let logoData = null;
      try {
        const r = await fetch('/assets/logo.png');
        if (r.ok){
          const blob = await r.blob();
          logoData = await new Promise((res, rej) => {
            const reader = new FileReader();
            reader.onloadend = ()=> res(reader.result);
            reader.onerror = rej;
            reader.readAsDataURL(blob);
          });
        }
      } catch(e){ /* ignore */ }

      if (logoData) {
        try{ doc.addImage(logoData, 'PNG', margin, y-6, 90, 36); } catch(e){}
      }
      doc.setFontSize(16);
      doc.text('Resultado del análisis SEO rápido', margin + (logoData ? 110 : 0), y);
      y += 28;
      doc.setFontSize(11);
      doc.text(`URL: ${report.meta.url}`, margin, y); y += 16;
      doc.text(`Puntuación: ${report.score}`, margin, y); y += 16;
      doc.text(`Title length: ${report.meta.titleLength}`, margin, y); y += 16;
      doc.text(`H1 count: ${report.meta.h1Count}`, margin, y); y += 18;
      doc.text('Recomendaciones:', margin, y); y += 14;
      doc.setFontSize(10);
      const rec = (report.suggestions || []).join('\n\n') || 'No automatic suggestions';
      doc.text(doc.splitTextToSize(rec, 500), margin, y);
      const name = `seo-report-${(new Date()).toISOString().slice(0,19).replace(/[:T]/g,'-')}.pdf`;
      doc.save(name);
    } catch(e){
      console.error('generatePdf error', e);
      alert('Error al generar PDF.');
    }
  }

  // form submit handler
  form.addEventListener('submit', async function(e){
    e.preventDefault();
    const url = (target.value || '').trim();
    if (!url) return alert('Ingresa una URL válida.');

    submitBtn.disabled = true;
    submitBtn.textContent = t('seo_audit_button') + '…';
    seoSummary && (seoSummary.textContent = 'Solicitando análisis…');
    seoPretty && (seoPretty.innerHTML = '');
    seoJson && (seoJson.textContent = '');

    try {
      const resp = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ url })
      });
      if (!resp.ok){
        const txt = await resp.text();
        throw new Error('Server error: ' + resp.status + ' — ' + txt);
      }
      const json = await resp.json();
      // update UI
      resultsTitle && (resultsTitle.textContent = 'Resultado del análisis SEO rápido');
      seoSummary && (seoSummary.textContent = `Score: ${json.score} — Title len: ${json.meta.titleLength} — H1: ${json.meta.h1Count}`);
      renderPretty(json);
      showResults();

      // attach download action
      if (downloadPdf) downloadPdf.onclick = (ev)=>{ ev.preventDefault(); generatePdf(json); };
      // sendToEmail can open modal if you have it
      if (sendToEmailBtn) sendToEmailBtn.onclick = ()=>{ alert('Función enviar por email (configurada por separado).'); };

    } catch(err){
      console.error('Analysis error', err);
      seoSummary && (seoSummary.textContent = 'Error al obtener el análisis. Revisa la consola y logs.');
      alert('Error al analizar: ' + (err && err.message ? err.message : err));
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = t('seo_audit_button');
    }
  });

  // expose minimal API for other scripts if needed
  window.SEO_LANDING = {
    showResults, renderPretty
  };

  // set year in footer
  try { document.getElementById('year').textContent = new Date().getFullYear(); } catch(e){}

})();
