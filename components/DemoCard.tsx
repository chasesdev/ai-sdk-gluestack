import { VStack, Box } from '@gluestack-ui/themed';
import { Heading, Text } from '@gluestack-ui/themed';
import { ReactNode } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors } from '../constants/theme';

interface DemoCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function DemoCard({ title, description, children }: DemoCardProps) {
  const { resolvedTheme } = useTheme();
  const colors = getThemeColors(resolvedTheme === 'dark');
  const { card: cardBg, text: textColor, mutedText: mutedTextColor, border: borderColor } = colors;

  return (
    <Box 
      className="bg-card border border-border rounded-xl p-5 shadow-sm" 
      style={{ 
        backgroundColor: cardBg,
        borderColor: borderColor,
      }}
    >
      <VStack space="md">
        <VStack space="xs">
          <Heading size="md" style={{ color: textColor }}>
            {title}
          </Heading>
          {description && (
            <Text size="sm" style={{ color: mutedTextColor }}>
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
