import { ITableRow } from "~/lib/types";
import OutputAccordion from "./OutputAccordion";

type TProps = {
    output: ITableRow | null;
}

export default function OutputArea({ output }: TProps) {
    const Factors = {
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
        },
        "Overall Score": {
            score: output?.overall_score,
            explanation: output?.overall_explanation,
        },
    };

    return (
        <div className="w-full max-w-2xl p-8 shadow-sm border-[1px] border-solid border-gray-100 rounded-md">
            {output ? Object.keys(Factors).map((factor) => (
                <OutputAccordion
                    key={factor}
                    title={factor}
                    score={Factors[factor as keyof typeof Factors].score}
                    explanation={Factors[factor as keyof typeof Factors].explanation ?? ""}
                />
            )) : <div className="flex flex-col items-center justify-center">
                <p>No data found.</p>
                </div>}
        </div>
    );
}