Teknovashop FINAL - imágenes a prueba de fallos + afiliados + cache

Copia todo este contenido en tu repo respetando rutas.
Variables en Vercel:
  NEXT_PUBLIC_AMAZON_TAG=teknovashop25-21
  NEXT_PUBLIC_SHEIN_PID=5798341419

Pruebas:
  /api/img?src=https://picsum.photos/seed/test-1/800/600 -> debe mostrar imagen
  Botón 'Ver oferta' sin ASIN -> Amazon /s?k=<title>&tag=...
  Con ASIN -> Amazon /dp/<ASIN>/?tag=...
  SHEIN -> usa PID hacia búsqueda del título
