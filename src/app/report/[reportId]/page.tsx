'use client';

import Header from "~/components/Header";
import ReportArea from "~/components/ReportArea";
import ReportInput from "~/components/ReportInput";

export default function ReportPage({ params }: { params: { reportId: string } }) {
  const reportId = (params?.reportId as string ?? '');

  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-start p-6 transition">
      <div className="max-w-2xl space-y-4 h-full w-full">
        <Header />
        <ReportInput />
        <ReportArea reportId={reportId} />
      </div>
    </main>
  );
}