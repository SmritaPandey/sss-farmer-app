import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Brand } from '@/constants/Colors';
import { Typography, Spacing } from '@/constants/Theme';
import { useI18n } from '@/contexts/i18n';
import FormScreen, { FormScreenHandle } from '@/components/FormScreen';
import MainBackgroundImage from '@/components/MainBackgroundImage';

export default function FarmerIdScreen() {
  const { t } = useI18n();
  const [fid, setFid] = React.useState('');
  const isValid = /^\d{16}$/.test(fid);
  const formRef = React.useRef<FormScreenHandle>(null);

  return (
    <MainBackgroundImage>
      <FormScreen ref={formRef} contentContainerStyle={styles.container}>
  {/* App logo removed */}
  <Text style={styles.title}>{t('enter_farmer_id', 'Enter your 16-digit Farmer ID')}</Text>

  <TextInput
        value={fid}
        onChangeText={setFid}
        placeholder="1234567890123456"
    placeholderTextColor="#9CA3AF"
        keyboardType="number-pad"
        maxLength={16}
  style={styles.input}
  onFocus={(e) => formRef.current?.scrollToTarget(e.nativeEvent.target)}
      />
      {!isValid && fid.length > 0 ? (
        <Text style={{ fontSize: 12, color: '#ef4444', textAlign: 'center' }}>{t('err_farmer_id')}</Text>
      ) : null}

      <Pressable
        accessibilityRole="button"
        disabled={!isValid}
        onPress={async () => {
          await AsyncStorage.setItem('farmer_id', fid);
          router.push('/onboarding/registration');
        }}
        style={[styles.cta, !isValid && styles.ctaDisabled]}
      >
  <Text style={styles.ctaText}>{t('proceed')}</Text>
      </Pressable>
      </FormScreen>
    </MainBackgroundImage>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16, justifyContent: 'center' },
  logo: { width: 72, height: 72, alignSelf: 'center', marginBottom: 8 },
  title: { fontSize: Typography.section, fontWeight: '800', textAlign: 'center' },
  input: { 
    fontSize: Typography.input, 
    borderWidth: 1, 
    borderColor: '#d1d5db', 
    borderRadius: 12, 
    padding: 18, 
    textAlign: 'center',
    backgroundColor: '#fff',
    minHeight: 56
  },
  cta: { backgroundColor: Brand.saffron, paddingVertical: 18, borderRadius: 12, marginTop: 16 },
  ctaDisabled: { backgroundColor: Brand.saffronDisabledSolid },
  ctaText: { color: 'white', textAlign: 'center', fontWeight: '800', fontSize: Typography.button },
});
