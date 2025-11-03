import CountryInput from "~/components/CountryInput";
import Header from "~/components/Header";
import RecentReports from "~/components/RecentReports";

export default function HomePage() {
  return (
    <main className="min-h-screen w-full py-8 sm:py-12 md:py-16 px-4">
      <div className="container-custom max-w-6xl mx-auto space-y-8 sm:space-y-12">
        <Header />
        <CountryInput />
        <RecentReports />
      </div>
    </main>
  );
}