'use client';

import { useEffect, useState } from 'react';
import ReportPreviewCard from "~/components/ReportPreviewCard";
import type { ITableRow } from "~/lib/types";

export default function CountrySpecificReports() {
  const [reports, setReports] = useState<ITableRow[]>([]);
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch user's country from geoip
        const geoResponse = await fetch('/api/geoip');
        if (!geoResponse.ok) {
          setLoading(false);
          return;
        }

        const geoData = await geoResponse.json();
        const countryCode = geoData.country;
        
        if (!countryCode) {
          setLoading(false);
          return;
        }

        setUserCountry(countryCode);

        // Fetch country-specific reports
        const reportsResponse = await fetch(`/api/country-reports?countryCode=${countryCode}`);
        if (!reportsResponse.ok) {
          setLoading(false);
          return;
        }

        const reportsData = await reportsResponse.json();
        setReports(reportsData.reports || []);
      } catch (error) {
        console.error('Error fetching country-specific reports:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Don't render if no reports or still loading
  if (loading) {
    return (
      <section className="w-full max-w-2xl mx-auto mt-12 mb-6 px-4">
        <h2 className="text-2xl font-semibold mb-6 text-center">Loading your country reports...</h2>
      </section>
    );
  }

  if (!reports || reports.length === 0) {
    return null;
  }

  return (
    <section className="w-full max-w-2xl mx-auto mt-12 mb-6 px-4">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Reports for Your Country {userCountry ? `(${userCountry})` : ''}
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        {reports.map((report) => (
          <ReportPreviewCard key={report.id} report={report} />
        ))}
      </div>
    </section>
  );
}
