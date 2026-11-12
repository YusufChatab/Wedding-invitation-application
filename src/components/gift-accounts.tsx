"use client";

import { useState } from "react";
import { wedding } from "@/config/wedding";

// Bank cards with a copy button, so guests can paste the number into their
// banking app.
export function GiftAccounts() {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(number: string) {
    try {
      await navigator.clipboard.writeText(number);
    } catch {
      // Older browsers: fall back to a hidden text field.
      const field = document.createElement("textarea");
      field.value = number;
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    setCopied(number);
    setTimeout(() => setCopied((c) => (c === number ? null : c)), 2000);
  }

  return (
    <div className="flex flex-wrap justify-center gap-5">
      {wedding.gifts.map((g) => (
        <div
          key={g.accountNumber}
          className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-gold/50 bg-gradient-to-br from-maroon-soft via-maroon to-maroon-deep p-6 text-left shadow-2xl shadow-black/30"
        >
          {/* faint gold rings, like a card's watermark */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full border border-gold/20" aria-hidden />
          <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full border border-gold/20" aria-hidden />

          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold tracking-wide text-gold-light">{g.bank}</p>
            {/* chip */}
            <span className="h-7 w-10 rounded-md bg-gradient-to-br from-gold-light to-gold opacity-90" aria-hidden />
          </div>
          <p className="mt-6 font-mono text-2xl tracking-[0.15em] text-cream">{g.accountNumber}</p>
          <p className="mt-1 text-sm uppercase tracking-[0.2em] text-cream/70">a.n. {g.accountName}</p>

          <button
            type="button"
            onClick={() => copy(g.accountNumber)}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-gold px-5 py-2 text-sm text-gold-light transition hover:bg-gold hover:text-maroon-deep active:scale-95"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              {copied === g.accountNumber ? (
                <path d="M5 12l4 4 10-10" />
              ) : (
                <>
                  <rect x="9" y="9" width="11" height="11" rx="2" />
                  <path d="M5 15V5a2 2 0 0 1 2-2h8" />
                </>
              )}
            </svg>
            {copied === g.accountNumber ? "Copied!" : "Copy number"}
          </button>
        </div>
      ))}
    </div>
  );
}
