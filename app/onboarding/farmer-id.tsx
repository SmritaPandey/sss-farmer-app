import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Brand } from '@/constants/Colors';

export default function FarmerIdScreen() {
  const [fid, setFid] = React.useState('');
  const isValid = /^\d{16}$/.test(fid);

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
      <Text style={styles.title}>अपना 16-अंकीय किसान आईडी दर्ज करें</Text>

      <TextInput
        value={fid}
        onChangeText={setFid}
        placeholder="1234567890123456"
        keyboardType="number-pad"
        maxLength={16}
        style={styles.input}
      />

      <Pressable
        accessibilityRole="button"
        disabled={!isValid}
        onPress={async () => {
          await AsyncStorage.setItem('farmer_id', fid);
          router.push('/onboarding/registration');
        }}
        style={[styles.cta, !isValid && styles.ctaDisabled]}
      >
        <Text style={styles.ctaText}>जारी करें</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16, justifyContent: 'center', backgroundColor: '#fff' },
  logo: { width: 72, height: 72, alignSelf: 'center', marginBottom: 8 },
  title: { fontSize: 20, fontWeight: '600', textAlign: 'center' },
  input: { fontSize: 18, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 14, textAlign: 'center' },
  cta: { backgroundColor: Brand.saffron, paddingVertical: 14, borderRadius: 10, marginTop: 16 },
  ctaDisabled: { backgroundColor: '#ffcd9f' },
  ctaText: { color: 'white', textAlign: 'center', fontWeight: '700', fontSize: 16 },
});
