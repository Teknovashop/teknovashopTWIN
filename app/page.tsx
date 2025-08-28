'use client'
import { useState } from 'react'
import Questionnaire from '@/components/Questionnaire'
import ProductCard, { Product } from '@/components/ProductCard'
export default function Page(){
  const [data,setData]=useState<{copy:string,products:Product[]}|null>(null)
  return(<main className='space-y-6'>
    <Questionnaire onResults={(d)=>setData(d)} />
    {data && (<section className='space-y-4'>
      <h2 className='text-xl font-semibold'>Tu selección</h2>
      <p className='text-gray-700'>{data.copy}</p>
      <div className='grid md:grid-cols-3 gap-4'>{data.products.map(p=>(<ProductCard key={p.id} p={p}/>))}</div>
    </section>)}
  </main>)
}
