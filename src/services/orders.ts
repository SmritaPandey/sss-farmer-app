import { db } from '@/src/config/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export type OrderItem = {
  id: string;
  name: string;
  type?: string;
  quantity: number;
  price: number;
};

export type Order = {
  userId?: string | null;
  kind: 'fert' | 'seed' | 'mixed';
  items: OrderItem[];
  total: number;
  date: string;
  hour: string;
  centerId?: string;
  centerName?: string;
};

export type CreatedOrder = { id: string; token: string };

function generateToken(): string {
  // Simple 6-digit numeric token for easy reading
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function createOrder(order: Order): Promise<CreatedOrder> {
  const token = generateToken();
  const ref = await addDoc(collection(db, 'orders'), {
    ...order,
    token,
    createdAt: serverTimestamp(),
    status: 'scheduled',
  });
  return { id: ref.id, token };
}
