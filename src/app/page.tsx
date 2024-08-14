'use client';

import { useState } from "react";
import Select from "react-select";

import { Button } from "../components/ui/button";
import CustomSelectOptions from "../components/CustomSelectOptions";
import useGetCountries from "../hooks/useGetCountries";
import { IGeopoliticalAnalysis, ITableRow, TCountryOption } from "~/lib/types";
import { geopoliticalAnalysisToTableRow, generateCountryPairId } from "~/lib/utils";
import { insertGeoPulse } from "~/lib/api";
import { createClient } from "~/lib/supabase/client";

export default function HomePage() {
  const { formattedCountries, loading } = useGetCountries();
  const [selectedCountry1, setSelectedCountry1] = useState<TCountryOption | null>(null);
  const [selectedCountry2, setSelectedCountry2] = useState<TCountryOption | null>(null);
  const [output, setOutput] = useState<ITableRow | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const supabase = createClient();

    if (!selectedCountry1 || !selectedCountry2) {
      alert("Please select both countries.");
      return;
    }
  
    setIsSubmitting(true);
    setOutput(null);

    const countries = [selectedCountry1.value, selectedCountry2.value].sort();
    const generatedId = generateCountryPairId(countries[0] ?? '', countries[1] ?? '');
  
    try {
      const { data: existingData, error } = await supabase
        .from('geo_pulses')
        .select('*')
        .eq('id', generatedId)
        .maybeSingle();
  
      if (error) {
        throw new Error(error?.message ?? "Failed to fetch data from the database");
      }
  
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
      if (existingData && new Date(existingData.last_updated) > oneWeekAgo) {
        setOutput(existingData);
      } else {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            country1: countries[0],
            country2: countries[1],
          }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to generate data");
        }
  
        const generatedData: IGeopoliticalAnalysis = await response.json();
        const geoPulseTableFormat = geopoliticalAnalysisToTableRow(generatedData, generatedId, countries);

        setOutput(geoPulseTableFormat);
        await insertGeoPulse(geoPulseTableFormat, generatedId, Object.keys(existingData ?? {}).length > 0 ? true : false);
      }
    } catch (error: any) {
      console.error("Error:", error);
      alert(error?.message ?? "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6">GeoPulse</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Country 1</label>
          <Select
            isLoading={loading}
            options={formattedCountries}
            value={selectedCountry1}
            onChange={setSelectedCountry1}
            className="text-black"
            placeholder="Search for a country"
            components={{ SingleValue: CustomSelectOptions }}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Country 2</label>
          <Select
            isLoading={loading}
            options={formattedCountries}
            value={selectedCountry2}
            onChange={setSelectedCountry2}
            className="text-black"
            placeholder="Search for another country"
            components={{ SingleValue: CustomSelectOptions }}
          />
        </div>
        <Button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              Loading...
            </div>
          ) : (
            "Submit"
          )}
        </Button>
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Output</h2>
          <div className="bg-gray-800 p-4 rounded-md">
            <pre className="whitespace-pre-wrap break-words">
              {output ? JSON.stringify(output, null, 2) : "Results will appear here after submission."}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}
