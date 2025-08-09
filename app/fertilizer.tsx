import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Brand } from '@/constants/Colors';
import { Typography, Spacing } from '@/constants/Theme';

const ITEMS = [
  { key: 'urea', label: 'यूरिया' },
  { key: 'cut_mark', label: 'काटने का निशान' },
  { key: 'npk', label: 'एनपीके' },
  { key: 'urea_nano', label: 'यूरिया नेनो' },
  { key: 'dap_nano', label: 'डीएपी नेनो' },
  { key: 'sagarika', label: 'सागरिका' },
  { key: 'farmion', label: 'फार्मियन' },
  { key: 'beej', label: 'बीज' },
  { key: 'zinc', label: 'जिंक' },
  { key: 'pesticide', label: 'कीटनाशक' },
  { key: 'to_be_enter', label: 'To be enter' },
];

export default function FertilizerScreen() {
  const [selected, setSelected] = React.useState<Record<string, boolean>>({ urea: true, npk: true, urea_nano: true, cut_mark: true });
  const [qty, setQty] = React.useState(3);

  const toggle = (key: string) => setSelected((s) => ({ ...s, [key]: !s[key] }));

  const unitPrice = 250; // demo
  const total = qty * unitPrice;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>वस्तु क्रम</Text>

      <Text style={styles.section}>वस्तु प्रकार</Text>
      <View style={styles.grid}>
        {ITEMS.map((it) => (
          <Pressable key={it.key} onPress={() => toggle(it.key)} style={[styles.checkbox, selected[it.key] && styles.checkboxActive]}>
            <Text style={[styles.checkboxLabel, selected[it.key] && styles.checkboxLabelActive]}>{it.label}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.section}>मात्रा दर्ज करें</Text>
      <View style={styles.qtyRow}>
        <Pressable onPress={() => setQty((q) => Math.max(1, q - 1))} style={styles.stepBtn}><Text style={styles.stepText}>-</Text></Pressable>
        <Text style={styles.qtyText}>{qty}</Text>
        <Pressable onPress={() => setQty((q) => q + 1)} style={styles.stepBtn}><Text style={styles.stepText}>+</Text></Pressable>
        <Text style={styles.unit}>किलो में</Text>
      </View>

      <Text style={styles.total}>कुल राशि: <Text style={{ color: Brand.green, fontWeight: '800' }}>₹{total}</Text></Text>

      <Pressable style={styles.primary}><Text style={styles.primaryText}>अनुरोध करें</Text></Pressable>
      <Pressable style={styles.secondary}><Text style={styles.secondaryText}>कार्ट में जोड़ें</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.screenPadding, gap: 12, backgroundColor: '#fff' },
  title: { fontSize: Typography.section, fontWeight: '800' },
  section: { fontWeight: '800', marginTop: Spacing.sectionTop, fontSize: Typography.section - 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  checkbox: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12 },
  checkboxActive: { borderColor: Brand.saffron, backgroundColor: '#FFF4E8' },
  checkboxLabel: { fontSize: Typography.label - 2, color: '#111' },
  checkboxLabelActive: { color: Brand.saffron, fontWeight: '700' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepBtn: { width: 36, height: 36, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' },
  stepText: { fontSize: 18, fontWeight: '700' },
  qtyText: { minWidth: 32, textAlign: 'center', fontSize: Typography.input },
  unit: { marginLeft: 8, color: '#6b7280' },
  total: { marginTop: 8, fontSize: Typography.input },
  primary: { backgroundColor: Brand.saffron, paddingVertical: 16, borderRadius: 12, marginTop: 16 },
  primaryText: { color: '#fff', textAlign: 'center', fontWeight: '800', fontSize: Typography.button },
  secondary: { borderWidth: 1, borderColor: Brand.saffron, paddingVertical: 14, borderRadius: 12, marginTop: 10 },
  secondaryText: { color: Brand.saffron, textAlign: 'center', fontWeight: '800', fontSize: Typography.button - 1 },
});
