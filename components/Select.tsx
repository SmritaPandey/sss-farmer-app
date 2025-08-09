import React from 'react';
import { View, Text, Pressable, Modal, FlatList, StyleSheet } from 'react-native';
import { Brand } from '@/constants/Colors';

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
  const [open, setOpen] = React.useState(false);
  const current = options.find(o => o.value === value);

  return (
    <View style={{ gap: 6 }}>
      {label ? <Text style={styles.label}>{label}{required ? ' *' : ''}</Text> : null}
      <Pressable style={[styles.select, !!error && styles.selectError]} onPress={() => setOpen(true)}>
        <Text style={[styles.valueText, !current && styles.placeholder]}> {current ? current.label : (placeholder ?? 'Select')}</Text>
      </Pressable>
      {helper && !error ? <Text style={styles.helper}>{helper}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View />
        </Pressable>
        <View style={styles.sheet}>
          <FlatList
            data={options}
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
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14 },
  select: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 12, backgroundColor: '#fff' },
  selectError: { borderColor: '#ef4444' },
  valueText: { fontSize: 16 },
  placeholder: { color: '#9CA3AF' },
  helper: { fontSize: 12, color: '#6b7280' },
  error: { fontSize: 12, color: '#ef4444' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)' },
  sheet: { position: 'absolute', left: 12, right: 12, bottom: 24, maxHeight: '55%', backgroundColor: '#fff', borderRadius: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  option: { paddingHorizontal: 16, paddingVertical: 14 },
  optionText: { fontSize: 16, color: Brand.green },
});
