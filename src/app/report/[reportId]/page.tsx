'use client';

import ReportArea from "~/components/ReportArea";

export default function ReportPage({ params }: { params: { reportId: string } }) {
  const reportId = (params?.reportId as string ?? '');

  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-start p-6 transition">
      <div className="max-w-2xl space-y-8 h-full w-full">
        <ReportArea reportId={reportId} />
      </div>
    </main>
  );
}