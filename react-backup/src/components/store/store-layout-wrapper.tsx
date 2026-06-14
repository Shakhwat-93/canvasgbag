import React from "react";
import { useLocation } from "react-router-dom";
import { AnnouncementBar } from "@/components/store/announcement-bar";
import { Header } from "@/components/store/header";
import { Footer } from "@/components/store/footer";
import { FloatingCallButton } from "@/components/store/floating-call-button";

export function StoreLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <div className="flex-1 min-h-screen bg-[#0B0D0F]">{children}</div>;
  }

  return (
    <>
      {/* Fixed top shell: announcement + floating navbar */}
      <div className="fixed inset-x-0 top-0 z-50 flex flex-col">
        <AnnouncementBar />
        <Header />
      </div>
      {/* Page content pushed below the fixed shell (announcement ~38px + navbar ~72px) */}
      <div className="flex-1 pt-[110px]">{children}</div>
      <Footer />
      <FloatingCallButton />
    </>
  );
}
