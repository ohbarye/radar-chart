import { useState, useCallback } from "react";
import type { ChartState, AppTheme } from "../lib/types";
import type { RadarChartHandle } from "./RadarChart";
import { generateRadarSvg } from "../lib/svg";

interface Props {
  state: ChartState;
  appTheme: AppTheme;
  chartRef: React.RefObject<RadarChartHandle | null>;
}

type CopyFeedback = "png" | "svg" | null;

export function CopyButtons({ state, appTheme, chartRef }: Props) {
  const [feedback, setFeedback] = useState<CopyFeedback>(null);

  const showFeedback = (type: CopyFeedback) => {
    setFeedback(type);
    setTimeout(() => setFeedback(null), 2000);
  };

  const copyAsPng = useCallback(async () => {
    const srcCanvas = chartRef.current?.getCanvas();
    if (!srcCanvas) return;

    // Create a temp canvas with background color to avoid transparent PNG
    const tmpCanvas = document.createElement("canvas");
    tmpCanvas.width = srcCanvas.width;
    tmpCanvas.height = srcCanvas.height;
    const ctx = tmpCanvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = appTheme === "dark" ? "#1e1e2e" : "#ffffff";
    ctx.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);
    ctx.drawImage(srcCanvas, 0, 0);

    const blob = await new Promise<Blob | null>((resolve) =>
      tmpCanvas.toBlob(resolve, "image/png")
    );
    if (!blob) return;

    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": blob }),
    ]);
    showFeedback("png");
  }, [chartRef, appTheme]);

  const copyAsSvg = useCallback(async () => {
    const svg = generateRadarSvg(state);
    if (!svg) return;

    await navigator.clipboard.writeText(svg);
    showFeedback("svg");
  }, [state]);

  return (
    <div className="copy-buttons">
      <button className="btn copy-btn" onClick={copyAsPng}>
        {feedback === "png" ? "Copied!" : "Copy as PNG"}
      </button>
      <button className="btn copy-btn" onClick={copyAsSvg}>
        {feedback === "svg" ? "Copied!" : "Copy as SVG"}
      </button>
    </div>
  );
}
