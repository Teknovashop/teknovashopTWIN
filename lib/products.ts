import localDataset from '@/public/data/products.json'
import type { Product } from '@/components/ProductCard'
import { fetchCatalogFromBlob } from './storage'
export async function allProducts():Promise<Product[]>{const remote=await fetchCatalogFromBlob<Product>(); if(remote&&remote.length) return remote as Product[]; return localDataset as Product[]}
