import React from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image, Alert } from 'react-native';
import { useI18n } from '@/contexts/i18n';
import FormScreen, { FormScreenHandle } from '@/components/FormScreen';
import { Select } from '@/components/Select';
import { getDistricts, getBlocks, getPacsList, getTehsils, getPincodeByDistrictBlock } from '@/constants/mockData';
import { Brand } from '@/constants/Colors';
import { Typography } from '@/constants/Theme';
import { getCachedProfile, saveProfile } from '@/src/services/profile';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

export default function ProfileEditScreen() {
  const { t, lang } = useI18n() as any;
  const formRef = React.useRef<FormScreenHandle>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);
  const [form, setForm] = React.useState<any>({
    name: '',
    mobile: '',
    email: '',
    father_name: '',
    land_area: '',
    khasra: '',
    district: '',
    block: '',
    tehsil: '',
    village: '',
    pincode: '',
    pacs_name: '',
    photo_uri: '',
  });
  const navigation = useNavigation();

  const setField = (k: string, v: any, opts?: { silent?: boolean }) => {
    if (!opts?.silent) setDirty(true);
    setForm((f: any) => ({ ...f, [k]: v }));
  };
  const setFields = (obj: Record<string, any>, opts?: { silent?: boolean }) => {
    if (!opts?.silent) setDirty(true);
    setForm((f: any) => ({ ...f, ...obj }));
  };

  React.useEffect(() => {
    (async () => {
      try {
        const prof = await getCachedProfile();
        if (prof) {
          setForm((f: any) => ({ ...f, ...prof }));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Guard against leaving with unsaved changes
  React.useEffect(() => {
    const unsub = navigation.addListener('beforeRemove', (e: any) => {
      if (!dirty || saving) return; // allow leave if not dirty or currently saving
      e.preventDefault();
      Alert.alert(
        t('confirm', 'Confirm'),
        t('discard_changes', 'You have unsaved changes. Discard them and leave?'),
        [
          { text: t('cancel', 'Cancel'), style: 'cancel' },
          { text: t('discard', 'Discard'), style: 'destructive', onPress: () => navigation.dispatch(e.data.action) },
        ]
      );
    });
    return unsub;
  }, [navigation, dirty, saving, t]);

  const pacsOptions = React.useMemo(() => getPacsList(lang), [lang]);
  const tehsilOptions = React.useMemo(() => getTehsils(lang, form.district), [lang, form.district]);

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

  const valid = React.useMemo(() => {
    const mobileOk = !form.mobile || /^[6-9]\d{9}$/.test(form.mobile);
    const emailOk = !form.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    const landOk = !form.land_area || parseFloat(String(form.land_area).replace(',', '.')) >= 0;
    return mobileOk && emailOk && landOk;
  }, [form]);

  const onSave = async () => {
    if (saving || !valid) return;
    setSaving(true);
    try {
  const normalized = { ...form, land_area: form.land_area ? String(form.land_area).replace(',', '.') : form.land_area };
  await saveProfile(normalized);
  setDirty(false);
      router.back();
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{t('loading', 'Loading...')}</Text>
      </View>
    );
  }

  return (
    <FormScreen contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t('profile_edit', 'Edit Profile')}</Text>

      <View style={styles.field}>
        <Text style={styles.label}>{t('name')}</Text>
        <TextInput
          style={styles.input}
          value={form.name}
          onChangeText={(v) => setField('name', v)}
          placeholder={t('enter_name', 'Enter your full name')}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>{t('mobile')}</Text>
        <TextInput
          style={[styles.input, form.mobile && !/^[6-9]\d{9}$/.test(form.mobile) ? styles.inputError : null]}
          keyboardType="number-pad"
          value={form.mobile}
          onChangeText={(v) => setField('mobile', v.replace(/\D/g, ''))}
          placeholder="9876543210"
          maxLength={10}
        />
        {form.mobile && !/^[6-9]\d{9}$/.test(form.mobile) ? (
          <Text style={styles.errorText}>{t('err_mobile')}</Text>
        ) : null}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>{t('email')}</Text>
        <TextInput
          style={[styles.input, form.email && !/^([^\s@]+)@([^\s@]+)\.[^\s@]+$/.test(form.email) ? styles.inputError : null]}
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(v) => setField('email', v)}
          placeholder="name@example.com"
        />
        {form.email && !/^([^\s@]+)@([^\s@]+)\.[^\s@]+$/.test(form.email) ? (
          <Text style={styles.errorText}>{t('err_email')}</Text>
        ) : null}
      </View>

      <View style={styles.row2}>
        <View style={[styles.field, styles.col]}>
          <Text style={styles.label}>{t('district')}</Text>
          <Select
            value={form.district || null}
            options={getDistricts(lang)}
            onChange={(v) => {
              // reset block, tehsil, and pincode when district changes
              setFields({ district: v, block: '', tehsil: '', pincode: '' });
            }}
            placeholder={t('select_district')}
          />
        </View>
        <View style={[styles.field, styles.col]}>
          <Text style={styles.label}>{t('block')}</Text>
          <Select
            value={form.block || null}
            options={getBlocks(lang, form.district)}
            onChange={(v) => {
              // on block change, auto-derive pincode if available
              const pin = getPincodeByDistrictBlock(form.district, v as string);
              setFields({ block: v, tehsil: '', pincode: pin || '' });
            }}
            placeholder={t('select_block')}
          />
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>{t('tehsil')}</Text>
        <Select
          value={form.tehsil || null}
          options={tehsilOptions}
          onChange={(v) => setField('tehsil', v)}
          placeholder={t('select_tehsil', 'Select tehsil')}
        />
        {(!form.district || tehsilOptions.length === 0) ? (
          <Text style={styles.helper}>{t('tehsil_list_pending', 'Tehsil list will be added soon for this district')}</Text>
        ) : null}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>{t('pacs_name')}</Text>
        <Select value={form.pacs_name || null} options={pacsOptions} onChange={(v) => setField('pacs_name', v)} placeholder={t('select_pacs')} />
      </View>

      <View style={styles.row2}>
        <View style={[styles.field, styles.col]}>
          <Text style={styles.label}>{t('village')}</Text>
          <TextInput style={styles.input} value={form.village} onChangeText={(v) => setField('village', v)} placeholder={t('village')} />
        </View>
        <View style={[styles.field, styles.col]}>
          <Text style={styles.label}>{t('pincode')}</Text>
          <TextInput style={styles.input} keyboardType="number-pad" value={form.pincode} onChangeText={(v) => setField('pincode', v.replace(/\D/g, ''))} placeholder="226001" maxLength={6} />
          {(() => {
            const auto = getPincodeByDistrictBlock(form.district, form.block);
            if (auto && form.pincode === auto) return <Text style={styles.helper}>{t('info', 'Info')}: {t('auto', 'Auto')} – {auto}</Text>;
            return null;
          })()}
        </View>
      </View>

      <View style={styles.row2}>
        <View style={[styles.field, styles.col]}>
          <Text style={styles.label}>{t('land_area')}</Text>
          <TextInput
            style={styles.input}
            value={String(form.land_area || '')}
            onChangeText={(v) => {
              let cleaned = v.replace(/[^0-9.,]/g, '');
              cleaned = cleaned.replace(/,/g, '.');
              cleaned = cleaned.replace(/(\..*)\./, '$1');
              setField('land_area', cleaned);
            }}
            placeholder="1.25"
            keyboardType="decimal-pad"
          />
        </View>
        <View style={[styles.field, styles.col]}>
          <Text style={styles.label}>{t('khasra')}</Text>
          <TextInput style={styles.input} value={form.khasra} onChangeText={(v) => setField('khasra', v)} placeholder="47892" />
        </View>
      </View>

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

      <Pressable onPress={onSave} disabled={!valid || saving} style={[styles.submit, (!valid || saving) && styles.submitDisabled]}>
        <Text style={styles.submitText}>{saving ? '...' : t('submit', 'Submit')}</Text>
      </Pressable>
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 10 },
  title: { fontWeight: '800', fontSize: 18 },
  section: { fontSize: Typography.section, fontWeight: '800', marginTop: 16 },
  field: { gap: 6, marginTop: 10 },
  label: { fontSize: Typography.label, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, padding: 18, backgroundColor: '#fff', minHeight: 56, fontSize: Typography.input },
  inputError: { borderColor: '#ef4444' },
  errorText: { fontSize: 12, color: '#ef4444' },
  helper: { fontSize: 12, color: '#6b7280' },
  row2: { flexDirection: 'row', gap: 10 },
  col: { flex: 1 },
  smallBtn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
  smallBtnText: { color: '#ffffff', fontWeight: '700' },
  submit: { backgroundColor: Brand.saffron, paddingVertical: 16, borderRadius: 12, marginTop: 16 },
  submitDisabled: { backgroundColor: Brand.saffronDisabledSolid },
  submitText: { color: '#ffffff', textAlign: 'center', fontWeight: '800', fontSize: Typography.button },
});
