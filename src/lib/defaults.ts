import type { ChartState, ColorTheme, FontFamily } from "./types";

export const DEFAULT_CHART: ChartState = {
  title: "My Radar Chart",
  items: [
    { id: "1", label: "Speed", value: 70 },
    { id: "2", label: "Power", value: 85 },
    { id: "3", label: "Defense", value: 60 },
    { id: "4", label: "Stamina", value: 75 },
    { id: "5", label: "Technique", value: 90 },
  ],
  colorTheme: "blue",
  chartStyle: "filled",
  fontFamily: "sans",
};

export const COLOR_THEMES: Record<
  ColorTheme,
  { border: string; background: string; label: string }
> = {
  blue: {
    border: "rgba(54, 162, 235, 1)",
    background: "rgba(54, 162, 235, 0.2)",
    label: "Blue",
  },
  green: {
    border: "rgba(75, 192, 120, 1)",
    background: "rgba(75, 192, 120, 0.2)",
    label: "Green",
  },
  red: {
    border: "rgba(255, 99, 132, 1)",
    background: "rgba(255, 99, 132, 0.2)",
    label: "Red",
  },
  orange: {
    border: "rgba(255, 159, 64, 1)",
    background: "rgba(255, 159, 64, 0.2)",
    label: "Orange",
  },
  purple: {
    border: "rgba(153, 102, 255, 1)",
    background: "rgba(153, 102, 255, 0.2)",
    label: "Purple",
  },
};

export const FONT_FAMILIES: Record<
  FontFamily,
  { css: string; label: string; google?: string }
> = {
  sans: {
    css: "system-ui, -apple-system, sans-serif",
    label: "Sans",
  },
  serif: {
    css: "Georgia, 'Times New Roman', serif",
    label: "Serif",
  },
  mono: {
    css: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
    label: "Mono",
    google: "JetBrains+Mono:wght@400;500",
  },
  rounded: {
    css: "'Nunito', system-ui, sans-serif",
    label: "Round",
    google: "Nunito:wght@400;600",
  },
  handwritten: {
    css: "'Caveat', cursive",
    label: "Hand",
    google: "Caveat:wght@400;600",
  },
};

export const CHART_COLORS = COLOR_THEMES.blue;

export const VALUE_MIN = 0;
export const VALUE_MAX = 100;
