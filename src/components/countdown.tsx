"use client";

import { useSyncExternalStore } from "react";

// A once-per-second clock. The server snapshot is null so server and client
// render the same placeholder markup before hydration.
function subscribe(onTick: () => void) {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
}
const nowInSeconds = () => Math.floor(Date.now() / 1000);
const serverSnapshot = () => null;

export function Countdown({ date }: { date: string }) {
  const now = useSyncExternalStore(subscribe, nowInSeconds, serverSnapshot);
  const diff = now === null ? null : Math.max(0, Math.floor(new Date(date).getTime() / 1000) - now);
  const left =
    diff === null
      ? null
      : {
          Days: Math.floor(diff / 86_400),
          Hours: Math.floor(diff / 3_600) % 24,
          Minutes: Math.floor(diff / 60) % 60,
          Seconds: diff % 60,
        };

  return (
    <div className="grid grid-cols-4 gap-3">
      {(["Days", "Hours", "Minutes", "Seconds"] as const).map((unit) => (
        <div key={unit} className="rounded-xl border border-gold/40 bg-emerald/70 py-3 text-center">
          <div className="text-3xl font-semibold tabular-nums text-gold-light">
            {left ? String(left[unit]).padStart(2, "0") : "--"}
          </div>
          <div className="text-xs uppercase tracking-widest text-cream/70">{unit}</div>
        </div>
      ))}
    </div>
  );
}
