import type { Product } from '@/components/ProductCard'
import localDataset from '@/public/data/products.json'
import { getPtr, fetchJSON } from './storage'
export async function allProducts(category?: string): Promise<Product[]> {
  const key = category ? `catalog:latest:${category}` : 'catalog:latest'
  const ptr = await getPtr(key)
  if (ptr?.url) {
    if (ptr.chunks && ptr.chunks > 1) {
      // load few chunks only (first 3 for performance) – enough for ranking
      const limit = Math.min(3, ptr.chunks)
      const arrays: Product[][] = []
      for (let i=0;i<limit;i++) {
        const u = ptr.url.replace(/\.json$/,'') + `.part${String(i).padStart(3,'0')}.json`
        const data = await fetchJSON<Product[]>(u)
        if (data && Array.isArray(data)) arrays.push(data)
      }
      if (arrays.length) return arrays.flat()
    } else {
      const data = await fetchJSON<Product[]>(ptr.url)
      if (data && Array.isArray(data) && data.length) return data
    }
  }
  return localDataset as Product[]
}
