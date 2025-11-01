import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "../gluestack-ui.config";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Platform } from "react-native";
import "../global.css";

// Fix for Reanimated on web
if (typeof window !== "undefined") {
  // @ts-ignore
  window._frameTimestamp = null;
}

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: Platform.OS === 'android' ? '#ffffff' : undefined }}>
      <GluestackUIProvider config={config}>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Platform.OS === 'android' ? '#ffffff' : "transparent" },
          }}
        >
          <Stack.Screen name="index" />
        </Stack>
      </GluestackUIProvider>
    </View>
  );
}
