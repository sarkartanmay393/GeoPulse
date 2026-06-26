'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname?.() || "/";
    
    return (
        <header id="header" className="flex flex-col items-center justify-center gap-2">
            <Link href="/">
                <Image src="/logo.jpeg" alt="GeoPulse" width={60} height={60} className="rounded-full" />
            </Link>
            <h1 className="text-3xl font-bold text-center">GeoPulse</h1>
            <p className="text-sm font-normal opacity-65 text-center">Calculate a score for the relationship between two countries.</p>
            <nav className="flex gap-4 mt-2">
                <Link 
                    href="/" 
                    className={`text-sm px-3 py-1 rounded-md transition ${
                        pathname === "/" ? "bg-blue-500 text-white" : "text-blue-600 hover:bg-blue-50"
                    }`}
                >
                    Single Analysis
                </Link>
                <Link 
                    href="/compare" 
                    className={`text-sm px-3 py-1 rounded-md transition ${
                        pathname === "/compare" ? "bg-blue-500 text-white" : "text-blue-600 hover:bg-blue-50"
                    }`}
                >
                    Compare
                </Link>
            </nav>
        </header>
    );
}   