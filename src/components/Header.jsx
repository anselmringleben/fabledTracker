import { useState } from 'react';
import { PROFESSIONS, createCharacter, generateRandomName } from '../data/gameData';
import './Header.css';

export default function Header({ 
  characters, activeCharacterId, onSelect, onAdd, onExport, onImport,
  showNewForm, setShowNewForm 
}) {
  const [newName, setNewName] = useState('');
  const [newProfession, setNewProfession] = useState('Warrior');

  function handleCreate(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    const char = createCharacter(newName.trim(), newProfession);
    onAdd(char);
    setNewName('');
    setNewProfession('Warrior');
    setShowNewForm(false);
  }

  function handleRandomName() {
    setNewName(generateRandomName());
  }

  function handleImportClick() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => onImport(ev.target.result);
      reader.readAsText(file);
    };
    input.click();
  }

  return (
    <header className="app-header" id="app-header">
      <div className="header-top">
        <div className="header-brand">
          <span className="brand-icon">🗺️</span>
          <div>
            <h1 className="brand-title">Fabled Lands</h1>
            <p className="brand-subtitle">Character & Progress Tracker</p>
          </div>
        </div>

        <div className="header-actions">
          {characters.length > 0 && (
            <select
              id="character-select"
              className="char-select"
              value={activeCharacterId || ''}
              onChange={(e) => onSelect(e.target.value)}
            >
              {characters.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.profession} (Rank {c.rank})
                </option>
              ))}
            </select>
          )}
          <button className="btn btn-gold" id="btn-new-character" onClick={() => setShowNewForm(!showNewForm)}>
            {showNewForm ? '✕' : '＋'} {showNewForm ? 'Cancel' : 'New Character'}
          </button>
          {characters.length > 0 && (
            <button className="btn btn-secondary btn-sm" id="btn-export" onClick={onExport} title="Export backup">
              💾
            </button>
          )}
          <button className="btn btn-secondary btn-sm" id="btn-import" onClick={handleImportClick} title="Import backup">
            📂
          </button>
        </div>
      </div>

      {showNewForm && (
        <form className="new-char-form animate-fade-in" onSubmit={handleCreate} id="new-character-form">
          <div className="name-input-group">
            <input
              id="input-char-name"
              type="text"
              placeholder="Character name…"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
            />
            <button 
              type="button" 
              className="btn btn-secondary btn-icon" 
              onClick={handleRandomName}
              title="Generate random name"
              aria-label="Random name"
            >
              🎲
            </button>
          </div>
          <select
            id="select-profession"
            value={newProfession}
            onChange={(e) => setNewProfession(e.target.value)}
          >
            {PROFESSIONS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <button className="btn btn-primary" type="submit" id="btn-create-character">
            Create Character
          </button>
        </form>
      )}
    </header>
  );
}
