// All the wedding details live here.

const venue = "Aston Priority Simatupang Hotel & Conference Center";
const address = "Jl. TB Simatupang Kav. 9, Kebagusan, Pasar Minggu, Jakarta Selatan";
const mapsUrl = "https://maps.google.com/?q=Aston+Priority+Simatupang+Hotel+%26+Conference+Center";

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

  // Used for the countdown and "Save the date". Include the timezone offset.
  date: "2026-12-06T10:00:00+07:00",
  dateLabel: "Sunday, 6 December 2026",

  events: [
    {
      title: "Akad Nikah",
      time: "10:00 – 11:00",
      venue,
      address,
      mapsUrl,
    },
    {
      title: "Walimah / Reception",
      time: "11:30 – 14:00",
      venue,
      address,
      mapsUrl,
    },
  ],

  // End time for the "Save the date" calendar entry.
  calendarEnd: "2026-12-06T14:00:00+07:00",

  // Background sound. Leave empty for the built-in nature sounds, or put an
  // MP3 in the `public` folder and set e.g. "/nasheed.mp3".
  backgroundMusic: "/sounds/waterfall-birds.mp3",
};
