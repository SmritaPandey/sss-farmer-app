import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { Brand } from '@/constants/Colors';
import { Typography, Spacing } from '@/constants/Theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '@/src/config/firebase';
import { signInWithPhoneNumber } from 'firebase/auth';
import { firebaseConfig } from '@/src/config/firebase';
import { USE_MOCK_OTP as STATIC_USE_MOCK_OTP, MOCK_OTP_CODE, MOCK_UID } from '@/constants/Dev';
import { useI18n } from '@/contexts/i18n';
import FormScreen, { FormScreenHandle } from '@/components/FormScreen';
import MainBackgroundImage from '@/components/MainBackgroundImage';
import OnboardingHeader from '@/components/OnboardingHeader';

const hasRealFirebaseConfig = !!firebaseConfig?.apiKey && !/dummy/i.test(String(firebaseConfig.apiKey));

export default function OtpScreen() {
  const { t } = useI18n();
  const formRef = React.useRef<FormScreenHandle>(null);
  const [mobile, setMobile] = React.useState('');
  const [digits, setDigits] = React.useState<string[]>(['', '', '', '', '', '']);
  const inputs = React.useRef<Array<TextInput | null>>([]);
  const [timer, setTimer] = React.useState(0);
  const [sending, setSending] = React.useState(false);
  const [verifying, setVerifying] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);
  // Recaptcha verifier placeholder (expo-firebase-recaptcha removed)
  const recaptchaVerifier = React.useRef<any>(null);

  React.useEffect(() => {
    const id = setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const onChange = (idx: number, v: string) => {
    const val = v.replace(/\D/g, '').slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
    if (val && inputs.current[idx + 1]) inputs.current[idx + 1]?.focus();
  };

  const code = digits.join('');
  const isValid = code.length === 6;
  const phoneOk = /^[6-9]\d{9}$/.test(mobile);

  const [confirmation, setConfirmation] = React.useState<null | ReturnType<typeof signInWithPhoneNumber>>(null);
  const [useMock, setUseMock] = React.useState<boolean>(STATIC_USE_MOCK_OTP);

  React.useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem('use_mock_otp');
        if (v === '0' || v === '1') setUseMock(v === '1');
      } catch {}
    })();
  }, []);

  const sendOtp = async () => {
    setError(null);
    if (!phoneOk || sending) return;
    try {
      setSending(true);
      setDigits(['', '', '', '', '', '']);
  if (useMock) {
        // Mock mode: no Firebase call; just start timer
        setConfirmation({} as any);
      } else {
        // Real OTP flow requires implementing a reCAPTCHA verifier.
        // For now, prevent call and inform the user.
        throw new Error('Phone auth not configured. Enable reCAPTCHA and Firebase to use real OTP.');
      }
      setTimer(60);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to send OTP');
    } finally {
      setSending(false);
    }
  };

  const confirmCode = async () => {
    if (!confirmation || !isValid || verifying) return;
    try {
      setVerifying(true);
  if (useMock) {
        if (code !== MOCK_OTP_CODE) throw new Error('Invalid code');
        await AsyncStorage.multiSet([
          ['auth_uid', MOCK_UID],
          ['verified_phone', mobile],
          ['onboarding_completed', '1'],
        ]);
      } else {
        const cred = await (confirmation as any).confirm(code);
        const uid = cred?.user?.uid as string | undefined;
        if (uid) {
          await AsyncStorage.multiSet([
            ['auth_uid', uid],
            ['verified_phone', mobile],
            ['onboarding_completed', '1'],
          ]);
        }
      }
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e?.message ?? 'Invalid code');
    } finally {
      setVerifying(false);
    }
  };

  const mm = String(Math.floor(timer / 60)).padStart(2, '0');
  const ss = String(timer % 60).padStart(2, '0');

  return (
    <MainBackgroundImage blurIntensity={32} overlayOpacity={0.6}>
      <OnboardingHeader />
  <FormScreen ref={formRef} contentContainerStyle={styles.container}>
  {/* reCAPTCHA modal removed; add an implementation when enabling real phone auth */}
  {/* App logo removed */}
  <Text style={styles.title}>{t('otp_verification')}</Text>

      <View style={styles.field}> 
  <Text style={styles.label}>{t('mobile')} / Mobile</Text>
        <TextInput
          value={mobile}
          onChangeText={setMobile}
          placeholder="9876543210"
          keyboardType="number-pad"
          maxLength={10}
          onFocus={(e) => formRef.current?.scrollToTarget(e.nativeEvent.target)}
          style={[styles.input, !phoneOk && mobile ? { borderColor: '#ef4444' } : null]}
        />
      </View>

  <Pressable onPress={sendOtp} disabled={!phoneOk || sending} style={[styles.cta, (!phoneOk || sending) && styles.ctaDisabled]}>
        <Text style={styles.ctaText}>{sending ? '...' : `${t('send_otp')} / Send OTP`}</Text>
      </Pressable>

  {confirmation && (
        <>
          <Text style={styles.subtle}>कोड भेजा गया है ******{mobile.slice(-4)}</Text>
          <Text style={styles.timer}>{mm}:{ss}</Text>

          <View style={styles.row}>
            {digits.map((d, i) => (
              <TextInput
                key={i}
                ref={(el) => { inputs.current[i] = el; }}
                value={d}
                onChangeText={(v) => onChange(i, v)}
                keyboardType="number-pad"
                maxLength={1}
                onFocus={(e) => { 
                  setFocusedIndex(i);
                  formRef.current?.scrollToTarget(e.nativeEvent.target, 8);
                }}
                onBlur={() => setFocusedIndex(-1)}
                style={[styles.box, focusedIndex === i && styles.boxFocused]}
              />
            ))}
          </View>

          <Pressable onPress={() => (timer === 0 ? sendOtp() : null)}>
            <Text style={[styles.link, timer === 0 ? undefined : { opacity: 0.5 }]}>{t('resend_code')}</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            disabled={!isValid || verifying}
            onPress={confirmCode}
            style={[styles.cta, (!isValid || verifying) && styles.ctaDisabled]}
          >
            <Text style={styles.ctaText}>{verifying ? '...' : t('proceed')}</Text>
          </Pressable>
        </>
      )}

      {error ? <Text style={{ color: '#ef4444', textAlign: 'center', marginTop: 6 }}>{error}</Text> : null}
  {!hasRealFirebaseConfig && !useMock ? (
        <Text style={{ color: '#b45309', textAlign: 'center', marginTop: 6 }}>
          Add valid Firebase config in src/config/firebase.ts to enable OTP.
        </Text>
      ) : null}
  {useMock ? (
        <Text style={{ color: '#047857', textAlign: 'center', marginTop: 6 }}>
          {t('mock_otp_enabled_msg', undefined, { code: String(MOCK_OTP_CODE) })}
        </Text>
      ) : null}
      </FormScreen>
    </MainBackgroundImage>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16, justifyContent: 'center' },
  logo: { width: 72, height: 72, alignSelf: 'center', marginBottom: 8 },
  title: { fontSize: Typography.title, fontWeight: '800', textAlign: 'center' },
  field: { gap: Spacing.fieldGap },
  label: { fontSize: Typography.label },
  input: { 
    borderWidth: 1, 
    borderColor: '#d1d5db', 
    borderRadius: 12, 
    padding: 18, 
    fontSize: Typography.input, 
    backgroundColor: '#fff',
    minHeight: 56
  },
  subtle: { textAlign: 'center', color: '#6b7280' },
  timer: { textAlign: 'center', color: Brand.saffron, fontWeight: '700' },
  row: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginVertical: 8 },
  box: { 
    width: 52, 
    height: 60, 
    borderRadius: 12, 
    borderWidth: 2, 
    borderColor: '#d1d5db', 
    textAlign: 'center', 
    fontSize: 24, 
    fontWeight: '600',
    backgroundColor: '#ffffff',
    color: '#111827'
  },
  boxFocused: {
    borderColor: Brand.saffron,
    shadowColor: Brand.saffron,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2
  },
  link: { color: Brand.saffron, textAlign: 'center', marginTop: 8 },
  cta: { backgroundColor: Brand.saffron, paddingVertical: 18, borderRadius: 12, marginTop: 16 },
  ctaDisabled: { backgroundColor: '#ffcd9f' },
  ctaText: { color: 'white', textAlign: 'center', fontWeight: '800', fontSize: Typography.button },
});
