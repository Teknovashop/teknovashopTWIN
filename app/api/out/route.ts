import { NextRequest, NextResponse } from 'next/server'
export async function GET(req: NextRequest){
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id') || ''
  const provider = (searchParams.get('p') || '').toLowerCase()
  const asin = (searchParams.get('asin') || '').toUpperCase()
  const title = searchParams.get('title') || ''
  const raw = searchParams.get('url') || ''
  const debug = searchParams.get('debug') === '1'
  const tag = process.env.AFFILIATE_TAG || 'teknovashop25-21'
  let target = raw || 'https://www.amazon.es/'
  if (provider === 'amazon') {
    const TAG = encodeURIComponent(tag)
    const AFF = `tag=${TAG}&ref=as_li_ss_tl&linkCode=ll2`
    const looksLikeAsin = /^[A-Z0-9]{10}$/.test(asin)
    const notDummy = !/(EXAMPLE|PLACEHOLDER|DUMMY|TEST)/i.test(asin)
    if (looksLikeAsin && notDummy) target = `https://www.amazon.es/dp/${asin}?${AFF}`
    else if (title) { const q = encodeURIComponent(title); target = `https://www.amazon.es/s?k=${q}&${AFF}` }
    else target = `https://www.amazon.es/?${AFF}`
  }
  if (id) try { const { kv } = await import('@vercel/kv'); await kv.incr(`clicks:${id}`); await kv.expire(`clicks:${id}`, 60*60*24*30) } catch {}
  if (debug) return NextResponse.json({ target, tag, provider, asin, title })
  return NextResponse.redirect(target, 302)
}
