import { useRef, useState, useCallback, useEffect } from "react";
import { useChartData } from "./hooks/useChartData";
import { RadarChart } from "./components/RadarChart";
import type { RadarChartHandle } from "./components/RadarChart";
import { ItemList } from "./components/ItemList";
import { ChartControls } from "./components/ChartControls";
import { CopyButtons } from "./components/CopyButtons";
import { StylePicker } from "./components/StylePicker";
import { loadGoogleFont } from "./lib/fonts";
import type { AppTheme, FontFamily } from "./lib/types";
import "./App.css";

function getInitialAppTheme(): AppTheme {
  const stored = localStorage.getItem("app-theme");
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function App() {
  const {
    state,
    setTitle,
    addItem,
    removeItem,
    updateItem,
    setColorTheme,
    setChartStyle,
    setFontFamily,
    randomize,
    reset,
  } = useChartData();
  const chartRef = useRef<RadarChartHandle>(null);
  const [appTheme, setAppTheme] = useState<AppTheme>(getInitialAppTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", appTheme);
    localStorage.setItem("app-theme", appTheme);
  }, [appTheme]);

  // Load Google Font when font changes
  useEffect(() => {
    loadGoogleFont(state.fontFamily);
  }, [state.fontFamily]);

  const toggleAppTheme = useCallback(() => {
    setAppTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const handleFontFamilyChange = useCallback(
    (font: FontFamily) => {
      loadGoogleFont(font);
      setFontFamily(font);
    },
    [setFontFamily]
  );

  return (
    <div className="app">
      <header>
        <h1>Radar Chart Maker</h1>
      </header>
      <main className="layout">
        <aside className="editor">
          <ChartControls
            title={state.title}
            onTitleChange={setTitle}
            onReset={reset}
            onRandomize={randomize}
          />
          <StylePicker
            colorTheme={state.colorTheme}
            chartStyle={state.chartStyle}
            fontFamily={state.fontFamily}
            appTheme={appTheme}
            onColorThemeChange={setColorTheme}
            onChartStyleChange={setChartStyle}
            onFontFamilyChange={handleFontFamilyChange}
            onAppThemeToggle={toggleAppTheme}
          />
          <ItemList
            items={state.items}
            onUpdate={updateItem}
            onAdd={addItem}
            onRemove={removeItem}
          />
        </aside>
        <section className="preview">
          <RadarChart ref={chartRef} state={state} appTheme={appTheme} />
          <CopyButtons state={state} appTheme={appTheme} chartRef={chartRef} />
        </section>
      </main>
    </div>
  );
}

export default App;
