'use client';

import Link from "next/link";
import { InfoCircledIcon, RocketIcon } from "@radix-ui/react-icons";

import { getWikipediaUrl } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { Fragment } from "react";
import useGetCountries from "~/hooks/useGetCountries";

const SourceReferenceCard = ({ sourceMeta, reportId }: { sourceMeta?: any, reportId: string }) => {
  const { formattedCountries } = useGetCountries();

  const ele = (key: string) => {
    switch (key) {
      case "wikipedia":
        if (!sourceMeta[key]) return null;
        return (<Button asChild variant="link">
          <Link href={getWikipediaUrl(reportId, formattedCountries)} target="_blank" rel="noopener noreferrer">
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
        if (!Array.isArray(sourceMeta[key]) || sourceMeta[key].length === 0) return null;
        return (
          <Tooltip>
            <TooltipTrigger asChild className="">
              <span className="text-gray-500 text-sm flex items-center gap-1 cursor-default px-1">
                {sourceMeta[key].length === 1 ? 'News source' : 'News sources'} <InfoCircledIcon />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <ol>
                {(sourceMeta[key] || [])?.map((url: string) => <li key={url}>
                  <a href={url} target="_blank" rel="noopener">{url}</a>
                </li>)}
              </ol>
            </TooltipContent>
          </Tooltip>
        );
      default:
        return null;
    }
  }

  return (
    <Alert className="my-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-lg animation-fade-in">
      <AlertDescription className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-start sm:items-center w-full flex-wrap">
        <TooltipProvider>
          <div className="flex items-center gap-2">
            <RocketIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <p className="text-sm sm:text-base flex-1 font-medium text-gray-700">
              I&apos;m sure you care about source of the knowledge.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
            {Object.keys(sourceMeta || {}).map((key) => {
              return (
                <Fragment key={key}>
                  {ele(key)}
                </Fragment>
              );
            })}
          </div>
        </TooltipProvider>
      </AlertDescription>
    </Alert>
  );

}

export default SourceReferenceCard;