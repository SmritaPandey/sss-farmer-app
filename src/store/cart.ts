import AsyncStorage from '@react-native-async-storage/async-storage';
import { AgricultureIcons } from '@/assets/icons';

export type CartItemStore = {
  id: string; // unique key per product variant
  name: string;
  type?: string;
  quantity: number;
  price: number;
  imageKey?: keyof typeof AgricultureIcons;
};

const KEY = 'cart_items_v1';

export async function getCart(): Promise<CartItemStore[]> {
  try {
    const s = await AsyncStorage.getItem(KEY);
    if (!s) return [];
    const arr = JSON.parse(s);
    if (Array.isArray(arr)) return arr;
  } catch {}
  return [];
}

export async function setCart(items: CartItemStore[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(items));
}

export async function clearCart() {
  await AsyncStorage.removeItem(KEY);
}

export async function addOrUpdateItems(newItems: CartItemStore[]) {
  const curr = await getCart();
  const map = new Map<string, CartItemStore>();
  for (const it of curr) map.set(it.id, it);
  for (const it of newItems) {
    const prev = map.get(it.id);
    if (prev) {
      map.set(it.id, { ...prev, quantity: (prev.quantity || 0) + (it.quantity || 0) });
    } else {
      map.set(it.id, it);
    }
  }
  const merged = Array.from(map.values()).filter((x) => x.quantity > 0);
  await setCart(merged);
  return merged;
}

export async function updateQuantity(id: string, qty: number) {
  const curr = await getCart();
  const next = curr
    .map((it) => (it.id === id ? { ...it, quantity: qty } : it))
    .filter((it) => it.quantity > 0);
  await setCart(next);
  return next;
}
