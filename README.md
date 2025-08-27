# Teknovashop • Shopping Twin IA (MVP)

Tu clon de compras por IA: pregunta tu estilo y presupuesto y te crea un mini-carrito de 3 productos perfectos con links de compra (afiliados).

## 🚀 Arranque rápido

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## ⚙️ Variables de entorno

Crea un `.env.local` en la raíz:
```
AFFILIATE_TAG=teknovashop-21   # tu tag de Amazon (placeholder)
OPENAI_API_KEY=                # opcional (si usas OpenAI)
LLM_BASE_URL=                  # opcional (LM Studio: http://localhost:1234/v1)
LLM_MODEL=gpt-4o-mini          # o el que uses en LM Studio (ej: gpt-3.5-turbo)
```

> Si no pones `OPENAI_API_KEY` ni `LLM_BASE_URL`, el sistema usa un copy **fallback** (sin coste).

## 🧠 Cómo funciona

- **/app**: interfaz Next.js + Tailwind
- **/app/api/recommend**: API que lee las preferencias y devuelve 3 productos top con copy generado.
- **/public/data/products.json**: catálogo inicial (puedes ampliarlo).
- **/lib/scoring.ts**: motor de ranking (sin IA externa) combinando categoría, presupuesto, estilo, objetivo, rating y popularidad.
- **/lib/llm.ts**: *opcional* llamada a LLM (OpenAI o LM Studio compatible).

## 🔗 Afiliados

En `public/data/products.json` los links llevan `?tag=AFFILIATE_TAG`. En producción reemplaza esa cadena por tu tag real (o usa un pequeño script).

## 📈 Escalado

- Sustituye el dataset por un **feed de Amazon/Shein/AliExpress** (cuando tengas credenciales).
- Programa una tarea semanal que envíe por email **“Carrito inteligente de la semana”** (MailerLite/ConvertKit).
- Añade tracking de clics con Plausible/GA4.

## 🛡️ Legal

Indica que usas enlaces de afiliados. Añade página de privacidad y cookies.

## 🧪 Prueba rápida

1. Arranca `npm run dev`.
2. Selecciona **categoría** y **presupuesto**.
3. Pulsa “Crear mi carrito inteligente”. Verás 3 productos con copy y enlaces.

---

Hecho con ❤️ por Teknovashop.
