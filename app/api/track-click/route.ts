import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
export async function POST(req: NextRequest){
  try{ const { id } = await req.json(); if(!id) throw new Error('Missing id'); await kv.incr(`clicks:${id}`); await kv.expire(`clicks:${id}`, 60*60*24*30); return NextResponse.json({ ok: true }) }
  catch(e:any){ return NextResponse.json({ ok:false, error:e.message || 'Bad Request' }, { status: 400 }) }
}
