import { useStore } from "@/components/providers/store-provider";

export function AnnouncementBar() {
  const { settings } = useStore();
  
  return (
    <div
      className="px-4 py-2.5 text-center text-xs font-bold uppercase tracking-[0.18em] bg-primary text-primary-foreground transition-colors duration-300"
    >
      {settings.announcementText}
    </div>
  );
}
