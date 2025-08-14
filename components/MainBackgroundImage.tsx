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
          {/* Watermark removed per requirement. showWatermark prop retained for compatibility. */}
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
  // Watermark styles removed
});
