'use client'

import Loader from '@/components/loader'
import { getSession, getUser, isLogin, refreshToken } from '@/lib/auth'
import { redirect, usePathname } from 'next/navigation'
import React from 'react'
import { navigate } from '../actions/navigate'

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const pathname = usePathname()
    const [isLoading, setIsLoading] = React.useState(true)
    React.useEffect(() => {
        isLogin().then(async function (logged) {
            if (!logged) {
                const session = await refreshToken()
                if (!session?.isAuthenticated) {
                    return navigate(
                        '/login?error=You are not authorized to access this page. Please login to continue.&redirectPath=' +
                            pathname
                    )
                }
            }
            setIsLoading(false)
        })
    }, [pathname])

    if (isLoading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center">
                <Loader />
            </div>
        )
    }
    return <>{children}</>
}
