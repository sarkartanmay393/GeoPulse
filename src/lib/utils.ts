import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { v5 as uuidv5 } from 'uuid';

import { IGeopoliticalAnalysis, ITableRow, TCountryOption } from "~/lib/types";
import { UUID_NAMESPACE } from "./constants";
import useGetCountries from "~/hooks/useGetCountries";
import countriesData from "../../public/countries.json";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function geopoliticalAnalysisToTableRow(analysis: IGeopoliticalAnalysis, id: string, countries: string[], source_meta?: any): ITableRow {
  const toInt = (n?: number) => (typeof n === 'number' ? Math.round(n) : undefined);

  return {
    id,
    last_updated: new Date().toUTCString(),
    countries,
    diplomatic_relations_score: toInt(analysis?.diplomatic_relations?.score),
    diplomatic_relations_explanation: analysis?.diplomatic_relations?.explanation,
    economic_ties_score: toInt(analysis?.economic_ties?.score),
    economic_ties_explanation: analysis?.economic_ties?.explanation,
    military_relations_score: toInt(analysis?.military_relations?.score),
    military_relations_explanation: analysis?.military_relations?.explanation,
    political_alignments_score: toInt(analysis?.political_alignments?.score),
    political_alignments_explanation: analysis?.political_alignments?.explanation,
    cultural_social_ties_score: toInt(analysis?.cultural_social_ties?.score),
    cultural_social_ties_explanation: analysis?.cultural_social_ties?.explanation,
    historical_context_score: toInt(analysis?.historical_context?.score),
    historical_context_explanation: analysis?.historical_context?.explanation,
    overall_score: toInt(analysis?.overall_score?.score),
    overall_explanation: analysis?.overall_score?.explanation,
    source_meta: source_meta,
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
    source: row.source,
  };
}

export function generateCountryPairId(country1: string, country2: string): string {
  const sortedCountries = [country1.toLowerCase(), country2.toLowerCase()].sort();
  const uniqueString = `${sortedCountries[0]}_${sortedCountries[1]}`;
  const uniqueId = uuidv5(uniqueString, UUID_NAMESPACE);

  return uniqueId;
}

export function findCountryPairById(reportId: string): [string, string] | null {
  const { formattedCountries } = useGetCountries();
  const countryList = formattedCountries.map((country) => country.value);
  for (let i = 0; i < countryList.length; i++) {
    for (let j = i + 1; j < countryList.length; j++) {
      const country1 = countryList[i] ?? '';
      const country2 = countryList[j] ?? '';
      const generatedId = generateCountryPairId(country1, country2);

      if (generatedId === reportId) {
        return [country1, country2];
      }
    }
  }
  return null;
}

export function hasMoreThanOneDecimalPlaces(number: number): boolean {
  const numStr = number.toString();
  const parts = numStr.split(".");

  if (parts.length === 2 && (parts?.[1]?.length ?? 0) > 1) {
    return true;
  }

  return false;
}

export function extractTextFromHtml(html: string) {
  const cheerio = require('cheerio');
  const $ = cheerio.load(html);
  $('style, script').remove();
  return $.text();
}

export function getWikipediaUrl(reportId: string) {
  const [country1, country2] = findCountryPairById(reportId) ?? [];
  return `https://en.wikipedia.org/w/rest.php/v1/page/${country1}%E2%80%93${country2}_relations/html`;
}

export function scrollByAmount(pixels: number) {
  'use client';
  window.scrollBy({
    top: pixels,
    left: 0,
    behavior: 'smooth'
  });
}

export const increamentVersion = (version: number) => {
  const factor = 0.1;
  return version + factor;
}

export function getCountry(countryName: string) {
  const countries = countriesData as TCountryOption[];
  const country = countries.find((c) => c.value === countryName);
  return country ?? null;
}