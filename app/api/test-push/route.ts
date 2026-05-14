import webpush from 'web-push'
import { getRedis } from '@/lib/redis'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SUBS_KEY = 'push_subscriptions'

export async function POST(req: Request) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  )

  const { title = 'Upaninews', body = '', url = '/' } = await req.json().catch(() => ({}))

  const subs = await getRedis().smembers(SUBS_KEY)
  if (!subs || subs.length === 0) {
    return Response.json({ ok: true, sent: 0, message: 'No hay suscriptores' })
  }

  const payload = JSON.stringify({ title, body, url })
  const results = await Promise.allSettled(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subs.map((sub) => webpush.sendNotification(sub as any, payload))
  )

  const expired = results
    .map((r, i) => (r.status === 'rejected' ? subs[i] : null))
    .filter((s) => s !== null)
  if (expired.length) {
    await Promise.all(expired.map((s) => getRedis().srem(SUBS_KEY, s)))
  }

  const sent = results.filter((r) => r.status === 'fulfilled').length
  return Response.json({ ok: true, sent, expired: expired.length })
}
