import Image from "next/image";

export default function Header() {
    return (
        <header className="flex flex-col items-center justify-center gap-1">
            <Image src="/logo.jpeg" alt="GeoPulse" width={48} height={48} className="rounded-full" />
            <h1 className="text-3xl font-bold text-center">GeoPulse</h1>
            <p className="text-sm font-normal text-center">Calculate a score for the relationship between two countries.</p>
        </header>
    );
}   