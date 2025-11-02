import React from 'react'
import {
  VStack,
  HStack,
  Box,
  Button,
  ButtonText,
  Spinner,
  Icon,
} from '@gluestack-ui/themed'
import { ActionItem, ActionsLayout } from './types'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useTheme } from '../../contexts/ThemeContext'
import { getThemeColors } from '../../constants/theme'

interface ActionsProps {
  actions: ActionItem[]
  layout?: ActionsLayout
  size?: 'sm' | 'md' | 'lg'
  sx?: any
}

export function Actions({
  actions,
  layout = 'horizontal',
  size = 'md',
  sx,
}: ActionsProps) {
  const { resolvedTheme } = useTheme()
  const colors = getThemeColors(resolvedTheme === 'dark')
  const { text: textColor } = colors

  const renderAction = (action: ActionItem, index: number) => {
    // Determine text color based on button variant
    // Solid buttons with colored backgrounds always use white for contrast
    let buttonTextColor: string = textColor
    if (action.variant === 'outline') {
      buttonTextColor = textColor
    } else if (action.action === 'primary' || action.variant === 'primary') {
      buttonTextColor = '#ffffff' // Always white for colored button backgrounds
    } else if (action.action === 'positive' || action.action === 'negative') {
      buttonTextColor = '#ffffff' // Always white for colored button backgrounds
    }

    return (
      <Animated.View key={action.id} entering={FadeInDown.delay(index * 100)}>
        <Button
          action={
            action.action ||
            (action.variant === 'primary'
              ? 'primary'
              : action.variant === 'secondary'
                ? 'secondary'
                : 'default')
          }
          variant={
            action.variant === 'outline'
              ? 'outline'
              : action.variant === 'ghost'
                ? 'link'
                : 'solid'
          }
          size={size}
          onPress={action.onPress}
          isDisabled={action.disabled || action.loading}
          sx={{ minWidth: 100 }}
        >
          {action.loading ? (
            <Spinner size="small" />
          ) : (
            <>
              {action.icon && (
                <Icon as={action.icon} size="sm" sx={{ marginRight: '$2' }} />
              )}
              <ButtonText style={{ color: buttonTextColor }}>
                {action.label}
              </ButtonText>
            </>
          )}
        </Button>
      </Animated.View>
    )
  }

  if (layout === 'grid') {
    return (
      <Box sx={sx}>
        <Box sx={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {actions.map((action, index) => (
            <Box key={action.id} sx={{ flex: 1, minWidth: 120, maxWidth: 200 }}>
              {renderAction(action, index)}
            </Box>
          ))}
        </Box>
      </Box>
    )
  }

  if (layout === 'vertical') {
    return (
      <VStack space="sm" sx={sx}>
        {actions.map((action, index) => renderAction(action, index))}
      </VStack>
    )
  }

  // horizontal (default)
  return (
    <HStack space="sm" sx={{ flexWrap: 'wrap', ...sx }}>
      {actions.map((action, index) => renderAction(action, index))}
    </HStack>
  )
}
