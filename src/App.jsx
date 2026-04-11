import { useState } from 'react';
import { useCharacterStore } from './hooks/useCharacterStore';
import Header from './components/Header';
import EmptyState from './components/EmptyState';
import StatsPanel from './components/StatsPanel';
import ListCard from './components/ListCard';
import CodewordsPanel from './components/CodewordsPanel';
import JourneyLog from './components/JourneyLog';
import DangerZone from './components/DangerZone';
import './App.css';

function App() {
  const {
    characters,
    activeCharacter,
    activeCharacterId,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    setActiveCharacter,
    addToList,
    removeFromList,
    updateInList,
    toggleInList,
    exportData,
    importData,
  } = useCharacterStore();

  const [headerFormOpen, setHeaderFormOpen] = useState(false);

  function handleEmptyCreate() {
    // Trigger the new character form in the header
    setHeaderFormOpen(true);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="app" id="app">
      <Header
        characters={characters}
        activeCharacterId={activeCharacterId}
        onSelect={setActiveCharacter}
        onAdd={addCharacter}
        onExport={exportData}
        onImport={importData}
        showNewForm={headerFormOpen}
        setShowNewForm={setHeaderFormOpen}
      />

      <main className="main-content">
        {!activeCharacter ? (
          <EmptyState onCreateClick={handleEmptyCreate} />
        ) : (
          <div className="tracker-layout animate-fade-in" key={activeCharacter.id}>
            {/* Left column: Stats */}
            <div className="tracker-column tracker-column-main">
              <StatsPanel character={activeCharacter} onUpdate={updateCharacter} />


              <JourneyLog
                character={activeCharacter}
                onUpdate={updateCharacter}
                onAddEntry={addToList}
                onRemoveEntry={removeFromList}
              />
            </div>

            {/* Right column: Lists */}
            <div className="tracker-column tracker-column-side">
              <ListCard
                id="possessions-card"
                title="Possessions"
                icon="🎒"
                items={activeCharacter.possessions}
                maxItems={12}
                onAdd={(item) => addToList(activeCharacter.id, 'possessions', item)}
                onRemove={(index) => removeFromList(activeCharacter.id, 'possessions', index)}
                onEdit={(index, newValue) => updateInList(activeCharacter.id, 'possessions', index, newValue)}
                placeholder="Add item…"
              />

              <CodewordsPanel
                character={activeCharacter}
                onToggle={toggleInList}
              />

              <ListCard
                id="blessings-card"
                title="Blessings"
                icon="🙏"
                items={activeCharacter.blessings}
                onAdd={(item) => addToList(activeCharacter.id, 'blessings', item)}
                onRemove={(index) => removeFromList(activeCharacter.id, 'blessings', index)}
                onEdit={(index, newValue) => updateInList(activeCharacter.id, 'blessings', index, newValue)}
                placeholder="Add blessing…"
              />

              <ListCard
                id="titles-card"
                title="Titles & Honours"
                icon="👑"
                items={activeCharacter.titles}
                onAdd={(item) => addToList(activeCharacter.id, 'titles', item)}
                onRemove={(index) => removeFromList(activeCharacter.id, 'titles', index)}
                onEdit={(index, newValue) => updateInList(activeCharacter.id, 'titles', index, newValue)}
                placeholder="Add title…"
              />

              <DangerZone character={activeCharacter} onDelete={deleteCharacter} />
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer" id="app-footer">
        <p>Fabled Lands Tracker — Data stored locally on your device</p>
        <p className="attribution" style={{
          fontSize: '0.75rem',
          opacity: 0.7,
          maxWidth: '600px',
          margin: '0 auto 12px auto',
          lineHeight: '1.4'
        }}>
          The <strong>Fabled Lands</strong> gamebook series was created by Dave Morris and Jamie Thomson. All rights to the Fabled Lands universe belong to their respective creators and publishers. This page is an independent, fan-made tool.
        </p>
      </footer>
    </div>
  );
}

export default App;
