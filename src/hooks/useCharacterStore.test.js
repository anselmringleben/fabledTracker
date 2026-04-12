import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCharacterStore } from './useCharacterStore';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn(key => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useCharacterStore', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('should initialize with empty characters if storage is empty', () => {
    const { result } = renderHook(() => useCharacterStore());
    expect(result.current.characters).toEqual([]);
    expect(result.current.activeCharacterId).toBeNull();
  });

  it('should add a character and set it as active', () => {
    const { result } = renderHook(() => useCharacterStore());
    const newChar = { id: '1', name: 'Test Hero', possessions: [] };

    act(() => {
      result.current.addCharacter(newChar);
    });

    expect(result.current.characters).toHaveLength(1);
    expect(result.current.characters[0].name).toBe('Test Hero');
    expect(result.current.activeCharacterId).toBe('1');
    expect(result.current.activeCharacter.name).toBe('Test Hero');
  });

  it('should update a character', () => {
    const { result } = renderHook(() => useCharacterStore());
    const newChar = { id: '1', name: 'Test Hero', shards: 10 };

    act(() => {
      result.current.addCharacter(newChar);
      result.current.updateCharacter('1', { shards: 20 });
    });

    expect(result.current.characters[0].shards).toBe(20);
    expect(result.current.characters[0].updatedAt).toBeDefined();
  });

  it('should delete a character', () => {
    const { result } = renderHook(() => useCharacterStore());
    const char1 = { id: '1', name: 'Hero 1' };
    const char2 = { id: '2', name: 'Hero 2' };

    act(() => {
      result.current.addCharacter(char1);
      result.current.addCharacter(char2);
    });

    expect(result.current.characters).toHaveLength(2);

    act(() => {
      result.current.deleteCharacter('1');
    });

    expect(result.current.characters).toHaveLength(1);
    expect(result.current.characters[0].id).toBe('2');
    expect(result.current.activeCharacterId).toBe('2');
  });

  it('should manipulate list fields correctly (addToList)', () => {
    const { result } = renderHook(() => useCharacterStore());
    const char = { id: '1', name: 'Hero', possessions: ['Sword'] };

    act(() => {
      result.current.addCharacter(char);
      result.current.addToList('1', 'possessions', 'Shield');
    });

    expect(result.current.characters[0].possessions).toEqual(['Sword', 'Shield']);
  });

  it('should manipulate list fields correctly (removeFromList)', () => {
    const { result } = renderHook(() => useCharacterStore());
    const char = { id: '1', name: 'Hero', possessions: ['Sword', 'Shield'] };

    act(() => {
      result.current.addCharacter(char);
      result.current.removeFromList('1', 'possessions', 0); // Remove Sword
    });

    expect(result.current.characters[0].possessions).toEqual(['Shield']);
  });

  it('should manipulate list fields correctly (updateInList)', () => {
    const { result } = renderHook(() => useCharacterStore());
    const char = { id: '1', name: 'Hero', possessions: ['Sword'] };

    act(() => {
      result.current.addCharacter(char);
      result.current.updateInList('1', 'possessions', 0, 'Greatsword');
    });

    expect(result.current.characters[0].possessions[0]).toBe('Greatsword');
  });

  it('should manipulate list fields correctly (toggleInList)', () => {
    const { result } = renderHook(() => useCharacterStore());
    const char = { id: '1', name: 'Hero', codewords: ['Acid'] };

    act(() => {
      result.current.addCharacter(char);
      result.current.toggleInList('1', 'codewords', 'Afraid'); // Add
    });
    expect(result.current.characters[0].codewords).toContain('Afraid');

    act(() => {
      result.current.toggleInList('1', 'codewords', 'Acid'); // Remove
    });
    expect(result.current.characters[0].codewords).not.toContain('Acid');
  });

  it('should persist to localStorage', () => {
    const { result } = renderHook(() => useCharacterStore());
    act(() => {
      result.current.addCharacter({ id: '1', name: 'Hero' });
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'fabled-lands-tracker',
      expect.stringContaining('Hero')
    );
  });
});
