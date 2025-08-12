import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useI18n } from '@/contexts/i18n';

export default function NotFoundScreen() {
  const { t } = useI18n();
  return (
    <>
      <Stack.Screen options={{ title: t('not_found_title', 'Oops!') }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">{t('not_found_message', 'This screen does not exist.')}</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">{t('go_home', 'Go to home screen!')}</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
