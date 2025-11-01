import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "../gluestack-ui.config";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";

// Fix for Reanimated on web
if (typeof window !== "undefined") {
  // @ts-ignore
  window._frameTimestamp = null;
}

export default function RootLayout() {
  useEffect(() => {
    // Additional Reanimated setup if needed
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider config={config}>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "transparent" },
          }}
        >
          <Stack.Screen name="index" />
        </Stack>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}
