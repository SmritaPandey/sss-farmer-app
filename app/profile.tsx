import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Brand } from '@/constants/Colors';
import { router } from 'expo-router';

export default function ProfileScreen() {
	const [farmerId, setFarmerId] = React.useState<string | null>(null);

	React.useEffect(() => {
		(async () => {
			try {
				const id = await AsyncStorage.getItem('farmer_id');
				setFarmerId(id);
			} catch {}
		})();
	}, []);

	return (
		<View style={styles.container}>
			<View style={styles.card}>
				<Text style={styles.title}>मेरी प्रोफाइल</Text>
				<Text style={styles.caption}>किसान आईडी</Text>
				<Text style={styles.value}>{farmerId ?? '—'}</Text>
				<Pressable style={styles.primary}><Text style={styles.primaryText}>जानकारी संपादित करें</Text></Pressable>
				<Pressable style={[styles.primary, { backgroundColor: '#fee2e2' }]} onPress={async () => { await AsyncStorage.multiRemove(['auth_uid','onboarding_completed']); router.replace('/onboarding/language'); }}>
					<Text style={[styles.primaryText, { color: '#b91c1c' }]}>Sign out</Text>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#fff', padding: 16 },
	card: { backgroundColor: Brand.saffron, borderRadius: 16, padding: 16 },
	title: { color: '#fff', fontWeight: '800', fontSize: 18, marginBottom: 8 },
	caption: { color: '#fff', opacity: 0.9 },
	value: { color: '#fff', fontWeight: '800', fontSize: 20, marginTop: 2 },
	primary: { backgroundColor: '#fff', borderRadius: 10, paddingVertical: 12, marginTop: 14 },
	primaryText: { textAlign: 'center', color: Brand.saffron, fontWeight: '800' },
});
