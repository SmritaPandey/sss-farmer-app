import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Brand, Palette } from '@/constants/Colors';
import { Typography, Spacing } from '@/constants/Theme';
import MainBackgroundImage from '@/components/MainBackgroundImage';
import Tile from '@/components/Tile';
import { useI18n } from '@/contexts/i18n';
import { createPlaceholderIcon, AgricultureIcons, getIcon, getCartIcon, getNotificationIcon } from '@/assets/icons';

export default function HomeScreen() {
  const { t } = useI18n();
  const [farmerId, setFarmerId] = React.useState<string | null>(null);
  const [name, setName] = React.useState<string>('');
  const [bannerIndex, setBannerIndex] = React.useState(0);
  const [bannerWidth, setBannerWidth] = React.useState(Dimensions.get('window').width - Spacing.screenPadding * 2);
  const bannerRef = React.useRef<ScrollView>(null);
  const autoTimer = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const isDragging = React.useRef(false);

  const banners = React.useMemo(() => ([
    {
      title: t('pmkisan_title', 'PM-Kisan Samman Nidhi Yojana'),
      sub: t('pmkisan_sub', 'Benefits, eligibility, and how to apply'),
      cta: t('learn_more', 'Learn more'),
      route: '/govt-schemes',
      bg: '#EAF8F0',
    },
    {
      title: t('purchase', 'Purchase'),
      sub: t('fert_banner_sub', 'Check availability and place requests'),
      cta: t('open', 'Open'),
      route: '/purchase',
      bg: Brand.saffronSurface,
    },
    {
      title: t('govt_schemes', 'Govt Schemes'),
      sub: t('schemes_banner_sub', 'Explore benefits you’re eligible for'),
      cta: t('browse', 'Browse'),
      route: '/govt-schemes',
      bg: '#E9F5FF',
    },
  ]), [t]);

  // Auto-advance banners
  const startAuto = React.useCallback(() => {
    if (autoTimer.current) return;
    autoTimer.current = setInterval(() => {
      if (isDragging.current) return;
      setBannerIndex((i) => {
        const next = (i + 1) % banners.length;
        const x = next * Math.max(1, bannerWidth);
        bannerRef.current?.scrollTo({ x, animated: true });
        return next;
      });
    }, 4000);
  }, [banners.length, bannerWidth]);

  const stopAuto = React.useCallback(() => {
    if (autoTimer.current) {
      clearInterval(autoTimer.current);
      autoTimer.current = null;
    }
  }, []);

  React.useEffect(() => {
    startAuto();
    return () => stopAuto();
  }, [startAuto, stopAuto]);

  React.useEffect(() => {
    (async () => {
      try {
        const id = await AsyncStorage.getItem('farmer_id');
        setFarmerId(id);
        const cached = await AsyncStorage.getItem('profile_payload');
        if (cached) {
          const p = JSON.parse(cached);
          if (p?.name) setName(p.name);
        }
      } catch {}
    })();
  }, []);

  const Card = ({ title, onPress, icon, image }: { title: string; onPress: () => void; icon?: any; image?: any }) => (
    <Tile title={title} onPress={onPress} icon={icon} image={image} />
  );

  return (
    <MainBackgroundImage blurIntensity={30} overlayOpacity={0.4} showWatermark={true}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topbar}>
          <View style={{ width: 40 }} />
          <View style={styles.headerIcons}>
            <Pressable accessibilityLabel="Cart" onPress={() => router.push('/cart')} style={[styles.iconBtn, { backgroundColor: Palette.sunLight, borderColor: Palette.outlineSun }] }>
              <Image source={getCartIcon()} style={styles.headerIcon} />
            </Pressable>
            <Pressable accessibilityLabel="Notifications" onPress={() => router.push('/notifications')} style={[styles.iconBtn, { backgroundColor: Palette.leafLight, borderColor: Palette.outlineLeaf }] }>
              <Image source={getNotificationIcon()} style={styles.headerIcon} />
            </Pressable>
            <Pressable accessibilityLabel="Profile" onPress={() => router.push('/profile')} style={[styles.iconBtn, { backgroundColor: Palette.skyLight, borderColor: '#DAECF8' }] }>
              <Image source={getIcon('profile')} style={styles.headerIcon} />
            </Pressable>
          </View>
        </View>

  <Text style={styles.greet}>{t('welcome')}</Text>
  <Text style={styles.name}>{name || ''}</Text>

        <View
          onLayout={(e) => setBannerWidth(e.nativeEvent.layout.width)}
          style={styles.bannerOuter}
        >
          <ScrollView
            ref={bannerRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScrollBeginDrag={() => { isDragging.current = true; stopAuto(); }}
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / Math.max(1, bannerWidth));
              setBannerIndex(idx);
              isDragging.current = false;
              startAuto();
            }}
          >
            {banners.map((b, i) => (
              <View key={i} style={[styles.banner, { width: bannerWidth, backgroundColor: b.bg }] }>
                <Text accessibilityRole="header" style={styles.bannerTitle}>{b.title}</Text>
                <Text style={styles.bannerSub}>{b.sub}</Text>
                <Pressable
                  onPress={() => router.push(b.route as any)}
                  style={styles.bannerCta}
                  accessibilityLabel={`${b.title}. ${b.cta}`}
                >
                  <Text style={styles.bannerCtaText}>{b.cta} →</Text>
                </Pressable>
              </View>
            ))}
          </ScrollView>
          <View style={styles.dotsWrap}>
            {banners.map((_, i) => (
              <View key={i} style={[styles.dot, i === bannerIndex && styles.dotActive]} />
            ))}
          </View>
        </View>

        <Text style={styles.section}>{t('available_services')}</Text>
        <View style={styles.grid}>
          <Card title={t('purchase')} image={getIcon('fertilizer')} onPress={() => router.push('/purchase')} />
          <Card title={t('loans', 'Loans')} image={getIcon('pacs')} onPress={() => router.push('/loans')} />
          <Card title={t('sell')} image={getIcon('procurement')} onPress={() => router.push('/sell')} />
          <Card title={t('govt_schemes')} image={getIcon('schemes')} onPress={() => router.push('/govt-schemes')} />
          <Card title={t('pacs_directory')} image={getIcon('directory')} onPress={() => router.push('/pacs-directory')} />
          <Card title={t('certificates')} image={getIcon('certificates')} onPress={() => router.push('/certificates')} />
          <Card title={t('settings')} image={getIcon('settings')} onPress={() => router.push('/settings')} />
          <Card title={t('my_profile')} image={getIcon('profile')} onPress={() => router.push('/profile')} />
        </View>
      </ScrollView>
    </MainBackgroundImage>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.screenPadding, gap: 14 },
  topbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 2, paddingBottom: 6 },
  headerIcons: { flexDirection: 'row', gap: 12 },
  iconBtn: { width: 40, height: 40, borderRadius: 14, backgroundColor: Brand.saffronSurface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Brand.saffronBorder },
  headerIcon: { width: 22, height: 22 },
  greet: { fontSize: Typography.subtitle, color: '#1f2937' },
  name: { fontSize: Typography.title, fontWeight: '800' },
  bannerOuter: { borderRadius: 20, overflow: 'hidden', borderColor: '#E5F0EB', borderWidth: 1, minHeight: 180 },
  banner: { backgroundColor: '#ffffff', paddingBottom: 18 },
  // inner banner content approximation
  bannerTitle: { color: '#0a4b2a', fontWeight: '800', fontSize: Typography.cardTitle + 6, paddingTop: 18, paddingHorizontal: 18 },
  bannerSub: { color: '#0a4b2a', opacity: 0.9, marginTop: 6, fontSize: Typography.subtitle, paddingHorizontal: 18, paddingBottom: 12 },
  bannerCta: { alignSelf: 'flex-start', marginTop: 8, marginHorizontal: 18, backgroundColor: Brand.saffron, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12 },
  bannerCtaText: { color: '#fff', fontWeight: '800' },
  dotsWrap: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingBottom: 14 },
  dot: { width: 8, height: 8, borderRadius: 8, backgroundColor: '#d1fae5' },
  dotActive: { backgroundColor: Brand.saffron },
  section: { marginTop: Spacing.sectionTop + 8, fontWeight: '800', fontSize: Typography.section },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { 
    flexBasis: '48%', 
    backgroundColor: '#fff', 
    borderWidth: 1, 
    borderColor: '#e5e7eb', 
    borderRadius: 12, 
    padding: 20,
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  cardTitle: { fontSize: Typography.cardTitle, fontWeight: '700', color: Brand.green, marginTop: 8 },
});
