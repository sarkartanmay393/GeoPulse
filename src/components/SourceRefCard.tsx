'use client';

import Link from "next/link";
import { ChevronDownIcon, RocketIcon } from "@radix-ui/react-icons";

import { getWikipediaUrl } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Fragment } from "react";

// Older cached reports stored news-api sources as plain URL strings;
// newer ones store {title, url, source} for a readable popover list.
type TNewsSource = string | { title?: string; url: string; source?: string };

function getHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

const SourceReferenceCard = ({ sourceMeta, reportId }: { sourceMeta?: any, reportId: string }) => {

  const ele = (key: string) => {
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
      case 'news-api': {
        const items = sourceMeta[key] as TNewsSource[];
        if (!Array.isArray(items) || items.length === 0) return null;
        const articles = items.map((item) =>
          typeof item === 'string' ? { url: item, title: undefined, source: undefined } : item
        );
        return (
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-200 rounded-full px-2.5 py-1 transition"
              >
                {articles.length === 1 ? '1 News source' : `${articles.length} News sources`}
                <ChevronDownIcon className="w-3.5 h-3.5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 max-h-72 overflow-y-auto" align="end">
              <p className="text-xs font-medium text-gray-500 mb-2">Articles used in this analysis</p>
              <ol className="space-y-3">
                {articles.map((article) => (
                  <li key={article.url}>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline line-clamp-2"
                    >
                      {article.title || getHostname(article.url)}
                    </a>
                    <p className="text-xs text-gray-400">{article.source || getHostname(article.url)}</p>
                  </li>
                ))}
              </ol>
            </PopoverContent>
          </Popover>
        );
      }
      default:
        return null;
    }
  }

  return (
    <Alert className="my-4 flex items-center">
      <AlertDescription className="flex gap-2 justify-between items-center w-full flex-wrap">
        <TooltipProvider>
          <RocketIcon className="h-4 w-4 mr-1" />
          <p className="text-sm flex-1">
            I'm sure you care about source of the knowledge.
          </p>
          {Object.keys(sourceMeta || {}).map((key) => {
            return (
              <Fragment key={key}>
                {ele(key)}
              </Fragment>
            );
          })}
        </TooltipProvider>
      </AlertDescription>
    </Alert>
  );

}

export default SourceReferenceCard;