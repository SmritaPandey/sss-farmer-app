import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, FlatList } from 'react-native';
import WatermarkBackground from '@/components/WatermarkBackground';
import { useI18n } from '@/contexts/i18n';
import { createPlaceholderIcon } from '@/assets/icons';
import { db } from '@/src/config/firebase';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

type OrderRow = { id: string; kind: string; date: string; hour: string; total: number; status?: string; token?: string };

export default function ProcurementStatusScreen() {
  const { t } = useI18n();
  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState<OrderRow[]>([]);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const uid = await AsyncStorage.getItem('farmer_id');
        const q = uid
          ? query(collection(db, 'orders'), where('userId', '==', uid), orderBy('createdAt', 'desc'))
          : query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const list: OrderRow[] = [];
        snap.forEach((d) => {
          const v: any = d.data();
          list.push({
            id: d.id,
            kind: v.kind || 'fert',
            date: v.date || '',
            hour: v.hour || '',
            total: v.total || 0,
            status: v.status || 'scheduled',
            token: v.token,
          });
        });
        setItems(list);
      } catch (e: any) {
        setErr(e?.message || 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  
  const getCropIcon = (crop: string) => {
    const cropIcons: Record<string, string> = {
      'Wheat': '🌾',
      'Rice': '🌾',
      'Corn': '🌽',
      'Paddy': '🌾'
    };
    return cropIcons[crop] || '🌾';
  };

  return (
    <WatermarkBackground>
      <View style={styles.container}>
        <Text style={styles.title}>{t('procurement_status')}</Text>
        {loading ? <ActivityIndicator /> : items.length === 0 ? (
          <Text>{t('empty_list')}</Text>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(it) => it.id}
            renderItem={({ item: rec }) => (
              <View style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <Image source={createPlaceholderIcon(rec.kind === 'seed' ? '🌱' : '🧪')} style={styles.cropIcon} />
                  <View style={styles.itemDetails}>
                    <Text style={styles.cropName}>{rec.kind.toUpperCase()} · {rec.date} {rec.hour}</Text>
                    <Text style={styles.itemDate}>₹{rec.total}</Text>
                    {rec.token ? <Text style={styles.token}>Token: {rec.token}</Text> : null}
                  </View>
                  <View style={[styles.statusBadge, rec.status === 'paid' ? styles.statusPaid : styles.statusPending]}>
                    <Text style={styles.statusText}>{rec.status === 'paid' ? 'Paid' : 'Scheduled'}</Text>
                  </View>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </WatermarkBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 8 },
  title: { fontWeight: '800', fontSize: 18 },
  itemCard: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 16, 
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  itemHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12 
  },
  cropIcon: { 
    width: 32, 
    height: 32 
  },
  itemDetails: { 
    flex: 1 
  },
  cropName: { 
    fontWeight: '700', 
    fontSize: 16 
  },
  itemDate: { 
    color: '#6b7280', 
    fontSize: 14, 
    marginTop: 2 
  },
  token: {
    color: '#2563eb',
    fontSize: 13,
    marginTop: 4,
    fontWeight: '600'
  },
  statusBadge: { 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 6 
  },
  statusPaid: { 
    backgroundColor: '#dcfce7' 
  },
  statusPending: { 
    backgroundColor: '#fef3c7' 
  },
  statusText: { 
    fontSize: 12, 
    fontWeight: '600' 
  }
});
