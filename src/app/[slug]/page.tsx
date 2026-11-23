import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getInvitation, listWishes } from "@/lib/data";
import { InvitationShell } from "@/components/invitation-shell";
import { RsvpForm } from "@/components/rsvp-form";
import { WishForm } from "@/components/wish-form";
import {
  Closing,
  Couple,
  couple,
  Events,
  Gift,
  Hero,
  SaveTheDate,
  Section,
  Verse,
  WishList,
} from "@/components/invitation-sections";
import { eventsLabel, wedding } from "@/config/wedding";
import { rsvpAction, wishAction } from "./actions";

// Every link is personal and shows live RSVPs/wishes, so render on each request.
export const instant = false;

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const inv = await getInvitation(slug);
  const title = inv ? `${inv.name} — The Wedding of ${couple}` : `The Wedding of ${couple}`;
  // Link previews read og:title rather than <title>. A page's openGraph replaces
  // the layout's as a whole, so repeat the shared fields too.
  const description = `${wedding.dateLabel} · You are invited to celebrate with us.`;
  // The picture from app/opengraph-image.tsx, which isn't carried over once the
  // page sets its own openGraph.
  const images = [{ url: "/opengraph-image", width: 1200, height: 630, alt: `The Wedding of ${couple}` }];
  return {
    title,
    openGraph: { type: "website", siteName: `The Wedding of ${couple}`, title, description, locale: "id_ID", images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export default async function InvitationPage({ params }: PageProps<"/[slug]">) {
  await connection();
  const { slug } = await params;
  const [invitation, wishes] = await Promise.all([getInvitation(slug), listWishes()]);
  if (!invitation) notFound();

  return (
    <InvitationShell
      guestName={invitation.name}
      coupleNames={couple}
      note={`Invited to the ${eventsLabel(invitation.events)}`}
      noRsvp={invitation.isOpen}
    >
      <main className="overflow-x-hidden bg-cream">
        <Hero />
        <Verse />
        <Couple />
        <Events access={invitation.events} />
        <SaveTheDate access={invitation.events} />

        {/* Shared family links have no RSVP. */}
        {!invitation.isOpen && (
          <Section id="rsvp" dark title="RSVP" subtitle="Kindly let us know if you can join us">
            <RsvpForm
              action={rsvpAction.bind(null, slug)}
              guestName={invitation.name}
              eventsLabel={eventsLabel(invitation.events)}
              maxGuests={invitation.maxGuests}
              askCount={invitation.askCount}
              current={{ attending: invitation.attending, guestCount: invitation.guestCount }}
            />
          </Section>
        )}

        <Gift />

        <Section id="wishes" title="Du'a & Wishes" subtitle="Send your prayers and best wishes to the couple">
          <WishForm action={wishAction.bind(null, slug)} guestName={invitation.name} askName={invitation.isOpen} />
          <WishList wishes={wishes} />
        </Section>

        <Closing />
      </main>
    </InvitationShell>
  );
}
