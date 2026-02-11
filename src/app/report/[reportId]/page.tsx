'use client';

import Header from "~/components/Header";
import ReportArea from "~/components/ReportArea";
import ReportInput from "~/components/ReportInput";

export default function ReportPage({ params }: { params: { reportId: string } }) {
  const reportId = (params?.reportId as string ?? '');

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-start p-4 sm:p-6 lg:p-8 transition">
      <div className="max-w-4xl w-full space-y-6 sm:space-y-8 animation-fade-in">
        <Header />
        <ReportInput />
        <ReportArea reportId={reportId} />
      </div>
    </main>
  );
}