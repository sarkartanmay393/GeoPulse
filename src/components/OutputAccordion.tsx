import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "~/components/ui/accordion";
import { RadicalChart } from "./RadicalChart";

type TProps = {
    title: string;
    explanation: string;
}

export default function OutputAccordion({ title, explanation }: TProps) {
    return (
        <Accordion type="single" collapsible>
            <AccordionItem value={title}>
                <AccordionTrigger className="flex items-center justify-between gap-2 text-sm font-medium leading-none">
                    <h3>{title}</h3>
                    <RadicalChart score={5} />
                </AccordionTrigger>
                <AccordionContent>
                    {explanation}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}