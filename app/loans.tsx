import React from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import WatermarkBackground from '@/components/WatermarkBackground';
import { Typography, Spacing } from '@/constants/Theme';
import { Brand } from '@/constants/Colors';
import { useI18n } from '@/contexts/i18n';
import FormScreen, { FormScreenHandle } from '@/components/FormScreen';

type LoanType = 'agri' | 'non-agri';

export default function LoansScreen() {
  const { t } = useI18n();
  const [tab, setTab] = React.useState<'apply' | 'history'>('apply');
  const [loanType, setLoanType] = React.useState<LoanType>('agri');
  const formRef = React.useRef<FormScreenHandle>(null);
  const [form, setForm] = React.useState({
    purpose: '',
    amount: '',
    tenureMonths: '',
    members: '',
    memberLimit: '',
    collateral: '',
    income: '',
  });

  const History = () => (
    <View style={{ gap: 10 }}>
      <Text style={styles.section}>{t('history', 'History')}</Text>
      <View style={styles.card}><Text>12 Jan 2025 · KCC · ₹1,50,000 · Approved</Text></View>
      <View style={styles.card}><Text>21 Jul 2024 · Personal · ₹75,000 · Closed</Text></View>
    </View>
  );

  const Apply = () => (
    <View style={{ gap: 12 }}>
  <Text style={styles.section}>{t('loans_application', 'Application')}</Text>
      <View style={styles.pillsRow}>
        {(['agri','non-agri'] as LoanType[]).map((lt) => {
          const on = loanType === lt;
          return (
            <Pressable key={lt} onPress={() => setLoanType(lt)} style={[styles.pill, on && styles.pillOn]}>
      <Text style={[styles.pillText, on && styles.pillTextOn]}>{lt === 'agri' ? t('loans_type_agri','Agricultural') : t('loans_type_non_agri','Non-Agricultural')}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.card}>
        <Field
          label={t('loans_purpose','Purpose of loan')}
          value={form.purpose}
          onChange={(v) => setForm({ ...form, purpose: v })}
          onFocus={(e) => formRef.current?.scrollToTarget(e.nativeEvent.target)}
        />
        <Field
          label={t('loans_amount','Loan amount (₹)')}
          keyboardType="number-pad"
          value={form.amount}
          onChange={(v) => setForm({ ...form, amount: v })}
          onFocus={(e) => formRef.current?.scrollToTarget(e.nativeEvent.target)}
        />
        <Field
          label={t('loans_tenure_months','Tenure (months)')}
          keyboardType="number-pad"
          value={form.tenureMonths}
          onChange={(v) => setForm({ ...form, tenureMonths: v })}
          onFocus={(e) => formRef.current?.scrollToTarget(e.nativeEvent.target)}
        />
        <Field
          label={t('loans_members','No. of members')}
          keyboardType="number-pad"
          value={form.members}
          onChange={(v) => setForm({ ...form, members: v })}
          onFocus={(e) => formRef.current?.scrollToTarget(e.nativeEvent.target)}
        />
        <Field
          label={t('loans_member_limit','Member limit')}
          keyboardType="number-pad"
          value={form.memberLimit}
          onChange={(v) => setForm({ ...form, memberLimit: v })}
          onFocus={(e) => formRef.current?.scrollToTarget(e.nativeEvent.target)}
        />
        <Field
          label={t('loans_collateral','Collateral (if any)')}
          value={form.collateral}
          onChange={(v) => setForm({ ...form, collateral: v })}
          onFocus={(e) => formRef.current?.scrollToTarget(e.nativeEvent.target)}
        />
        <Field
          label={t('loans_income','Annual income (₹)')}
          keyboardType="number-pad"
          value={form.income}
          onChange={(v) => setForm({ ...form, income: v })}
          onFocus={(e) => formRef.current?.scrollToTarget(e.nativeEvent.target)}
        />
        <Pressable style={styles.primary} onPress={() => { /* TODO: persist application */ }}>
          <Text style={styles.primaryText}>{t('submit','Submit')}</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <WatermarkBackground>
      <FormScreen
        ref={formRef}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>{t('loans', 'Loans')}</Text>
        <View style={styles.tabs}>
          <Pressable onPress={() => setTab('apply')} style={[styles.tab, tab==='apply' && styles.tabOn]}><Text style={[styles.tabText, tab==='apply' && styles.tabTextOn]}>{t('loans_apply_tab','Apply')}</Text></Pressable>
          <Pressable onPress={() => setTab('history')} style={[styles.tab, tab==='history' && styles.tabOn]}><Text style={[styles.tabText, tab==='history' && styles.tabTextOn]}>{t('loans_history_tab','History')}</Text></Pressable>
        </View>
        {tab === 'apply' ? <Apply /> : <History />}
      </FormScreen>
    </WatermarkBackground>
  );
}

function Field({ label, value, onChange, keyboardType, onFocus }: { label: string; value: string; onChange: (v: string) => void; keyboardType?: 'default'|'number-pad'|'decimal-pad'; onFocus?: (e: any) => void }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
  <TextInput style={styles.input} value={value} onChangeText={onChange} keyboardType={keyboardType} onFocus={onFocus} placeholderTextColor="#9CA3AF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.screenPadding, gap: 12 },
  title: { fontSize: Typography.section, fontWeight: '800', color: Brand.green },
  tabs: { flexDirection: 'row', gap: 8 },
  tab: { flex: 1, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingVertical: 10, alignItems: 'center', backgroundColor: '#fff' },
  tabOn: { backgroundColor: Brand.saffron, borderColor: Brand.saffron },
  tabText: { color: '#111' },
  tabTextOn: { color: '#fff', fontWeight: '700' },
  section: { fontWeight: '800', marginTop: Spacing.sectionTop, fontSize: Typography.section - 2, color: Brand.green },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  pillsRow: { flexDirection: 'row', gap: 8 },
  pill: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#fff' },
  pillOn: { backgroundColor: Brand.saffron, borderColor: Brand.saffron },
  pillText: { color: '#111' },
  pillTextOn: { color: '#fff', fontWeight: '700' },
  fieldLabel: { marginBottom: 6, color: '#111' },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 10 },
  primary: { backgroundColor: Brand.saffron, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  primaryText: { color: '#fff', fontWeight: '800' },
});
