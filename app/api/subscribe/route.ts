import { redis } from '@/lib/redis'

export const runtime = 'nodejs'

const KEY = 'push_subscriptions'

export async function POST(req: Request) {
  try {
    const sub = await req.json()
    await redis.sadd(KEY, JSON.stringify(sub))
    return Response.json({ ok: true })
  } catch {
    return Response.json({ ok: false }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const sub = await req.json()
    await redis.srem(KEY, JSON.stringify(sub))
    return Response.json({ ok: true })
  } catch {
    return Response.json({ ok: false }, { status: 500 })
  }
}
