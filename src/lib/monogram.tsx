import { ImageResponse } from "next/og";
import { wedding } from "@/config/wedding";
import { weddingFonts } from "./og-fonts";

// "F&R" in gold script on deep wine: the browser tab icon and the iPhone
// home-screen icon.
export async function monogram(px: number, rounded: boolean) {
  const text = `${wedding.bride.shortName[0]}&${wedding.groom.shortName[0]}`;
  const fonts = await weddingFonts(text, "");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#4a0414",
          borderRadius: rounded ? px * 0.22 : 0,
          color: "#d6a26a",
          fontFamily: "Great Vibes",
          fontSize: px * 0.34,
          lineHeight: 1,
          paddingBottom: px * 0.04,
        }}
      >
        {text}
      </div>
    ),
    { width: px, height: px, fonts },
  );
}
