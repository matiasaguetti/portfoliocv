// assets/seo-landing.js
// Cliente: envía URL a /.netlify/functions/seo-analyze (configurable), recibe JSON y permite descargar PDF.
// Recomendación: proteger el endpoint serverless con token / reCAPTCHA (ver instrucciones).

(async function(){
  const form = document.getElementById('seoForm');
  const target = document.getElementById('targetUrl');
  const submitBtn = document.getElementById('seoSubmit');
  const output = document.getElementById('seoOutput');
  const summary = document.getElementById('seoSummary');
  const seoJson = document.getElementById('seoJson');
  const downloadPdf = document.getElementById('downloadPdf');
  const sendToEmail = document.getElementById('sendToEmail');
  const exampleScan = document.getElementById('exampleScan');

  const FUNCTION_URL = 'https://TU-SITE-NETLIFY.netlify.app/.netlify/functions/seo-analyze'; 
  // --- REEMPLAZAR por tu endpoint Netlify al desplegar. ---

  exampleScan.addEventListener('click', (e) => {
    e.preventDefault();
    target.value = 'https://villaszamna.com';
  });

  form.addEventListener('submit', async (e)=> {
    e.preventDefault();
    const url = (target.value || '').trim();
    if (!url) return alert('Ingresa una URL válida.');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Analizando...';
    output.style.display = 'block';
    summary.textContent = 'Solicitando análisis...';
    seoJson.textContent = '';

    try {
      const resp = await fetch(FUNCTION_URL, {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ url })
      });
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error('Error server: ' + resp.status + ' — ' + txt);
      }
      const json = await resp.json();
      // Mostrar resumen legible
      summary.innerHTML = `
        <strong>URL:</strong> ${json.meta.url} • <strong>Score:</strong> ${json.score || '—'} • <strong>Title length:</strong> ${json.meta.titleLength || 0} • <strong>H1:</strong> ${json.meta.h1Count}
      `;
      seoJson.textContent = JSON.stringify(json, null, 2);

      // Preparar PDF (client-side) con jsPDF
      downloadPdf.onclick = (ev) => {
        ev.preventDefault();
        generatePdf(json);
      };

      // enviar por email (mailto) con resumen
      sendToEmail.onclick = (ev) => {
        ev.preventDefault();
        const subject = encodeURIComponent('Solicitud de auditoría SEO — ' + json.meta.url);
        const body = encodeURIComponent(`Resumen SEO rápido:\nScore: ${json.score}\nTitle: ${json.meta.title}\nMeta len: ${json.meta.metaDescLength}\nH1: ${json.meta.h1Count}\nImages without alt: ${json.meta.imagesMissingAlt}\nWord count: ${json.meta.wordCount}\n\nFull JSON attached in body:\n${JSON.stringify(json, null, 2)}\n`);
        const mailto = `mailto:aguettimatias@gmail.com?subject=${subject}&body=${body}`;
        window.location.href = mailto;
      };

    } catch (err) {
      summary.textContent = 'Error: ' + err.message;
      seoJson.textContent = '';
      console.error(err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Analizar';
    }
  });

  // PDF generator using jsPDF UMD (loaded via CDN)
  function generatePdf(report) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({unit:'pt', format:'a4'});
    const title = `Chequeo SEO rápido — ${report.meta.url}`;
    doc.setFontSize(16);
    doc.text(title, 40, 60);
    doc.setFontSize(11);
    const lines = [
      `Score: ${report.score}`,
      `Title: ${report.meta.title || '-'}`,
      `Title length: ${report.meta.titleLength}`,
      `Meta length: ${report.meta.metaDescLength}`,
      `H1 count: ${report.meta.h1Count}`,
      `Images total: ${report.meta.imagesTotal} (sin alt: ${report.meta.imagesMissingAlt})`,
      `Word count: ${report.meta.wordCount}`,
      `Internal links: ${report.meta.internalLinks}`,
      '',
      'Recomendaciones:',
      ...(report.suggestions || [])
    ];
    doc.setFontSize(10);
    doc.text(lines, 40, 90, { maxWidth: 520, lineHeightFactor:1.2 });
    const filename = `seo-quick-${slugify(report.meta.url)}.pdf`;
    doc.save(filename);
  }

  function slugify(s){ return s.replace(/https?:\/\//,'').replace(/[^a-z0-9]+/ig,'-').replace(/^-|-$/g,'').toLowerCase(); }

})();
