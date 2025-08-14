import { BASE_URL } from '@/src/config/api';
import { db } from '@/src/config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export type Product = {
  id: string;
  sku?: string | null;
  name: string;
  category: 'fert' | 'seed' | 'other';
  price: number;
  unit?: string;
  stock?: number;
  imageUrl?: string;
  pacsId?: string | null;
  isActive?: boolean;
};

export async function fetchProducts(params?: { category?: string; q?: string; active?: boolean }): Promise<Product[]> {
  // Try Firestore first if configured
  try {
    if (db) {
      const col = collection(db, 'products');
      const clauses: any[] = [];
      if (params?.category) clauses.push(where('category', '==', params.category));
      if (typeof params?.active === 'boolean') clauses.push(where('isActive', '==', params.active));
      const qref = clauses.length ? query(col, ...clauses) : col;
      const snap = await getDocs(qref);
      let items: Product[] = snap.docs.map((d: any) => ({ id: d.id, ...(d.data() as any) }));
      if (params?.q) {
        const needle = params.q.toLowerCase();
        items = items.filter(p => (p.name || '').toLowerCase().includes(needle) || (p.sku || '').toLowerCase().includes(needle));
      }
      if (items.length) return items;
    }
  } catch {}

  // Fallback to REST base if available
  if (BASE_URL) {
    const qs = new URLSearchParams();
    if (params?.category) qs.set('category', params.category);
    if (params?.q) qs.set('q', params.q);
    if (typeof params?.active === 'boolean') qs.set('active', params.active ? '1' : '0');
    const url = `${BASE_URL}/products${qs.toString() ? `?${qs.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  return [];
}
