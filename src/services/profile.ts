import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '@/src/config/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export type Profile = Record<string, any> & {
  uid?: string;
  farmer_id?: string;
  name?: string;
  mobile?: string;
  email?: string;
  father_name?: string;
  land_area?: string;
  khasra?: string;
  district?: string;
  block?: string;
  tehsil?: string;
  village?: string;
  pincode?: string;
  pacs_name?: string; // value code
  photo_uri?: string;
};

export async function getCachedProfile(): Promise<Profile | null> {
  try {
    const raw = await AsyncStorage.getItem('profile_payload');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function saveProfile(update: Partial<Profile>): Promise<Profile> {
  const existing = (await getCachedProfile()) || {};
  const merged: Profile = { ...existing, ...update } as any;
  // Keep uid/farmer_id if present
  const uid = (await AsyncStorage.getItem('auth_uid')) || merged.uid;
  if (uid) merged.uid = uid;
  const farmer_id = (await AsyncStorage.getItem('farmer_id')) || merged.farmer_id;
  if (farmer_id) merged.farmer_id = farmer_id;

  await AsyncStorage.setItem('profile_payload', JSON.stringify(merged));

  // Best effort Firestore write
  if (uid) {
    try {
      await setDoc(doc(db, 'users', uid), { ...merged, updatedAt: serverTimestamp() }, { merge: true });
    } catch {}
  }
  return merged;
}
