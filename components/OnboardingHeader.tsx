import React from 'react';
import { View, Image, StyleSheet, Text, Platform } from 'react-native';
import { Brand } from '@/constants/Colors';
import { getYogiImage, getJPSRathoreImage, getSahkarSarthiImage } from '@/assets/icons';
import { useI18n } from '@/contexts/i18n';
import UPSarkar from '../assets/icons/Uttar-Pradesh-Sarkar-White.svg';

export default function OnboardingHeader() {
  const { lang } = useI18n() as any;
  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        <Image source={getJPSRathoreImage()} style={styles.sidePhoto} resizeMode="cover" />
        <View style={styles.centerLogoWrap}>
          <UPSarkar width={100} height={95} />
        </View>
        <Image source={getYogiImage()} style={styles.sidePhoto} resizeMode="cover" />
      </View>
      <View style={styles.midRow}>
        <Image source={getSahkarSarthiImage()} style={styles.sahkar} resizeMode="contain" />
      </View>
      <Text style={styles.subtitle}>{lang === 'hi' ? 'किसान ऐप' : 'Kisan App'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: Brand.saffron,
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sidePhoto: {
    width: 95,
    height: 95,
    borderRadius: 0,
    backgroundColor: '#ffffff22',
  },
  centerLogoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  midRow: {
    alignItems: 'center',
    marginTop: 10,
  },
  sahkar: {
    width: 160,
    height: 46,
  },
  subtitle: {
    fontSize: 32,
    textAlign: 'center',
    color: 'white',
    fontWeight: '900',
    marginTop: 0.6,
    letterSpacing: 0.4,
  },
});
