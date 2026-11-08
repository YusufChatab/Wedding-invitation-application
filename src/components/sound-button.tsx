"use client";

// Floating mute/unmute control, sitting above the bottom navigation bar.
export function SoundButton({ muted, onToggle }: { muted: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={muted ? "Turn sound on" : "Mute sound"}
      aria-pressed={!muted}
      className="pop-in fixed bottom-24 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-gold/60 bg-emerald-deep/85 text-gold-light shadow-xl shadow-black/30 backdrop-blur-md transition [animation-delay:1.1s] hover:scale-105 hover:text-gold active:scale-95 sm:right-6"
    >
      {!muted && <span className="absolute inset-0 animate-ping rounded-full border border-gold/40 [animation-duration:2.5s]" aria-hidden />}
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor" fillOpacity="0.25" />
        {muted ? (
          <path d="M16 9l5 6M21 9l-5 6" />
        ) : (
          <>
            <path d="M16 9.5a3.5 3.5 0 0 1 0 5" />
            <path d="M18.5 7a7 7 0 0 1 0 10" />
          </>
        )}
      </svg>
    </button>
  );
}
