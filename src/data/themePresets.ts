export interface ThemePreset {
  name: string;
  primary: string;
  accent: string;
  // Dark mode colors
  darkBackground: string;
  darkText: string;
  darkSubtitle: string;
  darkCard: string;
  darkBorder: string;
  // Light mode colors
  lightBackground: string;
  lightText: string;
  lightSubtitle: string;
  lightCard: string;
  lightBorder: string;
  // Preview hex swatch
  preview: string;
}

/** Helper to build a full preset from just hue, saturation, and preview hex */
function makePreset(
  name: string, h: number, s: number, ah: number, as: number, preview: string
): ThemePreset {
  return {
    name,
    primary: `${h} ${s}% 60%`,
    accent: `${ah} ${as}% 65%`,
    preview,
    darkBackground: `${h} 30% 5%`,
    darkText: "0 0% 95%",
    darkSubtitle: `${h} 10% 55%`,
    darkCard: `${h} 25% 14%`,
    darkBorder: `${h} 20% 18%`,
    lightBackground: `${h} 20% 97%`,
    lightText: `${h} 30% 10%`,
    lightSubtitle: `${h} 10% 40%`,
    lightCard: "0 0% 100%",
    lightBorder: `${h} 15% 88%`,
  };
}

export const THEME_PRESETS: ThemePreset[] = [
  // ── Original 14 ──
  {
    name: "Purple", primary: "265 85% 60%", accent: "280 80% 65%", preview: "#7C3AED",
    darkBackground: "250 30% 5%", darkText: "0 0% 95%", darkSubtitle: "250 10% 55%", darkCard: "250 25% 14%", darkBorder: "250 20% 18%",
    lightBackground: "250 20% 97%", lightText: "250 30% 10%", lightSubtitle: "250 10% 40%", lightCard: "0 0% 100%", lightBorder: "250 15% 88%",
  },
  {
    name: "Blue Ocean", primary: "210 90% 55%", accent: "200 85% 60%", preview: "#2563EB",
    darkBackground: "215 30% 5%", darkText: "0 0% 95%", darkSubtitle: "210 10% 55%", darkCard: "215 25% 14%", darkBorder: "215 20% 18%",
    lightBackground: "210 25% 97%", lightText: "215 30% 10%", lightSubtitle: "210 10% 40%", lightCard: "0 0% 100%", lightBorder: "210 15% 88%",
  },
  {
    name: "Green Forest", primary: "150 80% 45%", accent: "160 75% 50%", preview: "#22C55E",
    darkBackground: "155 30% 5%", darkText: "0 0% 95%", darkSubtitle: "150 10% 55%", darkCard: "155 25% 14%", darkBorder: "155 20% 18%",
    lightBackground: "150 25% 97%", lightText: "155 30% 10%", lightSubtitle: "150 10% 40%", lightCard: "0 0% 100%", lightBorder: "150 15% 88%",
  },
  {
    name: "Red Fire", primary: "0 85% 55%", accent: "10 80% 60%", preview: "#EF4444",
    darkBackground: "0 30% 5%", darkText: "0 0% 95%", darkSubtitle: "0 10% 55%", darkCard: "0 25% 14%", darkBorder: "0 20% 18%",
    lightBackground: "0 25% 97%", lightText: "0 30% 10%", lightSubtitle: "0 10% 40%", lightCard: "0 0% 100%", lightBorder: "0 15% 88%",
  },
  {
    name: "Orange Sunset", primary: "25 90% 55%", accent: "35 85% 60%", preview: "#F97316",
    darkBackground: "20 30% 5%", darkText: "0 0% 95%", darkSubtitle: "25 10% 55%", darkCard: "20 25% 14%", darkBorder: "20 20% 18%",
    lightBackground: "25 25% 97%", lightText: "20 30% 10%", lightSubtitle: "25 10% 40%", lightCard: "0 0% 100%", lightBorder: "25 15% 88%",
  },
  {
    name: "Pink Rose", primary: "330 85% 60%", accent: "340 80% 65%", preview: "#EC4899",
    darkBackground: "330 30% 5%", darkText: "0 0% 95%", darkSubtitle: "330 10% 55%", darkCard: "330 25% 14%", darkBorder: "330 20% 18%",
    lightBackground: "330 25% 97%", lightText: "330 30% 10%", lightSubtitle: "330 10% 40%", lightCard: "0 0% 100%", lightBorder: "330 15% 88%",
  },
  {
    name: "Teal Mint", primary: "175 80% 45%", accent: "185 75% 50%", preview: "#14B8A6",
    darkBackground: "180 30% 5%", darkText: "0 0% 95%", darkSubtitle: "175 10% 55%", darkCard: "180 25% 14%", darkBorder: "180 20% 18%",
    lightBackground: "175 25% 97%", lightText: "180 30% 10%", lightSubtitle: "175 10% 40%", lightCard: "0 0% 100%", lightBorder: "175 15% 88%",
  },
  {
    name: "Gold Premium", primary: "45 90% 50%", accent: "40 85% 55%", preview: "#EAB308",
    darkBackground: "40 30% 5%", darkText: "0 0% 95%", darkSubtitle: "45 10% 55%", darkCard: "40 25% 14%", darkBorder: "40 20% 18%",
    lightBackground: "45 25% 97%", lightText: "40 30% 10%", lightSubtitle: "45 10% 40%", lightCard: "0 0% 100%", lightBorder: "45 15% 88%",
  },
  {
    name: "Cyan Electric", primary: "185 90% 50%", accent: "195 85% 55%", preview: "#06B6D4",
    darkBackground: "190 30% 5%", darkText: "0 0% 95%", darkSubtitle: "185 10% 55%", darkCard: "190 25% 14%", darkBorder: "190 20% 18%",
    lightBackground: "185 25% 97%", lightText: "190 30% 10%", lightSubtitle: "185 10% 40%", lightCard: "0 0% 100%", lightBorder: "185 15% 88%",
  },
  {
    name: "Indigo Night", primary: "240 80% 60%", accent: "250 75% 65%", preview: "#6366F1",
    darkBackground: "240 30% 5%", darkText: "0 0% 95%", darkSubtitle: "240 10% 55%", darkCard: "240 25% 14%", darkBorder: "240 20% 18%",
    lightBackground: "240 25% 97%", lightText: "240 30% 10%", lightSubtitle: "240 10% 40%", lightCard: "0 0% 100%", lightBorder: "240 15% 88%",
  },
  {
    name: "Emerald", primary: "160 85% 40%", accent: "170 80% 45%", preview: "#059669",
    darkBackground: "165 30% 5%", darkText: "0 0% 95%", darkSubtitle: "160 10% 55%", darkCard: "165 25% 14%", darkBorder: "165 20% 18%",
    lightBackground: "160 25% 97%", lightText: "165 30% 10%", lightSubtitle: "160 10% 40%", lightCard: "0 0% 100%", lightBorder: "160 15% 88%",
  },
  {
    name: "Amber Warm", primary: "38 92% 50%", accent: "28 88% 55%", preview: "#D97706",
    darkBackground: "35 30% 5%", darkText: "0 0% 95%", darkSubtitle: "38 10% 55%", darkCard: "35 25% 14%", darkBorder: "35 20% 18%",
    lightBackground: "38 25% 97%", lightText: "35 30% 10%", lightSubtitle: "38 10% 40%", lightCard: "0 0% 100%", lightBorder: "38 15% 88%",
  },
  {
    name: "Slate", primary: "210 80% 55%", accent: "220 75% 60%", preview: "#334155",
    darkBackground: "220 15% 8%", darkText: "0 0% 95%", darkSubtitle: "220 10% 55%", darkCard: "220 15% 14%", darkBorder: "220 15% 18%",
    lightBackground: "220 15% 97%", lightText: "220 15% 10%", lightSubtitle: "220 10% 40%", lightCard: "0 0% 100%", lightBorder: "220 10% 88%",
  },
  {
    name: "Rose Gold", primary: "350 70% 65%", accent: "20 60% 70%", preview: "#E8A0BF",
    darkBackground: "350 20% 6%", darkText: "0 0% 95%", darkSubtitle: "350 10% 55%", darkCard: "350 20% 14%", darkBorder: "350 15% 18%",
    lightBackground: "350 30% 97%", lightText: "350 20% 10%", lightSubtitle: "350 10% 40%", lightCard: "0 0% 100%", lightBorder: "350 15% 88%",
  },

  // ── 50 New Beautiful Presets ──
  makePreset("Coral", 16, 85, 6, 80, "#FF6B6B"),
  makePreset("Peach", 20, 90, 30, 85, "#FFAB76"),
  makePreset("Tangerine", 30, 92, 20, 88, "#FF8C42"),
  makePreset("Mango", 38, 88, 48, 82, "#FFB347"),
  makePreset("Honey", 42, 95, 52, 88, "#FFD700"),
  makePreset("Lemon", 55, 90, 45, 85, "#F0E130"),
  makePreset("Lime", 80, 80, 90, 75, "#A8D948"),
  makePreset("Chartreuse", 90, 85, 100, 80, "#7FFF00"),
  makePreset("Sage", 130, 35, 140, 30, "#87AE73"),
  makePreset("Mint", 160, 70, 170, 65, "#3EB489"),
  makePreset("Turquoise", 170, 82, 180, 78, "#40E0D0"),
  makePreset("Aqua", 180, 85, 190, 80, "#00CED1"),
  makePreset("Sky", 195, 88, 205, 82, "#0EA5E9"),
  makePreset("Azure", 205, 90, 215, 85, "#007FFF"),
  makePreset("Cobalt", 220, 88, 230, 82, "#0047AB"),
  makePreset("Royal Blue", 230, 85, 240, 80, "#4169E1"),
  makePreset("Sapphire", 235, 80, 245, 75, "#0F52BA"),
  makePreset("Periwinkle", 240, 65, 250, 60, "#CCCCFF"),
  makePreset("Lavender", 255, 70, 265, 65, "#B57EDC"),
  makePreset("Orchid", 280, 75, 290, 70, "#DA70D6"),
  makePreset("Plum", 290, 60, 300, 55, "#8E4585"),
  makePreset("Magenta", 300, 85, 310, 80, "#FF00FF"),
  makePreset("Fuchsia", 310, 88, 320, 82, "#FF77FF"),
  makePreset("Hot Pink", 330, 90, 340, 85, "#FF69B4"),
  makePreset("Blush", 340, 55, 350, 50, "#DE5D83"),
  makePreset("Crimson", 348, 85, 358, 80, "#DC143C"),
  makePreset("Ruby", 350, 78, 0, 72, "#E0115F"),
  makePreset("Burgundy", 345, 65, 355, 60, "#800020"),
  makePreset("Wine", 340, 50, 350, 45, "#722F37"),
  makePreset("Mauve", 310, 30, 320, 25, "#E0B0FF"),
  makePreset("Lilac", 280, 50, 290, 45, "#C8A2C8"),
  makePreset("Wisteria", 270, 55, 280, 50, "#C9A0DC"),
  makePreset("Amethyst", 275, 70, 285, 65, "#9966CC"),
  makePreset("Violet", 270, 80, 280, 75, "#8B00FF"),
  makePreset("Electric Blue", 215, 92, 225, 88, "#0080FF"),
  makePreset("Neon Green", 120, 90, 130, 85, "#39FF14"),
  makePreset("Neon Pink", 320, 95, 330, 90, "#FF6EC7"),
  makePreset("Neon Orange", 20, 95, 30, 90, "#FF5F1F"),
  makePreset("Neon Cyan", 180, 95, 190, 90, "#00FFEF"),
  makePreset("Sunset Red", 5, 80, 15, 75, "#FF4500"),
  makePreset("Copper", 25, 70, 35, 65, "#B87333"),
  makePreset("Bronze", 30, 55, 40, 50, "#CD7F32"),
  makePreset("Champagne", 40, 40, 50, 35, "#F7E7CE"),
  makePreset("Ivory", 50, 30, 60, 25, "#FFFFF0"),
  makePreset("Cream", 45, 45, 55, 40, "#FFFDD0"),
  makePreset("Sand", 35, 50, 45, 45, "#C2B280"),
  makePreset("Terracotta", 15, 60, 25, 55, "#E2725B"),
  makePreset("Rust", 15, 75, 5, 70, "#B7410E"),
  makePreset("Maroon", 0, 70, 350, 65, "#800000"),
  makePreset("Forest Green", 140, 60, 150, 55, "#228B22"),
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

/** Get all mode-specific colors from a preset */
export function getPresetColors(preset: ThemePreset, isDark: boolean) {
  return {
    primaryColor: preset.primary,
    accentColor: preset.accent,
    backgroundColor: isDark ? preset.darkBackground : preset.lightBackground,
    textColor: isDark ? preset.darkText : preset.lightText,
    subtitleColor: isDark ? preset.darkSubtitle : preset.lightSubtitle,
    cardColor: isDark ? preset.darkCard : preset.lightCard,
    borderColor: isDark ? preset.darkBorder : preset.lightBorder,
  };
}
