import type { ChartState, ColorTheme, ChartStyle, FontFamily } from "./types";

const RANDOM_LABELS = [
  "Speed", "Power", "Defense", "Stamina", "Technique", "Agility",
  "Creativity", "Leadership", "Focus", "Luck", "Wisdom", "Charisma",
  "Courage", "Patience", "Humor", "Logic", "Empathy", "Endurance",
  "Precision", "Flexibility", "Strategy", "Intuition", "Resilience",
];

const COLOR_THEMES: ColorTheme[] = ["blue", "green", "red", "orange", "purple"];
const CHART_STYLES: ChartStyle[] = ["filled", "outline", "dots"];
const FONT_FAMILIES: FontFamily[] = ["sans", "serif", "mono", "rounded", "handwritten"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRandomChart(): ChartState {
  const count = randInt(3, 8);

  // Shuffle and pick unique labels
  const shuffled = [...RANDOM_LABELS].sort(() => Math.random() - 0.5);
  const labels = shuffled.slice(0, count);

  return {
    title: `Chart #${randInt(1, 999)}`,
    items: labels.map((label) => ({
      id: crypto.randomUUID(),
      label,
      value: randInt(10, 100),
    })),
    colorTheme: pick(COLOR_THEMES),
    chartStyle: pick(CHART_STYLES),
    fontFamily: pick(FONT_FAMILIES),
  };
}
