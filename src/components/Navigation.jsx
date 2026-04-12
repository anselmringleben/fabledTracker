import './Navigation.css';

export default function Navigation() {
  const sections = [
    { id: 'stats-card', label: 'Stats & Rank', icon: '👤' },
    { id: 'journey-card', label: 'Adventure Log', icon: '📖' },
    { id: 'possessions-card', label: 'Possessions', icon: '🎒' },
    { id: 'codewords-card', label: 'Codewords', icon: '🗝️' },
    { id: 'quests-card', label: 'Quests & Tasks', icon: '🗺️' },
    { id: 'blessings-card', label: 'Blessings', icon: '✨' },
    { id: 'ships-card', label: 'Ships', icon: '⛵' },
    { id: 'titles-card', label: 'Titles', icon: '👑' },
    { id: 'notes-card', label: 'Danger Zone', icon: '⚠️' },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky-nav">
      <ul className="nav-list">
        {sections.map((sec) => (
          <li key={sec.id}>
            <button 
              className="nav-item" 
              onClick={() => scrollToSection(sec.id)}
              title={sec.label}
            >
              <span className="nav-icon">{sec.icon}</span>
              <span className="nav-label">{sec.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
