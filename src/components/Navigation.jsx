import './Navigation.css';

export default function Navigation() {
  const sections = [
    { id: 'stats-card', label: 'Stats & Rank', icon: '👤' },
    { id: 'possessions-card', label: 'Possessions', icon: '🎒' },
    { id: 'codewords-card', label: 'Codewords', icon: '📜' },
    { id: 'journey-card', label: 'Journey Log', icon: '🗺️' },
    { id: 'quests-card', label: 'Quests', icon: '🎯' },
    { id: 'ships-card', label: 'Ships', icon: '⛵' },
    { id: 'notes-card', label: 'Notes', icon: '✍️' },
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
