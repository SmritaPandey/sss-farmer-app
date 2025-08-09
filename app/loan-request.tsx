import React from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Brand } from '@/constants/Colors';
import { Select } from '@/components/Select';
import { getLoanCrops, getTenures, getPacsList, getCommittees } from '@/constants/mockData';
import { useI18n } from '@/contexts/i18n';

export default function LoanRequestScreen() {
  const { t, lang } = useI18n() as any;
  const [form, setForm] = React.useState({ crop: '', amount: '10,000', tenure: '1y', pacs: 'pacs_kashipur_2', committee: 'pratkalna', mobile: '9876543210' });
  const setField = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const [submitting, setSubmitting] = React.useState(false);
  const canSubmit = !!form.crop && !!form.tenure && !!form.pacs && !!form.committee && !!form.amount;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{`${t('kcc_request')} (KCC Loan – Request)`}</Text>

      <View style={styles.field}>
        <Select label={`${t('crop')} / Crop`} required error={!form.crop ? t('err_required') : ''} value={form.crop || null} options={getLoanCrops(lang)} onChange={(v) => setField('crop', v as string)} placeholder="Select crop" />
      </View>

      <View style={styles.field}><Text style={styles.label}>{`${t('amount')} / Amount`}</Text><TextInput style={styles.input} value={form.amount} onChangeText={(t) => setField('amount', t)} /></View>

      <View style={styles.field}>
        <Select label={`${t('tenure')} / Tenure`} required error={!form.tenure ? t('err_required') : ''} value={form.tenure || null} options={getTenures(lang)} onChange={(v) => setField('tenure', v as string)} placeholder="Select tenure" />
      </View>

      <View style={styles.field}>
        <Select label={`${t('pacs')} / PACS`} required error={!form.pacs ? t('err_required') : ''} value={form.pacs || null} options={getPacsList(lang)} onChange={(v) => setField('pacs', v as string)} />
      </View>
      <View style={styles.field}>
        <Select label={`${t('committee')} / Committee`} required error={!form.committee ? t('err_required') : ''} value={form.committee || null} options={getCommittees(lang)} onChange={(v) => setField('committee', v as string)} />
      </View>
      <View style={styles.field}><Text style={styles.label}>{`${t('mobile')} / Mobile`}</Text><Text style={styles.readonly}>{form.mobile}</Text></View>

      <Pressable disabled={!canSubmit || submitting} style={[styles.primary, (!canSubmit || submitting) && { opacity: 0.6 }]} onPress={() => { if (!canSubmit) return; setSubmitting(true); setTimeout(() => setSubmitting(false), 500); }}>
        <Text style={styles.primaryText}>{submitting ? '...' : `${t('request')} / Submit`}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', padding: 16, gap: 12 },
  title: { fontWeight: '800', fontSize: 18 },
  field: { gap: 6, marginTop: 8 },
  label: { fontSize: 14 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 12, fontSize: 16 },
  readonly: { padding: 12, backgroundColor: '#f3f4f6', borderRadius: 10 },
  primary: { backgroundColor: Brand.saffron, paddingVertical: 14, borderRadius: 10, marginTop: 16 },
  primaryText: { color: '#fff', textAlign: 'center', fontWeight: '800' },
});
