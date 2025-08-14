import { db } from '@/src/config/firebase';
import { collection, doc, getDocs, runTransaction, setDoc } from 'firebase/firestore';

export const SLOT_HOURS = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'] as const;
export const SLOT_CAP = 20;

export type SlotAvailability = { hour: string; remaining: number }[];

export async function getSlotAvailability(date: string): Promise<SlotAvailability> {
  const hoursCol = collection(db, 'slots', date, 'hours');
  const snap = await getDocs(hoursCol);
  const m = new Map<string, { cap?: number; booked?: number }>();
  snap.forEach((d) => m.set(d.id, (d.data() as any) || {}));
  return SLOT_HOURS.map((h) => {
    const d = m.get(h) || {};
    const cap = typeof d.cap === 'number' ? d.cap : SLOT_CAP;
    const booked = typeof d.booked === 'number' ? d.booked : 0;
    return { hour: h, remaining: Math.max(0, cap - booked) };
  });
}

export async function bookSlot(date: string, hour: string, qty = 1) {
  const ref = doc(db, 'slots', date, 'hours', hour);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const data = (snap.exists() ? (snap.data() as any) : { cap: SLOT_CAP, booked: 0 });
    const cap = typeof data.cap === 'number' ? data.cap : SLOT_CAP;
    const booked = typeof data.booked === 'number' ? data.booked : 0;
    if (booked + qty > cap) {
      throw new Error('sold_out');
    }
    tx.set(ref, { cap, booked: booked + qty }, { merge: true });
  });
  // Ensure parent date doc exists (optional)
  await setDoc(doc(db, 'slots', date), { exists: true }, { merge: true });
}
