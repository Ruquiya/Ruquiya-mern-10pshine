import { noteService } from '../noteService';

// Mock fetch API
global.fetch = jest.fn();

describe('NoteService', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
    fetch.mockClear();
  });

  afterEach(() => {
    localStorage.clear();
    fetch.mockClear();
  });

  describe('createNote', () => {
    it('should create a note successfully', async () => {
      const noteData = {
        title: 'Test Note',
        content: 'Test content',
        type: 'text',
      };

      const mockResponse = {
        success: true,
        data: { _id: '123456789012345678901234', ...noteData },
        message: 'Note created successfully',
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: async () => mockResponse,
      });

      const result = await noteService.createNote(noteData);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/notes',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(noteData),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle errors correctly', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: async () => ({ message: 'Network error' }),
      });

      await expect(noteService.createNote({ title: 'Test' })).rejects.toThrow();
    });
  });

  describe('getNotes', () => {
    it('should fetch all notes successfully', async () => {
      const mockResponse = {
        success: true,
        data: [
          { _id: '123456789012345678901234', title: 'Note 1' },
          { _id: '123456789012345678901235', title: 'Note 2' },
        ],
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: async () => mockResponse,
      });

      const result = await noteService.getNotes();

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/notes',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token',
          }),
        })
      );

      expect(result).toEqual(mockResponse);
    });
  });

  describe('getNote', () => {
    it('should fetch a single note successfully', async () => {
      const noteId = '123456789012345678901234';
      const mockResponse = {
        success: true,
        data: { _id: noteId, title: 'Test Note', content: 'Content' },
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: async () => mockResponse,
      });

      const result = await noteService.getNote(noteId);

      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:5000/api/notes/${noteId}`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token',
          }),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it('should throw error for invalid note ID', async () => {
      await expect(noteService.getNote('123')).rejects.toThrow('Invalid note ID');
    });
  });

  describe('updateNote', () => {
    it('should update a note successfully', async () => {
      const noteId = '123456789012345678901234';
      const noteData = {
        title: 'Updated Note',
        content: 'Updated content',
      };

      const mockResponse = {
        success: true,
        data: { _id: noteId, ...noteData },
        message: 'Note updated successfully',
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: async () => mockResponse,
      });

      const result = await noteService.updateNote(noteId, noteData);

      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:5000/api/notes/${noteId}`,
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(noteData),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it('should throw error for invalid note ID', async () => {
      await expect(noteService.updateNote('123', { title: 'Test' })).rejects.toThrow('Invalid note ID');
    });
  });

  describe('deleteNote', () => {
    it('should delete a note successfully', async () => {
      const noteId = '123456789012345678901234';

      const mockResponse = {
        success: true,
        message: 'Note deleted successfully',
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: async () => mockResponse,
      });

      const result = await noteService.deleteNote(noteId);

      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:5000/api/notes/${noteId}`,
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token',
          }),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it('should throw error for invalid note ID', async () => {
      await expect(noteService.deleteNote('123')).rejects.toThrow('Invalid note ID');
    });
  });

  describe('apiRequest error handling', () => {
    it('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

      await expect(noteService.getNotes()).rejects.toThrow(/Network error|Failed to fetch/);
    });

    it('should handle non-JSON responses', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: jest.fn().mockReturnValue('text/plain'),
        },
        text: async () => 'Plain text response',
      });

      const result = await noteService.getNotes();
      expect(result).toBe('Plain text response');
    });
  });
});
