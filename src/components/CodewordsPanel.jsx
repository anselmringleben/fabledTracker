import { useState } from 'react';
import { BOOKS, CODEWORDS_BY_BOOK } from '../data/gameData';
import './CodewordsPanel.css';

export default function CodewordsPanel({ id, character, onToggle }) {
  const [expandedBooks, setExpandedBooks] = useState({ 1: true }); // Default expand Book 1
  const characterCodewords = character.codewords || [];

  const toggleBook = (bookNumber) => {
    setExpandedBooks(prev => ({
      ...prev,
      [bookNumber]: !prev[bookNumber]
    }));
  };

  const allPredefined = Object.values(CODEWORDS_BY_BOOK).flat();
  const customCodewords = characterCodewords.filter(w => !allPredefined.includes(w));

  const booksWithWords = BOOKS.filter(b => CODEWORDS_BY_BOOK[b.number] && CODEWORDS_BY_BOOK[b.number].length > 0);

  return (
    <div className="codewords-panel card section-anchor" id={id || "codewords-card"}>
      <div className="card-header">
        <span className="icon">🗝️</span>
        <h2>Codewords</h2>
        <span className="badge">{characterCodewords.length}</span>
      </div>

      <div className="codewords-lists">
        {booksWithWords.map(book => {
          const isExpanded = expandedBooks[book.number];
          const words = CODEWORDS_BY_BOOK[book.number];
          const checkedCount = words.filter(w => characterCodewords.includes(w)).length;
          
          return (
            <div key={book.number} className="cw-book-section">
              <button 
                type="button"
                className={`cw-book-header ${isExpanded ? 'expanded' : ''}`}
                onClick={() => toggleBook(book.number)}
              >
                <div className="cw-book-title">
                  <span className="cw-book-label">Book {book.number}</span>
                  <span className="cw-book-name">{book.title}</span>
                </div>
                <div className="cw-book-meta">
                  <span className="cw-book-count">{checkedCount} / {words.length}</span>
                  <span className="collapse-icon">{isExpanded ? '▼' : '▶'}</span>
                </div>
              </button>

              {isExpanded && (
                <div className="codewords-grid">
                  {words.map(word => {
                    const isChecked = characterCodewords.includes(word);
                    return (
                      <label 
                        key={word} 
                        className={`codeword-item ${isChecked ? 'active' : ''}`}
                      >
                        <input 
                          type="checkbox" 
                          checked={isChecked} 
                          onChange={() => onToggle(character.id, 'codewords', word)} 
                        />
                        <span className="codeword-text">{word}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {customCodewords.length > 0 && (
          <div className="cw-book-section">
             <div className="codewords-legacy">
              <h3>Custom / Legacy</h3>
              <div className="codewords-grid">
                {customCodewords.map(word => (
                  <label key={word} className="codeword-item active">
                    <input 
                      type="checkbox" 
                      checked={true} 
                      onChange={() => onToggle(character.id, 'codewords', word)} 
                    />
                    <span className="codeword-text">{word}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
