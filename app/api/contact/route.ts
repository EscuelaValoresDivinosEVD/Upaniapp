import { Resend } from 'resend'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CATEGORY_LABELS: Record<string, string> = {
  problema: 'Reporte de problema',
  sugerencia: 'Sugerencia',
  aportes: 'Aportes',
}

export async function POST(req: Request) {
  try {
    const { name, email, category, message } = await req.json()

    if (!name?.trim() || !email?.trim() || !category || !message?.trim()) {
      return Response.json({ ok: false, error: 'Faltan campos requeridos' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return Response.json({ ok: false, error: 'Email inválido' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error('RESEND_API_KEY not configured')
      return Response.json({ ok: false, error: 'Servicio de correo no configurado' }, { status: 503 })
    }

    const resend = new Resend(apiKey)
    const categoryLabel = CATEGORY_LABELS[category] ?? category
    const from = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'
    const to = 'upaninews@evdsky.com'

    const { error } = await resend.emails.send({
      from: `Upaninews App <${from}>`,
      to,
      replyTo: `${name.trim()} <${email.trim()}>`,
      subject: `[${categoryLabel}] de ${name.trim()}`,
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#faf6ff;border-radius:12px">
          <div style="text-align:center;margin-bottom:28px">
            <p style="font-size:0.75rem;letter-spacing:0.2em;text-transform:uppercase;color:#7A5A9A;margin:0">Upaninews</p>
            <h1 style="font-family:Georgia,serif;font-size:1.5rem;color:#2E0F2F;margin:8px 0 0">${categoryLabel}</h1>
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
            <tr>
              <td style="padding:10px 14px;background:#f0e8fa;border-radius:8px 8px 0 0;border-bottom:1px solid #ddd5f0">
                <span style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.1em;color:#7A5A9A">Nombre</span><br>
                <strong style="color:#2E0F2F;font-size:0.95rem">${name.trim()}</strong>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 14px;background:#f0e8fa;border-bottom:1px solid #ddd5f0">
                <span style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.1em;color:#7A5A9A">Email</span><br>
                <a href="mailto:${email.trim()}" style="color:#CE9EF0;font-size:0.95rem">${email.trim()}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 14px;background:#f0e8fa;border-radius:0 0 8px 8px">
                <span style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.1em;color:#7A5A9A">Categoría</span><br>
                <strong style="color:#2E0F2F;font-size:0.95rem">${categoryLabel}</strong>
              </td>
            </tr>
          </table>
          <div style="background:#fff;border:1px solid #ddd5f0;border-radius:8px;padding:16px 18px">
            <p style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.1em;color:#7A5A9A;margin:0 0 10px">Mensaje</p>
            <p style="color:#2E0F2F;font-size:0.95rem;line-height:1.7;margin:0;white-space:pre-wrap">${message.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
          </div>
          <p style="text-align:center;margin-top:28px;font-size:0.75rem;color:#9B7AB8">
            Puedes responder directamente a este correo para contactar a ${name.trim()}.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', JSON.stringify(error))
      const msg = (error as { message?: string }).message ?? 'Error al enviar el correo'
      return Response.json({ ok: false, error: msg }, { status: 500 })
    }

    return Response.json({ ok: true })
  } catch (err) {
    console.error('Contact route error:', err)
    return Response.json({ ok: false, error: 'Error interno' }, { status: 500 })
  }
}
