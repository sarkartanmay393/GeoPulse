import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Toaster } from "~/components/ui/toaster";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import TsxBadge from "~/components/TsxBadge";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "GeoPulse",
  description: "Analyze and compare geopolitical relations between countries using the latest data.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning>
      <body className="relative scrollbar-thin scroll-smooth flex min-h-screen flex-col items-center justify-center" suppressHydrationWarning>
        <Suspense fallback={<div className="flex items-center justify-center">Loading...</div>}>
          {children}
        </Suspense>
        <TsxBadge />
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
