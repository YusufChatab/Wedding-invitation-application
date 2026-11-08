// All the wedding details live here. Replace the placeholders with the real ones.

export const wedding = {
  groom: {
    shortName: "Adam",
    fullName: "Adam Chatab",
    parents: "Son of Mr. Chatab & Mrs. Chatab",
  },
  bride: {
    shortName: "Hawa",
    fullName: "Hawa Rahman",
    parents: "Daughter of Mr. Rahman & Mrs. Rahman",
  },

  // Used for the countdown and "Save the date". Include the timezone offset.
  date: "2027-02-14T10:00:00+07:00",
  dateLabel: "Sunday, 14 February 2027",

  events: [
    {
      title: "Akad Nikah",
      time: "10:00 – 11:00",
      venue: "Masjid Al-Ikhlas",
      address: "Jl. Contoh No. 1, Jakarta",
      mapsUrl: "https://maps.google.com/?q=Masjid+Al-Ikhlas+Jakarta",
    },
    {
      title: "Walimah / Reception",
      time: "11:30 – 14:00",
      venue: "Gedung Serbaguna",
      address: "Jl. Contoh No. 2, Jakarta",
      mapsUrl: "https://maps.google.com/?q=Gedung+Serbaguna+Jakarta",
    },
  ],

  // End time for the "Save the date" calendar entry.
  calendarEnd: "2027-02-14T14:00:00+07:00",
};
