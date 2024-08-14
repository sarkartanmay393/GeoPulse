import { ITableRow } from "~/lib/types";

type TProps = {
    output: ITableRow | null;
}

export default function OutputArea({ output }: TProps) {
    return (
        <div className="max-w-2xl overflow-y-scroll max-h-96 bg-gray-800 p-4 rounded-md">
            <pre className="whitespace-pre-wrap break-words text-white text-sm">
                {output ? JSON.stringify(output, null, 4) : "Results will appear here after submission."}
            </pre>
        </div>
    );
}