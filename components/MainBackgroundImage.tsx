import React from 'react';
import { ImageBackground, StyleSheet, View, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { getMainBackgroundImage } from '@/assets/icons';
import { Brand } from '@/constants/Colors';

interface MainBackgroundImageProps {
  children: React.ReactNode;
  blurIntensity?: number;
  overlayOpacity?: number;
  showWatermark?: boolean;
}

export default function MainBackgroundImage({ 
  children, 
  blurIntensity = 25,
  overlayOpacity = 0.4,
  showWatermark = true
}: MainBackgroundImageProps) {
  return (
    <ImageBackground 
      source={getMainBackgroundImage()} 
      style={styles.container}
      resizeMode="cover"
    >
      <BlurView 
        intensity={blurIntensity} 
        style={styles.blurContainer}
      >
        <View style={[styles.overlay, { backgroundColor: `rgba(255, 255, 255, ${overlayOpacity})` }]}>
          {showWatermark && (
            <View style={styles.watermarkContainer}>
              <Text style={styles.watermarkText}>Kisaan Mitra</Text>
              <Text style={[styles.watermarkText, styles.watermarkTextSecondary]}>किसान मित्र</Text>
              <View style={styles.watermarkPattern}>
                {Array.from({ length: 20 }, (_, i) => (
                  <Text key={i} style={[styles.watermarkDot, { 
                    transform: [{ rotate: `${i * 18}deg` }],
                    top: 100 + Math.sin(i * 0.3) * 60,
                    left: 100 + Math.cos(i * 0.3) * 60
                  }]}>
                    ⚡
                  </Text>
                ))}
                {Array.from({ length: 15 }, (_, i) => (
                  <Text key={`leaf-${i}`} style={[styles.watermarkLeaf, { 
                    top: 200 + Math.sin(i * 0.4) * 80,
                    left: 50 + Math.cos(i * 0.4) * 100,
                    transform: [{ rotate: `${i * 24}deg` }]
                  }]}>
                    🌾
                  </Text>
                ))}
              </View>
            </View>
          )}
          {children}
        </View>
      </BlurView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blurContainer: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  watermarkContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  watermarkText: {
    fontSize: 48,
    fontWeight: '100',
    color: Brand.saffron,
    opacity: 0.15,
    textAlign: 'center',
    transform: [{ rotate: '-45deg' }],
    marginBottom: 20,
  },
  watermarkTextSecondary: {
    fontSize: 36,
    marginTop: -10,
    opacity: 0.12,
  },
  watermarkPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  watermarkDot: {
    position: 'absolute',
    fontSize: 28,
    color: Brand.saffron,
    opacity: 0.1,
  },
  watermarkLeaf: {
    position: 'absolute',
    fontSize: 24,
    color: Brand.green,
    opacity: 0.08,
  },
});
