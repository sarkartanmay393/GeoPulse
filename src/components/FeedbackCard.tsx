'use client';

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { RocketIcon } from "@radix-ui/react-icons";
import "driver.js/dist/driver.css";
import { FeedboxTrigger } from 'feedboxjs';
import { insertFeedback } from "~/lib/clientApi";
import { useToast } from "./ui/use-toast";

const FeedbackCard = () => {
  const { toast } = useToast();
  const handleFeedback = async (feedbackData: any) => {
    try {
      await insertFeedback(feedbackData);
      toast({
        title: "Thank you for your feedback!",
        description: 'We will take a look at it and try to improve the tool.',
        duration: 2000,
      })
    } catch (error: any) {
      toast({
        title: "Error occurred while feedback.",
        description: error?.message ?? "---",
        duration: 2000,
      })
    }
  };

  return (
    <Alert className={"my-4"}>
      <RocketIcon className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription className="flex gap-2 justify-between items-center">
        <p className="text-sm w-[70%]">
          We need your feedback to improve the tool. 
          Why not let us know if you have any suggestions or issues?
        </p>
        <FeedboxTrigger onSend={handleFeedback} />
      </AlertDescription>
    </Alert>
  );

}

export default FeedbackCard;