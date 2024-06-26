import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientStartup from '@/components/atomics/atoms/ClientStartup'
import { Toaster } from '@/components/ui/sonner'
import ReactQueryProviders from '@/utils/ReactQueryProviders'
import { Suspense } from 'react'
import Loader from '@/components/atomics/atoms/Loader'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className="dark">
            <ClientStartup />
            <body className={cn(inter.className, 'h-screen w-screen')}>
                <ReactQueryProviders>
                    <Suspense
                        fallback={
                            <div className="flex h-screen w-screen items-center justify-center">
                                <Loader />
                            </div>
                        }
                    >
                        {children}
                    </Suspense>
                </ReactQueryProviders>
                <Toaster richColors position="bottom-left" />
            </body>
        </html>
    )
}
