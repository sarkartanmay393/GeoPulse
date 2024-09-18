'use client';

import Link from "next/link";
import { RocketIcon } from "@radix-ui/react-icons";

import { getWikipediaUrl } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";

const SourceReferenceCard = ({ source, reportId }: any) => {
  return (
    <Alert className="my-4 flex items-center">
      <AlertDescription className="flex gap-2 justify-between items-center w-full">
        <RocketIcon className="h-4 w-4 mr-1" />
        <p className="text-sm flex-1">
          I'm sure you care about source of the knowledge.
        </p>
        {source?.includes('wikipedia') ?
            <Button asChild variant="link">
              <Link href={getWikipediaUrl(reportId)}>
                Wikipedia
              </Link>
            </Button> :
            <TooltipProvider>
              <Tooltip disableHoverableContent>
                <TooltipTrigger asChild className="">
                  <code>gpt-4o-mini</code>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Last Training Data: Up to Oct 2023</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
        }
      </AlertDescription>
    </Alert>
  );

}

export default SourceReferenceCard;