import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

// Simple global Toast for non-blocking feedback
// Usage: const { show } = useToast(); show('Saved', { type: 'success' })

type ToastOpts = { type?: 'default' | 'success' | 'error'; durationMs?: number };

type Ctx = { show: (msg: string, opts?: ToastOpts) => void };
const ToastContext = createContext<Ctx | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [msg, setMsg] = useState<string>('');
  const [type, setType] = useState<ToastOpts['type']>('default');
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    Animated.timing(opacity, { toValue: 0, duration: 160, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, [opacity]);

  const show = useCallback((message: string, opts?: ToastOpts) => {
    if (timer.current) { clearTimeout(timer.current); timer.current = null; }
    setMsg(message);
    setType(opts?.type || 'default');
    Animated.timing(opacity, { toValue: 1, duration: 160, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
    const dur = opts?.durationMs ?? 1800;
    timer.current = setTimeout(hide, dur);
  }, [hide, opacity]);

  const value = useMemo(() => ({ show }), [show]);
  const bg = type === 'success' ? '#065f46' : type === 'error' ? '#7f1d1d' : '#374151';

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Animated.View pointerEvents="none" style={[styles.wrap, { opacity }] }>
        <View style={[styles.toast, { backgroundColor: bg }]}>
          <Text style={styles.text}>{msg}</Text>
        </View>
      </Animated.View>
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, bottom: 28, alignItems: 'center' },
  toast: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  text: { color: 'white', fontWeight: '700' },
});

export default ToastProvider;
