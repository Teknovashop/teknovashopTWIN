'use client'
import { useMemo } from 'react'
import Badge from './Badge'

export type Product = {
  id: string;
  title: string;
  brand?: string;
  category: string;
  price: number;
  rating?: number;
  image?: string;
  url: string;
  asin?: string;
  tags?: string[];
  description?: string;
}

const isRemote = (u?: string) => !!u && /^https?:\/\//i.test(u);

export default function ProductCard({ p }: { p: Product }) {
  const href = `/api/out?p=${(p.url||'').includes('amazon.')?'amazon':'ext'}&id=${encodeURIComponent(p.id)}&url=${encodeURIComponent(p.url)}`
  const imgSrc = useMemo(() => {
    const src = p.image || '';
    if (isRemote(src)) return `/api/img?src=${encodeURIComponent(src)}`; // proxy via edge
    return src || '/placeholder.png';
  }, [p.image]);

  return (
    <div className="rounded-2xl bg-white shadow overflow-hidden">
      <div className="relative aspect-[4/3] bg-gray-50">
        <img
          src={imgSrc}
          alt={p.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.png'; }}
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Badge>{p.category}</Badge>
          {typeof p.rating === 'number' && <Badge>★ {p.rating.toFixed(1)}</Badge>}
          <span className="ml-auto font-semibold">{p.price.toFixed(2)} €</span>
        </div>
        <h3 className="font-semibold">{p.title}</h3>
        {p.description && <p className="text-sm text-gray-600 line-clamp-3">{p.description}</p>}
        <a href={href} target="_blank" rel="nofollow noopener" className="block">
          <button className="w-full rounded-xl bg-black text-white py-3 mt-2 hover:opacity-90">Ver oferta</button>
        </a>
      </div>
    </div>
  )
}