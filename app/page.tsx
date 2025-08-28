'use client'
import { useState } from 'react'
import Questionnaire from '@/components/Questionnaire'
import ProductCard, { type Product } from '@/components/ProductCard'
type Result={ok:boolean;copy?:string;products?:Product[];error?:string}
export default function Page(){ const [result,setResult]=useState<Result|null>(null); return(<main className="space-y-6">
<section className="rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 text-white p-6"><h2 className="text-3xl font-bold">Tu clon de compras por IA</h2><p className="mt-2 text-gray-200">Dinos tu estilo, presupuesto, audiencia y cuántos productos quieres ver. Te armamos una selección perfecta.</p></section>
<Questionnaire onResults={(d:Result)=>setResult(d)} />
{result?.ok&&result.products&&(<section className="space-y-4"><h3 className="text-xl font-semibold">Tu selección</h3><p className="text-gray-700">{result.copy}</p><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{result.products.map(p=><ProductCard key={p.id} p={p}/>)}</div></section>)}
{result&&!result.ok&&<p className="text-red-600">{result.error}</p>}
</main>) }