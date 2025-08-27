// app/api/recommend/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { allProducts } from '@/lib/products'
import { rankProductsWithScore } from '@/lib/scoring'
import { generateCopy } from '@/lib/llm'

export const dynamic = 'force-dynamic' // evita que Next intente cachear a build-time

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const prefs = {
      name: body.name || '',
      email: body.email || '',
      category: body.category || 'fitness',
      budget: Number(body.budget) || 100,
      style: body.style || 'minimalista',
      goal: body.goal || 'mejor calidad/precio'
    }

    const ranked = rankProductsWithScore(allProducts(), prefs, 3)
    const top = ranked.map(r => r.product)

    const prefsSummary = `${prefs.style}, objetivo: ${prefs.goal}, presupuesto: ${prefs.budget}€, categoría: ${prefs.category}`
    const productSummary = top.map(p => `${p.title} (${p.price}€) [${(p.tags||[]).slice(0,2).join(', ')}]`).join(' | ')
    const copy = await generateCopy({ prefsSummary, productSummary })

    const res = NextResponse.json({ ok: true, copy, products: top })
    // Cache en CDN 5 min + Stale-While-Revalidate 24h (no bloquea al usuario)
    res.headers.set('Cache-Control', 's-maxage=300, stale-while-revalidate=86400')
    return res
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || 'Bad Request' }, { status: 400 })
  }
}
