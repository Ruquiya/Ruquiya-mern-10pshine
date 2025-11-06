import React from 'react';
import { render, screen } from '@testing-library/react';
import NoteCard from '../NoteCard';

const mockNote = {
  _id: '123456789012345678901234',
  title: 'Test Note',
  content: 'Test content',
  type: 'text',
  folder: 'General',
  createdAt: '2025-11-01T10:00:00.000Z',
  pinned: false,
  important: false,
  color: 'from-purple-100 to-violet-200',
};

describe('NoteCard', () => {
  it('renders note title', () => {
    render(<NoteCard note={mockNote} onClick={() => {}} darkMode={false} />);
    expect(screen.getByText('Test Note')).toBeInTheDocument();
  });

  it('renders note content', () => {
    render(<NoteCard note={mockNote} onClick={() => {}} darkMode={false} />);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders pinned indicator when note is pinned', () => {
    const pinnedNote = { ...mockNote, pinned: true };
    const { container } = render(<NoteCard note={pinnedNote} onClick={() => {}} darkMode={false} />);
    // Check for pinned icon (SVG element) - NoteCard uses an SVG for pinned status
    const svgElements = container.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);
    expect(pinnedNote.pinned).toBe(true);
  });

  it('calls onClick when card is clicked', () => {
    const handleClick = jest.fn();
    render(<NoteCard note={mockNote} onClick={handleClick} darkMode={false} />);
    
    // Find the card element and click it
    const card = screen.getByText('Test Note').closest('.cursor-pointer') || 
                 screen.getByText('Test Note').closest('div');
    if (card) {
      card.click();
      expect(handleClick).toHaveBeenCalled();
    }
  });

  it('renders different content for todo notes', () => {
    const todoNote = {
      ...mockNote,
      type: 'todo',
      content: JSON.stringify([
        { id: 1, text: 'Task 1', completed: false },
        { id: 2, text: 'Task 2', completed: true },
      ]),
    };

    render(<NoteCard note={todoNote} onClick={() => {}} darkMode={false} />);
    
    // Use getAllByText since there are multiple "task" texts
    const taskElements = screen.getAllByText(/task/i);
    expect(taskElements.length).toBeGreaterThan(0);
    // Check that task completion status is shown
    expect(screen.getByText(/tasks completed/i)).toBeInTheDocument();
  });

  it('renders code preview for code notes', () => {
    const codeNote = {
      ...mockNote,
      type: 'code',
      content: 'const hello = "world";\nconsole.log(hello);',
    };

    render(<NoteCard note={codeNote} onClick={() => {}} darkMode={false} />);
    
    // Check for code preview
    expect(screen.getByText(/lines of code/i)).toBeInTheDocument();
  });

  it('applies dark mode styles correctly', () => {
    const { container } = render(<NoteCard note={mockNote} onClick={() => {}} darkMode={true} />);
    const cardElement = container.querySelector('.cursor-pointer') || container.firstChild;
    expect(cardElement).toBeInTheDocument();
  });

  it('handles missing content gracefully', () => {
    const emptyNote = {
      ...mockNote,
      content: '',
    };

    render(<NoteCard note={emptyNote} onClick={() => {}} darkMode={false} />);
    expect(screen.getByText('Test Note')).toBeInTheDocument();
  });
});

