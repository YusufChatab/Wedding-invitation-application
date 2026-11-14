import type { Metadata, Viewport } from "next";
import { Amiri, Caladea, Great_Vibes } from "next/font/google";
import { wedding } from "@/config/wedding";
import "./globals.css";

// Clean sans-serif for body text, pairing with the script headings.
// Body text: the printed invitation is set in Cambria; Caladea is its free,
// same-shaped Google Fonts twin.
const caladea = Caladea({
  variable: "--font-caladea",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: `The Wedding of ${wedding.bride.shortName} & ${wedding.groom.shortName}`,
  description: `${wedding.dateLabel} · You are invited to celebrate with us.`,
};

// Colours the phone's browser bar to match the invitation instead of white.
export const viewport: Viewport = {
  themeColor: "#4a0414",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: browser extensions (e.g. Grammarly) add attributes to these tags.
    <html
      lang="en"
      className={`${caladea.variable} ${greatVibes.variable} ${amiri.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
