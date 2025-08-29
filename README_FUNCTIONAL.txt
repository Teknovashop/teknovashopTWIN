Teknovashop Functional Patch
----------------------------
Cambios principales:
- /api/photo -> usa Pixabay para obtener imágenes relevantes por título.
- /api/recommend -> aplica filtros reales (categoría, presupuesto, estilo, audiencia) y objetiva (mejor_cp, calidad, barato).
- ProductCard -> usa p.image o /api/photo?query=<title> y mantiene fallback.
- /api/img -> proxy tipado estable.

Variables necesarias (Vercel → Environment Variables):
  NEXT_PUBLIC_AMAZON_TAG=teknovashop25-21
  NEXT_PUBLIC_SHEIN_PID=5798341419
  PIXABAY_KEY=<tu_api_key_gratuita>

Cómo probar:
  - POST /api/recommend con JSON:
    {
      "category":"tecnología",
      "budget": 60,
      "style": "moderno",
      "audience": "unisex",
      "objective": "mejor_cp",  // o "calidad" | "barato"
      "count": 9
    }
  - Cada producto tendrá image ya resuelta: si p.image era genérica, 
    se sustituye por /api/photo?query=<title> (que a su vez redirige al proxy /api/img).
  - En interfaz, asegúrate de pasar estos parámetros al endpoint actual.
