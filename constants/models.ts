// Basic model types and example in-memory data for wiring feature screens
export type Scheme = { id: string; title: string; summary: string; eligibility?: string };
export type Pacs = { id: string; name: string; district: string; block: string; contact?: string };
export type Procurement = { id: string; crop: string; qtyKg: number; rate: number; date: string; status: 'pending' | 'paid' };

export const schemes: Scheme[] = [
  { id: 'pm-kisan', title: 'PM-Kisan', summary: 'Income support to farmer families.', eligibility: 'Small and marginal farmers.' },
  { id: 'pmfby', title: 'PM Fasal Bima Yojana', summary: 'Crop insurance scheme.' },
];

export const pacsDirectory: Pacs[] = [
  { id: 'p1', name: 'PACS Kashipur II', district: 'Udham Singh Nagar', block: 'Kashipur', contact: '+91-7000000000' },
];

export const procurements: Procurement[] = [
  { id: 'r1', crop: 'Wheat', qtyKg: 1200, rate: 2275, date: '2025-04-18', status: 'paid' },
  { id: 'r2', crop: 'Paddy', qtyKg: 900, rate: 2183, date: '2025-01-12', status: 'pending' },
];
