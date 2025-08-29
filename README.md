# Teknovashop Shopping Twin IA v3.5 (IA + Big Dataset)

## Qué hace
- Cuestionario + `/api/recommend` con scoring, diversificación y copy IA opcional.
- Catálogo **masivo** mediante `Vercel Blob` (troceado en partes) + punteros en `Vercel KV`.
- `AFFILIATE_TAG` aplicado en todos los enlaces Amazon desde `/api/out`.

## Variables de entorno
- `AFFILIATE_TAG=tu-tag-XX`
- (opcional) `OPENAI_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL`
- (opcional) KV: `KV_REST_API_URL`, `KV_REST_API_TOKEN`
- (para ingesta local) `BLOB_READ_WRITE_TOKEN`

## Ingesta de 100k+ productos
1. Reúne feeds (CSV/JSON/JSONL) de **APIs oficiales** (Amazon PA-API, Awin, CJ, Rakuten, etc.).
2. En tu máquina local: `pnpm ingest:local <ruta.csv|json> <categoria>`
3. El script sube en **chunks de 20k** a Blob con rutas tipo:
   - `catalog/<categoria>/catalog.json` (parte 0)
   - `catalog/<categoria>/catalog.part001.json` (parte 1), etc.
4. En KV, guarda el puntero:
   - Key: `catalog:latest:<categoria>`
   - Hash: `{ url: '<url-parte-0>', updatedAt: ISO, chunks: <n-partes> }`
5. El runtime leerá **sólo las primeras 2-3 partes** para ranking (rápido), suficiente para IA.
   Puedes subir tantas partes como quieras (100k, 1M).

## Búsqueda "internet entera"
- Legal y técnicamente, **no hagas scraping**. Usa marketplaces/redes de afiliación con APIs y feeds (Awin, CJ, PA-API, AliExpress, eBay…). Así tendrás permisos, calidad y fotos estables.
- Para comparar precios, agrega varios feeds y **normaliza** (mismo `title+brand+mpn` → un `productId` canónico).

## Endpoints útiles
- `/api/recommend` → IA + ranking
- `/api/out` → añade `tag` y trackea clicks
- `/api/debug/env`, `/api/debug/link?q=...&debug=1`

## Rendimiento
- El runtime carga 2-3 chunks (40k-60k registros) para recomendar. Si necesitas más precisión, aumenta `limit` en `lib/products.ts`.


## 🚀 Modo Autónomo (Autogeneración diaria)

Este repositorio ha sido adaptado para generar **un post diario** de forma automática usando:
- **Google Trends (pytrends)** para detectar oportunidades (SOI).
- **FLAN-T5 small** (Hugging Face, CPU) para redactar el artículo.
- **Afiliados AliExpress y SHEIN** con enlaces de búsqueda (sin APIs de pago).

### Cómo desplegar en Vercel
1. Importa este repo en Vercel (plan gratuito).
2. Configura `NEXT_PUBLIC_SITE_URL=https://teknovashop.com` en **Environment Variables**.
3. Despliega.

### Activar generación diaria en GitHub Actions
1. Haz el repo **público** (minutos gratuitos ilimitados) o usa un plan gratuito con minutos.
2. Ve a **Settings → Secrets and variables → Actions → New repository secret** y añade opcionalmente:
   - `AE_AFF_PLATFORM`
   - `AE_AFF_FCID`
   - `AE_AFF_FSK`
   - `SHEIN_PID`
3. El workflow `.github/workflows/daily-autopost.yml` corre a las **09:00 Europe/Madrid**.
4. Cada día se crea un `.md` en `content/posts/` y Vercel redeploya automáticamente.

### Estructura de contenido
- Página de listados: `/blog`
- Página de detalle: `/blog/[slug]`
- Sitemap: `/sitemap.xml` y `robots.txt` automáticos.

### A prueba de fallos
- Si el modelo de IA no se descarga, se usa una plantilla fallback.
- Si pytrends falla, se usa un keyword por defecto (`gadgets`).
- Los enlaces de afiliado funcionan incluso sin IDs (sin comisiones).

### Desarrollo local
```bash
npm install
npm run dev
# Generar un post manualmente
python automation/run_daily.py
```