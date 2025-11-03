'use client';

import Spinner from "./Spinner";
import { cn } from "~/lib/utils";
import { type ITableRow } from "~/lib/types";
import { Button } from "../components/ui/button";
import { RocketIcon } from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import "driver.js/dist/driver.css";
import { useCallback, useState } from "react";
import { useToast } from "./ui/use-toast";
import { insertWrongReport } from "~/lib/clientApi";

type ReportCardProps = {
  output: ITableRow | null;
};

const ReportCard = ({ output }: ReportCardProps) => {
  const { toast } = useToast();
  const [isReporting, setIsReporting] = useState(false);

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
        country1: output?.countries?.[0] ?? '',
        country2: output?.countries?.[1] ?? '',
        pulse_id: output?.id ?? '',
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
  }, [output, toast]);


  return (
    <Alert className={output ? "mb-6 border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white shadow-lg animation-fade-in" : "hidden"}>
    <RocketIcon className="h-5 w-5 text-orange-600" />
    <AlertTitle className="text-base sm:text-lg font-semibold text-orange-900">Mistake?</AlertTitle>
    <AlertDescription className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-start sm:items-center mt-2">
      <p className="text-sm sm:text-base w-full sm:w-[70%] text-gray-700">
        We noticed few mistakes in the data. <span className="font-semibold text-orange-700">If it seems wrong to you</span>, please report those mistakes to us.
      </p>
      <Button
        size='default'
        type="button"
        disabled={isReporting}
        className={cn("w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 text-white font-medium py-2 px-4 rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50")}
        onClick={handleReport}
      >
        {isReporting ? (
          <Spinner />
        ) : (
          "🚨 Report Wrong Score"
        )}
      </Button>
    </AlertDescription>
  </Alert>
  );

}

export default ReportCard;