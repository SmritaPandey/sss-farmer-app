import React from 'react';
import { View, Text, Pressable, Modal, FlatList, StyleSheet, TextInput, Keyboard, Platform } from 'react-native';
import { useFormScroll } from '@/components/FormScreen';
import { Brand } from '@/constants/Colors';
import { Typography } from '@/constants/Theme';
import { useI18n } from '@/contexts/i18n';

export type Option<T = string> = { label: string; value: T };

export function Select<T=string>({ label, value, options, onChange, placeholder, required, error, helper }: {
  label?: string;
  value?: T | null;
  options: Option<T>[];
  onChange: (v: T) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  helper?: string;
}) {
  const { t } = useI18n();
  const formScroll = useFormScroll?.() as any;
  const pressRef = React.useRef<View>(null);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef<TextInput>(null);
  const [kb, setKb] = React.useState(0);
  const current = options.find(o => o.value === value);
  const filtered = React.useMemo(() => {
    if (!query) return options;
    const q = query.toLowerCase();
    return options.filter(o => o.label.toLowerCase().includes(q));
  }, [query, options]);

  React.useEffect(() => {
    if (open) {
      // small delay for modal animation before focusing
      const id = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(id);
    }
  }, [open]);

  React.useEffect(() => {
    const show = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', (e: any) => setKb(e?.endCoordinates?.height ?? 0));
    const hide = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setKb(0));
    return () => { show.remove(); hide.remove(); };
  }, []);

  return (
    <View style={{ gap: 6 }}>
      {label ? <Text style={styles.label}>{label}{required ? ' *' : ''}</Text> : null}
      <Pressable
        ref={pressRef}
        style={[styles.select, !!error && styles.selectError]}
                onPress={() => { Keyboard.dismiss(); try { formScroll?.scrollTo?.(pressRef.current); } catch {} setOpen(true); }}
        accessibilityRole="button"
        accessibilityLabel={label ? `${label}. ${current ? current.label : (placeholder ?? t('select', 'Select'))}` : (placeholder ?? t('select', 'Select'))}
      >
        <Text style={[styles.valueText, !current && styles.placeholder]}> {current ? current.label : (placeholder ?? t('select', 'Select'))}</Text>
      </Pressable>
      {helper && !error ? <Text style={styles.helper}>{helper}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View />
        </Pressable>
  <View style={[styles.sheet, { bottom: 24 + kb }] }>
          <View style={styles.searchRow}>
            <TextInput
              ref={inputRef}
              value={query}
              onChangeText={setQuery}
              placeholder={t('search', 'Search...')}
              style={styles.search}
              autoFocus={Platform.OS !== 'web'}
              returnKeyType="search"
              onSubmitEditing={() => {
                if (filtered.length === 1) {
                  onChange(filtered[0].value);
                  setOpen(false);
                }
              }}
            />
            <Pressable onPress={() => { setQuery(''); setOpen(false); }} style={styles.closeBtn}><Text style={{ fontWeight: '800' }}>✕</Text></Pressable>
          </View>
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.value)}
            renderItem={({ item }) => (
              <Pressable
                style={styles.option}
                onPress={() => {
                  onChange(item.value);
                  setOpen(false);
                }}
              >
                <Text style={styles.optionText}>{item.label}</Text>
              </Pressable>
            )}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: Typography.label },
  select: { 
    borderWidth: 1, 
    borderColor: '#d1d5db', 
    borderRadius: 12, 
    padding: 18, 
    backgroundColor: '#fff',
    minHeight: 56
  },
  selectError: { borderColor: '#ef4444' },
  valueText: { fontSize: Typography.input },
  placeholder: { color: '#9CA3AF' },
  helper: { fontSize: 12, color: '#6b7280' },
  error: { fontSize: 12, color: '#ef4444' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)' },
  sheet: { position: 'absolute', left: 12, right: 12, bottom: 24, maxHeight: '55%', backgroundColor: '#fff', borderRadius: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingBottom: 6 },
  search: { 
    flex: 1, 
    borderWidth: 1, 
    borderColor: '#d1d5db', 
    borderRadius: 8, 
    paddingHorizontal: 12, 
    paddingVertical: 10,
    fontSize: Typography.input
  },
  closeBtn: { paddingHorizontal: 10, paddingVertical: 6 },
  option: { paddingHorizontal: 18, paddingVertical: 16 },
  optionText: { fontSize: Typography.input, color: Brand.green },
});
