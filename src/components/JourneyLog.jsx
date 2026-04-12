import { useState } from 'react';
import { BOOKS } from '../data/gameData';
import './JourneyLog.css';

export default function JourneyLog({ id, character, onUpdate, onAddEntry, onRemoveEntry }) {
  const [quickNote, setQuickNote] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editNote, setEditNote] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  function handleLogCurrent() {
    const entry = {
      book: character.currentBook,
      section: character.currentSection,
      note: quickNote.trim(),
      timestamp: new Date().toISOString(),
    };
    onAddEntry(character.id, 'journeyLog', entry);
    setQuickNote('');
  }

  function saveNoteUpdate(realIndex) {
    const updatedLog = [...(character.journeyLog || [])];
    updatedLog[realIndex] = { ...updatedLog[realIndex], note: editNote.trim() };
    onUpdate(character.id, { journeyLog: updatedLog });
    setEditingIndex(null);
  }

  const log = character.journeyLog || [];
  const bookMap = Object.fromEntries(BOOKS.map(b => [b.number, b.title]));

  // Group log entries by book for the summary
  const visitedByBook = {};
  log.forEach(entry => {
    if (!visitedByBook[entry.book]) visitedByBook[entry.book] = new Set();
    visitedByBook[entry.book].add(entry.section);
  });

  return (
    <div className="journey-log card section-anchor" id={id || "journey-log"}>
      <button 
        type="button"
        className="card-header-btn" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="card-header-main">
          <span className="icon">📖</span>
          <h2>Adventure Log</h2>
          <span className="list-count">{log.length} entries</span>
        </div>
        <span className="collapse-icon">{isExpanded ? '▼' : '▶'}</span>
      </button>

      {isExpanded && (
        <div className="card-content animate-fade-in">

      {/* Progress & Current Location */}
      <div className="progress-fields">
        <div className="progress-field">
          <label htmlFor="progress-book">Current Book</label>
          <select
            id="progress-book"
            value={character.currentBook}
            onChange={(e) => {
              const num = parseInt(e.target.value, 10);
              if (!isNaN(num)) onUpdate(character.id, { currentBook: num });
            }}
          >
            {BOOKS.map(b => (
              <option key={b.number} value={b.number}>
                {b.number}. {b.title}
              </option>
            ))}
          </select>
        </div>

        <div className="progress-field">
          <label htmlFor="progress-section">Current Section</label>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <input
              id="progress-section"
              type="number"
              min="1"
              value={character.currentSection === '' || character.currentSection === undefined ? '' : character.currentSection}
              style={{ width: '80px', flex: '0 0 80px', textAlign: 'center' }}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '') {
                  onUpdate(character.id, { currentSection: '' });
                } else {
                  const num = parseInt(val, 10);
                  if (!isNaN(num) && num >= 0) onUpdate(character.id, { currentSection: num });
                }
              }}
            />
            <button
              className="btn btn-primary"
              onClick={handleLogCurrent}
              id="btn-log-current"
              style={{ flex: 1 }}
              disabled={!character.currentSection}
            >
              📍 Log
            </button>
          </div>
          <input
            type="text"
            placeholder="Note for this timeline entry (optional)"
            value={quickNote}
            onChange={(e) => setQuickNote(e.target.value)}
            style={{ marginTop: '4px' }}
          />
        </div>
      </div>

      <div className="progress-fields" style={{ marginTop: 'var(--space-md)' }}>
        <div className="progress-field">
          <label htmlFor="progress-resurrection">Resurrection Arrangement</label>
          <input
            id="progress-resurrection"
            type="text"
            placeholder="e.g. Temple of Dorin, Yellowport"
            value={character.resurrection}
            onChange={(e) => onUpdate(character.id, { resurrection: e.target.value })}
          />
        </div>

        <div className="progress-field">
          <label htmlFor="progress-notes">Notes</label>
          <textarea
            id="progress-notes"
            rows="3"
            placeholder="Reminders, plans, hints…"
            value={character.notes}
            onChange={(e) => onUpdate(character.id, { notes: e.target.value })}
            style={{ resize: 'vertical', minHeight: '60px', lineHeight: '1.5' }}
          />
        </div>
      </div>

      <hr style={{ border: 0, borderTop: '1px solid var(--color-border-subtle)', margin: 'var(--space-lg) 0' }} />

      <div className="card-header" style={{ marginBottom: 'var(--space-md)' }}>
        <span className="icon">📜</span>
        <h2 style={{ fontSize: '0.9rem' }}>Timeline</h2>
      </div>

      {/* Book visit summary */}
      {Object.keys(visitedByBook).length > 0 && (
        <div className="journey-summary">
          <h3 className="journey-summary-title">Sections Visited</h3>
          <div className="journey-summary-books">
            {BOOKS.filter(b => visitedByBook[b.number]).map(b => (
              <div key={b.number} className="journey-summary-book">
                <span className="journey-summary-book-num">{b.number}</span>
                <span className="journey-summary-book-title">{b.title}</span>
                <span className="journey-summary-book-count">
                  {visitedByBook[b.number].size} sections
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chronological log */}
      {log.length === 0 ? (
        <p className="list-empty">No sections logged yet — start your journey!</p>
      ) : (
        <div className="journey-entries">
          <h3 className="journey-entries-title">Timeline</h3>
          <ol className="journey-timeline">
            {[...log].reverse().map((entry, idx) => {
              const realIndex = log.length - 1 - idx;
              const time = new Date(entry.timestamp);
              const timeStr = time.toLocaleString(undefined, {
                month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit',
              });
              return (
                <li key={realIndex} className="journey-entry animate-slide-in" style={{ animationDelay: `${idx * 20}ms` }}>
                  <div className="journey-entry-marker">
                    {entry.type === 'quest_start' ? (
                      <span className="journey-entry-icon" style={{ fontSize: '1rem', marginTop: '-4px', zIndex: 2 }}>🗺️</span>
                    ) : entry.type === 'quest_complete' ? (
                      <span className="journey-entry-icon" style={{ fontSize: '1rem', marginTop: '-4px', zIndex: 2, position: 'relative', display: 'inline-block' }}>
                        <span style={{ opacity: 0.8 }}>🗺️</span>
                        <span style={{ position: 'absolute', bottom: '-2px', right: '-4px', fontSize: '0.7rem' }}>✅</span>
                      </span>
                    ) : entry.type === 'codeword_gained' ? (
                      <span className="journey-entry-icon" style={{ fontSize: '0.9rem', marginTop: '-4px', zIndex: 2 }}>🗝️</span>
                    ) : entry.type === 'codeword_lost' ? (
                      <span className="journey-entry-icon" style={{ fontSize: '0.9rem', marginTop: '-4px', zIndex: 2, position: 'relative', display: 'inline-block' }}>
                        <span style={{ opacity: 0.6 }}>🗝️</span>
                        <span style={{ position: 'absolute', top: '50%', left: '-2px', right: '-2px', height: '2px', background: 'var(--color-danger, red)', transform: 'translateY(-50%) rotate(-45deg)' }} />
                      </span>
                    ) : entry.type === 'possession_gained' ? (
                      <span className="journey-entry-icon" style={{ fontSize: '0.9rem', marginTop: '-4px', zIndex: 2 }}>🎒</span>
                    ) : entry.type === 'possession_lost' ? (
                      <span className="journey-entry-icon" style={{ fontSize: '0.9rem', marginTop: '-4px', zIndex: 2, position: 'relative', display: 'inline-block' }}>
                        <span style={{ opacity: 0.6 }}>🎒</span>
                        <span style={{ position: 'absolute', top: '50%', left: '-2px', right: '-2px', height: '2px', background: 'var(--color-danger, red)', transform: 'translateY(-50%) rotate(-45deg)' }} />
                      </span>
                    ) : entry.type === 'blessing_gained' ? (
                      <span className="journey-entry-icon" style={{ fontSize: '1rem', marginTop: '-4px', zIndex: 2 }}>✨</span>
                    ) : entry.type === 'blessing_lost' ? (
                      <span className="journey-entry-icon" style={{ fontSize: '1rem', marginTop: '-4px', zIndex: 2, position: 'relative', display: 'inline-block' }}>
                        <span style={{ opacity: 0.6 }}>✨</span>
                        <span style={{ position: 'absolute', top: '50%', left: '-2px', right: '-2px', height: '2px', background: 'var(--color-danger, red)', transform: 'translateY(-50%) rotate(-45deg)' }} />
                      </span>
                    ) : entry.type === 'title_gained' ? (
                      <span className="journey-entry-icon" style={{ fontSize: '1rem', marginTop: '-4px', zIndex: 2 }}>👑</span>
                    ) : entry.type === 'title_lost' ? (
                      <span className="journey-entry-icon" style={{ fontSize: '1rem', marginTop: '-4px', zIndex: 2, position: 'relative', display: 'inline-block' }}>
                        <span style={{ opacity: 0.6 }}>👑</span>
                        <span style={{ position: 'absolute', top: '50%', left: '-2px', right: '-2px', height: '2px', background: 'var(--color-danger, red)', transform: 'translateY(-50%) rotate(-45deg)' }} />
                      </span>
                    ) : entry.type === 'ship_acquired' ? (
                      <span className="journey-entry-icon" style={{ fontSize: '1rem', marginTop: '-4px', zIndex: 2 }}>⛵</span>
                    ) : entry.type === 'ship_lost' ? (
                      <span className="journey-entry-icon" style={{ fontSize: '1rem', marginTop: '-4px', zIndex: 2, position: 'relative', display: 'inline-block' }}>
                        <span style={{ opacity: 0.6 }}>⛵</span>
                        <span style={{ position: 'absolute', top: '50%', left: '-2px', right: '-2px', height: '2px', background: 'var(--color-danger, red)', transform: 'translateY(-50%) rotate(-45deg)' }} />
                      </span>
                    ) : entry.type === 'rank_up' ? (
                      <span className="journey-entry-icon" style={{ fontSize: '1rem', marginTop: '-4px', zIndex: 2 }}>⭐</span>
                    ) : entry.type === 'dice_roll' || entry.type === 'ability_test' ? (
                      <span className="journey-entry-icon" style={{ fontSize: '1rem', marginTop: '-4px', zIndex: 2 }}>🎲</span>
                    ) : (
                      <span className="journey-entry-dot" />
                    )}
                    {idx < log.length - 1 && <span className="journey-entry-line" />}
                  </div>
                  <div className="journey-entry-content">
                    <div className="journey-entry-header">
                      <span className="journey-entry-location">
                        <strong>Book {entry.book}</strong> §{entry.section}
                        {editingIndex === realIndex ? (
                          <form
                            onSubmit={(e) => { e.preventDefault(); saveNoteUpdate(realIndex); }}
                            style={{ display: 'inline', marginLeft: '6px' }}
                          >
                            <input
                              type="text"
                              value={editNote}
                              onChange={(e) => setEditNote(e.target.value)}
                              autoFocus
                              onBlur={() => saveNoteUpdate(realIndex)}
                              className="journey-note-inline-edit"
                              style={{
                                padding: '2px 6px',
                                fontSize: '0.75rem',
                                width: '140px',
                                background: 'var(--color-bg-input)',
                                border: '1px solid var(--color-accent)',
                                borderRadius: 'var(--radius-sm)',
                                color: 'var(--color-text-primary)'
                              }}
                            />
                          </form>
                        ) : (
                          <span
                            className="journey-entry-note"
                            style={{ marginLeft: '6px', cursor: 'pointer' }}
                            onClick={() => {
                              setEditingIndex(realIndex);
                              setEditNote(entry.note || '');
                            }}
                            title="Click to edit note"
                          >
                            {entry.note ? `— ${entry.note}` : <span style={{ opacity: 0.4, fontStyle: 'normal' }}> ✎ Add note</span>}
                          </span>
                        )}
                      </span>
                      <span className="journey-entry-time">{timeStr}</span>
                    </div>
                    <span className="journey-entry-book-name">
                      {bookMap[entry.book] || `Book ${entry.book}`}
                    </span>
                  </div>
                  <button
                    className="btn btn-icon btn-danger btn-sm journey-entry-remove"
                    onClick={() => onRemoveEntry(character.id, 'journeyLog', realIndex)}
                    title="Remove entry"
                    aria-label="Remove log entry"
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      )}
        </div>
      )}
    </div>
  );
}
