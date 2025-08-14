import React, { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

export default function LegacyFertilizerRequestRedirect() {
	useEffect(() => {
		router.replace('/purchase');
	}, []);
	return <View />;
}

