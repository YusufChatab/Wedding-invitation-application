"use client";

import { Divider } from "@/components/ornaments";

export default function InvitationError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center bg-maroon-deep px-6 text-center text-cream">
      <h1 className="font-script text-5xl text-gold sm:text-6xl">Please try again</h1>
      <Divider className="my-6" />
      <p className="max-w-sm text-cream/75">We couldn&apos;t load the invitation just now. Please check your connection and try again.</p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-8 rounded-full bg-gold px-7 py-3 font-semibold text-maroon-deep transition hover:bg-gold-light"
      >
        Reload
      </button>
    </main>
  );
}
