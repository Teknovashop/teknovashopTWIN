export type Prefs = {
  name?: string
  email?: string
  category: string
  budget: number
  style: string
  goal: string
}

export type ProductLite = {
  id: string
  title: string
  brand?: string
  category: string
  price: number
  rating?: number
  tags?: string[]
  popularity?: number // 0..1
}

function overlap(a: string[] = [], b: string[] = []) {
  const A = new Set(a.map(x => x.toLowerCase()))
  const B = new Set(b.map(x => x.toLowerCase()))
  let count = 0
  for (const x of A) if (B.has(x)) count++
  return count / Math.max(1, A.size)
}

export function scoreProduct(p: ProductLite, prefs: Prefs) {
  // Category match
  const cat = p.category.toLowerCase() === prefs.category.toLowerCase() ? 1 : 0.3
  // Budget fit (penalize deviation)
  const diff = Math.abs(p.price - prefs.budget)
  const budget = Math.max(0, 1 - diff / Math.max(50, prefs.budget))
  // Style to tags mapping
  const styleTags: Record<string, string[]> = {
    minimalista: ['minimalista','sobrio','compacto','ligero'],
    premium: ['premium','alta gama','pro','aluminio','sapphire'],
    lowcost: ['barato','low-cost','básico','ahorro'],
    ecologico: ['eco','reciclado','bajo consumo','eficiencia'],
    alto_rendimiento: ['alto rendimiento','gaming','pro','potente','fps','rpm']
  }
  const goalTags: Record<string, string[]> = {
    'mejor calidad/precio': ['valor','calidad-precio','equilibrado'],
    'mejor valoraciones': ['top rated','mejor valorado','4.5+'],
    'lo mas vendido': ['más vendido','bestseller','top ventas'],
    'novedades': ['nuevo','2025','latest']
  }
  const tags = (p.tags || []).map(t => t.toLowerCase())
  const style = overlap(tags, styleTags[prefs.style] || [])
  const goal = overlap(tags, goalTags[prefs.goal] || [])
  const rating = (p.rating || 3.5) / 5
  const popularity = p.popularity ?? 0.5
  // Weighted sum
  const score = 0.25*cat + 0.25*budget + 0.2*style + 0.1*goal + 0.1*rating + 0.1*popularity
  return score
}

export function rankProducts(products: ProductLite[], prefs: Prefs, topN = 5) {
  return products
    .map(p => ({ ...p, _score: scoreProduct(p, prefs) }))
    .sort((a,b) => b._score - a._score)
    .slice(0, topN)
}
