'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { sendFlowers } from '@/fonts/index'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    return (
        <nav className="md:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between md:justify-center">
                    <button className="invisible p-2  md:hidden">
                        <span className="sr-only">Open main menu</span>
                        <MenuIcon className="block h-6 w-6" />
                        <XIcon className="hidden h-6 w-6" />
                    </button>
                    <div className="flex">
                        <div className="-ml-2 mr-6 flex items-center">
                            <Link
                                href="/"
                                className={cn(
                                    'text-6xl',
                                    sendFlowers.className,
                                    'select-none'
                                )}
                            >
                                L&apos;escale
                            </Link>
                        </div>
                        <div className="hidden items-center space-x-1 md:flex">
                            <Links className="px-3 py-2" />
                        </div>
                    </div>
                    {/* <div className="flex items-center">
                        <FlagIcon className="h-6 w-6 text-white" />
                    </div> */}
                    <div className="-mr-2 flex items-center md:hidden">
                        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                            <SheetTrigger asChild>
                                <button
                                    className="p-2"
                                    onClick={() => setIsMenuOpen(true)}
                                >
                                    <span className="sr-only">
                                        Open main menu
                                    </span>
                                    <MenuIcon className="block h-6 w-6" />
                                    <XIcon className="hidden h-6 w-6" />
                                </button>
                            </SheetTrigger>
                            <SheetContent
                                className="w-64 bg-white p-4 shadow-lg dark:bg-gray-800"
                                side="right"
                            >
                                <nav className="flex flex-col space-y-2">
                                    <Links
                                        onClick={() => {
                                            setIsMenuOpen(false)
                                        }}
                                        className="px-3 py-2"
                                    />
                                </nav>
                            </SheetContent>
                        </Sheet>
                        {/* <Button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                            className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-[#7a4d35] hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            type="button"
                        >
                            <span className="sr-only">Open main menu</span>
                            <MenuIcon className="block h-6 w-6" />
                            <XIcon className="hidden h-6 w-6" />
                        </Button> */}
                    </div>
                </div>
            </div>
        </nav>
    )
}

function FlagIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" x2="4" y1="22" y2="15" />
        </svg>
    )
}

function FlowerIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 0 4.5 4.5M7.5 12H9m7.5 0a4.5 4.5 0 1 1-4.5 4.5m4.5-4.5H15m-3 4.5V15" />
            <circle cx="12" cy="12" r="3" />
            <path d="m8 16 1.5-1.5" />
            <path d="M14.5 9.5 16 8" />
            <path d="m8 8 1.5 1.5" />
            <path d="M14.5 14.5 16 16" />
        </svg>
    )
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
    )
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    )
}

type LinksProps = {
    onClick?: () => void
    className?: string
}

export function Links({ onClick, className }: LinksProps) {
    return (
        <>
            <Link
                onClick={onClick}
                aria-current="page"
                className={cn(
                    'rounded-md text-sm font-medium text-white',
                    className
                )}
                href="/"
            >
                ACCUEIL
            </Link>
            <Link
                onClick={onClick}
                className={cn(
                    'rounded-md text-sm font-medium text-white',
                    className
                )}
                href="/reservation"
            >
                RÉSERVEZ VOTRE SÉJOUR
            </Link>
            <Link
                onClick={onClick}
                className={cn(
                    'rounded-md text-sm font-medium text-white',
                    className
                )}
                href="/contact"
            >
                CONTACT
            </Link>
            <Link
                onClick={onClick}
                className={cn(
                    'rounded-md text-sm font-medium text-white',
                    className
                )}
                href="/faq"
            >
                FAQ
            </Link>
            <Link
                onClick={onClick}
                className={cn(
                    'rounded-md text-sm font-medium text-white',
                    className
                )}
                href="/reglement"
            >
                RÈGLEMENT INTÉRIEUR
            </Link>
        </>
    )
}
