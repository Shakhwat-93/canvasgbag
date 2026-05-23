import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { AnalyticsScripts } from "@/lib/analytics";
import { categories } from "@/lib/data";
import { AppProviders } from "@/components/providers/app-providers";
import { AnnouncementBar } from "@/components/store/announcement-bar";
import { Header } from "@/components/store/header";
import { Footer } from "@/components/store/footer";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
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
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AnalyticsScripts />
        <AppProviders>
          {/* Fixed top shell: announcement + floating navbar */}
          <div className="fixed inset-x-0 top-0 z-50 flex flex-col">
            <AnnouncementBar />
            <Header categories={categories} />
          </div>
          {/* Page content pushed below the fixed shell (announcement ~38px + navbar ~72px) */}
          <div className="flex-1 pt-[110px]">{children}</div>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
