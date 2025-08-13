// netlify/functions/send-report.js
const sg = require('@sendgrid/mail');
const fetch = require('node-fetch'); // node >=18 Netlify ya incluye fetch, pero require para compatibilidad
sg.setApiKey(process.env.SENDGRID_API_KEY);

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;
const SHEET_WEBHOOK_URL = process.env.SHEET_WEBHOOK_URL;
const SHEET_WEBHOOK_SECRET = process.env.SHEET_WEBHOOK_SECRET;
const REPORT_RECIPIENT = process.env.REPORT_RECIPIENT_EMAIL;
const SENDER = process.env.SENDER_EMAIL;

function escapeHtml(str){ return String(str||'').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]); }

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: JSON.stringify({ error: 'method_not_allowed' }) };

  let body;
  try { body = event.body ? JSON.parse(event.body) : {}; }
  catch { return { statusCode: 400, body: JSON.stringify({ error: 'invalid_json' }) }; }

  const { userName, userEmail, userMessage, report, recaptchaToken } = body;
  if (!userEmail) return { statusCode: 400, body: JSON.stringify({ error: 'missing_user_email' }) };
  if (!recaptchaToken) return { statusCode: 400, body: JSON.stringify({ error: 'missing_recaptcha' }) };

  // 1) Verify reCAPTCHA server-side
  try {
    const params = new URLSearchParams();
    params.append('secret', RECAPTCHA_SECRET);
    params.append('response', recaptchaToken);

    const r = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      body: params
    });
    const rec = await r.json();
    if (!rec.success) {
      return { statusCode: 403, body: JSON.stringify({ error: 'recaptcha_failed', details: rec }) };
    }
    // Optionally: if rec.score exists (v3) check threshold
  } catch (err) {
    console.error('recaptcha verify error', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'recaptcha_error' }) };
  }

  // 2) Send email via SendGrid
  try {
    const subject = `Nuevo lead — Chequeo SEO — ${report?.meta?.url || ''}`;
    const html = `
      <h3>Nuevo lead — Chequeo SEO</h3>
      <p><strong>Nombre:</strong> ${escapeHtml(userName || '-')}</p>
      <p><strong>Email:</strong> ${escapeHtml(userEmail)}</p>
      <p><strong>Mensaje:</strong> ${escapeHtml(userMessage || '-')}</p>
      <hr/>
      <h4>Resumen del reporte</h4>
      <p><strong>URL:</strong> ${escapeHtml(report?.meta?.url || '')}</p>
      <p><strong>Score:</strong> ${report?.score || ''}</p>
      <p><strong>Recomendaciones:</strong></p>
      <ul>${(report?.suggestions || []).map(s=>`<li>${escapeHtml(s)}</li>`).join('')}</ul>
      <hr/>
      <pre style="white-space:pre-wrap;word-break:break-word;">${escapeHtml(JSON.stringify(report || {}, null, 2))}</pre>
    `;

    const msg = {
      to: REPORT_RECIPIENT,
      from: SENDER,
      subject,
      html,
      replyTo: userEmail
    };

    await sg.send(msg);
  } catch (err) {
    console.error('sendgrid error', err);
    // don't stop: try saving to sheet, but inform client of partial failure
    // return { statusCode: 500, body: JSON.stringify({ error: 'sendgrid_error', message: String(err) }) };
  }

  // 3) Save to Google Sheets via Apps Script webhook (if configured)
  if (SHEET_WEBHOOK_URL && SHEET_WEBHOOK_SECRET) {
    try {
      const sheetResp = await fetch(SHEET_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: SHEET_WEBHOOK_SECRET,
          name: userName,
          email: userEmail,
          message: userMessage,
          url: report?.meta?.url || '',
          score: report?.score || '',
          raw: report || {}
        })
      });
      const sheetJson = await sheetResp.json();
      if (!sheetResp.ok) {
        console.error('sheet webhook error', sheetJson);
      }
    } catch (err) {
      console.error('sheet webhook exception', err);
    }
  }

  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};
