import { clsx } from 'clsx'
export default function Badge({children,className=''}){return(<span className={clsx('inline-flex items-center rounded-2xl px-3 py-1 text-xs bg-gray-100 text-gray-700',className)}>{children}</span>)}
