import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { kv } from '@vercel/kv'
import dataset from '@/public/data/products.json'
import crypto from 'node:crypto'
export const runtime='nodejs'
export async function GET(){
  try{
    const payload=JSON.stringify(dataset)
    const checksum=crypto.createHash('sha256').update(payload).digest('hex')
    const { url, size } = await put('catalog/catalog-latest.json', new Blob([payload],{type:'application/json'}), { access:'public', addRandomSuffix:false, contentType:'application/json', cacheControlMaxAge:0 })
    const updatedAt=new Date().toISOString()
    await kv.hset('catalog:latest',{url,checksum,size,updatedAt})
    return NextResponse.json({ok:true,url,checksum,size,updatedAt})
  }catch(e:any){ return NextResponse.json({ok:false,error:e.message||'Failed to refresh'},{status:500}) }
}