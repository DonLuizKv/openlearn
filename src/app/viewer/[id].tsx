import { useMemo, useRef, useState } from 'react';
import { Image, PanResponder, StyleSheet, View } from 'react-native';
import type { GestureResponderEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { findInstrument } from '../../data/catalog';
import { Button, EmptyState, IconButton, Txt, styles } from '../../components/ui';
import { colors } from '../../theme';

type Transform = { scale: number; x: number; y: number };
const initial: Transform = { scale: 1, x: 0, y: 0 };
export default function ImageViewer() {
  const { id, hidden } = useLocalSearchParams<{ id: string; hidden?: string }>();
  const item = findInstrument(id);
  const [transform, setTransform] = useState(initial);
  const current = useRef(initial);
  const bounds = useRef({ width: 300, height: 400 });
  const gesture = useRef({ ...initial, distance: 0, touches: 0, startX: 0, startY: 0 });
  function apply(next: Transform) {
    const scale = Math.max(1, Math.min(4, next.scale));
    const maxX = bounds.current.width * (scale - 1) / 2;
    const maxY = bounds.current.height * (scale - 1) / 2;
    current.current = { scale, x: Math.max(-maxX, Math.min(maxX, next.x)), y: Math.max(-maxY, Math.min(maxY, next.y)) };
    setTransform(current.current);
  }
  const responder = useMemo(() => {
    function measure(event: GestureResponderEvent) {
      const touches = event.nativeEvent.touches;
      const first = touches[0];
      const second = touches[1];
      return { touches: touches.length, x: first?.pageX ?? event.nativeEvent.pageX, y: first?.pageY ?? event.nativeEvent.pageY, distance: first && second ? Math.hypot(second.pageX - first.pageX, second.pageY - first.pageY) : 0 };
    }
    function begin(event: GestureResponderEvent) {
      const point = measure(event);
      gesture.current = { ...current.current, distance: point.distance, touches: point.touches, startX: point.x, startY: point.y };
    }
    // PanResponder registers these callbacks; it does not call them during render.
    // eslint-disable-next-line react-hooks/refs
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: begin,
      onPanResponderMove: event => {
        const point = measure(event);
        if (point.touches !== gesture.current.touches) { begin(event); return; }
        const origin = gesture.current;
        if (point.touches >= 2 && origin.distance > 0) apply({ ...current.current, scale: origin.scale * point.distance / origin.distance });
        else apply({ scale: current.current.scale, x: origin.x + point.x - origin.startX, y: origin.y + point.y - origin.startY });
      },
    });
  }, []);
  if (!item) return <SafeAreaView style={styles.screen}><EmptyState title="Imagen no disponible" text="Vuelve al catálogo para elegir una ficha." action="Volver" onAction={() => router.canGoBack() ? router.back() : router.replace('/')} /></SafeAreaView>;
  return <SafeAreaView style={s.screen}>
    <View style={[styles.row, { padding: 16 }]}><View style={{ flex: 1 }}><Txt kind="heading" style={{ color: colors.paper }}>{hidden === '1' ? 'Reconocimiento visual' : item.name}</Txt><Txt kind="caption" style={{ color: '#B4C5BC' }}>Fotografía · 1 de 1</Txt></View><IconButton name="close" label="Cerrar visor" color={colors.paper} onPress={() => router.canGoBack() ? router.back() : router.replace(`/instrument/${id}`)} /></View>
    <View {...responder.panHandlers} onLayout={event => { bounds.current = event.nativeEvent.layout; apply(current.current); }} style={s.viewport}>
      <Image source={item.photo.asset} resizeMode="contain" accessibilityLabel={hidden === '1' ? 'Fotografía del instrumento que debes identificar' : item.name} style={[StyleSheet.absoluteFill, { width: '100%', height: '100%', transform: [{ translateX: transform.x }, { translateY: transform.y }, { scale: transform.scale }] }]} />
    </View>
    <View style={{ padding: 22, gap: 16 }}><Txt style={{ color: '#D4E2D9', textAlign: 'center' }}>Pellizca para ampliar. Arrastra para ver los detalles.</Txt><View style={[styles.row, { justifyContent: 'center', backgroundColor: '#294D3E', borderRadius: 18, alignSelf: 'center', paddingHorizontal: 8 }]}><IconButton name="remove" label="Reducir imagen" color={colors.paper} onPress={() => apply({ ...current.current, scale: current.current.scale - 0.5 })} /><Txt style={{ color: colors.paper, minWidth: 46, textAlign: 'center' }}>{transform.scale.toFixed(1)}×</Txt><IconButton name="add" label="Ampliar imagen" color={colors.paper} onPress={() => apply({ ...current.current, scale: current.current.scale + 0.5 })} /></View><Button title="Restablecer imagen" secondary onPress={() => apply(initial)} /><Txt kind="caption" style={{ color: '#B4C5BC', textAlign: 'center' }}>{item.photo.author} · {item.photo.license}{`\n`}Créditos y fuente disponibles en la ficha de estudio.</Txt></View>
  </SafeAreaView>;
}
const s = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#132D24' }, viewport: { flex: 1, minHeight: 140, overflow: 'hidden', backgroundColor: '#1A362C' } });
