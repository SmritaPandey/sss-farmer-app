import React from 'react';
import { ImageBackground, StyleSheet, Dimensions, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface BackgroundImageProps {
  children: React.ReactNode;
  overlay?: boolean;
}

export default function BackgroundImage({ children, overlay = true }: BackgroundImageProps) {
  return (
    <ImageBackground
      source={require('@/assets/HD-wallpaper-farmer-field-nature-farmer.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      {overlay && <View style={styles.overlay} />}
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
});
