import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Image Generator',
  description: 'Generate stunning images with advanced AI technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(
        'min-h-screen bg-background font-sans antialiased',
        inter.className
      )}>
        <div className="relative flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                  <span className="font-bold text-xl">AI Generator</span>
                </Link>
              </div>
              <nav className="flex items-center space-x-6">
                <Link 
                  href="/" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Home
                </Link>
                <Link 
                  href="/generate" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Generate
                </Link>
                <Link 
                  href="/gallery" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Gallery
                </Link>
                <Button asChild size="sm">
                  <Link href="/generate">Start Creating</Link>
                </Button>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
              <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                Built with Next.js and AI technology. Create amazing images with advanced AI models.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}