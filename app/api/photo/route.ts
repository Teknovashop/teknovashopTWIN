export const runtime = 'edge';

function pickBest(hit: any) {
  // prefer horizontal, good size
  return hit?.webformatURL || hit?.largeImageURL || hit?.previewURL || null;
}

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('query')?.trim();
  if (!q) return new Response('Missing query', { status: 400 });
  const key = process.env.PIXABAY_KEY;
  if (!key) return new Response('No PIXABAY_KEY', { status: 500 });

  const url = `https://pixabay.com/api/?key=${encodeURIComponent(key)}&q=${encodeURIComponent(q)}&image_type=photo&orientation=horizontal&per_page=3&safesearch=true`;

  try {
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) return new Response('Pixabay error', { status: 502 });
    const data = await r.json();
    const hit = (data?.hits && data.hits.length) ? data.hits[0] : null;
    const src = hit ? pickBest(hit) : null;
    if (!src) return new Response('Not found', { status: 404 });

    // proxy the chosen image
    const proxied = `/api/img?src=${encodeURIComponent(src)}`;
    return Response.redirect(proxied, 302);
  } catch (e) {
    return new Response('Photo fetch failed', { status: 502 });
  }
}
