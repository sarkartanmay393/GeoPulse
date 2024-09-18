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
  }, [output]);


  return (
    <Alert className={output ? "mb-4" : "hidden"}>
    <RocketIcon className="h-4 w-4" />
    <AlertTitle>Mistake?</AlertTitle>
    <AlertDescription className="flex gap-2 justify-between items-center">
      <p className="text-sm w-[70%]">We noticed few mistake in the data. <span className="font-medium">If it seems wrong to you</span>, Please report those mistakes to us.</p>
      <Button
        size='sm'
        type="button"
        disabled={isReporting}
        className={cn("bg-red-500 text-white py-2 rounded-md hover:bg-red-200 transition")}
        onClick={handleReport}
      >
        {isReporting ? (
          <Spinner />
        ) : (
          "Report Wrong Score"
        )}
      </Button>
    </AlertDescription>
  </Alert>
  );

}

export default ReportCard;