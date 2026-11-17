import { Image, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import type { Instrument } from '../domain/models';
import { Icon, Txt } from './ui';
import { colors } from '../theme';
import { useStudy } from '../state/StudyProvider';
import { AreaBadge } from './AreaBadge';

export function InstrumentCard({ item, compact = false }: { item: Instrument; compact?: boolean }) {
  const { state } = useStudy();
  const saved = state.topics.some(topic => topic.instrumentIds.includes(item.id));
  return <Pressable accessibilityRole="button" accessibilityLabel={`Ver ${item.name}`} onPress={() => router.push(`/instrument/${item.id}`)} style={({ pressed }) => [s.card, compact && s.compact, pressed && { opacity: 0.8 }]}>
    <View style={[s.imageWrap, compact && { width: 86, height: 78, borderRadius: 12 }]}>
      <Image source={item.photo.asset} style={{ width: '100%', height: '100%' }} resizeMode="contain" accessibilityLabel={item.name} />
      {!compact && saved && <View style={s.saved}><Icon name="bookmark" size={15} color={colors.green} /></View>}
    </View>
    <View style={[s.content, compact && { flex: 1, padding: 0 }]}>{!compact && <AreaBadge area="medicine" />}<Txt kind="caption" style={{ color: colors.green }}>{item.category.toUpperCase()}</Txt><Txt kind="label" style={{ fontSize: 15, lineHeight: 21 }}>{item.name}</Txt>{!compact && <View style={s.footer}><Txt kind="caption">Ficha visual</Txt><Icon name="arrow-forward" size={16} color={colors.green} /></View>}</View>
    {compact && <Icon name="chevron-forward" size={18} color={colors.muted} />}
  </Pressable>;
}
const s = StyleSheet.create({
  card: { flex: 1, borderRadius: 20, overflow: 'hidden', backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line },
  compact: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 14 },
  imageWrap: { height: 132, backgroundColor: '#F1F0E8', overflow: 'hidden' },
  content: { padding: 14, gap: 5 }, footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 9 },
  saved: { position: 'absolute', top: 8, right: 8, padding: 7, borderRadius: 12, backgroundColor: colors.paper },
});
