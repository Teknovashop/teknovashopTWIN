import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const tag = process.env.AFFILIATE_TAG || 'teknovashop25-21'
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || 'mancuernas ajustables'
  const url = `https://www.amazon.es/s?k=${encodeURIComponent(q)}&tag=${encodeURIComponent(tag)}`
  const debug = searchParams.get('debug') === '1'
  if (debug) return NextResponse.json({ url, tag })
  return NextResponse.redirect(url, 302)
}
