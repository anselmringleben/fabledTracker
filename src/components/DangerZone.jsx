import { useState } from 'react';
import './DangerZone.css';

export default function DangerZone({ id, character, onDelete }) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  function handleConfirm() {
    onDelete(character.id);
  }

  return (
    <div className="danger-zone card section-anchor" id={id || "danger-zone"}>
      <button 
        type="button" 
        className="card-header danger-header-btn" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="danger-header-left">
          <span className="icon">⚠️</span>
          <h2>Danger Zone</h2>
        </div>
        <span className="collapse-icon">{isExpanded ? '▼' : '▶'}</span>
      </button>

      {isExpanded && (
        <div className="danger-content animate-fade-in">
          <p>Permanently delete <strong>{character.name}</strong> and all associated data.</p>
          
          {isConfirming ? (
            <div className="danger-confirm-actions">
              <span className="danger-confirm-text">Are you sure?</span>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsConfirming(false)}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger btn-sm" onClick={handleConfirm} id="btn-confirm-delete">
                Yes, Delete
              </button>
            </div>
          ) : (
            <button type="button" className="btn btn-danger" onClick={() => setIsConfirming(true)} id="btn-delete-character">
              🗑️ Delete Character
            </button>
          )}
        </div>
      )}
    </div>
  );
}
