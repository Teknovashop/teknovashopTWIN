'use client'
export default function GlobalError({ error, reset }: { error: any; reset: () => void }) {
  console.error('Global error:', error)
  return (
    <html>
      <body>
        <div className="p-8 max-w-xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-3">Ups, error inesperado</h1>
          <button onClick={() => reset()} className="px-4 py-2 bg-black text-white rounded-lg">Reintentar</button>
        </div>
      </body>
    </html>
  )
}
