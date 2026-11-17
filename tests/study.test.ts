import test from 'node:test';
import assert from 'node:assert/strict';
import { buildDeck, initialState, makeTopic, normalize, parseState, quizChoices, recordAnswer, searchInstruments, shuffle, toggleInstrument } from '../src/domain/study.ts';
import type { Instrument } from '../src/domain/models.ts';

const catalog = [
  { id: 'a', name: 'Tijeras Mayo', aliases: ['scissors'], category: 'Corte', summary: 'Diseño robusto' },
  { id: 'b', name: 'Pinza Kocher', aliases: ['Ochsner'], category: 'Hemostasia', summary: 'Dientes terminales' },
  { id: 'c', name: 'Portaagujas', aliases: ['needle holder'], category: 'Sutura', summary: 'Aguja de sutura' },
  { id: 'd', name: 'Tijeras Metzenbaum', aliases: ['Metz'], category: 'Corte', summary: 'Diseño fino' },
] as Instrument[];

test('search ignores accents, capitalization and spacing while combining filters', () => {
  assert.equal(normalize('  QUIRÚRGICA  '), 'quirurgica');
  assert.deepEqual(searchInstruments(catalog, '  TIJERAS  mayo ', 'Corte').map(x => x.id), ['a']);
  assert.deepEqual(searchInstruments(catalog, 'ochsner').map(x => x.id), ['b']);
  assert.deepEqual(searchInstruments(catalog, 'diseño', 'Corte').map(x => x.id), ['a', 'd']);
  assert.deepEqual(searchInstruments(catalog, 'mayo', 'Sutura'), []);
});
test('saving and removing a resource preserves other topics and does not mutate state', () => {
  const first = makeTopic('one', ' Examen ');
  const original = { ...initialState, topics: [first, makeTopic('two', 'Otro')] };
  const saved = toggleInstrument(original, 'one', 'a');
  assert.deepEqual(saved.topics[0].instrumentIds, ['a']);
  assert.equal(saved.topics[1], original.topics[1]);
  assert.deepEqual(first.instrumentIds, []);
  assert.deepEqual(toggleInstrument(saved, 'one', 'a').topics[0].instrumentIds, []);
  assert.throws(() => makeTopic('bad', '   '));
});
test('topic decks contain only selected existing resources plus personal cards', () => {
  const topic = { ...makeTopic('one', 'Examen'), instrumentIds: ['b', 'missing'], cards: [{ id: 'own', front: 'Pregunta', back: 'Respuesta' }] };
  assert.deepEqual(buildDeck(catalog, topic).map(x => x.id), ['b', 'own']);
  assert.equal(buildDeck(catalog).length, 4);
  assert.equal(buildDeck(catalog, makeTopic('empty', 'Vacío')).length, 0);
});
test('a later correct answer clears pending review without erasing historical attempts', () => {
  const missed = recordAnswer(initialState, 'a', false, '2026-11-17T10:00:00Z');
  const recovered = recordAnswer(missed, 'a', true, '2026-11-17T11:00:00Z');
  assert.equal(missed.reviews.a.lastCorrect, false);
  assert.deepEqual(recovered.reviews.a, { attempts: 2, correct: 1, lastCorrect: true, updatedAt: '2026-11-17T11:00:00Z' });
  assert.deepEqual(initialState.reviews, {});
});
test('quiz choices include exactly one correct answer and never repeat distractors', () => {
  for (const answer of catalog) {
    const choices = quizChoices(answer.id, catalog, () => 0.35);
    assert.equal(choices.length, 4);
    assert.equal(new Set(choices).size, 4);
    assert.equal(choices.filter(id => id === answer.id).length, 1);
  }
  assert.deepEqual(quizChoices('a', catalog.slice(0, 1)), ['a']);
  const values = [1, 2, 3];
  assert.deepEqual([...shuffle(values)].sort(), values);
  assert.deepEqual(values, [1, 2, 3]);
});
test('saved library survives a serialization round trip including notes and history', () => {
  const state = recordAnswer({ ...initialState, topics: [{ ...makeTopic('one', 'Mi tema'), notes: 'Notas con tildes: disección', cards: [{ id: 'own', front: 'Q', back: 'A' }] }], sessions: 1 }, 'a', true, '2026-11-17');
  assert.deepEqual(parseState(JSON.stringify(state)), state);
});
test('corrupt or future library data is rejected rather than overwritten', () => {
  for (const value of ['not json', '{}', 'null', JSON.stringify({ ...initialState, version: 2 }), JSON.stringify({ ...initialState, topics: [{}] }), JSON.stringify({ ...initialState, reviews: { a: { attempts: 1, correct: 2, lastCorrect: true, updatedAt: '' } } })]) {
    assert.throws(() => parseState(value));
  }
});
