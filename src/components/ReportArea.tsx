'use client';

import { ITableRow } from "~/lib/types";
import OutputArea from "~/components/OutputArea";
import FeedbackCard from "~/components/FeedbackCard";
import ReportCard from "~/components/ReportCard";
import SourceReferenceCard from "~/components/SourceRefCard";

interface ReportAreaProps {
  output: ITableRow | null;
  isReporting: boolean;
  handleReport: () => void;
  showWikipediaUrl: boolean;
  country1: string;
  country2: string;
}

export default function ReportArea({ 
  output, 
  country1, 
  country2, 
  isReporting, 
  handleReport, 
  showWikipediaUrl 
}: ReportAreaProps) {
  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-start p-6 transition">
      <div className="max-w-2xl space-y-8 h-full w-full">
        <div className="flex flex-col items-center justify-start rounded-sm transition">
          <h2 id="tour_step_4" className="text-xl font-semibold mb-4">Output</h2>
          <OutputArea output={output} />
          {showWikipediaUrl ? <SourceReferenceCard countries={[country1, country2]} /> : null}
          <ReportCard output={output} isReporting={isReporting} handleReport={handleReport} />
          <FeedbackCard />
        </div>
      </div>
    </main>
  );
}

