import { useState, useCallback, useEffect, useRef } from "react";
import type { ChartState, ChartItem, ColorTheme, ChartStyle, FontFamily } from "../lib/types";
import { readFromUrl, syncToUrl } from "../lib/url";
import { DEFAULT_CHART } from "../lib/defaults";
import { generateRandomChart } from "../lib/random";

export function useChartData() {
  const [state, setState] = useState<ChartState>(() => {
    return readFromUrl() ?? DEFAULT_CHART;
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => syncToUrl(state), 300);
    return () => clearTimeout(timeoutRef.current);
  }, [state]);

  const setTitle = useCallback((title: string) => {
    setState((prev) => ({ ...prev, title }));
  }, []);

  const addItem = useCallback(() => {
    setState((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: crypto.randomUUID(), label: "", value: 50 },
      ],
    }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  }, []);

  const updateItem = useCallback(
    (id: string, updates: Partial<Omit<ChartItem, "id">>) => {
      setState((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        ),
      }));
    },
    []
  );

  const setColorTheme = useCallback((colorTheme: ColorTheme) => {
    setState((prev) => ({ ...prev, colorTheme }));
  }, []);

  const setChartStyle = useCallback((chartStyle: ChartStyle) => {
    setState((prev) => ({ ...prev, chartStyle }));
  }, []);

  const setFontFamily = useCallback((fontFamily: FontFamily) => {
    setState((prev) => ({ ...prev, fontFamily }));
  }, []);

  const randomize = useCallback(() => {
    setState(generateRandomChart());
  }, []);

  const reset = useCallback(() => {
    setState(DEFAULT_CHART);
  }, []);

  return {
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
  };
}
