// The JS-side mirror of index.css's CSS custom properties — the single
// source of truth for this app's color tokens is the palette below;
// index.css's :root block must be kept equal to it by hand (there are
// only ~10 tokens, so a build-time sync step would be more machinery
// than the problem needs).
//
// Every component styles itself with CSS (classes reading var(--token))
// EXCEPT Recharts, which renders straight to SVG via inline props
// (stroke="...", fill="..."): those need a literal color string, not a
// var() reference, so TrendChart/RegionsChart import this file instead
// of writing hex values inline.
export const theme = {
  bg: '#050505',
  surface: '#0f0f10',
  surface2: '#161617',
  surfaceHover: '#1a1a1c',
  border: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 255, 255, 0.16)',
  text: '#ffffff',
  textMuted: '#a1a1aa',
  textFaint: '#6b6b73',
  accent: '#e10600',
  accentBright: '#ff3b30',
  accentSoft: 'rgba(225, 6, 0, 0.16)',
  accentGlow: 'rgba(225, 6, 0, 0.45)',
}
