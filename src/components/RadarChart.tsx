import { useRef, useImperativeHandle, forwardRef } from "react";
import { Radar } from "react-chartjs-2";
import type { Chart } from "chart.js";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
import type { ChartState, AppTheme } from "../lib/types";
import { COLOR_THEMES, FONT_FAMILIES, VALUE_MAX } from "../lib/defaults";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

export interface RadarChartHandle {
  getCanvas: () => HTMLCanvasElement | null;
}

interface Props {
  state: ChartState;
  appTheme: AppTheme;
}

export const RadarChart = forwardRef<RadarChartHandle, Props>(
  function RadarChart({ state, appTheme }, ref) {
    const chartRef = useRef<Chart<"radar"> | null>(null);

    useImperativeHandle(ref, () => ({
      getCanvas: () => chartRef.current?.canvas ?? null,
    }));

    const colors = COLOR_THEMES[state.colorTheme];
    const fontCss = FONT_FAMILIES[state.fontFamily].css;
    const isDark = appTheme === "dark";

    const datasetConfig = (() => {
      switch (state.chartStyle) {
        case "outline":
          return {
            borderColor: colors.border,
            backgroundColor: "transparent",
            borderWidth: 2.5,
            pointRadius: 3,
            pointBackgroundColor: colors.border,
          };
        case "dots":
          return {
            borderColor: colors.border,
            backgroundColor: colors.background,
            borderWidth: 1,
            pointRadius: 6,
            pointBackgroundColor: colors.border,
            pointBorderColor: isDark ? "#1e1e2e" : "#fff",
            pointBorderWidth: 2,
          };
        case "filled":
        default:
          return {
            borderColor: colors.border,
            backgroundColor: colors.background,
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: colors.border,
          };
      }
    })();

    const data = {
      labels: state.items.map((i) => i.label || "(untitled)"),
      datasets: [
        {
          label: state.title,
          data: state.items.map((i) => i.value),
          ...datasetConfig,
        },
      ],
    };

    const gridColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)";
    const tickColor = isDark ? "#a0a0b0" : "#666";
    const labelColor = isDark ? "#e0e0e8" : "#344054";

    const options = {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        r: {
          beginAtZero: true,
          max: VALUE_MAX,
          ticks: {
            stepSize: 20,
            color: tickColor,
            backdropColor: "transparent",
            font: { family: fontCss, size: 10 },
          },
          grid: { color: gridColor },
          angleLines: { color: gridColor },
          pointLabels: { color: labelColor, font: { family: fontCss, size: 12 } },
        },
      },
      plugins: {
        legend: { display: false },
      },
    } as const;

    return <Radar ref={chartRef} data={data} options={options} />;
  }
);
