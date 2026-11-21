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
    fullName: "Raziq Muhammad Chatab",
    parents: "Eldest son of Mr. Rudi Yandri Chatab & Mrs. Heirani Khairul",
  },
  bride: {
    shortName: "Farah",
    fullName: "Farah Utari Jasmine",
    parents: "Second daughter of Mr. Nugroho & Mrs. Shinta Damayanti",
  },

  dateLabel: "Sunday, 6 December 2026",

  // Each guest can be invited to both events or only one (the "Event" column
  // in the guest Excel). `start`/`end` drive the countdown and "Save the date";
  // include the timezone offset.
  events: [
    {
      id: "akad",
      title: "Akad Nikah",
      time: "09:00 – 12:00 WIB",
      start: "2026-12-06T09:00:00+07:00",
      end: "2026-12-06T12:00:00+07:00",
      venue,
      address,
      mapsUrl,
    },
    {
      id: "reception",
      title: "Walimah / Reception",
      time: "19:00 – 21:00 WIB",
      start: "2026-12-06T19:00:00+07:00",
      end: "2026-12-06T21:00:00+07:00",
      venue,
      address,
      mapsUrl,
    },
  ],

  // Bank accounts for wedding gifts (shown in the "Wedding Gift" section).
  gifts: [
    { bank: "BCA", accountNumber: "6080426109", accountName: "Farah Utari Jasmine" },
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
