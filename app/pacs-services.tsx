import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Brand } from '@/constants/Colors';
import { Typography, Spacing } from '@/constants/Theme';
import { router } from 'expo-router';
import { useI18n } from '@/contexts/i18n';
import { createPlaceholderIcon, getIcon } from '@/assets/icons';

type Option = { key: string; icon: any; onPress?: () => void };

const OPTIONS: Option[] = [
  { key: 'loans', icon: createPlaceholderIcon('💰') },
  { key: 'msp', icon: createPlaceholderIcon('🌾') },
  { key: 'interest_subvention', icon: createPlaceholderIcon('📊') },
  { key: 'janaushadhi', icon: createPlaceholderIcon('💊') },
];

export default function PacsServicesScreen() {
  const { t } = useI18n();
  return (
    <View style={styles.container}>
  <Text style={styles.title}>{t('pacs_services')}</Text>
      <View style={styles.grid}>
        {OPTIONS.map((opt) => (
          <Pressable key={opt.key} style={styles.card} onPress={opt.onPress}>
            <Image 
              source={opt.icon} 
              style={styles.cardIcon} 
            />
            <Text style={styles.cardText}>{t(opt.key as any)}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: Spacing.screenPadding },
  title: { fontWeight: '800', fontSize: Typography.section, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { flexBasis: '47%', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 16, backgroundColor: '#fff', alignItems: 'center' },
  cardIcon: { width: 32, height: 32, marginBottom: 8 },
  cardText: { color: Brand.green, fontWeight: '800', fontSize: Typography.cardTitle, textAlign: 'center' },
});
