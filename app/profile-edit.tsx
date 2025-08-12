import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import WatermarkBackground from '@/components/WatermarkBackground';
import { useI18n } from '@/contexts/i18n';

export default function ProfileEditScreen() {
  const { t } = useI18n();
  return (
    <WatermarkBackground>
      <View style={styles.container}>
        <Text style={styles.title}>{t('profile_edit')}</Text>
        <Text>{t('empty_list')}</Text>
      </View>
    </WatermarkBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 8 },
  title: { fontWeight: '800', fontSize: 18 },
});
