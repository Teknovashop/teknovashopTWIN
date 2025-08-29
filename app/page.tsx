'use client'
import { useEffect, useState } from 'react'
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

export default function Home() {
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function run() {
      try {
        const r = await fetch('/api/recommend', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            category: 'tecnología',
            budget: 60,
            style: 'moderno',
            audience: 'unisex',
            objective: 'mejor_cp',
            count: 9,
          }),
        })
        const data = (await r.json().catch(() => ({ items: [] }))) as any
        if (!cancelled) setItems(Array.isArray(data?.items) ? data.items : [])
      } catch {
        if (!cancelled) setItems([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tu selección</h1>
      {loading ? (
        <p>Cargando…</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <ProductCard key={p.id ?? p.title ?? String(i)} p={p} />
          ))}
        </div>
      )}
    </main>
  )
}
