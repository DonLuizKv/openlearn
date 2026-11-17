import { useState } from 'react';
import { Linking, Pressable, View } from 'react-native';
import { Icon, Txt, styles } from './ui';
import { colors } from '../theme';

export function SourceLink({ title, url }: { title: string; url: string }) {
  const [error, setError] = useState(false);
  return <View><Pressable accessibilityRole="link" onPress={() => { setError(false); Linking.openURL(url).catch(() => setError(true)); }} style={[styles.row, { paddingVertical: 10 }]}><Icon name="open-outline" size={17} color={colors.green} /><Txt kind="label" style={{ color: colors.green, flex: 1 }}>{title}</Txt></Pressable>{error && <Txt kind="caption" style={{ color: colors.red }}>No se pudo abrir el enlace. Revisa tu conexión e inténtalo de nuevo.</Txt>}</View>;
}
