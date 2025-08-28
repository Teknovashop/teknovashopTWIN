import { NextResponse } from 'next/server'

export async function GET() {
  const tag = process.env.AFFILIATE_TAG || 'teknovashop25-21'
  const sample = `https://www.amazon.es/s?k=prueba&tag=${encodeURIComponent(tag)}`
  return NextResponse.json({ ok: true, tag, sample })
}
