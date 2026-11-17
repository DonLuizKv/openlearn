import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { BackHeader, Button, EmptyState, Field, Icon, IconButton, Screen, Section, Sheet, Txt, styles } from '../../components/ui';
import { InstrumentCard } from '../../components/InstrumentCard';
import { LessonCard } from '../../components/LessonCard';
import { TopicAreas } from '../../components/AreaBadge';
import { lessons } from '../../data/lessons';
import { instruments } from '../../data/catalog';
import { newId, useStudy } from '../../state/StudyProvider';
import type { StudyTopic } from '../../domain/models';
import { colors } from '../../theme';

export default function TopicScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state } = useStudy();
  const topic = state.topics.find(item => item.id === id);
  if (!topic) return <Screen><BackHeader title="Mi tema" /><EmptyState title="Este tema no está disponible" text="Puedes crear uno nuevo desde tu biblioteca." action="Ir a mi biblioteca" onAction={() => router.replace('/library')} /></Screen>;
  return <TopicContent key={id} topic={topic} />;
}
function TopicContent({ topic }: { topic: StudyTopic }) {
  const { update, saving, saveError } = useStudy();
  const [notes, setNotes] = useState(topic.notes);
  const [creatingCard, setCreatingCard] = useState(false);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(topic.title);
  const [description, setDescription] = useState(topic.description);
  const [deleting, setDeleting] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);
  const selected = instruments.filter(item => topic.instrumentIds.includes(item.id));
  const selectedLessons = lessons.filter(item => topic.lessonIds?.includes(item.id));
  function patchTopic(patch: Partial<StudyTopic>) {
    update(state => ({ ...state, topics: state.topics.map(item => item.id === topic.id ? { ...item, ...patch } : item) }));
  }
  function addCard() {
    if (!front.trim() || !back.trim()) return;
    patchTopic({ cards: [...topic.cards, { id: newId('card'), front: front.trim(), back: back.trim() }] });
    setFront(''); setBack(''); setCreatingCard(false);
  }
  return <Screen>
    <BackHeader title="Mi tema de estudio" right={<IconButton name="create-outline" label="Editar tema" onPress={() => { setTitle(topic.title); setDescription(topic.description); setEditing(true); }} />} />
    <View style={{ alignSelf: 'flex-start', padding: 14, backgroundColor: colors.mint, borderRadius: 18 }}><Icon name="folder-open-outline" size={30} color={colors.green} /></View>
    <View style={{ gap: 8 }}><Txt kind="title">{topic.title}</Txt>{!!topic.description && <Txt style={{ color: colors.muted }}>{topic.description}</Txt>}<Txt kind="caption">{selectedLessons.length} lecciones · {selected.length} fichas · {topic.cards.length} tarjetas propias</Txt><TopicAreas topic={topic} /></View>
    <Button title="Estudiar este tema" icon="play-outline" disabled={!selected.length && !selectedLessons.length && !topic.cards.length} onPress={() => router.push({ pathname: '/study', params: { mode: 'flashcards', topic: topic.id } })} />
    <Section title="Mis recursos" action="Añadir" onAction={() => router.push('/')} />
    {selected.length === 0 && selectedLessons.length === 0 && <EmptyState title="Dale forma a tu tema" text="Guarda lecciones e imágenes de cualquier área en este espacio." icon="images-outline" action="Explorar recursos" onAction={() => router.push('/')} />}
    {selectedLessons.map(lesson => <LessonCard key={lesson.id} lesson={lesson} />)}
    {selected.map(item => <InstrumentCard key={item.id} item={item} compact />)}
    <Section title="Mis notas" subtitle="Conecta lo que lees con lo que aprendes en clase." />
    <Field label="Notas del tema" placeholder="Escribe una idea, una comparación o algo que quieras recordar…" value={notes} onChangeText={setNotes} multiline maxLength={20000} style={{ minHeight: 160 }} />
    <View style={[styles.row, { justifyContent: 'space-between' }]}><Txt kind="caption" style={{ flex: 1 }}>{notes !== topic.notes ? 'Tienes cambios sin guardar' : saving ? 'Guardando…' : saveError ? 'Pendiente de guardar en el dispositivo' : 'Notas guardadas'}</Txt><Button title="Guardar notas" secondary disabled={notes === topic.notes} onPress={() => patchTopic({ notes })} /></View>
    <Section title="Mis flashcards" action="Crear tarjeta" onAction={() => setCreatingCard(true)} />
    {topic.cards.length === 0 ? <View style={styles.card}><Icon name="layers-outline" color={colors.green} /><Txt>Convierte tus apuntes en preguntas. Escribe una pregunta al frente y su respuesta al reverso.</Txt><Button title="Crear mi primera tarjeta" secondary icon="add" onPress={() => setCreatingCard(true)} /></View> : topic.cards.map(card => <View key={card.id} style={styles.card}><View style={styles.row}><Txt kind="label" style={{ flex: 1 }}>{card.front}</Txt><IconButton name="trash-outline" label={`Eliminar tarjeta: ${card.front}`} onPress={() => setCardToDelete(card.id)} color={colors.muted} /></View><Txt kind="caption">{card.back}</Txt></View>)}
    <Pressable accessibilityRole="button" onPress={() => setDeleting(true)} style={{ padding: 14, alignSelf: 'center' }}><Txt kind="label" style={{ color: colors.red }}>Eliminar tema</Txt></Pressable>
    <Sheet visible={creatingCard} title="Una pregunta para recordar" onClose={() => setCreatingCard(false)}><Field label="Pregunta" placeholder="¿Qué quiero recordar?" value={front} onChangeText={setFront} multiline maxLength={500} /><Field label="Respuesta" placeholder="La explicación, con mis palabras…" value={back} onChangeText={setBack} multiline maxLength={2000} /><Button title="Guardar tarjeta" onPress={addCard} disabled={!front.trim() || !back.trim()} /></Sheet>
    <Sheet visible={editing} title="Editar mi tema" onClose={() => setEditing(false)}><Field label="Nombre del tema" value={title} onChangeText={setTitle} maxLength={80} /><Field label="Objetivo de estudio" value={description} onChangeText={setDescription} maxLength={240} multiline /><Button title="Guardar cambios" disabled={!title.trim()} onPress={() => { patchTopic({ title: title.trim(), description: description.trim() }); setEditing(false); }} /></Sheet>
    <Sheet visible={deleting} title="¿Eliminar este tema?" onClose={() => setDeleting(false)}><Txt>Se eliminarán sus notas y tarjetas propias. Las fichas del catálogo y otros temas se conservarán.</Txt><Button title="Conservar tema" secondary onPress={() => setDeleting(false)} /><Button title="Sí, eliminar tema" onPress={() => { update(state => ({ ...state, topics: state.topics.filter(item => item.id !== topic.id), reviews: Object.fromEntries(Object.entries(state.reviews).filter(([id]) => !topic.cards.some(card => card.id === id))) })); router.replace('/library'); }} /></Sheet>
    <Sheet visible={!!cardToDelete} title="¿Eliminar esta tarjeta?" onClose={() => setCardToDelete(null)}><Txt>Se eliminará la tarjeta y su historial de respuestas.</Txt><Button title="Conservar tarjeta" secondary onPress={() => setCardToDelete(null)} /><Button title="Eliminar tarjeta" onPress={() => { update(state => ({ ...state, topics: state.topics.map(item => item.id === topic.id ? { ...item, cards: item.cards.filter(card => card.id !== cardToDelete) } : item), reviews: Object.fromEntries(Object.entries(state.reviews).filter(([id]) => id !== cardToDelete)) })); setCardToDelete(null); }} /></Sheet>
  </Screen>;
}
