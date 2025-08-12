import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { Brand } from '@/constants/Colors';
import { Typography, Spacing } from '@/constants/Theme';
import { useI18n } from '@/contexts/i18n';
import { useToast } from '@/components/Toast';
import WatermarkBackground from '@/components/WatermarkBackground';

const ITEMS = [
  { key: 'urea', labelKey: 'fert_urea' },
  { key: 'cut_mark', labelKey: 'fert_cut_mark' },
  { key: 'npk', labelKey: 'fert_npk' },
  { key: 'urea_nano', labelKey: 'fert_urea_nano' },
  { key: 'dap_nano', labelKey: 'fert_dap_nano' },
  { key: 'sagarika', labelKey: 'fert_sagarika' },
  { key: 'farmion', labelKey: 'fert_farmion' },
  { key: 'beej', labelKey: 'fert_beej' },
  { key: 'zinc', labelKey: 'fert_zinc' },
  { key: 'pesticide', labelKey: 'fert_pesticide' },
  { key: 'to_be_enter', labelKey: 'fert_to_be_enter' },
];

export default function FertilizerScreen() {
  const { t } = useI18n();
  const toast = useToast();
  const [selected, setSelected] = React.useState<Record<string, boolean>>({ urea: true, npk: true, urea_nano: true, cut_mark: true });
  const [qty, setQty] = React.useState(3);
  const [loading, setLoading] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [infoOpen, setInfoOpen] = React.useState(false);

  const toggle = (key: string) => setSelected((s) => ({ ...s, [key]: !s[key] }));

  const unitPrice = 250; // demo
  const total = qty * unitPrice;

  const addToCart = () => {
    toast.show(t('added_to_cart'));
  };

  const submit = async () => {
    setConfirmOpen(false);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.show(t('request_submitted'));
    }, 700);
  };

  return (
    <WatermarkBackground>
      <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t('fertilizer_items', 'Item list')}</Text>

      <Text style={styles.section}>{t('fertilizer_types', 'Fertilizer types')}</Text>
      <View style={styles.grid}>
    {ITEMS.map((it) => (
          <Pressable key={it.key} onPress={() => toggle(it.key)} style={[styles.checkbox, selected[it.key] && styles.checkboxActive]}>
      <Text style={[styles.checkboxLabel, selected[it.key] && styles.checkboxLabelActive]}>{t(it.labelKey as any)}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.section}>{t('enter_quantity', 'Enter quantity')}</Text>
      <View style={styles.qtyRow}>
        <Pressable onPress={() => setQty((q) => Math.max(1, q - 1))} style={styles.stepBtn}><Text style={styles.stepText}>-</Text></Pressable>
        <Text style={styles.qtyText}>{qty}</Text>
        <Pressable onPress={() => setQty((q) => q + 1)} style={styles.stepBtn}><Text style={styles.stepText}>+</Text></Pressable>
        <Pressable onPress={() => setInfoOpen(true)}><Text style={styles.unit}>{t('in_kgs', 'in kg')}</Text></Pressable>
      </View>

      <Text style={styles.total}>{t('total_amount', 'Total')}: <Text style={{ color: Brand.green, fontWeight: '800' }}>₹{total}</Text></Text>

      <Pressable style={[styles.primary, loading && { opacity: 0.7 }]} disabled={loading} onPress={() => setConfirmOpen(true)}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>{t('request')}</Text>}
      </Pressable>
      <Pressable style={styles.secondary} onPress={addToCart}><Text style={styles.secondaryText}>{t('add_to_cart', 'Add to cart')}</Text></Pressable>
      </ScrollView>

      {/* Confirm modal */}
      <Modal transparent animationType="fade" visible={confirmOpen} onRequestClose={() => setConfirmOpen(false)}>
        <View style={styles.modalWrap}>
          <View style={styles.modalCard}>
            <Text style={{ fontWeight: '800', fontSize: Typography.section }}>{t('confirm_request', 'Confirm request?')}</Text>
            <Text style={{ marginTop: 6 }}>{t('total_amount', 'Total')}: ₹{total}</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              <Pressable onPress={() => setConfirmOpen(false)} style={[styles.modalBtn, { borderColor: '#e5e7eb', borderWidth: 1 }]}><Text>{t('cancel', 'Cancel')}</Text></Pressable>
              <Pressable onPress={submit} style={[styles.modalBtn, { backgroundColor: Brand.saffron }]}><Text style={{ color: '#fff', fontWeight: '700' }}>{t('confirm', 'Confirm')}</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Info modal */}
      <Modal transparent animationType="fade" visible={infoOpen} onRequestClose={() => setInfoOpen(false)}>
        <View style={styles.modalWrap}>
          <View style={styles.modalCard}>
            <Text style={{ fontWeight: '800', fontSize: Typography.section }}>{t('quantity_info', 'Quantity info')}</Text>
            <Text style={{ marginTop: 6 }}>{t('qty_help', 'Enter the required quantity in kilograms.')}</Text>
            <View style={{ alignSelf: 'flex-end', marginTop: 12 }}>
              <Pressable onPress={() => setInfoOpen(false)} style={[styles.modalBtn, { backgroundColor: Brand.saffron }]}><Text style={{ color: '#fff', fontWeight: '700' }}>{t('ok', 'OK')}</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </WatermarkBackground>
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
  modalWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  modalBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
});
