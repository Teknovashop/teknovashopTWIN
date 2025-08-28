import './globals.css'
export default function RootLayout({children}:{children:React.ReactNode}){
  return(<html lang='es'><body><div className='max-w-7xl mx-auto p-4'>
    <header className='py-6 flex justify-between items-center'><h1 className='text-2xl font-bold'>🛍️ Teknovashop <span className='text-gray-500'>Shopping Twin IA</span></h1><a href='https://teknovashop.com' className='text-sm text-gray-600'>teknovashop.com</a></header>{children}
  </div></body></html>)
}
