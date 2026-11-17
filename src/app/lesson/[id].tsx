import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { areas } from '../../data/areas';
import { findLesson } from '../../data/lessons';
import { instruments } from '../../data/catalog';
import { toggleLesson } from '../../domain/study';
import { useStudy } from '../../state/StudyProvider';
import { AreaBadge } from '../../components/AreaBadge';
import { InstrumentCard } from '../../components/InstrumentCard';
import { SourceLink } from '../../components/SourceLink';
import { TopicForm } from '../../components/TopicForm';
import { BackHeader, Button, EmptyState, Icon, IconButton, Screen, Section, Sheet, Txt, styles } from '../../components/ui';
import { colors } from '../../theme';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = findLesson(id);
  const { state, update } = useStudy();
  const [selecting, setSelecting] = useState(false);
  const [creating, setCreating] = useState(false);
  if (!lesson) return <Screen><BackHeader title="Lección" /><EmptyState title="Esta lección no está disponible" text="Explora el catálogo para elegir otro tema." action="Explorar" onAction={() => router.replace('/')} /></Screen>;
  const palette = areas[lesson.area];
  const saved = state.topics.filter(topic => topic.lessonIds?.includes(id)).length;
  const start = (mode: string) => router.push({ pathname: '/study', params: { mode, lesson: id } });
  return <Screen>
    <BackHeader title="Explora un tema" right={<IconButton name={saved ? 'bookmark' : 'bookmark-outline'} label="Guardar lección" color={palette.color} onPress={() => setSelecting(true)} />} />
    <AreaBadge area={lesson.area} />
    <View style={[styles.card, { backgroundColor: palette.soft, borderWidth: 0, gap: 14 }]}>
      <Icon name={palette.icon} color={palette.color} size={34} />
      <Txt kind="caption" style={{ color: palette.color }}>{lesson.subject.toUpperCase()}</Txt>
      <Txt kind="title" style={{ fontSize: 29, lineHeight: 35, color: palette.dark }}>{lesson.title}</Txt>
      <Txt>{lesson.summary}</Txt>
      <Txt kind="caption">{lesson.minutes} min de lectura estimada · Nivel introductorio</Txt>
    </View>
    <Button title={saved ? `Guardada en ${saved} ${saved === 1 ? 'tema' : 'temas'}` : 'Guardar lección en mi biblioteca'} icon="bookmark-outline" style={{ backgroundColor: palette.color }} onPress={() => setSelecting(true)} />
    {lesson.sections.map((section, index) => <View key={section.title} style={{ gap: 10 }}>
      <View style={styles.row}><Txt kind="label" style={{ color: palette.color }}>0{index + 1}</Txt><Txt kind="heading" style={{ flex: 1 }}>{section.title}</Txt></View>
      <Txt>{section.text}</Txt>
    </View>)}
    {lesson.instrumentIds.length > 0 && <><Section title="Míralo en las fichas" subtitle="Amplía las fotografías y observa sus diferencias." />{instruments.filter(item => lesson.instrumentIds.includes(item.id)).map(item => <InstrumentCard key={item.id} item={item} compact />)}</>}
    <View style={[styles.card, { backgroundColor: palette.soft, borderColor: palette.soft }]}>
      <Txt kind="heading">De leer a recordar</Txt><Txt>Practica las {lesson.questions.length} preguntas de esta lección.</Txt>
      <Button title="Practicar esta lección" icon="play-outline" style={{ backgroundColor: palette.color }} onPress={() => start('quiz')} />
      <Button title="Repasar con flashcards" secondary onPress={() => start('flashcards')} style={{ backgroundColor: colors.paper }} />
    </View>
    <Section title="Fuentes para profundizar" />
    <View style={styles.card}>{lesson.sources.map(source => <SourceLink key={source.url} {...source} />)}<Txt kind="caption">Explicaciones y preguntas introductorias de OpenLearn. Los enlaces externos requieren conexión.</Txt></View>
    {lesson.area === 'medicine' && <Txt kind="caption">Contenido introductorio pendiente de revisión docente. Las decisiones clínicas y el procesamiento del instrumental siguen los protocolos del centro y las instrucciones del fabricante.</Txt>}
    <Sheet visible={selecting} title="Guardar en un tema" onClose={() => setSelecting(false)}>
      <Txt>Reúne esta lección con tus fichas, notas y tarjetas. Toca un tema para añadirla o quitarla.</Txt>
      {state.topics.map(topic => {
        const selected = !!topic.lessonIds?.includes(id);
        return <Pressable key={topic.id} accessibilityRole="checkbox" aria-checked={selected} accessibilityState={{ checked: selected }} accessibilityLabel={topic.title} onPress={() => update(previous => toggleLesson(previous, topic.id, id))} style={[styles.card, styles.row, selected && { backgroundColor: palette.soft, borderColor: palette.color }]}>
          <Icon name={selected ? 'checkmark-circle' : 'ellipse-outline'} color={palette.color} /><Txt style={{ flex: 1 }}>{topic.title}</Txt>
        </Pressable>;
      })}
      <Button title="Crear un nuevo tema" secondary icon="add" onPress={() => { setSelecting(false); setCreating(true); }} />
      <Button title="Listo" style={{ backgroundColor: palette.color }} onPress={() => setSelecting(false)} />
    </Sheet>
    <TopicForm visible={creating} onClose={() => setCreating(false)} onCreated={topicId => { update(previous => toggleLesson(previous, topicId, id)); setSelecting(true); }} />
  </Screen>;
}
