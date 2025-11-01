import { VStack } from '@gluestack-ui/themed';
import { Heading } from '@gluestack-ui/themed';
import { Text } from '@gluestack-ui/themed';
import { ReactNode } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors } from '../constants/theme';

interface ComponentSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function ComponentSection({ title, description, children }: ComponentSectionProps) {
  const { resolvedTheme } = useTheme();
  const colors = getThemeColors(resolvedTheme === 'dark');
  const { text: textColor, mutedText: mutedTextColor } = colors;

  return (
    <VStack space="md" className="mb-8">
      <VStack space="xs">
        <Heading size="xl" color="$textLight900" style={{ color: textColor }}>
          {title}
        </Heading>
        {description && (
          <Text size="sm" color="$textLight500" style={{ color: mutedTextColor }}>
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
