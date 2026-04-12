import { useState } from 'react';
import './ListCard.css';

/**
 * Reusable card for managing a list of items (possessions, codewords, blessings, titles).
 */
export default function ListCard({ title, icon, items, maxItems, onAdd, onRemove, onEdit, placeholder, id, topContent }) {
  const [inputValue, setInputValue] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState('');

  function handleAdd(e) {
    e.preventDefault();
    if (!inputValue.trim()) return;
    if (maxItems && items.length >= maxItems) return;
    onAdd(inputValue.trim());
    setInputValue('');
  }

  function saveEdit(index) {
    if (editValue.trim() !== '' && onEdit) {
      onEdit(index, editValue.trim());
    }
    setEditingIndex(null);
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

      {topContent && (
        <div className="list-card-top-content">
          {topContent}
        </div>
      )}

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
              {editingIndex === index ? (
                <form 
                  onSubmit={(e) => { e.preventDefault(); saveEdit(index); }}
                  style={{ flex: 1, display: 'flex' }}
                >
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    autoFocus
                    onBlur={() => saveEdit(index)}
                    style={{ 
                      flex: 1, 
                      padding: '2px 6px', 
                      background: 'var(--color-bg-input)', 
                      border: '1px solid var(--color-accent)', 
                      borderRadius: 'var(--radius-sm)', 
                      color: 'var(--color-text-primary)' 
                    }}
                  />
                </form>
              ) : (
                <span 
                  className="list-item-text"
                  onClick={() => {
                    if (onEdit) {
                      setEditingIndex(index);
                      setEditValue(item);
                    }
                  }}
                  style={{ cursor: onEdit ? 'pointer' : 'default', flex: 1 }}
                  title={onEdit ? "Click to edit" : undefined}
                >
                  {item}
                </span>
              )}
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
