import { cn } from "~/lib/utils";
import OutputAccordion from "./OutputAccordion";
import Spinner from "./Spinner";
import { useStore } from "~/store/useStore";

export default function OutputArea() {
    const { output, error, loading } = useStore();

    return (
        <div className={cn(
            "w-full p-4 sm:p-6 md:p-8 shadow-xl border-2 border-gray-200 rounded-2xl bg-gradient-to-br from-white to-gray-50/30 transition-all", 
            output && "mb-8 animation-scale-in"
        )}>
            {output ?
                <OutputAccordion output={output} />
                : (
                    <div className="flex gap-2 items-center justify-center py-8">
                        {error ??
                            <>
                                <p className="text-sm sm:text-base text-muted-foreground font-medium">Result will appear here</p>
                                {loading ? <Spinner color="text-primary text-sm" /> : <></>}
                            </>
                        }
                    </div>
                )}
        </div>
    );
}