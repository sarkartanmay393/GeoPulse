'use client';

import { Button } from "../components/ui/button";
import CountrySelectComponent from "~/components/CountrySelectComponent";
import { useForm } from "react-hook-form";
import { Form } from "~/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouter } from 'next/navigation';
import { findCountryPairById, generateCountryPairId } from "~/lib/utils";
import { useEffect } from "react";
import { useStore } from "~/store/useStore";
import useGetCountries from "~/hooks/useGetCountries";

const FormSchema = z.object({
  country1: z.string().min(1),
  country2: z.string().min(1),
});

export default function CountryInput() {
  const router = useRouter();
  const params = useParams();
  const reportId = (params?.reportId as string ?? '');
  const { output, resetOutput } = useStore();
  const { formattedCountries } = useGetCountries();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { country1: "", country2: "" }
  });

  const handleSubmit = (values: z.infer<typeof FormSchema>) => {
    const reportId = generateCountryPairId(values.country1, values.country2);
    router.push(`/report/${reportId}`);
  }

  useEffect(() => {
    if (reportId) {
      const [country1, country2] = findCountryPairById(reportId, formattedCountries) ?? [];
      form.setValue('country1', country1 ?? "");
      form.setValue('country2', country2 ?? "");
    }
  }, [reportId, formattedCountries, form]);

  return (
    <div className="flex items-center justify-center transition animation-slide-up">
      <div id="tour_step_1" className="w-full max-w-2xl mt-8 p-6 sm:p-8 flex flex-col border border-gray-200 items-center justify-start rounded-2xl shadow-xl bg-gradient-to-br from-white to-gray-50/50 transition hover:shadow-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full space-y-6">
            <CountrySelectComponent form={form} />
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center transition">
              <Button
                size='lg'
                id="measure-button"
                type="submit"
                className="w-full sm:w-auto sm:min-w-[140px] bg-gradient-to-r from-primary to-blue-600 text-white font-medium py-3 rounded-xl hover:from-primary/90 hover:to-blue-600/90 transition-all shadow-md hover:shadow-lg active:scale-95"
                disabled={output !== null}
              >
                ✨ Measure
              </Button>
              <Button
                size='lg'
                id="reset-button"
                type="reset"
                variant="outline"
                className="w-full sm:w-auto sm:min-w-[140px] border-2 font-medium py-3 rounded-xl transition-all hover:bg-gray-100 active:scale-95"
                onClick={() => {
                  form.reset();
                  resetOutput();
                  router.push('/');
                }}
              >
                🔄 Reset
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}