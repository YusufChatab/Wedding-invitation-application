import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { dummyGuests } from "./dummy-guests";

export type Invitation = {
  name: string;
  plusOneAllowed: boolean;
  attending: boolean | null;
  bringingPlusOne: boolean;
  plusOneName: string | null;
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
  bringingPlusOne: boolean;
  plusOneName: string;
};

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;

export const isDemoMode = !url || !anonKey;

let client: SupabaseClient | null = null;
function db() {
  if (!client) {
    client = createClient(url!, anonKey!, { auth: { persistSession: false } });
  }
  return client;
}

export async function getInvitation(slug: string): Promise<Invitation | null> {
  if (isDemoMode) return demo.getInvitation(slug);
  const { data, error } = await db().rpc("get_invitation", { p_slug: slug });
  if (error) throw error;
  const row = data?.[0];
  if (!row) return null;
  return {
    name: row.name,
    plusOneAllowed: row.plus_one_allowed,
    attending: row.attending,
    bringingPlusOne: row.bringing_plus_one ?? false,
    plusOneName: row.plus_one_name,
  };
}

export async function submitRsvp(slug: string, input: RsvpInput): Promise<void> {
  if (isDemoMode) return demo.submitRsvp(slug, input);
  const { error } = await db().rpc("submit_rsvp", {
    p_slug: slug,
    p_attending: input.attending,
    p_bringing_plus_one: input.bringingPlusOne,
    p_plus_one_name: input.plusOneName,
  });
  if (error) throw error;
}

export async function addWish(slug: string, message: string): Promise<void> {
  if (isDemoMode) return demo.addWish(slug, message);
  const { error } = await db().rpc("add_wish", { p_slug: slug, p_message: message });
  if (error) throw error;
}

export async function listWishes(): Promise<Wish[]> {
  if (isDemoMode) return demo.listWishes();
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

type DemoGuest = { name: string; plusOneAllowed: boolean; rsvp?: RsvpInput };

const sampleWishes = [
  "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fii khair. Congratulations!",
  "Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Aamiin ya Rabbal 'alamin.",
  "Congratulations to you both! May Allah fill your home with love and barakah.",
  "Selamat menempuh hidup baru, semoga Allah mudahkan sampai hari H.",
  "MasyaAllah, so happy for you! Sorry we can't make it, our du'a is with you.",
  "Semoga langgeng sampai jannah. Barakallah!",
];

const demo = (() => {
  // The first 30 dummy guests (except Yusuf Chatab, kept fresh for testing) have already replied.
  const guests = new Map<string, DemoGuest>(
    dummyGuests(100).map((g, i) => [
      g.slug,
      {
        name: g.name,
        plusOneAllowed: g.plusOneAllowed,
        rsvp:
          i > 0 && i <= 30
            ? { attending: i % 4 !== 0, bringingPlusOne: g.plusOneAllowed && i % 2 === 0, plusOneName: "" }
            : undefined,
      },
    ]),
  );
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
        plusOneAllowed: g.plusOneAllowed,
        attending: g.rsvp?.attending ?? null,
        bringingPlusOne: g.rsvp?.bringingPlusOne ?? false,
        plusOneName: g.rsvp?.plusOneName || null,
      };
    },
    async submitRsvp(slug: string, input: RsvpInput) {
      const g = guests.get(slug);
      if (!g) throw new Error("invitation not found");
      const plus = input.attending && g.plusOneAllowed && input.bringingPlusOne;
      g.rsvp = { attending: input.attending, bringingPlusOne: plus, plusOneName: plus ? input.plusOneName : "" };
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
    async listWishes() {
      return [...wishes];
    },
  };
})();
