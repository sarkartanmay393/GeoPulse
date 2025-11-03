'use client';

import Header from "~/components/Header";
import ComparisonInput from "~/components/ComparisonInput";
import ComparisonResults from "~/components/ComparisonResults";

export default function ComparePage() {
  return (
    <main className="min-h-screen py-12">
      <Header />
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Country Comparison</h1>
        <ComparisonInput />
        <ComparisonResults />
      </div>
    </main>
  );
}
