export interface ThemePreset {
  name: string;
  primary: string;
  accent: string;
  background: string;
  preview: string; // hex for visual swatch
}

export const THEME_PRESETS: ThemePreset[] = [
  { name: "Purple (Default)", primary: "265 85% 60%", accent: "280 80% 65%", background: "250 30% 5%", preview: "#7C3AED" },
  { name: "Blue Ocean", primary: "210 90% 55%", accent: "200 85% 60%", background: "215 30% 5%", preview: "#2563EB" },
  { name: "Green Forest", primary: "150 80% 45%", accent: "160 75% 50%", background: "155 30% 5%", preview: "#22C55E" },
  { name: "Red Fire", primary: "0 85% 55%", accent: "10 80% 60%", background: "0 30% 5%", preview: "#EF4444" },
  { name: "Orange Sunset", primary: "25 90% 55%", accent: "35 85% 60%", background: "20 30% 5%", preview: "#F97316" },
  { name: "Pink Rose", primary: "330 85% 60%", accent: "340 80% 65%", background: "330 30% 5%", preview: "#EC4899" },
  { name: "Teal Mint", primary: "175 80% 45%", accent: "185 75% 50%", background: "180 30% 5%", preview: "#14B8A6" },
  { name: "Gold Premium", primary: "45 90% 50%", accent: "40 85% 55%", background: "40 30% 5%", preview: "#EAB308" },
  { name: "Cyan Electric", primary: "185 90% 50%", accent: "195 85% 55%", background: "190 30% 5%", preview: "#06B6D4" },
  { name: "Indigo Night", primary: "240 80% 60%", accent: "250 75% 65%", background: "240 30% 5%", preview: "#6366F1" },
  { name: "Emerald", primary: "160 85% 40%", accent: "170 80% 45%", background: "165 30% 5%", preview: "#059669" },
  { name: "Amber Warm", primary: "38 92% 50%", accent: "28 88% 55%", background: "35 30% 5%", preview: "#D97706" },
  { name: "White Clean", primary: "265 85% 60%", accent: "280 80% 65%", background: "0 0% 98%", preview: "#FAFAFA" },
  { name: "Dark Slate", primary: "210 80% 55%", accent: "220 75% 60%", background: "220 15% 8%", preview: "#334155" },
];
