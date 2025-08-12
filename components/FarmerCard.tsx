import React from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import { useI18n } from '@/contexts/i18n';
import { Brand } from '@/constants/Colors';
import { getMainBackgroundImage, getYogiImage, getJPSRathoreImage, getUserImage } from '@/assets/icons';

// Visual "ATM-style" farmer card like in the screenshot
export const FarmerCard = ({
  name,
  pacsName,
  farmerId,
  district,
  block,
  avatarUri,
}: {
  name: string;
  pacsName?: string;
  farmerId?: string | null;
  district?: string;
  block?: string;
  avatarUri?: string | null;
}) => {
  // Card labels are always shown in Hindi, regardless of app language
  // Create a 16-digit member ID from available ID digits; pad with random digits to avoid plain zeros
  const digitsOnly = String(farmerId ?? '').replace(/\D/g, '');
  const member16Raw = React.useMemo(() => {
    const base = digitsOnly.slice(0, 16);
    if (base.length >= 16) return base;
    const needed = 16 - base.length;
    const randPad = Array.from({ length: needed }, () => Math.floor(Math.random() * 10)).join('');
    return base + randPad;
  }, [digitsOnly]);
  const member16Display = React.useMemo(() => member16Raw.replace(/(\d{4})(?!$)/g, '$1 '), [member16Raw]);
  const issueDate = React.useMemo(() => {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }, []);
  return (
    <View style={styles.card}>
  {/* Top logos replaced: JPS Rathore (left) and Yogi Adityanath (right) */}
  <Image source={getJPSRathoreImage()} style={styles.cornerLogoLeft} />
  <Image source={getYogiImage()} style={styles.cornerLogoRight} />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* App logo removed */}
          <View style={{ flex: 1 }}>
            <Text style={[styles.dept, { textAlign: 'center' }]}>सहकारिता विभाग उत्तर प्रदेश</Text>
            <Text style={[styles.label, { textAlign: 'center' }]}>सहकार से समृद्धि किसान कार्ड</Text>
          </View>
        </View>
      </View>
  <ImageBackground source={getMainBackgroundImage()} style={styles.bgArea}>
        <View style={styles.row}>
          <View style={styles.avatarWrap}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <Image source={getUserImage()} style={styles.avatar} />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{name}</Text>
            <View style={styles.memberCol}>
              <Text style={styles.memberIdBig} numberOfLines={1}>{member16Display}</Text>
              <View style={styles.issueBlock}>
                <Text style={styles.issueLabel}>जारी करने की तिथि</Text>
                <Text style={styles.issueDate}>{issueDate}</Text>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F4FFE8',
    borderRadius: 12,
    overflow: 'hidden',
  height: 200,
    borderColor: '#DCF7C3',
    borderWidth: 1,
    position: 'relative',
  },
  cornerLogoLeft: { position: 'absolute', top: 2, left: 8, width: 36, height: 40, zIndex: 1, borderRadius: 4 },
  cornerLogoRight: { position: 'absolute', top: 5, right: 8, width: 36, height: 40, zIndex: 2, borderRadius: 4 },
  header: {
  backgroundColor: Brand.saffron,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 4,
  },
  dept: { color: '#FFFFFF', fontSize: 12 },
  label: { color: 'white', fontWeight: '800', fontSize: 14 },
  bgArea: { flex: 1, paddingHorizontal: 12, paddingBottom: 12, paddingTop: 12 },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  avatarWrap: { width: 70, height: 70, borderRadius: 8, overflow: 'hidden', backgroundColor: '#fff' },
  avatar: { width: '100%', height: '100%' },
  avatarPh: { backgroundColor: '#E6EDE3' },
  name: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  nameLabel: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  meta: { color: '#FFFFFF', opacity: 0.95 },
  id: { fontWeight: '800', color: '#FFFFFF', marginTop: 2 },
  memberLabel: { color: '#FFFFFF', opacity: 0.95, fontSize: 12 },
  memberIdBig: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.5, marginTop: 2 },
  memberRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-end', marginTop: 4 },
  memberCol: { gap: 2, marginTop: 4 },
  issueBlock: { alignItems: 'flex-end', minWidth: 120 },
  issueLabel: { color: '#FFFFFF', opacity: 0.95, fontSize: 12 },
  issueDate: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', marginTop: 2 },
});

export default FarmerCard;
