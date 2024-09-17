'use client';

import { Button } from "../components/ui/button";
import CountrySelectComponent from "~/components/CountrySelectComponent";
import { useForm } from "react-hook-form";
import { Form } from "~/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouter } from 'next/navigation';
import { findCountryPairById, generateCountryPairId } from "~/lib/utils";
import useGetCountries from "~/hooks/useGetCountries";
import { useCallback } from "react";
import Image from "next/image";
import { toast } from "./ui/use-toast";

const FormSchema = z.object({
  country1: z.string().min(1),
  country2: z.string().min(1),
});

export default function CountryInput() {
  const { formattedCountries } = useGetCountries();
  const router = useRouter();
  const params = useParams();
  const reportId = (params?.reportId as string ?? '');
  const countries = findCountryPairById(reportId, formattedCountries.map((c) => c.value));

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { country1: countries?.[0] ?? "", country2: countries?.[1] ?? '' }
  });

  const handleSubmit = useCallback(async (values: z.infer<typeof FormSchema>) => {
    if (reportId.length > 0) {
      navigator.clipboard.writeText(`https://geo-pulse.vercel.app/report/${reportId}`);
      toast({
        title: "Copied to clipboard!",
        description: "Please paste the link in your browser.",
        duration: 2000,
      });
    } else {
      const reportId = generateCountryPairId(values.country1, values.country2);
      router.push(`/report/${reportId}`);
    }
  }, [reportId]);

  return (
    <div className="flex items-center justify-center transition">
      <div id="tour_step_1" className="w-fit mt-6 p-4 flex flex-col border-[1px] border-solid border-gray-100 items-center justify-start rounded-md shadow-md bg-gray-50 transition">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <CountrySelectComponent form={form} />
            <div className="flex flex-col md:flex-row gap-2 items-center justify-center transition">
              <Button
                size='sm'
                id="measure-button"
                type="submit"
                className="w-full sm:w-[120px] bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                // disabled={reportId.length > 0}
              >
                {reportId.length > 0 ?
                  <>
                    <Image src="/share.svg" alt="Share" width={10} height={10} className="mr-1" />
                    <p>Share</p>
                  </>
                  : "Measure"}
              </Button>
              <Button
                size='sm'
                id="reset-button"
                type="reset"
                className="w-full sm:w-[120px] bg-blue-400 text-white py-2 rounded-md hover:bg-blue-600 transition"
                onClick={() => {
                  form.reset();
                  router.push('/');
                }}
              >
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}