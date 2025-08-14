import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { TextInput } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { I18nProvider } from '@/contexts/i18n';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from '@/components/Toast';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  // Ensure a consistent grey placeholder across the app (safety net)
  if ((TextInput as any).defaultProps == null) (TextInput as any).defaultProps = {};
  (TextInput as any).defaultProps.placeholderTextColor = '#9CA3AF';

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
  <SafeAreaProvider>
  <I18nProvider>
  <ToastProvider>
      <Stack>
  {/* Onboarding flow stack */}
  <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
  <StatusBar style="auto" />
  </ToastProvider>
  </I18nProvider>
  </SafeAreaProvider>
    </ThemeProvider>
  );
}
