import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const provider = searchParams.get('p') || 'amazon'
  const asin = searchParams.get('id') || ''
  const title = searchParams.get('title') || ''
  const tag = process.env.AFFILIATE_TAG || 'teknovashop25-21'

  let target = 'https://www.amazon.es'
  if (provider === 'amazon') {
    const TAG = encodeURIComponent(tag)
    const AFF = `tag=${TAG}&ref=as_li_ss_tl&linkCode=ll2`
    const looksLikeAsin = /^[A-Z0-9]{10}$/.test(asin)
    const notDummy = !/(EXAMPLE|PLACEHOLDER|DUMMY|TEST)/i.test(asin)

    if (looksLikeAsin && notDummy) {
      target = `https://www.amazon.es/dp/${asin}?${AFF}`
    } else if (title) {
      const q = encodeURIComponent(title)
      target = `https://www.amazon.es/s?k=${q}&${AFF}`
    } else {
      target = `https://www.amazon.es/?${AFF}`
    }
  }

  const debug = searchParams.get('debug') === '1'
  if (debug) return NextResponse.json({ target, tag })

  return NextResponse.redirect(target, 302)
}
