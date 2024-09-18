'use client';

import OutputArea from "~/components/OutputArea";
import FeedbackCard from "~/components/FeedbackCard";
import ReportCard from "~/components/ReportCard";
import SourceReferenceCard from "~/components/SourceRefCard";
import { useEffect, useState } from "react";
import { scrollByAmount } from "~/lib/utils";
import { useStore } from "~/store/useStore";
import { useToast } from "./ui/use-toast";

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

  return (
    <div className="flex flex-col items-center justify-start rounded-sm transition">
      <h2 id="tour_step_4" className="text-xl font-semibold mb-4">Output</h2>
      <OutputArea />
      {!showSourceBadge ? <></> : <>
        <SourceReferenceCard source={output?.source} reportId={reportId} />
        <ReportCard output={output} />
      </>}
      <FeedbackCard />
    </div>
  );
}

