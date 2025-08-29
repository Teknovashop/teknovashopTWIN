'use client'
import { useEffect, useMemo, useState } from 'react'

export type Product = {
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

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 border border-gray-200">{children}</span>
}

export default function ProductCard({ p }: { p: Product }) {
  const safeTitle = p?.title ?? 'Producto'
  const safeCategory = p?.category ?? 'general'
  const safePrice = typeof p?.price === 'number' ? p.price : 0

  const initial = p?.image && p.image.trim().length ? p.image : `/api/photo?query=${encodeURIComponent(safeTitle)}`
  const [imgSrc, setImgSrc] = useState(initial)

  useEffect(() => {
    const src = p?.image && p.image.trim().length ? p.image : `/api/photo?query=${encodeURIComponent(safeTitle)}`
    setImgSrc(src)
  }, [p?.image, safeTitle])

  const provider = (p?.url || '').includes('shein') ? 'shein' : (p?.url || '').includes('amazon') ? 'amazon' : 'amazon'
  const href = useMemo(() => {
    const base = `/api/out?p=${provider}&title=${encodeURIComponent(safeTitle)}`
    const urlPart = `&url=${encodeURIComponent(p?.url || '')}`
    return `${base}${urlPart}`
  }, [safeTitle, p?.url, provider])

  return (
    <div className="rounded-2xl bg-white shadow overflow-hidden">
      <div className="relative aspect-[4/3] bg-gray-50">
        <img
          src={imgSrc}
          alt={safeTitle}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const el = e.currentTarget as HTMLImageElement
            if (!el.src.endsWith('/placeholder.png')) el.src = '/placeholder.png'
          }}
        />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Chip>{safeCategory}</Chip>
          {typeof p?.rating === 'number' && <Chip>★ {p.rating.toFixed(1)}</Chip>}
          <span className="ml-auto font-semibold">{safePrice.toFixed(2)} €</span>
        </div>
        <h3 className="font-semibold">{safeTitle}</h3>
        {p?.description && <p className="text-sm text-gray-600 line-clamp-3">{p.description}</p>}
        <a href={href} target="_blank" rel="nofollow noopener" className="block">
          <button className="w-full rounded-xl bg-black text-white py-3 mt-2 hover:opacity-90">Ver oferta</button>
        </a>
      </div>
    </div>
  )
}
