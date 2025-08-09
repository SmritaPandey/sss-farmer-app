import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Brand } from '@/constants/Colors';
import { Typography, Spacing } from '@/constants/Theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { auth } from '@/src/config/firebase';
import { signInWithPhoneNumber } from 'firebase/auth';
import { firebaseConfig } from '@/src/config/firebase';

const hasRealFirebaseConfig = !!firebaseConfig?.apiKey && !/dummy/i.test(String(firebaseConfig.apiKey));

export default function OtpScreen() {
  const [mobile, setMobile] = React.useState('');
  const [digits, setDigits] = React.useState<string[]>(['', '', '', '', '', '']);
  const inputs = React.useRef<Array<TextInput | null>>([]);
  const [timer, setTimer] = React.useState(0);
  const [sending, setSending] = React.useState(false);
  const [verifying, setVerifying] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const recaptchaVerifier = React.useRef<FirebaseRecaptchaVerifierModal | null>(null);

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

  const sendOtp = async () => {
    setError(null);
    if (!phoneOk || sending) return;
    try {
      setSending(true);
      setDigits(['', '', '', '', '', '']);
      // @ts-ignore recaptchaVerifier type provided by expo-firebase-recaptcha
      const conf = await signInWithPhoneNumber(auth, `+91${mobile}`, recaptchaVerifier.current);
      setConfirmation(conf as any);
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
      const cred = await (confirmation as any).confirm(code);
      const uid = cred?.user?.uid as string | undefined;
      if (uid) {
        await AsyncStorage.multiSet([
          ['auth_uid', uid],
          ['verified_phone', mobile],
        ]);
      }
      router.push('/onboarding/consent');
    } catch (e: any) {
      setError(e?.message ?? 'Invalid code');
    } finally {
      setVerifying(false);
    }
  };

  const mm = String(Math.floor(timer / 60)).padStart(2, '0');
  const ss = String(timer % 60).padStart(2, '0');

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={styles.container}>
      {hasRealFirebaseConfig ? (
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseConfig as any}
          attemptInvisibleVerification
        />
      ) : null}
      <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
      <Text style={styles.title}>ओटीपी सत्यापन</Text>

      <View style={styles.field}> 
        <Text style={styles.label}>मोबाइल नंबर / Mobile</Text>
        <TextInput
          value={mobile}
          onChangeText={setMobile}
          placeholder="9876543210"
          keyboardType="number-pad"
          maxLength={10}
          style={[styles.input, !phoneOk && mobile ? { borderColor: '#ef4444' } : null]}
        />
      </View>

  <Pressable onPress={sendOtp} disabled={!phoneOk || sending} style={[styles.cta, (!phoneOk || sending) && styles.ctaDisabled]}>
        <Text style={styles.ctaText}>{sending ? '...' : 'ओटीपी भेजें / Send OTP'}</Text>
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
                style={styles.box}
              />
            ))}
          </View>

          <Pressable onPress={() => (timer === 0 ? sendOtp() : null)}>
            <Text style={[styles.link, timer === 0 ? undefined : { opacity: 0.5 }]}>पुनः कोड भेजें</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            disabled={!isValid || verifying}
            onPress={confirmCode}
            style={[styles.cta, (!isValid || verifying) && styles.ctaDisabled]}
          >
            <Text style={styles.ctaText}>{verifying ? '...' : 'जारी करें'}</Text>
          </Pressable>
        </>
      )}

      {error ? <Text style={{ color: '#ef4444', textAlign: 'center', marginTop: 6 }}>{error}</Text> : null}
      {!hasRealFirebaseConfig ? (
        <Text style={{ color: '#b45309', textAlign: 'center', marginTop: 6 }}>
          Add valid Firebase config in src/config/firebase.ts to enable OTP.
        </Text>
      ) : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16, justifyContent: 'center', backgroundColor: '#fff' },
  logo: { width: 72, height: 72, alignSelf: 'center', marginBottom: 8 },
  title: { fontSize: Typography.title, fontWeight: '800', textAlign: 'center' },
  field: { gap: Spacing.fieldGap },
  label: { fontSize: Typography.label },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 14, fontSize: Typography.input, backgroundColor: '#fff' },
  subtle: { textAlign: 'center', color: '#6b7280' },
  timer: { textAlign: 'center', color: Brand.saffron, fontWeight: '700' },
  row: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginVertical: 8 },
  box: { width: 48, height: 56, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', textAlign: 'center', fontSize: 22 },
  link: { color: Brand.saffron, textAlign: 'center', marginTop: 8 },
  cta: { backgroundColor: Brand.saffron, paddingVertical: 16, borderRadius: 12, marginTop: 16 },
  ctaDisabled: { backgroundColor: '#ffcd9f' },
  ctaText: { color: 'white', textAlign: 'center', fontWeight: '800', fontSize: Typography.button },
});
