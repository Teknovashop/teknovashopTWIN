import { kv } from '@vercel/kv'
type Ptr = { url: string; checksum?: string; size?: number; updatedAt?: string }
export async function getPtr(key: string): Promise<Ptr | null> { try { const d = await kv.hgetall<Ptr>(key); if(!d || !d.url) return null; return d } catch { return null } }
export async function fetchFromBlob<T=any>(url: string): Promise<T | null> { try { const r = await fetch(url, { cache: 'no-store' }); if(!r.ok) return null; return await r.json() } catch { return null } }
