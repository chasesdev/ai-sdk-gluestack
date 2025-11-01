export const THEME_COLORS = {
  light: {
    background: '#ffffff',
    card: '#ffffff',
    text: '#0f172a',
    mutedText: '#64748b',
    accent: '#5a4fcf',
    border: '#e5e7eb',
    muted: '#f9fafb',
    tintedBg: '#f0f0ff', // primary50
  },
  dark: {
    background: '#000000',
    card: '#000000',
    text: '#ffffff',
    mutedText: '#999999',
    accent: '#5a4fcf',
    border: '#1f1f1f',
    muted: '#0a0a0a',
    tintedBg: '#000000', // black for dark mode panels
  },
} as const;

export function getThemeColors(isDark: boolean) {
  return isDark ? THEME_COLORS.dark : THEME_COLORS.light;
}
