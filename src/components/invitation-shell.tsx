"use client";

import { useEffect, useRef, useState } from "react";
import { wedding } from "@/config/wedding";
import { startAudioFile, startNatureAmbience, type Ambience } from "@/lib/nature-sound";
import { BottomNav } from "./bottom-nav";
import { Lantern, Mosque, Stars } from "./ornaments";
import { SoundButton } from "./sound-button";

const MUTE_KEY = "invitation-muted";

function readMuted() {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

function saveMuted(muted: boolean) {
  try {
    localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
  } catch {
    // Private mode or blocked storage: just don't remember.
  }
}

type Stage = "closed" | "opening" | "open";

// Shows the "Dear <guest>" cover first. Opening slides it up like a curtain,
// revealing the invitation underneath.
export function InvitationShell({
  guestName,
  coupleNames,
  children,
}: {
  guestName: string;
  coupleNames: string;
  children: React.ReactNode;
}) {
  const [stage, setStage] = useState<Stage>("closed");
  const [muted, setMuted] = useState(false);
  const [hasSound, setHasSound] = useState(false);
  const sound = useRef<Ambience | null>(null);

  // Pause the sound while the guest is in another tab or app.
  useEffect(() => {
    const onVisibility = () => (document.hidden ? sound.current?.pause() : sound.current?.resume());
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      sound.current?.dispose();
      sound.current = null;
    };
  }, []);

  // Lock scrolling behind the cover. Mobile Safari ignores overflow on <body>
  // alone, so lock <html> as well.
  useEffect(() => {
    const value = stage === "closed" ? "hidden" : "";
    document.documentElement.style.overflow = value;
    document.body.style.overflow = value;
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [stage]);

  // Animate sections in as they scroll into view.
  useEffect(() => {
    if (stage === "closed") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [stage]);

  function open() {
    window.scrollTo({ top: 0 });
    setStage("opening");
    setTimeout(() => setStage("open"), 1100);

    // Sound has to start inside the tap, or phones will block it.
    const startMuted = readMuted();
    setMuted(startMuted);
    sound.current?.dispose();
    sound.current = wedding.backgroundMusic
      ? startAudioFile(wedding.backgroundMusic, startMuted)
      : startNatureAmbience(startMuted);
    setHasSound(sound.current !== null);
  }

  function toggleSound() {
    const next = !muted;
    setMuted(next);
    saveMuted(next);
    sound.current?.setMuted(next);
  }

  return (
    <>
      {stage !== "open" && (
        <div
          // 100lvh: still fills the screen when the phone's address bar hides.
          className={`cover islamic-pattern fixed inset-x-0 top-0 z-50 flex h-[100lvh] flex-col items-center justify-center overflow-hidden bg-emerald-deep px-6 pb-32 text-center text-cream shadow-2xl shadow-black/60 ${stage === "opening" ? "is-leaving" : ""}`}
        >
          <Stars />
          <Lantern className="sway absolute left-6 top-0 h-28 w-10 text-gold sm:left-16 sm:h-36 sm:w-14" />
          <Lantern className="sway absolute right-6 top-0 h-20 w-8 text-gold [animation-delay:-2s] sm:right-16 sm:h-28 sm:w-11" />

          <div className="relative z-10 flex flex-col items-center">
            <p className="pop-in font-arabic text-2xl text-gold-light sm:text-3xl">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
            <p className="pop-in mt-6 text-sm uppercase tracking-[0.35em] text-gold-light/80 [animation-delay:0.2s]">
              The Wedding of
            </p>
            <h1 className="pop-in mt-2 font-script text-6xl text-gold [animation-delay:0.35s] sm:text-8xl">{coupleNames}</h1>

            <div className="pop-in mt-10 rounded-2xl border border-gold/40 bg-emerald/60 px-8 py-5 backdrop-blur [animation-delay:0.55s]">
              <p className="text-sm tracking-wide text-gold-light/80">Dear</p>
              <p className="mt-1 text-2xl font-semibold sm:text-3xl">{guestName}</p>
              <p className="mt-2 text-xs italic text-cream/60">We apologise for any misspelling of names or titles</p>
            </div>

            <button
              type="button"
              onClick={open}
              disabled={stage !== "closed"}
              className="pop-in mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-base font-semibold text-emerald-deep shadow-lg shadow-black/30 transition [animation-delay:0.75s] hover:scale-105 hover:bg-gold-light active:scale-95"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M4 6h16v12H4z" />
                <path d="M4 7l8 6 8-6" />
              </svg>
              Open Invitation
            </button>
          </div>

          <Mosque className="pointer-events-none absolute bottom-0 left-1/2 w-[520px] max-w-[130%] -translate-x-1/2 text-emerald-soft sm:w-[720px]" />
        </div>
      )}
      {children}
      {stage !== "closed" && <BottomNav />}
      {stage !== "closed" && hasSound && <SoundButton muted={muted} onToggle={toggleSound} />}
    </>
  );
}
