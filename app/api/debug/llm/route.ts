import { NextResponse } from 'next/server'
export async function GET(){ return NextResponse.json({ok:true,hasKey: Boolean(process.env.OPENAI_API_KEY), model: process.env.LLM_MODEL||'gpt-4o-mini'}) }
