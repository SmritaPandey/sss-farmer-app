import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as FileSystem from 'expo-file-system';
let Sharing: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Sharing = require('expo-sharing');
} catch {}
import { captureRef } from 'react-native-view-shot';
import MainBackgroundImage from '@/components/MainBackgroundImage';
import FarmerCard from '@/components/FarmerCard';
import FarmerCardBack from '@/components/FarmerCardBack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useI18n } from '@/contexts/i18n';
import { Brand, Palette } from '@/constants/Colors';
import { Typography, Spacing } from '@/constants/Theme';
import { createPlaceholderIcon } from '@/assets/icons';

export default function IdCardScreen() {
  const { t } = useI18n();
  const shotRef = React.useRef<View>(null);
  const [profile, setProfile] = React.useState<any | null>(null);
  const [farmerId, setFarmerId] = React.useState<string | null>(null);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [showBack, setShowBack] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const cached = await AsyncStorage.getItem('profile_payload');
        const id = await AsyncStorage.getItem('farmer_id');
        if (cached) setProfile(JSON.parse(cached));
        setFarmerId(id);
      } catch {}
    })();
  }, []);

  const onSave = async () => {
    try {
      setIsDownloading(true);
      const uri = await captureRef(shotRef, { format: 'png', quality: 1 } as any);
      if (!uri) return;
      
      const fileUri = FileSystem.documentDirectory! + `farmer-id-${Date.now()}.png`;
      await FileSystem.copyAsync({ from: uri, to: fileUri });
      
      try {
        if (Sharing && (await Sharing.isAvailableAsync?.())) {
          await Sharing.shareAsync?.(fileUri, { dialogTitle: t('share_id', 'Share ID') });
        } else {
          Alert.alert(
            'Success',
            'ID card saved successfully to your device!',
            [{ text: 'OK' }]
          );
        }
      } catch {
        Alert.alert(
          'Success',
          'ID card saved successfully!',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to save ID card. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const showPreviewInfo = () => {
    Alert.alert(
      'ID Card Preview',
      'This is how your farmer ID card will look when printed. Make sure all details are correct before downloading.',
      [{ text: 'OK' }]
    );
  };

  return (
    <MainBackgroundImage>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Brand.green} />
          </Pressable>
          <Text style={styles.title}>{t('farmer_card', 'Farmer ID Card')}</Text>
          <Pressable onPress={showPreviewInfo} style={styles.infoBtn}>
            <Ionicons name="information-circle-outline" size={24} color={Brand.green} />
          </Pressable>
        </View>

        <View style={styles.previewSection}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.sectionTitle}>ID Card Preview</Text>
            <Pressable onPress={() => setShowBack((s) => !s)} style={[styles.toggleBtn, showBack && styles.toggleActive]}>
              <Text style={[styles.toggleText, showBack && styles.toggleTextActive]}>{showBack ? 'पीछे' : 'सामने'}</Text>
            </Pressable>
          </View>
          <Text style={styles.sectionSubtitle}>{showBack ? 'कार्ड का पीछे का भाग' : 'कार्ड का सामने का भाग'}</Text>
          
          <View style={styles.cardContainer}>
            <View ref={shotRef} collapsable={false} style={styles.cardWrapper}>
              {showBack ? (
                <FarmerCardBack profile={profile} />
              ) : (
                <FarmerCard
                  name={profile?.name || t('name')}
                  pacsName={profile?.pacs_name || t('pacs_name')}
                  farmerId={farmerId}
                  district={profile?.district || ''}
                  block={profile?.block || ''}
                  avatarUri={profile?.photo_uri || null}
                />
              )}
            </View>
          </View>
        </View>

        <View style={styles.instructionsSection}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          
          <View style={styles.instructionCard}>
            <View style={styles.instructionItem}>
              <View style={styles.instructionIconContainer}>
                <Image source={createPlaceholderIcon('📱')} style={styles.instructionIcon} />
              </View>
              <View style={styles.instructionContent}>
                <Text style={styles.instructionTitle}>1. Download ID Card</Text>
                <Text style={styles.instructionDescription}>
                  Tap the download button below to save your ID card as an image
                </Text>
              </View>
            </View>

            <View style={styles.instructionItem}>
              <View style={styles.instructionIconContainer}>
                <Image source={createPlaceholderIcon('🖨️')} style={styles.instructionIcon} />
              </View>
              <View style={styles.instructionContent}>
                <Text style={styles.instructionTitle}>2. Print the ID</Text>
                <Text style={styles.instructionDescription}>
                  Visit a nearby printing shop and print on good quality paper
                </Text>
              </View>
            </View>

            <View style={styles.instructionItem}>
              <View style={styles.instructionIconContainer}>
                <Image source={createPlaceholderIcon('🏷️')} style={styles.instructionIcon} />
              </View>
              <View style={styles.instructionContent}>
                <Text style={styles.instructionTitle}>3. Laminate for Protection</Text>
                <Text style={styles.instructionDescription}>
                  Get it laminated to protect from wear and tear
                </Text>
              </View>
            </View>

            <View style={styles.instructionItem}>
              <View style={styles.instructionIconContainer}>
                <Image source={createPlaceholderIcon('👤')} style={styles.instructionIcon} />
              </View>
              <View style={styles.instructionContent}>
                <Text style={styles.instructionTitle}>4. Carry with You</Text>
                <Text style={styles.instructionDescription}>
                  Keep this ID with you when visiting PACS or government offices
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.notesSection}>
          <View style={styles.noteCard}>
            <Image source={createPlaceholderIcon('ℹ️')} style={styles.noteIcon} />
            <View style={styles.noteContent}>
              <Text style={styles.noteTitle}>Important Note</Text>
              <Text style={styles.noteText}>
                This ID card is for identification purposes only. Ensure all details are correct before printing. 
                Contact your PACS office if you need to update any information.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsSection}>
          <Pressable 
            onPress={onSave} 
            style={[styles.downloadBtn, isDownloading && styles.downloadBtnDisabled]}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Text style={styles.downloadBtnText}>Downloading...</Text>
            ) : (
              <>
                <Ionicons name="download-outline" size={20} color="white" />
                <Text style={styles.downloadBtnText}>{t('download_id', 'Download ID Card')}</Text>
              </>
            )}
          </Pressable>

          <Pressable 
            onPress={() => router.push('/profile-edit')} 
            style={styles.editBtn}
          >
            <Ionicons name="create-outline" size={20} color={Brand.green} />
            <Text style={styles.editBtnText}>Edit Profile Info</Text>
          </Pressable>
        </View>
      </ScrollView>
    </MainBackgroundImage>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.screenPadding,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
    paddingTop: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontWeight: '800',
    fontSize: Typography.title,
    color: Brand.green,
  },
  previewSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: Typography.subtitle,
    fontWeight: '700',
    color: Brand.green,
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  toggleBtn: {
    backgroundColor: '#ffffff',
    borderColor: Brand.saffron,
    borderWidth: 1.5,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  toggleActive: {
    backgroundColor: Brand.saffron,
  },
  toggleText: {
    color: Brand.saffron,
    fontWeight: '700',
  },
  toggleTextActive: {
    color: '#ffffff',
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  cardWrapper: {
    alignSelf: 'stretch',
    // lock a consistent size for front/back; adjust as needed
  minHeight: 200,
  },
  instructionsSection: {
    marginBottom: 25,
  },
  instructionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  instructionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Palette.leafLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  instructionIcon: {
    width: 24,
    height: 24,
  },
  instructionContent: {
    flex: 1,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Brand.green,
    marginBottom: 4,
  },
  instructionDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  notesSection: {
    marginBottom: 30,
  },
  noteCard: {
    flexDirection: 'row',
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  noteIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  noteContent: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 4,
  },
  noteText: {
    fontSize: 13,
    color: '#78350f',
    lineHeight: 18,
  },
  actionsSection: {
    gap: 12,
    paddingBottom: 30,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.saffron,
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  downloadBtnDisabled: {
    backgroundColor: '#9ca3af',
  },
  downloadBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: Brand.green,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  editBtnText: {
    color: Brand.green,
    fontSize: 16,
    fontWeight: '600',
  },
});
