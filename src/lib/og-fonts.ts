// Fonts for generated images (link preview and app icons). ImageResponse needs
// TTF/OTF data, so ask Google Fonts for just the glyphs used; it serves TTF to
// clients that don't ask for WOFF2. Runs when the image is built, on the server.
export async function googleFont(family: string, text: string, weight = 400): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!src) return null;
    const res = await fetch(src);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    // No network: the image still renders, in the default font.
    return null;
  }
}

export type OgFont = { name: string; data: ArrayBuffer; weight: 400 | 700; style: "normal" };

// Script font for the names, serif (same as the site's body text) for the rest.
export async function weddingFonts(scriptText: string, serifText: string): Promise<OgFont[]> {
  const [script, serif] = await Promise.all([googleFont("Great Vibes", scriptText), googleFont("Caladea", serifText)]);
  const fonts: OgFont[] = [];
  if (script) fonts.push({ name: "Great Vibes", data: script, weight: 400, style: "normal" });
  if (serif) fonts.push({ name: "Caladea", data: serif, weight: 400, style: "normal" });
  return fonts;
}
