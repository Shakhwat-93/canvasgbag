"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto grid min-h-[60vh] max-w-xl place-items-center px-4 py-16 text-center">
      <div>
        <p className="text-sm font-medium uppercase text-muted-foreground">Something went wrong</p>
        <h1 className="mt-2 text-4xl font-semibold">The store hit a snag.</h1>
        <p className="mt-4 text-muted-foreground">Refresh this section and try again.</p>
        <Button className="mt-6" onClick={reset}>
          Try again
        </Button>
      </div>
    </main>
  );
}
