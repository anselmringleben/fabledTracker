import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'fabled-lands-tracker';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      // Migrate older characters that may be missing newer fields
      if (data.characters) {
        data.characters = data.characters.map(c => ({
          ...c,
          possessions: c.possessions || [],
          codewords: c.codewords || [],
          blessings: c.blessings || [],
          titles: c.titles || [],
          journeyLog: c.journeyLog || [],
        }));
      }
      return data;
    }
  } catch (e) {
    console.warn('Failed to load saved data:', e);
  }
  return { characters: [], activeCharacterId: null };
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save data:', e);
  }
}

/**
 * Custom hook that manages all character data with localStorage persistence.
 */
export function useCharacterStore() {
  const [state, setState] = useState(loadFromStorage);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const characters = state.characters;
  const activeCharacterId = state.activeCharacterId;
  const activeCharacter = characters.find(c => c.id === activeCharacterId) || null;

  const addCharacter = useCallback((character) => {
    setState(prev => ({
      characters: [...prev.characters, character],
      activeCharacterId: character.id,
    }));
  }, []);

  const updateCharacter = useCallback((id, updates) => {
    setState(prev => ({
      ...prev,
      characters: prev.characters.map(c =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
      ),
    }));
  }, []);

  const deleteCharacter = useCallback((id) => {
    setState(prev => {
      const remaining = prev.characters.filter(c => c.id !== id);
      return {
        characters: remaining,
        activeCharacterId: prev.activeCharacterId === id
          ? (remaining.length > 0 ? remaining[0].id : null)
          : prev.activeCharacterId,
      };
    });
  }, []);

  const setActiveCharacter = useCallback((id) => {
    setState(prev => ({ ...prev, activeCharacterId: id }));
  }, []);

  // List-field helpers (possessions, codewords, blessings, titles)
  const addToList = useCallback((charId, field, item) => {
    setState(prev => ({
      ...prev,
      characters: prev.characters.map(c =>
        c.id === charId
          ? { ...c, [field]: [...(c[field] || []), item], updatedAt: new Date().toISOString() }
          : c
      ),
    }));
  }, []);

  const removeFromList = useCallback((charId, field, index) => {
    setState(prev => ({
      ...prev,
      characters: prev.characters.map(c =>
        c.id === charId
          ? { ...c, [field]: (c[field] || []).filter((_, i) => i !== index), updatedAt: new Date().toISOString() }
          : c
      ),
    }));
  }, []);

  const updateInList = useCallback((charId, field, index, newValue) => {
    setState(prev => ({
      ...prev,
      characters: prev.characters.map(c => {
        if (c.id !== charId) return c;
        const list = [...(c[field] || [])];
        list[index] = newValue;
        return { ...c, [field]: list, updatedAt: new Date().toISOString() };
      }),
    }));
  }, []);

  const toggleInList = useCallback((charId, field, item) => {
    setState(prev => ({
      ...prev,
      characters: prev.characters.map(c => {
        if (c.id !== charId) return c;
        const list = c[field] || [];
        const exists = list.includes(item);
        return {
          ...c,
          [field]: exists ? list.filter(x => x !== item) : [...list, item],
          updatedAt: new Date().toISOString()
        };
      }),
    }));
  }, []);

  const exportData = useCallback(() => {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fabled-lands-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const importData = useCallback((jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.characters && Array.isArray(data.characters)) {
        setState(data);
        return true;
      }
    } catch (e) {
      console.warn('Invalid import data:', e);
    }
    return false;
  }, []);

  return {
    characters,
    activeCharacter,
    activeCharacterId,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    setActiveCharacter,
    addToList,
    removeFromList,
    updateInList,
    toggleInList,
    exportData,
    importData,
  };
}
