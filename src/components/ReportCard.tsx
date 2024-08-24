'use client';

import Spinner from "./Spinner";
import { cn } from "~/lib/utils";
import { type ITableRow } from "~/lib/types";
import { Button } from "../components/ui/button";
import { RocketIcon } from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import "driver.js/dist/driver.css";

type ReportCardProps = {
  output: ITableRow | null;
  isReporting: boolean;
  handleReport: () => void;
};

const ReportCard = ({ output, isReporting, handleReport }: ReportCardProps) => {
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