import { VStack } from '@gluestack-ui/themed';
import { Heading } from '@gluestack-ui/themed';
import { Text } from '@gluestack-ui/themed';
import { ReactNode } from 'react';

interface ComponentSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function ComponentSection({ title, description, children }: ComponentSectionProps) {
  return (
    <VStack space="md" className="mb-8">
      <VStack space="xs">
        <Heading size="xl" color="$textLight900" style={{ color: '#0f172a' }}>
          {title}
        </Heading>
        {description && (
          <Text size="sm" color="$textLight500" style={{ color: '#64748b' }}>
            {description}
          </Text>
        )}
      </VStack>
      <VStack space="md" className="mt-2">
        {children}
      </VStack>
    </VStack>
  );
}
