export const THEME_COLORS = {
  light: {
    background: '#ffffff',
    card: '#ffffff',
    text: '#0f172a',
    mutedText: '#64748b',
    accent: '#5a4fcf',
    border: '#e5e7eb',
    muted: '#f9fafb',
  },
  dark: {
    background: '#010101',
    card: '#1e293b',
    text: '#ffffff',
    mutedText: '#94a3b8',
    accent: '#5a4fcf',
    border: '#334155',
    muted: '#1f2937',
  },
} as const;

export function getThemeColors(isDark: boolean) {
  return isDark ? THEME_COLORS.dark : THEME_COLORS.light;
}
