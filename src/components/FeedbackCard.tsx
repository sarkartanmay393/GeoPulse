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
    <Alert className="my-6 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white shadow-lg animation-fade-in">
      <RocketIcon className="h-5 w-5 text-purple-600" />
      <AlertTitle className="text-base sm:text-lg font-semibold text-purple-900">Heads up!</AlertTitle>
      <AlertDescription className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-start sm:items-center mt-2">
        <p className="text-sm sm:text-base w-full sm:w-[70%] text-gray-700">
          We need your feedback to improve the tool. 
          Why not let us know if you have any suggestions or issues?
        </p>
        <FeedboxTrigger onSend={handleFeedback} />
      </AlertDescription>
    </Alert>
  );

}

export default FeedbackCard;