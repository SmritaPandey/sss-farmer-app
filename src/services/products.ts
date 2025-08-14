import { BASE_URL } from '@/src/config/api';

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
  if (!BASE_URL) return [];
  const qs = new URLSearchParams();
  if (params?.category) qs.set('category', params.category);
  if (params?.q) qs.set('q', params.q);
  if (typeof params?.active === 'boolean') qs.set('active', params.active ? '1' : '0');
  const url = `${BASE_URL}/products${qs.toString() ? `?${qs.toString()}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
