import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Brand } from '@/constants/Colors';
import { Typography, Spacing } from '@/constants/Theme';
import { Select } from '@/components/Select';
import { getDistricts, getBlocks, getPacsList, getFarmerTypes, getCropSeasons } from '@/constants/mockData';
import { useI18n } from '@/contexts/i18n';
import { db } from '@/src/config/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import MainBackgroundImage from '@/components/MainBackgroundImage';
import OnboardingHeader from '@/components/OnboardingHeader';
import FormScreen, { FormScreenHandle } from '@/components/FormScreen';
import { InfoTooltip } from '@/components/InfoTooltip';

export default function RegistrationScreen() {
  const { t, lang } = useI18n() as any;
  const formRef = React.useRef<FormScreenHandle>(null);

  const [form, setForm] = React.useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    mobile: '',
    aadhaar: '',
    email: '',
    father_name: '',
    land_area: '',
    khasra: '',
    bank_account: '',
    district: '',
    block: '',
    society_code: '',
    farmer_types: [] as string[],
    crop_types: { rabi: false, kharif: false, dalhan: false },
    photo_uri: '',
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [triedSubmit, setTriedSubmit] = React.useState(false);

  // Input refs for better keyboard navigation
  const firstNameRef = React.useRef<TextInput>(null);
  const middleNameRef = React.useRef<TextInput>(null);
  const lastNameRef = React.useRef<TextInput>(null);
  const mobileRef = React.useRef<TextInput>(null);
  const aadhaarRef = React.useRef<TextInput>(null);
  const emailRef = React.useRef<TextInput>(null);
  const fatherRef = React.useRef<TextInput>(null);
  const landRef = React.useRef<TextInput>(null);
  const khasraRef = React.useRef<TextInput>(null);
  const bankAccRef = React.useRef<TextInput>(null);
  const districtAnchorRef = React.useRef<View>(null);
  const blockAnchorRef = React.useRef<View>(null);

  const setField = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const pacsOptions = React.useMemo(() => {
    const base = getPacsList(lang);
    if (form.district && form.block) {
      const autoCode = `SOC-${(form.district || 'UP').slice(0, 3).toUpperCase()}-${(form.block || 'BLK').slice(0, 3).toUpperCase()}`;
      return [{ value: autoCode, label: `${t('auto', 'Auto')} - ${autoCode}` }, ...base];
    }
    return base;
  }, [lang, t, form.district, form.block]);

  const nameComposed = React.useMemo(() => [form.first_name, form.middle_name, form.last_name].filter(Boolean).join(' ').trim(), [form]);

  const valid = () => {
    const aadhaarOk = /^[2-9]\d{11}$/.test(form.aadhaar.replace(/\s+/g, ''));
    const mobileOk = /^[6-9]\d{9}$/.test(form.mobile);
    const emailOk = !form.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    const landOk = !!form.land_area && parseFloat(form.land_area.replace(',', '.')) > 0;
    const farmerTypesOk = (form.farmer_types && form.farmer_types.length > 0);
    return !!form.first_name && mobileOk && aadhaarOk && emailOk && !!form.father_name && landOk && !!form.khasra && !!form.bank_account && !!form.district && !!form.block && !!form.society_code && farmerTypesOk;
  };

  const errorSummary = React.useMemo(() => {
    const e: string[] = [];
    if (!form.first_name) e.push(t('first_name', 'First name'));
    if (!/^[6-9]\d{9}$/.test(form.mobile)) e.push(t('mobile'));
    if (!/^[2-9]\d{11}$/.test(form.aadhaar.replace(/\s+/g, ''))) e.push(t('aadhaar'));
    if (form.email && !/^([^\s@]+)@([^\s@]+)\.[^\s@]+$/.test(form.email)) e.push(t('email'));
    if (!form.father_name) e.push(t('father_name'));
    if (!(!!form.land_area && parseFloat(form.land_area.replace(',', '.')) > 0)) e.push(t('land_area'));
    if (!form.khasra) e.push(t('khasra'));
    if (!form.bank_account) e.push(t('bank_account'));
    if (!form.district) e.push(t('district'));
    if (!form.block) e.push(t('block'));
    if (!form.society_code) e.push(t('society', 'Society'));
    if (!(form.farmer_types && form.farmer_types.length > 0)) e.push(t('farmer_type'));
    return e;
  }, [form, t]);

  const makeFarmerId = (name: string, mobile: string) => {
    const initials = (name || 'F').split(/\s+/).map((s) => s[0]?.toUpperCase()).join('').slice(0, 2) || 'F';
    const tail = (mobile || '0000000000').slice(-4);
    return `PAC-${initials}-${tail}-${new Date().getFullYear()}`;
  };

  const submit = async () => {
    if (!valid() || submitting) return;
    setSubmitting(true);
    const fullName = nameComposed;
    const normalizedTypes = form.farmer_types;
    const generatedMemberId = `PACS${(form.mobile || '').slice(-4).padStart(4, '0')}${new Date().getFullYear().toString().slice(-2)}`;
    const generatedPacsCode = `SOC-${(form.district || 'UP').slice(0, 3).toUpperCase()}-${(form.block || 'BLK').slice(0, 3).toUpperCase()}`;
    const payload = {
      ...form,
      name: fullName,
      pacs_member: true,
      pacs_member_id: generatedMemberId,
      pacs_name: form.society_code || generatedPacsCode,
      farmer_types: normalizedTypes,
      farmer_type: normalizedTypes[0] || '',
      crop_type: Object.entries(form.crop_types).filter(([_, v]) => v).map(([k]) => k),
    } as any;
    try {
      let uid = (await AsyncStorage.getItem('auth_uid')) || undefined;
      if (!uid) {
        uid = 'L' + Date.now();
        await AsyncStorage.setItem('auth_uid', uid);
      }
      const farmer_id = makeFarmerId(payload.name, payload.mobile);
      await AsyncStorage.multiSet([
        ['profile_payload', JSON.stringify({ ...payload, uid, farmer_id })],
        ['farmer_id', farmer_id],
        ['pending_mobile', form.mobile || ''],
      ]);
      router.push('/onboarding/otp');
      (async () => {
        try {
          await setDoc(doc(db, 'users', uid as string), { ...payload, uid, farmer_id, updatedAt: serverTimestamp() }, { merge: true });
        } catch {}
      })();
    } catch {
      router.push('/onboarding/otp');
    } finally {
      setSubmitting(false);
    }
  };

  const focusFirstInvalid = () => {
    if (!form.first_name) { firstNameRef.current?.focus(); return; }
    if (!/^[6-9]\d{9}$/.test(form.mobile)) { mobileRef.current?.focus(); return; }
    if (!/^[2-9]\d{11}$/.test(form.aadhaar.replace(/\s+/g, ''))) { aadhaarRef.current?.focus(); return; }
    if (form.email && !/^([^\s@]+)@([^\s@]+)\.[^\s@]+$/.test(form.email)) { emailRef.current?.focus(); return; }
    if (!form.father_name) { fatherRef.current?.focus(); return; }
    if (!(!!form.land_area && parseFloat(form.land_area.replace(',', '.')) > 0)) { landRef.current?.focus(); return; }
    if (!form.khasra) { khasraRef.current?.focus(); return; }
    if (!form.bank_account) { bankAccRef.current?.focus(); return; }
    if (!form.district) { formRef.current?.scrollToTarget(districtAnchorRef.current); return; }
    if (!form.block) { formRef.current?.scrollToTarget(blockAnchorRef.current); return; }
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

  // Image picker helpers
  const ensurePicker = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const ImagePicker = require('expo-image-picker');
      await ImagePicker.requestCameraPermissionsAsync?.();
      await ImagePicker.requestMediaLibraryPermissionsAsync?.();
      return ImagePicker;
    } catch (e) {
      Alert.alert('Module missing', 'Please add expo-image-picker to enable photo capture.');
      throw e;
    }
  };
  const takePhoto = async () => {
    try {
      const ImagePicker = await ensurePicker();
      const res = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8, aspect: [3, 4] });
      if (!res.canceled && res.assets?.[0]?.uri) setField('photo_uri', res.assets[0].uri);
    } catch {}
  };
  const pickFromGallery = async () => {
    try {
      const ImagePicker = await ensurePicker();
      const res = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.8, aspect: [3, 4] });
      if (!res.canceled && res.assets?.[0]?.uri) setField('photo_uri', res.assets[0].uri);
    } catch {}
  };

  return (
    <MainBackgroundImage blurIntensity={32} overlayOpacity={0.6}>
      <OnboardingHeader />
      <FormScreen ref={formRef} contentContainerStyle={styles.container}>
        <Text style={styles.title}>{t('welcome')}</Text>
        <Text style={styles.subtitle}>{t('register_to_create')}</Text>

        {/* 1) Name group */}
        <Text style={styles.section}>{`1) ${t('name')} / Name`}</Text>
        <View style={[styles.field, styles.row2]}>
          <View style={styles.col}>
            <Text style={styles.label}>{t('first_name', 'First name')}</Text>
            <TextInput
              ref={firstNameRef}
              style={[styles.input, !form.first_name ? { borderColor: '#ef4444' } : null]}
              value={form.first_name}
              onChangeText={(v) => setField('first_name', v)}
              placeholder={t('first_name_ph', 'Vikram')}
              onFocus={(e) => formRef.current?.scrollToTarget(e.nativeEvent.target)}
              returnKeyType="next"
              onSubmitEditing={() => middleNameRef.current?.focus()}
            />
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>{t('middle_name', 'Middle')}</Text>
            <TextInput
              ref={middleNameRef}
              style={styles.input}
              value={form.middle_name}
              onChangeText={(v) => setField('middle_name', v)}
              placeholder={t('middle_name_ph', 'Kumar')}
              onFocus={(e) => formRef.current?.scrollToTarget(e.nativeEvent.target)}
              returnKeyType="next"
              onSubmitEditing={() => lastNameRef.current?.focus()}
            />
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>{t('last_name', 'Last')}</Text>
            <TextInput
              ref={lastNameRef}
              style={styles.input}
              value={form.last_name}
              onChangeText={(v) => setField('last_name', v)}
              placeholder={t('last_name_ph', 'Singh')}
              onFocus={(e) => formRef.current?.scrollToTarget(e.nativeEvent.target)}
              returnKeyType="next"
              onSubmitEditing={() => mobileRef.current?.focus()}
            />
          </View>
        </View>

  {/* 2) Mobile */}
        <View style={styles.field}>
          <Text style={styles.label}>{`2) ${t('mobile')} / Mobile`}</Text>
          <TextInput
            ref={mobileRef}
            style={[styles.input, !/^[6-9]\d{9}$/.test(form.mobile) && form.mobile ? { borderColor: '#ef4444' } : null]}
            value={form.mobile}
            onChangeText={(v) => setField('mobile', v)}
            placeholder="9876543210"
            keyboardType="number-pad"
            maxLength={10}
            onFocus={(e) => formRef.current?.scrollToTarget(e.nativeEvent.target)}
            returnKeyType="next"
            onSubmitEditing={() => aadhaarRef.current?.focus()}
          />
        </View>

  {/* 3) Aadhaar */}
        <View style={styles.field}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.label}>{`3) ${t('aadhaar')} / Aadhaar`}</Text>
            <InfoTooltip text={t('aadhaar_help_tip', 'Used for verification only. We do not share your Aadhaar.')} />
          </View>
          <TextInput
            ref={aadhaarRef}
            style={[styles.input, !/^[2-9]\d{11}$/.test(form.aadhaar.replace(/\s+/g, '')) && form.aadhaar ? { borderColor: '#ef4444' } : null]}
            value={form.aadhaar}
            onChangeText={(v) => setField('aadhaar', v)}
            placeholder="1234 5678 9012"
            keyboardType="number-pad"
            maxLength={12}
            onFocus={(e) => formRef.current?.scrollToTarget(e.nativeEvent.target)}
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
          />
          <Text style={{ fontSize: 12, color: !/^[2-9]\d{11}$/.test(form.aadhaar.replace(/\s+/g, '')) && form.aadhaar ? '#ef4444' : '#6b7280' }}>{!/^[2-9]\d{11}$/.test(form.aadhaar.replace(/\s+/g, '')) && form.aadhaar ? t('err_aadhaar') : t('help_aadhaar')}</Text>
        </View>

  {/* 4) Email (optional) */}
        <View style={styles.field}>
          <Text style={styles.label}>{`4) ${t('email')} (${t('optional')}) / Email (${t('optional','Optional')})`}</Text>
          <TextInput
            ref={emailRef}
            style={[styles.input, form.email && !/^([^\s@]+)@([^\s@]+)\.[^\s@]+$/.test(form.email) ? { borderColor: '#ef4444' } : null]}
            value={form.email}
            onChangeText={(v) => setField('email', v)}
            placeholder="name@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={(e) => formRef.current?.scrollToTarget(e.nativeEvent.target)}
            returnKeyType="next"
            onSubmitEditing={() => fatherRef.current?.focus()}
          />
          {form.email && !/^([^\s@]+)@([^\s@]+)\.[^\s@]+$/.test(form.email) ? (
            <Text style={{ fontSize: 12, color: '#ef4444' }}>{t('err_email')}</Text>
          ) : null}
        </View>

  {/* 5) Father's name */}
        <View style={styles.field}>
          <Text style={styles.label}>{`5) ${t('father_name')} / Father's name`}</Text>
          <TextInput
            ref={fatherRef}
            style={styles.input}
            value={form.father_name}
            onChangeText={(v) => setField('father_name', v)}
            placeholder="सुरेश कुमार"
            onFocus={(e) => formRef.current?.scrollToTarget(e.nativeEvent.target)}
            returnKeyType="next"
            onSubmitEditing={() => landRef.current?.focus()}
          />
        </View>

  {/* 6) Land area */}
        <View style={styles.field}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.label}>{`6) ${t('land_area')} / Land area (ha)`}</Text>
            <InfoTooltip text={t('land_area_help_tip', 'Enter in hectares (e.g., 1.25). Approximate values are okay.')} />
          </View>
          <TextInput
            ref={landRef}
            style={[styles.input, !(parseFloat(form.land_area.replace(',', '.')) > 0) && form.land_area ? { borderColor: '#ef4444' } : null]}
            value={form.land_area}
            onChangeText={(v) => {
              // Handle both comma and period as decimal separators
              let cleaned = v.replace(/[^0-9.,]/g, ''); // Allow digits, comma, and period
              cleaned = cleaned.replace(/,/g, '.'); // Convert comma to period for consistency
              cleaned = cleaned.replace(/(\..*)\./, '$1'); // Only allow one decimal point
              setField('land_area', cleaned);
            }}
            placeholder="1.25"
            keyboardType="decimal-pad"
            onFocus={(e) => formRef.current?.scrollToTarget(e.nativeEvent.target)}
            returnKeyType="next"
            onSubmitEditing={() => khasraRef.current?.focus()}
          />
        </View>

  {/* 7) Khasra */}
        <View style={styles.field}>
          <Text style={styles.label}>{`7) ${t('khasra')} / Khasra`}</Text>
          <TextInput
            ref={khasraRef}
            style={styles.input}
            value={form.khasra}
            onChangeText={(v) => setField('khasra', v)}
            placeholder="47892"
            onFocus={(e) => formRef.current?.scrollToTarget(e.nativeEvent.target)}
            returnKeyType="next"
            onSubmitEditing={() => bankAccRef.current?.focus()}
          />
        </View>

  {/* 8) Bank account */}
        <View style={styles.field}>
          <Text style={styles.label}>{`8) ${t('bank_account')} / Bank A/C`}</Text>
          <TextInput
            ref={bankAccRef}
            style={styles.input}
            value={form.bank_account}
            onChangeText={(v) => setField('bank_account', v)}
            placeholder="123456789012"
            keyboardType="number-pad"
            onFocus={(e) => formRef.current?.scrollToTarget(e.nativeEvent.target)}
            returnKeyType="next"
            onSubmitEditing={() => formRef.current?.scrollToTarget(districtAnchorRef.current)}
          />
        </View>

  {/* 9) District */}
        <View ref={districtAnchorRef} style={styles.field}>
          <Select
            label={`9) ${t('district')} / District`}
            value={form.district || null}
            options={getDistricts(lang)}
            onChange={(v) => setForm((f) => ({ ...f, district: v as string, block: '', society_code: '' }))}
            placeholder={t('select_district', 'Select district')}
            required
            error={!form.district ? t('err_required') : ''}
          />
        </View>

  {/* 10) Block */}
        <View ref={blockAnchorRef} style={styles.field}>
          <Select
            label={`10) ${t('block')} / Block`}
            value={form.block || null}
            options={getBlocks(lang, form.district)}
            onChange={(v) => setForm((f) => ({ ...f, block: v as string }))}
            placeholder={t('select_block', 'Select block')}
            required
            error={!form.block ? t('err_required') : ''}
          />
        </View>

  {/* 11) Society */}
        <View style={styles.field}>
          <Select
            label={`11) ${t('society', 'Society')} / Society`}
            value={form.society_code || null}
            options={pacsOptions}
            onChange={(v) => setField('society_code', v)}
            placeholder={t('select_society', 'Select society/cooperative')}
            required
            error={!form.society_code ? t('err_required') : ''}
          />
        </View>

        {/* 12) Farmer type */}
        <Text style={styles.section}>{`12) ${t('farmer_type')} / Farmer type`}</Text>
        <View style={styles.row}>
          {getFarmerTypes(lang).map((ft) => {
            const active = (form.farmer_types || []).includes(ft.value as string);
            return (
              <Pill
                key={ft.value}
                label={`${ft.label}`}
                active={active}
                onPress={() => setForm((f) => {
                  const set = new Set(f.farmer_types || []);
                  if (set.has(ft.value as string)) set.delete(ft.value as string); else set.add(ft.value as string);
                  return { ...f, farmer_types: Array.from(set) };
                })}
              />
            );
          })}
        </View>

        {/* 13) Crop season */}
        <Text style={styles.section}>{`13) ${t('crop_season')} / Crop season`}</Text>
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

        {/* 14) Photo at the end */}
        <Text style={styles.section}>{`14) ${t('upload_photo', 'Upload your photo')}`}</Text>
        <View style={{ gap: 10, alignItems: 'flex-start' }}>
          {form.photo_uri ? (
            <Image source={{ uri: form.photo_uri }} style={{ width: 96, height: 128, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb' }} />
          ) : (
            <View style={{ width: 96, height: 128, borderRadius: 8, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e5e7eb' }}>
              <Text style={{ color: '#9ca3af' }}>No photo</Text>
            </View>
          )}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable onPress={takePhoto} style={[styles.smallBtn, { backgroundColor: Brand.saffron }]}>
              <Text style={styles.smallBtnText}>{t('take_photo', 'Take photo')}</Text>
            </Pressable>
            <Pressable onPress={pickFromGallery} style={[styles.smallBtn, { backgroundColor: '#10b981' }]}>
              <Text style={styles.smallBtnText}>{t('choose_photo', 'Choose from gallery')}</Text>
            </Pressable>
          </View>
        </View>

        {/* Submit */}
        <View style={{ gap: 8, marginTop: 12, marginBottom: 24 }}>
          <Text style={{ fontSize: 12, color: '#6b7280' }}>
            {t('id_will_be', 'Your ID will be')}: {makeFarmerId(nameComposed, form.mobile)}
          </Text>
          <Pressable
            disabled={submitting || !valid()}
            onPress={() => { if (!valid()) { setTriedSubmit(true); focusFirstInvalid(); return; } submit(); }}
            style={[styles.submit, (!valid() || submitting) && styles.submitDisabled]}
          >
            <Text style={styles.submitText}>{submitting ? '...' : `${t('submit_register')} / Register`}</Text>
          </Pressable>
          {triedSubmit && !valid() && errorSummary.length > 0 ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorTitle}>{t('missing_fields', 'Please complete the following:')}</Text>
              <Text style={styles.errorList}>{errorSummary.join(', ')}</Text>
            </View>
          ) : null}
        </View>
      </FormScreen>
    </MainBackgroundImage>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.screenPadding, gap: 10 },
  title: { fontSize: Typography.title, fontWeight: '800', textAlign: 'center' },
  subtitle: { fontSize: Typography.subtitle, color: '#637488', textAlign: 'center', marginBottom: 6 },
  section: { fontSize: Typography.section, fontWeight: '800', marginTop: Spacing.sectionTop },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  row2: { flexDirection: 'row', gap: 10 },
  col: { flex: 1 },
  field: { gap: Spacing.fieldGap, marginTop: 10 },
  label: { fontSize: Typography.label, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 18,
    fontSize: Typography.input,
    backgroundColor: '#fff',
    minHeight: 56,
  },
  pill: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#cbd5e1', backgroundColor: '#ffffff' },
  pillActive: { backgroundColor: Brand.saffron, borderColor: Brand.saffron },
  pillText: { fontSize: Typography.label },
  pillTextActive: { color: '#ffffff', fontWeight: '700' },
  smallBtn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
  smallBtnText: { color: '#ffffff', fontWeight: '700' },
  submit: { backgroundColor: Brand.saffron, paddingVertical: 16, borderRadius: 12, marginTop: 16 },
  submitDisabled: { backgroundColor: Brand.saffronDisabledSolid },
  submitText: { color: '#ffffff', textAlign: 'center', fontWeight: '800', fontSize: Typography.button },
  errorBox: { marginTop: 10, padding: 12, borderRadius: 10, backgroundColor: '#FFF5F5', borderWidth: 1, borderColor: '#FECACA' },
  errorTitle: { fontWeight: '800', color: '#991B1B', marginBottom: 4 },
  errorList: { color: '#991B1B' },
});
