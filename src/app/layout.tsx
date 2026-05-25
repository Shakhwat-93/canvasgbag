import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AnalyticsScripts } from "@/lib/analytics";
import { categories } from "@/lib/data";
import { AppProviders } from "@/components/providers/app-providers";
import { StoreLayoutWrapper } from "@/components/store/store-layout-wrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  metadataBase: new URL("https://canvasbag.vercel.app"),
  title: {
    default: "CanvasBag | Premium Canvas Bags in Bangladesh",
    template: "%s",
  },
  description:
    "Premium canvas gym, travel, and daily carry bags for Bangladesh with cash-on-delivery checkout and fast dispatch.",
  openGraph: {
    title: "CanvasBag",
    description: "Premium canvas bags built for active movement in Bangladesh.",
    type: "website",
    locale: "en_BD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AnalyticsScripts />
        <AppProviders>
          <StoreLayoutWrapper categories={categories}>
            {children}
          </StoreLayoutWrapper>
        </AppProviders>
      </body>
    </html>
  );
}
