import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "../gluestack-ui.config";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Platform } from "react-native";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../constants/theme";
import "../global.css";

// Fix for Reanimated on web
if (typeof window !== "undefined") {
  // @ts-ignore
  window._frameTimestamp = null;
}

function RootLayoutContent() {
  const { resolvedTheme } = useTheme();

  // Apply dark class to document in web
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    if (resolvedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  const colors = getThemeColors(resolvedTheme === 'dark');
  const backgroundColor = colors.background;

  return (
    <View style={{ flex: 1, backgroundColor: Platform.OS === 'android' ? backgroundColor : undefined }}>
      <GluestackUIProvider config={config} colorMode={resolvedTheme}>
        <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Platform.OS === 'android' ? backgroundColor : "transparent" },
          }}
        >
          <Stack.Screen name="index" />
        </Stack>
      </GluestackUIProvider>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}
