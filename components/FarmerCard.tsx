import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Brand } from '@/constants/Colors';

// Visual "ATM-style" farmer card like in the screenshot
export const FarmerCard = ({
  name,
  pacsName,
  farmerId,
  district,
  block,
  avatarUri,
}: {
  name: string;
  pacsName?: string;
  farmerId?: string | null;
  district?: string;
  block?: string;
  avatarUri?: string | null;
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.dept}>उत्तर प्रदेश सहकारिता विभाग (UPCB)</Text>
        <Text style={styles.label}>किसान मित्र कार्ड</Text>
      </View>
      <View style={styles.row}>
        <View style={styles.avatarWrap}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPh]} />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{name || '—'}</Text>
          {!!pacsName && <Text style={styles.meta}>{pacsName}</Text>}
          <Text style={styles.id}>{farmerId || '—'}</Text>
          {(district || block) && (
            <Text style={styles.meta}>{[district, block].filter(Boolean).join(', ')}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F4FFE8',
    borderRadius: 12,
    overflow: 'hidden',
    borderColor: '#DCF7C3',
    borderWidth: 1,
  },
  header: {
    backgroundColor: Brand.green,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  dept: { color: '#E8FFDB', fontSize: 12 },
  label: { color: 'white', fontWeight: '800', fontSize: 14 },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center', padding: 12 },
  avatarWrap: { width: 70, height: 70, borderRadius: 8, overflow: 'hidden', backgroundColor: '#fff' },
  avatar: { width: '100%', height: '100%' },
  avatarPh: { backgroundColor: '#E6EDE3' },
  name: { fontSize: 16, fontWeight: '800', color: '#1C2A13' },
  meta: { color: '#2D4A2D', opacity: 0.9 },
  id: { fontWeight: '800', color: Brand.saffron, marginTop: 2 },
});

export default FarmerCard;
