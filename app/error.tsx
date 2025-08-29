'use client'
export default function Error({ error, reset }: { error: any; reset: () => void }) {
  console.error('Client error:', error)
  return (
    <div className="p-8 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-3">Algo salió mal</h1>
      <p className="text-gray-600 mb-6">Ha ocurrido un error en la interfaz. Pulsa reintentar.</p>
      <button onClick={() => reset()} className="px-4 py-2 bg-black text-white rounded-lg">Reintentar</button>
    </div>
  )
}
