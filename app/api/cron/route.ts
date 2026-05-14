import webpush from 'web-push'
import { getRedis } from '@/lib/redis'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SUBS_KEY = 'push_subscriptions'
const LAST_ID_KEY = 'last_notified_post_id'

export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  )

  try {
    const res = await fetch(
      'https://upaninews.com/wp-json/wp/v2/posts?per_page=1&_embed=true&orderby=date&order=desc'
    )
    if (!res.ok) return Response.json({ ok: false, error: 'fetch_failed' })

    const [post] = await res.json()
    if (!post) return Response.json({ ok: false, error: 'no_posts' })

    const lastId = await getRedis().get<number>(LAST_ID_KEY)
    if (lastId === post.id) return Response.json({ ok: true, skipped: true })

    const subs = await getRedis().smembers<string[]>(SUBS_KEY)
    await getRedis().set(LAST_ID_KEY, post.id)

    if (!subs || subs.length === 0) return Response.json({ ok: true, sent: 0 })

    const title = post.title.rendered.replace(/<[^>]*>/g, '')
    const body = post.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 120).trim()
    const url = post.link
    const payload = JSON.stringify({ title, body, url })

    const results = await Promise.allSettled(
      subs.map((sub) => webpush.sendNotification(JSON.parse(sub), payload))
    )

    // Remove expired/invalid subscriptions
    const expired = results
      .map((r, i) => (r.status === 'rejected' ? subs[i] : null))
      .filter((s): s is string => s !== null)
    if (expired.length) {
      await Promise.all(expired.map((s) => getRedis().srem(SUBS_KEY, s)))
    }

    const sent = results.filter((r) => r.status === 'fulfilled').length
    return Response.json({ ok: true, sent, expired: expired.length })
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
