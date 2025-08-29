export const runtime = 'edge';

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const src = searchParams.get('src');
  if (!src) return new Response('Missing src', { status: 400 });

  let url: string = src;
  const init: RequestInit & { redirect: RequestRedirect } = {
    headers: { 'User-Agent': 'Mozilla/5.0 (TeknovashopImgProxy/1.3)' },
    cache: 'no-store',
    redirect: 'manual',
  };

  for (let i = 0; i < 3; i++) {
    const r = await fetch(url, init);
    if (r.status >= 300 && r.status < 400) {
      const loc = r.headers.get('location');
      if (loc) { url = new URL(loc, url).toString(); continue; }
    }
    if (!r.ok) return new Response('Upstream error', { status: r.status });
    const ct = r.headers.get('content-type') ?? 'image/jpeg';
    const buf = await r.arrayBuffer();
    return new Response(buf, { status: 200, headers: { 'content-type': ct, 'cache-control': 'public, max-age=31536000, immutable' } });
  }
  return new Response('Too many redirects', { status: 508 });
}
