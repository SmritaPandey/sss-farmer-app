import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { Brand } from '@/constants/Colors';
import { Typography } from '@/constants/Theme';
import { useI18n } from '@/contexts/i18n';
import MainBackgroundImage from '@/components/MainBackgroundImage';
import OnboardingHeader from '@/components/OnboardingHeader';
import { router } from 'expo-router';
// router already imported above

export default function AuthChoiceScreen() {
  const { t } = useI18n();
  return (
    <MainBackgroundImage blurIntensity={32} overlayOpacity={0.6}>
      <OnboardingHeader />
      <View style={styles.container}>
  {/* Language is selected globally in onboarding/language; no local control here */}
  {/* App logo removed */}
  <Text style={styles.title}>{t('auth_choice_prompt', 'यदि आप सदस्य हैं तो लॉगिन चुनें, अन्यथा पंजीकरण चुनें')}</Text>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/onboarding/otp')}
          style={[styles.cta, styles.login]}
        >
          <Text style={styles.ctaText}>{t('login', 'लॉगिन')}</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/onboarding/registration')}
          style={[styles.cta, styles.register]}
        >
          <Text style={styles.ctaText}>{t('register', 'पंजीकरण')}</Text>
        </Pressable>
      </View>
    </MainBackgroundImage>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16, justifyContent: 'center' },
  logo: { width: 72, height: 72, alignSelf: 'center', marginBottom: 8 },
  title: { fontSize: Typography.title, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  cta: { paddingVertical: 18, borderRadius: 12 },
  login: { backgroundColor: Brand.saffron },
  register: { backgroundColor: Brand.green },
  ctaText: { color: 'white', textAlign: 'center', fontWeight: '800', fontSize: Typography.button },
});
