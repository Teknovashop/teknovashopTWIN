Teknovashop FINAL - Triple Fallback Images + Robust Recommender

Endpoints:
  - /api/photo?query=<texto>  -> Pixabay -> Pexels -> Unsplash -> placeholder (sirve binario)
  - /api/recommend (POST)     -> Filtros reales + scoring; nunca 500
  - /api/img?src=<http-url>   -> Proxy de imágenes
  - /api/out                  -> Afiliados Amazon/SHEIN

Variables (Vercel → Settings → Environment Variables):
  NEXT_PUBLIC_AMAZON_TAG=teknovashop25-21
  NEXT_PUBLIC_SHEIN_PID=5798341419
  PIXABAY_KEY=<opcional, recomendado>
  PEXELS_KEY=<opcional, recomendado>
  UNSPLASH_KEY=<opcional, recomendado>

Pruebas rápidas:
  /api/photo?query=auriculares
  POST /api/recommend { "category":"tecnología","budget":60,"style":"moderno","audience":"unisex","objective":"mejor_cp","count":9 }

Notas:
  - Si no pones KEY, verás el placeholder. Con una o varias keys verás imágenes reales.
  - El cliente (ProductCard) no rompe si las imágenes fallan.
