'use client'

import { useState } from 'react'
import { create } from 'zustand'

type Prefs = {
  name?: string
  email?: string
  category: string
  budget: number
  style: string
  goal: string
}

type Store = {
  prefs: Prefs
  setPrefs: (p: Partial<Prefs>) => void
}

const useStore = create<Store>((set) => ({
  prefs: { category: 'fitness', budget: 100, style: 'minimalista', goal: 'mejor calidad/precio' },
  setPrefs: (p) => set((s) => ({ prefs: { ...s.prefs, ...p } })),
}))

export default function Questionnaire({ onResults }: { onResults: (data: any) => void }) {
  const { prefs, setPrefs } = useStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    setLoading(true); setError(null)
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
      })
      if (!res.ok) throw new Error('Error en la recomendación')
      const data = await res.json()
      onResults(data)
    } catch (e: any) {
      setError(e.message || 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl bg-white shadow-soft p-4 sm:p-6 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tu nombre (opcional)</label>
          <input className="w-full rounded-2xl border border-gray-200 px-3 py-2" placeholder="Manuel" onChange={(e)=>setPrefs({ name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email (para enviarte el resumen)</label>
          <input className="w-full rounded-2xl border border-gray-200 px-3 py-2" placeholder="manu@correo.com" onChange={(e)=>setPrefs({ email: e.target.value })} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Categoria principal</label>
          <select className="w-full rounded-2xl border border-gray-200 px-3 py-2" value={prefs.category} onChange={(e)=>setPrefs({ category: e.target.value })}>
            <option value="fitness">Fitness</option>
            <option value="tecnologia">Tecnología</option>
            <option value="hogar">Hogar</option>
            <option value="moda">Moda</option>
            <option value="gaming">Gaming</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Presupuesto estimado (€)</label>
          <input type="number" min="10" className="w-full rounded-2xl border border-gray-200 px-3 py-2" value={prefs.budget} onChange={(e)=>setPrefs({ budget: Number(e.target.value) })} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Estilo preferido</label>
          <select className="w-full rounded-2xl border border-gray-200 px-3 py-2" value={prefs.style} onChange={(e)=>setPrefs({ style: e.target.value })}>
            <option value="minimalista">Minimalista</option>
            <option value="premium">Premium</option>
            <option value="lowcost">Low-cost</option>
            <option value="ecologico">Ecológico</option>
            <option value="alto_rendimiento">Alto rendimiento</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Objetivo</label>
          <select className="w-full rounded-2xl border border-gray-200 px-3 py-2" value={prefs.goal} onChange={(e)=>setPrefs({ goal: e.target.value })}>
            <option value="mejor calidad/precio">Mejor calidad/precio</option>
            <option value="mejor valoraciones">Mejor valoraciones</option>
            <option value="lo mas vendido">Lo más vendido</option>
            <option value="novedades">Novedades</option>
          </select>
        </div>
      </div>
      <button onClick={submit} disabled={loading} className="inline-flex items-center justify-center rounded-2xl px-6 py-3 bg-black text-white text-sm hover:opacity-90 disabled:opacity-70">
        {loading ? 'Pensando...' : 'Crear mi carrito inteligente'}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <p className="text-xs text-gray-500">Al continuar aceptas recibir tu recomendación por email. Podrás darte de baja en cualquier momento.</p>
    </div>
  )
}
