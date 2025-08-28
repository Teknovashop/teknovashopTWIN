import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id') || ''
    const provider = (searchParams.get('p') || '').toLowerCase()
    const asin = searchParams.get('asin') || ''
    const title = searchParams.get('title') || ''
    const raw = searchParams.get('url') || ''

    if (id) {
      await kv.incr(`clicks:${id}`)
      await kv.expire(`clicks:${id}`, 60 * 60 * 24 * 30)
    }

    const tag = process.env.AFFILIATE_TAG || ''

    let target = raw

    if (provider === 'amazon') {
      if (asin && /^[A-Z0-9]{10}$/.test(asin)) {
        target = `https://www.amazon.es/dp/${asin}${tag ? `?tag=${encodeURIComponent(tag)}` : ''}`
      } else if (title) {
        const q = encodeURIComponent(title)
        target = `https://www.amazon.es/s?k=${q}${tag ? `&tag=${encodeURIComponent(tag)}` : ''}`
      } else {
        target = `https://www.amazon.es/${tag ? `?tag=${encodeURIComponent(tag)}` : ''}`
      }
    } else if (raw) {
      target = raw
    }

    return NextResponse.redirect(target || 'https://www.amazon.es/', 302)
  } catch {
    return NextResponse.redirect('https://www.amazon.es/', 302)
  }
}
