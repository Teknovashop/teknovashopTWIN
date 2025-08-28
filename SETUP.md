# Setup rápido (v3.6.1 – Amazon + SHEIN + IA)

1) **Variables de entorno (Vercel → Settings → Environment Variables)**
   - `AFFILIATE_TAG` = tu tag de Amazon (ej. teknovashop25-21)
   - `SHEIN_REF_CODE` = tu código de referido SHEIN (ej. XE4TE)
   - `SHEIN_PARAM_NAME` = nombre del parámetro (normalmente `ref`)
   - (opcional) `SHEIN_CONVERT_BASE` = si SHEIN proporciona una URL base de "Convertir enlace" (p.ej. `https://…/convert?url=`)
   - (opcional) `OPENAI_API_KEY` = clave de IA (no publiques esta clave)
   - (opcional) `LLM_MODEL` = `gpt-4o-mini` (por defecto)
   - (opcional) `KV_REST_API_URL` y `KV_REST_API_TOKEN` para popularidad por clicks

2) **Despliegue**
   - Sube este ZIP como Nuevo Proyecto en Vercel.
   - Verifica `https://TU_DOMINIO/api/debug/env` (no muestra secretos, solo confirma presencia).

3) **Probar enlaces con tag**
   - Amazon: `https://TU_DOMINIO/api/debug/link?q=mancuernas&debug=1`
   - SHEIN: `https://TU_DOMINIO/api/debug/shein?url=https://m.shein.com/es/item/XXXXX.html`

4) **Catálogo grande (100k+)**
   - Ejecuta localmente: `pnpm ingest:local ./mi-feed.csv tecnologia` con `BLOB_READ_WRITE_TOKEN` configurado.
   - Guarda en KV la clave `catalog:latest:<categoria>` con `{url, updatedAt, chunks}`.

> Seguridad: nunca hardcodes la `OPENAI_API_KEY`. Cárgala siempre por variable de entorno.
