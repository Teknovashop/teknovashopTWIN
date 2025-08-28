import 'cross-fetch/polyfill'
import { createReadStream } from 'node:fs'
import { parse } from 'csv-parse'
import { put } from '@vercel/blob'
import path from 'node:path'

type Product={id:string;title:string;brand?:string;category:string;price:number;rating?:number;image?:string;url:string;asin?:string;tags?:string[];description?:string}

const BLOB_TOKEN=process.env.BLOB_READ_WRITE_TOKEN as string
if(!BLOB_TOKEN){ console.error('Missing BLOB_READ_WRITE_TOKEN'); process.exit(1) }

async function uploadChunks(category:string, items:Product[], chunkSize=20000){
  let i=0,part=0,baseKey=`catalog/${category}/catalog.json`
  const urls:string[]=[]
  while(i<items.length){
    const chunk=items.slice(i,i+chunkSize); i+=chunkSize
    const key=part===0?baseKey:baseKey.replace(/\.json$/,'')+`.part${String(part).padStart(3,'0')}.json`
    const { url } = await put(key, Buffer.from(JSON.stringify(chunk)), { access:'public', token:BLOB_TOKEN, contentType:'application/json', addRandomSuffix:false })
    urls.push(url); part++
  }
  return { base: urls[0], parts: urls.length }
}

async function main(){
  const file=process.argv[2]; const category=process.argv[3]||'tecnologia'
  if(!file){ console.error('Usage: pnpm ingest:local <csv|json> <category>'); process.exit(1) }
  let items:Product[]=[]
  if(file.endsWith('.json')||file.endsWith('.jsonl')){
    const raw=require(path.resolve(file))
    items=Array.isArray(raw)?raw:raw.items
  }else if(file.endsWith('.csv')){
    const parser = createReadStream(path.resolve(file)).pipe(parse({columns:true,skip_empty_lines:true}))
    for await (const r of parser){
      const p:Product={ id:r.id||r.asin||r.sku||crypto.randomUUID(), title:r.title||r.name, brand:r.brand, category:category, price: Number(r.price||r.pricing||0), rating: Number(r.rating||r.stars||0), image:r.image||r.image_url, url:r.url||r.link||r.product_url, asin:r.asin, tags:(r.tags||'').split(/[|,]/).filter(Boolean), description:r.description||r.desc }
      if(p.title && p.url) items.push(p)
    }
  } else { console.error('Unsupported file'); process.exit(1) }
  console.log('Items parsed:', items.length)
  const { base, parts } = await uploadChunks(category, items)
  console.log('Uploaded. URL base:', base, 'parts:', parts)
  console.log('Now set KV hash:', `catalog:latest:${category}`, '{ url: base, updatedAt: new Date().toISOString(), chunks: parts }')
}
main().catch(e=>{ console.error(e); process.exit(1) })
