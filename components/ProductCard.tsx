import Image from 'next/image'
import Badge from './Badge'

export type Product={id:string;title:string;brand?:string;category:string;price:number;rating?:number;image?:string;url:string;asin?:string;tags?:string[];description?:string}

export default function ProductCard({p}:{p:Product}){
  const isAmazon = (p.url || '').includes('amazon.')
  const href = isAmazon
    ? `/api/out?p=amazon&id=${encodeURIComponent(p.id)}&title=${encodeURIComponent(p.title)}${p.asin?`&asin=${encodeURIComponent(p.asin)}`:''}`
    : `/api/out?id=${encodeURIComponent(p.id)}&url=${encodeURIComponent(p.url)}`

  return(<div className="rounded-2xl shadow bg-white overflow-hidden">
    <div className="relative aspect-[4/3] bg-gray-50">{p.image?<Image src={p.image} alt={p.title} fill className="object-cover"/>:<div className="absolute inset-0 grid place-items-center text-gray-400">Sin imagen</div>}</div>
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Badge>{p.category}</Badge>{p.rating?<Badge>★ {p.rating.toFixed(1)}</Badge>:null}
        <Badge className="ml-auto font-semibold">{p.price.toFixed(2)} €</Badge>
      </div>
      <h3 className="font-semibold">{p.title}</h3>
      {p.description?<p className="text-sm text-gray-600 line-clamp-3">{p.description}</p>:null}
      <a href={href} target="_blank" className="inline-flex justify-center w-full rounded-2xl px-4 py-2 bg-black text-white text-sm">Ver oferta</a>
    </div></div>)
}
