import { cn } from "~/lib/utils";
import OutputAccordion from "./OutputAccordion";
import Spinner from "./Spinner";
import { useStore } from "~/store/useStore";

export default function OutputArea() {
    const { output, error, loading } = useStore();

    return (
        <div className={cn("w-screen max-w-full p-2 sm:p-4 md:p-6 shadow-sm border-[1px] border-solid border-gray-100 rounded-md", output && "mb-8")}>
            {output ?
                <OutputAccordion output={output} />
                : (
                    <div className="flex gap-2 items-center justify-center">
                        {error ??
                            <>
                                <p className="text-sm text-gray-500">Result will appear here</p>
                                {loading ? <Spinner color="text-gray-500 text-sm" /> : <></>}
                            </>
                        }
                    </div>
                )}
        </div>
    );
}