export const runtime = 'edge';

const UA = 'Mozilla/5.0 (TeknovashopPhoto/1.3)';

function pick(hit: any): string | null {
  return hit?.webformatURL || hit?.largeImageURL || hit?.previewURL ||
         hit?.src?.medium || hit?.src?.large || hit?.urls?.small || null;
}

async function serveBinary(src: string): Promise<Response> {
  const r = await fetch(src, { cache: 'no-store', headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error('img fetch failed ' + r.status);
  const buf = await r.arrayBuffer();
  const ct = r.headers.get('content-type') ?? 'image/jpeg';
  return new Response(buf, { status: 200, headers: { 'content-type': ct, 'cache-control': 'public, max-age=86400' } });
}

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('query') || '').trim();
  if (!q) return new Response('Missing query', { status: 400 });

  // 1) Pixabay
  try {
    const pix = process.env.PIXABAY_KEY;
    if (pix) {
      const u = `https://pixabay.com/api/?key=${encodeURIComponent(pix)}&q=${encodeURIComponent(q)}&image_type=photo&orientation=horizontal&per_page=2&safesearch=true`;
      const r = await fetch(u, { cache: 'no-store' });
      if (r.ok) {
        const data = await r.json().catch(() => null);
        const hit = data?.hits?.[0];
        const src = pick(hit);
        if (src) return serveBinary(src);
      }
    }
  } catch {}

  // 2) Pexels
  try {
    const pex = process.env.PEXELS_KEY;
    if (pex) {
      const u = `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=1&orientation=landscape`;
      const r = await fetch(u, { cache: 'no-store', headers: { Authorization: pex } });
      if (r.ok) {
        const data = await r.json().catch(() => null);
        const hit = data?.photos?.[0];
        const src = pick(hit);
        if (src) return serveBinary(src);
      }
    }
  } catch {}

  // 3) Unsplash
  try {
    const uns = process.env.UNSPLASH_KEY;
    if (uns) {
      const u = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=1&orientation=landscape`;
      const r = await fetch(u, { cache: 'no-store', headers: { Authorization: `Client-ID ${uns}` } });
      if (r.ok) {
        const data = await r.json().catch(() => null);
        const hit = data?.results?.[0];
        const src = pick(hit);
        if (src) return serveBinary(src);
      }
    }
  } catch {}

  return Response.redirect('/placeholder.png', 302);
}
