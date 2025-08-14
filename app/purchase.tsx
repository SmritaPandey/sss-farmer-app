import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator, Image, TextInput } from 'react-native';
import { Brand, Palette } from '@/constants/Colors';
import { Typography, Spacing } from '@/constants/Theme';
import { useI18n } from '@/contexts/i18n';
import { useToast } from '@/components/Toast';
import WatermarkBackground from '@/components/WatermarkBackground';
import { getIcon } from '@/assets/icons';
import { addOrUpdateItems } from '@/src/store/cart';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// Booking happens from Cart now
import AsyncStorage from '@react-native-async-storage/async-storage';

type Prod = { key: string; labelKey: string; price: number; img?: any };

const FERTS: Prod[] = [
  { key: 'urea', labelKey: 'fert_urea', price: 268, img: getIcon('fertilizer') },
  { key: 'npk', labelKey: 'fert_npk', price: 1450, img: getIcon('fertilizer') },
  { key: 'urea_nano', labelKey: 'fert_urea_nano', price: 240, img: getIcon('fertilizer') },
  { key: 'dap_nano', labelKey: 'fert_dap_nano', price: 480, img: getIcon('fertilizer') },
  { key: 'zinc', labelKey: 'fert_zinc', price: 320, img: getIcon('fertilizer') },
];

const SEEDS: Prod[] = [
  { key: 'seed_wheat', labelKey: 'seed_wheat', price: 550 },
  { key: 'seed_paddy', labelKey: 'seed_paddy', price: 520 },
  { key: 'seed_mustard', labelKey: 'seed_mustard', price: 500 },
  { key: 'seed_gram', labelKey: 'seed_gram', price: 480 },
];

type Kind = 'fert' | 'seed';

export default function PurchaseScreen() {
  const { t } = useI18n();
  const toast = useToast();
  const [kind, setKind] = React.useState<Kind>('fert');
  const [quantities, setQuantities] = React.useState<Record<string, number>>({});
  const [userId, setUserId] = React.useState<string | null>(null);
  const [checkingOut, setCheckingOut] = React.useState(false);
  const list = kind === 'fert' ? FERTS : SEEDS;

  React.useEffect(() => {
    (async () => {
      try {
        const id = await AsyncStorage.getItem('farmer_id');
        if (id) setUserId(id);
      } catch {}
    })();
  }, []);

  const inc = (k: string) => setQuantities((q) => ({ ...q, [k]: (q[k] || 0) + 1 }));
  const dec = (k: string) => setQuantities((q) => ({ ...q, [k]: Math.max(0, (q[k] || 0) - 1) }));
  const total = list.reduce((sum, p) => sum + (quantities[p.key] || 0) * p.price, 0);

  const addToCart = async () => {
    const items = list
      .filter((p) => (quantities[p.key] || 0) > 0)
      .map((p) => ({
        id: `${kind}:${p.key}`,
        name: t(p.labelKey as any),
        type: kind === 'fert' ? t('fertilizers') : t('seeds'),
        quantity: quantities[p.key] || 0,
        price: p.price,
        imageKey: 'fertilizer' as const,
      }));
    if (items.length === 0) { toast.show(t('empty_list', 'Select at least one item')); return; }
    await addOrUpdateItems(items);
    toast.show(t('added_to_cart', 'Added to cart'));
    router.push('/cart');
  };

  const openCheckout = async () => {
    const any = Object.values(quantities).some((n) => n > 0);
    if (!any) { toast.show(t('empty_list', 'Select at least one item')); return; }
    // Booking flow now lives in Cart
    router.push('/cart');
  };

  // Booking removed from Purchase; handled in Cart

  return (
    <WatermarkBackground>
      <ScrollView contentContainerStyle={[styles.container, styles.bottomPad]}>
        <Text style={styles.title}>{t('purchase', 'Purchase')}</Text>

        <Text style={styles.section}>{t('select_product_type', 'Select product type')}</Text>
        <View style={styles.radioRow}>
          <Pressable accessibilityRole="radio" accessibilityState={{ checked: kind === 'fert' }} onPress={() => setKind('fert')} style={[styles.radio, kind === 'fert' && styles.radioOn]}>
            <Text style={[styles.radioLabel, kind === 'fert' && styles.radioLabelOn]}>{t('fertilizers')}</Text>
          </Pressable>
          <Pressable accessibilityRole="radio" accessibilityState={{ checked: kind === 'seed' }} onPress={() => setKind('seed')} style={[styles.radio, kind === 'seed' && styles.radioOn]}>
            <Text style={[styles.radioLabel, kind === 'seed' && styles.radioLabelOn]}>{t('seeds')}</Text>
          </Pressable>
        </View>

        <Text style={styles.section}>{t('select', 'Select items')}</Text>
        <View style={{ gap: 12 }}>
          {list.map((p) => (
            <View key={p.key} style={styles.cartItem}>
              <Image source={p.img || getIcon('fertilizer')} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{t(p.labelKey as any)}</Text>
                <Text style={styles.itemPrice}>₹{p.price}</Text>
              </View>
              <View style={styles.quantityControls}>
                <Pressable style={styles.quantityBtn} onPress={() => dec(p.key)}>
                  <Ionicons name="remove" size={16} color={Brand.green} />
                </Pressable>
                <TextInput
                  value={String(quantities[p.key] ?? 0)}
                  onChangeText={(tx) => {
                    const cleaned = tx.replace(/[^0-9]/g, '');
                    const n = cleaned === '' ? 0 : Math.max(0, parseInt(cleaned, 10) || 0);
                    setQuantities((q) => ({ ...q, [p.key]: n }));
                  }}
                  keyboardType="number-pad"
                  style={styles.quantityInput}
                  placeholder="0"
                />
                <Pressable style={styles.quantityBtn} onPress={() => inc(p.key)}>
                  <Ionicons name="add" size={16} color={Brand.green} />
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t('total', 'Total')}</Text>
          <Text style={styles.summaryValue}>₹{total}</Text>
        </View>

        <Pressable style={styles.secondaryOutline} onPress={addToCart}>
          <Text style={styles.secondaryOutlineText}>{t('add_to_cart', 'Add to Cart')}</Text>
        </Pressable>
        <Pressable style={[styles.primary, checkingOut && styles.primaryDisabled]} disabled={checkingOut} onPress={openCheckout}>
          {checkingOut ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>{t('checkout')}</Text>}
        </Pressable>
      </ScrollView>


    </WatermarkBackground>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.screenPadding, gap: 14 },
  bottomPad: { paddingBottom: 120 },
  title: { fontSize: Typography.section, fontWeight: '800', color: Brand.green },
  section: { fontWeight: '800', marginTop: Spacing.sectionTop, fontSize: Typography.section - 2, color: Brand.green },
  sectionSmall: { fontWeight: '700', marginTop: 6 },
  radioRow: { flexDirection: 'row', gap: 10 },
  radio: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: 'white' },
  radioOn: { backgroundColor: Brand.saffron, borderColor: Brand.saffron },
  radioLabel: { color: '#111' },
  radioLabelOn: { color: '#fff', fontWeight: '700' },

  cartItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  itemImage: { width: 60, height: 60, borderRadius: 8, backgroundColor: Palette.leafLight },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '700', color: Brand.green },
  itemPrice: { fontSize: 16, fontWeight: '700', color: Brand.saffron, marginTop: 2 },

  quantityControls: { flexDirection: 'row', alignItems: 'center', backgroundColor: Palette.leafLight, borderRadius: 8, padding: 4 },
  quantityBtn: { width: 30, height: 30, borderRadius: 6, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' },
  quantityText: { marginHorizontal: 15, fontSize: 16, fontWeight: '700', color: Brand.green },
  quantityInput: { width: 48, height: 30, textAlign: 'center', backgroundColor: 'white', borderRadius: 6, marginHorizontal: 8, paddingVertical: 0, paddingHorizontal: 6, fontSize: 16, fontWeight: '700', color: Brand.green, borderWidth: 1, borderColor: '#e5e7eb' },

  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, marginTop: 12 },
  summaryLabel: { fontSize: Typography.subtitle, fontWeight: '700', color: Brand.green },
  summaryValue: { fontSize: Typography.subtitle, fontWeight: '800', color: Brand.saffron },

  primary: { backgroundColor: Brand.saffron, paddingVertical: 16, borderRadius: 12, marginTop: 12 },
  primaryDisabled: { backgroundColor: Brand.saffronDisabledSolid },
  primaryText: { color: '#fff', textAlign: 'center', fontWeight: '800', fontSize: Typography.button },
  secondaryOutline: { borderWidth: 1, borderColor: Brand.saffron, paddingVertical: 14, borderRadius: 12, marginTop: 12, alignItems: 'center' },
  secondaryOutlineText: { color: Brand.saffron, fontWeight: '800' },

  modalWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  modalBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  miniBtn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
  slotsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  slotBtn: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10, minWidth: 96 },
  slotBtnOn: { backgroundColor: Brand.saffron, borderColor: Brand.saffron },
  slotBtnDisabled: { opacity: 0.45 },
  slotText: { fontWeight: '700', color: '#111' },
  slotTextOn: { color: '#fff' },
  slotSub: { color: '#6b7280', fontSize: Typography.label - 2 },
  slotSubSold: { color: '#b91c1c', fontWeight: '700' },
});
