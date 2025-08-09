import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Brand } from '@/constants/Colors';
import { Typography, Spacing } from '@/constants/Theme';
import { useI18n } from '@/contexts/i18n';

export default function LanguageScreen() {
  const [selected, setSelected] = React.useState<'hi' | 'en'>('hi');
  const [consent, setConsent] = React.useState(false);
  const { t, setLang } = useI18n();

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
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
        <View style={[styles.checkbox, consent && styles.checkboxActive]} />
        <Text style={styles.checkboxText}>
          मैं शर्तों और गोपनीयता नीति से सहमत हूँ
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        disabled={!consent}
        onPress={async () => {
          await setLang(selected);
          router.push('/onboarding/otp');
        }}
        style={[styles.cta, !consent && styles.ctaDisabled]}
      >
        <Text style={styles.ctaText}>{t('continue')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16, justifyContent: 'center', backgroundColor: '#fff' },
  logo: { width: 72, height: 72, alignSelf: 'center', marginBottom: 8 },
  title: { fontSize: Typography.title, fontWeight: '800', textAlign: 'center' },
  subtitle: { fontSize: Typography.subtitle, color: '#637488', textAlign: 'center' },
  row: { flexDirection: 'row', gap: 12, justifyContent: 'center' },
  pill: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#e5e7eb' },
  pillActive: { backgroundColor: '#FFF4E8', borderColor: Brand.saffron },
  pillText: { fontSize: Typography.label },
  pillTextActive: { color: Brand.saffron, fontWeight: '700' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: '#999' },
  checkboxActive: { backgroundColor: Brand.saffron, borderColor: Brand.saffron },
  checkboxText: { flex: 1, fontSize: 13 },
  cta: { backgroundColor: Brand.saffron, paddingVertical: 16, borderRadius: 12, marginTop: 16 },
  ctaDisabled: { backgroundColor: '#ffcd9f' },
  ctaText: { color: 'white', textAlign: 'center', fontWeight: '800', fontSize: Typography.button },
});
