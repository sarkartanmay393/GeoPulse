'use client';

import { useState } from "react";
import { Button } from "../components/ui/button";
import { IGeopoliticalAnalysis, ITableRow, TFormValues } from "~/lib/types";
import { geopoliticalAnalysisToTableRow, generateCountryPairId } from "~/lib/utils";
import { insertGeoPulse } from "~/lib/api";
import { createClient } from "~/lib/supabase/client";
import CountrySelectComponent from "~/components/CountrySelectComponent";
import { useForm } from "react-hook-form";
import { Form } from "~/components/ui/form";
import Spinner from "~/components/Spinner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"

const FormSchema = z.object({
  country1: z.string().min(1),
  country2: z.string().min(1),
});

export default function HomePage() {
  const [output, setOutput] = useState<ITableRow | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { country1: "", country2: "" }
  });

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    const supabase = createClient();

    if (!values.country1 || !values.country2) {
      alert("Please select both countries.");
      return;
    }

    setIsSubmitting(true);
    setOutput(null);

    const countries = [values.country1, values.country2].sort();
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <CountrySelectComponent form={form} />
            <Button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Spinner />
              ) : (
                "Measure"
              )}
            </Button>
          </form>
        </Form>
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
