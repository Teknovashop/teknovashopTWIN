import { kv } from '@vercel/kv'
export async function getPopularityMultipliers(ids: string[]): Promise<Record<string, number>> {
  try {
    const cmds = ids.map(id => ['get', `clicks:${id}`]) as any
    const res = await (kv as any).pipeline(cmds).exec()
    const out: Record<string, number> = {}
    ids.forEach((id, i) => {
      const clicks = Number(res?.[i]?.[1] ?? 0)
      const mult = Math.min(1.2, 0.8 + Math.log10(1 + clicks) * 0.2) || 1
      out[id] = mult
    })
    return out
  } catch {
    return Object.fromEntries(ids.map(id => [id, 1]))
  }
}
