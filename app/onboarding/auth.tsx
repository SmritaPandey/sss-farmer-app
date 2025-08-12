import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { Brand } from '@/constants/Colors';
import { Typography, Spacing } from '@/constants/Theme';
import { useI18n } from '@/contexts/i18n';
import MainBackgroundImage from '@/components/MainBackgroundImage';

export default function AuthScreen() {
  const { t } = useI18n();
  const [isSignUp, setIsSignUp] = React.useState(true);
  const [phone, setPhone] = React.useState('');
  const [name, setName] = React.useState('');
  
  const isValidPhone = /^\d{10}$/.test(phone);
  const isValidName = name.trim().length >= 2;
  const isValid = isValidPhone && (isSignUp ? isValidName : true);

  const handleAuth = () => {
    if (!isValid) return;
    
    if (isSignUp) {
      // Navigate to registration for new users
      router.push('/onboarding/registration');
    } else {
      // Navigate to OTP for existing users
      router.push('/onboarding/otp');
    }
  };

  return (
    <MainBackgroundImage>
      <View style={styles.container}>
  {/* App logo removed */}
        <Text style={styles.title}>
          {isSignUp ? t('create_account', 'Create Account') : t('sign_in', 'Sign In')}
        </Text>
        <Text style={styles.subtitle}>
          {isSignUp 
            ? t('signup_subtitle', 'Join the farmer community') 
            : t('signin_subtitle', 'Welcome back, farmer')}
        </Text>

        {isSignUp && (
          <View style={styles.field}>
            <Text style={styles.label}>{t('full_name', 'Full Name')}</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={t('enter_name', 'Enter your full name')}
              style={styles.input}
            />
          </View>
        )}

        <View style={styles.field}>
          <Text style={styles.label}>{t('mobile', 'Mobile Number')}</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="9876543210"
            keyboardType="number-pad"
            maxLength={10}
            style={styles.input}
          />
        </View>

        <Pressable
          onPress={handleAuth}
          disabled={!isValid}
          style={[styles.cta, !isValid && styles.ctaDisabled]}
        >
          <Text style={styles.ctaText}>
            {isSignUp ? t('continue', 'Continue') : t('send_otp', 'Send OTP')}
          </Text>
        </Pressable>

        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>
            {isSignUp 
              ? t('already_have_account', 'Already have an account?') 
              : t('dont_have_account', "Don't have an account?")}
          </Text>
          <Pressable onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={styles.switchLink}>
              {isSignUp ? t('sign_in', 'Sign In') : t('sign_up', 'Sign Up')}
            </Text>
          </Pressable>
        </View>
      </View>
    </MainBackgroundImage>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 24, 
    gap: 16, 
    justifyContent: 'center' 
  },
  logo: { 
    width: 72, 
    height: 72, 
    alignSelf: 'center', 
    marginBottom: 8 
  },
  title: { 
    fontSize: Typography.title, 
    fontWeight: '800', 
    textAlign: 'center' 
  },
  subtitle: { 
    fontSize: Typography.subtitle, 
    color: '#637488', 
    textAlign: 'center',
    marginBottom: 16
  },
  field: { 
    gap: 8 
  },
  label: { 
    fontSize: Typography.label, 
    fontWeight: '600' 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#d1d5db', 
    borderRadius: 12, 
    padding: 18, 
    fontSize: Typography.input, 
    backgroundColor: '#fff',
    minHeight: 56
  },
  cta: { 
    backgroundColor: Brand.saffron, 
    paddingVertical: 18, 
    borderRadius: 12, 
    marginTop: 16 
  },
  ctaDisabled: { 
    backgroundColor: '#ffcd9f' 
  },
  ctaText: { 
    color: 'white', 
    textAlign: 'center', 
    fontWeight: '800', 
    fontSize: Typography.button 
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 16
  },
  switchText: {
    fontSize: Typography.label,
    color: '#6b7280'
  },
  switchLink: {
    fontSize: Typography.label,
    color: Brand.saffron,
    fontWeight: '600'
  }
});
