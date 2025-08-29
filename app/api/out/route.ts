import { NextResponse } from 'next/server'
import { buildAmazonLink, buildSheinLink } from '../../../lib/affiliates'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const provider = (searchParams.get('p') || '').toLowerCase()
  const title = searchParams.get('title') || ''
  const asin = searchParams.get('asin') || ''
  const raw = searchParams.get('url') || ''

  const tag = process.env.NEXT_PUBLIC_AMAZON_TAG || 'teknovashop25-21'
  const pid = process.env.NEXT_PUBLIC_SHEIN_PID || '5798341419'

  let target = raw

  if (provider === 'amazon') target = buildAmazonLink({ title, asin, tag })
  else if (provider === 'shein') target = buildSheinLink({ title, pid })
  else if (!raw) target = buildAmazonLink({ title, asin, tag })

  return NextResponse.redirect(target, { status: 302 })
}
