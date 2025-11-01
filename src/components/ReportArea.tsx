'use client';

import OutputArea from "~/components/OutputArea";
import FeedbackCard from "~/components/FeedbackCard";
import ReportCard from "~/components/ReportCard";
import SourceReferenceCard from "~/components/SourceRefCard";
import { useEffect, useState } from "react";
import { getCountry, scrollByAmount } from "~/lib/utils";
import { useStore } from "~/store/useStore";
import { useToast } from "./ui/use-toast";
import { TCountryOption } from "~/lib/types";

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


  // 
  // 

  const country1 = output?.countries?.[0] ?? '';
  const country2 = output?.countries?.[1] ?? '';
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

  return (
    <div className="flex flex-col items-center justify-start rounded-sm transition">
      <h2 id="tour_step_4" className="text-xl font-semibold mb-4">Output</h2>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl" title={country1}>{flag1}</span>
          <span className="text-gray-400">vs</span>
          <span className="text-3xl" title={country2}>{flag2}</span>
        </div>
      </div>
      <div className="mt-2 text-xs md:text-sm text-gray-400 flex flex-wrap justify-center gap-1">
        <span>{getFormattedCountryName(c1)}</span><span> - </span><span>{getFormattedCountryName(c2)}</span>
      </div>
      <OutputArea />
      {!showSourceBadge ? <></> : <>
        <SourceReferenceCard sourceMeta={output?.source_meta} reportId={reportId} />
        <ReportCard output={output} />
      </>}
      <FeedbackCard />
    </div>
  );
}

