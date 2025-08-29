export function buildAmazonLink({
  title, asin, tag
}: { title: string; asin?: string; tag: string }) {
  if (asin) return `https://www.amazon.es/dp/${asin}/?tag=${encodeURIComponent(tag)}`;
  const q = encodeURIComponent(title);
  return `https://www.amazon.es/s?k=${q}&tag=${encodeURIComponent(tag)}`;
}

export function buildSheinLink({ title, pid }: { title: string; pid: string }) {
  const q = encodeURIComponent(title);
  return `https://shein.top/${encodeURIComponent(pid)}?url=${encodeURIComponent(
    `https://es.shein.com/search/${q}.html`
  )}`;
}
