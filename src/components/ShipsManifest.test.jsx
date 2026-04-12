import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ShipsManifest from './ShipsManifest';

describe('ShipsManifest', () => {
  const mockCharacter = {
    id: 'char-1',
    name: 'Test Hero',
    currentBook: 1,
    currentSection: 1,
    ships: [
      { id: 'ship-1', name: 'The Black Pearl', type: 'Galleon', docked: 'Yellowport', crew: 'Excellent', cargo: 'Silk' }
    ]
  };

  const mockHandlers = {
    onAddToList: vi.fn(),
    onUpdateInList: vi.fn(),
    onRemoveFromList: vi.fn(),
    onAddTimelineEntry: vi.fn(),
  };

  it('renders the list of ships', () => {
    render(<ShipsManifest character={mockCharacter} {...mockHandlers} />);
    expect(screen.getByText('The Black Pearl')).toBeInTheDocument();
    expect(screen.getByText('Galleon')).toBeInTheDocument();
    expect(screen.getByText('Yellowport')).toBeInTheDocument();
  });

  it('shows the empty state when no ships are owned', () => {
    render(<ShipsManifest character={{ ...mockCharacter, ships: [] }} {...mockHandlers} />);
    expect(screen.getByText('No ships owned')).toBeInTheDocument();
  });

  it('opens the add ship form when clicking "+ Add Ship"', () => {
    render(<ShipsManifest character={mockCharacter} {...mockHandlers} />);
    fireEvent.click(screen.getByText('+ Add Ship'));
    expect(screen.getByPlaceholderText('Ship Name (Optional)')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('calls onAddToList when submitting a new ship', () => {
    render(<ShipsManifest character={mockCharacter} {...mockHandlers} />);
    fireEvent.click(screen.getByText('+ Add Ship'));
    
    fireEvent.change(screen.getByPlaceholderText('Ship Name (Optional)'), { target: { value: 'Interceptor' } });
    fireEvent.change(screen.getByPlaceholderText('Docked at'), { target: { value: 'Maris' } });
    
    fireEvent.click(screen.getByText('Save'));

    expect(mockHandlers.onAddToList).toHaveBeenCalledWith(
      'char-1',
      'ships',
      expect.objectContaining({
        name: 'Interceptor',
        docked: 'Maris',
        type: 'Barque' // default
      })
    );
    expect(mockHandlers.onAddTimelineEntry).toHaveBeenCalled();
  });

  it('calls onRemoveFromList when clicking remove button', () => {
    render(<ShipsManifest character={mockCharacter} {...mockHandlers} />);
    
    // Find the remove button (labeled with aria-label)
    const removeBtn = screen.getByLabelText('Remove The Black Pearl');
    fireEvent.click(removeBtn);

    expect(mockHandlers.onRemoveFromList).toHaveBeenCalledWith('char-1', 'ships', 0);
    expect(mockHandlers.onAddTimelineEntry).toHaveBeenCalledWith(
      'char-1',
      'journeyLog',
      expect.objectContaining({ type: 'ship_lost' })
    );
  });

  it('switches to edit mode when clicking edit button', () => {
    render(<ShipsManifest character={mockCharacter} {...mockHandlers} />);
    
    const editBtn = screen.getByLabelText('Edit The Black Pearl');
    fireEvent.click(editBtn);

    const nameInput = screen.getByDisplayValue('The Black Pearl');
    fireEvent.change(nameInput, { target: { value: 'The White Pearl' } });
    
    fireEvent.click(screen.getByText('Save'));
    
    expect(mockHandlers.onUpdateInList).toHaveBeenCalledWith(
      'char-1',
      'ships',
      0,
      expect.objectContaining({ name: 'The White Pearl' })
    );
  });
});
