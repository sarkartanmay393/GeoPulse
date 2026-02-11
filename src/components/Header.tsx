import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <header id="header" className="flex flex-col items-center justify-center gap-3 animation-fade-in">
            <Link href="/" className="group transition-transform hover:scale-105 active:scale-95 duration-200">
                <Image 
                    src="/logo.jpeg" 
                    alt="GeoPulse" 
                    width={80} 
                    height={80} 
                    className="rounded-full shadow-lg ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300" 
                    priority
                />
            </Link>
            <div className="text-center space-y-2">
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent animate-pulse">
                    GeoPulse
                </h1>
                <p className="text-sm sm:text-base font-normal text-muted-foreground max-w-md text-balance px-4">
                    Calculate a score for the relationship between two countries
                </p>
            </div>
        </header>
    );
}   