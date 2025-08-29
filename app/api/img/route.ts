export const runtime = 'edge';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const src = searchParams.get('src');
  if (!src) return new Response('Missing src', { status: 400 });
  try {
    const r = await fetch(src, {
      headers: { 'User-Agent': 'Mozilla/5.0 (TeknovashopImgProxy/1.0)' },
      cache: 'no-store'
    });
    if (!r.ok) return new Response('Upstream error', { status: r.status });
    const ct = r.headers.get('content-type') || 'image/jpeg';
    const buf = await r.arrayBuffer();
    return new Response(buf, {
      status: 200,
      headers: {
        'content-type': ct,
        'cache-control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (e) {
    return new Response('Fetch failed', { status: 502 });
  }
}