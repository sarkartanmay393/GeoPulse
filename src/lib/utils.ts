import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { v5 as uuidv5 } from 'uuid';

import { IGeopoliticalAnalysis, ITableRow } from "~/lib/types";
import { UUID_NAMESPACE } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function geopoliticalAnalysisToTableRow(analysis: IGeopoliticalAnalysis, id: string, countries: string[]): ITableRow {
  return {
    id,
    last_updated: new Date().toUTCString(),
    countries,
    diplomatic_relations_score: analysis?.diplomatic_relations?.score,
    diplomatic_relations_explanation: analysis?.diplomatic_relations?.explanation,
    economic_ties_score: analysis?.economic_ties?.score,
    economic_ties_explanation: analysis?.economic_ties?.explanation,
    military_relations_score: analysis?.military_relations?.score,
    military_relations_explanation: analysis?.military_relations?.explanation,
    political_alignments_score: analysis?.political_alignments?.score,
    political_alignments_explanation: analysis?.political_alignments?.explanation,
    cultural_social_ties_score: analysis?.cultural_social_ties?.score,
    cultural_social_ties_explanation: analysis?.cultural_social_ties?.explanation,
    historical_context_score: analysis?.historical_context?.score,
    historical_context_explanation: analysis?.historical_context?.explanation,
    overall_score: analysis?.overall_score?.score,
    overall_explanation: analysis?.overall_score?.explanation,
  };
}

export function tableRowToGeopoliticalAnalysis(row: ITableRow): IGeopoliticalAnalysis {
  return {
    diplomatic_relations: {
      score: row.diplomatic_relations_score,
      explanation: row.diplomatic_relations_explanation,
    },
    economic_ties: {
      score: row.economic_ties_score,
      explanation: row.economic_ties_explanation,
    },
    military_relations: {
      score: row.military_relations_score,
      explanation: row.military_relations_explanation,
    },
    political_alignments: {
      score: row.political_alignments_score,
      explanation: row.political_alignments_explanation,
    },
    cultural_social_ties: {
      score: row.cultural_social_ties_score,
      explanation: row.cultural_social_ties_explanation,
    },
    historical_context: {
      score: row.historical_context_score,
      explanation: row.historical_context_explanation,
    },
    overall_score: {
      score: row.overall_score,
      explanation: row.overall_explanation,
    },
  };
}

export function generateCountryPairId(country1: string, country2: string): string {
  const sortedCountries = [country1.toLowerCase(), country2.toLowerCase()].sort();
  const uniqueString = `${sortedCountries[0]}_${sortedCountries[1]}`;
  const uniqueId = uuidv5(uniqueString, UUID_NAMESPACE);

  return uniqueId;
}

// export function reverseCountryPairId(uniqueId: string): string[] {
//   return uniqueId.split('_').map(country => country.toUpperCase());
// }

export function hasMoreThanOneDecimalPlaces(number: number): boolean {
  const numStr = number.toString();
  const parts = numStr.split(".");

  if (parts.length === 2 && (parts?.[1]?.length ?? 0) > 1) {
      return true;
  }

  return false;
}