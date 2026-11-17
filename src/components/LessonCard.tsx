import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import type { Lesson } from '../domain/models';
import { areas } from '../data/areas';
import { useStudy } from '../state/StudyProvider';
import { Icon, Txt, styles } from './ui';
import { AreaBadge } from './AreaBadge';

export function LessonCard({ lesson }: { lesson: Lesson }) {
  const palette = areas[lesson.area];
  const { state } = useStudy();
  const saved = state.topics.some(topic => topic.lessonIds?.includes(lesson.id));
  return <Pressable accessibilityRole="button" accessibilityLabel={`Leer ${lesson.title}`} onPress={() => router.push(`/lesson/${lesson.id}`)} style={({ pressed }) => [styles.card, { borderTopWidth: 3, borderTopColor: palette.color, gap: 10, opacity: pressed ? 0.75 : 1 }]}>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}><AreaBadge area={lesson.area} />{saved && <Icon name="bookmark" color={palette.color} size={16} />}</View>
    <Txt kind="heading" style={{ fontSize: 18, lineHeight: 24 }}>{lesson.title}</Txt>
    <Txt kind="caption">{lesson.summary}</Txt>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 }}><Icon name="time-outline" size={14} color={palette.color} /><Txt kind="caption" style={{ flex: 1 }}>{lesson.minutes} min de lectura · {lesson.questions.length} preguntas</Txt><Icon name="arrow-forward" size={17} color={palette.color} /></View>
  </Pressable>;
}
