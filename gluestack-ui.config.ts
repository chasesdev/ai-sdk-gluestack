import { config as defaultConfig } from "@gluestack-ui/config";

export const config = {
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
    colors: {
      ...defaultConfig.tokens.colors,
      // Primary/Accent colors based on #5a4fcf
      primary50: '#f0f0ff',
      primary100: '#e0e0ff',
      primary200: '#c5c5ff',
      primary300: '#9e9eff',
      primary400: '#7d7dff',
      primary500: '#5a4fcf',
      primary600: '#4a3fb8',
      primary700: '#3d3398',
      primary800: '#32287a',
      primary900: '#28205e',
      primary950: '#1a1440',

      // Semantic color tokens for light mode
      backgroundLight: '#ffffff',
      cardLight: '#ffffff',
      textLight: '#0f172a',
      textMutedLight: '#64748b',
      borderLight: '#e5e7eb',
      mutedLight: '#f9fafb',
      tintedLight: '#f0f0ff',

      // Semantic color tokens for dark mode
      backgroundDark: '#000000',
      cardDark: '#000000',
      textDark: '#ffffff',
      textMutedDark: '#999999',
      borderDark: '#1f1f1f',
      mutedDark: '#0a0a0a',
      tintedDark: '#000000',

      // Accent color (same for both modes)
      accent: '#5a4fcf',

      // Status colors
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    space: {
      ...defaultConfig.tokens.space,
      // 4px scale for consistent spacing
      '0': 0,
      '1': 4,
      '2': 8,
      '3': 12,
      '4': 16,
      '5': 20,
      '6': 24,
      '8': 32,
      '10': 40,
      '12': 48,
      '16': 64,
      '20': 80,
      '24': 96,
    },
    fontWeights: {
      ...defaultConfig.tokens.fontWeights,
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
};
