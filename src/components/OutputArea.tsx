import { ITableRow } from "~/lib/types";
import { cn } from "~/lib/utils";
import OutputAccordion from "./OutputAccordion";

type TProps = {
    output: ITableRow | null;
}

export default function OutputArea({ output }: TProps) {
    return (
        <div className={cn("w-screen max-w-full p-2 sm:p-4 md:p-6 shadow-sm border-[1px] border-solid border-gray-100 rounded-md", output && "mb-8")}> 
            {output ?
                <OutputAccordion output={output} />
             : (
                <div className="flex flex-col items-center justify-center">
                    <p className="text-sm text-gray-500">Result will appear here.</p>
                </div>
            )}
        </div>
    );
}