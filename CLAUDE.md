# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Dev server with HMR
npm run build      # tsc + vite build
npm run test       # vitest run (single pass)
npx vitest         # vitest watch mode
npm run lint       # eslint
npm run deploy     # vite build + wrangler deploy to Cloudflare Workers
```

Node 24 is managed via mise (`.mise.toml`).

## Architecture

Single-page radar chart maker built with React 19 + TypeScript + Vite 7 + Chart.js 4, deployed as a static site on Cloudflare Workers.

### State Flow

`useChartData()` hook owns all chart state (`ChartState`). State initializes from URL or `DEFAULT_CHART`, and syncs back to URL hash (`#d=<lz-string compressed>`) with 300ms debounce via `history.replaceState`.

### Dual Rendering

- **Canvas** (Chart.js via `react-chartjs-2`) — interactive display in the browser. `RadarChart` uses `forwardRef` + `useImperativeHandle` to expose `getCanvas()` for PNG export.
- **SVG** (`lib/svg.ts` → `generateRadarSvg()`) — pure function with zero DOM dependency. Used for clipboard SVG copy. Designed to also run in Cloudflare Workers (for future OGP image generation).

### Theming

Two independent theme axes:
- **App theme** (light/dark) — CSS custom properties via `[data-theme]` attribute, persisted in `localStorage`
- **Chart appearance** — `ColorTheme` (5 colors) + `ChartStyle` (filled/outline/dots) + `FontFamily` (5 fonts) — persisted in URL

### URL Serialization

`ChartState` is serialized to a compact `SerializedChart` format (`{t, l[], v[], c?, s?, f?}`) where optional fields are omitted when they match defaults. Compressed with `lz-string.compressToEncodedURIComponent`.

### Key Lib Modules

| Module | Purpose | DOM-free? |
|--------|---------|-----------|
| `lib/url.ts` | encode/decode ChartState ↔ URL | `encodeChartState`/`decodeChartState` yes; `syncToUrl`/`readFromUrl` use `window` |
| `lib/svg.ts` | Generate standalone SVG string | Yes — safe for Workers |
| `lib/defaults.ts` | COLOR_THEMES, FONT_FAMILIES, DEFAULT_CHART | Yes |
| `lib/random.ts` | Generate random chart data | Yes |
| `lib/fonts.ts` | Dynamic Google Fonts loading | No — injects `<link>` tags |

## Testing

Tests live in `src/lib/__tests__/`. Currently covers URL encoding roundtrips (14 tests). Run a single test file with:

```bash
npx vitest run src/lib/__tests__/url.test.ts
```

## Deployment

Static SPA on Cloudflare Workers. `wrangler.jsonc` uses `not_found_handling: "single-page-application"` (no Worker script, assets-only). Deployed at `https://radar-chart.ohbarye.workers.dev/`.
