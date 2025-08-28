import type { Product } from '@/components/ProductCard'
import localDataset from '@/public/data/products.json'
import { getPtr, fetchFromBlob } from './storage'

export async function allProducts(category?: string): Promise<Product[]> {
  const key = category ? `catalog:latest:${category}` : 'catalog:latest'
  const ptr = await getPtr(key)
  if (ptr?.url) {
    const remote = await fetchFromBlob<Product[]>(ptr.url)
    if (remote && Array.isArray(remote) && remote.length) return remote
  }
  return localDataset as Product[]
}
