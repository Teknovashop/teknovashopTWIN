import { NextRequest, NextResponse } from 'next/server'
import { allProducts } from '@/lib/products'
import { rankProductsWithScore } from '@/lib/scoring'
import { generateCopy } from '@/lib/llm'
import { getPopularityMultipliers } from '@/lib/popularity'
import { diversify } from '@/lib/diversify'

export const dynamic='force-dynamic'

export async function POST(req: NextRequest){
  try{
    const body = await req.json()
    const prefs = {
      name: body.name || '',
      email: body.email || '',
      category: body.category || 'fitness',
      budget: Number(body.budget) || 100,
      style: body.style || 'minimalista',
      goal: body.goal || 'mejor calidad/precio'
    }
    const n = Math.min(12, Math.max(3, Number(body.n) || 6))

    const products = await allProducts(prefs.category)
    let ranked = rankProductsWithScore(products, prefs, 50)
    const pop = await getPopularityMultipliers(ranked.map(r=>r.product.id))
    ranked = ranked.map(r => ({ product: r.product, score: r.score * (pop[r.product.id] ?? 1) }))

    const seed = Number(new Date().toISOString().slice(0,10).replace(/-/g,''))
    const top = diversify(ranked.map(r=>({ item: r.product, score: r.score })), n, 0.7, 0.2, seed)

    const prefsSummary = `${prefs.style}, objetivo: ${prefs.goal}, presupuesto: ${prefs.budget}€, categoría: ${prefs.category}`
    const productSummary = top.map(p => `${p.title} (${p.price}€)`).join(' | ')
    const copy = await generateCopy({ prefsSummary, productSummary })

    const res = NextResponse.json({ ok:true, copy, products: top })
    res.headers.set('Cache-Control','s-maxage=300, stale-while-revalidate=86400')
    return res
  }catch(e:any){
    return NextResponse.json({ ok:false, error:e.message || 'Bad Request' }, { status: 400 })
  }
}
