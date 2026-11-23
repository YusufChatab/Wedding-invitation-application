import { monogram } from "@/lib/monogram";

// Icon used when the invitation is saved to an iPhone home screen. iOS rounds
// the corners itself.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return monogram(size.width, false);
}
