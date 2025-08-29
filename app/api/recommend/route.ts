import { NextRequest, NextResponse } from 'next/server'
import { allProducts } from '@/lib/products'
import { rankProductsWithScore } from '@/lib/scoring'
import { generateCopy } from '@/lib/llm'
import { getPopularityMultipliers } from '@/lib/popularity'
import { diversify } from '@/lib/diversify'
export const dynamic='force-dynamic'
export async function POST(req: NextRequest){
  try{
    const b=await req.json()
    const prefs={category:b.category||'fitness',budget:Number(b.budget)||100,style:b.style||'minimalista',goal:b.goal||'mejor calidad/precio',audience:b.audience||'unisex'}
    const minPrice = Number(b.minPrice)||0; const maxPriceBody = Number(b.maxPrice)||Infinity;
    if (isFinite(maxPriceBody) && (!isFinite(prefs.budget) || maxPriceBody < prefs.budget)) { prefs.budget = maxPriceBody }
    const n=Math.min(21,Math.max(3,Number(b.n)||9))
    const products=await allProducts(prefs.category)
    let ranked=rankProductsWithScore(products,prefs,200)
    const pop=await getPopularityMultipliers(ranked.map(r=>r.product.id))
    ranked=ranked.map(r=>({product:r.product,score:r.score*(pop[r.product.id]??1)}))
    // HARD budget filter (strict)
    const maxBudget = Number.isFinite(prefs.budget) ? Number(prefs.budget) : Infinity
    ranked = ranked.filter(r => typeof r.product.price==='number' && r.product.price <= maxBudget)
    if (ranked.length === 0 && isFinite(maxBudget)) {
      const soft = maxBudget * 1.15
      ranked = ranked.filter(r => typeof r.product.price==='number' && r.product.price <= soft)
    }

    const seed=Number(new Date().toISOString().slice(0,10).replace(/-/g,''))
    const top=diversify(ranked.map(r=>({item:r.product,score:r.score})),n,0.7,0.2,seed)
    const prefsSummary=`${prefs.style}, objetivo: ${prefs.goal}, presupuesto: ${prefs.budget}€, categoría: ${prefs.category}, audiencia: ${prefs.audience}`
    const productSummary=top.map(p=>`${p.title} (${p.price}€)`).join(' | ')
    const copy=await generateCopy({prefsSummary,productSummary})
    const res=NextResponse.json({ok:true,copy,products:top}); res.headers.set('Cache-Control','s-maxage=300, stale-while-revalidate=86400'); return res
  }catch(e:any){ return NextResponse.json({ok:false,error:e.message||'Bad Request'},{status:400}) }
}
