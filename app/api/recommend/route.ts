import { NextRequest, NextResponse } from 'next/server'
import { recommendProducts } from '@/lib/products'
import { generateCopy } from '@/lib/llm'

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
    const top = recommendProducts(prefs, 3)
    const prefsSummary = `${prefs.style}, objetivo: ${prefs.goal}, presupuesto: ${prefs.budget}€, categoría: ${prefs.category}`
    const productSummary = top.map(p => `${p.title} (${p.price}€) [${(p.tags||[]).slice(0,2).join(', ')}]`).join(' | ')
    const copy = await generateCopy({ prefsSummary, productSummary })
    return NextResponse.json({ ok: true, copy, products: top })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || 'Bad Request' }, { status: 400 })
  }
}
