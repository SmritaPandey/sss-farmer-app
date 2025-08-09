import { Stack } from 'expo-router';
import React from 'react';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerTitleAlign: 'center' }}>
      <Stack.Screen name="language" options={{ title: 'भाषा चुने' }} />
      <Stack.Screen name="otp" options={{ title: 'ओटीपी सत्यापन' }} />
      <Stack.Screen name="consent" options={{ title: 'सहमति' }} />
      <Stack.Screen name="farmer-id" options={{ title: 'Farmer ID' }} />
      <Stack.Screen name="registration" options={{ title: 'पंजीकरण' }} />
    </Stack>
  );
}
