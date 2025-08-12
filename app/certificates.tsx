import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import MainBackgroundImage from '@/components/MainBackgroundImage';
import { Brand, Palette } from '@/constants/Colors';
import { Typography, Spacing } from '@/constants/Theme';
import { useI18n } from '@/contexts/i18n';
import { createPlaceholderIcon, getIcon } from '@/assets/icons';

interface Certificate {
  id: string;
  title: string;
  description: string;
  issueDate: string;
  status: 'available' | 'pending' | 'expired';
  type: 'income' | 'land' | 'farmer' | 'crop' | 'loan';
  icon: any;
}

const mockCertificates: Certificate[] = [
  {
    id: '1',
    title: 'Farmer Registration Certificate',
    description: 'Official farmer registration document issued by PACS',
    issueDate: '15 Jan 2024',
    status: 'available',
    type: 'farmer',
    icon: getIcon('certificates'),
  },
  {
    id: '2',
    title: 'Income Certificate',
    description: 'Annual income verification for government schemes',
    issueDate: '22 Feb 2024',
    status: 'available',
    type: 'income',
    icon: createPlaceholderIcon('💰'),
  },
  {
    id: '3',
    title: 'Land Ownership Certificate',
    description: 'Land revenue records and ownership verification',
    issueDate: '08 Mar 2024',
    status: 'available',
    type: 'land',
    icon: createPlaceholderIcon('🏞️'),
  },
  {
    id: '4',
    title: 'Crop Insurance Certificate',
    description: 'Pradhan Mantri Fasal Bima Yojana coverage document',
    issueDate: 'Pending',
    status: 'pending',
    type: 'crop',
    icon: createPlaceholderIcon('🌾'),
  },
  {
    id: '5',
    title: 'KCC Loan Certificate',
    description: 'Kisan Credit Card loan approval and terms',
    issueDate: '12 Dec 2023',
    status: 'expired',
    type: 'loan',
    icon: createPlaceholderIcon('💳'),
  },
];

export default function CertificatesScreen() {
  const { t } = useI18n();
  const [certificates] = React.useState<Certificate[]>(mockCertificates);

  const downloadCertificate = (certificate: Certificate) => {
    if (certificate.status === 'available') {
      Alert.alert(
        'Download Certificate',
        `Download ${certificate.title}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Download', 
            onPress: () => {
              // Simulate download
              Alert.alert('Success', 'Certificate downloaded successfully!');
            }
          }
        ]
      );
    } else if (certificate.status === 'pending') {
      Alert.alert('Pending', 'This certificate is still being processed. Please check back later.');
    } else {
      Alert.alert('Expired', 'This certificate has expired. Please apply for renewal.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'expired': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'available': return '#d1fae5';
      case 'pending': return '#fef3c7';
      case 'expired': return '#fee2e2';
      default: return '#f3f4f6';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Available';
      case 'pending': return 'Processing';
      case 'expired': return 'Expired';
      default: return 'Unknown';
    }
  };

  const availableCount = certificates.filter(c => c.status === 'available').length;
  const pendingCount = certificates.filter(c => c.status === 'pending').length;

  return (
    <MainBackgroundImage>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Brand.green} />
          </Pressable>
          <Text style={styles.title}>{t('certificates', 'My Certificates')}</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{availableCount}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#f59e0b' }]}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Processing</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#ef4444' }]}>{certificates.length - availableCount - pendingCount}</Text>
            <Text style={styles.statLabel}>Expired</Text>
          </View>
        </View>

        <View style={styles.certificatesList}>
          <Text style={styles.sectionTitle}>All Certificates</Text>
          
          {certificates.map((certificate) => (
            <Pressable
              key={certificate.id}
              style={styles.certificateCard}
              onPress={() => downloadCertificate(certificate)}
            >
              <View style={styles.certificateHeader}>
                <View style={styles.iconContainer}>
                  <Image source={certificate.icon} style={styles.certificateIcon} />
                </View>
                
                <View style={styles.certificateInfo}>
                  <Text style={styles.certificateTitle}>{certificate.title}</Text>
                  <Text style={styles.certificateDescription}>{certificate.description}</Text>
                  <Text style={styles.certificateDate}>
                    {certificate.status === 'pending' ? 'Status: Processing' : `Issued: ${certificate.issueDate}`}
                  </Text>
                </View>

                <View style={styles.certificateActions}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(certificate.status) }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(certificate.status) }]}>
                      {getStatusText(certificate.status)}
                    </Text>
                  </View>
                  
                  <Pressable 
                    style={[
                      styles.actionBtn,
                      certificate.status === 'available' ? styles.downloadBtn : styles.disabledBtn
                    ]}
                    onPress={() => downloadCertificate(certificate)}
                  >
                    <Ionicons 
                      name={certificate.status === 'available' ? 'download-outline' : 'time-outline'} 
                      size={20} 
                      color={certificate.status === 'available' ? 'white' : '#6b7280'} 
                    />
                  </Pressable>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.helpSection}>
          <View style={styles.helpCard}>
            <Image source={createPlaceholderIcon('💡')} style={styles.helpIcon} />
            <View style={styles.helpContent}>
              <Text style={styles.helpTitle}>Need Help?</Text>
              <Text style={styles.helpText}>
                Contact your PACS office for certificate-related queries or visit the nearest CSC center.
              </Text>
            </View>
          </View>
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
    marginBottom: 20,
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
  title: { 
    fontWeight: '800', 
    fontSize: Typography.title,
    color: Brand.green,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 25,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: Brand.green,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  certificatesList: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: Typography.subtitle,
    fontWeight: '700',
    color: Brand.green,
    marginBottom: 15,
  },
  certificateCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  certificateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: Palette.leafLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  certificateIcon: {
    width: 40,
    height: 40,
  },
  certificateInfo: {
    flex: 1,
  },
  certificateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.green,
    marginBottom: 4,
  },
  certificateDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 18,
    marginBottom: 6,
  },
  certificateDate: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  certificateActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadBtn: {
    backgroundColor: Brand.saffron,
  },
  disabledBtn: {
    backgroundColor: '#f3f4f6',
  },
  helpSection: {
    marginBottom: 30,
  },
  helpCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  helpIcon: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.green,
    marginBottom: 6,
  },
  helpText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});
