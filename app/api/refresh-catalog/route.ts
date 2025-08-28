// app/api/refresh-catalog/route.ts
import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { kv } from '@vercel/kv'
import dataset from '@/public/data/products.json'
import crypto from 'node:crypto'

export const runtime = 'nodejs'

export async function GET() {
  try {
    // TODO: reemplaza 'dataset' por tu feed real (Amazon/Shein/AliExpress) cuando lo tengas.
    const payload = JSON.stringify(dataset)

    // tamaño en bytes del JSON (Node runtime -> Buffer disponible)
    const size = Buffer.byteLength(payload, 'utf8')

    // checksum para verificar integridad / evitar publicar datos corruptos
    const checksum = crypto.createHash('sha256').update(payload).digest('hex')

    // sube a Blob (público, sin sufijo aleatorio)
    const { url } = await put(
      'catalog/catalog-latest.json',
      new Blob([payload], { type: 'application/json' }),
      {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'application/json',
        cacheControlMaxAge: 0,
      }
    )

    // guarda puntero en KV
    const updatedAt = new Date().toISOString()
    await kv.hset('catalog:latest', { url, checksum, size, updatedAt })

    return NextResponse.json({ ok: true, url, checksum, size, updatedAt })
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e.message || 'Failed to refresh' },
      { status: 500 }
    )
  }
}
