import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, RefreshControl, Pressable } from 'react-native';
import WatermarkBackground from '@/components/WatermarkBackground';
// import { pacsDirectory } from '@/constants/models';
import { useI18n } from '@/contexts/i18n';
import { Brand } from '@/constants/Colors';
import { getPacsList } from '@/constants/mockData';
import { api } from '@/src/config/api';

export default function PacsDirectoryScreen() {
  const { t } = useI18n();
  const [loading, setLoading] = React.useState(true);
  const [pacs, setPacs] = React.useState<Array<{ id: string; name: string; district?: string; block?: string; contact?: string }>>([]);
  const [err, setErr] = React.useState<string | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);

  const load = React.useCallback(async (opts?: { refresh?: boolean }) => {
    let ignore = false;
    try {
      if (opts?.refresh) { setRefreshing(true); } else { setLoading(true); }
      setErr(null);
      const res = await fetch(api.url('/pacs'));
      if (!res.ok) throw new Error('Http ' + res.status);
      const data = await res.json();
      if (!ignore) setPacs(data);
    } catch (e: any) {
      if (!ignore) {
        setErr(e?.message || 'error');
        // Fallback to mock PACS list
        const mock = getPacsList('en').map((p, i) => ({ id: String(i + 1), name: p.label }));
        setPacs(mock);
      }
    } finally {
      if (opts?.refresh) { if (!ignore) setRefreshing(false); } else { if (!ignore) setLoading(false); }
    }
    return () => { ignore = true; };
  }, []);

  React.useEffect(() => { load(); }, [load]);
  return (
    <WatermarkBackground>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load({ refresh: true })} />}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>{t('pacs_directory')}</Text>
        {loading ? (
          <ActivityIndicator />
    ) : err ? (
          <View style={{ gap: 8 }}>
      <Text style={{ color: '#b91c1c' }}>{t('error_loading', 'Could not load from server. Showing mock directory')}</Text>
            <Pressable onPress={() => load()} style={{ alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#ffffff', borderWidth: 2, borderColor: Brand.saffron }}>
              <Text style={{ color: Brand.saffron, fontWeight: '700' }}>{t('retry', 'Retry')}</Text>
            </Pressable>
          </View>
        ) : pacs.length === 0 ? (
          <Text>{t('empty_list')}</Text>
        ) : (
          pacs.map((p) => (
            <View key={p.id} style={{ paddingVertical: 8 }}>
              <Text style={{ fontWeight: '700' }}>{p.name}</Text>
              <Text>{p.block}, {p.district}</Text>
              {p.contact ? <Text>{p.contact}</Text> : null}
            </View>
          ))
        )}
      </ScrollView>
    </WatermarkBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 8 },
  title: { fontWeight: '800', fontSize: 18 },
});
