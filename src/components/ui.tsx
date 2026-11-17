import React from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { TextInputProps, TextProps, ViewStyle, StyleProp } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, fonts } from '../theme';

export type IconName = React.ComponentProps<typeof Ionicons>['name'];
export function Icon({ name, size = 22, color = colors.ink }: { name: IconName; size?: number; color?: React.ComponentProps<typeof Ionicons>['color'] }) {
  return <Ionicons name={name} size={size} color={color} accessible={false} aria-hidden accessibilityElementsHidden importantForAccessibility="no-hide-descendants" />;
}
export function Txt({ style, kind = 'body', ...props }: TextProps & { kind?: 'body' | 'caption' | 'label' | 'title' | 'heading' }) {
  return <Text {...props} style={[styles.text, styles[kind], style]} />;
}
export function Button({ title, onPress, icon, secondary, disabled, style }: { title: string; onPress: () => void; icon?: IconName; secondary?: boolean; disabled?: boolean; style?: StyleProp<ViewStyle> }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityState={{ disabled: !!disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.button, secondary && styles.secondary, disabled && { opacity: 0.4 }, pressed && { opacity: 0.75 }, style]}>
    {icon && <Icon name={icon} size={19} color={secondary ? colors.green : colors.paper} />}
    <Txt style={{ fontFamily: fonts.bold, color: secondary ? colors.green : colors.paper }}>{title}</Txt>
  </Pressable>;
}
export function IconButton({ name, label, onPress, color = colors.ink }: { name: IconName; label: string; onPress: () => void; color?: string }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.iconButton, pressed && { opacity: 0.5 }]}><Icon name={name} color={color} /></Pressable>;
}
export function Screen({ children, scroll = true }: React.PropsWithChildren<{ scroll?: boolean }>) {
  return <SafeAreaView edges={['top', 'left', 'right']} style={styles.screen}>
    {scroll ? <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.page}>{children}</ScrollView> : <View style={[styles.page, { flex: 1 }]}>{children}</View>}
  </SafeAreaView>;
}
export function BackHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return <View style={styles.header}><IconButton name="arrow-back" label="Volver" onPress={() => router.canGoBack() ? router.back() : router.replace('/')} /><Txt kind="label" style={{ flex: 1, textAlign: 'center' }}>{title}</Txt>{right ?? <View style={{ width: 44 }} />}</View>;
}
export function Section({ title, subtitle, action, onAction }: { title: string; subtitle?: string; action?: string; onAction?: () => void }) {
  return <View style={styles.section}><View style={{ flex: 1 }}><Txt kind="heading">{title}</Txt>{subtitle && <Txt kind="caption" style={{ marginTop: 4 }}>{subtitle}</Txt>}</View>{action && <Pressable accessibilityRole="button" onPress={onAction} style={{ paddingVertical: 12, paddingLeft: 12 }}><Txt kind="label" style={{ color: colors.green }}>{action}</Txt></Pressable>}</View>;
}
export function Pill({ title, selected, onPress }: { title: string; selected?: boolean; onPress?: () => void }) {
  return <Pressable accessibilityRole={onPress ? 'button' : undefined} aria-pressed={onPress ? !!selected : undefined} accessibilityState={onPress ? { selected: !!selected } : undefined} onPress={onPress} style={[styles.pill, selected && { backgroundColor: colors.green, borderColor: colors.green }]}><Txt kind="label" style={{ color: selected ? colors.paper : colors.muted }}>{title}</Txt></Pressable>;
}
export function EmptyState({ title, text, icon = 'leaf-outline', action, onAction }: { title: string; text: string; icon?: IconName; action?: string; onAction?: () => void }) {
  return <View style={styles.empty}><View style={styles.emptyIcon}><Icon name={icon} size={30} color={colors.green} /></View><Txt kind="heading" style={{ textAlign: 'center' }}>{title}</Txt><Txt style={{ textAlign: 'center', color: colors.muted }}>{text}</Txt>{action && onAction && <Button title={action} onPress={onAction} />}</View>;
}
export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return <View style={{ gap: 8 }}><Txt kind="label">{label}</Txt><TextInput accessibilityLabel={label} placeholderTextColor={colors.muted} {...props} style={[styles.input, props.multiline && { minHeight: 110, textAlignVertical: 'top' }, props.style]} /></View>;
}
export function Sheet({ visible, title, onClose, children }: React.PropsWithChildren<{ visible: boolean; title: string; onClose: () => void }>) {
  return <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.backdrop}>
      <Pressable accessibilityLabel="Cerrar diálogo" onPress={onClose} style={StyleSheet.absoluteFill} />
      <SafeAreaView edges={['bottom']} style={styles.sheet}><View style={styles.header}><Txt kind="heading" style={{ flex: 1 }}>{title}</Txt><IconButton name="close" label="Cerrar" onPress={onClose} /></View><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ gap: 18, paddingBottom: 20 }}>{children}</ScrollView></SafeAreaView>
    </KeyboardAvoidingView>
  </Modal>;
}
export function Loading() { return <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center', gap: 16 }]}><ActivityIndicator color={colors.green} /><Txt>Preparando tu espacio de estudio…</Txt></View>; }

export const styles = StyleSheet.create({
  text: { color: colors.ink, fontFamily: fonts.regular, fontSize: 15, lineHeight: 23 },
  body: {}, caption: { fontSize: 12, lineHeight: 18, color: colors.muted }, label: { fontSize: 13, fontFamily: fonts.medium, lineHeight: 20 },
  title: { fontSize: 32, lineHeight: 38, letterSpacing: -1.2, fontFamily: fonts.bold },
  heading: { fontSize: 20, lineHeight: 26, letterSpacing: -0.5, fontFamily: fonts.bold },
  screen: { flex: 1, backgroundColor: colors.bg }, page: { paddingHorizontal: 22, paddingTop: 10, paddingBottom: 34, width: '100%', maxWidth: 900, alignSelf: 'center', gap: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 48 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  section: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 4 },
  button: { minHeight: 50, paddingHorizontal: 18, paddingVertical: 12, backgroundColor: colors.green, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  secondary: { backgroundColor: colors.mint }, iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 15 },
  pill: { paddingHorizontal: 18, minHeight: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 24, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.paper },
  empty: { alignItems: 'center', paddingVertical: 30, paddingHorizontal: 18, gap: 15, borderRadius: 24, backgroundColor: colors.paper },
  emptyIcon: { backgroundColor: colors.mint, padding: 18, borderRadius: 25 },
  input: { borderWidth: 1, borderColor: colors.line, borderRadius: 14, padding: 14, fontSize: 15, fontFamily: fonts.regular, color: colors.ink, backgroundColor: colors.paper },
  backdrop: { flex: 1, backgroundColor: '#132D2766', justifyContent: 'flex-end', alignItems: 'center' },
  sheet: { width: '100%', maxWidth: 600, maxHeight: '90%', padding: 22, borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: colors.bg, gap: 18 },
  card: { padding: 20, borderRadius: 22, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, gap: 12 },
});
