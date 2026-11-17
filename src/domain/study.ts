import type { StudyState, StudyTopic, StudyCard, Instrument, Lesson, AreaId } from './models.ts';

export const initialState: StudyState = { version: 1, topics: [], reviews: {}, sessions: 0 };

export function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').trim();
}

export function searchInstruments(instruments: Instrument[], query: string, category = 'Todos') {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  return instruments.filter(item => {
    const haystack = normalize([item.name, ...item.aliases, item.category, item.summary].join(' '));
    return (category === 'Todos' || item.category === category) && terms.every(term => haystack.includes(term));
  });
}

export function makeTopic(id: string, title: string, description = ''): StudyTopic {
  const clean = title.trim();
  if (!clean) throw new Error('Escribe un nombre para el tema.');
  return { id, title: clean.slice(0, 80), description: description.trim().slice(0, 240), instrumentIds: [], notes: '', cards: [] };
}

export function toggleInstrument(state: StudyState, topicId: string, instrumentId: string): StudyState {
  return { ...state, topics: state.topics.map(topic => topic.id !== topicId ? topic : {
    ...topic,
    instrumentIds: topic.instrumentIds.includes(instrumentId)
      ? topic.instrumentIds.filter(id => id !== instrumentId)
      : [...topic.instrumentIds, instrumentId],
  }) };
}

export function recordAnswer(state: StudyState, cardId: string, correct: boolean, now: string): StudyState {
  const previous = state.reviews[cardId];
  return { ...state, reviews: { ...state.reviews, [cardId]: {
    attempts: (previous?.attempts ?? 0) + 1,
    correct: (previous?.correct ?? 0) + Number(correct),
    lastCorrect: correct,
    updatedAt: now,
  } } };
}

export function buildDeck(instruments: Instrument[], topic?: StudyTopic, lessons: Lesson[] = []): StudyCard[] {
  const selected = topic ? instruments.filter(item => topic.instrumentIds.includes(item.id)) : instruments;
  const selectedLessons = topic ? lessons.filter(item => topic.lessonIds?.includes(item.id)) : lessons;
  return [
    ...selected.map(item => ({ id: item.id, instrumentId: item.id, area: 'medicine' as const, front: '¿Qué instrumento observas?', back: `${item.name}\n${item.summary}` })),
    ...selectedLessons.flatMap(lesson => lesson.questions.map(question => ({
      id: `lesson:${lesson.id}:${question.id}`, lessonId: lesson.id, area: lesson.area,
      front: question.prompt, back: `${question.answer}\n${question.explanation}`,
      answer: question.answer, options: [question.answer, ...question.distractors],
    }))),
    ...(topic?.cards ?? []).map(card => ({ ...card })),
  ];
}

export function searchLessons(lessons: Lesson[], query: string, area: AreaId | 'all' = 'all') {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  const areaNames = { medicine: 'medicina salud instrumentacion quirurgica', science: 'ciencias', other: 'otras disciplinas' };
  return lessons.filter(lesson => {
    const text = normalize([lesson.title, lesson.subject, lesson.summary, areaNames[lesson.area], ...lesson.keywords].join(' '));
    return (area === 'all' || lesson.area === area) && terms.every(term => text.includes(term));
  });
}

export function toggleLesson(state: StudyState, topicId: string, lessonId: string): StudyState {
  return { ...state, topics: state.topics.map(topic => topic.id !== topicId ? topic : {
    ...topic, lessonIds: topic.lessonIds?.includes(lessonId)
      ? topic.lessonIds.filter(id => id !== lessonId) : [...(topic.lessonIds ?? []), lessonId],
  }) };
}

export function shuffle<T>(items: readonly T[], random = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function quizChoices(answerId: string, instruments: Instrument[], random = Math.random): string[] {
  return shuffle([answerId, ...shuffle(instruments.filter(item => item.id !== answerId), random).slice(0, 3).map(item => item.id)], random);
}

// Reject corrupt or unknown versions instead of silently overwriting user data.
export function parseState(raw: string): StudyState {
  const value = JSON.parse(raw);
  const string = (v: unknown): v is string => typeof v === 'string';
  const integer = (v: unknown) => Number.isSafeInteger(v) && (v as number) >= 0;
  if (value?.version !== 1 || !Array.isArray(value.topics) || !integer(value.sessions) ||
    !value.reviews || typeof value.reviews !== 'object' || Array.isArray(value.reviews)) throw new Error('Invalid saved library');
  for (const topic of value.topics) {
    if (!topic || !string(topic.id) || !string(topic.title) || !topic.title.trim() || !string(topic.description) ||
      !string(topic.notes) || !Array.isArray(topic.instrumentIds) || !topic.instrumentIds.every(string) ||
      (topic.lessonIds !== undefined && (!Array.isArray(topic.lessonIds) || !topic.lessonIds.every(string))) ||
      !Array.isArray(topic.cards) || !topic.cards.every((card: any) => card && string(card.id) && string(card.front) && string(card.back))) {
      throw new Error('Invalid saved topic');
    }
  }
  for (const review of Object.values(value.reviews) as any[]) {
    if (!review || !integer(review.attempts) || !integer(review.correct) || review.correct > review.attempts ||
      typeof review.lastCorrect !== 'boolean' || !string(review.updatedAt)) throw new Error('Invalid review');
  }
  return value;
}
