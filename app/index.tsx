import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

export default function Index() {
  const [initial, setInitial] = React.useState<'loading' | 'home' | 'onboarding'>('loading');

  React.useEffect(() => {
    (async () => {
      try {
        const [uid, seen] = await AsyncStorage.multiGet(['auth_uid', 'onboarding_completed']);
        if (uid?.[1]) {
          // Logged in
          if (seen?.[1]) setInitial('home');
          else setInitial('onboarding');
        } else {
          setInitial('onboarding');
        }
      } catch {
        setInitial('onboarding');
      }
    })();
  }, []);

  if (initial === 'loading') return null;
  if (initial === 'home') return <Redirect href="/(tabs)" />;
  return <Redirect href="/onboarding/language" />;
}
