import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Icon, Pill, Screen, Section, Txt, styles } from '../../components/ui';
import { instruments } from '../../data/catalog';
import { lessons } from '../../data/lessons';
import { areas } from '../../data/areas';
import type { AreaId } from '../../domain/models';
import { AreaFilter } from '../../components/AreaBadge';
import { buildDeck } from '../../domain/study';
import { useStudy } from '../../state/StudyProvider';
import { colors } from '../../theme';

export default function PracticeScreen() {
  const { state } = useStudy();
  const [topicId, setTopicId] = useState('all');
  const [area, setArea] = useState<AreaId | 'all'>('all');
  const topic = state.topics.find(item => item.id === topicId);
  const deck = buildDeck(area === 'all' || area === 'medicine' ? instruments : [], topic, area === 'all' ? lessons : lessons.filter(lesson => lesson.area === area));
  const quizCount = deck.filter(card => card.instrumentId || card.options?.length).length;
  const palette = area === 'all' ? undefined : areas[area];
  const pending = deck.filter(card => state.reviews[card.id]?.lastCorrect === false).length;
  const reviews = Object.values(state.reviews);
  const attempts = reviews.reduce((total, review) => total + review.attempts, 0);
  const correct = reviews.reduce((total, review) => total + review.correct, 0);
  const start = (mode: string, review = false) => router.push({ pathname: '/study', params: { mode, topic: topic?.id ?? 'all', area, review: review ? '1' : '0' } });
  return <Screen>
    <View style={{ gap: 8, marginTop: 16 }}><Txt kind="caption" style={{ color: colors.green, letterSpacing: 1.5 }}>DEL “LO LEÍ” AL “LO RECUERDO”</Txt><Txt kind="title">Ponlo en práctica</Txt><Txt style={{ color: colors.muted }}>Unos minutos para afianzar lo que aprendes.</Txt></View>
    <View style={[styles.card, { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: colors.dark, borderWidth: 0 }]}>{[[String(state.sessions), 'sesiones'], [String(attempts), 'respuestas'], [attempts ? `${Math.round(correct / attempts * 100)}%` : '—', 'aciertos¹']].map(([value, label]) => <View key={label} style={{ alignItems: 'center', gap: 4 }}><Txt kind="title" style={{ color: colors.lime, fontSize: 27 }}>{value}</Txt><Txt kind="caption" style={{ color: '#D4E2D9' }}>{label}</Txt></View>)}</View>
    <Section title="¿Qué repasamos?" />
    <AreaFilter value={area} onChange={id => { setArea(id); setTopicId('all'); }} />
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} style={{ flexGrow: 0 }}><Pill title={palette ? palette.name : 'Catálogo completo'} selected={topicId === 'all' || !topic} onPress={() => setTopicId('all')} />{state.topics.map(item => <Pill key={item.id} title={item.title} selected={topicId === item.id} onPress={() => { setTopicId(item.id); setArea('all'); }} />)}</ScrollView>
    <View style={[styles.card, { backgroundColor: palette?.soft ?? '#EBEEDC' }]}><View style={styles.row}><Icon name="layers-outline" size={28} color={palette?.color ?? colors.green} /><View style={{ flex: 1 }}><Txt kind="heading">Flashcards</Txt><Txt kind="caption">Piensa. Recuerda. Descubre.</Txt></View></View><Txt>Repasa conceptos, imágenes y tarjetas propias. Intenta responder antes de mirar.</Txt><Button title={`Repasar ${deck.length} tarjetas`} icon="play-outline" onPress={() => start('flashcards')} disabled={deck.length === 0} style={palette && { backgroundColor: palette.color }} /></View>
    <View style={styles.card}><View style={styles.row}><Icon name="grid-outline" size={28} color={palette?.color ?? colors.orange} /><View style={{ flex: 1 }}><Txt kind="heading">Quiz de conocimientos</Txt><Txt kind="caption">{quizCount} preguntas con explicación.</Txt></View></View><Txt>Combina preguntas de las lecciones con reconocimiento de instrumentos, según tu selección.</Txt><Button title="Comenzar quiz" icon="arrow-forward" onPress={() => start('quiz')} disabled={quizCount === 0} style={palette && { backgroundColor: palette.color }} /><Txt kind="caption">Las tarjetas propias se practican en flashcards.</Txt></View>
    {deck.length === 0 && <Txt style={{ color: colors.muted }}>Añade lecciones, instrumentos o tarjetas a este tema para empezar.</Txt>}
    {pending > 0 && <Pressable accessibilityRole="button" onPress={() => start('flashcards', true)} style={[styles.card, styles.row]}><Icon name="refresh-outline" color={colors.orange} /><View style={{ flex: 1 }}><Txt kind="label">Otra oportunidad para aprender</Txt><Txt kind="caption">{pending} tarjetas pendientes de repaso</Txt></View><Icon name="arrow-forward" size={18} /></Pressable>}
    <Txt kind="caption">¹ Incluye tus autoevaluaciones en flashcards y las respuestas del quiz. Este porcentaje no mide competencia clínica.</Txt>
  </Screen>;
}
