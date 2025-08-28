export async function generateCopy(input:{prefsSummary:string,productSummary:string}):Promise<string>{
  const apiKey=process.env.OPENAI_API_KEY; const baseUrl=process.env.LLM_BASE_URL; const model=process.env.LLM_MODEL||'gpt-4o-mini'
  const prompt=`Eres un copywriter de e-commerce. Texto breve (60-120 palabras) en español de España.
PREFERENCIAS: ${input.prefsSummary}
PRODUCTOS: ${input.productSummary}`
  try{
    if(!apiKey && !baseUrl){ return 'Hemos seleccionado opciones equilibradas según tu estilo y presupuesto.' }
    const res=await fetch((baseUrl||'https://api.openai.com/v1')+'/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',...(apiKey?{'Authorization':`Bearer ${apiKey}`}:{})},body:JSON.stringify({model,messages:[{role:'system',content:'Eres un experto en copy de e-commerce.'},{role:'user',content:prompt}],temperature:0.7})})
    if(!res.ok) throw new Error('LLM failed'); const data=await res.json(); return data?.choices?.[0]?.message?.content?.trim()||'Selección optimizada para tu estilo y presupuesto.'
  }catch{return 'Selección optimizada para tu estilo y presupuesto.'}
}