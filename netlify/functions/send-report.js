// netlify/functions/send-report.js
const sg = require('@sendgrid/mail');
sg.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async function(event, context) {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: JSON.stringify({ error: 'method_not_allowed' }) };

    const body = event.body ? JSON.parse(event.body) : {};
    const { userName, userEmail, userMessage, report } = body;

    if (!userEmail) return { statusCode: 400, body: JSON.stringify({ error: 'missing_user_email' }) };

    const recipient = process.env.REPORT_RECIPIENT_EMAIL;
    const sender = process.env.SENDER_EMAIL;

    if (!recipient || !sender) return { statusCode: 500, body: JSON.stringify({ error: 'email_not_configured' }) };

    const subject = `Nuevo lead — Chequeo SEO rápido — ${report && report.meta && report.meta.url ? report.meta.url : ''}`;
    const html = `
      <h3>Nuevo lead — Chequeo SEO rápido</h3>
      <p><strong>Nombre:</strong> ${escapeHtml(userName || '-')}</p>
      <p><strong>Email:</strong> ${escapeHtml(userEmail)}</p>
      <p><strong>Mensaje:</strong> ${escapeHtml(userMessage || '-')}</p>
      <hr/>
      <h4>Resumen del reporte</h4>
      <p><strong>URL:</strong> ${escapeHtml(report && report.meta && report.meta.url ? report.meta.url : '')}</p>
      <p><strong>Score:</strong> ${report && report.score ? report.score : ''}</p>
      <p><strong>Title:</strong> ${escapeHtml(report && report.meta && report.meta.title ? report.meta.title : '')}</p>
      <p><strong>Recomendaciones:</strong></p>
      <ul>${(report && report.suggestions ? report.suggestions.map(s=>`<li>${escapeHtml(s)}</li>`).join('') : '')}</ul>
      <hr/>
      <pre style="white-space:pre-wrap;word-break:break-word;">${escapeHtml(JSON.stringify(report || {}, null, 2))}</pre>
    `;

    const msg = {
      to: recipient,
      from: sender,
      subject,
      html,
      replyTo: userEmail
    };

    await sg.send(msg);
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('send-report error', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'send_error', message: String(err && err.message ? err.message : err) }) };
  }
};

function escapeHtml(str){ return String(str||'').replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]; }); }
