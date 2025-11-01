export const THEME_COLORS = {
  light: {
    background: '#ffffff',
    text: '#000000',
    mutedText: '#64748b',
    accent: '#5a4fcf',
  },
  dark: {
    background: '#000000',
    text: '#ffffff',
    mutedText: '#999999',
    accent: '#5a4fcf',
  },
} as const;

export function getThemeColors(isDark: boolean) {
  return isDark ? THEME_COLORS.dark : THEME_COLORS.light;
}
