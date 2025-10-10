import React, { useState, useEffect } from 'react';

const CreateFolderModal = ({ darkMode, onClose, onSave, folderToEdit = null, allNotes = [] }) => {
  const [folderName, setFolderName] = useState(folderToEdit?.name || '');
  const [selectedColor, setSelectedColor] = useState(
    folderToEdit?.color || 'from-blue-900/50 to-blue-800/50'
  );
  const [isLoading, setIsLoading] = useState(false);

  const [selectedNotes, setSelectedNotes] = useState([]);
  const [availableNotes, setAvailableNotes] = useState([]);
  const [showNotesDropdown, setShowNotesDropdown] = useState(false);

  const colorOptions = [
    { value: 'from-blue-900/50 to-blue-800/50', label: 'Blue', light: 'from-blue-100 to-blue-200' },
    { value: 'from-green-900/50 to-green-800/50', label: 'Green', light: 'from-green-100 to-green-200' },
    { value: 'from-purple-900/50 to-purple-800/50', label: 'Purple', light: 'from-purple-100 to-purple-200' },
    { value: 'from-yellow-900/50 to-yellow-800/50', label: 'Yellow', light: 'from-yellow-100 to-yellow-200' },
    { value: 'from-pink-900/50 to-pink-800/50', label: 'Pink', light: 'from-pink-100 to-pink-200' },
    { value: 'from-cyan-900/50 to-cyan-800/50', label: 'Cyan', light: 'from-cyan-100 to-cyan-200' },
    { value: 'from-indigo-900/50 to-indigo-800/50', label: 'Indigo', light: 'from-indigo-100 to-indigo-200' },
    { value: 'from-orange-900/50 to-orange-800/50', label: 'Orange', light: 'from-orange-100 to-orange-200' },
  ];

  useEffect(() => {
    if (folderToEdit && folderToEdit.notes) {
      setSelectedNotes(folderToEdit.notes);
    } else {
      setSelectedNotes([]);
    }
  }, [folderToEdit]);

 
  useEffect(() => {
    const selectedNoteIds = selectedNotes.map(note => note._id || note.id);
    const filteredNotes = allNotes.filter(note => 
      !selectedNoteIds.includes(note._id || note.id)
    );
    setAvailableNotes(filteredNotes);
  }, [allNotes, selectedNotes]);

  useEffect(() => {
    if (folderToEdit) {
      setFolderName(folderToEdit.name);
      setSelectedColor(folderToEdit.color);
      setSelectedNotes(folderToEdit.notes || []);
    } else {
      setFolderName('');
      setSelectedColor('from-blue-900/50 to-blue-800/50');
      setSelectedNotes([]);
    }
  }, [folderToEdit]);

  const handleAddNoteFromDropdown = (note) => {
    if (selectedNotes.find(n => (n._id || n.id) === (note._id || note.id))) return;
    
    const noteToAdd = {
      _id: note._id,
      id: note._id,
      title: note.title || 'Untitled Note',
      content: note.content || '',
      text: note.title || 'Untitled Note'
    };
    setSelectedNotes([...selectedNotes, noteToAdd]);
    setShowNotesDropdown(false);
  };

  // Remove note
  const handleRemoveNote = (id) => {
    setSelectedNotes(selectedNotes.filter((note) => (note._id || note.id) !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    setIsLoading(true);

    const folderData = {
      name: folderName.trim(),
      color: selectedColor,
      date: new Date().toLocaleDateString('en-GB'),
      notes: selectedNotes,
      noteCount: selectedNotes.length,
    };

    try {
      const url = folderToEdit 
        ? `http://localhost:5000/api/folders/${folderToEdit._id}`
        : 'http://localhost:5000/api/folders';
      
      const method = folderToEdit ? 'PUT' : 'POST';

      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(folderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save folder');
      }

      const data = await response.json();
      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Error saving folder:', error);
      alert(`Error saving folder: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className={`relative rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {folderToEdit ? 'Edit Folder' : 'Create New Folder'}
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Folder Name */}
            <div className="mb-6">
              <label
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Folder Name *
              </label>
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className={`w-full p-3 rounded-lg border transition-all ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-cyan-400'
                }`}
                placeholder="Enter folder name..."
                autoFocus
                maxLength={50}
                required
              />
              <div
                className={`text-xs mt-1 text-right ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
              >
                {folderName.length}/50 characters
              </div>
            </div>

            {/* Notes Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label
                  className={`block text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Notes ({selectedNotes.length})
                </label>
                
                {/* Add Existing Notes Dropdown */}
                {availableNotes.length > 0 && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowNotesDropdown(!showNotesDropdown)}
                      className="px-3 py-1 text-xs rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition"
                    >
                      + Add Notes
                    </button>
                    
                    {showNotesDropdown && (
                      <div className={`absolute right-0 top-8 w-64 max-h-48 overflow-y-auto rounded-lg shadow-lg z-20 ${
                        darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'
                      }`}>
                        {availableNotes.map((note) => (
                          <div
                            key={note._id}
                            className={`px-3 py-2 cursor-pointer hover:bg-opacity-50 ${
                              darkMode 
                                ? 'hover:bg-gray-600 text-gray-200' 
                                : 'hover:bg-gray-100 text-gray-700'
                            }`}
                            onClick={() => handleAddNoteFromDropdown(note)}
                          >
                            <div className="text-sm font-medium truncate">
                              {note.title || 'Untitled Note'}
                            </div>
                            <div className="text-xs opacity-75 truncate">
                              {note.content ? note.content.substring(0, 50) + '...' : 'No content'}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Selected Notes List */}
              {selectedNotes.length > 0 ? (
                <div className={`space-y-2 max-h-40 overflow-y-auto rounded-lg p-2 ${
                  darkMode ? 'bg-gray-700/30' : 'bg-gray-100'
                }`}>
                  {selectedNotes.map((note) => (
                    <div
                      key={note._id || note.id}
                      className={`flex justify-between items-center px-3 py-2 rounded-lg ${
                        darkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-800 border'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          {note.title || note.text || 'Untitled Note'}
                        </div>
                        {note.content && (
                          <div className="text-xs opacity-75 truncate">
                            {note.content.substring(0, 30)}...
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveNote(note._id || note.id)}
                        className="ml-2 text-red-500 hover:text-red-700 transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-4 rounded-lg ${
                  darkMode ? 'bg-gray-700/30 text-gray-400' : 'bg-gray-100 text-gray-500'
                }`}>
                  <p className="text-sm">No notes added yet</p>
                  <p className="text-xs mt-1">Use the "Add Notes" button to add existing notes</p>
                </div>
              )}
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <label
                className={`block text-sm font-medium mb-3 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Folder Color
              </label>
              <div className="grid grid-cols-4 gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedColor(color.value)}
                    className={`p-3 rounded-lg text-white font-medium bg-gradient-to-br ${
                      color.value
                    } transition-all hover:scale-105 ${
                      selectedColor === color.value
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800 scale-105'
                        : ''
                    }`}
                    title={color.label}
                  >
                    {color.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
              <div
                className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
              >
                Preview:
              </div>
              <div className={`bg-gradient-to-br rounded-lg p-3 ${selectedColor}`}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">📁</span>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {folderName || 'Folder Name'}
                  </span>
                </div>
                <div className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {selectedNotes.length} notes
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!folderName.trim() || isLoading}
                className="flex-1 py-3 px-4 rounded-lg font-medium text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : folderToEdit ? (
                  'Update Folder'
                ) : (
                  'Create Folder'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateFolderModal;