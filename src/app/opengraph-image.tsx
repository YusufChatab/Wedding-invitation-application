import { ImageResponse } from "next/og";
import { wedding } from "@/config/wedding";
import { weddingFonts } from "@/lib/og-fonts";

// The picture shown when an invitation link is shared (WhatsApp, Instagram,
// etc.). It applies to every page, including each guest's personal link.
export const alt = `The Wedding of ${wedding.bride.shortName} & ${wedding.groom.shortName}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const wine = "#4a0414";
const gold = "#d6a26a";
const goldLight = "#efcc9d";
const cream = "#fdfbf6";

export default async function Image() {
  const { bride, groom, dateLabel } = wedding;
  const kicker = "THE WEDDING OF";
  const fonts = await weddingFonts(`${bride.shortName}${groom.shortName}&`, `${kicker}${dateLabel}`);

  // Names stacked in the middle, so they stay whole when an app crops the
  // preview to a square.
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: wine,
          fontFamily: "Caladea",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            border: `2px solid ${gold}`,
            borderRadius: 24,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 40,
            right: 40,
            bottom: 40,
            border: `1px solid ${gold}66`,
            borderRadius: 16,
            display: "flex",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: 26, letterSpacing: 10, color: goldLight }}>{kicker}</div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontFamily: "Great Vibes",
              color: gold,
              lineHeight: 1,
              marginTop: 18,
            }}
          >
            <div style={{ fontSize: 132 }}>{bride.shortName}</div>
            <div style={{ fontSize: 76, marginTop: -8, marginBottom: -8 }}>&amp;</div>
            <div style={{ fontSize: 132 }}>{groom.shortName}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 26, gap: 18 }}>
            <div style={{ width: 70, height: 1, background: gold }} />
            <div style={{ fontSize: 28, color: cream }}>{dateLabel}</div>
            <div style={{ width: 70, height: 1, background: gold }} />
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
