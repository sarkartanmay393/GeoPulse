'use client';

import OutputArea from "~/components/OutputArea";
import FeedbackCard from "~/components/FeedbackCard";
import ReportCard from "~/components/ReportCard";
import SourceReferenceCard from "~/components/SourceRefCard";
import { RadicalChart } from "~/components/RadicalChart";
import { useEffect, useState } from "react";
import { findCountryPairById, getCountry, scrollByAmount } from "~/lib/utils";
import { useStore } from "~/store/useStore";
import { useToast } from "./ui/use-toast";
import { TCountryOption } from "~/lib/types";
import { SCORE_TONES } from "~/lib/scoreTone";

interface ReportAreaProps {
  reportId: string;
}

export default function ReportArea({ reportId }: ReportAreaProps) {
  const { toast } = useToast();
  const { output, fetchReport, error } = useStore();
  const [showSourceBadge, setShowSourceBadge] = useState(false);

  useEffect(() => {
    try {
      if (reportId) {
        fetchReport(reportId);
      }
    } catch (error: any) {
      toast({
        title: "Error occurred while fetching report.",
        description: error?.message ?? "---",
        duration: 2000,
      });
    }
  }, [reportId]);

  useEffect(() => {
    if (output) {
      scrollByAmount(392);
      setShowSourceBadge(true);
    } else {
      setShowSourceBadge(false);
    }
  }, [output]);

  const [fallbackCountry1, fallbackCountry2] = findCountryPairById(reportId) ?? ['', ''];
  const country1 = output?.countries?.[0] ?? fallbackCountry1;
  const country2 = output?.countries?.[1] ?? fallbackCountry2;
  const c1 = getCountry(country1);
  const c2 = getCountry(country2);
  const flag1 = c1?.flag ?? '🏳️';
  const flag2 = c2?.flag ?? '🏳️';

  const getFormattedCountryName = (country: TCountryOption | null) => {
    if (!country) {
      country = { label: 'Unknown Country', value: '', flag: '', code: '' };
    }
    return country.label;
  }

  const chartData = [
    { keyFactor: "Diplomatic Relations", score: output?.diplomatic_relations_score ?? 0 },
    { keyFactor: "Economic Ties", score: output?.economic_ties_score ?? 0 },
    { keyFactor: "Military Relations", score: output?.military_relations_score ?? 0 },
    { keyFactor: "Political Alignments", score: output?.political_alignments_score ?? 0 },
    { keyFactor: "Cultural and Social Ties", score: output?.cultural_social_ties_score ?? 0 },
    { keyFactor: "Historical Context", score: output?.historical_context_score ?? 0 },
  ];

  return (
    <div className="flex flex-col items-center justify-start rounded-sm transition">
      <h2 id="tour_step_4" className="text-xl font-semibold mb-4">Output</h2>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl" title={country1}>{flag1}</span>
          <span className="text-gray-500">vs</span>
          <span className="text-3xl" title={country2}>{flag2}</span>
        </div>
      </div>
      <div className="mt-2 text-xs md:text-sm text-gray-500 flex flex-wrap justify-center gap-1">
        <span>{getFormattedCountryName(c1)}</span><span> - </span><span>{getFormattedCountryName(c2)}</span>
      </div>
      {output ? (
        <div className="w-full max-w-2xl">
          <RadicalChart chartData={chartData} />
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 -mt-2 mb-2 text-xs text-gray-500">
            {SCORE_TONES.map((tone) => (
              <span key={tone.label} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tone.hex }} />
                {tone.label} ({tone.rangeLabel})
              </span>
            ))}
          </div>
        </div>
      ) : null}
      <OutputArea />
      {!showSourceBadge ? <></> : <>
        <SourceReferenceCard sourceMeta={output?.source_meta} reportId={reportId} />
        <ReportCard output={output} />
      </>}
      <FeedbackCard />
    </div>
  );
}

