import { Suspense } from "react";
import { connection } from "next/server";
import { listWishes } from "@/lib/data";
import { InvitationShell } from "@/components/invitation-shell";
import {
  Closing,
  Couple,
  couple,
  Events,
  Hero,
  SaveTheDate,
  Section,
  Verse,
  WishList,
} from "@/components/invitation-sections";

// The general invitation, for anyone opening the site without a personal link.
// Guests can read everything and see the wishes; RSVP needs their own link.
// The page itself is static; only the live wishes list streams in per request.

async function LiveWishes() {
  await connection();
  return <WishList wishes={await listWishes()} />;
}

function PersonalLinkNote({ dark = false }: { dark?: boolean }) {
  return (
    <p
      className={`rounded-2xl border px-5 py-4 text-lg leading-relaxed ${dark ? "border-gold/40 bg-emerald/60 text-cream/85" : "border-emerald/15 bg-white/70 text-ink/80"}`}
    >
      Please open the <strong className={dark ? "text-gold-light" : "text-emerald"}>personal invitation link</strong> you
      received from the family to confirm your attendance and send your wishes.
    </p>
  );
}

export default function Home() {
  return (
    <InvitationShell guestName="Honoured Guest" coupleNames={couple}>
      <main className="overflow-x-hidden bg-cream">
        <Hero />
        <Verse />
        <Couple />
        <Events />
        <SaveTheDate />

        <Section id="rsvp" dark title="RSVP" subtitle="Kindly let us know if you can join us">
          <PersonalLinkNote dark />
        </Section>

        <Section id="wishes" title="Du'a & Wishes" subtitle="Prayers and best wishes for the couple">
          <PersonalLinkNote />
          <Suspense fallback={<p className="mt-8 text-ink/50">Loading wishes…</p>}>
            <LiveWishes />
          </Suspense>
        </Section>

        <Closing />
      </main>
    </InvitationShell>
  );
}
