// assets/seo-landing.js (Sustituye el archivo actual)
/* global jspdf */ // jsPDF viene por CDN en la página
(async function(){
  const form = document.getElementById('seoForm');
  const target = document.getElementById('targetUrl');
  const submitBtn = document.getElementById('seoSubmit');
  const output = document.getElementById('seoOutput');
  const summary = document.getElementById('seoSummary');
  const seoPretty = document.getElementById('seoPretty');
  const seoJson = document.getElementById('seoJson');
  const downloadPdf = document.getElementById('downloadPdf');
  const sendToEmailBtn = document.getElementById('sendToEmail');
  const exampleScan = document.getElementById('exampleScan');

  const leadModal = document.getElementById('leadModal');
  const leadBackdrop = document.getElementById('leadBackdrop');
  const leadClose = document.getElementById('leadClose');
  const leadCancel = document.getElementById('leadCancel');
  const leadForm = document.getElementById('leadForm');
  const leadSubmit = document.getElementById('leadSubmit');
  const leadStatus = document.getElementById('leadStatus');

  // ENDPOINTS
  const FUNCTION_URL = 'https://matiasaguet-ti.netlify.app/.netlify/functions/seo-analyze';
  const SEND_REPORT_URL = 'https://matiasaguet-ti.netlify.app/.netlify/functions/send-report';

  exampleScan.addEventListener('click', (e) => {
    e.preventDefault();
    target.value = 'https://villaszamna.com';
  });

  function showOutput() {
    output.style.display = 'block';
  }

  function escapeHtml(str){ return String(str||'').replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]; }); }

  function renderPretty(result){
    // Clear
    seoPretty.innerHTML = '';

    // Card with key metrics
    const card = document.createElement('div');
    card.style.display = 'grid';
    card.style.gridTemplateColumns = '1fr 1fr';
    card.style.gap = '12px';
    card.style.alignItems = 'start';

    const left = document.createElement('div');
    left.innerHTML = `
      <div style="font-weight:700; font-size:1.2rem; color:#fff; margin-bottom:6px;">Puntuación: ${result.score}</div>
      <div class="small muted">URL: <a href="${escapeHtml(result.meta.url)}" target="_blank" rel="noopener" style="color:inherit">${escapeHtml(result.meta.url)}</a></div>
      <div class="small muted">Título: ${escapeHtml(result.meta.title || '—')}</div>
      <div class="small muted">Meta (len): ${result.meta.metaDescLength}</div>
      <div class="small muted">H1: ${result.meta.h1Count}</div>
      <div class="small muted">Imágenes: ${result.meta.imagesTotal} (sin alt: ${result.meta.imagesMissingAlt})</div>
    `;

    const right = document.createElement('div');
    right.innerHTML = `
      <div class="small muted">Palabras: ${result.meta.wordCount}</div>
      <div class="small muted">Enlaces internos: ${result.meta.internalLinks}</div>
      <div class="small muted">Viewport: ${result.meta.viewportMeta ? 'OK' : 'No'}</div>
      <div style="margin-top:10px;"><strong>Acciones recomendadas</strong></div>
      <ul style="margin:6px 0 0 16px; color:var(--muted)">
        ${(result.suggestions || []).map(s=>`<li>${escapeHtml(s)}</li>`).join('')}
      </ul>
    `;

    card.appendChild(left);
    card.appendChild(right);
    seoPretty.appendChild(card);

    // JSON technical in pre
    seoJson.textContent = JSON.stringify(result, null, 2);
  }

  form.addEventListener('submit', async (e)=> {
    e.preventDefault();
    const url = (target.value || '').trim();
    if (!url) return alert('Ingresa una URL válida.');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Analizando...';
    showOutput();
    summary.textContent = 'Solicitando análisis...';
    seoPretty.innerHTML = '';
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
      summary.innerHTML = `<strong>Score:</strong> ${json.score} — <strong>Title len:</strong> ${json.meta.titleLength} — <strong>H1:</strong> ${json.meta.h1Count}`;
      renderPretty(json);

      // Preparar PDF
      downloadPdf.onclick = (ev) => {
        ev.preventDefault();
        generatePdf(json);
      };

      // Envío: abrir modal para capturar email
      sendToEmailBtn.onclick = (ev) => {
        ev.preventDefault();
        // store latest json on modal element for later
        leadModal.dataset.report = JSON.stringify(json);
        leadStatus.style.display = 'none';
        leadModal.style.display = 'block';
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

  // Modal controls
  leadClose.onclick = leadCancel.onclick = () => { leadModal.style.display = 'none'; };
  leadBackdrop.onclick = () => { leadModal.style.display = 'none'; };

  leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('leadName').value.trim();
    const email = document.getElementById('leadEmail').value.trim();
    const message = document.getElementById('leadMessage').value.trim();
    if (!email) return alert('Por favor ingresa tu correo.');

    leadSubmit.disabled = true;
    leadStatus.style.display = 'block';
    leadStatus.textContent = 'Enviando reporte...';

    const jsonReport = leadModal.dataset.report ? JSON.parse(leadModal.dataset.report) : null;

    // Enviar a la función Netlify que envía email (necesita SENDGRID_API_KEY en Netlify)
    try {
      const resp = await fetch(SEND_REPORT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: name, userEmail: email, userMessage: message, report: jsonReport
        })
      });
      const j = await resp.json();
      if (!resp.ok) {
        throw new Error(j && j.error ? j.error : 'error sending');
      }
      leadStatus.textContent = 'Reporte enviado correctamente. Te contactaré pronto.';
      // cerrar modal luego de 2s
      setTimeout(()=> { leadModal.style.display = 'none'; }, 1800);
    } catch (err) {
      console.error(err);
      leadStatus.textContent = 'Error al enviar. Por favor intenta nuevamente o envía un email a aguettimatias@gmail.com';
    } finally {
      leadSubmit.disabled = false;
    }
  });

  // PDF generator using jsPDF UMD
  async function generatePdf(report) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({unit:'pt', format:'a4'});
    const margin = 40;
    let y = 48;

    // fetch logo and convert to dataURL
    const logoData = await fetchImageAsDataURL('/assets/logo.png').catch(()=>null);

    if (logoData) {
      try {
        doc.addImage(logoData, 'PNG', margin, y-8, 90, 36); // logo
      } catch(e){ /* ignore if addImage fails */ }
    }

    doc.setFontSize(18);
    doc.text('Chequeo SEO rápido', margin + (logoData ? 110 : 0), y);
    y += 30;

    doc.setFontSize(11);
    doc.text(`URL: ${report.meta.url}`, margin, y); y += 18;
    doc.text(`Puntuación: ${report.score}`, margin, y); y += 18;
    doc.text(`Título (${report.meta.titleLength} chars): ${truncateText(report.meta.title, 140)}`, margin, y); y += 18;
    doc.text(`Meta (len ${report.meta.metaDescLength}): ${truncateText(report.meta.metaDesc || '-',140)}`, margin, y); y += 18;
    doc.text(`H1s: ${report.meta.h1Count} • Imágenes: ${report.meta.imagesTotal} (sin alt: ${report.meta.imagesMissingAlt})`, margin, y); y += 18;
    doc.text(`Palabras: ${report.meta.wordCount} • Enlaces internos: ${report.meta.internalLinks}`, margin, y); y += 22;

    doc.setFontSize(12);
    doc.text('Recomendaciones principales:', margin, y); y += 14;
    doc.setFontSize(10);
    const recText = (report.suggestions || []).map((s,i)=>`${i+1}. ${s}`).join('\n\n');
    doc.text(doc.splitTextToSize(recText || 'Sin recomendaciones automáticas.', 520), margin, y);
    y += 16 + (doc.splitTextToSize(recText,520).length * 12);

    // Footer small JSON snapshot
    doc.setFontSize(9);
    doc.text('Resumen técnico (JSON):', margin, y + 10);
    const shortJson = JSON.stringify(report, null, 2).slice(0, 3000); // limit
    doc.text(doc.splitTextToSize(shortJson, 520), margin, y + 26);

    const filename = `seo-quick-${slugify(report.meta.url)}.pdf`;
    doc.save(filename);
  }

  // Helpers
  function slugify(s){ return s.replace(/https?:\/\//,'').replace(/[^a-z0-9]+/ig,'-').replace(/^-|-$/g,'').toLowerCase(); }
  function truncateText(s, n){ if(!s) return ''; return s.length>n ? s.slice(0,n-1)+'…' : s; }

  async function fetchImageAsDataURL(path) {
    // path must be accessible from site root e.g. /assets/logo.png
    const res = await fetch(path);
    if (!res.ok) throw new Error('image fetch failed');
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

})();
