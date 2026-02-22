export interface ChartItem {
  id: string;
  label: string;
  value: number;
}

export type ColorTheme = "blue" | "green" | "red" | "orange" | "purple";
export type ChartStyle = "filled" | "outline" | "dots";
export type FontFamily = "sans" | "serif" | "mono" | "rounded" | "handwritten";
export type AppTheme = "light" | "dark";

export interface ChartState {
  title: string;
  items: ChartItem[];
  colorTheme: ColorTheme;
  chartStyle: ChartStyle;
  fontFamily: FontFamily;
}

export interface SerializedChart {
  t?: string;
  l: string[];
  v: number[];
  c?: ColorTheme;
  s?: ChartStyle;
  f?: FontFamily;
}
