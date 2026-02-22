import LZString from "lz-string";
import type { ChartState, SerializedChart } from "./types";

export function encodeChartState(state: ChartState): string {
  const serialized: SerializedChart = {
    l: state.items.map((i) => i.label),
    v: state.items.map((i) => i.value),
  };
  if (state.title) serialized.t = state.title;
  if (state.colorTheme !== "blue") serialized.c = state.colorTheme;
  if (state.chartStyle !== "filled") serialized.s = state.chartStyle;
  if (state.fontFamily !== "sans") serialized.f = state.fontFamily;
  const json = JSON.stringify(serialized);
  return LZString.compressToEncodedURIComponent(json);
}

export function decodeChartState(encoded: string): ChartState | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    const parsed: SerializedChart = JSON.parse(json);
    if (!Array.isArray(parsed.l) || !Array.isArray(parsed.v)) return null;
    return {
      title: parsed.t ?? "",
      items: parsed.l.map((label, i) => ({
        id: crypto.randomUUID(),
        label,
        value: parsed.v[i] ?? 0,
      })),
      colorTheme: parsed.c ?? "blue",
      chartStyle: parsed.s ?? "filled",
      fontFamily: parsed.f ?? "sans",
    };
  } catch {
    return null;
  }
}

export function syncToUrl(state: ChartState): void {
  const encoded = encodeChartState(state);
  history.replaceState(null, "", `#d=${encoded}`);
}

export function readFromUrl(): ChartState | null {
  const hash = window.location.hash;
  if (!hash.startsWith("#d=")) return null;
  return decodeChartState(hash.slice(3));
}
