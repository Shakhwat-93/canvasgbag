import Link from "next/link";
import { BadgeCheck, PackageCheck, ShieldCheck } from "lucide-react";

const trustItems = [
  { icon: ShieldCheck, label: "COD available across Bangladesh" },
  { icon: PackageCheck, label: "2-4 day dispatch from Dhaka" },
  { icon: BadgeCheck, label: "7-day easy exchange support" },
];

export function Footer() {
  return (
    <footer id="footer" className="border-t bg-muted/30">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="text-lg font-semibold">
            CanvasBag
          </Link>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Premium canvas bags built for everyday movement in Bangladesh: clean design, dependable carry,
            and a frictionless COD shopping experience.
          </p>
        </div>
        <div className="grid gap-3">
          {trustItems.map((item) => (
            <div key={item.label} className="flex items-center gap-3 text-sm">
              <item.icon className="h-4 w-4 text-primary" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
