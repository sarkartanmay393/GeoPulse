import CountryInput from "~/components/CountryInput";
import Header from "~/components/Header";
import RecentReports from "~/components/RecentReports";
import CountrySpecificReports from "~/components/CountrySpecificReports";

export default function HomePage() {
  return (
    <main className="h- screen py-12">
      {/* <ProductHuntBadge className="mb-4" /> */}
      <Header />
      <CountryInput />
      <CountrySpecificReports />
      <RecentReports />
    </main>
  );
}