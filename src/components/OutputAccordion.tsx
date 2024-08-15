import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "~/components/ui/accordion";
import { RadicalChart } from "./RadicalChart";
import { cn } from "~/lib/utils";
import { ITableRow } from "~/lib/types";

type TProps = {
    output: ITableRow | null;
}

export default function OutputAccordion({ output }: TProps) {
    const Factors = {
        "Overall Score": {
            score: output?.overall_score,
            explanation: output?.overall_explanation,
        },
        "Diplomatic Relations": {
            score: output?.diplomatic_relations_score,
            explanation: output?.diplomatic_relations_explanation,
        },
        "Economic Ties": {
            score: output?.economic_ties_score,
            explanation: output?.economic_ties_explanation,
        },
        "Military Relations": {
            score: output?.military_relations_score,
            explanation: output?.military_relations_explanation,
        },
        "Political Alignments": {
            score: output?.political_alignments_score,
            explanation: output?.political_alignments_explanation,
        },
        "Cultural and Social Ties": {
            score: output?.cultural_social_ties_score,
            explanation: output?.cultural_social_ties_explanation,
        },
        "Historical Context": {
            score: output?.historical_context_score,
            explanation: output?.historical_context_explanation,
        }
    };

    return (
        <Accordion type="single" collapsible className="w-full max-w-2xl">
            {Object.keys(Factors).map((factor) => (
                <AccordionItem key={factor} value={factor}>
                    <AccordionTrigger className="flex items-center justify-between gap-2 text-lg font-normal leading-none">
                        <h3>{factor}</h3>
                        <RadicalChart score={Factors[factor as keyof typeof Factors].score} />
                    </AccordionTrigger>
                    <AccordionContent className="font-[300] text-sm">
                        {Factors[factor as keyof typeof Factors].explanation}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}