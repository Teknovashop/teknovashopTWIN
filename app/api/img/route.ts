
export const runtime = 'edge';

async function fetchFollow(url, init = {}, depth = 0) {
  const r = await fetch(url, { ...init, redirect: 'manual' });
  if (r.status >= 300 && r.status < 400 && r.headers.get('location') && depth < 3) {
    const next = new URL(r.headers.get('location'), url).toString();
    return fetchFollow(next, init, depth + 1);
  }
  return r;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const src = searchParams.get('src');
  if (!src) return new Response('Missing src', { status: 400 });
  try {
    const r = await fetchFollow(src, {
      headers: { 'User-Agent': 'Mozilla/5.0 (TeknovashopImgProxy/1.0)' },
      cache: 'no-store'
    });
    if (!r.ok) return new Response('Upstream error', { status: r.status });
    const ct = r.headers.get('content-type') || 'image/jpeg';
    const buf = await r.arrayBuffer();
    return new Response(buf, {
      status: 200,
      headers: { 'content-type': ct, 'cache-control': 'public, max-age=31536000, immutable' }
    });
  } catch {
    return new Response('Fetch failed', { status: 502 });
  }
}
