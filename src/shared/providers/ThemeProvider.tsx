import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useColorScheme, vars } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import { darkThemeVars, lightThemeVars } from '@/shared/theme';

const tailwindDarkThemeVars = vars(darkThemeVars);
const tailwindLightThemeVars = vars(lightThemeVars);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { colorScheme } = useColorScheme();
  const themeVars = useMemo(() => {
    return colorScheme === 'dark' ? tailwindDarkThemeVars : tailwindLightThemeVars;
  }, [colorScheme]);

  return (
    <View style={[{ flex: 1 }, themeVars]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      {children}
    </View>
  );
};
