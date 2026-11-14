// 100 placeholder invitations used until the real guest list arrives.
// Deterministic, so links stay the same between restarts.

import type { EventAccess } from "@/config/wedding";

export type DummyGuest = { slug: string; name: string; plusOneAllowed: boolean; events: EventAccess };

const firstNames = [
  "Ahmad", "Muhammad", "Abdullah", "Fatimah", "Aisyah", "Khadijah", "Umar", "Ali", "Hasan", "Husein",
  "Zainab", "Maryam", "Ibrahim", "Ismail", "Yusuf", "Siti", "Nur", "Rizky", "Fauzan", "Hafidz",
  "Salma", "Annisa", "Rahmat", "Hamzah", "Bilal",
];
const lastNames = [
  "Rahman", "Hakim", "Syahputra", "Hidayat", "Nasution", "Lubis", "Harahap", "Siregar", "Alatas", "Assegaf",
  "Basalamah", "Bamuzaham", "Firmansyah", "Kurniawan", "Saputra", "Wijaya", "Hasibuan", "Pratama", "Ramadhan", "Maulana",
];

// Test links that always start without an RSVP, one per invitation type.
export const TEST_GUESTS = 5;

export function slugify(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function dummyGuests(count = 100): DummyGuest[] {
  const out: DummyGuest[] = [
    { slug: "yusuf-chatab", name: "Yusuf Chatab", plusOneAllowed: true, events: "both" },
    { slug: "test-akad-only", name: "Test Akad Only", plusOneAllowed: true, events: "akad" },
    { slug: "test-reception-only", name: "Test Reception Only", plusOneAllowed: true, events: "reception" },
    { slug: "test-reception-single", name: "Test Reception Single", plusOneAllowed: false, events: "reception" },
    { slug: "test-akad-single", name: "Test Akad Single", plusOneAllowed: false, events: "akad" },
  ];
  const seen = new Set(out.map((g) => g.slug));
  let seed = 7;
  const next = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) >>> 16);

  while (out.length < count) {
    const first = firstNames[next() % firstNames.length];
    const last = lastNames[next() % lastNames.length];
    const style = next() % 6;
    const name = style === 0 ? `${first} ${last} & Family` : style === 1 ? `${first} ${last} & Spouse` : `${first} ${last}`;
    const slug = slugify(name);
    if (seen.has(slug)) continue;
    seen.add(slug);
    // Families/couples are already counted as one invitation, so no extra plus one.
    const pick = out.length % 5; // not from next(), so the names stay the same as before
    out.push({ slug, name, plusOneAllowed: style > 1 && next() % 2 === 0, events: pick === 0 ? "akad" : pick === 1 ? "reception" : "both" });
  }
  return out;
}
