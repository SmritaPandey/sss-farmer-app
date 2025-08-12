import React from 'react';
import { ImageBackground, StyleSheet, Dimensions, View } from 'react-native';
import { getBackgroundImage } from '@/assets/icons';

const { width, height } = Dimensions.get('window');

interface BackgroundImageLoginProps {
  children: React.ReactNode;
  overlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
}

export default function BackgroundImageLogin({ 
  children, 
  overlay = true, 
  overlayColor = 'rgba(255, 255, 255, 0.9)',
  overlayOpacity = 0.9 
}: BackgroundImageLoginProps) {
  return (
    <ImageBackground
      source={getBackgroundImage()}
      style={styles.background}
      resizeMode="cover"
    >
      {overlay && (
        <View 
          style={[
            styles.overlay, 
            { 
              backgroundColor: overlayColor.includes('rgba') 
                ? overlayColor 
                : `${overlayColor}${Math.round(overlayOpacity * 255).toString(16).padStart(2, '0')}`
            }
          ]} 
        />
      )}
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
  },
});
