import { Stack } from 'expo-router';
import React from 'react';
import { useI18n } from '@/contexts/i18n';

export default function OnboardingLayout() {
  const { t } = useI18n();
  return (
    <Stack screenOptions={{ headerTitleAlign: 'center' }}>
      <Stack.Screen name="language" options={{ title: t('choose_language') }} />
  <Stack.Screen name="auth-choice" options={{ title: t('authentication', 'Authentication') }} />
      <Stack.Screen name="consent" options={{ title: t('consent_title', 'Consent') }} />
      <Stack.Screen name="auth" options={{ title: t('authentication', 'Authentication') }} />
      <Stack.Screen name="registration" options={{ title: t('registration', 'Registration') }} />
      <Stack.Screen name="otp" options={{ title: t('otp_verification') }} />
    </Stack>
  );
}
