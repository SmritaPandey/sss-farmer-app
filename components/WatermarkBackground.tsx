import React from 'react';
import { View, StyleSheet } from 'react-native';

// Subtle brand watermark background using soft "blobs".
export const WatermarkBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <View style={styles.root}>
      {/* soft shapes as watermark */}
      <View style={[styles.blob, styles.blobTL]} />
      <View style={[styles.blob, styles.blobBR]} />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F9F7' },
  content: { flex: 1 },
  blob: {
    position: 'absolute',
    backgroundColor: '#DFF2E9',
    opacity: 0.8,
    width: 280,
    height: 280,
    borderRadius: 999,
  },
  blobTL: { top: -90, left: -70 },
  blobBR: { bottom: -110, right: -90 },
});

export default WatermarkBackground;
