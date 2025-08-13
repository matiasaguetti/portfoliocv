// netlify/functions/seo-analyze.js
const { JSDOM } = require('jsdom');

exports.handler = async function(event, context) {
  // CORS: para pruebas usamos '*' — en producción restringe a tu dominio (ej. https://matiasaguet-ti.netlify.app)
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-webhook-secret',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Responder preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Parse body
  let body;
  try {
    body = event.body ? JSON.parse(event.body) : {};
  } catch (err) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'invalid_json', message: err.message }) };
  }

  if (!body || !body.url) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'missing_url' }) };
  }

  // Bloqueo SSRF básico (no permitir localhost)
  try {
    const u = new URL(body.url);
    const hostname = u.hostname;
    if (['127.0.0.1','localhost','::1'].includes(hostname)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'disallowed_host' }) };
    }
  } catch (err) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'invalid_url', message: err.message }) };
  }

  try {
    // Fetch remoto
    const resp = await fetch(body.url, {
      redirect: 'follow',
      headers: { 'User-Agent': 'SEO-Checker/1.0 (+https://aguettimatias.com)' }
    });

    if (!resp.ok) {
      return { statusCode: 502, headers, body: JSON.stringify({ error: 'fetch_failed', status: resp.status }) };
    }

    const html = await resp.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const title = (doc.querySelector('title') || {}).textContent?.trim() || '';
    const metaDesc = (doc.querySelector('meta[name="description"]') || {}).content || '';
    const h1s = Array.from(doc.querySelectorAll('h1'));
    const images = Array.from(doc.querySelectorAll('img'));
    const imagesMissingAlt = images.filter(i => !(i.getAttribute('alt')||'').trim()).length;
    const bodyText = doc.body ? (doc.body.textContent || '') : '';
    const wordCount = bodyText.trim().split(/\s+/).filter(Boolean).length;
    const internalLinks = Array.from(doc.querySelectorAll('a[href]')).filter(a=>{
      try { return (new URL(a.href, body.url)).hostname === (new URL(body.url)).hostname; } catch { return false; }
    }).length;
    const viewportMeta = !!doc.querySelector('meta[name="viewport"]');

    // Scoring simple
    let score = 100;
    const issues = [];
    const tlen = title.length;
    if (!tlen) { score -= 25; issues.push('title-missing'); }
    else if (tlen < 30) { score -= 8; issues.push('title-too-short'); }
    else if (tlen > 70) { score -= 8; issues.push('title-too-long'); }

    const mlen = metaDesc.length;
    if (!mlen) { score -= 18; issues.push('meta-missing'); }
    else if (mlen < 50) { score -= 6; issues.push('meta-too-short'); }
    else if (mlen > 320) { score -= 6; issues.push('meta-too-long'); }

    if (h1s.length === 0) { score -= 10; issues.push('h1-missing'); }
    else if (h1s.length > 1) { score -= 6; issues.push('h1-multiple'); }
    if (imagesMissingAlt > 0) { score -= Math.min(15, Math.ceil(imagesMissingAlt * 2)); issues.push('images-alt-missing'); }
    if (wordCount < 250) { score -= 12; issues.push('low-wordcount'); }
    if (!viewportMeta) { score -= 10; issues.push('no-viewport-meta'); }
    if (internalLinks < 3) { score -= 6; issues.push('few-internal-links'); }
    if (score < 0) score = 0;

    const suggestions = [];
    if (issues.includes('title-missing')) suggestions.push('Añadir un <title> (50–60 caracteres) con la keyword principal.');
    if (issues.includes('meta-missing')) suggestions.push('Agregar meta description clara (≈120–160 caracteres).');
    if (issues.includes('h1-missing')) suggestions.push('Agregar un único H1 que defina el tema principal.');
    if (issues.includes('images-alt-missing')) suggestions.push('Rellenar atributos alt en imágenes importantes.');
    if (issues.includes('low-wordcount')) suggestions.push('Aumentar contenido útil (objetivo > 300 palabras).');

    const result = {
      meta: {
        url: body.url,
        title,
        titleLength: tlen,
        metaDesc,
        metaDescLength: mlen,
        h1Count: h1s.length,
        imagesTotal: images.length,
        imagesMissingAlt,
        wordCount,
        internalLinks,
        viewportMeta
      },
      score,
      issues,
      suggestions,
      fetchedStatus: resp.status
    };

    return { statusCode: 200, headers, body: JSON.stringify(result) };

  } catch (err) {
    console.error('seo-analyze error:', err && err.message ? err.message : err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'exception', message: String(err && err.message ? err.message : err) }) };
  }
};
