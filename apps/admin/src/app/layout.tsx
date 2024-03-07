import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { isLogin } from '@/lib/auth'
import axios from 'axios'
import ClientStartup from '@/components/ClientStartup'
import { redirect } from 'next/navigation'
import { Toaster } from '@/components/ui/sonner'
import ReactQueryProviders from '@/utils/ReactQueryProviders'
import { Suspense } from 'react'
import Loader from '@/components/loader'
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL
// console.log('baseURL top layout', process.env.NEXT_PUBLIC_API_URL)

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
        <html lang="en">
            <ClientStartup />
            <body className={inter.className}>
                <ReactQueryProviders>
                    <Suspense
                        fallback={
                            <div className="w-screen h-screen flex items-center justify-center">
                                <Loader />
                            </div>
                        }
                    >
                        {children}
                    </Suspense>
                </ReactQueryProviders>
            </body>
            <Toaster richColors />
        </html>
    )
}
