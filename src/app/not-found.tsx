import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto grid min-h-[60vh] max-w-xl place-items-center px-4 py-16 text-center">
      <div>
        <p className="text-sm font-medium uppercase text-muted-foreground">404</p>
        <h1 className="mt-2 text-4xl font-semibold">This bag is not on the shelf.</h1>
        <p className="mt-4 text-muted-foreground">
          The page may have moved, or the product is no longer available.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Back to store</Link>
        </Button>
      </div>
    </main>
  );
}
