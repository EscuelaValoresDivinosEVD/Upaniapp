export const runtime = 'edge'
export const dynamic = 'force-dynamic'

const WP_API = 'https://store.upaninews.com/wp-json/wp/v2'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path') ?? 'posts'
  const rest = new URLSearchParams()
  for (const [k, v] of searchParams.entries()) {
    if (k !== 'path') rest.set(k, v)
  }

  const url = `${WP_API}/${path}${rest.toString() ? `?${rest}` : ''}`

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) {
      return new Response(await res.text(), { status: res.status })
    }
    const body = await res.text()
    return new Response(body, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (err) {
    return new Response(String(err), { status: 500 })
  }
}
