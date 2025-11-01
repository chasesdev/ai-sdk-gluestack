import React from 'react';
import { ScrollView, View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  ButtonText,
} from '@gluestack-ui/themed';
import { WorkflowPlanner, exampleNodes, exampleEdges } from '../components/workflow';
import { AIChatbot } from '../components/ai-sdk/AIChatbot';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors } from '../constants/theme';

export default function HomePage() {
  const { resolvedTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const colors = getThemeColors(resolvedTheme === 'dark');
  const { background: bgColor, text: textColor, mutedText: mutedTextColor, card: cardBg, border: borderColor } = colors;

  return (
    <>
      <ScrollView
        className="flex-1"
        style={{ 
          backgroundColor: bgColor,
          flex: 1,
          ...(Platform.OS === 'android' && {
            // Ensure proper rendering on Android
            flexGrow: 1,
          }),
        }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View
          style={{
            backgroundColor: bgColor,
            paddingTop: Platform.OS === 'android' ? Math.max(insets.top, 24) : Math.max(insets.top, 20),
            paddingBottom: 24,
            paddingHorizontal: 6,
          }}
        >
          {/* Header */}
          <View>
            <VStack space="md" className="mb-6">
              <VStack space="sm">
                <Heading size="xl" style={{ color: textColor }}>
                  AI SDK Components
                </Heading>
                <Text size="lg" style={{ color: mutedTextColor }}>
                  Interactive workflow and chat demonstrations
                </Text>
              </VStack>
              <Link href="/components" asChild>
                <Button variant="outline" size="lg">
                  <ButtonText style={{ color: textColor }}>View All Components</ButtonText>
                </Button>
              </Link>
            </VStack>
          </View>

          {/* Workflow Section */}
          <View>
            <VStack space="md" className="mb-8">
              <VStack space="xs">
                <Heading size="lg" style={{ color: textColor }}>
                  Workflow Planner
                </Heading>
                <Text size="sm" style={{ color: mutedTextColor }}>
                  Interactive workflow visualization with drag-and-drop nodes
                </Text>
              </VStack>
              <Box
                style={{
                  height: 500,
                  borderRadius: 12,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: borderColor,
                  backgroundColor: cardBg,
                }}
              >
                <WorkflowPlanner
                  initialNodes={exampleNodes}
                  initialEdges={exampleEdges}
                />
              </Box>
            </VStack>
          </View>

          {/* Chat Section */}
          <View>
            <VStack space="md" className="mb-8">
              <VStack space="xs">
                <Heading size="lg" style={{ color: textColor }}>
                  AI Chatbot
                </Heading>
                <Text size="sm" style={{ color: mutedTextColor }}>
                  Full-featured conversation interface with message history
                </Text>
              </VStack>
              <Box
                style={{
                  height: 500,
                  borderRadius: 12,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: borderColor,
                  backgroundColor: cardBg,
                }}
              >
                <AIChatbot
                  title="AI Assistant"
                  placeholder="Ask me anything..."
                />
              </Box>
            </VStack>
          </View>

          {/* Footer */}
          <View>
            <Box className="mt-8">
              <VStack space="sm" className="items-center">
                <Text size="sm" style={{ color: mutedTextColor }} className="text-center">
                  Built with Expo 54, Gluestack UI v3, NativeWind v4 & Reanimated v3
                </Text>
              </VStack>
            </Box>
          </View>
        </View>
      </ScrollView>
      <ThemeSwitcher />
    </>
  );
}
