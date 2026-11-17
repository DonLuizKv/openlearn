import { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { findInstrument } from '../../data/catalog';
import { BackHeader, Button, EmptyState, Icon, IconButton, Screen, Section, Sheet, Txt, styles } from '../../components/ui';
import { TopicForm } from '../../components/TopicForm';
import { SourceLink } from '../../components/SourceLink';
import { useStudy } from '../../state/StudyProvider';
import { toggleInstrument } from '../../domain/study';
import { colors } from '../../theme';

export default function InstrumentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = findInstrument(id);
  const { state, update } = useStudy();
  const [selecting, setSelecting] = useState(false);
  const [creating, setCreating] = useState(false);
  const savedIn = state.topics.filter(topic => topic.instrumentIds.includes(id));
  if (!item) return <Screen><BackHeader title="Instrumento" /><EmptyState title="No encontramos esta ficha" text="Vuelve al catálogo para explorar los instrumentos disponibles." action="Explorar" onAction={() => router.replace('/')} /></Screen>;
  return <Screen>
    <BackHeader title="Ficha de estudio" right={<IconButton name={savedIn.length ? 'bookmark' : 'bookmark-outline'} label="Guardar en un tema" onPress={() => setSelecting(true)} color={colors.green} />} />
    <View style={s.category}><Txt kind="caption" style={{ color: colors.green }}>INSTRUMENTAL · {item.category.toUpperCase()}</Txt></View>
    <View style={{ gap: 7 }}><Txt kind="title">{item.name}</Txt><Txt kind="caption">También conocido como {item.aliases[0]}</Txt></View>
    <Pressable accessibilityRole="button" accessibilityLabel={`Ampliar fotografía de ${item.name}`} onPress={() => router.push(`/viewer/${item.id}`)} style={s.photo}>
      <Image source={item.photo.asset} resizeMode="contain" style={{ width: '100%', height: 260 }} accessibilityLabel={item.name} />
      <View style={s.expand}><Icon name="expand-outline" size={18} color={colors.paper} /><Txt kind="caption" style={{ color: colors.paper }}>Explorar imagen</Txt></View>
    </Pressable>
    <Txt kind="caption" style={{ marginTop: -10 }}>Fotografía: {item.photo.author} · {item.photo.license}</Txt>
    <Button title={savedIn.length ? `Guardado en ${savedIn.length} ${savedIn.length === 1 ? 'tema' : 'temas'}` : 'Guardar en mi biblioteca'} icon={savedIn.length ? 'bookmark' : 'bookmark-outline'} onPress={() => setSelecting(true)} />
    <Section title="¿Para qué sirve?" /><Txt style={{ marginTop: -9 }}>{item.summary}</Txt>
    <Section title="Claves para reconocerlo" />
    <View style={styles.card}>{item.recognition.map((text, index) => <View key={text} style={[styles.row, { alignItems: 'flex-start' }]}><View style={s.number}><Txt kind="label" style={{ color: colors.green }}>{index + 1}</Txt></View><Txt style={{ flex: 1 }}>{text}</Txt></View>)}</View>
    <View style={[styles.card, { backgroundColor: colors.peach, borderWidth: 0 }]}><View style={styles.row}><Icon name="eye-outline" color={colors.orange} /><Txt kind="label">Mira un poco más de cerca</Txt></View><Txt>{item.hint}</Txt></View>
    <Section title="Fuentes y fotografía" subtitle="Sigue aprendiendo desde el material original." />
    <View style={[styles.card, { gap: 0 }]}>{item.sources.map(source => <SourceLink key={source.url} {...source} />)}<SourceLink title={`Fotografía · ${item.photo.author}`} url={item.photo.source} /><SourceLink title={`Licencia ${item.photo.license}`} url={item.photo.licenseUrl} /><Txt kind="caption">Fotografía redimensionada, sin retoques. Los enlaces externos requieren conexión.</Txt></View>
    <Txt kind="caption">Material introductorio de reconocimiento. Las fichas están pendientes de revisión docente; no describen técnicas de uso clínico.</Txt>
    <Sheet visible={selecting} title="Guardar en un tema" onClose={() => setSelecting(false)}>
      <Txt style={{ color: colors.muted }}>Elige dónde quieres estudiar esta ficha. Toca de nuevo para quitarla de un tema.</Txt>
      {state.topics.map(topic => { const selected = topic.instrumentIds.includes(id); return <Pressable key={topic.id} accessibilityRole="checkbox" aria-checked={selected} accessibilityState={{ checked: selected }} accessibilityLabel={topic.title} onPress={() => update(previous => toggleInstrument(previous, topic.id, id))} style={[styles.card, styles.row, selected && { borderColor: colors.green, backgroundColor: colors.mint }]}><Icon name={selected ? 'checkmark-circle' : 'ellipse-outline'} color={selected ? colors.green : colors.muted} /><Txt style={{ flex: 1 }}>{topic.title}</Txt></Pressable>; })}
      <Button title="Crear un nuevo tema" secondary icon="add" onPress={() => { setSelecting(false); setCreating(true); }} />
      <Button title="Listo" onPress={() => setSelecting(false)} />
    </Sheet>
    <TopicForm visible={creating} onClose={() => setCreating(false)} onCreated={topicId => { update(previous => toggleInstrument(previous, topicId, id)); setSelecting(true); }} />
  </Screen>;
}
const s = StyleSheet.create({
  category: { alignSelf: 'flex-start', backgroundColor: colors.mint, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  photo: { backgroundColor: '#E8EAE1', borderRadius: 23, overflow: 'hidden' },
  expand: { position: 'absolute', right: 12, bottom: 12, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#183D30DD', borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 7 },
  number: { backgroundColor: colors.mint, width: 27, height: 27, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
});
