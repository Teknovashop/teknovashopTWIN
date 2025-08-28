'use client'
import { useState } from 'react'
import { create } from 'zustand'

type Prefs={name?:string;email?:string;category:string;budget:number;style:string;goal:string;n:number}
type Store={prefs:Prefs;setPrefs:(p:Partial<Prefs>)=>void}
const useStore=create<Store>((set)=>({prefs:{category:'fitness',budget:100,style:'minimalista',goal:'mejor calidad/precio',n:6},setPrefs:(p)=>set((s)=>({prefs:{...s.prefs,...p}}))}))

export default function Questionnaire({onResults}:{onResults:(data:any)=>void}){
  const {prefs,setPrefs}=useStore(); const [loading,setLoading]=useState(false); const [error,setError]=useState<string|null>(null)
  async function submit(){ setLoading(true); setError(null); try{ const res=await fetch('/api/recommend',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(prefs)}); if(!res.ok) throw new Error('Error'); onResults(await res.json()) }catch(e:any){ setError(e.message||'Error') } finally{ setLoading(false) } }
  return(<div className="rounded-2xl bg-white shadow p-4 space-y-4">
    <div className="grid sm:grid-cols-2 gap-4">
      <div><label className="text-sm">Nombre</label><input className="w-full rounded-2xl border px-3 py-2" onChange={e=>setPrefs({name:e.target.value})}/></div>
      <div><label className="text-sm">Email</label><input className="w-full rounded-2xl border px-3 py-2" onChange={e=>setPrefs({email:e.target.value})}/></div>
      <div><label className="text-sm">Categoría</label><select className="w-full rounded-2xl border px-3 py-2" value={prefs.category} onChange={e=>setPrefs({category:e.target.value})}><option value="fitness">Fitness</option><option value="tecnologia">Tecnología</option><option value="hogar">Hogar</option><option value="moda">Moda</option><option value="gaming">Gaming</option></select></div>
      <div><label className="text-sm">Presupuesto (€)</label><input type="number" className="w-full rounded-2xl border px-3 py-2" value={prefs.budget} onChange={e=>setPrefs({budget:Number(e.target.value)})}/></div>
      <div><label className="text-sm">Estilo</label><select className="w-full rounded-2xl border px-3 py-2" value={prefs.style} onChange={e=>setPrefs({style:e.target.value})}><option value="minimalista">Minimalista</option><option value="premium">Premium</option><option value="lowcost">Low-cost</option><option value="ecologico">Ecológico</option><option value="alto_rendimiento">Alto rendimiento</option></select></div>
      <div><label className="text-sm">Objetivo</label><select className="w-full rounded-2xl border px-3 py-2" value={prefs.goal} onChange={e=>setPrefs({goal:e.target.value})}><option value="mejor calidad/precio">Mejor calidad/precio</option><option value="mejor valoraciones">Mejor valoraciones</option><option value="lo mas vendido">Lo más vendido</option><option value="novedades">Novedades</option></select></div>
      <div><label className="text-sm">¿Cuántos productos quieres ver?</label><input type="range" min={3} max={12} value={prefs.n} onChange={(e)=>setPrefs({n:Number(e.target.value)})} className="w-full"/><div className="text-xs text-gray-600">Mostrando: <b>{prefs.n}</b></div></div>
    </div>
    <button onClick={submit} disabled={loading} className="rounded-2xl px-6 py-3 bg-black text-white text-sm">{loading?'Pensando...':'Ver recomendaciones'}</button>
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>)
}
