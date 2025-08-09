import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Brand } from '@/constants/Colors';
import { Typography, Spacing } from '@/constants/Theme';
import { router } from 'expo-router';

type Option = { label: string; onPress?: () => void };

const OPTIONS: Option[] = [
  { label: 'केसीसी ऋण – अनुरोध', onPress: () => router.push('/loan-request') },
  { label: 'एमएसपी – समर्थन मूल्य' },
  { label: 'ब्याज छूट' },
  { label: 'जन औषधि केंद्र' },
];

export default function PacsServicesScreen() {
  return (
    <View style={styles.container}>
  <Text style={styles.title}>पैक्स सेवाओं का चयन करें</Text>
      <View style={styles.grid}>
        {OPTIONS.map((opt) => (
          <Pressable key={opt.label} style={styles.card} onPress={opt.onPress}>
            <Text style={styles.cardText}>{opt.label}</Text>
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
  card: { flexBasis: '47%', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 16, backgroundColor: '#fff' },
  cardText: { color: Brand.green, fontWeight: '800', fontSize: Typography.cardTitle },
});
