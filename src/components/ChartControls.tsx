import { useState } from "react";

interface Props {
  title: string;
  onTitleChange: (title: string) => void;
  onReset: () => void;
  onRandomize: () => void;
}

export function ChartControls({ title, onTitleChange, onReset, onRandomize }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="chart-controls">
      <input
        type="text"
        className="title-input"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Chart Title"
      />
      <div className="control-buttons">
        <button className="btn share-btn" onClick={handleShare}>
          {copied ? "Copied!" : "Share URL"}
        </button>
        <button className="btn random-btn" onClick={onRandomize}>
          Random
        </button>
        <button className="btn reset-btn" onClick={onReset}>
          Reset
        </button>
      </div>
    </div>
  );
}
