import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import MainBackgroundImage from '@/components/MainBackgroundImage';
import { Brand, Palette } from '@/constants/Colors';
import { Typography, Spacing } from '@/constants/Theme';
import { useI18n } from '@/contexts/i18n';
import { createPlaceholderIcon, getIcon, AgricultureIcons } from '@/assets/icons';
import { getCart, updateQuantity as storeUpdateQty, clearCart } from '@/src/store/cart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar, DateData } from 'react-native-calendars';
import { getSlotAvailability, bookSlot } from '@/src/services/slots';
import { createOrder, OrderItem } from '@/src/services/orders';
import { saveAndShareReceipt } from '@/src/services/receipt';
import { Select } from '@/components/Select';
import { getDistricts, getBlocks, getPacsList } from '@/constants/mockData';
import { useToast } from '@/components/Toast';

interface CartItem {
  id: string;
  name: string;
  type: string;
  quantity: number;
  price: number;
  image: any;
}

const mockCartItems: CartItem[] = [];

export default function CartScreen() {
  const { t } = useI18n();
  const toast = useToast();
  const [items, setItems] = React.useState<CartItem[]>(mockCartItems);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = React.useState(false);
  const [slots, setSlots] = React.useState<{ hour: string; remaining: number }[]>([]);
  const [selectedHour, setSelectedHour] = React.useState<string | null>(null);
  const [booking, setBooking] = React.useState(false);
  const [token, setToken] = React.useState<string | null>(null);
  const [centerDistrict, setCenterDistrict] = React.useState<string>('');
  const [centerBlock, setCenterBlock] = React.useState<string>('');
  const [centerId, setCenterId] = React.useState<string>('');
  const [createdOrderMeta, setCreatedOrderMeta] = React.useState<{ id: string; token: string } | null>(null);

  React.useEffect(() => {
    (async () => {
      const stored = await getCart();
      const shaped: CartItem[] = stored.map((it) => ({
        id: it.id,
        name: it.name,
        type: it.type || '',
        quantity: it.quantity,
        price: it.price,
        image: it.imageKey ? AgricultureIcons[it.imageKey] : getIcon('fertilizer'),
      }));
      setItems(shaped);
    })();
  }, []);

  const updateQuantity = async (id: string, newQuantity: number) => {
    const next = await storeUpdateQty(id, newQuantity);
    const shaped: CartItem[] = next.map((it) => ({
      id: it.id,
      name: it.name,
      type: it.type || '',
      quantity: it.quantity,
      price: it.price,
      image: it.imageKey ? AgricultureIcons[it.imageKey] : getIcon('fertilizer'),
    }));
    setItems(shaped);
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const proceedToCheckout = () => {
    if (items.length === 0) return;
    setModalOpen(true);
  };

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
    } catch (e) {
      toast.show(t('retry', 'Retry'));
    } finally {
      setLoadingSlots(false);
    }
  }, [t, toast]);

  const onSelectDate = async (day: DateData) => {
    const dateStr = day.dateString;
    setSelectedDate(dateStr);
    setSelectedHour(null);
    await loadSlots(dateStr);
  };

  const makeOrder = async () => {
    if (!selectedDate || !selectedHour) return;
    try {
      setBooking(true);
      // 1) book slot (one booking per order)
      await bookSlot(selectedDate, selectedHour);

      // 2) create order
      const uid = await AsyncStorage.getItem('farmer_id');
      const orderItems: OrderItem[] = items.map((it) => ({ id: it.id, name: it.name, type: it.type, quantity: it.quantity, price: it.price }));
      // Determine kind: fert | seed | mixed from item ids (format kind:key)
      const kinds = new Set(items.map((it) => it.id.split(':')[0]));
      const kind = kinds.size === 1 ? (Array.from(kinds)[0] as 'fert' | 'seed') : 'mixed';
  const created = await createOrder({ userId: uid, kind, items: orderItems, total: totalAmount, date: selectedDate, hour: selectedHour, centerId, centerName: centerId });
  setToken(created.token);
  setCreatedOrderMeta(created);
      // Clear cart after successful order
      await clearCart();
      setItems([]);
    } catch (err: any) {
      if (String(err?.message) === 'sold_out') {
        toast.show(t('sold_out', 'Sold out'));
        if (selectedDate) loadSlots(selectedDate);
      } else {
        toast.show(t('retry', 'Retry'));
      }
    } finally {
      setBooking(false);
    }
  };

  return (
    <MainBackgroundImage blurIntensity={30} overlayOpacity={0.4} showWatermark={true}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Brand.green} />
          </Pressable>
          <Text style={styles.title}>{t('cart', 'My Cart')}</Text>
          <View style={{ width: 40 }} />
        </View>

        {items.length === 0 ? (
          <View style={styles.emptyCart}>
            <Image source={createPlaceholderIcon('🛒')} style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>{t('empty_cart', 'Your cart is empty')}</Text>
            <Text style={styles.emptySubtitle}>{t('add_items', 'Add fertilizers and products to get started')}</Text>
            <Pressable style={styles.shopBtn} onPress={() => router.push('/purchase')}>
              <Text style={styles.shopBtnText}>{t('start_shopping', 'Start Shopping')}</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.itemsSection}>
              <Text style={styles.sectionTitle}>{t('items', 'Items')} ({items.length})</Text>
              {items.map((item) => (
                <View key={item.id} style={styles.cartItem}>
                  <Image source={item.image} style={styles.itemImage} />
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemType}>{item.type}</Text>
                    <Text style={styles.itemPrice}>₹{item.price}</Text>
                  </View>
                  <View style={styles.quantityControls}>
                    <Pressable 
                      style={styles.quantityBtn}
                      onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Ionicons name="remove" size={16} color={Brand.green} />
                    </Pressable>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <Pressable 
                      style={styles.quantityBtn}
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Ionicons name="add" size={16} color={Brand.green} />
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.summarySection}>
              <Text style={styles.sectionTitle}>{t('order_summary', 'Order Summary')}</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t('subtotal', 'Subtotal')}</Text>
                <Text style={styles.summaryValue}>₹{totalAmount}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t('delivery', 'Delivery')}</Text>
                <Text style={styles.summaryValue}>{t('free', 'Free')}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>{t('total', 'Total')}</Text>
                <Text style={styles.totalValue}>₹{totalAmount}</Text>
              </View>
            </View>

            <Pressable style={styles.checkoutBtn} onPress={proceedToCheckout}>
              <Text style={styles.checkoutText}>{t('proceed_checkout', 'Proceed to Checkout')}</Text>
            </Pressable>
          </>
        )}
      </ScrollView>

      {/* Booking Modal */}
      <Modal visible={modalOpen} transparent animationType="fade" onRequestClose={() => setModalOpen(false)}>
        <View style={styles.modalWrap}>
          <View style={styles.modalCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ fontSize: Typography.subtitle, fontWeight: '800', color: Brand.green }}>{t('book_slot', 'Book slot')}</Text>
              <Pressable onPress={() => setModalOpen(false)} style={styles.iconBtn}><Ionicons name="close" size={20} color="#111" /></Pressable>
            </View>

            {/* Date picker */}
            <Text style={styles.sectionTitle}>{t('select_date', 'Select date')}</Text>
            <Calendar
              minDate={todayStr}
              onDayPress={onSelectDate}
              markedDates={selectedDate ? { [selectedDate]: { selected: true } } : undefined}
              theme={{
                selectedDayBackgroundColor: Brand.saffron,
                todayTextColor: Brand.saffron,
              }}
            />

            {/* Slots */}
            <View style={{ marginTop: 12 }}>
              <Text style={styles.sectionTitle}>{t('select_time_slot', 'Select time slot')}</Text>
              {loadingSlots ? (
                <View style={{ paddingVertical: 12 }}><ActivityIndicator color={Brand.saffron} /></View>
              ) : (
                <View style={styles.slotsWrap}>
                  {slots.map((s) => {
                    const disabled = s.remaining <= 0;
                    const on = selectedHour === s.hour;
                    return (
                      <Pressable
                        key={s.hour}
                        disabled={disabled}
                        onPress={() => setSelectedHour(s.hour)}
                        style={[styles.slotBtn, on && styles.slotBtnOn, disabled && styles.slotBtnDisabled]}
                      >
                        <Text style={[styles.slotText, on && styles.slotTextOn]}>{s.hour}</Text>
                        <Text style={[styles.slotSub, disabled && styles.slotSubSold]}>{t('slots_remaining', 'Remaining: {n}', { n: String(s.remaining) })}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>

            {/* Mini Order Summary */}
            {/* Center selection */}
            <View style={{ marginTop: 10 }}>
              <Text style={styles.sectionTitle}>{t('select_center','Select nearest center')}</Text>
              <View style={{ marginTop: 8, gap: 10 }}>
                <Select label={t('district','District')} value={centerDistrict || null} options={getDistricts('en' as any)} onChange={(v) => { setCenterDistrict(v as string); setCenterBlock(''); setCenterId(''); }} placeholder={t('select_district','Select district')} />
                <Select label={t('block','Block')} value={centerBlock || null} options={getBlocks('en' as any, centerDistrict)} onChange={(v) => { setCenterBlock(v as string); setCenterId(''); }} placeholder={t('select_block','Select block')} />
                <Select label={t('center','Center')} value={centerId || null} options={getPacsList('en' as any)} onChange={(v) => setCenterId(v as string)} placeholder={t('select_center','Select center')} />
              </View>
            </View>

            {/* Mini Order Summary */}
            <View style={{ marginTop: 10, paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#eee' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, color: '#666' }}>{t('total', 'Total')}</Text>
                <Text style={{ fontSize: 16, fontWeight: '800', color: Brand.saffron }}>{`₹${totalAmount}`}</Text>
              </View>
            </View>

            {/* Actions */}
            {token ? (
              <View style={{ marginTop: 16 }}>
                <Text style={{ fontSize: Typography.subtitle, fontWeight: '800', color: Brand.green, marginBottom: 6 }}>{t('booking_confirmed', 'Slot booking successful')}</Text>
                <Text style={{ fontSize: 16, marginBottom: 12 }}>{`Token: ${token}`}</Text>
                <Pressable style={[styles.checkoutBtn, { marginBottom: 0 }]} onPress={() => { setModalOpen(false); setToken(null); router.push('/procurement-status'); }}>
                  <Text style={styles.checkoutText}>{t('ok', 'OK')}</Text>
                </Pressable>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <Pressable style={[styles.secondaryBtn, { flex: 1 }]} onPress={async () => {
                    if (!createdOrderMeta) return;
                    await saveAndShareReceipt({ id: createdOrderMeta.id, token: createdOrderMeta.token, order: { userId: await AsyncStorage.getItem('farmer_id'), kind: 'mixed', items: [], total: totalAmount, date: selectedDate || '', hour: selectedHour || '', centerId, centerName: centerId } as any });
                  }}>
                    <Text style={styles.secondaryText}>{t('download_receipt','Download Receipt')}</Text>
                  </Pressable>
                  <Pressable style={[styles.checkoutBtn, { flex: 1, marginBottom: 0 }]} onPress={() => { setModalOpen(false); setToken(null); setCreatedOrderMeta(null); router.push('/procurement-status'); }}>
                    <Text style={styles.checkoutText}>{t('ok', 'OK')}</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
                <Pressable style={[styles.secondaryBtn]} onPress={() => setModalOpen(false)}>
                  <Text style={styles.secondaryText}>{t('cancel', 'Cancel')}</Text>
                </Pressable>
                <Pressable
                  disabled={!selectedDate || !selectedHour || !centerId || booking}
                  style={[styles.primaryBtn, (!selectedDate || !selectedHour || !centerId || booking) && styles.primaryBtnDisabled]}
                  onPress={makeOrder}
                >
                  {booking ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>{t('confirm', 'Confirm')}</Text>}
                </Pressable>
              </View>
            )}

          </View>
        </View>
      </Modal>
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
    marginBottom: 20,
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
  emptyCart: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: Typography.subtitle,
    fontWeight: '700',
    color: Brand.green,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  shopBtn: {
    backgroundColor: Brand.saffron,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
  },
  shopBtnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  itemsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: Typography.subtitle,
    fontWeight: '700',
    color: Brand.green,
    marginBottom: 15,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: Palette.leafLight,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.green,
    marginBottom: 4,
  },
  itemType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.saffron,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.leafLight,
    borderRadius: 8,
    padding: 4,
  },
  quantityBtn: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    marginHorizontal: 15,
    fontSize: 16,
    fontWeight: '700',
    color: Brand.green,
  },
  summarySection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Brand.green,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 10,
    paddingTop: 15,
  },
  totalLabel: {
    fontSize: Typography.subtitle,
    fontWeight: '700',
    color: Brand.green,
  },
  totalValue: {
    fontSize: Typography.subtitle,
    fontWeight: '800',
    color: Brand.saffron,
  },
  checkoutBtn: {
    backgroundColor: Brand.saffron,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 30,
  },
  checkoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '800',
  },
  // Modal styles
  modalWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  iconBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  slotsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  slotBtn: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10, minWidth: 96 },
  slotBtnOn: { backgroundColor: Brand.saffron, borderColor: Brand.saffron },
  slotBtnDisabled: { opacity: 0.45 },
  slotText: { fontWeight: '700', color: '#111' },
  slotTextOn: { color: '#fff' },
  slotSub: { color: '#6b7280', fontSize: Typography.label - 2 },
  slotSubSold: { color: '#b91c1c', fontWeight: '700' },
  primaryBtn: { flex: 1, backgroundColor: Brand.saffron, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  primaryBtnDisabled: { backgroundColor: Brand.saffronDisabledSolid },
  primaryBtnText: { color: '#fff', fontWeight: '800' },
  secondaryBtn: { flex: 1, borderWidth: 1, borderColor: Brand.saffron, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  secondaryText: { color: Brand.saffron, fontWeight: '800' },
});
