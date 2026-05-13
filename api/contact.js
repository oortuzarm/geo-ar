// Vercel Serverless Function — receives contact form data and sends an email via Resend.
//
// Requires env var: RESEND_API_KEY  (Vercel dashboard → Settings → Environment Variables)
// From domain must be verified in Resend: https://resend.com/domains

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { name, company, email, message } = req.body ?? {}

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('[contact] RESEND_API_KEY not set')
    return res.status(503).json({ error: 'Email service not configured' })
  }

  const sentAt = new Date().toLocaleString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    dateStyle: 'full',
    timeStyle: 'short',
  })

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                max-width: 560px; color: #1e293b;">
      <div style="background: #0f172a; padding: 24px 28px; border-radius: 12px 12px 0 0;">
        <p style="margin: 0; font-size: 13px; font-weight: 700; color: #0ea5e9;
                  letter-spacing: 0.08em; text-transform: uppercase;">
          Ubyca · Nuevo mensaje de contacto
        </p>
      </div>
      <div style="background: #f8fafc; padding: 28px; border-radius: 0 0 12px 12px;
                  border: 1px solid #e2e8f0; border-top: none;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 7px 0; color: #64748b; font-size: 13px; width: 160px; vertical-align: top;">
              Nombre
            </td>
            <td style="padding: 7px 0; font-size: 14px; font-weight: 600; color: #0f172a;">
              ${escapeHtml(name)}
            </td>
          </tr>
          <tr>
            <td style="padding: 7px 0; color: #64748b; font-size: 13px; vertical-align: top;">
              Empresa / Proyecto
            </td>
            <td style="padding: 7px 0; font-size: 14px; color: #334155;">
              ${company?.trim() ? escapeHtml(company) : '<span style="color:#94a3b8;">—</span>'}
            </td>
          </tr>
          <tr>
            <td style="padding: 7px 0; color: #64748b; font-size: 13px; vertical-align: top;">
              Email
            </td>
            <td style="padding: 7px 0; font-size: 14px;">
              <a href="mailto:${escapeHtml(email)}" style="color: #0ea5e9; text-decoration: none;">
                ${escapeHtml(email)}
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 7px 0; color: #64748b; font-size: 13px; vertical-align: top;">
              Enviado
            </td>
            <td style="padding: 7px 0; font-size: 13px; color: #94a3b8;">
              ${sentAt}
            </td>
          </tr>
        </table>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="margin: 0 0 10px; font-size: 13px; font-weight: 600; color: #0f172a;">
          Mensaje
        </p>
        <p style="margin: 0; font-size: 14px; color: #475569; white-space: pre-wrap;
                  line-height: 1.6;">
          ${escapeHtml(message)}
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0 16px;" />
        <p style="margin: 0; font-size: 12px; color: #94a3b8;">
          ubyca.com · Este email fue enviado desde el formulario de contacto público.
        </p>
      </div>
    </div>
  `

  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Ubyca Contacto <contacto@ubyca.com>',
      to: ['osvaldo@ubyca.com'],
      reply_to: email.trim(),
      subject: `Nuevo contacto: ${name.trim()}${company?.trim() ? ` — ${company.trim()}` : ''}`,
      html,
    }),
  })

  if (!resendRes.ok) {
    const errData = await resendRes.json().catch(() => ({}))
    console.error('[contact] Resend error:', resendRes.status, errData)
    return res.status(502).json({ error: 'Failed to send email' })
  }

  return res.status(200).json({ ok: true })
}
