import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Brand, Palette } from '@/constants/Colors';
import { Typography } from '@/constants/Theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type Props = {
  title: string;
  onPress: () => void;
  icon?: { lib?: 'ion' | 'mci'; name: string; color?: string };
  image?: any; // optional require('...')
  imageSize?: number; // optional size for image icons
};

export default function Tile({ title, onPress, icon, image, imageSize }: Props) {
  const hasImageOnly = !!image && !icon;
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={[
        styles.iconWrap,
        hasImageOnly && { backgroundColor: '#fff', borderColor: '#fff' }
      ]}>
        {icon ? (
          icon.lib === 'mci' ? (
            <MaterialCommunityIcons name={icon.name as any} size={44} color={icon?.color || Brand.green} />
          ) : (
            <Ionicons name={(icon?.name as any) || 'leaf-outline'} size={44} color={icon?.color || Brand.green} />
          )
        ) : null}
        {image ? (
          hasImageOnly ? (
            <Image source={image} style={[styles.image, imageSize ? { width: imageSize, height: imageSize } : null]} resizeMode="contain" />
          ) : (
            <Image source={image} style={styles.thumb} />
          )
        ) : null}
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: '48%', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 14, padding: 22, minHeight: 120, marginBottom: 16, alignItems: 'center' },
  iconWrap: { width: 68, height: 68, borderRadius: 16, backgroundColor: Palette.leafLight, alignItems: 'center', justifyContent: 'center', marginBottom: 14, borderWidth: 1, borderColor: Palette.outlineLeaf },
  image: { width: 56, height: 56 },
  thumb: { position: 'absolute', right: -6, bottom: -6, width: 26, height: 26, opacity: 0.9 },
  cardTitle: { fontSize: Typography.cardTitle, fontWeight: '800', color: Brand.green, textAlign: 'center' },
});
