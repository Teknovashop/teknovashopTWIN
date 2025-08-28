# Teknovashop Shopping Twin v3.3.3

## Mejoras
- Endpoints de debug: `/api/debug/env` y `/api/debug/link`.
- Imágenes corregidas (`next.config.mjs` con `unoptimized: true`).
- Diversidad de categorías (retro, juguetes, hogar, etc.).
- Enlaces de Amazon con `ref=as_li_ss_tl&linkCode=ll2` (menos interstitials).
- Variables de entorno listas (`AFFILIATE_TAG`, `KV_REST_API_URL`, etc.).

## Variables de entorno
Configura en Vercel → Settings → Environment Variables:
- `AFFILIATE_TAG=teknovashop25-21`

Además, añade las de KV y Blob si tu proyecto las usa:
- `KV_REST_API_URL=...`
- `KV_REST_API_TOKEN=...`

## Endpoints de verificación
- `https://TU-DOMINIO/api/debug/env` → muestra el tag actual.
- `https://TU-DOMINIO/api/debug/link?q=esterilla%20yoga&debug=1` → muestra URL de Amazon con tu tag.

## Despliegue
1. Sube este ZIP a Vercel como nuevo proyecto o actualiza el existente.
2. Configura variables de entorno en Settings → Environment Variables.
3. Redeploy y prueba los endpoints.
