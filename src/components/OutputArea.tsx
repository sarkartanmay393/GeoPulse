import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import OutputAccordion from "./OutputAccordion";
import Spinner from "./Spinner";
import { useStore } from "~/store/useStore";

const LOADING_MESSAGES = [
    "Reading the latest Wikipedia summary…",
    "Scanning recent news coverage…",
    "Cross-referencing diplomatic history…",
    "Scoring the relationship…",
];

function useLoadingMessage(active: boolean) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (!active) {
            setIndex(0);
            return;
        }
        const id = setInterval(() => {
            setIndex((i) => (i + 1) % LOADING_MESSAGES.length);
        }, 2200);
        return () => clearInterval(id);
    }, [active]);

    return LOADING_MESSAGES[index];
}

export default function OutputArea() {
    const { output, error, loading } = useStore();
    const loadingMessage = useLoadingMessage(loading);

    return (
        <div className={cn("w-screen max-w-full p-2 sm:p-4 md:p-6 mt-2 shadow-sm border-[1px] border-solid border-gray-100 rounded-md", output && "mb-8")}>
            {output ?
                <OutputAccordion output={output} />
                : (
                    <div className="flex gap-2 items-center justify-center py-2">
                        {error ??
                            <>
                                <p className="text-sm text-gray-500">{loading ? loadingMessage : "Result will appear here"}</p>
                                {loading ? <Spinner color="text-gray-500 text-sm" /> : <></>}
                            </>
                        }
                    </div>
                )}
        </div>
    );
}