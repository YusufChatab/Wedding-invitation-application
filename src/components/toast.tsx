"use client";

import { createPortal } from "react-dom";

// A message that slides down from the top, then fades away on its own.
// Give it a new `key` for each message so the animation replays.
// Portalled to <body> because the animated sections around the forms keep a
// transform, which would otherwise pin a fixed element inside that section.
export function Toast({ ok, message }: { ok: boolean; message: string }) {
  if (typeof document === "undefined" || !document.body) return null;
  return createPortal(
    <div
      role="status"
      className={`toast fixed left-1/2 top-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm items-center gap-3 rounded-2xl border px-4 py-3 text-left shadow-2xl shadow-black/30 ${
        ok ? "border-gold/60 bg-maroon-deep text-cream" : "border-red-300/60 bg-red-950 text-red-50"
      }`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${ok ? "bg-gold text-maroon-deep" : "bg-red-300 text-red-950"}`}
        aria-hidden
      >
        {ok ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12l4 4 10-10" />
          </svg>
        ) : (
          <span className="text-lg font-bold">!</span>
        )}
      </span>
      <p className="text-sm leading-snug">{message}</p>
    </div>,
    document.body,
  );
}
