import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Brand } from '@/constants/Colors';
import { Typography, Spacing } from '@/constants/Theme';
import { useI18n } from '@/contexts/i18n';
import MainBackgroundImage from '@/components/MainBackgroundImage';
import OnboardingHeader from '@/components/OnboardingHeader';

export default function LanguageScreen() {
  const [selected, setSelected] = React.useState<'hi' | 'en'>('hi');
  const [consent, setConsent] = React.useState(false);
  const { t, setLang } = useI18n();

  return (
    <MainBackgroundImage blurIntensity={32} overlayOpacity={0.6} showWatermark={true}>
      <OnboardingHeader />
      <View style={styles.container}>
  {/* App logo removed */}
    <Text style={styles.title}>{t('choose_language')}</Text>
    <Text style={styles.subtitle}>{t('pick_preferred_language')}</Text>

        <View style={styles.row}>
          {(['hi', 'en'] as const).map((v) => (
            <Pressable
              key={v}
              onPress={async () => { setSelected(v); await setLang(v); }}
              style={[styles.pill, selected === v && styles.pillActive]}
            >
              <Text style={[styles.pillText, selected === v && styles.pillTextActive]}>
                {v === 'hi' ? 'हिंदी' : 'English'}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable onPress={() => setConsent((c) => !c)} style={styles.checkboxRow}>
          <View style={[styles.checkbox, consent && styles.checkboxActive]}>
            {consent ? <Text style={styles.tick}>✓</Text> : null}
          </View>
          <Text style={styles.checkboxText}>{t('consent_text')}</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          disabled={!consent}
          onPress={async () => {
            await setLang(selected);
            router.push('/onboarding/auth-choice');
          }}
          style={[styles.cta, !consent && styles.ctaDisabled]}
        >
          <Text style={styles.ctaText}>{t('continue')}</Text>
        </Pressable>
      </View>
    </MainBackgroundImage>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16, justifyContent: 'center' },
  logo: { width: 72, height: 72, alignSelf: 'center', marginBottom: 8 },
  title: { fontSize: Typography.title, fontWeight: '800', textAlign: 'center' },
  subtitle: { fontSize: Typography.subtitle, color: '#637488', textAlign: 'center' },
  row: { flexDirection: 'row', gap: 12, justifyContent: 'center' },
  pill: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#ffffff' },
  pillActive: { backgroundColor: Brand.saffron, borderColor: Brand.saffron },
  pillText: { fontSize: Typography.label },
  pillTextActive: { color: '#ffffff', fontWeight: '700' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: Brand.saffron, backgroundColor: '#ffffff' },
  checkboxActive: { borderColor: Brand.saffron, backgroundColor: '#ffffff' },
  tick: { color: Brand.saffron, fontWeight: '800', textAlign: 'center', lineHeight: 18 },
  checkboxText: { flex: 1, fontSize: 13 },
  cta: { backgroundColor: Brand.saffron, paddingVertical: 18, borderRadius: 12, marginTop: 16 },
  ctaDisabled: { backgroundColor: Brand.saffronDisabledSolid },
  ctaText: { color: 'white', textAlign: 'center', fontWeight: '800', fontSize: Typography.button },
});
