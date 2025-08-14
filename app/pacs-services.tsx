import React from 'react';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';

export default function LegacyPacsServicesRedirect() {
  useEffect(() => {
    router.replace('/loans');
  }, []);
  return <View />;
}
