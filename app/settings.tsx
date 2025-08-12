import React from 'react';
import { View, Text, StyleSheet, Pressable, Switch, ScrollView, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import MainBackgroundImage from '@/components/MainBackgroundImage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useI18n } from '@/contexts/i18n';
import { Brand, Palette } from '@/constants/Colors';
import { Typography, Spacing } from '@/constants/Theme';
import { createPlaceholderIcon, getIcon } from '@/assets/icons';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: any;
  type: 'navigation' | 'toggle' | 'selection';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export default function SettingsScreen() {
  const { lang, setLang, t } = useI18n();
  const [mockOtp, setMockOtp] = React.useState<boolean>(true);
  const [notifications, setNotifications] = React.useState<boolean>(true);
  const [biometric, setBiometric] = React.useState<boolean>(false);

  React.useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem('use_mock_otp');
        if (v === '0' || v === '1') setMockOtp(v === '1');
        
        const notifValue = await AsyncStorage.getItem('notifications_enabled');
        if (notifValue === '0' || notifValue === '1') setNotifications(notifValue === '1');
        
        const bioValue = await AsyncStorage.getItem('biometric_enabled');
        if (bioValue === '0' || bioValue === '1') setBiometric(bioValue === '1');
      } catch {}
    })();
  }, []);

  React.useEffect(() => {
    AsyncStorage.setItem('use_mock_otp', mockOtp ? '1' : '0');
  }, [mockOtp]);

  React.useEffect(() => {
    AsyncStorage.setItem('notifications_enabled', notifications ? '1' : '0');
  }, [notifications]);

  React.useEffect(() => {
    AsyncStorage.setItem('biometric_enabled', biometric ? '1' : '0');
  }, [biometric]);

  const showAbout = () => {
    Alert.alert(
      'About SSS Farmer App',
      'Version 1.0.0\n\nA comprehensive agricultural management application for farmers to access PACS services, government schemes, and agricultural resources.\n\nDeveloped for State Specific Systems.',
      [{ text: 'OK' }]
    );
  };

  const showHelp = () => {
    Alert.alert(
      'Help & Support',
      'For technical support:\n• Contact your local PACS office\n• Visit nearest CSC center\n• Call helpline: 1800-XXX-XXXX\n\nFor app-related queries, contact the development team.',
      [{ text: 'OK' }]
    );
  };

  const settingSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          title: 'My Profile',
          subtitle: 'Manage your personal information',
          icon: getIcon('profile'),
          type: 'navigation' as const,
          onPress: () => router.push('/profile'),
        },
        {
          id: 'privacy',
          title: 'Privacy & Security',
          subtitle: 'Manage your privacy settings',
          icon: createPlaceholderIcon('🔒'),
          type: 'navigation' as const,
          onPress: () => Alert.alert('Privacy Settings', 'Privacy settings will be available in the next update.'),
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          title: 'Push Notifications',
          subtitle: 'Receive alerts and updates',
          icon: createPlaceholderIcon('🔔'),
          type: 'toggle' as const,
          value: notifications,
          onToggle: setNotifications,
        },
        {
          id: 'biometric',
          title: 'Biometric Login',
          subtitle: 'Use fingerprint or face unlock',
          icon: createPlaceholderIcon('👆'),
          type: 'toggle' as const,
          value: biometric,
          onToggle: setBiometric,
        },
        {
          id: 'language',
          title: 'Language',
          subtitle: `Current: ${lang === 'hi' ? 'हिंदी' : 'English'}`,
          icon: createPlaceholderIcon('🌐'),
          type: 'selection' as const,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help & Support',
          subtitle: 'Get help and contact support',
          icon: createPlaceholderIcon('❓'),
          type: 'navigation' as const,
          onPress: showHelp,
        },
        {
          id: 'about',
          title: 'About',
          subtitle: 'App version and information',
          icon: createPlaceholderIcon('ℹ️'),
          type: 'navigation' as const,
          onPress: showAbout,
        },
      ],
    },
  ];

  if (__DEV__) {
    settingSections.push({
      title: 'Developer',
      items: [
        {
          id: 'mock_otp',
          title: 'Mock OTP',
          subtitle: 'Bypass Firebase OTP for testing',
          icon: createPlaceholderIcon('🧪'),
          type: 'toggle' as const,
          value: mockOtp,
          onToggle: setMockOtp,
        },
      ],
    });
  }

  const renderSettingItem = (item: SettingItem) => {
    return (
      <Pressable
        key={item.id}
        style={styles.settingItem}
        onPress={item.onPress}
      >
        <View style={styles.settingIconContainer}>
          <Image source={item.icon} style={styles.settingIcon} />
        </View>
        
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          {item.subtitle && (
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          )}
        </View>

        <View style={styles.settingAction}>
          {item.type === 'toggle' && (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: '#e5e7eb', true: Brand.saffron }}
              thumbColor={item.value ? 'white' : '#f3f4f6'}
            />
          )}
          {item.type === 'navigation' && (
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          )}
          {item.type === 'selection' && item.id === 'language' && (
            <View style={styles.languageSelection}>
              <Pressable
                onPress={() => setLang('hi')}
                style={[styles.languageBtn, lang === 'hi' && styles.languageBtnActive]}
              >
                <Text style={[styles.languageText, lang === 'hi' && styles.languageTextActive]}>
                  हिं
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setLang('en')}
                style={[styles.languageBtn, lang === 'en' && styles.languageBtnActive]}
              >
                <Text style={[styles.languageText, lang === 'en' && styles.languageTextActive]}>
                  EN
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <MainBackgroundImage blurIntensity={30} overlayOpacity={0.4} showWatermark={true}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Brand.green} />
          </Pressable>
          <Text style={styles.title}>{t('settings', 'Settings')}</Text>
          <View style={{ width: 40 }} />
        </View>

        {settingSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, index) => (
                <View key={item.id}>
                  {renderSettingItem(item)}
                  {index < section.items.length - 1 && <View style={styles.separator} />}
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Pressable
            style={styles.signOutBtn}
            onPress={async () => {
              Alert.alert(
                'Sign Out',
                'Are you sure you want to sign out?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                      await AsyncStorage.multiRemove(['auth_uid', 'onboarding_completed']);
                      router.replace('/onboarding/language');
                    },
                  },
                ]
              );
            }}
          >
            <Image source={createPlaceholderIcon('🚪')} style={styles.signOutIcon} />
            <Text style={styles.signOutText}>{t('sign_out', 'Sign Out')}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </MainBackgroundImage>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.screenPadding,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingTop: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontWeight: '800',
    fontSize: Typography.title,
    color: Brand.green,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.green,
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: Palette.leafLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  settingIcon: {
    width: 25,
    height: 25,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Brand.green,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  settingAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginLeft: 76,
  },
  languageSelection: {
    flexDirection: 'row',
    gap: 8,
  },
  languageBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    minWidth: 35,
    alignItems: 'center',
  },
  languageBtnActive: {
    backgroundColor: Brand.saffron,
  },
  languageText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  languageTextActive: {
    color: 'white',
  },
  footer: {
    marginTop: 20,
    marginBottom: 40,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  signOutIcon: {
    width: 24,
    height: 24,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#dc2626',
  },
});
