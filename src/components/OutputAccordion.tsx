import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "~/components/ui/accordion";
// import { RadicalChart } from "./RadicalChart";
import { cn } from "~/lib/utils";

type TProps = {
    title: string;
    explanation: string;
    score?: number;
}

export default function OutputAccordion({ title, explanation, score = 0 }: TProps) {
    return (
        <Accordion type="single" collapsible className="w-full max-w-2xl">
            <AccordionItem value={title}>
                <AccordionTrigger className="flex items-center justify-between gap-2 text-md font-normal leading-none">
                    <h3>{title}</h3>
                    <h3 className={cn(score > 4 ? "text-green-500" : "text-red-500")}>{score?.toLocaleString()}</h3>
                    {/* <RadicalChart score={5} /> TODO: add circular chart score */}
                </AccordionTrigger>
                <AccordionContent className="font-[300] text-sm">
                    {explanation}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}