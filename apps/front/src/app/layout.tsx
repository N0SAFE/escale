import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "@/lib/fontAwesome"
import axios from "axios";
import { Toaster } from "@/components/ui/toaster";
import ClientStartup from "@/components/ClientStartup";
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body
                className={`${inter.className} text-black min-h-screen flex flex-col justify-between`}
                style={{
                    fontFamily: '"Josefin Sans", Sans-serif'
                }}
            >
                <ClientStartup />
                <div className="flex grow flex-col">
                    <Navbar />
                    {children}
                </div>
                <Footer />
                <Toaster />
            </body>
        </html>
    );
}
