import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Button, EmptyState, Icon, Screen, Section, Txt, styles } from '../../components/ui';
import { TopicForm } from '../../components/TopicForm';
import { TopicAreas } from '../../components/AreaBadge';
import { useStudy } from '../../state/StudyProvider';
import { colors, fonts } from '../../theme';

export default function LibraryScreen() {
  const { state, saving, saveError } = useStudy();
  const [creating, setCreating] = useState(false);
  return <Screen>
    <View style={{ gap: 8, marginTop: 16 }}><Txt kind="caption" style={{ color: colors.green, letterSpacing: 1.5 }}>UN ESPACIO QUE CRECE CONTIGO</Txt><Txt kind="title">Mi biblioteca</Txt><Txt style={{ color: colors.muted }}>Lo que quieres aprender, a tu manera.</Txt></View>
    <View style={[styles.card, { backgroundColor: colors.mint, borderWidth: 0 }]}><View style={styles.row}><Icon name="albums-outline" size={30} color={colors.green} /><View style={{ flex: 1 }}><Txt kind="heading">{state.topics.length} {state.topics.length === 1 ? 'tema de estudio' : 'temas de estudio'}</Txt><Txt kind="caption">Tus fichas, notas y tarjetas en un lugar.</Txt></View></View><Button title="Crear un tema" icon="add" onPress={() => setCreating(true)} /></View>
    <Section title="Mis temas" subtitle="Organiza por examen, clase o curiosidad." />
    {state.topics.length === 0 ? <EmptyState title="Tu próxima idea empieza aquí" text="Crea tu primer tema. Añade lecciones de cualquier área, fichas visuales, notas y tarjetas propias." icon="book-outline" action="Crear mi primer tema" onAction={() => setCreating(true)} /> : state.topics.map(topic => <Pressable accessibilityRole="button" accessibilityLabel={`Abrir tema ${topic.title}`} key={topic.id} onPress={() => router.push(`/topic/${topic.id}`)} style={({ pressed }) => [styles.card, pressed && { opacity: 0.75 }]}>
      <View style={styles.row}><View style={{ backgroundColor: colors.bg, width: 48, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }}><Icon name="folder-open-outline" /></View><View style={{ flex: 1, gap: 4 }}><Txt style={{ fontFamily: fonts.bold, fontSize: 18 }}>{topic.title}</Txt><Txt kind="caption">{topic.lessonIds?.length ?? 0} lecciones · {topic.instrumentIds.length} fichas · {topic.cards.length} tarjetas propias</Txt></View><Icon name="chevron-forward" color={colors.muted} size={18} /></View><TopicAreas topic={topic} />{!!topic.description && <Txt kind="caption">{topic.description}</Txt>}
    </Pressable>)}
    <View style={[styles.row, { justifyContent: 'center', marginTop: 8 }]}><Icon name="phone-portrait-outline" size={15} color={colors.muted} /><Txt kind="caption">{saveError ? 'Hay cambios pendientes de guardar' : saving ? 'Guardando cambios…' : 'Biblioteca guardada en este dispositivo'}</Txt></View>
    <TopicForm visible={creating} onClose={() => setCreating(false)} onCreated={id => router.push(`/topic/${id}`)} />
  </Screen>;
}
