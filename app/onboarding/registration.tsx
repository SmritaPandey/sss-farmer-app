import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Brand } from '@/constants/Colors';
import { Typography, Spacing } from '@/constants/Theme';
import { Select } from '@/components/Select';
import { getDistricts, getBlocks, getPacsList, getFarmerTypes, getCropSeasons, getPincodeByDistrictBlock, lookupPacsMember } from '@/constants/mockData';
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
  // PACS/member info removed from registration; added a single Society (free text)
  const [form, setForm] = React.useState({
    name: '',
  society_name: '',
    district: '',
    block: '',
    // tehsil and committee removed per new requirement
    aadhaar: '',
    mobile: '',
    email: '',
    village: '',
    pincode: '',
    father_name: '',
    land_area: '',
    khasra: '',
  farmer_type: '', // deprecated; will use farmer_types
  farmer_types: [] as string[],
    crop_types: { rabi: false, kharif: false, dalhan: false },
    photo_uri: '',
    // Optional banking
    bank_name: '',
    bank_account: '',
    ifsc: '',
  });
  const [submitting, setSubmitting] = React.useState(false);
  // tehsil removed per new requirement; options no longer needed

  // Input refs for Next/Done navigation
  const nameRef = React.useRef<TextInput>(null);
  const aadhaarRef = React.useRef<TextInput>(null);
  const mobileRef = React.useRef<TextInput>(null);
  const emailRef = React.useRef<TextInput>(null);
  const villageRef = React.useRef<TextInput>(null);
  const pincodeRef = React.useRef<TextInput>(null);
  const fatherRef = React.useRef<TextInput>(null);
  const landRef = React.useRef<TextInput>(null);
  const khasraRef = React.useRef<TextInput>(null);
  const bankNameRef = React.useRef<TextInput>(null);
  const bankAccRef = React.useRef<TextInput>(null);
  const ifscRef = React.useRef<TextInput>(null);
  const districtAnchorRef = React.useRef<View>(null);
  const blockAnchorRef = React.useRef<View>(null);
  // committee removed
  const [triedSubmit, setTriedSubmit] = React.useState(false);

  const setField = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const valid = () => {
    const aadhaarOk = /^[2-9]\d{11}$/.test(form.aadhaar.replace(/\s+/g, ''));
    const mobileOk = /^[6-9]\d{9}$/.test(form.mobile);
    const emailOk = !form.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    const pinOk = /^[1-9][0-9]{5}$/.test(form.pincode);
    const ifscOk = !form.ifsc || /^[A-Z]{4}0[0-9A-Z]{6}$/.test(form.ifsc.toUpperCase());
    const landOk = form.land_area === '' ? true : parseFloat(form.land_area.replace(',', '.')) > 0;
    // Crop season not compulsory per request
    const cropOk = true;
  // Tehsil removed from form
  const tehsilOk = true;
    const farmerTypesOk = (form.farmer_types && form.farmer_types.length > 0) || !!form.farmer_type;
    return (
      !!form.name && !!form.village && !!form.pincode && !!form.district && !!form.block && !!form.society_name &&
      aadhaarOk && mobileOk && emailOk && pinOk && !!form.father_name && landOk && !!form.khasra && farmerTypesOk && cropOk && tehsilOk && ifscOk
    );
  };

  const errorSummary = React.useMemo(() => {
    const errors: string[] = [];
    if (!form.name) errors.push(t('name'));
    if (!form.village) errors.push(t('village'));
    if (!form.pincode) errors.push(t('pincode'));
  if (!form.district) errors.push(t('district'));
    if (!form.block) errors.push(t('block'));
  if (!form.society_name) errors.push(t('society', 'Society'));
  // committee removed
    if (!/^[2-9]\d{11}$/.test(form.aadhaar.replace(/\s+/g, ''))) errors.push(t('aadhaar'));
    if (!/^[6-9]\d{9}$/.test(form.mobile)) errors.push(t('mobile'));
    if (form.email && !/^([^\s@]+)@([^\s@]+)\.[^\s@]+$/.test(form.email)) errors.push(t('email'));
    if (!form.father_name) errors.push(t('father_name'));
    if (!(form.land_area === '' ? true : parseFloat(form.land_area.replace(',', '.')) > 0)) errors.push(t('land_area'));
    if (!form.khasra) errors.push(t('khasra'));
    if (!((form.farmer_types && form.farmer_types.length > 0) || form.farmer_type)) errors.push(t('farmer_type'));
    return errors;
  }, [form, t]);

  const makeFarmerId = (name: string, mobile: string) => {
    const initials = (name || 'F').split(/\s+/).map((s) => s[0]?.toUpperCase()).join('').slice(0, 2) || 'F';
    const tail = (mobile || '0000000000').slice(-4);
    return `PAC-${initials}-${tail}-${new Date().getFullYear()}`;
  };

  const submit = async () => {
    if (!valid() || submitting) return;
    setSubmitting(true);
    const normalizedFarmerTypes = (form.farmer_types && form.farmer_types.length > 0)
      ? form.farmer_types
      : (form.farmer_type ? [form.farmer_type] : []);
    const generatedMemberId = `PACS${(form.mobile || '').slice(-4).padStart(4, '0')}${new Date().getFullYear().toString().slice(-2)}`;
    const generatedPacsCode = `SOC-${(form.district || 'UP').slice(0,3).toUpperCase()}-${(form.block || 'BLK').slice(0,3).toUpperCase()}`;
    const payload = {
      pacs_member: true,
      ...form,
      pacs_member_id: generatedMemberId,
      pacs_name: generatedPacsCode,
      farmer_types: normalizedFarmerTypes,
      farmer_type: normalizedFarmerTypes[0] || '',
      crop_type: Object.entries(form.crop_types)
        .filter(([_, v]) => v)
        .map(([k]) => k),
    };
    try {
      // Ensure UID exists (even if OTP not completed)
      let uid = (await AsyncStorage.getItem('auth_uid')) || undefined;
      if (!uid) {
        uid = 'L' + Date.now();
        await AsyncStorage.setItem('auth_uid', uid);
      }

      // Generate a displayable farmer_id for card and profile
  const farmer_id = makeFarmerId(payload.name, payload.mobile);

      // Save local flags and navigate to OTP verification
      await AsyncStorage.multiSet([
        ['profile_payload', JSON.stringify({ ...payload, uid, farmer_id })],
        ['farmer_id', farmer_id],
      ]);
      router.push('/onboarding/otp');

      // Firestore write in background (best-effort)
      (async () => {
        try {
          await setDoc(
            doc(db, 'users', uid as string),
            { ...payload, uid, farmer_id, updatedAt: serverTimestamp() },
            { merge: true }
          );
        } catch (e) {
          // Ignore; user has already navigated and data is cached locally
        }
      })();
    } catch (e) {
      // Fallback to local cache only and navigate
      try {
        let uid = (await AsyncStorage.getItem('auth_uid')) || undefined;
        if (!uid) {
          uid = 'L' + Date.now();
          await AsyncStorage.setItem('auth_uid', uid);
        }
        const farmer_id = makeFarmerId(payload.name, payload.mobile);
        await AsyncStorage.multiSet([
          ['onboarding_completed', '1'],
          ['profile_payload', JSON.stringify({ ...payload, uid, farmer_id })],
          ['farmer_id', farmer_id],
        ]);
      } finally {
        router.push('/onboarding/otp');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const focusFirstInvalid = () => {
    // Order matters: scroll to first missing/invalid control
    if (!form.name) { nameRef.current?.focus(); return; }
    if (!form.district) { formRef.current?.scrollToTarget(districtAnchorRef.current); return; }
    if (!form.block) { formRef.current?.scrollToTarget(blockAnchorRef.current); return; }
  // committee removed
    if (!/^[2-9]\d{11}$/.test(form.aadhaar.replace(/\s+/g, ''))) { aadhaarRef.current?.focus(); return; }
    if (!/^[6-9]\d{9}$/.test(form.mobile)) { mobileRef.current?.focus(); return; }
    if (form.email && !/^([^\s@]+)@([^\s@]+)\.[^\s@]+$/.test(form.email)) { emailRef.current?.focus(); return; }
    if (!form.village) { villageRef.current?.focus(); return; }
    if (!/^[1-9][0-9]{5}$/.test(form.pincode)) { pincodeRef.current?.focus(); return; }
    if (!form.father_name) { fatherRef.current?.focus(); return; }
    if (!(form.land_area === '' ? true : parseFloat(form.land_area.replace(',', '.')) > 0)) { landRef.current?.focus(); return; }
    if (!form.khasra) { khasraRef.current?.focus(); return; }
  if (!((form.farmer_types && form.farmer_types.length > 0) || form.farmer_type)) { return; }
    if (form.ifsc && !/^[A-Z]{4}0[0-9A-Z]{6}$/.test(form.ifsc.toUpperCase())) { ifscRef.current?.focus(); return; }
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

  // Image picker helpers (dynamic require to avoid crashes if not installed)
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
  {/* App logo removed */}
  <Text style={styles.title}>{t('welcome')}</Text>
  <Text style={styles.subtitle}>{t('register_to_create')}</Text>

  {/* Photo upload/capture */}
  <Text style={styles.section}>{t('upload_photo', 'Upload your photo')}</Text>
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

  {/* Society name (required) */}
      <Text style={styles.section}>{`${t('society', 'Society')} / Society`}</Text>
      <View style={styles.field}>
        <Text style={styles.label}>{`${t('society', 'Society')} / Society`}</Text>
        <TextInput
          style={[styles.input, !form.society_name ? { borderColor: '#ef4444' } : null]}
          value={form.society_name}
          onChangeText={(t) => setField('society_name', t)}
          placeholder={t('enter_society', 'Enter society/cooperative name')}
          onFocus={(e) => formRef.current?.scrollToTarget(e.nativeEvent.target)}
          returnKeyType="next"
          onSubmitEditing={() => nameRef.current?.focus()}
        />
        {!form.society_name ? <Text style={{ fontSize: 12, color: '#ef4444' }}>{t('err_required')}</Text> : null}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>{`${t('name')} / Name`}</Text>
        <TextInput
          ref={nameRef}
          style={[styles.input, !form.name ? { borderColor: '#ef4444' } : null]}
          value={form.name}
          onChangeText={(t) => setField('name', t)}
          placeholder="विक्रम कुमार"
          onFocus={(e) => formRef.current?.scrollToTarget(e.nativeEvent.target)}
          returnKeyType="next"
          onSubmitEditing={() => aadhaarRef.current?.focus()}
        />
        {!form.name ? <Text style={{ fontSize: 12, color: '#ef4444' }}>{t('err_required')}</Text> : null}
      </View>

      <View ref={districtAnchorRef} style={styles.field}>
          <Select
            label={`${t('district')} / District`}
            value={form.district || null}
            options={getDistricts(lang)}
            onChange={(v) => {
              setForm((f) => {
                const district = v as string;
                const pincode = getPincodeByDistrictBlock(district, '');
                return { ...f, district, block: '', pincode: pincode || '' };
              });
            }}
            placeholder={t('select_district', 'Select district')}
            required
            error={!form.district ? t('err_required') : ''}
          />
        </View>
      <View ref={blockAnchorRef} style={styles.field}>
          <Select
            label={`${t('block')} / Block`}
            value={form.block || null}
            options={getBlocks(lang, form.district)}
            onChange={(v) => {
              const block = v as string;
              const pin = getPincodeByDistrictBlock(form.district, block);
              setForm((f) => ({ ...f, block, pincode: pin || f.pincode }));
            }}
            placeholder={t('select_block', 'Select block')}
            required
            error={!form.block ? t('err_required') : ''}
          />
        </View>

  {/* Society text field removed; PACS selection above is optional */}

      <View style={styles.field}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={styles.label}>{`${t('aadhaar')} / Aadhaar`}</Text>
          <InfoTooltip text={t('aadhaar_help_tip', 'Used for verification only. We do not share your Aadhaar.')} />
        </View>
        <TextInput
          ref={aadhaarRef}
          style={[styles.input, !/^[2-9]\d{11}$/.test(form.aadhaar.replace(/\s+/g, '')) && form.aadhaar ? { borderColor: '#ef4444' } : null]}
          value={form.aadhaar}
          onChangeText={(t) => setField('aadhaar', t)}
          placeholder="1234 5678 9012"
          keyboardType="number-pad"
          onFocus={(e) => formRef.current?.scrollToTarget(e.nativeEvent.target)}
          returnKeyType="next"
          onSubmitEditing={() => mobileRef.current?.focus()}
        />
        <Text style={{ fontSize: 12, color: !/^[2-9]\d{11}$/.test(form.aadhaar.replace(/\s+/g, '')) && form.aadhaar ? '#ef4444' : '#6b7280' }}>{!/^[2-9]\d{11}$/.test(form.aadhaar.replace(/\s+/g, '')) && form.aadhaar ? t('err_aadhaar') : t('help_aadhaar')}</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>{`${t('mobile')} / Mobile`}</Text>
        <TextInput
          ref={mobileRef}
          style={[styles.input, !/^[6-9]\d{9}$/.test(form.mobile) && form.mobile ? { borderColor: '#ef4444' } : null]}
          value={form.mobile}
          onChangeText={(t) => setField('mobile', t)}
          placeholder="9876543210"
          keyboardType="number-pad"
          onFocus={(e) => formRef.current?.scrollToTarget(e.nativeEvent.target)}
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
        />
  <Text style={{ fontSize: 12, color: !/^[6-9]\d{9}$/.test(form.mobile) && form.mobile ? '#ef4444' : '#6b7280' }}>{!/^[6-9]\d{9}$/.test(form.mobile) && form.mobile ? t('err_mobile') : t('help_mobile')}</Text>
      </View>

      <View style={styles.field}>
          <Text style={styles.label}>{`${t('email')} / Email`}</Text>
          <TextInput
            ref={emailRef}
            style={[styles.input, form.email && !/^([^\s@]+)@([^\s@]+)\.[^\s@]+$/.test(form.email) ? { borderColor: '#ef4444' } : null]}
            value={form.email}
            onChangeText={(t) => setField('email', t)}
            placeholder="name@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={(e) => formRef.current?.scrollToTarget(e.nativeEvent.target)}
            returnKeyType="next"
            onSubmitEditing={() => villageRef.current?.focus()}
          />
          {form.email && !/^([^\s@]+)@([^\s@]+)\.[^\s@]+$/.test(form.email) ? (
            <Text style={{ fontSize: 12, color: '#ef4444' }}>{t('err_email')}</Text>
          ) : null}
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>{`${t('village')} / Village`}</Text>
          <TextInput
            ref={villageRef}
            style={[styles.input, !form.village ? { borderColor: '#ef4444' } : null]}
            value={form.village}
            onChangeText={(t) => setField('village', t)}
            placeholder="ग्राम"
            onFocus={(e) => formRef.current?.scrollToTarget(e.nativeEvent.target)}
            returnKeyType="next"
            onSubmitEditing={() => pincodeRef.current?.focus()}
          />
          {!form.village ? <Text style={{ fontSize: 12, color: '#ef4444' }}>{t('err_required')}</Text> : null}
        </View>
      

      <View style={styles.field}>
        <Text style={styles.label}>{`${t('pincode')} / Pincode`}</Text>
        <TextInput
          ref={pincodeRef}
          style={[styles.input, !/^[1-9][0-9]{5}$/.test(form.pincode) && form.pincode ? { borderColor: '#ef4444' } : null]}
          value={form.pincode}
          onChangeText={(t) => setField('pincode', t)}
          placeholder="226001"
          keyboardType="number-pad"
          maxLength={6}
          onFocus={(e) => formRef.current?.scrollToTarget(e.nativeEvent.target)}
          returnKeyType="next"
          onSubmitEditing={() => fatherRef.current?.focus()}
        />
        <Text style={{ fontSize: 12, color: !/^[1-9][0-9]{5}$/.test(form.pincode) && form.pincode ? '#ef4444' : '#6b7280' }}>{!/^[1-9][0-9]{5}$/.test(form.pincode) && form.pincode ? t('err_pincode') : ''}</Text>
  {form.block ? <Text style={{ fontSize: 12, color: '#6b7280' }}>{t('auto_pincode', 'Auto filled from district and block')}</Text> : null}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>{`${t('father_name')} / Father's name`}</Text>
        <TextInput
          ref={fatherRef}
          style={styles.input}
          value={form.father_name}
          onChangeText={(t) => setField('father_name', t)}
          placeholder="सुरेश कुमार"
          onFocus={(e) => formRef.current?.scrollToTarget(e.nativeEvent.target)}
          returnKeyType="next"
          onSubmitEditing={() => landRef.current?.focus()}
        />
      </View>

      <View style={styles.field}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.label}>{`${t('land_area')} / Land area (ha)`}</Text>
            <InfoTooltip text={t('land_area_help_tip', 'Enter in hectares (e.g., 1.25). Approximate values are okay.')} />
          </View>
          <TextInput
            ref={landRef}
            style={[styles.input, !(parseFloat(form.land_area.replace(',', '.')) > 0) && form.land_area ? { borderColor: '#ef4444' } : null]}
            value={form.land_area}
            onChangeText={(t) => setField('land_area', t)}
            placeholder="1.25"
            keyboardType="decimal-pad"
            onFocus={(e) => formRef.current?.scrollToTarget(e.nativeEvent.target)}
            returnKeyType="next"
            onSubmitEditing={() => khasraRef.current?.focus()}
          />
          <Text style={{ fontSize: 12, color: !(parseFloat(form.land_area.replace(',', '.')) > 0) && form.land_area ? '#ef4444' : '#6b7280' }}>{t('help_land')}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>{`${t('khasra')} / Khasra`}</Text>
          <TextInput
            ref={khasraRef}
            style={styles.input}
            value={form.khasra}
            onChangeText={(t) => setField('khasra', t)}
            placeholder="47892"
            onFocus={(e) => formRef.current?.scrollToTarget(e.nativeEvent.target)}
            returnKeyType="next"
            onSubmitEditing={() => bankNameRef.current?.focus()}
          />
        </View>
      

      {/* Optional banking details */}
      <Text style={styles.section}>{`${t('bank_name')} / Bank`}</Text>
      <View style={styles.field}>
        <Text style={styles.label}>{`${t('bank_name')} / Bank`}</Text>
        <TextInput
          ref={bankNameRef}
          style={styles.input}
          value={form.bank_name}
          onChangeText={(t) => setField('bank_name', t)}
          placeholder="State Bank of India"
          onFocus={(e) => formRef.current?.scrollToTarget(e.nativeEvent.target)}
          returnKeyType="next"
          onSubmitEditing={() => bankAccRef.current?.focus()}
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>{`${t('bank_account')} / A/C`}</Text>
        <TextInput
          ref={bankAccRef}
          style={styles.input}
          value={form.bank_account}
          onChangeText={(t) => setField('bank_account', t)}
          placeholder="123456789012"
          keyboardType="number-pad"
          onFocus={(e) => formRef.current?.scrollToTarget(e.nativeEvent.target)}
          returnKeyType="next"
          onSubmitEditing={() => ifscRef.current?.focus()}
        />
      </View>
      <View style={styles.field}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={styles.label}>{`${t('ifsc')} / IFSC`}</Text>
          <InfoTooltip text={t('ifsc_help_tip', '11-character code identifying your bank branch (e.g., SBIN0001234).')} />
        </View>
        <TextInput
          ref={ifscRef}
          style={[styles.input, form.ifsc && !/^[A-Z]{4}0[0-9A-Z]{6}$/.test(form.ifsc.toUpperCase()) ? { borderColor: '#ef4444' } : null]}
          value={form.ifsc}
          onChangeText={(t) => setField('ifsc', t)}
          placeholder="SBIN0001234"
          autoCapitalize="characters"
          onFocus={(e) => formRef.current?.scrollToTarget(e.nativeEvent.target)}
          returnKeyType="done"
          blurOnSubmit
        />
        {form.ifsc && !/^[A-Z]{4}0[0-9A-Z]{6}$/.test(form.ifsc.toUpperCase()) ? (
          <Text style={{ fontSize: 12, color: '#ef4444' }}>{t('err_ifsc')}</Text>
        ) : null}
      </View>

  <Text style={styles.section}>{`${t('farmer_type')} / Farmer type`}</Text>
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

      {/* Inline submit */}
      <View style={{ gap: 8, marginTop: 8, marginBottom: 24 }}>
        <Text style={{ fontSize: 12, color: '#6b7280' }}>
          {t('id_will_be', 'Your ID will be')}: {makeFarmerId(form.name, form.mobile)}
        </Text>
        <Pressable disabled={submitting || !valid()} onPress={() => { if (!valid()) { setTriedSubmit(true); focusFirstInvalid(); return; } submit(); }} style={[styles.submit, (!valid() || submitting) && styles.submitDisabled]}>
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
  logo: { width: 72, height: 72, alignSelf: 'center', marginBottom: 8 },
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
    minHeight: 56
  },
  pill: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#cbd5e1' },
  pillActive: { backgroundColor: '#FFF4E8', borderColor: Brand.saffron },
  pillText: { fontSize: Typography.label },
  pillTextActive: { color: Brand.saffron, fontWeight: '700' },
  smallBtn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
  smallBtnText: { color: 'white', fontWeight: '700' },
  submit: { backgroundColor: Brand.saffron, paddingVertical: 16, borderRadius: 12, marginTop: 16 },
  submitDisabled: { backgroundColor: '#ffcd9f' },
  submitText: { color: 'white', textAlign: 'center', fontWeight: '800', fontSize: Typography.button },
  errorBox: { marginTop: 10, padding: 12, borderRadius: 10, backgroundColor: '#FFF5F5', borderWidth: 1, borderColor: '#FECACA' },
  errorTitle: { fontWeight: '800', color: '#991B1B', marginBottom: 4 },
  errorList: { color: '#991B1B' },
});
