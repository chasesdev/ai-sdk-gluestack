import { VStack, Box } from '@gluestack-ui/themed';
import { Heading, Text } from '@gluestack-ui/themed';
import { ReactNode } from 'react';

interface DemoCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function DemoCard({ title, description, children }: DemoCardProps) {
  return (
    <Box className="bg-card border border-border rounded-xl p-5 shadow-sm" style={{ backgroundColor: '#ffffff' }}>
      <VStack space="md">
        <VStack space="xs">
          <Heading size="md" color="$textLight900" style={{ color: '#0f172a' }}>
            {title}
          </Heading>
          {description && (
            <Text size="sm" color="$textLight500" style={{ color: '#64748b' }}>
              {description}
            </Text>
          )}
        </VStack>
        <Box className="pt-2">
          {children}
        </Box>
      </VStack>
    </Box>
  );
}
