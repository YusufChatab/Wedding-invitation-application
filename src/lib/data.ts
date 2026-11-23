import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { EventAccess } from "@/config/wedding";
import { dummyGuests, TEST_GUESTS } from "./dummy-guests";

export type Invitation = {
  name: string;
  // How many people the invitation is for (the "pax" column): 1, or more for couples and families.
  maxGuests: number;
  events: EventAccess;
  attending: boolean | null;
  // How many said they're coming (0 when not attending).
  guestCount: number;
  // A shared family link (Keluarga Besar): no RSVP, visitors sign wishes with their own name.
  isOpen: boolean;
  // False for family guests marked "NA" in the Excel: just attending or not, no number of guests.
  askCount: boolean;
};

export type Wish = {
  id: string;
  name: string;
  message: string;
  attending: boolean | null;
  createdAt: string;
};

export type RsvpInput = {
  attending: boolean;
  guests: number;
};

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;

export const isDemoMode = !url || !anonKey;

// Demo data is for local previews only. On the live site, missing Supabase
// settings must fail loudly instead of "saving" RSVPs into throwaway memory.
function demoEnabled() {
  if (isDemoMode && process.env.NODE_ENV === "production") {
    throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY are not set on the server.");
  }
  return isDemoMode;
}

let client: SupabaseClient | null = null;
function db() {
  if (!client) {
    client = createClient(url!, anonKey!, { auth: { persistSession: false } });
  }
  return client;
}

export async function getInvitation(slug: string): Promise<Invitation | null> {
  if (demoEnabled()) return demo.getInvitation(slug);
  const { data, error } = await db().rpc("get_invitation", { p_slug: slug });
  if (error) throw error;
  const row = data?.[0];
  if (!row) return null;
  return {
    name: row.name,
    maxGuests: Math.max(1, row.max_guests ?? 1),
    events: toAccess(row.events),
    attending: row.attending,
    guestCount: row.guest_count ?? 0,
    isOpen: row.is_open === true,
    askCount: row.ask_count !== false,
  };
}

// Anything unexpected in the events column: treat as both.
function toAccess(v: unknown): EventAccess {
  return v === "akad" || v === "reception" ? v : "both";
}

export async function submitRsvp(slug: string, input: RsvpInput): Promise<void> {
  if (demoEnabled()) return demo.submitRsvp(slug, input);
  const { error } = await db().rpc("submit_rsvp_guests", {
    p_slug: slug,
    p_attending: input.attending,
    p_guests: input.guests,
  });
  if (error) throw error;
}

export async function addWish(slug: string, message: string): Promise<void> {
  if (demoEnabled()) return demo.addWish(slug, message);
  const { error } = await db().rpc("add_wish", { p_slug: slug, p_message: message });
  if (error) throw error;
}

export async function addOpenWish(slug: string, name: string, message: string): Promise<void> {
  if (demoEnabled()) return demo.addOpenWish(slug, name, message);
  const { error } = await db().rpc("add_open_wish", { p_slug: slug, p_name: name, p_message: message });
  if (error) throw error;
}

export async function listWishes(): Promise<Wish[]> {
  if (demoEnabled()) return demo.listWishes();
  const { data, error } = await db().rpc("list_wishes", { p_limit: 200 });
  if (error) throw error;
  return (data ?? []).map((w: Record<string, unknown>) => ({
    id: w.id as string,
    name: w.name as string,
    message: w.message as string,
    attending: w.attending as boolean | null,
    createdAt: w.created_at as string,
  }));
}

// ---------------------------------------------------------------------------
// Demo mode: an in-memory stand-in used when Supabase env vars are not set,
// so the site can be previewed locally. Data resets on server restart.
// ---------------------------------------------------------------------------

type DemoGuest = {
  name: string;
  maxGuests: number;
  events: EventAccess;
  isOpen?: boolean;
  askCount?: boolean;
  rsvp?: RsvpInput;
};

const sampleWishes = [
  "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fii khair. Congratulations!",
  "Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Aamiin ya Rabbal 'alamin.",
  "Congratulations to you both! May Allah fill your home with love and barakah.",
  "Selamat menempuh hidup baru, semoga Allah mudahkan sampai hari H.",
  "MasyaAllah, so happy for you! Sorry we can't make it, our du'a is with you.",
  "Semoga langgeng sampai jannah. Barakallah!",
];

const demo = (() => {
  // The first 30 dummy guests (except the test links at the top) have already replied.
  const guests = new Map<string, DemoGuest>(
    dummyGuests(100).map((g, i) => [
      g.slug,
      {
        name: g.name,
        maxGuests: g.maxGuests,
        events: g.events,
        rsvp:
          i >= TEST_GUESTS && i < TEST_GUESTS + 30
            ? { attending: i % 4 !== 0, guests: i % 4 !== 0 ? 1 + (i % g.maxGuests) : 0 }
            : undefined,
      },
    ]),
  );
  guests.set("keluarga-besar-chatab", { name: "Keluarga Besar Chatab", maxGuests: 1, events: "reception", isOpen: true });
  guests.set("keluarga-besar-umi-syamsyiah", {
    name: "Keluarga Besar Umi Syamsyiah",
    maxGuests: 1,
    events: "reception",
    isOpen: true,
  });
  guests.set("test-family-na", { name: "Test Family NA", maxGuests: 1, events: "reception", askCount: false });
  const wishes: Wish[] = [...guests.values()].slice(1, 1 + sampleWishes.length).map((g, i) => ({
    id: `w${i}`,
    name: g.name,
    message: sampleWishes[i],
    attending: g.rsvp?.attending ?? null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * (5 + i * 13)).toISOString(),
  }));

  return {
    async getInvitation(slug: string): Promise<Invitation | null> {
      const g = guests.get(slug);
      if (!g) return null;
      return {
        name: g.name,
        maxGuests: g.maxGuests,
        events: g.events,
        attending: g.rsvp?.attending ?? null,
        guestCount: g.rsvp?.guests ?? 0,
        isOpen: g.isOpen === true,
        askCount: g.askCount !== false,
      };
    },
    async submitRsvp(slug: string, input: RsvpInput) {
      const g = guests.get(slug);
      if (!g) throw new Error("invitation not found");
      const count = input.attending ? Math.min(Math.max(1, input.guests), g.maxGuests) : 0;
      g.rsvp = { attending: input.attending, guests: count };
      for (const w of wishes) if (w.name === g.name) w.attending = input.attending;
    },
    async addWish(slug: string, message: string) {
      const g = guests.get(slug);
      if (!g) throw new Error("invitation not found");
      wishes.unshift({
        id: crypto.randomUUID(),
        name: g.name,
        message,
        attending: g.rsvp?.attending ?? null,
        createdAt: new Date().toISOString(),
      });
    },
    async addOpenWish(slug: string, name: string, message: string) {
      if (!guests.get(slug)?.isOpen) throw new Error("invitation not found");
      wishes.unshift({ id: crypto.randomUUID(), name, message, attending: null, createdAt: new Date().toISOString() });
    },
    async listWishes() {
      return [...wishes];
    },
  };
})();
