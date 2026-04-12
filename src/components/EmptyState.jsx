import './EmptyState.css';

export default function EmptyState({ onCreateClick }) {
  return (
    <div className="empty-state animate-fade-in" id="empty-state">
      <div className="empty-art">🏰</div>
      <h2 className="empty-title">Begin Your Adventure</h2>
      <p className="empty-description">
        Create a character to start tracking your journey through the Fabled Lands.
      </p>
      <button className="btn btn-gold" onClick={onCreateClick} id="btn-empty-create">
        ＋ Create Your First Character
      </button>
      <div className="empty-features">
        <div className="empty-feature">
          <span>⚔️</span>
          <span>Track Stats & Abilities</span>
        </div>
        <div className="empty-feature">
          <span>🎒</span>
          <span>Manage Inventory</span>
        </div>
        <div className="empty-feature">
          <span>📖</span>
          <span>Record Progress</span>
        </div>
        <div className="empty-feature">
          <span>🔑</span>
          <span>Track Codewords</span>
        </div>
      </div>
      <p className="empty-description">
        The Fabled Lands books are required to play the game!
      </p>
    </div>
  );
}
