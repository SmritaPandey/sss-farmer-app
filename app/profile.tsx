import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Brand } from '@/constants/Colors';
import { router } from 'expo-router';
import WatermarkBackground from '@/components/WatermarkBackground';
import FarmerCard from '@/components/FarmerCard';

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
			<WatermarkBackground>
				<View style={styles.container}>
					<Text style={styles.screenTitle}>मेरी प्रोफाइल</Text>

					{/* ATM-style farmer card */}
					<FarmerCard
						name={'विक्रम कुमार'}
						pacsName={'काशीपुर नं. 11 प्राथमिक कृषि सहकारी समिति लि.'}
						farmerId={farmerId}
						district={'अमेठी'}
						block={'जगदीशपुर'}
					/>

					<Text style={styles.section}>मेरी जानकारी</Text>
					<View style={styles.fieldBox}><Text style={styles.fieldLabel}>नाम</Text><Text style={styles.fieldValue}>विक्रम कुमार</Text></View>
					<View style={styles.fieldBox}><Text style={styles.fieldLabel}>पैक्स नाम</Text><Text style={styles.fieldValue}>काशीपुर नं. 11 प्राथमिक कृषि सहकारी समिति लि.</Text></View>
					<View style={styles.fieldBox}><Text style={styles.fieldLabel}>मोबाइल नंबर</Text><Text style={styles.fieldValue}>+91 8069897155</Text></View>
					<View style={styles.fieldBox}><Text style={styles.fieldLabel}>आधार संख्या</Text><Text style={styles.fieldValue}>1234 5678 9012</Text></View>
					<View style={styles.fieldBox}><Text style={styles.fieldLabel}>ईमेल आईडी</Text><Text style={styles.fieldValue}>vikram@example.com</Text></View>

					<Pressable style={styles.editBtn}><Text style={styles.editText}>जानकारी संपादित करें</Text></Pressable>
					<Pressable style={styles.signOut} onPress={async () => { await AsyncStorage.multiRemove(['auth_uid','onboarding_completed']); router.replace('/onboarding/language'); }}>
						<Text style={styles.signOutText}>Sign out</Text>
					</Pressable>
				</View>
			</WatermarkBackground>
		);
}

const styles = StyleSheet.create({
		container: { flex: 1, padding: 16, gap: 12 },
		screenTitle: { fontSize: 18, fontWeight: '800' },
		section: { fontWeight: '800', marginTop: 8 },
		fieldBox: { borderWidth: 1.5, borderColor: '#ffedd5', backgroundColor: '#fff7ed', borderRadius: 10, padding: 12 },
		fieldLabel: { color: '#9a3412', marginBottom: 2 },
		fieldValue: { fontWeight: '700', color: '#7c2d12' },
		editBtn: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: Brand.saffron, borderRadius: 10, paddingVertical: 12 },
		editText: { textAlign: 'center', color: Brand.saffron, fontWeight: '800' },
		signOut: { backgroundColor: '#fee2e2', borderRadius: 10, paddingVertical: 12 },
		signOutText: { textAlign: 'center', color: '#b91c1c', fontWeight: '800' },
});
