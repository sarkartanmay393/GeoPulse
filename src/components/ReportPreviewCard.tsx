'use client';

import { Card, CardContent } from "~/components/ui/card";
import { type ITableRow } from "~/lib/types";
import { getCountryFlag } from "~/lib/utils";
import Link from "next/link";

interface ReportPreviewCardProps {
  report: ITableRow;
}

export default function ReportPreviewCard({ report }: ReportPreviewCardProps) {
  const country1 = report.countries?.[0] ?? '';
  const country2 = report.countries?.[1] ?? '';
  const flag1 = getCountryFlag(country1);
  const flag2 = getCountryFlag(country2);
  const overallScore = report.overall_score ?? 0;

  // Don't render if we don't have both countries
  if (!country1 || !country2) {
    return null;
  }

  return (
    <Link href={`/report/${report.id}`} className="block">
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl" title={country1}>{flag1}</span>
              <span className="text-gray-400">vs</span>
              <span className="text-3xl" title={country2}>{flag2}</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{overallScore}</div>
              <div className="text-xs text-gray-500">Overall Score</div>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            {country1} - {country2}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
