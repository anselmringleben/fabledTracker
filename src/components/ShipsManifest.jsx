import { useState } from 'react';
import { SHIP_TYPES, CREW_QUALITIES } from '../data/gameData';
import './ShipsManifest.css';

export default function ShipsManifest({ character, onAddToList, onUpdateInList, onRemoveFromList, onAddTimelineEntry }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Barque',
    docked: '',
    crew: 'Average',
    cargo: ''
  });

  const ships = character.ships || [];

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setFormData({
      name: '',
      type: 'Barque',
      docked: '',
      crew: 'Average',
      cargo: ''
    });
  }

  function handleAdd(e) {
    e.preventDefault();
    if (!formData.type) return;

    const newShip = {
      id: crypto.randomUUID(),
      ...formData
    };

    onAddToList(character.id, 'ships', newShip);

    onAddTimelineEntry(character.id, 'journeyLog', {
      type: 'ship_acquired',
      book: character.currentBook,
      section: character.currentSection,
      note: `Acquired ship: ${newShip.name ? newShip.name : newShip.type}`,
      timestamp: new Date().toISOString(),
    });

    setIsAdding(false);
    resetForm();
  }

  function startEdit(ship) {
    setEditingId(ship.id);
    setFormData({ ...ship });
  }

  function saveEdit(index) {
    onUpdateInList(character.id, 'ships', index, { ...formData });
    setEditingId(null);
    resetForm();
  }

  function cancelEdit() {
    setEditingId(null);
    resetForm();
  }

  function handleRemove(index, ship) {
    onRemoveFromList(character.id, 'ships', index);
    
    onAddTimelineEntry(character.id, 'journeyLog', {
      type: 'ship_lost',
      book: character.currentBook,
      section: character.currentSection,
      note: `Lost ship: ${ship.name ? ship.name : ship.type}`,
      timestamp: new Date().toISOString(),
    });
  }

  return (
    <div className="ships-manifest card" id="ships-card">
      <div className="card-header">
        <span className="icon">⛵</span>
        <h2>Ship's Manifest</h2>
        <span className="list-count">{ships.length}</span>
      </div>

      {!isAdding && !editingId && (
        <div className="ship-actions-top">
          <button 
            className="btn btn-secondary btn-sm full-width" 
            onClick={() => setIsAdding(true)}
          >
            + Add Ship
          </button>
        </div>
      )}

      {isAdding && (
        <div className="ship-add-section">
          <form className="ship-add-form" onSubmit={handleAdd}>
            <input
              type="text"
              name="name"
              placeholder="Ship Name (Optional)"
              value={formData.name}
              onChange={handleInputChange}
            />
            <select name="type" value={formData.type} onChange={handleInputChange}>
              {SHIP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input
              type="text"
              name="docked"
              placeholder="Docked at"
              value={formData.docked}
              onChange={handleInputChange}
            />
            <select name="crew" value={formData.crew} onChange={handleInputChange}>
              {CREW_QUALITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              type="text"
              name="cargo"
              placeholder="Cargo"
              value={formData.cargo}
              onChange={handleInputChange}
              className="full-width"
            />
            <div className="ship-add-form-actions">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setIsAdding(false); resetForm(); }}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm">Save</button>
            </div>
          </form>
        </div>
      )}

      {ships.length === 0 && !isAdding ? (
        <p className="list-empty">No ships owned</p>
      ) : (
        <ul className="ships-list">
          {ships.map((ship, index) => (
            <li key={ship.id || index} className="ship-item animate-slide-in" style={{ animationDelay: `${index * 30}ms` }}>
              {editingId === ship.id ? (
                <form 
                  className="ship-edit-form"
                  onSubmit={(e) => { e.preventDefault(); saveEdit(index); }}
                >
                  <input
                    type="text"
                    name="name"
                    placeholder="Ship Name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  <select name="type" value={formData.type} onChange={handleInputChange}>
                    {SHIP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <input
                    type="text"
                    name="docked"
                    placeholder="Docked at"
                    value={formData.docked}
                    onChange={handleInputChange}
                  />
                  <select name="crew" value={formData.crew} onChange={handleInputChange}>
                    {CREW_QUALITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input
                    type="text"
                    name="cargo"
                    placeholder="Cargo"
                    value={formData.cargo}
                    onChange={handleInputChange}
                    className="full-width"
                  />
                  <div className="ship-edit-actions">
                    <button type="button" className="btn btn-secondary btn-sm" onClick={cancelEdit}>Cancel</button>
                    <button type="submit" className="btn btn-success btn-sm">Save</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="ship-header">
                    <div className="ship-title-group">
                      {ship.name ? (
                        <>
                          <span className="ship-name">{ship.name}</span>
                          <span className="ship-type">{ship.type}</span>
                        </>
                      ) : (
                        <span className="ship-name">{ship.type}</span>
                      )}
                    </div>
                    <div className="ship-actions">
                      <button
                        className="btn btn-icon btn-secondary btn-sm"
                        onClick={() => startEdit(ship)}
                        title="Edit ship"
                        aria-label={`Edit ${ship.name || ship.type}`}
                      >
                        ✎
                      </button>
                      <button
                        className="btn btn-icon btn-danger btn-sm"
                        onClick={() => handleRemove(index, ship)}
                        title="Remove ship"
                        aria-label={`Remove ${ship.name || ship.type}`}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <div className="ship-details">
                    <div className="ship-detail-item">
                      <span className="ship-detail-label">Docked</span>
                      <span className="ship-detail-value">{ship.docked || '—'}</span>
                    </div>
                    <div className="ship-detail-item">
                      <span className="ship-detail-label">Crew</span>
                      <span className="ship-detail-value">{ship.crew || '—'}</span>
                    </div>
                    <div className="ship-detail-item ship-detail-full">
                      <span className="ship-detail-label">Cargo</span>
                      <span className="ship-detail-value">{ship.cargo || '—'}</span>
                    </div>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
