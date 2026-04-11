import { BOOKS } from '../data/gameData';
import './ProgressPanel.css';

export default function ProgressPanel({ character, onUpdate }) {
  function handleNumberChange(field, value) {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0) {
      onUpdate(character.id, { [field]: num });
    }
  }

  const currentBookInfo = BOOKS.find(b => b.number === character.currentBook);

  return (
    <div className="progress-panel card" id="progress-panel">
      <div className="card-header">
        <span className="icon">📖</span>
        <h2>Progress</h2>
      </div>

      <div className="progress-fields">
        <div className="progress-field">
          <label htmlFor="progress-book">Current Book</label>
          <select
            id="progress-book"
            value={character.currentBook}
            onChange={(e) => handleNumberChange('currentBook', e.target.value)}
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
          <input
            id="progress-section"
            type="number"
            min="1"
            value={character.currentSection}
            onChange={(e) => handleNumberChange('currentSection', e.target.value)}
          />
        </div>
      </div>

      {currentBookInfo && (
        <div className="current-book-display">
          <span className="book-number">{currentBookInfo.number}</span>
          <div className="book-info">
            <span className="book-title">{currentBookInfo.title}</span>
            <span className="book-section">Section {character.currentSection}</span>
          </div>
        </div>
      )}

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
          rows="4"
          placeholder="Quest notes, reminders, plans…"
          value={character.notes}
          onChange={(e) => onUpdate(character.id, { notes: e.target.value })}
        />
      </div>
    </div>
  );
}
