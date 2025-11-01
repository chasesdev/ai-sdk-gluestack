import { config as defaultConfig } from "@gluestack-ui/config";

export const config = {
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
    colors: {
      ...defaultConfig.tokens.colors,
      // Primary colors based on #5a4fcf
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
      // Accent colors based on #5a4fcf
      accent50: '#f0f0ff',
      accent100: '#e0e0ff',
      accent200: '#c5c5ff',
      accent300: '#9e9eff',
      accent400: '#7d7dff',
      accent500: '#5a4fcf',
      accent600: '#4a3fb8',
      accent700: '#3d3398',
      accent800: '#32287a',
      accent900: '#28205e',
      accent950: '#1a1440',
      // Background colors for light/dark mode
      backgroundLight: '#ffffff',
      backgroundDark: '#000000',
      textLight: '#000000',
      textDark: '#ffffff',
    },
  },
};
