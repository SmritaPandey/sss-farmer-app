import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Brand } from '@/constants/Colors';
import { Typography, Spacing } from '@/constants/Theme';
import WatermarkBackground from '@/components/WatermarkBackground';

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
    <WatermarkBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topbar}>
          <View style={{ width: 36 }} />
          <View style={{ flexDirection: 'row', gap: 14 }}>
            <Text style={styles.topIcon}>🛒</Text>
            <Text style={styles.topIcon}>🔔</Text>
            <Text style={styles.topIcon}>🙂</Text>
          </View>
        </View>

        <Text style={styles.greet}>स्वागत है,</Text>
        <Text style={styles.name}>विक्रम कुमार</Text>

        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>पीएम किसान सम्मान निधि योजना</Text>
          <Text style={styles.bannerSub}>लाभ, पात्रता और आवेदन प्रक्रिया</Text>
          <View style={styles.dotsWrap}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        <Text style={styles.section}>श्रेणियाँ खोजें</Text>
        <View style={styles.grid}>
          <Card title="उर्वरक" onPress={() => router.push('/fertilizer')} />
          <Card title="पैक्स सेवाएं" onPress={() => router.push('/pacs-services')} />
          <Card title="खरीद की स्थिति" onPress={() => {}} />
          <Card title="सरकारी योजनाएं" onPress={() => {}} />
          <Card title="बी-पैक्स देखें" onPress={() => {}} />
          <Card title="प्रमाण पत्र" onPress={() => {}} />
        </View>
      </ScrollView>
    </WatermarkBackground>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.screenPadding, gap: 12 },
  topbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  topIcon: { fontSize: 18 },
  greet: { fontSize: Typography.subtitle, color: '#1f2937' },
  name: { fontSize: Typography.title, fontWeight: '800' },
  banner: { backgroundColor: '#ffffff', borderRadius: 18, padding: 0, overflow: 'hidden', borderColor: '#E5F0EB', borderWidth: 1 },
  // inner banner content approximation
  bannerTitle: { color: '#0a4b2a', fontWeight: '800', fontSize: Typography.cardTitle + 4, paddingTop: 16, paddingHorizontal: 16 },
  bannerSub: { color: '#0a4b2a', opacity: 0.9, marginTop: 4, fontSize: Typography.subtitle, paddingHorizontal: 16, paddingBottom: 10 },
  dotsWrap: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingBottom: 12 },
  dot: { width: 6, height: 6, borderRadius: 6, backgroundColor: '#d1fae5' },
  dotActive: { backgroundColor: Brand.green },
  section: { marginTop: Spacing.sectionTop + 6, fontWeight: '800', fontSize: Typography.section },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { flexBasis: '48%', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 18 },
  cardTitle: { fontSize: Typography.cardTitle, fontWeight: '700', color: Brand.green },
});
