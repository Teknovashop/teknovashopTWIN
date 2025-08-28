import { kv } from '@vercel/kv'
type CatalogPointer={url:string;checksum?:string;size?:number;updatedAt?:string}
export async function getCatalogPointer():Promise<CatalogPointer|null>{try{const d=await kv.hgetall<CatalogPointer>('catalog:latest'); if(!d||!d.url)return null; return d;}catch{return null}}
export async function fetchCatalogFromBlob<T=any>():Promise<T[]|null>{const p=await getCatalogPointer(); if(!p?.url)return null; try{const r=await fetch(p.url,{cache:'no-store'}); if(!r.ok) throw new Error('blob'); return await r.json() as T[] }catch{return null}}
