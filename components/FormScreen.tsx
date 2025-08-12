import React, { createContext, useContext } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleProp, UIManager, View, ViewStyle, findNodeHandle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type FormScreenHandle = { scrollToTarget: (target: any, extraOffset?: number) => void };

type Props = {
  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  footer?: React.ReactNode; // sticky footer area that floats above keyboard
};

const FormScrollContext = createContext<{ scrollTo: (node: any, extraOffset?: number) => void } | null>(null);
export function useFormScroll() {
  const ctx = useContext(FormScrollContext);
  if (!ctx) throw new Error('useFormScroll must be used within FormScreen');
  return ctx;
}

const FormScreen = React.forwardRef<FormScreenHandle, Props>(function FormScreen({ children, contentContainerStyle, style, footer }, ref) {
  const insets = useSafeAreaInsets();
  const [kb, setKb] = React.useState(0);
  const scrollRef = React.useRef<ScrollView>(null);
  // Much smaller base offset to reduce perceived "jump" when focusing fields
  const defaultOffset = React.useMemo(() => 100, []);

  React.useEffect(() => {
    const show = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', (e: any) => {
      setKb(e?.endCoordinates?.height ?? 0);
    });
    const hide = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setKb(0));
    return () => { show.remove(); hide.remove(); };
  }, []);

  const lastScrollRef = React.useRef<number>(0);
  const scrollTo = React.useCallback((node: any, extraOffset = defaultOffset) => {
    try {
      const sv = scrollRef.current as any;
      if (!sv || !node) return;
      const now = Date.now();
      if (now - lastScrollRef.current < 200) return; // increased debounce for smoother scrolling
      lastScrollRef.current = now;
      const n = (node as any)?._internalFiberInstanceHandleDEV?.stateNode || node;
      const handle = findNodeHandle(n);
      if (!handle) return;
      // Leverage RN’s built-in keyboard-aware scroll to minimize overshoot
      const responder = sv.getScrollResponder?.();
      if (responder?.scrollResponderScrollNativeHandleToKeyboard) {
        // Reduce adaptive scrolling to minimize jumping
        const adaptiveRaw = kb ? Math.min(kb, 250) * 0.1 : 0;
        const adaptive = Math.max(4, Math.min(adaptiveRaw, 30));
        // If a sticky footer is present, add a small cushion so the field isn't hidden behind it.
        const footerCushion = footer ? 16 : 0;
        const base = typeof extraOffset === 'number' ? extraOffset : defaultOffset;
        const finalOffset = Math.round(base + adaptive + footerCushion);
        responder.scrollResponderScrollNativeHandleToKeyboard(handle, finalOffset, true);
        return;
      }
  // fallback minimal nudge to trigger layout without overshoot
  sv.scrollTo?.({ y: (sv as any)?.contentOffset?.y ?? 0, animated: true });
    } catch {}
  }, [defaultOffset, kb]);

  React.useImperativeHandle(ref, () => ({
    scrollToTarget: (target: any, extraOffset?: number) => scrollTo(target, extraOffset),
  }), [scrollTo]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: 'height' })}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 5 : 0}
      style={[{ flex: 1 }, style]}
    >
      <FormScrollContext.Provider value={{ scrollTo }}>
        <View style={{ flex: 1 }}>
          <ScrollView
            ref={scrollRef}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={Platform.select({ ios: 'interactive', android: 'on-drag' })}
            contentInsetAdjustmentBehavior={Platform.OS === 'ios' ? 'always' : undefined}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[{ paddingHorizontal: 16, paddingBottom: (kb || 16) + insets.bottom + (footer ? 120 : 80) }, contentContainerStyle]}
          >
            {children}
          </ScrollView>
          {footer ? (
            <View pointerEvents="box-none" style={{ position: 'absolute', left: 0, right: 0, bottom: Math.max(8, (kb ? kb : insets.bottom) + 8) }}>
              <View style={{ marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#e5e7eb', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}>
                {footer}
              </View>
            </View>
          ) : null}
        </View>
      </FormScrollContext.Provider>
    </KeyboardAvoidingView>
  );
});

export default FormScreen;
