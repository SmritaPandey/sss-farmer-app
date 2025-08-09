import React from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';

export default function FertilizerRequestScreen() {
  const [qty, setQty] = React.useState(3);
  const items = [
    { key: 'urea', label: 'यूरिया' },
    { key: 'npk', label: 'एनपीके' },
    { key: 'nano-urea', label: 'यूरिया नेनो' },
    { key: 'dap-nano', label: 'डीएपी नेनो' },
    { key: 'sagarika', label: 'सागरिका' },
    { key: 'seeds', label: 'बीज' },
    { key: 'zinc', label: 'जिंक' },
    { key: 'pesticide', label: 'कीटनाशक' },
  ];
  const [selected, setSelected] = React.useState<string[]>(['urea', 'npk']);

  const toggle = (k: string) => {
    setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  };

  const pricePer = 250; // demo
  const total = qty * pricePer;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>वस्तु क्रम</Text>

      <View style={styles.grid}>
        {items.map((it) => (
          <Pressable key={it.key} onPress={() => toggle(it.key)} style={[styles.item, selected.includes(it.key) && styles.itemActive]}>
            <Text style={[styles.itemText, selected.includes(it.key) && styles.itemTextActive]}>{it.label}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.section}>मात्रा दर्ज करें</Text>
      <View style={styles.qtyRow}>
        <Pressable onPress={() => setQty((q) => Math.max(0, q - 1))} style={styles.qtyBtn}><Text style={styles.qtyBtnText}>-</Text></Pressable>
        <TextInput value={String(qty)} onChangeText={(t) => setQty(Number(t) || 0)} keyboardType="number-pad" style={styles.qtyInput} />
        <Pressable onPress={() => setQty((q) => q + 1)} style={styles.qtyBtn}><Text style={styles.qtyBtnText}>+</Text></Pressable>
        <Text style={styles.qtyUnit}>किलो में</Text>
      </View>

      <Text style={styles.total}>कुल राशि: ₹{total}</Text>

      <View style={styles.row}>
        <Pressable style={[styles.cta, { backgroundColor: '#1979e6' }]}><Text style={styles.ctaText}>अनुरोध करें</Text></Pressable>
        <Pressable style={[styles.cta, { backgroundColor: '#0ea5e9' }]}><Text style={styles.ctaText}>कार्ट में जोड़ें</Text></Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  title: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  item: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 18, borderWidth: 1, borderColor: '#cbd5e1' },
  itemActive: { backgroundColor: '#e0e7ff', borderColor: '#1979e6' },
  itemText: { fontSize: 14 },
  itemTextActive: { color: '#1979e6', fontWeight: '700' },
  section: { fontSize: 16, fontWeight: '600', marginTop: 8 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: { width: 36, height: 36, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { fontSize: 18, fontWeight: '700' },
  qtyInput: { width: 60, textAlign: 'center', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, paddingVertical: 8 },
  qtyUnit: { marginLeft: 4 },
  total: { fontSize: 16, fontWeight: '600', marginTop: 8 },
  row: { flexDirection: 'row', gap: 8 },
  cta: { flex: 1, paddingVertical: 12, borderRadius: 10 },
  ctaText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
});
