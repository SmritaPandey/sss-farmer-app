import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import WatermarkBackground from '@/components/WatermarkBackground';
import { procurements } from '@/constants/models';
import { useI18n } from '@/contexts/i18n';
import { createPlaceholderIcon, getIcon } from '@/assets/icons';

export default function ProcurementStatusScreen() {
  const { t } = useI18n();
  const [loading] = React.useState(false);
  const items = procurements;
  
  const getCropIcon = (crop: string) => {
    const cropIcons: Record<string, string> = {
      'Wheat': '🌾',
      'Rice': '🌾',
      'Corn': '🌽',
      'Paddy': '🌾'
    };
    return cropIcons[crop] || '🌾';
  };

  return (
    <WatermarkBackground>
      <View style={styles.container}>
        <Text style={styles.title}>{t('procurement_status')}</Text>
        {loading ? <ActivityIndicator /> : items.length === 0 ? (
          <Text>{t('empty_list')}</Text>
        ) : (
          items.map((rec) => (
            <View key={rec.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Image 
                  source={createPlaceholderIcon(getCropIcon(rec.crop))} 
                  style={styles.cropIcon} 
                />
                <View style={styles.itemDetails}>
                  <Text style={styles.cropName}>{rec.crop} · {rec.qtyKg} kg @ ₹{rec.rate}</Text>
                  <Text style={styles.itemDate}>{rec.date}</Text>
                </View>
                <View style={[styles.statusBadge, rec.status === 'paid' ? styles.statusPaid : styles.statusPending]}>
                  <Text style={styles.statusText}>{rec.status === 'paid' ? 'Paid' : 'Pending'}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </WatermarkBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 8 },
  title: { fontWeight: '800', fontSize: 18 },
  itemCard: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 16, 
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  itemHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12 
  },
  cropIcon: { 
    width: 32, 
    height: 32 
  },
  itemDetails: { 
    flex: 1 
  },
  cropName: { 
    fontWeight: '700', 
    fontSize: 16 
  },
  itemDate: { 
    color: '#6b7280', 
    fontSize: 14, 
    marginTop: 2 
  },
  statusBadge: { 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 6 
  },
  statusPaid: { 
    backgroundColor: '#dcfce7' 
  },
  statusPending: { 
    backgroundColor: '#fef3c7' 
  },
  statusText: { 
    fontSize: 12, 
    fontWeight: '600' 
  }
});
