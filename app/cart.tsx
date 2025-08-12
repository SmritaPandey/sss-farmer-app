import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import MainBackgroundImage from '@/components/MainBackgroundImage';
import { Brand, Palette } from '@/constants/Colors';
import { Typography, Spacing } from '@/constants/Theme';
import { useI18n } from '@/contexts/i18n';
import { createPlaceholderIcon, getIcon } from '@/assets/icons';

interface CartItem {
  id: string;
  name: string;
  type: string;
  quantity: number;
  price: number;
  image: any;
}

const mockCartItems: CartItem[] = [
  {
    id: '1',
    name: 'Urea Fertilizer',
    type: '50kg bag',
    quantity: 3,
    price: 250,
    image: getIcon('fertilizer'),
  },
  {
    id: '2', 
    name: 'NPK Complex',
    type: '50kg bag',
    quantity: 2,
    price: 320,
    image: createPlaceholderIcon('🧪'),
  },
  {
    id: '3',
    name: 'Pesticide Spray',
    type: '1L bottle',
    quantity: 1,
    price: 185,
    image: createPlaceholderIcon('🚿'),
  },
];

export default function CartScreen() {
  const { t } = useI18n();
  const [items, setItems] = React.useState<CartItem[]>(mockCartItems);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setItems(items.filter(item => item.id !== id));
    } else {
      setItems(items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const proceedToCheckout = () => {
    // Navigate to checkout or show success message
    router.push('/fertilizer-request');
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
            <Pressable style={styles.shopBtn} onPress={() => router.push('/fertilizer')}>
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
});
