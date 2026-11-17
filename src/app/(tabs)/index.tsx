import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { categories, instruments } from '../../data/catalog';
import { lessons } from '../../data/lessons';
import { areas } from '../../data/areas';
import type { AreaId } from '../../domain/models';
import { searchInstruments, searchLessons } from '../../domain/study';
import { AreaFilter } from '../../components/AreaBadge';
import { InstrumentCard } from '../../components/InstrumentCard';
import { LessonCard } from '../../components/LessonCard';
import { Button, EmptyState, Icon, IconButton, Pill, Screen, Section, Txt, styles } from '../../components/ui';
import { colors, fonts } from '../../theme';

export default function ExploreScreen() {
  const [query, setQuery] = useState('');
  const [area, setArea] = useState<AreaId | 'all'>('all');
  const [category, setCategory] = useState('Todos');
  const foundLessons = useMemo(() => searchLessons(lessons, query, area), [query, area]);
  const foundInstruments = useMemo(() => area === 'all' || area === 'medicine' ? searchInstruments(instruments, query, category) : [], [query, area, category]);
  const discoveryOrder = ['familias-instrumental', 'celulas', 'lectura-critica'];
  const displayed = area === 'all' && !query ? [...foundLessons].sort((a, b) => {
    const rank = (id: string) => discoveryOrder.includes(id) ? discoveryOrder.indexOf(id) : 3;
    return rank(a.id) - rank(b.id);
  }) : foundLessons;
  const palette = area === 'all' ? undefined : areas[area];
  const empty = !foundLessons.length && !foundInstruments.length;

  return <Screen>
    <View style={[styles.row, { justifyContent: 'space-between', marginBottom: 6 }]}>
      <View style={[styles.row, { gap: 9 }]}><View style={s.logo}><Icon name="book-outline" color={colors.paper} size={20} /></View><Txt style={s.wordmark}>openlearn.</Txt></View>
      <View style={[styles.row, { gap: 4 }]}>{Object.values(areas).map(item => <View key={item.id} style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: item.color }} />)}</View>
    </View>
    <View style={{ gap: 8 }}>
      <Txt kind="caption" style={s.eyebrow}>UN MUNDO DE TEMAS POR DESCUBRIR</Txt>
      <Txt kind="title">Aprende algo nuevo.{`\n`}Sigue tu curiosidad.</Txt>
      <Txt style={{ color: colors.muted }}>De instrumentación quirúrgica a ciencia y nuevas ideas.</Txt>
    </View>
    <View style={s.search}><Icon name="search-outline" color={colors.muted} size={21} />
      <TextInput accessibilityLabel="Buscar temas e instrumentos" value={query} onChangeText={setQuery} placeholder="Busca un tema, concepto o instrumento" placeholderTextColor={colors.muted} style={s.searchInput} returnKeyType="search" />
      {!!query && <IconButton name="close-circle" label="Limpiar búsqueda" onPress={() => setQuery('')} />}
    </View>
    <AreaFilter value={area} onChange={id => { setArea(id); setCategory('Todos'); }} />
    {!query && <View style={[s.hero, { backgroundColor: palette?.soft ?? '#EDEEE7' }]}>
      <View style={[styles.row, { alignItems: 'flex-start' }]}>
        <View style={{ flex: 1, gap: 7 }}>
          <Txt kind="caption" style={{ color: palette?.color ?? colors.green }}>{palette ? palette.name.toUpperCase() : 'APRENDE CON CONEXIONES'}</Txt>
          <Txt kind="heading">{area === 'medicine' ? 'Del instrumental a sus fundamentos' : area === 'science' ? 'Entiende cómo funciona el mundo' : area === 'other' ? 'Ideas que amplían tu mirada' : 'Tu biblioteca no tiene fronteras'}</Txt>
          <Txt kind="caption">{area === 'all' ? `${lessons.length} lecciones y ${instruments.length} fichas visuales. Combina áreas en tus propios temas.` : `${foundLessons.length} lecciones con explicaciones, fuentes y preguntas para empezar.`}</Txt>
        </View>
        <Icon name={palette?.icon ?? 'library-outline'} size={36} color={palette?.color ?? colors.green} />
      </View>
    </View>}
    {empty ? <EmptyState title="Probemos con otro término" text="Busca en las áreas disponibles. Por ejemplo: esterilización, átomos o lectura. El catálogo seguirá creciendo." icon="search-outline" action="Ver todo el catálogo" onAction={() => { setQuery(''); setArea('all'); setCategory('Todos'); }} /> : <>
      {displayed.length > 0 && <>
        <Section title={query ? 'Lecciones encontradas' : area === 'all' ? '¿Qué te gustaría aprender?' : `Explora ${palette?.name.toLowerCase()}`} subtitle={`${displayed.length} lecciones disponibles · Lecturas breves, ideas claras`} />
        <View style={{ gap: 12 }}>{displayed.map(lesson => <LessonCard key={lesson.id} lesson={lesson} />)}</View>
      </>}
      {(area === 'all' || area === 'medicine') && <>
        <Section title="Instrumental en imágenes" subtitle={`${foundInstruments.length} fichas visuales · Medicina`} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} style={{ flexGrow: 0 }}>{categories.map(item => <Pill key={item} title={item} selected={category === item} onPress={() => setCategory(item)} />)}</ScrollView>
        {foundInstruments.length ? <View style={s.grid}>{foundInstruments.map(item => <View key={item.id} style={s.gridCell}><InstrumentCard item={item} /></View>)}</View> : <Txt kind="caption">No hay fotografías que coincidan con estos filtros.</Txt>}
      </>}
    </>}
    <View style={[styles.card, { backgroundColor: colors.peach, borderWidth: 0 }]}>
      <View style={styles.row}><Icon name="albums-outline" color={colors.orange} /><Txt kind="heading">Conecta lo que aprendes</Txt></View>
      <Txt>Crea un tema con lecciones de distintas áreas, imágenes y tus propias notas.</Txt>
      <Button title="Ir a mi biblioteca" secondary onPress={() => router.push('/library')} />
    </View>
    <Pressable accessibilityRole="button" onPress={() => router.push('/practice')} style={{ padding: 10, alignItems: 'center' }}><Txt kind="label" style={{ color: colors.green }}>¿Listo para recordar? Ir a practicar →</Txt></Pressable>
  </Screen>;
}
const s = StyleSheet.create({
  logo: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  wordmark: { fontSize: 24, fontFamily: fonts.bold, letterSpacing: -1 },
  eyebrow: { fontSize: 10, letterSpacing: 1.2, color: colors.green, fontFamily: fonts.bold },
  hero: { padding: 20, borderRadius: 22 },
  search: { backgroundColor: colors.paper, borderRadius: 16, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 54 },
  searchInput: { flex: 1, minWidth: 0, fontFamily: fonts.regular, fontSize: 13, color: colors.ink, paddingVertical: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridCell: { width: '48%', flexGrow: 1, minWidth: 130, maxWidth: '50%' },
});
