import { VStack } from '@gluestack-ui/themed';
import { ReactNode } from 'react';
import { ThemedHeading, ThemedText } from './themed';

interface ComponentSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function ComponentSection({ title, description, children }: ComponentSectionProps) {
  return (
    <VStack space="md" sx={{ marginBottom: '$8' }}>
      <VStack space="xs">
        <ThemedHeading size="xl">{title}</ThemedHeading>
        {description && (
          <ThemedText variant="muted" size="sm">
            {description}
          </ThemedText>
        )}
      </VStack>
      <VStack space="md" sx={{ marginTop: '$2' }}>
        {children}
      </VStack>
    </VStack>
  );
}
