import { ITableRow } from "~/lib/types";

type TProps = {
    output: ITableRow | null;
}

export default function OutputArea({ output }: TProps) {
    return (
        <div className="p-4 max-w-2xl h-fit flex flex-col items-center justify-start rounded-sm transition">
            <h2 className="text-xl font-semibold mb-4">Output</h2>
            <div className="bg-gray-800 p-4 rounded-md">
                <pre className="whitespace-pre-wrap break-words text-white text-sm">
                    {output ? JSON.stringify(output, null, 2) : "Results will appear here after submission."}
                </pre>
            </div>
        </div>
    );
}