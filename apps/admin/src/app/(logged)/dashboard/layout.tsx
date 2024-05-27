'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
    CardTitle,
    CardDescription,
    CardHeader,
    CardContent,
    Card,
} from '@/components/ui/card'
import {
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenu,
} from '@/components/ui/dropdown-menu'
import React, { Suspense, useEffect } from 'react'
import { MenubarSeparator } from '@/components/ui/menubar'
import { logout } from '@/lib/auth'
import { navigate } from '@/actions/navigate'
import ClickHandler from '@/components/atomics/atoms/ClickHandler'
import { usePathname } from 'next/navigation'
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import Loader from '@/components/atomics/atoms/Loader'
import { v4 as uuid } from 'uuid'
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
    Presentation as PresentationIcon,
    Users,
    Wifi,
    Home,
    Files,
    ArrowUp,
    ArrowRight,
    ArrowDown,
} from 'lucide-react'
import { useMediaQuery } from '@uidotdev/usehooks'
import dynamic from 'next/dynamic'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer'

interface RouteLink {
    name: string
    icon: React.ReactNode
    active: boolean
    type: 'link'
    external?: boolean
    path?: string
    url?: string
}

interface RouteComponent {
    component: React.ReactNode
    type: 'component'
}

interface RouteDirectory {
    active: boolean
    type: 'directory'
    name: string
    path: string
    icon: React.ReactNode
    children: RouteType[]
}

type RouteType = RouteLink | RouteComponent | RouteDirectory

const ITEMS_TO_DISPLAY_IN_BREADCRUMB = 2

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
            component: <MenubarSeparator className="my-4 bg-slate-400" />,
        },
        {
            type: 'link',
            name: 'Users',
            path: '/users',
            icon: <Users size="16" />,
            active: false,
        },
        {
            type: 'link',
            name: 'Spas',
            path: '/spas',
            icon: <Home size="16" />,
            active: false,
        },
        {
            type: 'link',
            name: 'Services',
            path: '/services',
            icon: <Wifi size="16" />,
            active: false,
        },
        {
            type: 'directory',
            icon: <Files size="16" />,
            name: 'Files',
            path: '/files',
            active: false,
            children: [
                {
                    type: 'link',
                    name: 'Images',
                    path: '/images',
                    icon: <ImageIcon size="16" />,
                    active: false,
                },
            ],
        },

        {
            type: 'link',
            name: 'reservations',
            path: '/reservations',
            icon: <CalendarIcon size="16" />,
            active: false,
        },
        {
            type: 'link',
            name: 'availabilities',
            path: '/availabilities',
            icon: <CalendarClockIcon size="16" />,
            active: false,
        },
        {
            type: 'component',
            component: <MenubarSeparator className="my-4 bg-slate-400" />,
        },
        {
            type: 'link',
            name: 'website',
            path: '/website',
            icon: <PresentationIcon size="16" />,
            active: false,
        },
    ]

    const [routeIsChanging, setRouteIsChanging] = React.useState(false)

    // get the path after the last slash
    const head = '/dashboard'
    const pathname = usePathname()
    const tail = pathname?.split(head).pop() || '/'

    const routesLink = routes.filter(
        (route) => route.type === 'link'
    ) as RouteLink[]

    const activateRoute = (routes: RouteType[], path: string = '') => {
        return routes.map((route): RouteType => {
            if (route.type === 'link') {
                return {
                    ...route,
                    active: tail.startsWith(path + route.path),
                } as RouteLink
            }
            if (route.type === 'directory') {
                const children = activateRoute(
                    route.children,
                    path + route.path
                )
                const isSomeActive = children.some((child) =>
                    child.type === 'link' || child.type === 'directory'
                        ? child.active
                        : false
                )
                return {
                    ...route,
                    children,
                    active: isSomeActive,
                } as RouteDirectory
            }
            return route as RouteType
        })
    }

    const [routeState, setRouteState] = React.useState(activateRoute(routes))

    useEffect(() => {
        setRouteState(activateRoute(routes))
        setRouteIsChanging(false)
    }, [pathname])

    const onClickHandler = (route: RouteType) => {
        if (route.type !== 'link') {
            return
        }
        const buildArray = (routes: RouteType[]) => {
            return routes.map((r): RouteType => {
                if (r.type === 'link') {
                    if (r.name === route.name) {
                        return {
                            ...r,
                            active: true,
                        } as RouteLink
                    }
                    return {
                        ...r,
                        active: false,
                    } as RouteLink
                }
                if (r.type === 'directory') {
                    const childArray = buildArray(r.children)
                    const isSomeActive = childArray.some((child) =>
                        child.type === 'link' || child.type === 'directory'
                            ? child.active
                            : false
                    )
                    return {
                        ...r,
                        children: childArray,
                        active: isSomeActive,
                    } as RouteDirectory
                }
                return r
            })
        }
        const array = buildArray(routeState)
        setRouteState(array)
        const getFullPath = (routes: RouteType[]): string => {
            const activeRoute = routes.find((r) =>
                r.type === 'link' || r.type === 'directory' ? r.active : false
            )
            if (activeRoute?.type === 'link') {
                return activeRoute.path || ''
            }
            if (activeRoute?.type === 'directory') {
                return activeRoute.path + getFullPath(activeRoute.children)
            }
            return ''
        }
        if (route.external) {
            return
        }
        if (tail.startsWith(getFullPath(array))) {
            return
        }
        setRouteIsChanging(true)
    }

    const tailWihtoutSlash = routeIsChanging
        ? (
              routes
                  .filter((r) => r.type === 'link')
                  .find((r) => (r as RouteLink).active) as RouteLink
          )?.path
              ?.slice(1)
              ?.split('/')! || []
        : tail.slice(1).split('/')

    // get the path after the last slash
    return (
        <div className="h-[inherit] w-[inherit] lg:grid lg:grid-cols-[280px_1fr]">
            <div className="absolute hidden w-[280px] border-r bg-gray-100/40 dark:bg-gray-800/40 lg:relative lg:block">
                <div className="flex h-full w-full flex-col gap-2">
                    <div className="flex h-[60px] items-center gap-2 border-b px-6">
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
                            <Nav
                                routes={routeState}
                                onClickHandler={onClickHandler}
                                head={head}
                            />
                        </nav>
                    </div>
                </div>
            </div>

            <div className="flex h-[inherit] flex-col ">
                <header className="flex h-14 items-center justify-between gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 lg:h-[60px] lg:justify-end">
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
                                        <Nav
                                            routes={routeState}
                                            onClickHandler={onClickHandler}
                                            head={head}
                                        />
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
                        <BreadcrumbSection
                            array={tailWihtoutSlash}
                            ITEMS_TO_DISPLAY_IN_BREADCRUMB={
                                ITEMS_TO_DISPLAY_IN_BREADCRUMB
                            }
                            calculateHref={(crumb, index, array) => {
                                return (
                                    head +
                                    '/' +
                                    array.slice(0, index + 1).join('/')
                                )
                            }}
                        />
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
                <main className="flex h-0 flex-1 flex-col gap-4">
                    <div className="relative h-full overflow-y-auto p-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-secondary md:gap-8 md:p-6">
                        {routeIsChanging ? (
                            <div className="flex h-full w-full  items-center justify-center">
                                <Loader />
                            </div>
                        ) : (
                            <Suspense
                                fallback={
                                    <div className="flex h-full w-full  items-center justify-center">
                                        <Loader />
                                    </div>
                                }
                            >
                                {children}
                            </Suspense>
                        )}
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
            <path d="M13.479 9.883c-1.626-.604-2.512-1.067-2.512-1.803 0-.622.511-.977 1.423-.977 1.667 0 3.379.642 4.558 1.22l.666-4.111c-.935-.446-2.847-1.177-5.49-1.177-1.87 0-3.425.489-4.536 1.401-1.155.954-1.757 2.334-1.757 4 0 3.023 1.847 4.312 4.847 5.403 1.936.688 2.579 1.178 2.579 1.934 0 .732-.629 1.155-1.762 1.155-1.403 0-3.716-.689-5.231-1.578l-.674 4.157c1.304.732 3.705 1.488 6.197 1.488 1.976 0 3.624-.467 4.735-1.356 1.245-.977 1.89-2.422 1.89-4.289 0-3.091-1.889-4.38-4.935-5.468h.002z"></path>
        </svg>
    )
}

type BreadcrumbSectionProps<T> = {
    ITEMS_TO_DISPLAY_IN_BREADCRUMB: number
    array: T[]
    calculateHref: (crumb: T, index: number, array: T[]) => string
    display?: (crumb: T) => React.ReactNode
}

const BreadcrumbSection = function <T>({
    ITEMS_TO_DISPLAY_IN_BREADCRUMB,
    array: totalArray,
    calculateHref,
    display,
}: BreadcrumbSectionProps<T>) {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {totalArray?.length <= ITEMS_TO_DISPLAY_IN_BREADCRUMB ? (
                    totalArray.map((i, index, array) => {
                        const href = calculateHref(i, index, totalArray)
                        return (
                            <>
                                <BreadcrumbItem key={`${index}`}>
                                    {index === totalArray.length - 1 ? (
                                        <BreadcrumbPage>
                                            {display
                                                ? display(i)
                                                : (i as React.ReactNode)}
                                        </BreadcrumbPage>
                                    ) : (
                                        <>
                                            <BreadcrumbLink href={href}>
                                                {display
                                                    ? display(i)
                                                    : (i as React.ReactNode)}
                                            </BreadcrumbLink>
                                        </>
                                    )}
                                </BreadcrumbItem>
                                {index !== array.length - 1 ? (
                                    <BreadcrumbSeparator
                                        key={`${index}-separator`}
                                    />
                                ) : (
                                    <></>
                                )}
                            </>
                        )
                    })
                ) : (
                    <>
                        <BreadcrumbItem>
                            {(() => {
                                const href = calculateHref(
                                    totalArray[0],
                                    0,
                                    totalArray
                                )
                                return (
                                    <BreadcrumbLink href={href}>
                                        {display
                                            ? display(totalArray[0])
                                            : (totalArray[0] as React.ReactNode)}
                                    </BreadcrumbLink>
                                )
                            })()}
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <EllipsisBreadcrumbElement
                            ITEMS_TO_DISPLAY_IN_BREADCRUMB={
                                ITEMS_TO_DISPLAY_IN_BREADCRUMB
                            }
                            array={totalArray}
                            display={display}
                            calculateHref={calculateHref}
                        />
                        <BreadcrumbSeparator />
                        {totalArray
                            .slice(-ITEMS_TO_DISPLAY_IN_BREADCRUMB + 1)
                            .map((i, index, array) => {
                                const href = calculateHref(
                                    i,
                                    index + -ITEMS_TO_DISPLAY_IN_BREADCRUMB + 1,
                                    totalArray
                                )
                                const isLast = index === array.length - 1
                                return (
                                    <BreadcrumbItem key={index}>
                                        {!isLast ? (
                                            <>
                                                <BreadcrumbLink
                                                    asChild
                                                    className="max-w-20 truncate md:max-w-none"
                                                >
                                                    <Link href={href}>
                                                        {display
                                                            ? display(i)
                                                            : (i as React.ReactNode)}
                                                    </Link>
                                                </BreadcrumbLink>
                                                <BreadcrumbSeparator />
                                            </>
                                        ) : (
                                            <BreadcrumbPage className="max-w-20 truncate md:max-w-none">
                                                {display
                                                    ? display(i)
                                                    : (i as React.ReactNode)}
                                            </BreadcrumbPage>
                                        )}
                                    </BreadcrumbItem>
                                )
                            })}
                    </>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

type EllipsisBreadcrumbElementProps<T> = {
    ITEMS_TO_DISPLAY_IN_BREADCRUMB: number
    array: T[]
    calculateHref: (crumb: T, index: number, array: T[]) => string | URL
    display?: (crumb: T) => React.ReactNode
}

function EllipsisBreadcrumbElement<T>({
    ITEMS_TO_DISPLAY_IN_BREADCRUMB,
    array: totalArray,
    calculateHref,
    display,
}: EllipsisBreadcrumbElementProps<T>) {
    const [open, setOpen] = React.useState(false)
    return (
        <BreadcrumbItem className="gap-0">
            <BreadcrumbEllipsis
                onClick={() => {
                    setOpen(!open)
                }}
                className="h-4 w-4 cursor-pointer"
            />
            <EllipsisBreadcrumbMenuElementNoSSR
                ITEMS_TO_DISPLAY_IN_BREADCRUMB={ITEMS_TO_DISPLAY_IN_BREADCRUMB}
                array={totalArray}
                calculateHref={calculateHref}
                display={display}
                open={open}
                setOpen={setOpen}
            />
        </BreadcrumbItem>
    )
}

type EllipsisBreadcrumbMenuElementProps<T> = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
} & EllipsisBreadcrumbElementProps<T>

function EllipsisBreadcrumbMenuElement<T>({
    open,
    setOpen,
    ITEMS_TO_DISPLAY_IN_BREADCRUMB,
    array: totalArray,
    calculateHref,
    display,
}: EllipsisBreadcrumbMenuElementProps<T>) {
    const isDesktop = useMediaQuery('(min-width: 768px)')
    return isDesktop ? (
        <>
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger className="invisible w-0">
                    <BreadcrumbEllipsis className="h-4 w-0" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {totalArray
                        .slice(1, -(ITEMS_TO_DISPLAY_IN_BREADCRUMB - 1))
                        .map((i, index) => {
                            const href = calculateHref(i, index + 1, totalArray)
                            return (
                                <DropdownMenuItem
                                    key={index}
                                    asChild
                                    className="cursor-pointer"
                                >
                                    <Link href={href}>
                                        {display
                                            ? display(i)
                                            : (i as React.ReactNode)}
                                    </Link>
                                </DropdownMenuItem>
                            )
                        })}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    ) : (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Navigate to</DrawerTitle>
                    <DrawerDescription>
                        Select a page to navigate to.
                    </DrawerDescription>
                </DrawerHeader>
                <div className="grid gap-1 px-4">
                    {totalArray
                        .slice(1, -(ITEMS_TO_DISPLAY_IN_BREADCRUMB - 1))
                        .map((i, index) => {
                            const href = calculateHref(i, index + 1, totalArray)
                            return (
                                <Link
                                    key={index}
                                    href={href}
                                    className="py-1 text-sm"
                                >
                                    {display
                                        ? display(i)
                                        : (i as React.ReactNode)}
                                </Link>
                            )
                        })}
                </div>
                <DrawerFooter className="pt-4">
                    <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

const EllipsisBreadcrumbMenuElementNoSSR = dynamic(
    function <T>() {
        return Promise.resolve(EllipsisBreadcrumbMenuElement<T>)
    },
    {
        ssr: false,
    }
) as <T>(props: EllipsisBreadcrumbMenuElementProps<T>) => JSX.Element

export function Nav({
    routes,
    onClickHandler,
    head,
}: {
    routes: RouteType[]
    onClickHandler: (route: RouteType) => void
    head: string
}) {
    return routes.map((route, index) => {
        return (
            <div key={uuid()}>
                {route.type === 'component' ? (
                    <div>{route.component}</div>
                ) : route.type === 'link' ? (
                    <Link
                        onClick={() => onClickHandler(route)}
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
                        <div className="flex items-center gap-3">
                            {route.icon}
                            {route.name}
                        </div>
                        {route.external && <ExternalLinkIcon size="16" />}
                    </Link>
                ) : (
                    <NavDir
                        route={route}
                        head={head}
                        onClickHandler={onClickHandler}
                    />
                )}
            </div>
        )
    })
}

export function NavDir({
    route,
    head,
    onClickHandler,
}: {
    route: RouteDirectory
    head: string
    onClickHandler: (route: RouteType) => void
}) {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <div>
            <div
                className="flex items-center justify-between gap-3 rounded-lg transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Button
                    className="flex w-full items-center justify-between gap-3 px-3 py-2 hover:bg-inherit"
                    variant="ghost"
                >
                    <div className="flex items-center gap-3">
                        {route.icon}
                        {route.name}
                    </div>
                    {isOpen || route.active ? (
                        <ArrowDown className="h-4 w-4" />
                    ) : (
                        <ArrowRight className="h-4 w-4" />
                    )}
                </Button>
            </div>
            {(isOpen || route.active) && (
                <div className="pl-4">
                    <Nav
                        routes={route.children}
                        head={head + route.path}
                        onClickHandler={onClickHandler}
                    />
                </div>
            )}
        </div>
    )
}
