import { describe, it, expect } from "vitest";
import LZString from "lz-string";
import { encodeChartState, decodeChartState } from "../url";
import type { ChartState } from "../types";

describe("URL encoding", () => {
  const sampleState: ChartState = {
    title: "Test Chart",
    items: [
      { id: "1", label: "Speed", value: 70 },
      { id: "2", label: "Power", value: 85 },
      { id: "3", label: "Defense", value: 60 },
    ],
    colorTheme: "blue",
    chartStyle: "filled",
    fontFamily: "sans",
  };

  it("roundtrips chart state through encode/decode", () => {
    const encoded = encodeChartState(sampleState);
    const decoded = decodeChartState(encoded);

    expect(decoded).not.toBeNull();
    expect(decoded!.title).toBe("Test Chart");
    expect(decoded!.items).toHaveLength(3);
    expect(decoded!.items[0].label).toBe("Speed");
    expect(decoded!.items[0].value).toBe(70);
    expect(decoded!.items[1].label).toBe("Power");
    expect(decoded!.items[1].value).toBe(85);
    expect(decoded!.items[2].label).toBe("Defense");
    expect(decoded!.items[2].value).toBe(60);
  });

  it("preserves title when present", () => {
    const encoded = encodeChartState(sampleState);
    const decoded = decodeChartState(encoded);
    expect(decoded!.title).toBe("Test Chart");
  });

  it("handles empty title", () => {
    const stateNoTitle: ChartState = {
      title: "",
      items: [
        { id: "1", label: "A", value: 50 },
        { id: "2", label: "B", value: 60 },
        { id: "3", label: "C", value: 70 },
      ],
      colorTheme: "blue",
      chartStyle: "filled",
      fontFamily: "sans",
    };
    const encoded = encodeChartState(stateNoTitle);
    const decoded = decodeChartState(encoded);
    expect(decoded!.title).toBe("");
  });

  it("handles Japanese labels", () => {
    const jpState: ChartState = {
      title: "テストチャート",
      items: [
        { id: "1", label: "速さ", value: 70 },
        { id: "2", label: "力", value: 85 },
        { id: "3", label: "守備", value: 60 },
      ],
      colorTheme: "blue",
      chartStyle: "filled",
      fontFamily: "sans",
    };
    const encoded = encodeChartState(jpState);
    const decoded = decodeChartState(encoded);
    expect(decoded!.title).toBe("テストチャート");
    expect(decoded!.items[0].label).toBe("速さ");
  });

  it("returns null for invalid encoded string", () => {
    expect(decodeChartState("not-valid-data")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(decodeChartState("")).toBeNull();
  });

  it("returns null for missing labels array", () => {
    const invalid = LZString.compressToEncodedURIComponent(
      JSON.stringify({ v: [1, 2, 3] })
    );
    expect(decodeChartState(invalid)).toBeNull();
  });

  it("returns null for missing values array", () => {
    const invalid = LZString.compressToEncodedURIComponent(
      JSON.stringify({ l: ["A", "B", "C"] })
    );
    expect(decodeChartState(invalid)).toBeNull();
  });

  it("generates unique IDs for decoded items", () => {
    const encoded = encodeChartState(sampleState);
    const decoded = decodeChartState(encoded);
    const ids = decoded!.items.map((i) => i.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("preserves non-default color theme", () => {
    const state: ChartState = {
      ...sampleState,
      colorTheme: "red",
    };
    const encoded = encodeChartState(state);
    const decoded = decodeChartState(encoded);
    expect(decoded!.colorTheme).toBe("red");
  });

  it("preserves non-default chart style", () => {
    const state: ChartState = {
      ...sampleState,
      chartStyle: "outline",
    };
    const encoded = encodeChartState(state);
    const decoded = decodeChartState(encoded);
    expect(decoded!.chartStyle).toBe("outline");
  });

  it("preserves non-default font family", () => {
    const state: ChartState = {
      ...sampleState,
      fontFamily: "handwritten",
    };
    const encoded = encodeChartState(state);
    const decoded = decodeChartState(encoded);
    expect(decoded!.fontFamily).toBe("handwritten");
  });

  it("defaults to blue/filled/sans when not specified", () => {
    const encoded = encodeChartState(sampleState);
    const decoded = decodeChartState(encoded);
    expect(decoded!.colorTheme).toBe("blue");
    expect(decoded!.chartStyle).toBe("filled");
    expect(decoded!.fontFamily).toBe("sans");
  });

  it("produces URL-safe encoded string", () => {
    const encoded = encodeChartState(sampleState);
    // Should not contain characters that need percent-encoding
    expect(encoded).toMatch(/^[A-Za-z0-9+/=-]*$/);
  });
});
