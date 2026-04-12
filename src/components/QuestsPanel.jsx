import { useState } from 'react';
import './QuestsPanel.css';

export default function QuestsPanel({ id, character, onAddToList, onUpdateInList, onRemoveFromList, onAddTimelineEntry }) {
  const [questText, setQuestText] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState('');

  const quests = character.quests || [];

  function handleAdd(e) {
    e.preventDefault();
    if (!questText.trim()) return;

    const newQuest = {
      id: Date.now(),
      text: questText.trim(),
      book: character.currentBook,
      section: character.currentSection,
      completed: false,
    };

    onAddToList(character.id, 'quests', newQuest);

    onAddTimelineEntry(character.id, 'journeyLog', {
      type: 'quest_start',
      questId: newQuest.id,
      book: character.currentBook,
      section: character.currentSection,
      note: `Quest started: ${newQuest.text}`,
      timestamp: new Date().toISOString(),
    });

    setQuestText('');
  }

  function handleComplete(index) {
    const quest = quests[index];
    if (quest.completed) return; // already completed

    onUpdateInList(character.id, 'quests', index, { ...quest, completed: true });

    onAddTimelineEntry(character.id, 'journeyLog', {
      type: 'quest_complete',
      questId: quest.id,
      book: character.currentBook,
      section: character.currentSection,
      note: `Quest completed: ${quest.text}`,
      timestamp: new Date().toISOString(),
    });
  }

  function saveEdit(index) {
    if (editValue.trim() !== '') {
      onUpdateInList(character.id, 'quests', index, { ...quests[index], text: editValue.trim() });
    }
    setEditingIndex(null);
  }

  return (
    <div className="quests-panel card section-anchor" id={id || "quests-card"}>
      <div className="card-header">
        <span className="icon">🗺️</span>
        <h2>Quests & Tasks</h2>
        <span className="list-count">{quests.filter(q => !q.completed).length} active</span>
      </div>

      <div className="quest-add-section">
        <div className="quest-origin">
          <span className="quest-origin-label">Current Location:</span>
          <strong>Book {character.currentBook}</strong> §{character.currentSection}
        </div>
        <form className="list-add-form" onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={questText}
            onChange={(e) => setQuestText(e.target.value)}
          />
          <button
            className="btn btn-primary btn-sm"
            type="submit"
            disabled={!questText.trim()}
          >
            Add
          </button>
        </form>
      </div>

      {quests.length === 0 ? (
        <p className="list-empty">No quests currently active</p>
      ) : (
        <ul className="quests-list list-items">
          {quests.map((quest, index) => (
            <li key={quest.id || index} className={`list-item quest-item animate-slide-in ${quest.completed ? 'quest-completed' : ''}`}>
              <div className="quest-content">
                <div className="quest-text-section">
                  {editingIndex === index ? (
                    <form 
                      onSubmit={(e) => { e.preventDefault(); saveEdit(index); }}
                      style={{ flex: 1, display: 'flex' }}
                    >
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                        onBlur={() => saveEdit(index)}
                        className="quest-edit-input"
                      />
                    </form>
                  ) : (
                    <span 
                      className="quest-text"
                      onClick={() => {
                        if (!quest.completed) {
                          setEditingIndex(index);
                          setEditValue(quest.text);
                        }
                      }}
                      title={!quest.completed ? "Click to edit" : undefined}
                      style={{ cursor: quest.completed ? 'default' : 'pointer' }}
                    >
                      {quest.text}
                    </span>
                  )}
                  <span className="quest-origin-meta">
                    (Origin: Book {quest.book} §{quest.section})
                  </span>
                </div>
              </div>
              <div className="quest-actions">
                {!quest.completed && (
                  <button
                    className="btn btn-icon btn-success btn-sm"
                    onClick={() => handleComplete(index)}
                    title="Mark as completed"
                  >
                    ✓
                  </button>
                )}
                <button
                  className="btn btn-icon btn-danger btn-sm"
                  onClick={() => onRemoveFromList(character.id, 'quests', index)}
                  title="Remove quest"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
