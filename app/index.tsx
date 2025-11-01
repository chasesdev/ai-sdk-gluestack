import React from 'react';
import { ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { VStack } from '@gluestack-ui/themed';
import { WorkflowPlanner, exampleNodes, exampleEdges } from '../components/workflow';
import { AIChatbot } from '../components/ai-sdk/AIChatbot';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import {
  ThemedHeading,
  ThemedText,
  ThemedCard,
  ThemedButton,
  ResponsiveContainer,
} from '../components/themed';

export default function HomePage() {
  return (
    <>
      <ScrollView className="flex-1" contentInsetAdjustmentBehavior="automatic">
        <ResponsiveContainer>
          {/* Header */}
          <VStack space="md" sx={{ marginBottom: '$6' }}>
            <VStack space="sm">
              <ThemedHeading size="xl">AI SDK Components</ThemedHeading>
              <ThemedText variant="muted" size="lg">
                Interactive workflow and chat demonstrations
              </ThemedText>
            </VStack>
            <Link href="/components" asChild>
              <ThemedButton variant="outline" size="lg" text="View All Components" />
            </Link>
          </VStack>

          {/* Workflow Section */}
          <VStack space="md" sx={{ marginBottom: '$8' }}>
            <VStack space="xs">
              <ThemedHeading size="lg">Workflow Planner</ThemedHeading>
              <ThemedText variant="muted" size="sm">
                Interactive workflow visualization with drag-and-drop nodes
              </ThemedText>
            </VStack>
            <ThemedCard
              sx={{
                height: 500,
                overflow: 'hidden',
                padding: '$0',
              }}
            >
              <WorkflowPlanner initialNodes={exampleNodes} initialEdges={exampleEdges} />
            </ThemedCard>
          </VStack>

          {/* Chat Section */}
          <VStack space="md" sx={{ marginBottom: '$8' }}>
            <VStack space="xs">
              <ThemedHeading size="lg">AI Chatbot</ThemedHeading>
              <ThemedText variant="muted" size="sm">
                Full-featured conversation interface with message history
              </ThemedText>
            </VStack>
            <ThemedCard
              sx={{
                height: 700,
                overflow: 'hidden',
                padding: '$0',
              }}
            >
              <AIChatbot title="AI Assistant" placeholder="Ask me anything..." />
            </ThemedCard>
          </VStack>

          {/* Footer */}
          <VStack space="sm" sx={{ marginTop: '$8', alignItems: 'center' }}>
            <ThemedText variant="muted" size="sm" className="text-center">
              Built with Expo 54, Gluestack UI v3, NativeWind v4 & Reanimated v3
            </ThemedText>
          </VStack>
        </ResponsiveContainer>
      </ScrollView>
      <ThemeSwitcher />
    </>
  );
}
