// All the wedding details live here.

const venue = "Aston Priority Simatupang Hotel & Conference Center";
const address = "Jl. TB Simatupang Kav. 9, Kebagusan, Pasar Minggu, Jakarta Selatan";
const mapsUrl = "https://maps.google.com/?q=Aston+Priority+Simatupang+Hotel+%26+Conference+Center";

export type EventId = "akad" | "reception";

// Which events an invitation covers.
export type EventAccess = "both" | EventId;

export const wedding = {
  groom: {
    shortName: "Raziq",
    fullName: "Raziq",
    parents: "Son of Mr. Chatab & Mrs. Chatab",
  },
  bride: {
    shortName: "Farah",
    fullName: "Farah",
    parents: "Daughter of Mr. Rahman & Mrs. Rahman",
  },

  dateLabel: "Sunday, 6 December 2026",

  // Each guest can be invited to both events or only one (the "Event" column
  // in the guest Excel). `start`/`end` drive the countdown and "Save the date";
  // include the timezone offset.
  events: [
    {
      id: "akad",
      title: "Akad Nikah",
      time: "10:00 – 11:00",
      start: "2026-12-06T10:00:00+07:00",
      end: "2026-12-06T11:00:00+07:00",
      venue,
      address,
      mapsUrl,
    },
    {
      id: "reception",
      title: "Walimah / Reception",
      time: "11:30 – 14:00",
      start: "2026-12-06T11:30:00+07:00",
      end: "2026-12-06T14:00:00+07:00",
      venue,
      address,
      mapsUrl,
    },
  ],

  // Bank accounts for wedding gifts (shown in the "Wedding Gift" section).
  // PLACEHOLDERS: replace with the real accounts before sharing.
  gifts: [
    { bank: "BCA", accountNumber: "1234567890", accountName: "Farah" },
  ],

  // Background sound. Leave empty for the built-in nature sounds, or put an
  // MP3 in the `public` folder and set e.g. "/nasheed.mp3".
  backgroundMusic: "/sounds/waterfall-birds.mp3",
};

// The events a guest is invited to, in time order.
export function eventsFor(access: EventAccess = "both") {
  return wedding.events.filter((e) => access === "both" || e.id === access);
}

// "Akad Nikah", "Walimah / Reception" or "Akad Nikah & Walimah / Reception".
export function eventsLabel(access: EventAccess = "both") {
  return eventsFor(access).map((e) => e.title).join(" & ");
}
