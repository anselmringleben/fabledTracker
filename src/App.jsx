import { useState } from 'react';
import { useCharacterStore } from './hooks/useCharacterStore';
import Header from './components/Header';
import EmptyState from './components/EmptyState';
import StatsPanel from './components/StatsPanel';
import ListCard from './components/ListCard';
import CodewordsPanel from './components/CodewordsPanel';
import QuestsPanel from './components/QuestsPanel';
import JourneyLog from './components/JourneyLog';
import DangerZone from './components/DangerZone';
import ShipsManifest from './components/ShipsManifest';
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

  const handleCodewordToggle = (charId, field, word) => {
    toggleInList(charId, field, word);
    
    const exists = activeCharacter[field]?.includes(word);
    const action = exists ? "lost" : "gained";
    
    addToList(charId, 'journeyLog', {
      type: `codeword_${action}`,
      book: activeCharacter.currentBook || 1,
      section: activeCharacter.currentSection || 1,
      note: `Codeword ${action}: ${word}`,
      timestamp: new Date().toISOString()
    });
  };

  const handleQuestRemove = (charId, field, index) => {
    const quest = activeCharacter.quests[index];
    if (!quest) return;
    
    removeFromList(charId, field, index);
    
    // Cleanup any timeline entries associated with this quest (start/completion)
    const updatedLog = (activeCharacter.journeyLog || []).filter(entry => {
      // Precise check using quest ID
      if (entry.questId && entry.questId === quest.id) return false;
      // Fallback check using text matching
      if (!entry.questId && (entry.type === 'quest_start' || entry.type === 'quest_complete') && entry.note.includes(quest.text)) return false;
      
      return true;
    });

    if (updatedLog.length !== (activeCharacter.journeyLog || []).length) {
      updateCharacter(charId, { journeyLog: updatedLog });
    }
  };

  const handlePossessionAdd = (item) => {
    addToList(activeCharacter.id, 'possessions', item);
    addToList(activeCharacter.id, 'journeyLog', {
      type: 'possession_gained',
      book: activeCharacter.currentBook || 1,
      section: activeCharacter.currentSection || 1,
      note: `Gained item: ${item}`,
      timestamp: new Date().toISOString()
    });
  };

  const handlePossessionRemove = (index) => {
    const item = activeCharacter.possessions[index];
    if (!item) return;
    removeFromList(activeCharacter.id, 'possessions', index);
    addToList(activeCharacter.id, 'journeyLog', {
      type: 'possession_lost',
      book: activeCharacter.currentBook || 1,
      section: activeCharacter.currentSection || 1,
      note: `Lost item: ${item}`,
      timestamp: new Date().toISOString()
    });
  };

  const handleBlessingAdd = (item) => {
    addToList(activeCharacter.id, 'blessings', item);
    addToList(activeCharacter.id, 'journeyLog', {
      type: 'blessing_gained',
      book: activeCharacter.currentBook || 1,
      section: activeCharacter.currentSection || 1,
      note: `Received blessing: ${item}`,
      timestamp: new Date().toISOString()
    });
  };

  const handleBlessingRemove = (index) => {
    const item = activeCharacter.blessings[index];
    if (!item) return;
    removeFromList(activeCharacter.id, 'blessings', index);
    addToList(activeCharacter.id, 'journeyLog', {
      type: 'blessing_lost',
      book: activeCharacter.currentBook || 1,
      section: activeCharacter.currentSection || 1,
      note: `Lost blessing: ${item}`,
      timestamp: new Date().toISOString()
    });
  };

  const handleTitleAdd = (item) => {
    addToList(activeCharacter.id, 'titles', item);
    addToList(activeCharacter.id, 'journeyLog', {
      type: 'title_gained',
      book: activeCharacter.currentBook || 1,
      section: activeCharacter.currentSection || 1,
      note: `Gained title: ${item}`,
      timestamp: new Date().toISOString()
    });
  };

  const handleTitleRemove = (index) => {
    const item = activeCharacter.titles[index];
    if (!item) return;
    removeFromList(activeCharacter.id, 'titles', index);
    addToList(activeCharacter.id, 'journeyLog', {
      type: 'title_lost',
      book: activeCharacter.currentBook || 1,
      section: activeCharacter.currentSection || 1,
      note: `Lost title: ${item}`,
      timestamp: new Date().toISOString()
    });
  };

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
              <StatsPanel 
                character={activeCharacter} 
                onUpdate={updateCharacter} 
                onAddTimelineEntry={addToList}
              />


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
                topContent={
                  <div className="shards-row">
                    <span className="shards-label">💰 Shards</span>
                    <div className="ability-controls" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                      <button
                        className="btn btn-icon btn-secondary"
                        onClick={() => updateCharacter(activeCharacter.id, { shards: Math.max(0, activeCharacter.shards - 1) })}
                        aria-label="Decrease shards"
                      >−</button>
                      <input
                        id="stat-shards"
                        type="number"
                        min="0"
                        className="shards-input"
                        value={activeCharacter.shards}
                        onChange={(e) => {
                          const num = parseInt(e.target.value, 10);
                          if (!isNaN(num)) {
                            updateCharacter(activeCharacter.id, { shards: num });
                          }
                        }}
                      />
                      <button
                        className="btn btn-icon btn-secondary"
                        onClick={() => updateCharacter(activeCharacter.id, { shards: activeCharacter.shards + 1 })}
                        aria-label="Increase shards"
                      >+</button>
                    </div>
                  </div>
                }
                icon="🎒"
                items={activeCharacter.possessions}
                maxItems={12}
                onAdd={handlePossessionAdd}
                onRemove={handlePossessionRemove}
                onEdit={(index, newValue) => updateInList(activeCharacter.id, 'possessions', index, newValue)}
                placeholder="Add item…"
              />

              <CodewordsPanel
                character={activeCharacter}
                onToggle={handleCodewordToggle}
              />

              <QuestsPanel
                character={activeCharacter}
                onAddToList={addToList}
                onUpdateInList={updateInList}
                onRemoveFromList={handleQuestRemove}
                onAddTimelineEntry={addToList}
              />

              <ListCard
                id="blessings-card"
                title="Blessings"
                icon="✨"
                items={activeCharacter.blessings}
                onAdd={handleBlessingAdd}
                onRemove={handleBlessingRemove}
                onEdit={(index, newValue) => updateInList(activeCharacter.id, 'blessings', index, newValue)}
                placeholder="Add blessing…"
              />

              <ShipsManifest
                character={activeCharacter}
                onAddToList={addToList}
                onUpdateInList={updateInList}
                onRemoveFromList={removeFromList}
                onAddTimelineEntry={addToList}
              />

              <ListCard
                id="titles-card"
                title="Titles & Honours"
                icon="👑"
                items={activeCharacter.titles}
                onAdd={handleTitleAdd}
                onRemove={handleTitleRemove}
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
