export type WooProduct = {
  id: number
  name: string
  permalink: string
  price: string
  regular_price: string
  sale_price: string
  short_description: string
  images: { src: string; alt: string }[]
  status: string
}

export async function getKioskoProducts(): Promise<WooProduct[]> {
  const key = process.env.WC_CONSUMER_KEY
  const secret = process.env.WC_CONSUMER_SECRET

  if (!key || !secret) return []

  const credentials = Buffer.from(`${key}:${secret}`).toString('base64')
  const url = 'https://store.upaninews.com/wp-json/wc/v3/products?per_page=24&status=publish&orderby=date&order=desc'

  const res = await fetch(url, {
    headers: { Authorization: `Basic ${credentials}` },
    next: { revalidate: 3600 },
  })

  if (!res.ok) return []
  return res.json()
}
