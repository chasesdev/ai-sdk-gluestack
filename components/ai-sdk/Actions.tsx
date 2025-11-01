import React from 'react';
import { VStack, HStack, Box, Button, ButtonText, Spinner, Icon } from '@gluestack-ui/themed';
import { ActionItem, ActionsLayout } from './types';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface ActionsProps {
  actions: ActionItem[];
  layout?: ActionsLayout;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Actions({ actions, layout = 'horizontal', size = 'md', className }: ActionsProps) {
  const renderAction = (action: ActionItem, index: number) => {
    return (
      <Animated.View key={action.id} entering={FadeInDown.delay(index * 100)}>
        <Button
          action={action.variant === 'primary' ? 'primary' : action.variant === 'secondary' ? 'secondary' : 'muted'}
          variant={action.variant === 'outline' ? 'outline' : action.variant === 'ghost' ? 'link' : 'solid'}
          size={size}
          onPress={action.onPress}
          isDisabled={action.disabled || action.loading}
          className="min-w-[100px]"
        >
          {action.loading ? (
            <Spinner size="sm" />
          ) : (
            <>
              {action.icon && (
                <Icon as={action.icon} size="sm" className="mr-2" />
              )}
              <ButtonText>{action.label}</ButtonText>
            </>
          )}
        </Button>
      </Animated.View>
    );
  };

  if (layout === 'grid') {
    return (
      <Box className={className}>
        <Box className="flex-row flex-wrap gap-2">
          {actions.map((action, index) => (
            <Box key={action.id} className="flex-1 min-w-[120px] max-w-[200px]">
              {renderAction(action, index)}
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  if (layout === 'vertical') {
    return (
      <VStack space="sm" className={className}>
        {actions.map((action, index) => renderAction(action, index))}
      </VStack>
    );
  }

  // horizontal (default)
  return (
    <HStack space="sm" className={`flex-wrap ${className || ''}`}>
      {actions.map((action, index) => renderAction(action, index))}
    </HStack>
  );
}

