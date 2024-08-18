'use client';

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { RocketIcon } from "@radix-ui/react-icons";
import "driver.js/dist/driver.css";

const FeedbackCard = () => {
  return (
    <Alert className={"my-4"}>
      <RocketIcon className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription className="flex gap-2 justify-between items-center">
        <p className="text-sm w-[70%]">
          We need your feedback to improve the tool. 
          Why not let us know if you have any suggestions or issues?
        </p>
      </AlertDescription>
    </Alert>
  );

}

export default FeedbackCard;