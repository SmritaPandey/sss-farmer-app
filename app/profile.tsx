import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Brand } from '@/constants/Colors';
import { router, useFocusEffect } from 'expo-router';
import MainBackgroundImage from '@/components/MainBackgroundImage';
import FarmerCard from '@/components/FarmerCard';
import FarmerCardBack from '@/components/FarmerCardBack';
import { useI18n } from '@/contexts/i18n';
import { getPacsList } from '@/constants/mockData';
import { maskAadhaar } from '@/src/utils/format';

export default function ProfileScreen() {
	const { t, lang } = useI18n() as any;
	const [farmerId, setFarmerId] = React.useState<string | null>(null);
	const [profile, setProfile] = React.useState<any | null>(null);
	const [showBack, setShowBack] = React.useState(false);

	const pacsLabel = React.useMemo(() => {
		const code = profile?.pacs_name;
		if (!code) return '';
		try {
			const list = getPacsList(lang);
			const found = list.find((i: any) => i.value === code);
			return found?.label || code;
		} catch {
			return code;
		}
	}, [profile?.pacs_name, lang]);

	React.useEffect(() => {
	(async () => {
			try {
				const id = await AsyncStorage.getItem('farmer_id');
				setFarmerId(id);
		const cached = await AsyncStorage.getItem('profile_payload');
		if (cached) setProfile(JSON.parse(cached));
			} catch {}
		})();
	}, []);

	useFocusEffect(
		React.useCallback(() => {
			let active = true;
			(async () => {
				try {
					const cached = await AsyncStorage.getItem('profile_payload');
					if (cached && active) setProfile(JSON.parse(cached));
				} catch {}
			})();
			return () => { active = false; };
		}, [])
	);

		return (
			<MainBackgroundImage blurIntensity={30} overlayOpacity={0.4} showWatermark={true}>
				<ScrollView contentContainerStyle={styles.container}>
					<Text style={styles.screenTitle}>{t('my_profile')}</Text>

					{/* ID card preview with front/back toggle */}
					<View style={styles.cardSection}>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
							<Text style={styles.section}>{t('farmer_card', 'Farmer ID Card')}</Text>
							<Pressable onPress={() => setShowBack((s) => !s)} style={[styles.toggleBtn, showBack && styles.toggleActive]}>
								<Text style={[styles.toggleText, showBack && styles.toggleTextActive]}>{showBack ? 'पीछे' : 'सामने'}</Text>
							</Pressable>
						</View>
						<View style={styles.cardContainer}>
							<View style={styles.cardWrapper}>
								{showBack ? (
									<FarmerCardBack profile={profile} />
								) : (
									<FarmerCard
										name={profile?.name || t('name')}
										pacsName={pacsLabel}
										farmerId={farmerId}
										district={profile?.district || ''}
										block={profile?.block || ''}
										avatarUri={profile?.photo_uri || null}
									/>
								)}
							</View>
						</View>
					</View>

					<Text style={styles.section}>{t('my_info')}</Text>
					  <View style={styles.fieldBox}><Text style={styles.fieldLabel}>{t('name')}</Text><Text style={styles.fieldValue}>{profile?.name || ''}</Text></View>
					  <View style={styles.fieldBox}><Text style={styles.fieldLabel}>{t('pacs_name')}</Text><Text style={styles.fieldValue}>{pacsLabel}</Text></View>
					  <View style={styles.fieldBox}><Text style={styles.fieldLabel}>{t('mobile')}</Text><Text style={styles.fieldValue}>{profile?.mobile ? `+91 ${profile.mobile}` : ''}</Text></View>
					  <View style={styles.fieldBox}><Text style={styles.fieldLabel}>{t('aadhaar')}</Text><Text style={styles.fieldValue}>{maskAadhaar(profile?.aadhaar)}</Text></View>
					  <View style={styles.fieldBox}><Text style={styles.fieldLabel}>{t('email')}</Text><Text style={styles.fieldValue}>{profile?.email || ''}</Text></View>
					  {profile?.tehsil ? (<View style={styles.fieldBox}><Text style={styles.fieldLabel}>{t('tehsil')}</Text><Text style={styles.fieldValue}>{profile.tehsil}</Text></View>) : null}

					  <Pressable style={styles.editBtn} onPress={() => router.push('/profile-edit')}><Text style={styles.editText}>{t('edit_info')}</Text></Pressable>
					<Pressable style={styles.editBtn} onPress={() => router.push('/id-card')}><Text style={styles.editText}>{t('download_id', 'Download ID card')}</Text></Pressable>
					<Pressable style={styles.signOut} onPress={async () => { await AsyncStorage.multiRemove(['auth_uid','onboarding_completed']); router.replace('/onboarding/language'); }}>
						<Text style={styles.signOutText}>{t('sign_out')}</Text>
					</Pressable>
				</ScrollView>
			</MainBackgroundImage>
		);
}

const styles = StyleSheet.create({
		container: { padding: 16, gap: 12, paddingBottom: 120 },
		screenTitle: { fontSize: 18, fontWeight: '800' },
		section: { fontWeight: '800', marginTop: 8 },
		fieldBox: { borderWidth: 1.5, borderColor: '#ffedd5', backgroundColor: '#fff7ed', borderRadius: 10, padding: 12 },
		fieldLabel: { color: '#9a3412', marginBottom: 2 },
		fieldValue: { fontWeight: '700', color: '#7c2d12' },
		editBtn: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: Brand.saffron, borderRadius: 10, paddingVertical: 12 },
		editText: { textAlign: 'center', color: Brand.saffron, fontWeight: '800' },
		signOut: { backgroundColor: '#fee2e2', borderRadius: 10, paddingVertical: 12 },
		signOutText: { textAlign: 'center', color: '#b91c1c', fontWeight: '800' },
		cardSection: { gap: 8 },
		cardContainer: {
			backgroundColor: 'white',
			borderRadius: 12,
			padding: 16,
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.1,
			shadowRadius: 4,
			elevation: 3,
		},
		cardWrapper: {
			alignSelf: 'stretch',
			minHeight: 200,
		},
		toggleBtn: {
			backgroundColor: '#ffffff',
			borderColor: Brand.saffron,
			borderWidth: 1.5,
			paddingVertical: 6,
			paddingHorizontal: 12,
			borderRadius: 999,
		},
		toggleActive: { backgroundColor: Brand.saffron },
		toggleText: { color: Brand.saffron, fontWeight: '700' },
		toggleTextActive: { color: '#ffffff' },
});
