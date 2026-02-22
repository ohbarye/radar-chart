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
      <footer className="footer">
        <span>Built by ohbarye</span>
        <a
          href="https://github.com/ohbarye/radar-chart"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub repository"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
        </a>
      </footer>
    </div>
  );
}

export default App;
