import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "~/components/ui/accordion";
import CircularPercentage from "./CircularPercentage";
import { cn } from "~/lib/utils";
import { ITableRow } from "~/lib/types";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "~/components/ui/tooltip";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { RadicalChart } from "./RadicalChart";

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

    const [accordionValue, setAccordionValue] = useState<string>("Overall Score");

    const chartData = [
        { keyFactor: "Diplomatic Relations", score: (output?.diplomatic_relations_score ?? 0) },
        { keyFactor: "Economic Ties", score: (output?.economic_ties_score ?? 0) },
        { keyFactor: "Military Relations", score: (output?.military_relations_score ?? 0) },
        { keyFactor: "Political Alignments", score: (output?.political_alignments_score ?? 0) },
        { keyFactor: "Cultural and Social Ties", score: (output?.cultural_social_ties_score ?? 0) },
        { keyFactor: "Historical Context", score: (output?.historical_context_score ?? 0) },
    ];

    return (
        <TooltipProvider>
            <Accordion value={accordionValue} onValueChange={setAccordionValue} type="single" defaultValue="Overall Score" collapsible className="w-full space-y-3 sm:space-y-4">
                {Object.keys(Factors).map((factor) => (
                    <AccordionItem key={factor} value={factor} className={cn(
                        "border-2 border-gray-200 rounded-xl shadow-md hover:shadow-lg hover:border-primary/30 transition-all duration-300",
                        accordionValue === factor ? "bg-gradient-to-br from-blue-50 to-white border-primary/40 shadow-lg" : "bg-white",
                        'Overall Score' === factor ? "ring-2 ring-primary/20" : ""
                    )} >
                        <AccordionTrigger className="p-4 sm:p-5 hover:no-underline flex items-center justify-between gap-4 leading-none no-underline group">
                            <div className="w-full flex flex-col sm:flex-row sm:items-center justify-start gap-2">
                                <h3 className="text-left text-base sm:text-lg md:text-xl font-semibold group-hover:text-primary transition-colors">{factor}</h3>
                                <span className="text-left text-xs font-[300] text-muted-foreground block sm:hidden">{Factors[factor as keyof typeof Factors].info}</span>
                                <Tooltip disableHoverableContent>
                                    <TooltipTrigger asChild className="hidden sm:inline-block">
                                        <InfoCircledIcon className="w-4 h-4 text-gray-400 hover:text-primary transition-colors" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{Factors[factor as keyof typeof Factors].info}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <CircularPercentage percentage={(Factors[factor as keyof typeof Factors].score ?? 0)} />
                        </AccordionTrigger>
                        <AccordionContent className="font-[400] text-sm sm:text-base p-4 sm:p-5 bg-gradient-to-br from-gray-50 to-white text-gray-700 flex flex-col gap-4 rounded-b-xl">
                            {Factors[factor as keyof typeof Factors].explanation}
                            {factor === 'Overall Score' ? <RadicalChart chartData={chartData} /> : null}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </TooltipProvider>
    );
}