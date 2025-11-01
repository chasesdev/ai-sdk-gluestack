import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
  Icon,
  SunIcon,
  MoonIcon,
  SettingsIcon,
} from '@gluestack-ui/themed';
import { useTheme, ThemeMode } from '../contexts/ThemeContext';
import { THEME_COLORS } from '../constants/theme';

const ACCENT_COLOR = THEME_COLORS.light.accent;

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [showActionsheet, setShowActionsheet] = useState(false);

  const handleClose = () => setShowActionsheet(false);

  const selectTheme = (selectedTheme: ThemeMode) => {
    setTheme(selectedTheme);
    handleClose();
  };

  const getCurrentIcon = () => {
    switch (theme) {
      case 'light':
        return SunIcon;
      case 'dark':
        return MoonIcon;
      case 'system':
        return SettingsIcon;
    }
  };

  const CurrentIcon = getCurrentIcon();

  return (
    <>
      {/* Floating Action Button */}
      <Pressable
        onPress={() => setShowActionsheet(true)}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full shadow-lg items-center justify-center z-50"
        style={{
          backgroundColor: ACCENT_COLOR,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
          elevation: 8,
        }}
      >
        <Icon as={CurrentIcon} size="xl" className="text-white" />
      </Pressable>

      {/* Theme Selection Actionsheet */}
      <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent className="bg-background">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>

          <View className="w-full px-4 py-2">
            <ActionsheetItem onPress={() => selectTheme('light')}>
              <Icon as={SunIcon} size="lg" className="mr-3 text-foreground" />
              <ActionsheetItemText className="text-foreground">
                Light
              </ActionsheetItemText>
              {theme === 'light' && (
                <View className="ml-auto w-2 h-2 rounded-full" style={{ backgroundColor: ACCENT_COLOR }} />
              )}
            </ActionsheetItem>

            <ActionsheetItem onPress={() => selectTheme('dark')}>
              <Icon as={MoonIcon} size="lg" className="mr-3 text-foreground" />
              <ActionsheetItemText className="text-foreground">
                Dark
              </ActionsheetItemText>
              {theme === 'dark' && (
                <View className="ml-auto w-2 h-2 rounded-full" style={{ backgroundColor: ACCENT_COLOR }} />
              )}
            </ActionsheetItem>

            <ActionsheetItem onPress={() => selectTheme('system')}>
              <Icon as={SettingsIcon} size="lg" className="mr-3 text-foreground" />
              <ActionsheetItemText className="text-foreground">
                System
              </ActionsheetItemText>
              {theme === 'system' && (
                <View className="ml-auto w-2 h-2 rounded-full" style={{ backgroundColor: ACCENT_COLOR }} />
              )}
            </ActionsheetItem>
          </View>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
}
