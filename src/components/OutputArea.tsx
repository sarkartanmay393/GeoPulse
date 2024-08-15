import { ITableRow } from "~/lib/types";
import { cn } from "~/lib/utils";
import OutputAccordion from "./OutputAccordion";

type TProps = {
    output: ITableRow | null;
}

export default function OutputArea({ output }: TProps) {
    return (
        <div className={cn("w-screen max-w-full p-6 shadow-sm border-[1px] border-solid border-gray-100 rounded-md", output && "mb-8")}> 
            {output ?
                <OutputAccordion output={output} />
             : (
                <div className="flex flex-col items-center justify-center">
                    <p>No data found.</p>
                </div>
            )}
        </div>
    );
}