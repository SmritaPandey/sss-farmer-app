import React from 'react';
import { Modal, Pressable, Text, View, StyleSheet } from 'react-native';
import { Brand } from '@/constants/Colors';

export function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Pressable onPress={() => setOpen(true)} accessibilityLabel="info" accessibilityHint={text}>
        <Text style={styles.icon}>i</Text>
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
        <View style={styles.sheet}>
          <Text style={styles.tipText}>{text}</Text>
          <Pressable style={styles.btn} onPress={() => setOpen(false)}>
            <Text style={styles.btnText}>OK</Text>
          </Pressable>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  icon: { width: 20, height: 20, borderRadius: 10, textAlign: 'center', textAlignVertical: 'center', backgroundColor: '#eef2ff', color: Brand.saffron, fontWeight: '800' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)' },
  sheet: { position: 'absolute', left: 16, right: 16, bottom: 24, backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  tipText: { fontSize: 14, color: '#111', marginBottom: 10 },
  btn: { alignSelf: 'flex-end', backgroundColor: Brand.saffron, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  btnText: { color: '#fff', fontWeight: '700' },
});
