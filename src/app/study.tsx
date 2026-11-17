import { useMemo, useRef, useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { findInstrument, instruments } from '../data/catalog';
import { findLesson, lessons } from '../data/lessons';
import { areas, isArea } from '../data/areas';
import { AreaBadge } from '../components/AreaBadge';
import { buildDeck, quizChoices, recordAnswer, shuffle } from '../domain/study';
import type { StudyCard } from '../domain/models';
import { useStudy } from '../state/StudyProvider';
import { Button, EmptyState, Icon, IconButton, Screen, Sheet, Txt, styles } from '../components/ui';
import { colors, fonts } from '../theme';

export default function StudyScreen() {
  const params = useLocalSearchParams<{ mode?: string; topic?: string; review?: string; lesson?: string; area?: string; content?: string }>();
  const { state } = useStudy();
  const topic = state.topics.find(item => item.id === params.topic);
  const validTopic = !params.topic || params.topic === 'all' || !!topic;
  const mode = params.mode === 'quiz' ? 'quiz' : 'flashcards';
  const lesson = findLesson(params.lesson);
  const area = isArea(params.area) ? params.area : undefined;
  const valid = validTopic && (!params.lesson || !!lesson) && (!params.area || params.area === 'all' || !!area);
  const lessonPool = params.content === 'visual' ? [] : lesson ? [lesson] : area ? lessons.filter(item => item.area === area) : lessons;
  const instrumentPool = lesson || (area && area !== 'medicine') ? [] : instruments;
  const cards = valid ? buildDeck(instrumentPool, topic, lessonPool).filter(card =>
    (mode !== 'quiz' || card.instrumentId || card.options?.length) &&
    (params.review !== '1' || state.reviews[card.id]?.lastCorrect === false)) : [];
  return <StudySession key={`${params.topic}-${mode}-${params.review}-${params.lesson}-${params.area}-${params.content}`} initialCards={cards} mode={mode} title={lesson?.title ?? topic?.title ?? (area ? areas[area].name : 'Explora y aprende')} />;
}

function StudySession({ initialCards, mode, title }: { initialCards: StudyCard[]; mode: 'quiz' | 'flashcards'; title: string }) {
  const { update } = useStudy();
  const [deck, setDeck] = useState(() => shuffle(initialCards));
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [graded, setGraded] = useState<boolean | null>(null);
  const [results, setResults] = useState<{ id: string; correct: boolean }[]>([]);
  const [quitting, setQuitting] = useState(false);
  const answerLocked = useRef(false);
  const completed = useRef(false);
  const card = deck[index];
  const item = findInstrument(card?.instrumentId);
  const choices = useMemo(() => card?.instrumentId
    ? quizChoices(card.instrumentId, instruments).map(id => ({ id, label: findInstrument(id)?.name ?? id }))
    : shuffle(card?.options ?? []).map(text => ({ id: text, label: text })), [card]);
  const answerId = card?.instrumentId ?? card?.answer;
  const palette = card?.area ? areas[card.area] : undefined;
  const finished = deck.length > 0 && index >= deck.length;
  const missed = results.filter(result => !result.correct).map(result => result.id);
  const correctCount = results.length - missed.length;

  function grade(correct: boolean, choice?: string) {
    if (answerLocked.current || !card) return;
    answerLocked.current = true;
    setSelected(choice ?? null); setGraded(correct); setRevealed(true);
    setResults(previous => [...previous, { id: card.id, correct }]);
    update(state => recordAnswer(state, card.id, correct, new Date().toISOString()));
  }
  function next() {
    if (graded === null) return;
    if (index === deck.length - 1 && !completed.current) {
      completed.current = true;
      update(state => ({ ...state, sessions: state.sessions + 1 }));
    }
    answerLocked.current = false;
    setIndex(value => value + 1); setSelected(null); setRevealed(false); setGraded(null);
  }
  function restart(onlyMissed: boolean) {
    setDeck(shuffle(onlyMissed ? deck.filter(candidate => missed.includes(candidate.id)) : initialCards));
    setIndex(0); setResults([]); setSelected(null); setRevealed(false); setGraded(null);
    answerLocked.current = false; completed.current = false;
  }
  if (!deck.length) return <Screen><EmptyState title="Todavía no hay tarjetas para esta sesión" text="Añade contenido a tu tema o elige el catálogo completo. Si estabas repasando errores, puede que ya los hayas resuelto." icon="layers-outline" action="Volver a practicar" onAction={() => router.replace('/practice')} /></Screen>;
  if (finished) return <Screen>
    <View style={{ alignItems: 'center', paddingVertical: 26, gap: 16 }}><View style={{ backgroundColor: colors.mint, padding: 25, borderRadius: 34 }}><Icon name="ribbon-outline" size={54} color={colors.green} /></View><Txt kind="caption" style={{ letterSpacing: 2, color: colors.green }}>UN PASO MÁS EN TU APRENDIZAJE</Txt><Txt kind="title" style={{ textAlign: 'center' }}>¡Sesión completada!</Txt><Txt style={{ color: colors.muted, textAlign: 'center' }}>{missed.length ? 'Cada error te muestra qué puedes repasar.' : 'Buen trabajo. Sigue practicando para recordarlo después.'}</Txt></View>
    <View style={[styles.card, { alignItems: 'center', backgroundColor: colors.dark }]}><Txt kind="title" style={{ color: colors.lime, fontSize: 48, lineHeight: 60 }}>{correctCount} / {deck.length}</Txt><Txt style={{ color: colors.paper }}>{mode === 'quiz' ? 'respuestas correctas' : 'tarjetas que recordaste'}</Txt></View>
    {missed.length > 0 && <View style={styles.card}><Txt kind="heading">Vale la pena volver a mirar</Txt>{deck.filter(candidate => missed.includes(candidate.id)).map(candidate => { const instrument = findInstrument(candidate.instrumentId); const lesson = findLesson(candidate.lessonId); return <View key={candidate.id} style={styles.row}><Icon name="refresh-outline" size={17} color={colors.orange} /><Txt style={{ flex: 1 }}>{instrument?.name ?? candidate.front}</Txt>{instrument && <IconButton name="arrow-forward" label={`Revisar ${instrument.name}`} onPress={() => router.push(`/instrument/${instrument.id}`)} />}{lesson && <IconButton name="book-outline" label={`Revisar ${lesson.title}`} onPress={() => router.push(`/lesson/${lesson.id}`)} />}</View>; })}</View>}
    {missed.length > 0 && <Button title={`Repasar ${missed.length} pendientes`} icon="refresh-outline" onPress={() => restart(true)} />}
    <Button title="Repetir sesión completa" secondary onPress={() => restart(false)} />
    <Button title="Volver a practicar" onPress={() => router.replace('/practice')} />
  </Screen>;

  return <Screen>
    <View style={styles.row}><IconButton name="close" label="Salir de la sesión" onPress={() => setQuitting(true)} /><View style={{ flex: 1 }}><Txt kind="label">{mode === 'quiz' ? 'Quiz de conocimientos' : 'Flashcards'}</Txt><Txt kind="caption" numberOfLines={1}>{title}</Txt></View><Txt kind="label">{index + 1} / {deck.length}</Txt></View>
    {card.area && <AreaBadge area={card.area} />}
    <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: deck.length, now: index }} style={{ height: 5, borderRadius: 3, backgroundColor: colors.line, overflow: 'hidden' }}><View style={{ height: '100%', width: `${index / deck.length * 100}%`, backgroundColor: colors.green }} /></View>
    <View style={{ gap: 8, marginVertical: 6 }}><Txt kind="caption" style={{ color: palette?.color ?? colors.green, letterSpacing: 1.3 }}>{mode === 'quiz' ? 'PIENSA Y ELIGE' : 'TÓMATE TU TIEMPO'}</Txt><Txt kind="heading">{card.front}</Txt><Txt kind="caption">{item ? 'Puedes ampliar la fotografía para ver los detalles.' : mode === 'quiz' ? 'Elige una respuesta y consulta la explicación.' : 'Piensa en tu respuesta antes de revelar el reverso.'}</Txt></View>
    <View style={[styles.card, { padding: 0, overflow: 'hidden' }]}>
      {item ? <Pressable accessibilityRole="button" accessibilityLabel="Ampliar imagen de la pregunta" onPress={() => router.push({ pathname: '/viewer/[id]', params: { id: item.id, hidden: revealed ? '0' : '1' } })} style={{ position: 'relative' }}><Image source={item.photo.asset} resizeMode="contain" accessibilityLabel="Instrumento por identificar" style={{ width: '100%', height: 235, backgroundColor: '#E8EAE1' }} /><View style={{ position: 'absolute', bottom: 12, right: 12, backgroundColor: colors.paper, padding: 8, borderRadius: 12 }}><Icon name="expand-outline" size={18} /></View></Pressable> : <View style={{ height: 100, alignItems: 'center', justifyContent: 'center', backgroundColor: palette?.soft ?? colors.mint }}><Icon name={palette?.icon ?? 'chatbubble-ellipses-outline'} size={42} color={palette?.color ?? colors.green} /></View>}
      {mode === 'flashcards' && <View style={{ padding: 22, gap: 12 }}>{revealed ? <><Txt kind="caption" style={{ color: colors.green }}>LA RESPUESTA</Txt><Txt style={{ fontFamily: fonts.bold, fontSize: 19, lineHeight: 28 }}>{card.back}</Txt>{item && <Txt kind="caption">{item.hint}</Txt>}</> : <View style={{ alignItems: 'center', gap: 8 }}><Icon name="eye-off-outline" color={colors.muted} /><Txt kind="caption">Intenta recordarlo antes de mirar.</Txt></View>}</View>}
    </View>
    {mode === 'quiz' ? <View style={{ gap: 10 }}>{choices.map((choice, position) => {
      const correct = revealed && choice.id === answerId;
      const wrong = revealed && selected === choice.id && !correct;
      return <Pressable key={choice.id} accessibilityRole="button" accessibilityLabel={choice.label} accessibilityState={{ disabled: graded !== null }} disabled={graded !== null} onPress={() => grade(choice.id === answerId, choice.id)} style={[styles.card, styles.row, { padding: 15, borderRadius: 15 }, correct && { borderColor: colors.green, backgroundColor: colors.mint }, wrong && { borderColor: colors.red, backgroundColor: colors.redLight }]}><View style={{ width: 30, height: 30, borderRadius: 9, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}><Txt kind="label">{String.fromCharCode(65 + position)}</Txt></View><Txt style={{ flex: 1 }}>{choice.label}</Txt>{correct && <Icon name="checkmark-circle" color={colors.green} />}{wrong && <Icon name="close-circle" color={colors.red} />}</Pressable>;
    })}</View> : !revealed ? <Button title="Revelar respuesta" icon="eye-outline" onPress={() => setRevealed(true)} /> : graded === null ? <View style={{ gap: 12 }}><Txt style={{ textAlign: 'center' }}>¿Cómo te fue?</Txt><View style={styles.row}><Button title="Necesito repasar" secondary onPress={() => grade(false)} style={{ flex: 1, paddingHorizontal: 10 }} /><Button title="Lo recordé" onPress={() => grade(true)} style={{ flex: 1, paddingHorizontal: 10 }} /></View></View> : null}
    {graded !== null && <View accessibilityLiveRegion="polite" style={[styles.card, { backgroundColor: graded ? colors.mint : colors.peach, borderWidth: 0 }]}><View style={styles.row}><Icon name={graded ? 'checkmark-circle-outline' : 'bulb-outline'} color={graded ? colors.green : colors.orange} /><Txt kind="heading">{graded ? '¡Bien recordado!' : 'Una oportunidad de aprender'}</Txt></View>{mode === 'quiz' && <><Txt>{card.back}</Txt>{item && <Txt kind="caption">{item.hint}</Txt>}</>}<Button title={index === deck.length - 1 ? 'Ver mis resultados' : 'Siguiente tarjeta'} icon="arrow-forward" onPress={next} /></View>}
    <Sheet visible={quitting} title="¿Dejar esta sesión?" onClose={() => setQuitting(false)}><Txt>Conservaremos las respuestas que ya registraste. La próxima sesión comenzará desde el principio.</Txt><Button title="Seguir estudiando" onPress={() => setQuitting(false)} /><Button title="Salir de la sesión" secondary onPress={() => router.replace('/practice')} /></Sheet>
  </Screen>;
}
