import { NextResponse } from 'next/server'
export const runtime='nodejs'
export async function GET(){try{return NextResponse.json({ok:true,updatedAt:new Date().toISOString()})}catch(e:any){return NextResponse.json({ok:false,error:e.message||'Failed to refresh'},{status:500})}}
