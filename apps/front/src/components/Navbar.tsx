"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <nav className="bg-[#8B5A3C] pt-16 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="-ml-2 mr-6 flex items-center">
                            <FlowerIcon className="h-8 w-8 text-white" />
                        </div>
                        <div className="hidden md:flex items-center space-x-1">
                            <Links />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <FlagIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="-mr-2 flex md:hidden items-center">
                        <Button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                            className="bg-[#8B5A3C] inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-[#7a4d35] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            type="button"
                        >
                            <span className="sr-only">Open main menu</span>
                            <MenuIcon className="block h-6 w-6" />
                            <XIcon className="hidden h-6 w-6" />
                        </Button>
                    </div>
                </div>
            </div>
            <div className={`md:hidden ${isMenuOpen ? "" : "hidden"}`} id="mobile-menu">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
                    <Links />
                </div>
            </div>
        </nav>
    );
}

function FlagIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" x2="4" y1="22" y2="15" />
        </svg>
    );
}

function FlowerIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 0 4.5 4.5M7.5 12H9m7.5 0a4.5 4.5 0 1 1-4.5 4.5m4.5-4.5H15m-3 4.5V15" />
            <circle cx="12" cy="12" r="3" />
            <path d="m8 16 1.5-1.5" />
            <path d="M14.5 9.5 16 8" />
            <path d="m8 8 1.5 1.5" />
            <path d="M14.5 14.5 16 16" />
        </svg>
    );
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
    );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}

function Links() {
    return (
        <>
            <Link aria-current="page" className="text-white px-3 py-2 rounded-md text-sm font-medium" href="/">
                ACCUEIL
            </Link>
            <Link className="text-white px-3 py-2 rounded-md text-sm font-medium" href="/reservation">
                RÉSERVEZ VOTRE SÉJOUR
            </Link>
            <Link className="text-white px-3 py-2 rounded-md text-sm font-medium" href="/contact">
                CONTACT
            </Link>
            <Link className="text-white px-3 py-2 rounded-md text-sm font-medium" href="/faq">
                FAQ
            </Link>
            <Link className="text-white px-3 py-2 rounded-md text-sm font-medium" href="/reglement">
                RÈGLEMENT INTÉRIEUR
            </Link>
        </>
    );
}
