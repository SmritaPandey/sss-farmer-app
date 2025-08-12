import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Brand } from '@/constants/Colors';
import { getMainBackgroundImage } from '@/assets/icons';
import { useI18n } from '@/contexts/i18n';
import { getBlocks, getDistricts, getFarmerTypes, getPacsList } from '@/constants/mockData';

type Props = {
  profile: any;
};

export default function FarmerCardBack({ profile }: Props) {
  const { lang } = useI18n() as any;

  // Localize values to current language (labels remain Hindi per requirement)
  const farmerTypeLabel = React.useMemo(() => {
    const opts = getFarmerTypes(lang);
    const selected: string[] = Array.isArray(profile?.farmer_types) && profile.farmer_types.length > 0
      ? profile.farmer_types
      : (profile?.farmer_type ? [profile.farmer_type] : []);
    const labels = selected
      .map((val) => {
        const found = opts.find((o: any) => o.value === val || o.label === val);
        return found?.label || String(val);
      })
      .filter(Boolean);
    return labels.join(', ');
  }, [lang, profile?.farmer_types, profile?.farmer_type]);

  const pacsLabel = React.useMemo(() => {
    const opts = getPacsList(lang);
    const found = opts.find((o: any) => o.value === profile?.pacs_name || o.label === profile?.pacs_name);
    return found?.label || profile?.pacs_name || profile?.committee || '';
  }, [lang, profile?.pacs_name, profile?.committee]);

  const districtLabel = React.useMemo(() => {
    const opts = getDistricts(lang);
    const found = opts.find((o: any) => o.value === profile?.district || o.label === profile?.district);
    return found?.label || profile?.district || '';
  }, [lang, profile?.district]);

  const blockLabel = React.useMemo(() => {
    const opts = getBlocks(lang, profile?.district);
    const found = opts.find((o: any) => o.value === profile?.block || o.label === profile?.block);
    return found?.label || profile?.block || '';
  }, [lang, profile?.block, profile?.district]);

  // All labels in Hindi as requested
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.headerText}>सहकार से समृद्धि किसान कार्ड</Text>
      </View>
      <ImageBackground source={getMainBackgroundImage()} style={styles.bgArea}>
        <View style={styles.list}>
          <Row label="पिता का नाम" value={profile?.father_name || ''} />
          <Row label="समिति का नाम" value={pacsLabel} />
          <Row label="किसान का प्रकार" value={farmerTypeLabel} />
          <Row label="विकास खंड" value={blockLabel} />
          <Row label="जिला" value={districtLabel} />
          <Row label="पिन कोड" value={profile?.pincode || ''} />
        </View>
        <View style={styles.qrPlaceholder}>
          <Text style={styles.qrText}>QR</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.inlineText}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.sep}>: </Text>
        <Text style={styles.value}>{value}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F4FFE8',
    borderRadius: 12,
    overflow: 'hidden',
    borderColor: '#DCF7C3',
    borderWidth: 1,
    height: 200,
  },
  header: {
    backgroundColor: Brand.saffron,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  headerText: { color: 'white', fontWeight: '800', fontSize: 14, textAlign: 'center' },
  bgArea: { padding: 12, flex: 1, position: 'relative' },
  list: { gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
  inlineText: { flexShrink: 1 },
  label: { color: '#FFFFFF', fontWeight: '700' },
  sep: { color: '#FFFFFF', fontWeight: '700' },
  value: { color: '#FFFFFF', fontWeight: '700' },
  qrPlaceholder: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrText: { color: '#FFFFFF', fontWeight: '800' },
});
