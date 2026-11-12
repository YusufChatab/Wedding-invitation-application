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
import { rsvpAction, wishAction } from "./actions";

// Every link is personal and shows live RSVPs/wishes, so render on each request.
export const instant = false;

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const inv = await getInvitation(slug);
  return {
    title: inv ? `${inv.name} — The Wedding of ${couple}` : `The Wedding of ${couple}`,
  };
}

export default async function InvitationPage({ params }: PageProps<"/[slug]">) {
  await connection();
  const { slug } = await params;
  const [invitation, wishes] = await Promise.all([getInvitation(slug), listWishes()]);
  if (!invitation) notFound();

  return (
    <InvitationShell guestName={invitation.name} coupleNames={couple}>
      <main className="overflow-x-hidden bg-cream">
        <Hero />
        <Verse />
        <Couple />
        <Events />
        <SaveTheDate />

        <Section id="rsvp" dark title="RSVP" subtitle="Kindly let us know if you can join us">
          <RsvpForm
            action={rsvpAction.bind(null, slug)}
            guestName={invitation.name}
            plusOneAllowed={invitation.plusOneAllowed}
            current={{
              attending: invitation.attending,
              bringingPlusOne: invitation.bringingPlusOne,
              plusOneName: invitation.plusOneName,
            }}
          />
        </Section>

        <Gift />

        <Section id="wishes" title="Du'a & Wishes" subtitle="Send your prayers and best wishes to the couple">
          <WishForm action={wishAction.bind(null, slug)} guestName={invitation.name} />
          <WishList wishes={wishes} />
        </Section>

        <Closing />
      </main>
    </InvitationShell>
  );
}
