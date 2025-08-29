import data from '../../../public/data/products.json'

export const runtime = 'edge';

type Product = {
  id: string; title: string; category: string; price: number;
  rating?: number; image?: string; url: string; asin?: string;
  style?: string[]; audience?: string[];
};

function score(p: Product, objective: string) {
  switch (objective) {
    case 'calidad':  return (p.rating ?? 3) * 10 - p.price * 0.01;
    case 'barato':   return -p.price + (p.rating ?? 3);
    case 'mejor_cp':
    default:         return (p.rating ?? 3) * 2 - Math.log(Math.max(p.price, 1));
  }
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json().catch(() => ({} as any));
  const category  = String(body.category ?? '').toLowerCase();
  const budget    = Number(body.budget ?? 0);
  const audience  = String(body.audience ?? '').toLowerCase();
  const style     = String(body.style ?? '').toLowerCase();
  const n         = Math.min(Number(body.count ?? 9), 36);
  const objective = String(body.objective ?? 'mejor_cp').toLowerCase();

  let items: Product[] = (data as Product[]).slice();

  if (category) items = items.filter(p => (p.category ?? '').toLowerCase().includes(category));
  if (budget > 0) items = items.filter(p => p.price <= budget * 1.05);
  if (audience) items = items.filter(p => !p.audience || p.audience.map(a => (a ?? '').toLowerCase()).includes(audience));
  if (style) items = items.filter(p => !p.style || p.style.map(s => (s ?? '').toLowerCase()).includes(style));

  items = items.sort((a, b) => score(b, objective) - score(a, objective)).slice(0, n);

  // Imagen: si hay URL real => proxificar; si no, pedir a /api/photo por el título
  const mapped = items.map((p) => {
    const hasReal =
      typeof p.image === 'string' &&
      p.image.startsWith('http') &&
      !p.image.includes('picsum.photos');

    const image = hasReal
      ? `/api/img?src=${encodeURIComponent(p.image as string)}`
      : `/api/photo?query=${encodeURIComponent(p.title)}`;

    return { ...p, image };
  });

  return new Response(JSON.stringify({ items: mapped }, null, 2), {
    status: 200,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}

