'use client';

import Link from "next/link";
import { InfoCircledIcon, RocketIcon } from "@radix-ui/react-icons";

import { getWikipediaUrl } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";

const SourceReferenceCard = ({ sourceMeta, reportId }: { sourceMeta?:  any, reportId: string }) => {
  return (
    <Alert className="my-4 flex items-center">
      <AlertDescription className="flex gap-2 justify-between items-center w-full">
        <TooltipProvider>
        <RocketIcon className="h-4 w-4 mr-1" />
        <p className="text-sm flex-1">
          I'm sure you care about source of the knowledge.
        </p>
          {Object.keys(sourceMeta || {}).map((key) => {
            switch (key) {
              case "wikipedia":
                if (!sourceMeta[key]) return null;
                return (<Button asChild variant="link">
                  <Link href={getWikipediaUrl(reportId)} target="_blank" rel="noopener noreferrer">
                    Wikipedia
                  </Link>
                </Button>);
              case 'gpt-4o-mini':
              case 'gpt-4o-2024-08-06':
                if (!sourceMeta[key]) return null;
                return (<TooltipProvider>
                  <Tooltip disableHoverableContent>
                    <TooltipTrigger asChild className="">
                      <code>gpt-4o-mini</code>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Last Training Data: Up to Oct 2023</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>)
              case 'news-api':
                if (!sourceMeta[key] || sourceMeta[key].length === 0) return null;
                return (
                  <Tooltip disableHoverableContent>
                    <TooltipTrigger asChild className="">
                      <span className="text-gray-500 text-sm flex items-center gap-1 cursor-default px-1">
                        {sourceMeta[key].length === 1 ? 'News source' : 'News sources'} <InfoCircledIcon />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <ol>
                        {sourceMeta[key]?.map((url: string) => <li>
                          <a href={url} target="_blank" rel="noopener">{url}</a>
                        </li>)}
                      </ol>
                    </TooltipContent>
                  </Tooltip>
                );
              default:
                return null;
            }
          })}
        </TooltipProvider>
      </AlertDescription>
    </Alert>
  );

}

export default SourceReferenceCard;