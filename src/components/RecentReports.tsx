import { fetchRecentReports } from "~/lib/serverApi";
import ReportPreviewCard from "~/components/ReportPreviewCard";

export default async function RecentReports() {
  const recentReports = await fetchRecentReports(5);

  if (!recentReports || recentReports.length === 0) {
    return null;
  }

  return (
    <section className="w-full max-w-2xl mx-auto mt-12 mb-6 px-4">
      <h2 className="text-2xl font-semibold mb-6 text-center">Recent Reports</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {recentReports.map((report) => (
          <ReportPreviewCard key={report.id} report={report} />
        ))}
      </div>
    </section>
  );
}
