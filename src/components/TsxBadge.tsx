import Image from "next/image";
import Link from "next/link";

export default function TsxBadge() {
    return (
        <div className="mt-4 flex flex-col items-center justify-center gap-0 rounded-md bg-gray-50 px-4 py-1.5 transition">
            {/* <span className="text-xs font-medium text-gray-500">TSX</span> */}
            <Link target="_blank" href="https://github.com/sarkartanmay393" className="flex space-x-1 text-gray-500 hover:text-gray-700 text-xs font-normal transition">
                <Image src="/github.svg" alt="Github handle: sarkartanmay393" width={14} height={14} />
                <span className="">sarkartanmay393</span>
            </Link>
        </div>
    );
}