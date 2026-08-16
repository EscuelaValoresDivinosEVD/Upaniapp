export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const auth = new URL(req.url).searchParams.get('secret')
  if (auth !== process.env.CRON_SECRET) return new Response('Unauthorized', { status: 401 })

  const WP = 'https://store.upaninews.com/wp-json/wp/v2'
  const headers = { Accept: 'application/json' }

  const [catRes, tagRes] = await Promise.all([
    fetch(`${WP}/categories?per_page=100`, { headers }),
    fetch(`${WP}/tags?per_page=100`, { headers }),
  ])

  const cats = catRes.ok ? await catRes.json() : []
  const tags = tagRes.ok ? await tagRes.json() : []

  return Response.json({
    categories: cats.map((c: { name: string; slug: string; count: number }) => ({ name: c.name, slug: c.slug, count: c.count })),
    tags: tags.map((t: { name: string; slug: string; count: number }) => ({ name: t.name, slug: t.slug, count: t.count })),
  })
}
