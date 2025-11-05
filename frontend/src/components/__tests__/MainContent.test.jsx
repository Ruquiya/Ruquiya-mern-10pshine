import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MainContent from '../MainContent/MainContent';

// Mock dependencies
jest.mock('../../services/noteService', () => ({
  noteService: {
    getAllNotes: jest.fn(() => Promise.resolve([
      { _id: '1', title: 'Test Note 1', content: 'Content 1', type: 'text' },
      { _id: '2', title: 'Test Note 2', content: 'Content 2', type: 'todo', important: true }
    ]))
  }
}));

describe('MainContent Integration', () => {
  const defaultProps = {
    activeCategory: 'all',
    activeFilter: 'all',
    setActiveFilter: jest.fn(),
    searchTerm: '',
    selectedNote: null,
    setSelectedNote: jest.fn(),
    darkMode: false,
    sidebarOpen: true,
    onCreateNote: jest.fn(),
    onCreateFolder: jest.fn(),
    onEditNote: jest.fn(),
    onDeleteNote: jest.fn(),
    notes: [],
    folders: [],
    fetchNotes: jest.fn(),
    fetchFolders: jest.fn()
  };

  it('filters notes based on search term', async () => {
    const props = {
      ...defaultProps,
      notes: [
        { _id: '1', title: 'React Notes', content: 'Learning React' },
        { _id: '2', title: 'JavaScript Tips', content: 'JS best practices' }
      ]
    };

    render(<MainContent {...props} />);
    
    // Notes should be visible
    expect(screen.getByText('React Notes')).toBeInTheDocument();
    expect(screen.getByText('JavaScript Tips')).toBeInTheDocument();
  });

  it('handles note selection', async () => {
    const mockSetSelectedNote = jest.fn();
    const props = {
      ...defaultProps,
      notes: [{ _id: '1', title: 'Test Note', content: 'Test content' }],
      setSelectedNote: mockSetSelectedNote
    };

    render(<MainContent {...props} />);
    
    const noteCard = screen.getByText('Test Note');
    await userEvent.click(noteCard);
    
    expect(mockSetSelectedNote).toHaveBeenCalledWith(props.notes[0]);
  });
});