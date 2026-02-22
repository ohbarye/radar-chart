import type { ChartState } from "./types";
import { COLOR_THEMES, FONT_FAMILIES, VALUE_MAX } from "./defaults";

const SIZE = 500;
const CENTER = SIZE / 2;
const RADIUS = SIZE * 0.38;
const LABEL_OFFSET = 20;
const GRID_STEPS = [20, 40, 60, 80, 100];

function polarToXY(
  angleDeg: number,
  radius: number
): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad),
  };
}

function polygonPoints(count: number, radius: number): string {
  const step = 360 / count;
  return Array.from({ length: count }, (_, i) => {
    const { x, y } = polarToXY(i * step, radius);
    return `${x},${y}`;
  }).join(" ");
}

export function generateRadarSvg(state: ChartState): string {
  const n = state.items.length;
  if (n < 3) return "";

  const colors = COLOR_THEMES[state.colorTheme];
  const fontCss = FONT_FAMILIES[state.fontFamily].css;
  const step = 360 / n;

  // Grid polygons
  const gridLines = GRID_STEPS.map((val) => {
    const r = (val / VALUE_MAX) * RADIUS;
    return `<polygon points="${polygonPoints(n, r)}" fill="none" stroke="#d0d5dd" stroke-width="1"/>`;
  }).join("\n    ");

  // Grid tick labels
  const tickLabels = GRID_STEPS.map((val) => {
    const r = (val / VALUE_MAX) * RADIUS;
    return `<text x="${CENTER + 2}" y="${CENTER - r - 2}" font-size="10" fill="#98a2b3" font-family="${fontCss}">${val}</text>`;
  }).join("\n    ");

  // Spoke lines
  const spokes = Array.from({ length: n }, (_, i) => {
    const { x, y } = polarToXY(i * step, RADIUS);
    return `<line x1="${CENTER}" y1="${CENTER}" x2="${x}" y2="${y}" stroke="#d0d5dd" stroke-width="1"/>`;
  }).join("\n    ");

  // Data polygon
  const dataPoints = state.items.map((item, i) => {
    const r = (item.value / VALUE_MAX) * RADIUS;
    const { x, y } = polarToXY(i * step, r);
    return `${x},${y}`;
  });
  const dataPolygon = `<polygon points="${dataPoints.join(" ")}" fill="${colors.background}" stroke="${colors.border}" stroke-width="2"/>`;

  // Data points
  const dots = state.items
    .map((item, i) => {
      const r = (item.value / VALUE_MAX) * RADIUS;
      const { x, y } = polarToXY(i * step, r);
      return `<circle cx="${x}" cy="${y}" r="4" fill="${colors.border}"/>`;
    })
    .join("\n    ");

  // Labels
  const labels = state.items
    .map((item, i) => {
      const { x, y } = polarToXY(i * step, RADIUS + LABEL_OFFSET);
      const label = item.label || "(untitled)";
      let anchor = "middle";
      if (x < CENTER - 10) anchor = "end";
      else if (x > CENTER + 10) anchor = "start";
      return `<text x="${x}" y="${y}" text-anchor="${anchor}" dominant-baseline="central" font-size="12" fill="#344054" font-family="${fontCss}">${escapeXml(label)}</text>`;
    })
    .join("\n    ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <rect width="${SIZE}" height="${SIZE}" fill="white"/>
  <g>
    ${gridLines}
    ${tickLabels}
    ${spokes}
    ${dataPolygon}
    ${dots}
    ${labels}
  </g>
</svg>`;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
