import { ScrollView, View, Pressable } from 'react-native';
import type { AreaId, StudyTopic } from '../domain/models';
import { areaList, areas } from '../data/areas';
import { lessons } from '../data/lessons';
import { Icon, Txt } from './ui';
import { colors } from '../theme';

export function AreaBadge({ area }: { area: AreaId }) {
  const palette = areas[area];
  return <View style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 5, paddingHorizontal: 9, borderRadius: 9, backgroundColor: palette.soft }}>
    <Icon name={palette.icon} size={13} color={palette.color} />
    <Txt kind="caption" style={{ color: palette.color }}>{palette.name}</Txt>
  </View>;
}

export function AreaFilter({ value, onChange }: { value: AreaId | 'all'; onChange: (id: AreaId | 'all') => void }) {
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 9 }} style={{ flexGrow: 0 }}>
    <Pressable accessibilityRole="button" accessibilityLabel="Todas las áreas" aria-pressed={value === 'all'} onPress={() => onChange('all')} style={{ borderRadius: 16, padding: 13, minHeight: 70, justifyContent: 'center', backgroundColor: value === 'all' ? colors.ink : colors.paper, borderWidth: 1, borderColor: colors.line }}>
      <Icon name="apps-outline" color={value === 'all' ? colors.paper : colors.muted} size={20} />
      <Txt kind="label" style={{ color: value === 'all' ? colors.paper : colors.muted, marginTop: 5 }}>Todo</Txt>
    </Pressable>
    {areaList.map(area => <Pressable key={area.id} accessibilityRole="button" accessibilityLabel={`Área ${area.name}`} aria-pressed={value === area.id} onPress={() => onChange(area.id)} style={{ borderRadius: 16, padding: 13, minHeight: 70, backgroundColor: value === area.id ? area.color : area.soft, borderWidth: 1, borderColor: value === area.id ? area.color : 'transparent', gap: 5 }}>
      <Icon name={area.icon} color={value === area.id ? colors.paper : area.color} size={20} />
      <Txt kind="label" style={{ color: value === area.id ? colors.paper : area.color }}>{area.name}</Txt>
    </Pressable>)}
  </ScrollView>;
}

export function TopicAreas({ topic }: { topic: StudyTopic }) {
  const ids = new Set<AreaId>(topic.instrumentIds.length ? ['medicine'] : []);
  lessons.filter(lesson => topic.lessonIds?.includes(lesson.id)).forEach(lesson => ids.add(lesson.area));
  return ids.size ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{[...ids].map(id => <AreaBadge key={id} area={id} />)}</View> : null;
}
