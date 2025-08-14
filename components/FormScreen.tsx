import React, { createContext, useContext } from 'react';
import { Dimensions, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleProp, UIManager, View, ViewStyle, findNodeHandle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type FormScreenHandle = { scrollToTarget: (target: any, extraOffset?: number) => void };

type Props = {
  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  footer?: React.ReactNode; // sticky footer area that floats above keyboard
  behaviorOverride?: 'padding' | 'height' | 'position'; // allow screens to override KAV behavior
};

const FormScrollContext = createContext<{ scrollTo: (node: any, extraOffset?: number) => void; scrollToTarget: (node: any, extraOffset?: number) => void } | null>(null);
export function useFormScroll() {
  const ctx = useContext(FormScrollContext);
  if (!ctx) throw new Error('useFormScroll must be used within FormScreen');
  return ctx;
}

const FormScreen = React.forwardRef<FormScreenHandle, Props>(function FormScreen({ children, contentContainerStyle, style, footer, behaviorOverride }, ref) {
  const insets = useSafeAreaInsets();
  const [kb, setKb] = React.useState(0);
  const scrollRef = React.useRef<ScrollView>(null);
  // Adaptive gap above keyboard (small), plus footer height if present
  const [winH, setWinH] = React.useState(Dimensions.get('window').height);
  const [footerH, setFooterH] = React.useState(0);
  const desiredGap = React.useMemo(() => {
    // Target ~15% of window height, clamped between 140 and 160 px
    const base = Math.round(winH * 0.15);
    return Math.max(140, Math.min(base, 160));
  }, [winH]);
  const computeExtraOffset = React.useCallback(() => {
    // If a floating footer exists, ensure we clear it as well (+16 for footer card margin)
    return desiredGap + (footerH ? footerH + 16 : 0);
  }, [desiredGap, footerH]);
  React.useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => setWinH(window.height));
    return () => { (sub as any)?.remove?.(); };
  }, []);
  // If a click triggers focus before the keyboard is visible, queue a retry once it appears
  const pendingHandleRef = React.useRef<number | null>(null);

  React.useEffect(() => {
  const show = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', (e: any) => {
      setKb(e?.endCoordinates?.height ?? 0);
      // If a scroll was pending (user tapped a field and keyboard is just appearing), finish the scroll now
      const handle = pendingHandleRef.current;
      if (handle && scrollRef.current) {
        const responder = (scrollRef.current as any)?.getScrollResponder?.();
        if (responder?.scrollResponderScrollNativeHandleToKeyboard) {
          const base = computeExtraOffset();
          responder.scrollResponderScrollNativeHandleToKeyboard(handle, base, true);
          // Verify position after layout settles; adjust if still below our desired line
          setTimeout(() => {
            try {
              UIManager.measureInWindow?.(handle, (_x: number, y: number, _w: number, h: number) => {
                const visibleBottom = Dimensions.get('window').height - (e?.endCoordinates?.height ?? kb) - insets.bottom - (footerH ? footerH + 16 : 0);
                const targetBottom = y + h;
                const desiredBottom = visibleBottom - desiredGap;
                if (targetBottom > desiredBottom) {
                  const extra = base + Math.min(240, Math.ceil(targetBottom - desiredBottom) + 8);
                  const r2 = (scrollRef.current as any)?.getScrollResponder?.();
                  r2?.scrollResponderScrollNativeHandleToKeyboard?.(handle, extra, true);
                }
              });
            } catch {}
          }, 80);
        }
        pendingHandleRef.current = null;
      } else if (scrollRef.current) {
        // Safety fallback: if no explicit target pending, auto-scroll the currently focused input
        try {
          const focusedHandle = (UIManager as any)?.getCurrentlyFocusedNode?.();
          if (typeof focusedHandle === 'number') {
            const responder = (scrollRef.current as any)?.getScrollResponder?.();
            if (responder?.scrollResponderScrollNativeHandleToKeyboard) {
              const base = computeExtraOffset();
              responder.scrollResponderScrollNativeHandleToKeyboard(focusedHandle, base, true);
              setTimeout(() => {
                try {
                  UIManager.measureInWindow?.(focusedHandle, (_x: number, y: number, _w: number, h: number) => {
                    const visibleBottom = Dimensions.get('window').height - (e?.endCoordinates?.height ?? kb) - insets.bottom - (footerH ? footerH + 16 : 0);
                    const targetBottom = y + h;
                    const desiredBottom = visibleBottom - desiredGap;
                    if (targetBottom > desiredBottom) {
                      const extra = base + Math.min(240, Math.ceil(targetBottom - desiredBottom) + 8);
                      const r2 = (scrollRef.current as any)?.getScrollResponder?.();
                      r2?.scrollResponderScrollNativeHandleToKeyboard?.(focusedHandle, extra, true);
                    }
                  });
                } catch {}
              }, 80);
            }
          }
        } catch {}
      }
    });
    const hide = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setKb(0));
    return () => { show.remove(); hide.remove(); };
  }, []);

  const lastScrollRef = React.useRef<number>(0);
  const lastHandleRef = React.useRef<number | null>(null);
  const scrollYRef = React.useRef(0);

  const adjustByMeasurement = React.useCallback((sv: any, handle: number, extraBase?: number) => {
    try {
      UIManager.measureInWindow?.(handle, (_x: number, y: number, _w: number, h: number) => {
        const windowH = Dimensions.get('window').height;
        const visibleBottom = windowH - kb - insets.bottom - (footerH ? footerH + 16 : 0);
        const desiredBottom = visibleBottom - desiredGap;
        const targetBottom = y + h;
        if (targetBottom > desiredBottom) {
          const delta = Math.min(480, Math.ceil(targetBottom - desiredBottom) + 8);
          const newY = Math.max(0, scrollYRef.current + delta);
          sv.scrollTo?.({ y: newY, animated: true });
        } else if (extraBase && targetBottom < desiredBottom - 24) {
          // If we overscrolled too far up, gently bring it down a bit
          const deltaUp = Math.min(200, Math.ceil(desiredBottom - targetBottom));
          const newY = Math.max(0, scrollYRef.current - deltaUp);
          sv.scrollTo?.({ y: newY, animated: true });
        }
      });
    } catch {}
  }, [kb, insets.bottom, footerH, desiredGap]);
  const scrollTo = React.useCallback((node: any, _extraOffset: number | undefined = undefined) => {
    try {
      const sv = scrollRef.current as any;
      if (!sv || !node) return;
      const now = Date.now();
      const n = (node as any)?._internalFiberInstanceHandleDEV?.stateNode || node;
      const handle = typeof n === 'number' ? n : findNodeHandle(n);
      if (!handle) return;
      // Debounce only identical, rapid, repeated scrolls to the same handle
      if (now - lastScrollRef.current < 120 && lastHandleRef.current === handle) return;
      lastScrollRef.current = now;
      lastHandleRef.current = handle;
      // Leverage RN’s built-in keyboard-aware scroll to minimize overshoot
      const responder = sv.getScrollResponder?.();
      if (responder?.scrollResponderScrollNativeHandleToKeyboard) {
    // Always use adaptive extra offset so the target clears keyboard and footer comfortably
    const base = computeExtraOffset();
    responder.scrollResponderScrollNativeHandleToKeyboard(handle, base, true);
    // Measure-based correction immediately and after a short delay
    adjustByMeasurement(sv, handle, base);
    setTimeout(() => adjustByMeasurement(sv, handle, base), 90);
        // If keyboard isn't up yet, remember the target and complete after it shows
        if (!kb) {
          pendingHandleRef.current = handle as unknown as number;
        }
        return;
      }
  // fallback minimal nudge to trigger layout without overshoot
  sv.scrollTo?.({ y: (sv as any)?.contentOffset?.y ?? 0, animated: true });
    } catch {}
  }, [computeExtraOffset, kb, adjustByMeasurement]);

  React.useImperativeHandle(ref, () => ({
  // Keep signature for backward compatibility but ignore extraOffset to enforce uniform behavior
  scrollToTarget: (target: any, _extraOffset?: number) => scrollTo(target, undefined),
  }), [scrollTo]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: behaviorOverride ?? 'padding', android: 'height' })}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 5 : 0}
      style={[{ flex: 1 }, style]}
    >
  <FormScrollContext.Provider value={{ scrollTo, scrollToTarget: (node: any, _extraOffset?: number) => scrollTo(node, undefined) }}>
        <View style={{ flex: 1 }}>
          <ScrollView
            ref={scrollRef}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={Platform.select({ ios: 'interactive', android: 'on-drag' })}
            automaticallyAdjustKeyboardInsets
            contentInsetAdjustmentBehavior={Platform.OS === 'ios' ? 'always' : undefined}
            showsVerticalScrollIndicator={false}
            onScroll={(e) => { scrollYRef.current = e.nativeEvent.contentOffset.y; }}
            scrollEventThrottle={16}
            contentContainerStyle={[{ paddingHorizontal: 16, paddingBottom: (kb || 16) + insets.bottom + (footer ? 120 : 80) }, contentContainerStyle]}
          >
            {children}
          </ScrollView>
          {footer ? (
            <View pointerEvents="box-none" style={{ position: 'absolute', left: 0, right: 0, bottom: Math.max(8, (kb ? kb : insets.bottom) + 8) }}>
              <View onLayout={(e) => setFooterH(e.nativeEvent.layout.height)} style={{ marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#e5e7eb', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}>
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
