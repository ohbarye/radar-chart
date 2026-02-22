import type { ColorTheme, ChartStyle, FontFamily, AppTheme } from "../lib/types";
import { COLOR_THEMES, FONT_FAMILIES } from "../lib/defaults";

interface Props {
  colorTheme: ColorTheme;
  chartStyle: ChartStyle;
  fontFamily: FontFamily;
  appTheme: AppTheme;
  onColorThemeChange: (theme: ColorTheme) => void;
  onChartStyleChange: (style: ChartStyle) => void;
  onFontFamilyChange: (font: FontFamily) => void;
  onAppThemeToggle: () => void;
}

const CHART_STYLES: { value: ChartStyle; label: string }[] = [
  { value: "filled", label: "Filled" },
  { value: "outline", label: "Outline" },
  { value: "dots", label: "Dots" },
];

export function StylePicker({
  colorTheme,
  chartStyle,
  fontFamily,
  appTheme,
  onColorThemeChange,
  onChartStyleChange,
  onFontFamilyChange,
  onAppThemeToggle,
}: Props) {
  return (
    <div className="style-picker">
      <div className="picker-row">
        <label className="picker-label">Color</label>
        <div className="color-options">
          {(Object.keys(COLOR_THEMES) as ColorTheme[]).map((key) => (
            <button
              key={key}
              className={`color-swatch ${key === colorTheme ? "active" : ""}`}
              style={{ backgroundColor: COLOR_THEMES[key].border }}
              onClick={() => onColorThemeChange(key)}
              title={COLOR_THEMES[key].label}
            />
          ))}
        </div>
      </div>
      <div className="picker-row">
        <label className="picker-label">Style</label>
        <div className="style-options">
          {CHART_STYLES.map(({ value, label }) => (
            <button
              key={value}
              className={`btn style-btn ${value === chartStyle ? "active" : ""}`}
              onClick={() => onChartStyleChange(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="picker-row">
        <label className="picker-label">Font</label>
        <div className="style-options">
          {(Object.keys(FONT_FAMILIES) as FontFamily[]).map((key) => (
            <button
              key={key}
              className={`btn style-btn ${key === fontFamily ? "active" : ""}`}
              style={{ fontFamily: FONT_FAMILIES[key].css }}
              onClick={() => onFontFamilyChange(key)}
            >
              {FONT_FAMILIES[key].label}
            </button>
          ))}
        </div>
      </div>
      <div className="picker-row">
        <label className="picker-label">Theme</label>
        <button className="btn theme-toggle" onClick={onAppThemeToggle}>
          {appTheme === "light" ? "Dark" : "Light"}
        </button>
      </div>
    </div>
  );
}
