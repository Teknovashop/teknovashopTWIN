import dataset from '@/public/data/products.json'
import type { Product } from '@/components/ProductCard'
export function allProducts(): Product[]{return dataset as Product[]}
