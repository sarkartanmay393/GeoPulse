import CountryInput from "~/components/CountryInput";
import Header from "~/components/Header";
import ProductHuntBadge from "~/components/ProducthuntBadge";
import RecentReports from "~/components/RecentReports";

export default function HomePage() {
  return (
    <main className="h- screen">
      {/* <ProductHuntBadge className="mb-4" /> */}
      <Header />
      <CountryInput />
      <RecentReports />
    </main>
  );
}