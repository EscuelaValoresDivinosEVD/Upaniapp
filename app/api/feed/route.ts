export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const res = await fetch('https://upaninews.com/feed/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        'Accept-Language': 'es-ES,es;q=0.9',
      },
    })
    if (!res.ok) {
      return new Response(`Feed error: ${res.status}`, { status: res.status })
    }
    const xml = await res.text()
    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=7200',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (err) {
    return new Response(String(err), { status: 500 })
  }
}
