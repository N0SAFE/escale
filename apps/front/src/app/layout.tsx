import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import '@/lib/fontAwesome'
import { Toaster } from '@/components/ui/toaster'
import { inter } from '@/fonts/index'
import { Suspense, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import Loader from '@/components/Loader'
import { Toaster as ToasterSonner } from '@/components/ui/sonner'
import ReactQueryProviders from '@/utils/ReactQueryProviders'

export const metadata: Metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" translate="no">
            <body
                className={`${inter.className} bg-[#000000] text-white min-h-screen flex flex-col justify-between`}
            >
                <ReactQueryProviders>
                    <Suspense
                        fallback={
                            <div className="w-screen h-screen flex items-center justify-center">
                                <Loader />
                            </div>
                        }
                    >
                        <div className="flex grow flex-col">
                            <Navbar />
                            {children}
                        </div>
                    </Suspense>
                </ReactQueryProviders>
                <Footer />
                <Toaster />
                <ToasterSonner richColors />
            </body>
        </html>
    )
}
