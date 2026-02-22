import type { FontFamily } from "./types";
import { FONT_FAMILIES } from "./defaults";

const loadedFonts = new Set<string>();

export function loadGoogleFont(fontFamily: FontFamily): void {
  const config = FONT_FAMILIES[fontFamily];
  if (!config.google || loadedFonts.has(fontFamily)) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${config.google}&display=swap`;
  document.head.appendChild(link);
  loadedFonts.add(fontFamily);
}
