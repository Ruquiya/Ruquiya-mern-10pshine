import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

// Mock child components
jest.mock('../../components/Header/Header', () => ({
  __esModule: true,
  default: ({ onCreateNote, onCreateFolder }) => (
    <div data-testid="header">
      <button onClick={onCreateNote}>Create Note</button>
      <button onClick={onCreateFolder}>Create Folder</button>
    </div>
  )
}));

jest.mock('../../components/Sidebar/Sidebar', () => ({
  __esModule: true,
  default: () => <div data-testid="sidebar">Sidebar</div>
}));

jest.mock('../../components/MainContent/MainContent', () => ({
  __esModule: true,
  default: () => <div data-testid="main-content">Main Content</div>
}));

// Mock services
jest.mock('../../services/noteService', () => ({
  noteService: {
    getAllNotes: jest.fn(() => Promise.resolve([])),
    deleteNote: jest.fn(() => Promise.resolve({ success: true }))
  }
}));

describe('Dashboard', () => {
  const renderDashboard = () => {
    return render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true
    });
  });

  it('renders dashboard components', async () => {
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('main-content')).toBeInTheDocument();
    });
  });

  it('handles note creation', async () => {
    renderDashboard();
    
    const createNoteButton = screen.getByText('Create Note');
    fireEvent.click(createNoteButton);
    
    // Add assertions for create note modal
  });

  it('fetches notes and folders on mount', async () => {
    const mockFetch = jest.fn();
    global.fetch = mockFetch;
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([])
    }).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] })
    });

    renderDashboard();
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:5000/api/folders', expect.any(Object));
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:5000/api/notes', expect.any(Object));
    });
  });
});