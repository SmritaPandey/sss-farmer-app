import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Brand } from '@/constants/Colors';
import { Typography, Spacing } from '@/constants/Theme';
import { Select } from '@/components/Select';
import { getDistricts, getBlocks, getCommittees, getPacsList, getFarmerTypes, getCropSeasons } from '@/constants/mockData';
import { useI18n } from '@/contexts/i18n';
import { db } from '@/src/config/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function RegistrationScreen() {
  const { t, lang } = useI18n() as any;
  const [pacsMember, setPacsMember] = React.useState<'yes' | 'no'>('no');
  const [form, setForm] = React.useState({
    pacs_name: '',
    district: '',
    block: '',
    committee: '',
    aadhaar: '',
  mobile: '',
    father_name: '',
    land_area: '',
    khasra: '',
    farmer_type: '',
    crop_types: { rabi: false, kharif: false, dalhan: false },
  });
  const [submitting, setSubmitting] = React.useState(false);

  const setField = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const valid = () => {
    const aadhaarOk = /^[2-9]\d{11}$/.test(form.aadhaar.replace(/\s+/g, ''));
    const mobileOk = /^[6-9]\d{9}$/.test(form.mobile);
    const landOk = parseFloat(form.land_area.replace(',', '.')) > 0;
    const cropOk = form.crop_types.rabi || form.crop_types.kharif || form.crop_types.dalhan;
    if (pacsMember === 'yes' && !form.pacs_name) return false;
    return (
      !!form.district && !!form.block && !!form.committee && aadhaarOk && mobileOk && !!form.father_name && landOk && !!form.khasra && !!form.farmer_type && cropOk
    );
  };

  const submit = async () => {
    if (!valid() || submitting) return;
    setSubmitting(true);
    const payload = {
      pacs_member: pacsMember === 'yes',
      ...form,
      crop_type: Object.entries(form.crop_types)
        .filter(([_, v]) => v)
        .map(([k]) => k),
    };
    try {
      const uid = (await AsyncStorage.getItem('auth_uid')) || undefined;
      if (uid) {
        await setDoc(doc(db, 'users', uid), {
          ...payload,
          uid,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }
      await AsyncStorage.multiSet([
        ['onboarding_completed', '1'],
        ['profile_payload', JSON.stringify(payload)],
      ]);
      router.replace('/(tabs)');
    } catch (e) {
      // Fallback to local cache only
      await AsyncStorage.multiSet([
        ['onboarding_completed', '1'],
        ['profile_payload', JSON.stringify(payload)],
      ]);
      router.replace('/(tabs)');
    } finally {
      setSubmitting(false);
    }
  };

  // Prefill mobile from verified OTP (if available)
  React.useEffect(() => {
    (async () => {
      try {
        const m = await AsyncStorage.getItem('verified_phone');
        if (m) setForm((f) => ({ ...f, mobile: m }));
      } catch {}
    })();
  }, []);

  const Pill = ({ label, active, onPress }: any) => (
    <Pressable onPress={onPress} style={[styles.pill, active && styles.pillActive]}>
      <Text style={[styles.pillText, active && styles.pillTextActive]}>{label}</Text>
    </Pressable>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
  <Text style={styles.title}>{t('welcome')}</Text>
  <Text style={styles.subtitle}>{t('register_to_create')}</Text>

  <Text style={styles.section}>{t('pacs_member')}</Text>
      <View style={styles.row}>
        <Pill label="हाँ" active={pacsMember === 'yes'} onPress={() => setPacsMember('yes')} />
        <Pill label="नहीं" active={pacsMember === 'no'} onPress={() => setPacsMember('no')} />
      </View>

      {pacsMember === 'yes' && (
    <View style={styles.field}>
          <Select
            label={`${t('pacs_name')} / PACS`}
            value={form.pacs_name || null}
      options={getPacsList(lang)}
            onChange={(v) => setField('pacs_name', v)}
            placeholder="Select PACS"
      required
      error={pacsMember === 'yes' && !form.pacs_name ? t('err_required') : ''}
          />
        </View>
      )}

      <View style={styles.row2}>
        <View style={[styles.field, styles.col]}>
          <Select
            label={`${t('district')} / District`}
            value={form.district || null}
            options={getDistricts(lang)}
            onChange={(v) => {
              setForm((f) => ({ ...f, district: v as string, block: '' }));
            }}
            placeholder="Select district"
            required
            error={!form.district ? t('err_required') : ''}
          />
        </View>
        <View style={[styles.field, styles.col]}>
          <Select
            label={`${t('block')} / Block`}
            value={form.block || null}
            options={getBlocks(lang, form.district)}
            onChange={(v) => setField('block', v)}
            placeholder="Select block"
            required
            error={!form.block ? t('err_required') : ''}
          />
        </View>
      </View>

      <View style={styles.field}>
        <Select
          label={`${t('committee')} / Committee`}
          value={form.committee || null}
          options={getCommittees(lang)}
          onChange={(v) => setField('committee', v)}
          placeholder="Select committee"
          required
          error={!form.committee ? t('err_required') : ''}
        />
      </View>

      <View style={styles.field}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={styles.label}>{`${t('aadhaar')} / Aadhaar`}</Text>
        </View>
        <TextInput style={[styles.input, !/^[2-9]\d{11}$/.test(form.aadhaar.replace(/\s+/g, '')) && form.aadhaar ? { borderColor: '#ef4444' } : null]} value={form.aadhaar} onChangeText={(t) => setField('aadhaar', t)} placeholder="1234 5678 9012" keyboardType="number-pad" />
        <Text style={{ fontSize: 12, color: !/^[2-9]\d{11}$/.test(form.aadhaar.replace(/\s+/g, '')) && form.aadhaar ? '#ef4444' : '#6b7280' }}>{!/^[2-9]\d{11}$/.test(form.aadhaar.replace(/\s+/g, '')) && form.aadhaar ? t('err_aadhaar') : t('help_aadhaar')}</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>{`${t('mobile')} / Mobile`}</Text>
        <TextInput style={[styles.input, !/^[6-9]\d{9}$/.test(form.mobile) && form.mobile ? { borderColor: '#ef4444' } : null]} value={form.mobile} onChangeText={(t) => setField('mobile', t)} placeholder="9876543210" keyboardType="number-pad" />
        <Text style={{ fontSize: 12, color: !/^[6-9]\d{9}$/.test(form.mobile) && form.mobile ? '#ef4444' : '#6b7280' }}>{!/^[6-9]\d{9}$/.test(form.mobile) && form.mobile ? t('err_mobile') : t('help_mobile')}</Text>
      </View>

      <View style={styles.field}>
  <Text style={styles.label}>{`${t('father_name')} / Father's name`}</Text>
        <TextInput style={styles.input} value={form.father_name} onChangeText={(t) => setField('father_name', t)} placeholder="सुरेश कुमार" />
      </View>

      <View style={styles.row2}>
        <View style={[styles.field, styles.col]}>
          <Text style={styles.label}>{`${t('land_area')} / Land area (ha)`}</Text>
          <TextInput style={[styles.input, !(parseFloat(form.land_area.replace(',', '.')) > 0) && form.land_area ? { borderColor: '#ef4444' } : null]} value={form.land_area} onChangeText={(t) => setField('land_area', t)} placeholder="1.25" keyboardType="decimal-pad" />
          <Text style={{ fontSize: 12, color: !(parseFloat(form.land_area.replace(',', '.')) > 0) && form.land_area ? '#ef4444' : '#6b7280' }}>{t('help_land')}</Text>
        </View>
        <View style={[styles.field, styles.col]}>
          <Text style={styles.label}>{`${t('khasra')} / Khasra`}</Text>
          <TextInput style={styles.input} value={form.khasra} onChangeText={(t) => setField('khasra', t)} placeholder="47892" />
        </View>
      </View>

  <Text style={styles.section}>{`${t('farmer_type')} / Farmer type`}</Text>
      <View style={styles.row}>
  {getFarmerTypes(lang).map((ft) => (
          <Pill key={ft.value} label={`${ft.label}`} active={form.farmer_type === ft.value} onPress={() => setField('farmer_type', ft.value)} />
        ))}
      </View>

  <Text style={styles.section}>{`${t('crop_season')} / Crop season`}</Text>
      <View style={styles.row}>
  {getCropSeasons(lang).map((s) => (
          <Pill
            key={s.value}
            label={s.label}
            active={(form.crop_types as any)[s.value]}
            onPress={() => setForm((f) => ({ ...f, crop_types: { ...f.crop_types, [s.value]: !(f.crop_types as any)[s.value] } }))}
          />
        ))}
      </View>

      <Pressable disabled={!valid() || submitting} onPress={submit} style={[styles.submit, (!valid() || submitting) && styles.submitDisabled]}>
        <Text style={styles.submitText}>{submitting ? '...' : `${t('submit_register')} / Register`}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.screenPadding, gap: 12, backgroundColor: '#fff' },
  logo: { width: 72, height: 72, alignSelf: 'center', marginBottom: 8 },
  title: { fontSize: Typography.title, fontWeight: '800', textAlign: 'center' },
  subtitle: { fontSize: Typography.subtitle, color: '#637488', textAlign: 'center', marginBottom: 8 },
  section: { fontSize: Typography.section, fontWeight: '800', marginTop: Spacing.sectionTop },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  row2: { flexDirection: 'row', gap: 8 },
  col: { flex: 1 },
  field: { gap: Spacing.fieldGap, marginTop: 8 },
  label: { fontSize: Typography.label },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 14, fontSize: Typography.input, backgroundColor: '#fff' },
  pill: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: '#cbd5e1' },
  pillActive: { backgroundColor: '#FFF4E8', borderColor: Brand.saffron },
  pillText: { fontSize: Typography.label },
  pillTextActive: { color: Brand.saffron, fontWeight: '700' },
  submit: { backgroundColor: Brand.saffron, paddingVertical: 16, borderRadius: 12, marginTop: 16 },
  submitDisabled: { backgroundColor: '#ffcd9f' },
  submitText: { color: 'white', textAlign: 'center', fontWeight: '800', fontSize: Typography.button },
});
