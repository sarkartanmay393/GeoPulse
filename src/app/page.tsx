'use client';

import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { IGeopoliticalAnalysis, ITableRow } from "~/lib/types";
import { geopoliticalAnalysisToTableRow, generateCountryPairId, cn } from "~/lib/utils";
import { insertGeoPulse } from "~/lib/api";
import { insertWrongReport } from "~/lib/clientApi";
import { createClient } from "~/lib/supabase/client";
import CountrySelectComponent from "~/components/CountrySelectComponent";
import { useForm } from "react-hook-form";
import { Form } from "~/components/ui/form";
import Spinner from "~/components/Spinner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import Header from "~/components/Header";
import { useToast } from "~/components/ui/use-toast";
import OutputArea from "~/components/OutputArea";
import TsxBadge from "~/components/TsxBadge";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { RocketIcon } from "@radix-ui/react-icons";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const FormSchema = z.object({
  country1: z.string().min(1),
  country2: z.string().min(1),
});

export default function HomePage() {
  const { toast } = useToast();
  const [output, setOutput] = useState<ITableRow | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { country1: "", country2: "" }
  });

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    'use client';
    const supabase = createClient();
    if (!supabase) {
      toast({
        title: "Failed to connect to Supabase.",
        description: "Please check your internet connection.",
        duration: 2000,
      });
      return;
    }

    if (!values.country1 || !values.country2) {
      toast({
        title: "Please select both countries.",
        description: "Please select both countries.",
        duration: 2000,
      });
      return;
    }

    setIsSubmitting(true);
    setOutput(null);

    const countries = [values.country1, values.country2].sort();
    const generatedId = generateCountryPairId(countries[0] ?? '', countries[1] ?? '');

    try {
      const { dismiss } = toast({
        description: "Fetching cached data...",
        duration: 1000,
      });

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
        dismiss();
        toast({
          title: "Generating data...",
          description: "This may take a minute or two...",
          duration: 4000,
        });

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
      toast({
        title: "Error occurred while handling measurement.",
        description: error?.message ?? "---",
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReport = async () => {
    try {
      setIsReporting(true);
      toast({
        title: "Reporting a wrong score...",
        description: "Please wait while we process your request...",
        duration: 4000,
      });
      await insertWrongReport({
        created_at: new Date().toUTCString(),
        country1: form.getValues("country1"),
        country2: form.getValues("country2"),
        pulse_id: generateCountryPairId(form.getValues("country1") ?? '', form.getValues("country2") ?? ''),
        report_corrected: false,
      });
      setOutput(null);
      toast({
        title: "Reported!",
        description: "Thank you for reporting!",
        duration: 3000,
      });
      document.getElementById("measure-button")?.click();
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error occurred while reporting.",
        description: error?.message ?? "---",
        duration: 2000,
      });
    } finally {
      setIsReporting(false);
    }
  };

  const startTour = async () => {
    const driverObj = driver({
      animate: true,
      showProgress: true,
      steps: [
        { element: '#header', popover: { title: 'Welcome to GeoPulse', description: 'This tour will guide you through the app.' } },
        { element: '#productHuntBadge', popover: { title: 'We are launched ', description: 'You can visit our product hunt page and upvote us.' } },
        { element: '#tour_step_1', popover: { title: `An example won't hurt` , description: 'Lets start with a asian pair.' } },
        {
          element: '#tour_step_2', popover: {
            title: 'Select a country', description: 'Select first country to compare.',
            onNextClick: () => {
              form.setValue("country1", "India");
              driverObj.moveNext();
            },
          }
        },
        {
          element: '#tour_step_3', popover: {
            title: 'Select another country', description: 'Select second country to compare.',
            onNextClick: () => {
              form.setValue("country2", "China");
              driverObj.moveNext();
            },
          }
        },
        {
          element: '#measure-button', popover: {
            title: 'Measure', description: 'Click the "Measure" button to get the score.',
            onNextClick: () => {
              document.getElementById("measure-button")?.click();
              driverObj.moveNext();
            },
          }
        },
        {
          element: '#tour_step_4', popover: {
            title: 'Report will be shown here', description: 'Please wait while we process your request...',
            onNextClick: () => {
              driverObj.moveNext();
              localStorage.setItem("firstTimers", "false");
            },
          }
        },
      ],
      onCloseClick: () => {
        localStorage.setItem("firstTimers", "false");
      }
    });

    driverObj.drive();
  }

  useEffect(() => {
    const firstTimers = localStorage.getItem("firstTimers");
    if (!firstTimers) {
      startTour();
    }
  }, []);

  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-start p-6 transition">
      <div className="max-w-2xl space-y-8 h-full w-full">
        <Header />
        <div id="tour_step_1" className="mt-6 p-4 flex flex-col border-[1px] border-solid border-gray-100 items-center justify-start rounded-md shadow-md bg-gray-50 transition">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              <CountrySelectComponent form={form} />
              <div className="flex flex-col md:flex-row gap-2 items-center justify-center transition">
                <Button
                  size='sm'
                  id="measure-button"
                  type="submit"
                  className="w-[120px] bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Spinner />
                  ) : (
                    "Measure"
                  )}
                </Button>
                <Button
                  size='sm'
                  type="reset"
                  className="w-[120px] bg-blue-400 text-white py-2 rounded-md hover:bg-blue-600 transition"
                  onClick={() => {
                    form.reset();
                    setOutput(null);
                  }}
                >
                  Reset
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <div className="flex flex-col items-center justify-start rounded-sm transition">
          <h2 id="tour_step_4" className="text-xl font-semibold mb-4">Output</h2>
          <Alert className={output ? "mb-4" : "hidden"}>
            <RocketIcon className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription className="flex gap-2 justify-between items-center">
              <p className="text-sm w-[70%]">We noticed few mistake in the data. <span className="font-medium">If it seems wrong to you</span>, Please report those mistakes to us.</p>
              <Button
                size='sm'
                type="button"
                disabled={isReporting}
                className={cn("bg-red-500 text-white py-2 rounded-md hover:bg-red-200 transition")}
                onClick={handleReport}
              >
                {isReporting ? (
                  <Spinner />
                ) : (
                  "Report Wrong Score"
                )}
              </Button>
            </AlertDescription>
          </Alert>
          <OutputArea output={output} />
        </div>
      </div>
      <TsxBadge />
    </main>
  );
}