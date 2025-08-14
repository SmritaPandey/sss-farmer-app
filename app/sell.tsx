import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Modal, Image, TextInput } from 'react-native';
import WatermarkBackground from '@/components/WatermarkBackground';
import { useI18n } from '@/contexts/i18n';
import { Brand, Palette } from '@/constants/Colors';
import { Typography, Spacing } from '@/constants/Theme';
import { Calendar, DateData } from 'react-native-calendars';
import { getSlotAvailability, bookSlot } from '@/src/services/slots';
import { useToast } from '@/components/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createOrder, OrderItem } from '@/src/services/orders';
import { Ionicons } from '@expo/vector-icons';
import { getIcon } from '@/assets/icons';
import { Select } from '@/components/Select';
import { getDistricts, getBlocks, getPacsList } from '@/constants/mockData';
import { saveAndShareReceipt } from '@/src/services/receipt';

type Crop = { key: string; name: string; msp: number };
const CROPS: Crop[] = [
  { key: 'paddy', name: 'Paddy', msp: 2300 },
  { key: 'wheat', name: 'Wheat', msp: 2275 },
  { key: 'mustard', name: 'Mustard', msp: 5650 },
  { key: 'gram', name: 'Gram', msp: 5440 },
];

export default function SellScreen() {
  const { t } = useI18n();
  const toast = useToast();
  const [quantities, setQuantities] = React.useState<Record<string, number>>({});
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [slots, setSlots] = React.useState<{ hour: string; remaining: number }[]>([]);
  const [selectedHour, setSelectedHour] = React.useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = React.useState(false);
  const [booking, setBooking] = React.useState(false);
  const [token, setToken] = React.useState<string | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [centerDistrict, setCenterDistrict] = React.useState<string>('');
  const [centerBlock, setCenterBlock] = React.useState<string>('');
  const [centerId, setCenterId] = React.useState<string>('');
  const [createdOrderMeta, setCreatedOrderMeta] = React.useState<{ id: string; token: string } | null>(null);

  // Use decimal-friendly step for +/- controls (0.1 quintal)
  const STEP = 0.1;
  const round1 = (n: number) => Math.round(n * 10) / 10;
  const inc = (k: string) =>
    setQuantities((q) => ({ ...q, [k]: round1((q[k] || 0) + STEP) }));
  const dec = (k: string) =>
    setQuantities((q) => ({ ...q, [k]: Math.max(0, round1((q[k] || 0) - STEP)) }));
  const total = React.useMemo(() => CROPS.reduce((sum, c) => sum + (quantities[c.key] || 0) * c.msp, 0), [quantities]);

  const todayStr = React.useMemo(() => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  }, []);

  const loadSlots = React.useCallback(async (dateStr: string) => {
    try {
      setLoadingSlots(true);
      const a = await getSlotAvailability(dateStr);
      setSlots(a);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  const onSelectDate = async (day: DateData) => {
    const dateStr = day.dateString;
    setSelectedDate(dateStr);
    setSelectedHour(null);
    await loadSlots(dateStr);
  };

  const book = async () => {
    const items: OrderItem[] = CROPS
      .filter((c) => (quantities[c.key] || 0) > 0)
      .map((c) => ({ id: `sell:${c.key}`, name: c.name, quantity: quantities[c.key], price: c.msp } as any));
    if (items.length === 0 || !selectedDate || !selectedHour || !centerId) return;
    try {
      setBooking(true);
      await bookSlot(selectedDate, selectedHour);
      const uid = await AsyncStorage.getItem('farmer_id');
      const created = await createOrder({ userId: uid, kind: 'mixed', items, total, date: selectedDate, hour: selectedHour, centerId, centerName: centerId });
      setToken(created.token);
      setCreatedOrderMeta(created);
    } catch (e: any) {
      toast.show(t('retry', 'Retry'));
    } finally {
      setBooking(false);
    }
  };

  return (
    <WatermarkBackground>
      <ScrollView contentContainerStyle={[styles.container, styles.bottomPad]}>
        <Text style={styles.title}>{t('sell', 'Sell')}</Text>

        <Text style={styles.section}>{t('select', 'Select items')}</Text>
        <View style={{ gap: 12 }}>
          {CROPS.map((c) => (
            <View key={c.key} style={styles.cartItem}>
              <Image source={getIcon('fertilizer')} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{c.name}</Text>
                <Text style={styles.itemPrice}>₹{c.msp} / {t('unit_quintal','quintal')}</Text>
              </View>
              <View style={styles.quantityControls}>
                <Pressable style={styles.quantityBtn} onPress={() => dec(c.key)}>
                  <Ionicons name="remove" size={16} color={Brand.green} />
                </Pressable>
                <TextInput
                  value={quantities[c.key] ? String(quantities[c.key]) : ''}
                  onChangeText={(tx: string) => {
                    // Handle both comma and period as decimal separators
                    let cleaned = tx.replace(/[^0-9.,]/g, ''); // Allow digits, comma, and period
                    cleaned = cleaned.replace(/,/g, '.'); // Convert comma to period
                    cleaned = cleaned.replace(/(\..*)\./, '$1'); // Only allow one decimal point
                    
                    if (cleaned === '') {
                      setQuantities((q) => ({ ...q, [c.key]: 0 }));
                      return;
                    }
                    const n = parseFloat(cleaned);
                    if (!isNaN(n)) {
                      setQuantities((q) => ({ ...q, [c.key]: n }));
                    }
                  }}
                  keyboardType="decimal-pad"
                  style={styles.quantityInput}
                  placeholder="0.0"
                  placeholderTextColor="#9CA3AF"
                />
                <Pressable style={styles.quantityBtn} onPress={() => inc(c.key)}>
                  <Ionicons name="add" size={16} color={Brand.green} />
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.totalLabel}>{t('total', 'Total')}</Text>
          <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
        </View>

        <Pressable disabled={total <= 0} onPress={() => setModalOpen(true)} style={[styles.primary, (total <= 0) && styles.primaryDisabled]}>
          <Text style={styles.primaryText}>{t('book_slot', 'Book slot')}</Text>
        </Pressable>
      </ScrollView>

      {/* Booking Modal */}
      <Modal visible={modalOpen} transparent animationType="fade" onRequestClose={() => setModalOpen(false)}>
        <View style={styles.modalWrap}>
          <View style={styles.modalCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ fontSize: Typography.subtitle, fontWeight: '800', color: Brand.green }}>{t('book_slot', 'Book slot')}</Text>
              <Pressable onPress={() => setModalOpen(false)} style={styles.iconBtn}><Ionicons name="close" size={20} color="#111" /></Pressable>
            </View>

            <Text style={styles.section}>{t('select_date', 'Select date')}</Text>
            <Calendar minDate={todayStr} onDayPress={onSelectDate} markedDates={selectedDate ? { [selectedDate]: { selected: true } } : undefined} />

            <View style={{ marginTop: 12 }}>
              <Text style={styles.section}>{t('select_time_slot', 'Select time slot')}</Text>
              {loadingSlots ? (
                <ActivityIndicator color={Brand.saffron} />
              ) : (
                <View style={styles.slotsWrap}>
                  {slots.map((s) => {
                    const disabled = s.remaining <= 0;
                    const on = selectedHour === s.hour;
                    return (
                      <Pressable key={s.hour} disabled={disabled} onPress={() => setSelectedHour(s.hour)} style={[styles.slotBtn, on && styles.slotBtnOn, disabled && styles.slotBtnDisabled]}>
                        <Text style={[styles.slotText, on && styles.slotTextOn]}>{s.hour}</Text>
                        <Text style={[styles.slotSub, disabled && styles.slotSubSold]}>{t('slots_remaining', 'Remaining: {n}', { n: String(s.remaining) })}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>

            <View style={{ marginTop: 10 }}>
              <Text style={styles.section}>{t('select_center','Select nearest center')}</Text>
              <View style={{ marginTop: 8, gap: 10 }}>
                <Select label={t('district','District')} value={centerDistrict || null} options={getDistricts('en' as any)} onChange={(v) => { setCenterDistrict(v as string); setCenterBlock(''); setCenterId(''); }} placeholder={t('select_district','Select district')} />
                <Select label={t('block','Block')} value={centerBlock || null} options={getBlocks('en' as any, centerDistrict)} onChange={(v) => { setCenterBlock(v as string); setCenterId(''); }} placeholder={t('select_block','Select block')} />
                <Select label={t('center','Center')} value={centerId || null} options={getPacsList('en' as any)} onChange={(v) => setCenterId(v as string)} placeholder={t('select_center','Select center')} />
              </View>
            </View>

            <View style={{ marginTop: 10, paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#eee' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, color: '#666' }}>{t('total', 'Total')}</Text>
                <Text style={{ fontSize: 16, fontWeight: '800', color: Brand.saffron }}>{`₹${total.toFixed(2)}`}</Text>
              </View>
            </View>

            {token ? (
              <View style={{ marginTop: 16 }}>
                <Text style={{ fontSize: Typography.subtitle, fontWeight: '800', color: Brand.green, marginBottom: 6 }}>{t('booking_confirmed', 'Slot booking successful')}</Text>
                <Text style={{ fontSize: 16, marginBottom: 12 }}>{`Token: ${token}`}</Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <Pressable style={[styles.secondaryBtn, { flex: 1 }]} onPress={async () => {
                    if (!createdOrderMeta) return;
                    await saveAndShareReceipt({ id: createdOrderMeta.id, token: createdOrderMeta.token, order: { userId: await AsyncStorage.getItem('farmer_id'), kind: 'mixed', items: CROPS.filter((c) => (quantities[c.key] || 0) > 0).map((c) => ({ id: `sell:${c.key}`, name: c.name, quantity: quantities[c.key], price: c.msp } as any)), total, date: selectedDate || '', hour: selectedHour || '', centerId, centerName: centerId } as any });
                  }}>
                    <Text style={styles.secondaryText}>{t('download_receipt','Download Receipt')}</Text>
                  </Pressable>
                  <Pressable style={[styles.primary, { flex: 1 }]} onPress={() => { setModalOpen(false); setToken(null); setCreatedOrderMeta(null); }}>
                    <Text style={styles.primaryText}>{t('ok','OK')}</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
                <Pressable style={[styles.secondaryBtn]} onPress={() => setModalOpen(false)}>
                  <Text style={styles.secondaryText}>{t('cancel', 'Cancel')}</Text>
                </Pressable>
                <Pressable disabled={!selectedDate || !selectedHour || !centerId || booking} onPress={book} style={[styles.primary, (!selectedDate || !selectedHour || !centerId || booking) && styles.primaryDisabled]}>
                  {booking ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>{t('confirm', 'Confirm')}</Text>}
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </WatermarkBackground>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.screenPadding, gap: 12 },
  bottomPad: { paddingBottom: 120 },
  title: { fontSize: Typography.section, fontWeight: '800', color: Brand.green },
  section: { fontWeight: '800', marginTop: Spacing.sectionTop, fontSize: Typography.section - 2, color: Brand.green },
  // Item card & qty controls (same look as purchase/cart)
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
  quantityInput: { width: 64, height: 30, textAlign: 'center', backgroundColor: 'white', borderRadius: 6, marginHorizontal: 8, paddingVertical: 0, paddingHorizontal: 6, fontSize: 16, fontWeight: '700', color: Brand.green, borderWidth: 1, borderColor: '#e5e7eb' },
  pill: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#fff' },
  pillOn: { backgroundColor: Brand.saffron, borderColor: Brand.saffron },
  pillText: { color: '#111' },
  pillTextOn: { color: '#fff', fontWeight: '700' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { color: '#111' },
  value: { fontWeight: '700', color: Brand.green },
  qtyInput: { minWidth: 80, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, textAlign: 'right' },
  unit: { marginLeft: 8, color: '#6b7280' },
  totalLabel: { fontSize: Typography.subtitle, fontWeight: '700', color: Brand.green },
  totalValue: { fontSize: Typography.subtitle, fontWeight: '800', color: Brand.saffron },
  slotsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  slotBtn: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10, minWidth: 96 },
  slotBtnOn: { backgroundColor: Brand.saffron, borderColor: Brand.saffron },
  slotBtnDisabled: { opacity: 0.45 },
  slotText: { fontWeight: '700', color: '#111' },
  slotTextOn: { color: '#fff' },
  slotSub: { color: '#6b7280', fontSize: Typography.label - 2 },
  slotSubSold: { color: '#b91c1c', fontWeight: '700' },
  primary: { backgroundColor: Brand.saffron, paddingVertical: 16, borderRadius: 12, marginTop: 12, alignItems: 'center' },
  primaryDisabled: { backgroundColor: '#f7c2a1' },
  primaryText: { color: '#fff', fontWeight: '800' },
  // Modal styles
  modalWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  iconBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  secondaryBtn: { flex: 1, borderWidth: 1, borderColor: Brand.saffron, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  secondaryText: { color: Brand.saffron, fontWeight: '800' },
  tokenBox: { marginTop: 16, backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  tokenTitle: { fontWeight: '800', color: Brand.green, marginBottom: 6 },
  tokenText: { fontWeight: '700' },
});
