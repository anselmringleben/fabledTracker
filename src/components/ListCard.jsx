import { useState } from 'react';
import './ListCard.css';

/**
 * Reusable card for managing a list of items (possessions, codewords, blessings, titles).
 */
export default function ListCard({ title, icon, items, maxItems, onAdd, onRemove, placeholder, id }) {
  const [inputValue, setInputValue] = useState('');

  function handleAdd(e) {
    e.preventDefault();
    if (!inputValue.trim()) return;
    if (maxItems && items.length >= maxItems) return;
    onAdd(inputValue.trim());
    setInputValue('');
  }

  const isAtMax = maxItems && items.length >= maxItems;

  return (
    <div className="list-card card" id={id}>
      <div className="card-header">
        <span className="icon">{icon}</span>
        <h2>{title}</h2>
        {maxItems && (
          <span className="list-count">{items.length}/{maxItems}</span>
        )}
        {!maxItems && (
          <span className="list-count">{items.length}</span>
        )}
      </div>

      <form className="list-add-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder={isAtMax ? `Max ${maxItems} reached` : placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isAtMax}
        />
        <button
          className="btn btn-primary btn-sm"
          type="submit"
          disabled={isAtMax || !inputValue.trim()}
        >
          Add
        </button>
      </form>

      {items.length === 0 ? (
        <p className="list-empty">No {title.toLowerCase()} yet</p>
      ) : (
        <ul className="list-items">
          {items.map((item, index) => (
            <li key={index} className="list-item animate-slide-in" style={{ animationDelay: `${index * 30}ms` }}>
              <span className="list-item-text">{item}</span>
              <button
                className="btn btn-icon btn-danger btn-sm"
                onClick={() => onRemove(index)}
                title="Remove"
                aria-label={`Remove ${item}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
