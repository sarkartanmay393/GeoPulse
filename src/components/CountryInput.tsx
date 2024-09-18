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

const FormSchema = z.object({
  country1: z.string().min(1),
  country2: z.string().min(1),
});

export default function CountryInput() {
  const router = useRouter();
  const params = useParams();
  const reportId = (params?.reportId as string ?? '');
  const { output, resetOutput } = useStore();

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
      const [country1, country2] = findCountryPairById(reportId) ?? [];
      form.setValue('country1', country1 ?? "");
      form.setValue('country2', country2 ?? "");
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
                disabled={output !== null}
              >
                Measure
              </Button>
              <Button
                size='sm'
                id="reset-button"
                type="reset"
                className="w-full sm:w-[120px] bg-blue-400 text-white py-2 rounded-md hover:bg-blue-600 transition"
                onClick={() => {
                  form.reset();
                  resetOutput();
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