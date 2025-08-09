import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Brand } from '@/constants/Colors';
import { Typography, Spacing } from '@/constants/Theme';

export default function HomeScreen() {
  const [farmerId, setFarmerId] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const id = await AsyncStorage.getItem('farmer_id');
        setFarmerId(id);
      } catch {}
    })();
  }, []);

  const Card = ({ title, onPress }: { title: string; onPress: () => void }) => (
    <Pressable onPress={onPress} style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
    </Pressable>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
  <Text style={styles.greet}>स्वागत है</Text>
  <Text style={styles.subgreet}>किसान आईडी: {farmerId ?? '—'}</Text>

      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>पीएम किसान सम्मान निधि योजना</Text>
        <Text style={styles.bannerSub}>लाभ, पात्रता और आवेदन प्रक्रिया</Text>
      </View>

  <Text style={styles.section}>किसान सेवाएँ</Text>
      <View style={styles.grid}>
        <Card title="उर्वरक" onPress={() => router.push('/fertilizer')} />
        <Card title="पैक्स सेवाएं" onPress={() => router.push('/pacs-services')} />
    <Card title="बीज एवं कृषि यंत्र" onPress={() => {}} />
    <Card title="सरकारी योजनाएं" onPress={() => {}} />
    <Card title="फसल बीमा" onPress={() => {}} />
    <Card title="उपज बेचें (MSP)" onPress={() => {}} />
    <Card title="प्रमाण पत्र" onPress={() => {}} />
    <Card title="मेरी प्रोफाइल" onPress={() => router.push('/profile')} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.screenPadding, gap: 12, backgroundColor: '#fff' },
  greet: { fontSize: Typography.title, fontWeight: '800' },
  subgreet: { color: '#637488', marginBottom: 8, fontSize: Typography.subtitle },
  banner: { backgroundColor: Brand.saffron, borderRadius: 16, padding: 18 },
  bannerTitle: { color: '#fff', fontWeight: '800', fontSize: Typography.cardTitle + 2 },
  bannerSub: { color: '#fff', opacity: 0.95, marginTop: 4, fontSize: Typography.subtitle },
  section: { marginTop: Spacing.sectionTop, fontWeight: '800', fontSize: Typography.section },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { flexBasis: '48%', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 18 },
  cardTitle: { fontSize: Typography.cardTitle, fontWeight: '700', color: Brand.green },
});
