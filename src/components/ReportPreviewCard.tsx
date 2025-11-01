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
    <Link href={`/report/${report.id}`} className="block">
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <TooltipProvider>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Tooltip disableHoverableContent>
                  <TooltipTrigger asChild className="">
                    <span className="text-3xl" title={country1}>{flag1}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {flag1} {country1}
                  </TooltipContent>
                </Tooltip>
                <span className="text-gray-400">vs</span>
                <Tooltip disableHoverableContent>
                  <TooltipTrigger asChild className="">
                    <span className="text-3xl" title={country2}>{flag2}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {flag2} {country2}
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="text-right translate-y-3">
                <div className={cn("text-2xl font-bold", scoreTone)}>{overallScore}</div>
                <div className="text-xs text-gray-500">Overall Score</div>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-400">
               {getFormattedCountryName(c1)} - {getFormattedCountryName(c2)}
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>
    </Link>
  );
}
