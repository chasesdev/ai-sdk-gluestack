import { VStack, Box } from '@gluestack-ui/themed'
import { ReactNode } from 'react'
import { ThemedCard, ThemedHeading, ThemedText } from './themed'

interface DemoCardProps {
  title: string
  description?: string
  children: ReactNode
}

export function DemoCard({ title, description, children }: DemoCardProps) {
  return (
    <ThemedCard>
      <VStack space="md">
        <VStack space="xs">
          <ThemedHeading size="md">{title}</ThemedHeading>
          {description && (
            <ThemedText variant="muted" size="sm">
              {description}
            </ThemedText>
          )}
        </VStack>
        <Box sx={{ paddingTop: '$2' }}>{children}</Box>
      </VStack>
    </ThemedCard>
  )
}
