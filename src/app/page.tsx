import CountryInput from "~/components/CountryInput";
import Header from "~/components/Header";
import ProductHuntBadge from "~/components/ProducthuntBadge";

export default function HomePage() {
  return (
    <main className="h- screen">
      {/* <ProductHuntBadge className="mb-4" /> */}
      <Header />
      <CountryInput />
    </main>
  );
}