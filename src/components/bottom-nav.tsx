"use client";

import { useEffect, useState } from "react";

const items = [
  { id: "home", label: "Home", icon: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" },
  { id: "couple", label: "Couple", icon: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" },
  { id: "event", label: "Event", icon: "M4 6h16v14H4zM4 10h16M9 3v4M15 3v4" },
  { id: "rsvp", label: "RSVP", icon: "M5 12l4 4 10-10" },
  { id: "wishes", label: "Wishes", icon: "M4 5h16v11H8l-4 4z" },
];

// Floating section switcher, mainly for phones.
export function BottomNav() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const { id } of items) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  return (
    <nav
      aria-label="Sections"
      className="pop-in fixed inset-x-0 bottom-3 z-40 mx-auto flex w-[calc(100%-1.5rem)] max-w-md justify-around rounded-full border border-gold/40 bg-emerald-deep/85 px-2 py-1.5 shadow-xl shadow-black/30 backdrop-blur-md [animation-delay:0.9s]"
    >
      {items.map((item) => {
        const isActive = active === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
            }}
            aria-current={isActive ? "true" : undefined}
            className={`flex flex-1 flex-col items-center gap-0.5 rounded-full py-1.5 text-[11px] transition ${isActive ? "bg-gold text-emerald-deep" : "text-cream/75 hover:text-gold-light"}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d={item.icon} />
            </svg>
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
