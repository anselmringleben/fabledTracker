import { useState } from 'react';
import { ABILITIES, PROFESSIONS, RANK_TITLES } from '../data/gameData';
import './StatsPanel.css';

export default function StatsPanel({ id, character, onUpdate, onAddTimelineEntry }) {
  const [diceResult, setDiceResult] = useState(null);
  const [isRolling, setIsRolling] = useState(false);

  function triggerRollAnimation() {
    setIsRolling(true);
    setTimeout(() => setIsRolling(false), 600);
  }

  function handleDiceRoll() {
    triggerRollAnimation();
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const total = d1 + d2;
    setDiceResult({ d1, d2, total });

    if (onAddTimelineEntry) {
      onAddTimelineEntry(character.id, 'journeyLog', {
        type: 'dice_roll',
        book: character.currentBook || 1,
        section: character.currentSection || 1,
        note: `Rolled dice: ${d1} + ${d2} = ${total}`,
        timestamp: new Date().toISOString()
      });
    }
  }

  function handleAbilityRoll(abilityKey, abilityLabel) {
    triggerRollAnimation();
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const roll = d1 + d2;
    const score = character[abilityKey] || 0;
    const total = roll + score;

    setDiceResult({ d1, d2, total, score, label: abilityLabel });

    if (onAddTimelineEntry) {
      onAddTimelineEntry(character.id, 'journeyLog', {
        type: 'ability_test',
        book: character.currentBook || 1,
        section: character.currentSection || 1,
        note: `${abilityLabel} Test: ${total} (Roll: ${d1}+${d2} Score: ${score})`,
        timestamp: new Date().toISOString()
      });
    }
  }

  function handleIncreaseRank() {
    const newRank = character.rank + 1;
    onUpdate(character.id, { rank: newRank });
    if (onAddTimelineEntry) {
      onAddTimelineEntry(character.id, 'journeyLog', {
        type: 'rank_up',
        book: character.currentBook || 1,
        section: character.currentSection || 1,
        note: `Reached Rank ${newRank}`,
        timestamp: new Date().toISOString()
      });
    }
  }
  function handleChange(field, value) {
    onUpdate(character.id, { [field]: value });
  }

  function handleNumberChange(field, value) {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      onUpdate(character.id, { [field]: num });
      if (field === 'rank' && onAddTimelineEntry) {
        onAddTimelineEntry(character.id, 'journeyLog', {
          type: 'rank_up',
          book: character.currentBook || 1,
          section: character.currentSection || 1,
          note: `Rank adjusted to ${num}: ${RANK_TITLES[num] || 'Hero / Heroine'}`,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  const staminaPercent = character.staminaMax > 0
    ? Math.round((character.staminaCurrent / character.staminaMax) * 100)
    : 0;

  const staminaColor = staminaPercent > 60 ? 'var(--color-success)' :
    staminaPercent > 30 ? 'var(--color-gold)' :
      'var(--color-danger)';

  return (
    <div className="stats-panel card section-anchor" id={id || "stats-panel"}>
      <div className="card-header">
        <span className="icon">👤</span>
        <h2>Stats & Rank</h2>
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
            disabled
            style={{ cursor: 'not-allowed', opacity: 0.7 }}
          >
            {PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="stat-field stat-field-wide">
          <label htmlFor="stat-rank">Rank</label>
          <div className="rank-selector-wrapper" style={{
            position: 'relative',
            background: 'var(--color-bg-input)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-sm) var(--space-md)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            minHeight: '42px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            border: '1px solid var(--color-border-subtle)'
          }}>
            {/* The actual dropdown hidden but clickable over everything */}
            <select
              id="stat-rank"
              value={character.rank}
              onChange={(e) => handleNumberChange('rank', e.target.value)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer',
                zIndex: 2,
                outline: 'none'
              }}
            >
              {Object.entries(RANK_TITLES).map(([num, title]) => (
                <option key={num} value={num}>
                  Rank {num}: {title}
                </option>
              ))}
            </select>

            {/* The visible display that mirrors the original look */}
            <div className="rank-display-visual" style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'baseline',
              gap: 'var(--space-sm)',
              pointerEvents: 'none'
            }}>
              <span style={{
                fontWeight: '800',
                fontSize: '1.25rem',
                color: 'var(--color-accent-light)',
                lineHeight: '1'
              }}>
                {character.rank}
              </span>
              <span style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                fontWeight: '600'
              }}>
                {RANK_TITLES[character.rank] || 'Hero / Heroine'}
              </span>
            </div>

            <span style={{
              position: 'absolute',
              right: 'var(--space-md)',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              opacity: 0.3,
              fontSize: '0.8rem'
            }}>▼</span>
          </div>
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
          <div
            key={key}
            className="ability-card hover-roll"
            onClick={() => handleAbilityRoll(key, label)}
            style={{ cursor: 'pointer' }}
            title={`Roll ${label} Test`}
          >
            <span className="ability-icon">{icon}</span>
            <span className="ability-label">{label}</span>
            <div className="ability-controls" onClick={e => e.stopPropagation()}>
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
        {/* Defence styled identically to Abilities */}
        <div
          className="ability-card hover-roll"
          onClick={() => handleAbilityRoll('defence', 'Defence')}
          style={{ cursor: 'pointer' }}
          title="Roll Defence Test"
        >
          <span className="ability-icon">🛡️</span>
          <span className="ability-label">Defence</span>
          <div className="ability-controls" onClick={e => e.stopPropagation()}>
            <button
              className="btn btn-icon btn-secondary"
              onClick={() => handleNumberChange('defence', character.defence - 1)}
              aria-label="Decrease Defence"
            >−</button>
            <span className="ability-value">{character.defence}</span>
            <button
              className="btn btn-icon btn-secondary"
              onClick={() => handleNumberChange('defence', character.defence + 1)}
              aria-label="Increase Defence"
            >+</button>
          </div>
        </div>
      </div>

      <div className="dice-roller" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-md)',
        marginTop: 'var(--space-lg)',
        paddingTop: 'var(--space-md)',
        borderTop: '1px solid var(--color-border-subtle)'
      }}>
        <button
          className={`btn btn-primary ${isRolling ? 'animate-roll' : ''}`}
          onClick={handleDiceRoll}
        >
          <span style={{ fontSize: '1.2rem', marginRight: '4px' }}>🎲</span> Roll 2d6
        </button>
        {diceResult && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-gold-light)' }}>
              {diceResult.total}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              {diceResult.label ? `(${diceResult.d1} + ${diceResult.d2} + ${diceResult.score})` : `(${diceResult.d1} + ${diceResult.d2})`}
            </span>
            {diceResult.label && (
              <span style={{ fontSize: '0.8rem', color: 'var(--color-accent-light)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {diceResult.label}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
