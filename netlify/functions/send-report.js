// netlify/functions/send-report.js
// Función Netlify: valida reCAPTCHA, envía email con SendGrid y guarda en Google Sheets (opcional).
// Responde siempre con JSON; logs detallados en Netlify para depuración.

const sg = require('@sendgrid/mail');
const fetch = require('node-fetch'); // usamos node-fetch para compatibilidad en Netlify
sg.setApiKey(process.env.SENDGRID_API_KEY || '');

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET || '';
const SHEET_WEBHOOK_URL = process.env.SHEET_WEBHOOK_URL || '';
const SHEET_WEBHOOK_SECRET = process.env.SHEET_WEBHOOK_SECRET || '';
const REPORT_RECIPIENT = process.env.REPORT_RECIPIENT_EMAIL || '';
const SENDER = process.env.SENDER_EMAIL || '';

function escapeHtml(str){ return String(str||'').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]); }

exports.handler = async function(event, context) {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ error: 'method_not_allowed' }) };
    }

    if (!process.env.SENDGRID_API_KEY) {
      console.error('Missing SENDGRID_API_KEY env var');
      return { statusCode: 500, body: JSON.stringify({ error: 'server_misconfigured', detail: 'Missing SENDGRID_API_KEY' }) };
    }

    let body;
    try { body = event.body ? JSON.parse(event.body) : {}; }
    catch (err) {
      console.error('Invalid JSON body', err);
      return { statusCode: 400, body: JSON.stringify({ error: 'invalid_json', message: err.message }) };
    }

    const { userName, userEmail, userMessage, report, recaptchaToken } = body || {};

    if (!userEmail) return { statusCode: 400, body: JSON.stringify({ error: 'missing_user_email' }) };
    if (!recaptchaToken) return { statusCode: 400, body: JSON.stringify({ error: 'missing_recaptcha' }) };

    // 1) Verificar reCAPTCHA server-side
    try {
      if (!RECAPTCHA_SECRET) {
        console.warn('No RECAPTCHA_SECRET set in env — skipping verification (not recommended for production).');
      } else {
        const params = new URLSearchParams();
        params.append('secret', RECAPTCHA_SECRET);
        params.append('response', recaptchaToken);

        const r = await fetch('https://www.google.com/recaptcha/api/siteverify', { method: 'POST', body: params });
        const rec = await r.json();
        if (!rec || rec.success !== true) {
          console.error('recaptcha failed', rec);
          return { statusCode: 403, body: JSON.stringify({ error: 'recaptcha_failed', details: rec }) };
        }
      }
    } catch (err) {
      console.error('recaptcha verify error', err);
      return { statusCode: 500, body: JSON.stringify({ error: 'recaptcha_error', message: String(err && err.message ? err.message : err) }) };
    }

    // 2) Preparar y enviar email por SendGrid
    try {
      const to = REPORT_RECIPIENT || SENDER; // si no defines recipient, se envía al mismo remitente
      if (!to) {
        console.error('No REPORT_RECIPIENT_EMAIL or SENDER configured');
        return { statusCode: 500, body: JSON.stringify({ error: 'email_not_configured' }) };
      }

      const subject = `Nuevo lead — Chequeo SEO — ${report && report.meta && report.meta.url ? report.meta.url : ''}`;
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
        <ul>${(report?.suggestions || []).map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul>
        <hr/>
        <pre style="white-space:pre-wrap;word-break:break-word;">${escapeHtml(JSON.stringify(report || {}, null, 2))}</pre>
      `;

      const msg = {
        to,
        from: SENDER,
        subject,
        html,
        replyTo: userEmail
      };

      // send and capture the response/error
      try {
        const resp = await sg.send(msg);
        console.log('sendgrid response', Array.isArray(resp) ? resp.map(x => x.statusCode) : resp);
      } catch (sgErr) {
        console.error('SendGrid send error', sgErr && sgErr.response ? sgErr.response.body : sgErr);
        // bubble back a clear error
        const detail = (sgErr && sgErr.response && sgErr.response.body) ? sgErr.response.body : String(sgErr);
        return { statusCode: 500, body: JSON.stringify({ error: 'sendgrid_error', detail }) };
      }
    } catch (err) {
      console.error('sendgrid prepare/send error', err);
      return { statusCode: 500, body: JSON.stringify({ error: 'sendgrid_prepare_error', message: String(err) }) };
    }

    // 3) Guardar en Google Sheets via webhook si está configurado
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
        const sheetJson = await sheetResp.text();
        if (!sheetResp.ok) {
          console.error('sheet webhook responded non-ok', sheetResp.status, sheetJson);
        } else {
          console.log('sheet webhook ok', sheetResp.status);
        }
      } catch (err) {
        console.error('sheet webhook exception', err);
      }
    } else {
      console.log('Sheet webhook not configured; skipping sheet save.');
    }

    // Si llegamos aquí, todo fue OK
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };

  } catch (fatal) {
    console.error('send-report fatal error', fatal);
    return { statusCode: 500, body: JSON.stringify({ error: 'fatal', message: String(fatal) }) };
  }
};
