import { useState } from 'react';
import { BOOKS } from '../data/gameData';
import './JourneyLog.css';

export default function JourneyLog({ character, onUpdate, onAddEntry, onRemoveEntry }) {
  const [manualBook, setManualBook] = useState(character.currentBook);
  const [manualSection, setManualSection] = useState('');
  const [note, setNote] = useState('');

  function handleLogCurrent() {
    const entry = {
      book: character.currentBook,
      section: character.currentSection,
      note: '',
      timestamp: new Date().toISOString(),
    };
    onAddEntry(character.id, 'journeyLog', entry);
  }

  function handleLogManual(e) {
    e.preventDefault();
    const section = parseInt(manualSection, 10);
    if (isNaN(section) || section < 1) return;
    const entry = {
      book: manualBook,
      section,
      note: note.trim(),
      timestamp: new Date().toISOString(),
    };
    onAddEntry(character.id, 'journeyLog', entry);
    setManualSection('');
    setNote('');
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
    <div className="journey-log card" id="journey-log">
      <div className="card-header">
        <span className="icon">🧭</span>
        <h2>Journey Log</h2>
        <span className="list-count">{log.length} entries</span>
      </div>

      {/* Quick log button */}
      <div className="journey-quick-log">
        <button
          className="btn btn-primary"
          onClick={handleLogCurrent}
          id="btn-log-current"
        >
          📍 Log Current Section
        </button>
        <span className="journey-quick-hint">
          Book {character.currentBook}, §{character.currentSection}
        </span>
      </div>

      {/* Manual entry form */}
      <form className="journey-manual-form" onSubmit={handleLogManual}>
        <select
          value={manualBook}
          onChange={(e) => setManualBook(parseInt(e.target.value, 10))}
          className="journey-book-select"
        >
          {BOOKS.map(b => (
            <option key={b.number} value={b.number}>
              {b.number}. {b.title}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="1"
          placeholder="§"
          value={manualSection}
          onChange={(e) => setManualSection(e.target.value)}
          className="journey-section-input"
        />
        <input
          type="text"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="journey-note-input"
        />
        <button
          className="btn btn-secondary btn-sm"
          type="submit"
          disabled={!manualSection}
        >
          Add
        </button>
      </form>

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
                    <span className="journey-entry-dot" />
                    {idx < log.length - 1 && <span className="journey-entry-line" />}
                  </div>
                  <div className="journey-entry-content">
                    <div className="journey-entry-header">
                      <span className="journey-entry-location">
                        <strong>Book {entry.book}</strong> §{entry.section}
                      </span>
                      <span className="journey-entry-time">{timeStr}</span>
                    </div>
                    {entry.note && (
                      <p className="journey-entry-note">{entry.note}</p>
                    )}
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
  );
}
