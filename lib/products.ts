import dataset from '@/public/data/products.json'
import type { Product } from '@/components/ProductCard'
import type { Prefs } from './scoring'
import { rankProducts } from './scoring'

export function allProducts(): Product[] {
  return dataset as Product[]
}

export function recommendProducts(prefs: Prefs, topN = 3): Product[] {
  const ranked = rankProducts(allProducts(), prefs, topN)
  // Map to full product (dataset already full)
  return ranked
}
