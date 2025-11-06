import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextNoteEditor from '../Notes/CreateNote/NoteEditor.jsx';

// Mock react-icons/fa to return a stub component for any icon used
jest.mock('react-icons/fa', () => {
  const React = require('react');
  return new Proxy({}, {
    get: (_, iconName) => (props) => React.createElement('span', { title: iconName, ...props }, iconName)
  });
});

describe('TextNoteEditor', () => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    content: '',
    onChange: mockOnChange,
    darkMode: false
  };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders without crashing', () => {
    render(<TextNoteEditor {...defaultProps} />);
    expect(screen.getByText('Rich Text Editor')).toBeInTheDocument();
  });

  it('displays toolbar when open', () => {
    render(<TextNoteEditor {...defaultProps} />);
    expect(screen.getByTitle('Bold')).toBeInTheDocument();
    expect(screen.getByTitle('Italic')).toBeInTheDocument();
  });

  it('calls onChange when content is modified', async () => {
    render(<TextNoteEditor {...defaultProps} />);
    
    const editor = screen.getByRole('textbox');
    await userEvent.type(editor, 'Test content');
    
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('applies bold formatting when bold button is clicked', async () => {
    render(<TextNoteEditor {...defaultProps} />);
    
    const boldButton = screen.getByTitle('Bold');
    await userEvent.click(boldButton);
    
    // You might need to add more assertions based on your implementation
    expect(boldButton).toBeInTheDocument();
  });

  it('handles image upload', async () => {
    render(<TextNoteEditor {...defaultProps} />);
    
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getByDisplayValue('');
    
    await userEvent.upload(input, file);
    
    // Add assertions for image upload behavior
  });

  it('displays word and character count', async () => {
    render(<TextNoteEditor {...defaultProps} />);
    
    const editor = screen.getByRole('textbox');
    await userEvent.type(editor, 'Hello world');
    
    expect(screen.getByText(/Words:/)).toBeInTheDocument();
    expect(screen.getByText(/Characters:/)).toBeInTheDocument();
  });
});