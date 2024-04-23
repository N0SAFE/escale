'use client'

import Loader from '@/components/atomics/atoms/Loader'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { Suspense } from 'react'

const tabList = [
    {
        name: 'home',
        path: '/home',
    },
    {
        name: 'faq',
        path: '/faq',
    },
    {
        name: 'rules',
        path: '/rules',
    },
]

export default function Websitelayout({
    children,
}: React.PropsWithChildren<{}>) {
    const basePath = '/dashboard/website'
    const pathname = usePathname()
    const selectedTab = pathname.slice(basePath.length)

    return (
        <>
            <Tabs
                className="w-full flex justify-center pb-2"
                value={selectedTab || 'calendar'}
            >
                <TabsList className="w-fit">
                    {tabList.map((tab) => (
                        <Link href={`${basePath}${tab.path}`} key={tab.name}>
                            <TabsTrigger value={tab.path}>
                                {tab.name}
                            </TabsTrigger>
                        </Link>
                    ))}
                </TabsList>
            </Tabs>
            <Suspense
                fallback={
                    <div className="w-full h-full flex justify-center items-center">
                        <Loader />
                    </div>
                }
            >
                {children}
            </Suspense>
        </>
    )
}
