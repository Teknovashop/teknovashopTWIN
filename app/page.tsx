'use client'
import { useEffect, useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'

type Product = {
  id?: string
  title?: string
  category?: string
  price?: number
  rating?: number
  image?: string
  url?: string
  asin?: string
  description?: string
}

const CATEGORIES = ['tecnología','hogar','cocina','fitness','mascotas']
const STYLES = ['moderno','minimalista','retro','sport','pro','clásico','compacto','diversión','confort']
const AUD = ['unisex','mascotas']
const OBJ = [
  { key:'mejor_cp', label:'Mejor calidad/precio' },
  { key:'calidad', label:'Máxima calidad' },
  { key:'barato', label:'Lo más barato' },
]

export default function Home() {
  const [category, setCategory] = useState('tecnología')
  const [budget, setBudget] = useState(100)
  const [style, setStyle] = useState('')
  const [audience, setAudience] = useState('unisex')
  const [objective, setObjective] = useState('mejor_cp')
  const [count, setCount] = useState(12)

  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const r = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          category, budget, style: style || undefined,
          audience, objective, count
        }),
      })
      const data = await r.json().catch(() => ({ items: [] }))
      setItems(Array.isArray(data?.items) ? data.items : [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tu selección</h1>

      <div className="grid gap-4 md:grid-cols-5 bg-white/70 rounded-xl p-4 border mb-6">
        <label className="text-sm">Categoría
          <select value={category} onChange={e=>setCategory(e.target.value)} className="mt-1 w-full border rounded p-2">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        <label className="text-sm">Estilo (opcional)
          <select value={style} onChange={e=>setStyle(e.target.value)} className="mt-1 w-full border rounded p-2">
            <option value="">(cualquiera)</option>
            {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>

        <label className="text-sm">Audiencia
          <select value={audience} onChange={e=>setAudience(e.target.value)} className="mt-1 w-full border rounded p-2">
            {AUD.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </label>

        <label className="text-sm">Objetivo
          <select value={objective} onChange={e=>setObjective(e.target.value)} className="mt-1 w-full border rounded p-2">
            {OBJ.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
          </select>
        </label>

        <label className="text-sm">Presupuesto (€): {budget}
          <input type="range" min={10} max={300} step={5} value={budget} onChange={e=>setBudget(parseInt(e.target.value))} className="w-full" />
        </label>

        <label className="text-sm md:col-span-2">¿Cuántos productos? {count}
          <input type="range" min={3} max={24} step={3} value={count} onChange={e=>setCount(parseInt(e.target.value))} className="w-full" />
        </label>

        <div className="md:col-span-3 flex items-end">
          <button onClick={load} className="px-4 py-2 rounded-lg bg-black text-white w-full md:w-auto">Ver recomendaciones</button>
        </div>
      </div>

      {loading ? (
        <p>Cargando…</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <ProductCard key={p.id ?? p.title ?? String(i)} p={p} />
          ))}
          {items.length === 0 && (
            <p className="text-gray-600">No se encontraron productos con esos filtros. Prueba a quitar el estilo o subir el presupuesto.</p>
          )}
        </div>
      )}
    </main>
  )
}
