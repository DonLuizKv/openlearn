import { useState } from 'react';
import { Button, Field, Sheet } from './ui';
import { makeTopic } from '../domain/study';
import { newId, useStudy } from '../state/StudyProvider';

export function TopicForm({ visible, onClose, onCreated }: { visible: boolean; onClose: () => void; onCreated?: (id: string) => void }) {
  const { update } = useStudy();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  function create() {
    if (!title.trim()) return;
    const topic = makeTopic(newId('topic'), title, description);
    update(state => ({ ...state, topics: [...state.topics, topic] }));
    setTitle(''); setDescription(''); onClose(); onCreated?.(topic.id);
  }
  return <Sheet visible={visible} onClose={onClose} title="Un nuevo tema, a tu manera">
    <Field label="Nombre del tema" placeholder="Ej. Instrumental para mi primer examen" value={title} onChangeText={setTitle} maxLength={80} autoFocus />
    <Field label="¿Qué quieres aprender? (opcional)" placeholder="Mi objetivo de estudio…" value={description} onChangeText={setDescription} multiline maxLength={240} />
    <Button title="Crear tema" icon="add" onPress={create} disabled={!title.trim()} />
  </Sheet>;
}
