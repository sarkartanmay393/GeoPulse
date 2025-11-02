import CountryInput from "~/components/CountryInput";
import Header from "~/components/Header";
import RecentReports from "~/components/RecentReports";

export default function HomePage() {
  return (
    <main className="h- screen py-12">
      {/* <ProductHuntBadge className="mb-4" /> */}
      <Header />
      <CountryInput />
      <RecentReports />
    </main>
  );
}