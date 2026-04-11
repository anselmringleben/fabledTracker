import { ABILITIES, PROFESSIONS } from '../data/gameData';
import './StatsPanel.css';

export default function StatsPanel({ character, onUpdate }) {
  function handleChange(field, value) {
    onUpdate(character.id, { [field]: value });
  }

  function handleNumberChange(field, value) {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      onUpdate(character.id, { [field]: num });
    }
  }

  const staminaPercent = character.staminaMax > 0
    ? Math.round((character.staminaCurrent / character.staminaMax) * 100)
    : 0;

  const staminaColor = staminaPercent > 60 ? 'var(--color-success)' :
                       staminaPercent > 30 ? 'var(--color-gold)' :
                       'var(--color-danger)';

  return (
    <div className="stats-panel card" id="stats-panel">
      <div className="card-header">
        <span className="icon">📋</span>
        <h2>Character Sheet</h2>
      </div>

      {/* Identity */}
      <div className="stat-group identity-group">
        <div className="stat-field stat-field-wide">
          <label htmlFor="stat-name">Name</label>
          <input
            id="stat-name"
            type="text"
            value={character.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>
        <div className="stat-field">
          <label htmlFor="stat-profession">Profession</label>
          <select
            id="stat-profession"
            value={character.profession}
            onChange={(e) => handleChange('profession', e.target.value)}
          >
            {PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="stat-field stat-field-narrow">
          <label htmlFor="stat-rank">Rank</label>
          <input
            id="stat-rank"
            type="number"
            min="1"
            max="20"
            value={character.rank}
            onChange={(e) => handleNumberChange('rank', e.target.value)}
          />
        </div>
        <div className="stat-field stat-field-narrow">
          <label htmlFor="stat-defence">Defence</label>
          <input
            id="stat-defence"
            type="number"
            min="0"
            value={character.defence}
            onChange={(e) => handleNumberChange('defence', e.target.value)}
          />
        </div>
      </div>

      {/* Stamina bar */}
      <div className="stamina-section">
        <div className="stamina-header">
          <span className="stamina-label">❤️ Stamina</span>
          <span className="stamina-values">
            <input
              id="stat-stamina-current"
              type="number"
              min="0"
              className="stamina-input"
              value={character.staminaCurrent}
              onChange={(e) => handleNumberChange('staminaCurrent', e.target.value)}
            />
            <span className="stamina-sep">/</span>
            <input
              id="stat-stamina-max"
              type="number"
              min="1"
              className="stamina-input"
              value={character.staminaMax}
              onChange={(e) => handleNumberChange('staminaMax', e.target.value)}
            />
          </span>
        </div>
        <div className="stamina-bar-track">
          <div
            className="stamina-bar-fill"
            style={{ width: `${Math.min(100, Math.max(0, staminaPercent))}%`, background: staminaColor }}
          />
        </div>
      </div>

      {/* Abilities */}
      <div className="abilities-grid">
        {ABILITIES.map(({ key, label, icon }) => (
          <div key={key} className="ability-card">
            <span className="ability-icon">{icon}</span>
            <span className="ability-label">{label}</span>
            <div className="ability-controls">
              <button
                className="btn btn-icon btn-secondary"
                onClick={() => handleNumberChange(key, character[key] - 1)}
                aria-label={`Decrease ${label}`}
              >−</button>
              <span className="ability-value">{character[key]}</span>
              <button
                className="btn btn-icon btn-secondary"
                onClick={() => handleNumberChange(key, character[key] + 1)}
                aria-label={`Increase ${label}`}
              >+</button>
            </div>
          </div>
        ))}
      </div>

      {/* Shards */}
      <div className="shards-row">
        <span className="shards-label">💰 Shards</span>
        <div className="ability-controls">
          <button
            className="btn btn-icon btn-secondary"
            onClick={() => handleNumberChange('shards', Math.max(0, character.shards - 1))}
            aria-label="Decrease shards"
          >−</button>
          <input
            id="stat-shards"
            type="number"
            min="0"
            className="shards-input"
            value={character.shards}
            onChange={(e) => handleNumberChange('shards', e.target.value)}
          />
          <button
            className="btn btn-icon btn-secondary"
            onClick={() => handleNumberChange('shards', character.shards + 1)}
            aria-label="Increase shards"
          >+</button>
        </div>
      </div>
    </div>
  );
}
