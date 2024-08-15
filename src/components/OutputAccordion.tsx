import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "~/components/ui/accordion";
import { RadicalChart } from "./RadicalChart";
import { cn } from "~/lib/utils";
import { ITableRow } from "~/lib/types";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "~/components/ui/tooltip";
import { InfoCircledIcon } from "@radix-ui/react-icons";

type TProps = {
    output: ITableRow | null;
}

export default function OutputAccordion({ output }: TProps) {
    const Factors = {
        "Overall Score": {
            score: output?.overall_score,
            explanation: output?.overall_explanation,
            info: `Check for the presence of embassies, frequency of official visits, and existence of treaties.`
        },
        "Diplomatic Relations": {
            score: output?.diplomatic_relations_score,
            explanation: output?.diplomatic_relations_explanation,
            info: `Check for the presence of embassies, frequency of official visits, and existence of treaties.`
        },
        "Economic Ties": {
            score: output?.economic_ties_score,
            explanation: output?.economic_ties_explanation,
            info: `Analyze trade volume, investment flows, and any economic sanctions`
        },
        "Military Relations": {
            score: output?.military_relations_score,
            explanation: output?.military_relations_explanation,
            info: `Consider defense agreements, joint military exercises, and arms sales.c`
        },
        "Political Alignments": {
            score: output?.political_alignments_score,
            explanation: output?.political_alignments_explanation,
            info: `Evaluate voting patterns in international organizations and public statements by leaders.`
        },
        "Cultural and Social Ties": {
            score: output?.cultural_social_ties_score,
            explanation: output?.cultural_social_ties_explanation,
            info: `Levels of tourism, student exchanges, cultural programs, and migration patterns. How citizens view each other, often measured through surveys, and how each country is portrayed in the other’s media.`
        },
        "Historical Context": {
            score: output?.historical_context_score,
            explanation: output?.historical_context_explanation,
            info: `Consider past conflicts or cooperation.`
        }
    };

    return (
        <TooltipProvider>
            <Accordion type="single" defaultValue="Overall Score" collapsible className="w-full max-w-2xl space-y-4">
                {Object.keys(Factors).map((factor) => (
                    <AccordionItem key={factor} value={factor} className="border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition">
                        <AccordionTrigger className="p-4 hover:no-underline flex items-center justify-between gap-2 text-lg font-normal leading-none no-underline">
                            <h3>{factor}</h3>
                            <Tooltip disableHoverableContent>
                                <TooltipTrigger>
                                    <InfoCircledIcon className="w-3.5 h-3.5 text-gray-400 hover:text-gray-500 transition" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{Factors[factor as keyof typeof Factors].info}</p>
                                </TooltipContent>
                            </Tooltip>
                            <RadicalChart score={Factors[factor as keyof typeof Factors].score} />
                        </AccordionTrigger>
                        <AccordionContent className="font-[300] text-sm p-4 bg-gray-50">
                            {Factors[factor as keyof typeof Factors].explanation}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </TooltipProvider>
    );
}