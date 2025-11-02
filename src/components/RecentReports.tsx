import { fetchRecentReports } from "~/lib/serverApi";
import ReportPreviewCard from "~/components/ReportPreviewCard";

export default async function RecentReports() {
  const recentReports = await fetchRecentReports(4);

  if (!recentReports || recentReports.length === 0) {
    return null;
  }

  return (
    <section className="w-full max-w-4xl mx-auto mt-12 mb-6 px-2 sm:px-4 animation-fade-in">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
        Recent Reports
      </h2>
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
        {recentReports.map((report, index) => (
          <div 
            key={report.id} 
            className="animation-scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <ReportPreviewCard report={report} />
          </div>
        ))}
      </div>
    </section>
  );
}
