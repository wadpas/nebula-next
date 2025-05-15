import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { Toaster } from 'sonner'

const lato = Rubik({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Nebula',
  description: 'Nebula app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={cn('font-sans antialiased', lato.className)}>
        <main className='flex flex-col min-h-screen bg-primary-foreground'>
          <div className='flex-1 w-full p-4 mx-auto bg-background min-w-[320px] max-w-[1600px]'>
            {children}
            <Toaster position='top-center' />
          </div>
        </main>
      </body>
    </html>
  )
}
