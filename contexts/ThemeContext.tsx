import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import { logger } from '../utils/logger';

// Prevent splash screen from auto-hiding on mobile
if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync().catch(() => {
    // Splash screen might already be hidden, ignore error
  });
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'app_theme_preference';

// Storage utility that works across platforms
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  }
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  // Resolve the actual theme (light or dark) based on theme setting
  const resolvedTheme: ResolvedTheme =
    theme === 'system'
      ? (systemColorScheme === 'dark' ? 'dark' : 'light')
      : theme;

  // Load theme preference from storage on mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Save theme preference to storage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      saveThemePreference(theme);
    }
  }, [theme, isLoaded]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await storage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
        setThemeState(savedTheme as ThemeMode);
      }
    } catch (error) {
      logger.error('Failed to load theme preference:', error);
    } finally {
      setIsLoaded(true);

      // Hide splash screen on mobile after theme is loaded
      if (Platform.OS !== 'web') {
        setTimeout(() => {
          SplashScreen.hideAsync().catch(() => {
            // Ignore errors if splash already hidden
          });
        }, 100); // Small delay to ensure theme is applied
      }
    }
  };

  const saveThemePreference = async (newTheme: ThemeMode) => {
    try {
      await storage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      logger.error('Failed to save theme preference:', error);
    }
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
