import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata={ title:'Teknovashop • Shopping Twin IA', description:'Tu clon de compras por IA' }
export default function RootLayout({children}:{children:React.ReactNode}){
  return(<html lang="es"><body><div className="max-w-6xl mx-auto p-4">
    <header className="py-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold">🛍️ Teknovashop <span className="text-gray-500">Shopping Twin IA</span></h1>
      <a href="https://teknovashop.com" className="text-sm text-gray-600">teknovashop.com</a>
    </header>
    {children}
    <footer className="text-center text-xs text-gray-500 py-10">© {new Date().getFullYear()} Teknovashop</footer>
  </div></body></html>)
}