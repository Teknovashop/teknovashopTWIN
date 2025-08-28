import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id') || ''
    const provider = (searchParams.get('p') || '').toLowerCase()
    const asin = (searchParams.get('asin') || '').toUpperCase()
    const title = searchParams.get('title') || ''
    const raw = searchParams.get('url') || ''
    const debug = searchParams.get('debug') === '1'
    if (id) { await kv.incr(`clicks:${id}`); await kv.expire(`clicks:${id}`, 60 * 60 * 24 * 30) }
    const tag = process.env.AFFILIATE_TAG || 'teknovashop25-21'
    let target = raw
    if (provider === 'amazon') {
      const looksLikeAsin = /^[A-Z0-9]{10}$/.test(asin)
      const notDummy = !/(EXAMPLE|PLACEHOLDER|DUMMY|TEST)/i.test(asin)
      if (looksLikeAsin && notDummy) target = `https://www.amazon.es/dp/${asin}${tag ? `?tag=${encodeURIComponent(tag)}` : ''}`
      else if (title) { const q = encodeURIComponent(title); target = `https://www.amazon.es/s?k=${q}${tag ? `&tag=${encodeURIComponent(tag)}` : ''}` }
      else target = `https://www.amazon.es/${tag ? `?tag=${encodeURIComponent(tag)}` : ''}`
    } else if (raw) target = raw
    if (debug) return NextResponse.json({ target, tag, provider, asin, title })
    return NextResponse.redirect(target || 'https://www.amazon.es/', 302)
  } catch {
    return NextResponse.redirect('https://www.amazon.es/', 302)
  }
}
