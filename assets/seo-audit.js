/* seo-audit.js
   Quick client-side SEO snapshot - analyzes the current page DOM (works on pages within this site)
   Produces a score and simple suggestions, and allows sending a prefilled email for a full audit.
*/

(function(){
  // Utility
  function textLength(str){ return str ? str.trim().length : 0; }
  function wordCount(text){ return text ? text.trim().split(/\s+/).filter(Boolean).length : 0; }

  // Analyze current document
  function analyzePage() {
    const title = document.title || '';
    const metaDesc = (document.querySelector('meta[name="description"]') || {}).content || '';
    const h1s = [...document.querySelectorAll('h1')];
    const images = [...document.images];
    const imagesMissingAlt = images.filter(i => !(i.getAttribute('alt')||'').trim()).length;
    const internalLinks = [...document.querySelectorAll('a[href]')].filter(a=>{
      try { return a.hostname === location.hostname; } catch(e){ return false; }
    }).length;
    const viewportMeta = !!document.querySelector('meta[name="viewport"]');
    const bodyText = document.body ? document.body.innerText : '';
    const wc = wordCount(bodyText);

    // Heuristics / scoring (weights can be tuned)
    let score = 100;
    const issues = [];

    // Title length: ideal ~50-60 chars (heuristic)
    const tlen = textLength(title);
    if (tlen === 0) { score -= 25; issues.push('title-missing'); }
    else if (tlen < 30) { score -= 8; issues.push('title-too-short'); }
    else if (tlen > 70) { score -= 8; issues.push('title-too-long'); }

    // Meta description: presence & reasonable length (50-160 chars)
    const mlen = textLength(metaDesc);
    if (mlen === 0) { score -= 18; issues.push('meta-missing'); }
    else if (mlen < 50) { score -= 6; issues.push('meta-too-short'); }
    else if (mlen > 320) { score -= 6; issues.push('meta-too-long'); }

    // H1s: prefer exactly 1 (heuristic)
    if (h1s.length === 0) { score -= 10; issues.push('h1-missing'); }
    else if (h1s.length > 1) { score -= 6; issues.push('h1-multiple'); }

    // Images alt
    if (imagesMissingAlt > 0) {
      const delta = Math.min(15, Math.ceil(imagesMissingAlt * 2));
      score -= delta;
      issues.push('images-alt-missing');
    }

    // Word count (content depth)
    if (wc < 250) { score -= 12; issues.push('low-wordcount'); }

    // Viewport (mobile friendly)
    if (!viewportMeta) { score -= 10; issues.push('no-viewport-meta'); }

    // Internal links - if none, reduce slightly
    if (internalLinks < 3) { score -= 6; issues.push('few-internal-links'); }

    if (score < 0) score = 0;

    // Build suggestions
    const suggestions = [];
    if (issues.includes('title-missing')) suggestions.push('Añadir un <title> relevante (50–60 caracteres) que incluya la keyword principal.');
    if (issues.includes('title-too-short')) suggestions.push('Haz título más descriptivo (30–60 caracteres).');
    if (issues.includes('title-too-long')) suggestions.push('Acorta el título o mueve marca al final (evita truncado).');

    if (issues.includes('meta-missing')) suggestions.push('Agregar meta description clara (≈120–160 caracteres) que funcione como "anuncio" en buscadores.');
    if (issues.includes('meta-too-short')) suggestions.push('Amplía la meta para resumir la propuesta de valor.');
    if (issues.includes('meta-too-long')) suggestions.push('Acortar la meta para evitar truncamiento en SERPs.');

    if (issues.includes('h1-missing')) suggestions.push('Agregar un único H1 que defina claramente el tema principal de la página.');
    if (issues.includes('h1-multiple')) suggestions.push('Revisar y mantener solo un H1 por página cuando sea posible.');

    if (issues.includes('images-alt-missing')) suggestions.push('Rellenar atributos alt en imágenes importantes para accesibilidad y SEO.');
    if (issues.includes('low-wordcount')) suggestions.push('Aumentar contenido útil en la página (objetivo > 300 palabras para páginas de temática comercial).');
    if (issues.includes('no-viewport-meta')) suggestions.push('Incluir meta viewport para mejorar experiencia móvil.');
    if (issues.includes('few-internal-links')) suggestions.push('Agregar enlaces internos relevantes para distribuir autoridad y mejorar navegación.');

    // Build brief report
    return {
      meta: {
        title, titleLength: tlen,
        metaDesc, metaDescLength: mlen,
        h1Count: h1s.length,
        imagesTotal: images.length,
        imagesMissingAlt,
        wordCount: wc,
        internalLinks,
        viewportMeta
      },
      score,
      suggestions,
      issues
    };
  }

  // UI: create modal once
  function createModal() {
    if (document.getElementById('seo-audit-modal')) return;
    const modalHtml = `
      <div id="seo-audit-modal" class="seo-modal" role="dialog" aria-modal="true" aria-hidden="true" style="display:none;">
        <div class="seo-modal-backdrop" id="seo-modal-backdrop"></div>
        <div class="seo-modal-panel" role="document" aria-labelledby="seo-modal-title">
          <button class="seo-modal-close" id="seo-modal-close" aria-label="Cerrar">✕</button>
          <h3 id="seo-modal-title">Chequeo SEO rápido</h3>
          <div id="seo-modal-body" class="seo-modal-body">Cargando...</div>
          <div class="seo-modal-actions">
            <a id="seo-mail-link" class="btn primary" href="#">Solicitar auditoría completa</a>
            <button id="seo-modal-copy" class="btn outline">Copiar resumen</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // minimal styles (scoped)
    const style = document.createElement('style');
    style.innerHTML = `
      .seo-modal { position:fixed; inset:0; z-index:1200; font-family:Inter,Arial,Helvetica,sans-serif; }
      .seo-modal-backdrop { position:absolute; inset:0; background:rgba(0,0,0,0.6); }
      .seo-modal-panel { position:relative; max-width:820px; margin:6vh auto; background:#0b0b0b; color:#eaeaea; border-radius:12px; padding:20px; box-shadow:0 20px 60px rgba(0,0,0,0.7); z-index:1201; }
      .seo-modal-close { position:absolute; right:12px; top:12px; background:transparent; border:none; color:#999; font-size:18px; cursor:pointer; }
      .seo-modal-body { margin-top:8px; }
      .seo-metric { display:flex; gap:12px; align-items:center; margin:8px 0; }
      .seo-score { font-size:2.2rem; font-weight:700; color:#fff; }
      .seo-suggest { margin-top:12px; color:var(--muted); }
      .seo-modal-actions { margin-top:16px; display:flex; gap:10px; }
      .btn { padding:8px 12px; border-radius:8px; text-decoration:none; display:inline-block; font-weight:600; }
      .btn.primary { background:#111; color:#fff; border:1px solid rgba(255,255,255,0.06); }
      .btn.outline { background:transparent; color:var(--muted); border:1px solid rgba(255,255,255,0.06); }
    `;
    document.head.appendChild(style);

    // events
    document.getElementById('seo-modal-close').addEventListener('click', closeModal);
    document.getElementById('seo-modal-backdrop')?.addEventListener('click', closeModal);
  }

  function openModal(report) {
    createModal();
    const modal = document.getElementById('seo-audit-modal');
    const body = document.getElementById('seo-modal-body');
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden','false');

    // Build HTML
    const m = report.meta;
    const suggestionsHtml = report.suggestions.length ? '<ul>' + report.suggestions.map(s => `<li>${s}</li>`).join('') + '</ul>' : '<p class="seo-suggest">Sin acciones urgentes detectadas.</p>';

    body.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap">
        <div>
          <div class="seo-metric"><div class="seo-score">${report.score}</div><div style="font-size:.95rem;color:var(--muted)">Puntuación SEO (snapshot)</div></div>
        </div>
        <div style="text-align:right">
          <div style="font-size:.95rem;color:var(--muted)">Título: <strong>${escapeHtml(m.title||'—')}</strong> (${m.titleLength} chars)</div>
          <div style="font-size:.95rem;color:var(--muted)">Meta: ${m.metaDescLength} chars</div>
        </div>
      </div>

      <hr style="border-color:rgba(255,255,255,0.04)"/>

      <div>
        <div class="seo-metric"><strong>H1:</strong> <span style="color:var(--muted)">${m.h1Count}</span></div>
        <div class="seo-metric"><strong>Imágenes:</strong> <span style="color:var(--muted)">${m.imagesTotal} total, ${m.imagesMissingAlt} sin alt</span></div>
        <div class="seo-metric"><strong>Palabras:</strong> <span style="color:var(--muted)">${m.wordCount}</span></div>
        <div class="seo-metric"><strong>Enlaces internos:</strong> <span style="color:var(--muted)">${m.internalLinks}</span></div>
        <div class="seo-metric"><strong>Viewport meta:</strong> <span style="color:var(--muted)">${m.viewportMeta ? 'OK' : 'No'}</span></div>
      </div>

      <div style="margin-top:12px"><strong>Recomendaciones rápidas</strong>${suggestionsHtml}</div>
    `;

    // mailto link: prefill subject + body
    const subject = encodeURIComponent('Solicitud de auditoría SEO — ' + location.hostname);
    const bodyText = encodeURIComponent('Resumen rápido (automático):\nScore: ' + report.score + '\nTítulo: ' + m.title + '\nMeta length: ' + m.metaDescLength + '\nH1s: ' + m.h1Count + '\nImágenes sin alt: ' + m.imagesMissingAlt + '\nPalabras: ' + m.wordCount + '\n\nRecomendaciones:\n' + (report.suggestions.join('\n') || 'Ninguna') + '\n\nURL: ' + location.href);
    const mailto = `mailto:aguettimatias@gmail.com?subject=${subject}&body=${bodyText}`;
    document.getElementById('seo-mail-link').setAttribute('href', mailto);

    // copy button
    document.getElementById('seo-modal-copy').onclick = () => {
      const text = `SEO snapshot — ${location.href}\nScore: ${report.score}\nRecommendations:\n- ${report.suggestions.join('\n- ')}`;
      navigator.clipboard?.writeText(text).then(()=> alert('Resumen copiado al portapapeles.'));
    };
  }

  function closeModal(){
    const modal = document.getElementById('seo-audit-modal');
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden','true');
  }

  // Escape helper
  function escapeHtml(str){ return String(str||'').replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]; }); }

  // init: hook button
  function initSeoWidget(){
    const btn = document.getElementById('seo-quick-check-btn');
    if (!btn) return;
    btn.addEventListener('click', function(){
      const report = analyzePage();
      openModal(report);
    });
  }

  // wait for DOM
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initSeoWidget);
  else initSeoWidget();

})();
