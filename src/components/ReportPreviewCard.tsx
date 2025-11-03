'use client';

import { Card, CardContent } from "~/components/ui/card";
import { TCountryOption, type ITableRow } from "~/lib/types";
import { cn, getCountry } from "~/lib/utils";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { InfoCircledIcon } from "@radix-ui/react-icons";

interface ReportPreviewCardProps {
  report: ITableRow;
}

export default function ReportPreviewCard({ report }: ReportPreviewCardProps) {
  const country1 = report.countries?.[0] ?? '';
  const country2 = report.countries?.[1] ?? '';
  const c1 = getCountry(country1);
  const c2 = getCountry(country2);
  const flag1 = c1?.flag ?? '🏳️';
  const flag2 = c2?.flag ?? '🏳️';
  const overallScore = Number(report.overall_score ?? 0);

  const scoreTone = (() => {
    // Map score ranges to brand-aligned Tailwind colors for quick scanning.
    if (overallScore >= 85) return "text-emerald-600";
    if (overallScore >= 70) return "text-blue-600";
    if (overallScore >= 50) return "text-amber-600";
    return "text-rose-600";
  })();

  const getFormattedCountryName = (country: TCountryOption | null) => {
    if (!country) {
      country = { label: 'Unknown Country', value: '', flag: '' , code: ''};
    }
    return country.label.length > 10 ? country.label.slice(0, 10) + '...' : country.label;
  }

  // Don't render if we don't have both countries
  if (!country1 || !country2) {
    return null;
  }

  return (
    <Link href={`/report/${report.id}`} className="block group">
      <Card className="h-full hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/30 bg-gradient-to-br from-white to-gray-50/30 overflow-hidden">
        <CardContent className="p-5 sm:p-6">
          <TooltipProvider>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Tooltip disableHoverableContent>
                  <TooltipTrigger asChild>
                    <span className="text-4xl sm:text-5xl transition-transform group-hover:scale-110 duration-300" title={country1}>
                      {flag1}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {flag1} {country1}
                  </TooltipContent>
                </Tooltip>
                <span className="text-gray-400 font-light text-sm sm:text-base">vs</span>
                <Tooltip disableHoverableContent>
                  <TooltipTrigger asChild>
                    <span className="text-4xl sm:text-5xl transition-transform group-hover:scale-110 duration-300" title={country2}>
                      {flag2}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {flag2} {country2}
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="text-right flex-shrink-0">
                <div className={cn("text-3xl sm:text-4xl font-bold transition-transform group-hover:scale-110 duration-300", scoreTone)}>
                  {overallScore}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">Overall Score</div>
              </div>
            </div>
            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground font-medium">
               {getFormattedCountryName(c1)} - {getFormattedCountryName(c2)}
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>
    </Link>
  );
}
