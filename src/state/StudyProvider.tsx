import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { StudyState } from '../domain/models';
import { initialState, parseState } from '../domain/study';

const STORAGE_KEY = '@openlearn/library/v1';
type Store = {
  state: StudyState;
  update: (updater: (previous: StudyState) => StudyState) => void;
  ready: boolean;
  loadError: boolean;
  saveError: boolean;
  saving: boolean;
  retry: () => void;
};
const Context = createContext<Store | null>(null);

export function StudyProvider({ children }: React.PropsWithChildren) {
  const [state, setState] = useState<StudyState>(initialState);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [retry, setRetry] = useState(0);
  const writes = useRef(Promise.resolve());
  const revision = useRef(0);
  const persisted = useRef<StudyState | null>(null);

  useEffect(() => {
    if (ready) return;
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      const loaded = raw ? parseState(raw) : initialState;
      if (!active) return;
      persisted.current = loaded;
      setState(loaded);
      setLoadError(false);
      setReady(true);
    }).catch(() => { if (active) setLoadError(true); });
    return () => { active = false; };
  }, [ready, retry]);

  useEffect(() => {
    if (!ready || persisted.current === state) return;
    const current = ++revision.current;
    setSaving(true);
    // Serialize writes so a slower old write cannot overwrite newer notes.
    writes.current = writes.current.then(async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        persisted.current = state;
        if (revision.current === current) setSaveError(false);
      } catch {
        if (revision.current === current) setSaveError(true);
      } finally {
        if (revision.current === current) setSaving(false);
      }
    });
  }, [state, ready, retry]);

  return <Context.Provider value={{ state, update: setState, ready, loadError, saveError, saving, retry: () => setRetry(n => n + 1) }}>{children}</Context.Provider>;
}

export function useStudy() {
  const context = useContext(Context);
  if (!context) throw new Error('StudyProvider is missing');
  return context;
}

export function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
