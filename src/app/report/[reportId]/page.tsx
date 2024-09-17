'use client';

import { useCallback, useEffect, useState } from "react";
import ReportArea from "~/components/ReportArea";
import { useToast } from "~/components/ui/use-toast";
import useGetCountries from "~/hooks/useGetCountries";
import { insertGeoPulse } from "~/lib/api";
import { insertWrongReport } from "~/lib/clientApi";
import { createClient } from "~/lib/supabase/client";
import { IGeopoliticalAnalysis, ITableRow } from "~/lib/types";
import { findCountryPairById, generateCountryPairId, geopoliticalAnalysisToTableRow, scrollByAmount } from "~/lib/utils";
import { redirect } from "next/navigation";
import { report } from "process";

export default function ReportPage({ params }: { params: { reportId: string } }) {
  const { toast } = useToast();
  const { formattedCountries } = useGetCountries();
  const reportId = (params?.reportId as string ?? '');
  const countries = findCountryPairById(reportId, formattedCountries.map((c) => c.value));
  const country1 = countries?.[0] ?? '';
  const country2 = countries?.[1] ?? '';

  if (!country1 || !country2) {
    // toast({
    //   title: "Invalid country pair.",
    //   description: "Please select both countries.",
    //   duration: 2000,
    // });
    redirect(`/`);
  }

  const [showWikipediaUrl, setShowWikipediaUrl] = useState(false);
  const [output, setOutput] = useState<ITableRow | null>(null);
  const [isReporting, setIsReporting] = useState(false);

  useEffect(() => {
    if (country1 && country2) {
      !showWikipediaUrl && setShowWikipediaUrl(true);
    } else {
      showWikipediaUrl && setShowWikipediaUrl(false);
    }
  }, [country1, country2]);

  const fetchReport = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) {
      toast({
        title: "Failed to connect to Supabase.",
        description: "Please check your internet connection.",
        duration: 2000,
      });
      return;
    }

    if (!country1 || !country2) {
      toast({
        title: "Please select both countries.",
        description: "Please select both countries.",
        duration: 2000,
      });
      return;
    }

    setOutput(null);

    const countries = [country1, country2].sort();

    try {
      const { dismiss } = toast({
        description: "Fetching cached data...",
        duration: 1000,
      });

      const { data: existingData, error } = await supabase
        .from('geo_pulses')
        .select('*')
        .eq('id', reportId)
        .order('version', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        throw new Error(error?.message ?? "Failed to fetch data from the database");
      }

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 30);

      if (existingData && new Date(existingData.last_updated) > oneWeekAgo) {
        setOutput(existingData);
      } else {
        dismiss();
        toast({
          title: "Generating data...",
          description: "This may take a minute or two...",
          duration: 4000,
        });

        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            country1: countries[0],
            country2: countries[1],
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate data");
        }

        const generatedData: IGeopoliticalAnalysis = await response.json();
        const geoPulseTableFormat = geopoliticalAnalysisToTableRow(generatedData, reportId, countries);

        setOutput(geoPulseTableFormat);
        await insertGeoPulse(geoPulseTableFormat, reportId, Object.keys(existingData ?? {}).length > 0 ? true : false, existingData?.version);
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error occurred while handling measurement.",
        description: error?.message ?? "---",
        duration: 4000,
      });
    }
  }, [country1, country2]);

  const handleReport = useCallback(async () => {
    try {
      setIsReporting(true);
      toast({
        title: "Reporting a wrong score...",
        description: "Please wait while we process your request...",
        duration: 4000,
      });
      await insertWrongReport({
        created_at: new Date().toUTCString(),
        country1: country1,
        country2: country2,
        pulse_id: generateCountryPairId(country1 ?? '', country2 ?? ''),
        report_corrected: false,
      });
      // setOutput(null);
      toast({
        title: "Reported!",
        description: "Thank you for reporting! We will be resolving this very soon.",
        duration: 3000,
      });
      document.getElementById("reset-button")?.click();
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error occurred while reporting.",
        description: error?.message ?? "---",
        duration: 2000,
      });
    } finally {
      setIsReporting(false);
    }
  }, [country1, country2]);

  useEffect(() => {
    fetchReport();
  }, []);

  useEffect(() => {
    if (reportId.length > 0) {
      scrollByAmount(392);
    }
  }, [reportId]);

  return (
    <div>
      <ReportArea
        output={output}
        country1={country1}
        country2={country2}
        isReporting={isReporting}
        handleReport={handleReport}
        showWikipediaUrl={showWikipediaUrl}
      />
    </div>
  );
}