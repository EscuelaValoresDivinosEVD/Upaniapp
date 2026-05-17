export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const auth = new URL(req.url).searchParams.get('secret')
  if (auth !== process.env.CRON_SECRET) {
    return new Response('Unauthorized', { status: 401 })
  }

  const key = process.env.WC_CONSUMER_KEY ?? ''
  const secret = process.env.WC_CONSUMER_SECRET ?? ''

  const results: Record<string, unknown> = {
    has_key: !!key,
    has_secret: !!secret,
    key_prefix: key.slice(0, 8),
  }

  // Try Basic Auth
  try {
    const credentials = Buffer.from(`${key}:${secret}`).toString('base64')
    const url = 'https://upaninews.com/wp-json/wc/v3/products?per_page=3&status=publish'
    const res = await fetch(url, {
      headers: { Authorization: `Basic ${credentials}` },
      cache: 'no-store',
    })
    results.basic_auth_status = res.status
    results.basic_auth_ok = res.ok
    if (res.ok) {
      const data = await res.json()
      results.basic_auth_count = Array.isArray(data) ? data.length : 'not array'
      results.basic_auth_sample = Array.isArray(data) ? data[0]?.name : data
    } else {
      results.basic_auth_body = await res.text()
    }
  } catch (e) {
    results.basic_auth_error = String(e)
  }

  // Try query params
  try {
    const url = `https://upaninews.com/wp-json/wc/v3/products?per_page=3&status=publish&consumer_key=${key}&consumer_secret=${secret}`
    const res = await fetch(url, { cache: 'no-store' })
    results.query_params_status = res.status
    results.query_params_ok = res.ok
    if (res.ok) {
      const data = await res.json()
      results.query_params_count = Array.isArray(data) ? data.length : 'not array'
      results.query_params_sample = Array.isArray(data) ? data[0]?.name : data
    } else {
      results.query_params_body = await res.text()
    }
  } catch (e) {
    results.query_params_error = String(e)
  }

  return Response.json(results, { status: 200 })
}
