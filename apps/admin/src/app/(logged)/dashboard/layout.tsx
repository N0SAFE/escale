'use client'

import { headers } from 'next/headers'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
    CardTitle,
    CardDescription,
    CardHeader,
    CardContent,
    Card,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenu,
} from '@/components/ui/dropdown-menu'
import React, { Suspense } from 'react'
import { MenubarSeparator } from '@/components/ui/menubar'
import { logout } from '@/lib/auth'
import { navigate } from '@/app/actions/navigate'
import ClickHandler from '@/components/ClickHandler'
import { usePathname } from 'next/navigation'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import Loader from '@/components/loader'
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import {
    Menu,
    CircleUser,
    Image as ImageIcon,
    Calendar as CalendarIcon,
    CalendarClock as CalendarClockIcon,
    Package2 as Package2Icon,
    ExternalLink as ExternalLinkIcon,
} from 'lucide-react'

type RouteLink = {
    name: string
    icon: React.ReactNode
    active: boolean
    type: 'link'
    external?: boolean
    path?: string
    url?: string
}

type RouteComponent = {
    component: React.ReactNode
    type: 'component'
}

type RouteType = RouteLink | RouteComponent

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const routes: RouteType[] = [
        {
            type: 'link',
            name: 'Stripe',
            url: 'https://dashboard.stripe.com',
            icon: <StripeIcon className="h-4 w-4" />,
            external: true,
            active: false,
        },
        {
            type: 'component',
            component: <MenubarSeparator className="bg-slate-400 my-4" />,
        },
        {
            type: 'link',
            name: 'Spas',
            path: '/spas',
            icon: <Package2Icon size="16" />,
            active: false,
        },
        {
            type: 'link',
            name: 'Services',
            path: '/services',
            icon: <Package2Icon size="16" />,
            active: false,
        },
        {
            type: 'link',
            name: 'Images',
            path: '/images',
            icon: <ImageIcon size="16" />,
            active: false,
        },
        {
            type: 'link',
            name: 'reservations',
            path: '/reservations/calendar',
            icon: <CalendarIcon size="16" />,
            active: false,
        },
        {
            type: 'link',
            name: 'availabilities',
            path: '/availabilities/calendar',
            icon: <CalendarClockIcon size="16" />,
            active: false,
        },
    ]

    // get the path after the last slash
    const head = '/dashboard'
    const pathname = usePathname()
    const tail = pathname?.split(head).pop() || '/'
    const tailWihtoutSlash = tail.slice(1).split('/')

    const routesLink = routes.filter(
        (route) => route.type === 'link'
    ) as RouteLink[]

    const route = routesLink.find((route) =>
        route?.path ? tail.startsWith(route.path) : false
    )
    if (route) {
        route.active = true
    }

    // get the path after the last slash
    return (
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
            <div className="hidden lg:block absolute border-r bg-gray-100/40 dark:bg-gray-800/40 lg:relative">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-[60px] items-center border-b px-6 gap-2">
                        <Link
                            className="flex items-center gap-2 font-semibold"
                            href="/"
                        >
                            <span className="whitespace-nowrap">
                                L&apos;escale Admin
                            </span>
                        </Link>
                    </div>
                    <div className="flex-1 overflow-auto py-2">
                        <nav className="grid items-start px-4 text-sm font-medium">
                            {routes.map((route, index) => {
                                if (route.type === 'component') {
                                    return (
                                        <div key={index}>{route.component}</div>
                                    )
                                }
                                return (
                                    <Link
                                        key={route.path}
                                        className={
                                            route.active
                                                ? `flex items-center justify-between gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50`
                                                : `flex items-center justify-between rounded-lg px-3 py-2 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50`
                                        }
                                        href={
                                            (route.path
                                                ? head + route.path
                                                : route.url) as string
                                        }
                                    >
                                        <div className="flex gap-3 items-center">
                                            {route.icon}
                                            {route.name}
                                        </div>
                                        {route.external && (
                                            <ExternalLinkIcon size="16" />
                                        )}
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>
                    <div className="mt-auto p-4">
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle>Upgrade to Pro</CardTitle>
                                <CardDescription>
                                    Unlock all features and get unlimited access
                                    to our support team
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full" size="sm">
                                    Upgrade
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <div className="flex flex-col max-h-screen  ">
                <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 justify-between lg:justify-end">
                    <Sheet>
                        <SheetTrigger className="lg:hidden" asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 lg:hidden"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">
                                    Toggle navigation menu
                                </span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side={'left'}>
                            <SheetTitle>
                                <Link
                                    className="flex items-center gap-2 font-semibold"
                                    href="/"
                                >
                                    <span className="whitespace-nowrap">
                                        L&apos;escale Admin
                                    </span>
                                </Link>
                            </SheetTitle>
                            <div className="flex h-full max-h-screen flex-col gap-2">
                                <div className="flex-1 overflow-hidden py-2">
                                    <nav className="grid items-start text-sm font-medium">
                                        {routes.map((route, index) => {
                                            if (route.type === 'component') {
                                                return (
                                                    <div key={index}>
                                                        {route.component}
                                                    </div>
                                                )
                                            }
                                            return (
                                                <Link
                                                    key={route.path}
                                                    className={
                                                        route.active
                                                            ? `flex items-center justify-between gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50`
                                                            : `flex items-center justify-between rounded-lg px-3 py-2 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50`
                                                    }
                                                    href={
                                                        (route.path
                                                            ? head + route.path
                                                            : route.url) as string
                                                    }
                                                >
                                                    <div className="flex gap-3 items-center">
                                                        {route.icon}
                                                        {route.name}
                                                    </div>
                                                    {route.external && (
                                                        <ExternalLinkIcon size="16" />
                                                    )}
                                                </Link>
                                            )
                                        })}
                                    </nav>
                                </div>
                                <div className="mt-auto p-4">
                                    <Card>
                                        <CardHeader className="pb-4">
                                            <CardTitle>
                                                Upgrade to Pro
                                            </CardTitle>
                                            <CardDescription>
                                                Unlock all features and get
                                                unlimited access to our support
                                                team
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Button
                                                className="w-full"
                                                size="sm"
                                            >
                                                Upgrade
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                    <div className="flex-1">
                        <Breadcrumb>
                            <BreadcrumbList>
                                {tailWihtoutSlash.map((crumb, index, array) => {
                                    const path = array
                                        .slice(0, index + 1)
                                        .join('/')
                                    if (index === array.length - 1) {
                                        return (
                                            <BreadcrumbItem key={index}>
                                                <BreadcrumbPage>
                                                    {crumb}
                                                </BreadcrumbPage>
                                            </BreadcrumbItem>
                                        )
                                    }
                                    return (
                                        <>
                                            <BreadcrumbItem key={index}>
                                                <BreadcrumbLink
                                                    href={head + '/' + path}
                                                >
                                                    {crumb}
                                                </BreadcrumbLink>
                                            </BreadcrumbItem>
                                            <BreadcrumbSeparator />
                                        </>
                                    )
                                })}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="secondary"
                                size="icon"
                                className="rounded-full"
                            >
                                <CircleUser className="h-5 w-5" />
                                <span className="sr-only">
                                    Toggle user menu
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                Support
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <ClickHandler
                                className="cursor-pointer"
                                onClick={async function () {
                                    await logout()
                                    navigate('/login')
                                }}
                            >
                                <DropdownMenuItem className="cursor-pointer">
                                    Logout
                                </DropdownMenuItem>
                            </ClickHandler>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                <main className="flex flex-1 flex-col gap-4 h-0">
                    <div className="p-4 md:gap-8 md:p-6 h-full overflow-y-scroll relative">
                        <Suspense
                            fallback={
                                <div className="flex justify-center items-center  w-full h-full">
                                    <Loader />
                                </div>
                            }
                        >
                            {children}
                        </Suspense>
                    </div>
                </main>
            </div>
        </div>
    )
}

function StripeIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
                <path d="M13.479 9.883c-1.626-.604-2.512-1.067-2.512-1.803 0-.622.511-.977 1.423-.977 1.667 0 3.379.642 4.558 1.22l.666-4.111c-.935-.446-2.847-1.177-5.49-1.177-1.87 0-3.425.489-4.536 1.401-1.155.954-1.757 2.334-1.757 4 0 3.023 1.847 4.312 4.847 5.403 1.936.688 2.579 1.178 2.579 1.934 0 .732-.629 1.155-1.762 1.155-1.403 0-3.716-.689-5.231-1.578l-.674 4.157c1.304.732 3.705 1.488 6.197 1.488 1.976 0 3.624-.467 4.735-1.356 1.245-.977 1.89-2.422 1.89-4.289 0-3.091-1.889-4.38-4.935-5.468h.002z"></path>
            </g>
        </svg>
    )
}
