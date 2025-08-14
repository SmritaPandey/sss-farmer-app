import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { Brand } from '@/constants/Colors';
import { Typography, Spacing } from '@/constants/Theme';
import { useI18n } from '@/contexts/i18n';
import MainBackgroundImage from '@/components/MainBackgroundImage';

export default function ConsentScreen() {
  const { t } = useI18n();
  const [agree, setAgree] = React.useState(false);
  return (
    <MainBackgroundImage blurIntensity={25} overlayOpacity={0.3} showWatermark={true}>
      <View style={styles.container}>
  {/* App logo removed */}
        <Text style={styles.title}>{t('consent_title', 'Consent')}</Text>
        <Text style={styles.subtitle}>{t('consent_text', 'I agree to Terms and Privacy Policy and consent to data processing as per policy.')}</Text>

        <Pressable onPress={() => setAgree((a) => !a)} style={styles.checkboxRow}>
          <View style={[styles.checkbox, agree && styles.checkboxActive]}>
            {agree ? <Text style={styles.tick}>✓</Text> : null}
          </View>
          <Text style={styles.checkboxText}>{t('i_agree', 'I agree')}</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          disabled={!agree}
          onPress={() => router.push('/onboarding/auth')}
          style={[styles.cta, !agree && styles.ctaDisabled]}
        >
          <Text style={styles.ctaText}>{t('proceed')}</Text>
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
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: Brand.saffron, backgroundColor: '#ffffff' },
  checkboxActive: { borderColor: Brand.saffron, backgroundColor: '#ffffff' },
  tick: { color: Brand.saffron, fontWeight: '800', textAlign: 'center', lineHeight: 18 },
  checkboxText: { flex: 1, fontSize: 13 },
  cta: { backgroundColor: Brand.saffron, paddingVertical: 18, borderRadius: 12, marginTop: 16 },
  ctaDisabled: { backgroundColor: Brand.saffronDisabledSolid },
  ctaText: { color: 'white', textAlign: 'center', fontWeight: '800', fontSize: Typography.button },
});
