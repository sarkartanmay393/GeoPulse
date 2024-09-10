'use client';

import { Alert, AlertDescription } from "~/components/ui/alert";
import { RocketIcon } from "@radix-ui/react-icons";
import "driver.js/dist/driver.css";
import { Button } from "./ui/button";
import Link from "next/link";
import { getWikipediaUrl } from "~/lib/utils";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import Spinner from "./Spinner";

const SourceReferenceCard = ({ countries }: any) => {
  const wikipediaUrl = getWikipediaUrl(countries);
  const [wikipediaUrlWorks, dispatch] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(wikipediaUrl).then((response) => {
      if (response.status === 200) {
        dispatch(true);
      } else {
        dispatch(false);
      }
    }).finally(() => {
      setLoading(false);
    });
  }, [countries]);

  return (
    <Alert className="my-4 flex items-center">
      <AlertDescription className="flex gap-2 justify-between items-center w-full">
        <RocketIcon className="h-4 w-4 mr-1" />
        <p className="text-sm flex-1">
          I'm sure you care about source of the knowledge.
        </p>
        {loading ? <Spinner color="text-black" /> :
          (wikipediaUrlWorks ?
            <Button asChild variant="link">
              <Link href={wikipediaUrl}>
                Wikipedia
              </Link>
            </Button> :
            <TooltipProvider>
              <Tooltip disableHoverableContent>
                <TooltipTrigger asChild className="hidden sm:inline-block">
                  <span>gpt-4o-mini</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Last Training Data: Up to Oct 2023</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>)
        }
      </AlertDescription>
    </Alert>
  );

}

export default SourceReferenceCard;