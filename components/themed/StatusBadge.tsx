import React from 'react'
import { Box, Text } from '@gluestack-ui/themed'
import { ComponentProps } from 'react'

type BoxProps = ComponentProps<typeof Box>

interface StatusBadgeProps extends Omit<BoxProps, 'children'> {
  status:
    | 'connected'
    | 'connecting'
    | 'disconnected'
    | 'error'
    | 'success'
    | 'warning'
    | 'info'
  label?: string
  showDot?: boolean
}

/**
 * StatusBadge - A badge component for displaying status with consistent colors
 *
 * Status types:
 * - connected/success: Green
 * - connecting/info: Blue
 * - error: Red
 * - warning: Orange/Yellow
 * - disconnected: Gray
 */
export function StatusBadge({
  status,
  label,
  showDot = true,
  sx,
  ...props
}: StatusBadgeProps) {
  const statusColorMap = {
    connected: '$success',
    success: '$success',
    connecting: '$info',
    info: '$info',
    error: '$error',
    warning: '$warning',
    disconnected: '$textMutedDark',
  }

  const statusLabelMap = {
    connected: 'Connected',
    connecting: 'Connecting',
    disconnected: 'Disconnected',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Info',
  }

  const color = statusColorMap[status]
  const displayLabel = label || statusLabelMap[status]

  return (
    <Box
      sx={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: '$2',
        ...sx,
      }}
      {...props}
    >
      {showDot && (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: 9999,
            backgroundColor: color,
          }}
        />
      )}
      <Text
        sx={{
          color: color,
          fontSize: 14,
          fontWeight: '$medium',
        }}
      >
        {displayLabel}
      </Text>
    </Box>
  )
}
