import React from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { useI18n, Lang } from '@/contexts/i18n';
import { Brand } from '@/constants/Colors';

export default function LanguageToggle({ style }: { style?: ViewStyle }) {
  const { lang, setLang } = useI18n();
  const set = (l: Lang) => { if (l !== lang) setLang(l); };
  return (
    <View style={[styles.wrap, style]}>
      <Pressable onPress={() => set('hi')} style={[styles.pill, lang === 'hi' && styles.pillActive]}>
        <Text style={[styles.pillText, lang === 'hi' && styles.pillTextActive]}>हिंदी</Text>
      </Pressable>
      <Pressable onPress={() => set('en')} style={[styles.pill, lang === 'en' && styles.pillActive]}>
        <Text style={[styles.pillText, lang === 'en' && styles.pillTextActive]}>English</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 999,
    padding: 4,
    gap: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  borderRadius: 999,
  backgroundColor: '#ffffff',
  },
  pillActive: {
    backgroundColor: Brand.saffron,
  },
  pillText: { fontSize: 12 },
  pillTextActive: { color: 'white', fontWeight: '700' },
});
