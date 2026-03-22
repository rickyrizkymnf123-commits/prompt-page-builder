export interface ThemePreset {
  name: string;
  primary: string;
  accent: string;
  darkBackground: string;
  lightBackground: string;
  preview: string; // hex for visual swatch
}

export const THEME_PRESETS: ThemePreset[] = [
  { name: "Purple", primary: "265 85% 60%", accent: "280 80% 65%", darkBackground: "250 30% 5%", lightBackground: "250 20% 96%", preview: "#7C3AED" },
  { name: "Blue Ocean", primary: "210 90% 55%", accent: "200 85% 60%", darkBackground: "215 30% 5%", lightBackground: "210 20% 96%", preview: "#2563EB" },
  { name: "Green Forest", primary: "150 80% 45%", accent: "160 75% 50%", darkBackground: "155 30% 5%", lightBackground: "150 20% 96%", preview: "#22C55E" },
  { name: "Red Fire", primary: "0 85% 55%", accent: "10 80% 60%", darkBackground: "0 30% 5%", lightBackground: "0 20% 96%", preview: "#EF4444" },
  { name: "Orange Sunset", primary: "25 90% 55%", accent: "35 85% 60%", darkBackground: "20 30% 5%", lightBackground: "25 20% 96%", preview: "#F97316" },
  { name: "Pink Rose", primary: "330 85% 60%", accent: "340 80% 65%", darkBackground: "330 30% 5%", lightBackground: "330 20% 96%", preview: "#EC4899" },
  { name: "Teal Mint", primary: "175 80% 45%", accent: "185 75% 50%", darkBackground: "180 30% 5%", lightBackground: "175 20% 96%", preview: "#14B8A6" },
  { name: "Gold Premium", primary: "45 90% 50%", accent: "40 85% 55%", darkBackground: "40 30% 5%", lightBackground: "45 20% 96%", preview: "#EAB308" },
  { name: "Cyan Electric", primary: "185 90% 50%", accent: "195 85% 55%", darkBackground: "190 30% 5%", lightBackground: "185 20% 96%", preview: "#06B6D4" },
  { name: "Indigo Night", primary: "240 80% 60%", accent: "250 75% 65%", darkBackground: "240 30% 5%", lightBackground: "240 20% 96%", preview: "#6366F1" },
  { name: "Emerald", primary: "160 85% 40%", accent: "170 80% 45%", darkBackground: "165 30% 5%", lightBackground: "160 20% 96%", preview: "#059669" },
  { name: "Amber Warm", primary: "38 92% 50%", accent: "28 88% 55%", darkBackground: "35 30% 5%", lightBackground: "38 20% 96%", preview: "#D97706" },
  { name: "Slate", primary: "210 80% 55%", accent: "220 75% 60%", darkBackground: "220 15% 8%", lightBackground: "220 15% 95%", preview: "#334155" },
  { name: "Rose Gold", primary: "350 70% 65%", accent: "20 60% 70%", darkBackground: "350 20% 6%", lightBackground: "350 30% 96%", preview: "#E8A0BF" },
];

/** Convert HSL string like "265 85% 60%" to hex color for preview */
export function hslToHex(hslStr: string): string {
  const parts = hslStr.match(/[\d.]+/g);
  if (!parts || parts.length < 3) return "#888888";
  const h = parseFloat(parts[0]);
  const s = parseFloat(parts[1]) / 100;
  const l = parseFloat(parts[2]) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }

  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** Convert hex to HSL string like "265 85% 60%" */
export function hexToHsl(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "0 0% 50%";
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }

  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}
