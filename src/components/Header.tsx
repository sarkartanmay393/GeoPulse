import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <header id="header" className="flex flex-col items-center justify-center gap-1">
            <Link href="/">
                <Image src="/logo.jpeg" alt="GeoPulse" width={60} height={60} className="rounded-full" />
            </Link>
            <h1 className="text-3xl font-bold text-center">GeoPulse</h1>
            <p className="text-sm font-normal opacity-65 text-center">Calculate a score for the relationship between two countries.</p>
        </header>
    );
}   