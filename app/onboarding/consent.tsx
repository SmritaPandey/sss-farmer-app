import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { Brand } from '@/constants/Colors';
import { Typography, Spacing } from '@/constants/Theme';

export default function ConsentScreen() {
  const [agree, setAgree] = React.useState(false);
  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
      <Text style={styles.title}>सहमति</Text>
      <Text style={styles.subtitle}>
        मैं एतद्वारा पुष्टि करता/करती हूँ कि मैंने ऐप की सेवा की शर्तें और गोपनीयता नीति को पढ़ा और स्वीकार किया है, और मैं नीति अनुसार अपने डेटा के संग्रह और उपयोग के लिए सहमति प्रदान करता/करती हूँ।
      </Text>

      <Pressable onPress={() => setAgree((a) => !a)} style={styles.checkboxRow}>
        <View style={[styles.checkbox, agree && styles.checkboxActive]} />
        <Text style={styles.checkboxText}>मैं सहमत हूँ</Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        disabled={!agree}
        onPress={() => router.push('/onboarding/farmer-id')}
        style={[styles.cta, !agree && styles.ctaDisabled]}
      >
        <Text style={styles.ctaText}>जारी करें</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16, justifyContent: 'center', backgroundColor: '#fff' },
  logo: { width: 72, height: 72, alignSelf: 'center', marginBottom: 8 },
  title: { fontSize: Typography.title, fontWeight: '800', textAlign: 'center' },
  subtitle: { fontSize: Typography.subtitle, color: '#637488', textAlign: 'center' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: '#999' },
  checkboxActive: { backgroundColor: Brand.saffron, borderColor: Brand.saffron },
  checkboxText: { flex: 1, fontSize: 13 },
  cta: { backgroundColor: Brand.saffron, paddingVertical: 16, borderRadius: 12, marginTop: 16 },
  ctaDisabled: { backgroundColor: '#ffcd9f' },
  ctaText: { color: 'white', textAlign: 'center', fontWeight: '800', fontSize: Typography.button },
});
