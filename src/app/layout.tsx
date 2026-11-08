import type { Metadata, Viewport } from "next";
import { Amiri, Cormorant_Garamond, Great_Vibes } from "next/font/google";
import { wedding } from "@/config/wedding";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
  title: `The Wedding of ${wedding.groom.shortName} & ${wedding.bride.shortName}`,
  description: `${wedding.dateLabel} · You are invited to celebrate with us.`,
};

// Colours the phone's browser bar to match the invitation instead of white.
export const viewport: Viewport = {
  themeColor: "#0b2b24",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: browser extensions (e.g. Grammarly) add attributes to these tags.
    <html
      lang="en"
      className={`${cormorant.variable} ${greatVibes.variable} ${amiri.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
