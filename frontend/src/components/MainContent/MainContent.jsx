import React, { useState, useMemo } from 'react';
import NoteCard from '../Notes/NoteCard/NoteCard';
import FolderCard from '../Folder/FolderCard/FolderCard';
import FolderView from '../Folder/FolderView';
import NoteView from '../Notes/NoteView/NoteView';
import Calendar from '../Calendar/Calendar';
import NotesListPanel from '../Notes/NotesListPanel/NotesListPanel';
import CreateNote from '../Notes/CreateNote/CreateNote';
import EditNote from '../Notes/EditNote/EditNote';

const MainContent = ({
  activeCategory,
  activeFilter,
  setActiveFilter,
  searchTerm,
  selectedNote,
  setSelectedNote,
  darkMode,
  sidebarOpen,
  onCreateNote,
  onCreateFolder,
  onEditFolder,
  onDeleteFolder,
  onEditNote,
  onDeleteNote,
  notes = [],
  folders = [],
  fetchNotes,
  fetchFolders,
}) => {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false);
  const [isEditNoteOpen, setIsEditNoteOpen] = useState(false);

  const allNotes = useMemo(() => notes || [], [notes]);
  const allFolders = useMemo(() => folders || [], [folders]);

  const calendarEvents = useMemo(() => {
    return allNotes
      .filter(note => note && note.reminder && note.reminder.isActive && note.reminder.date)
      .map(note => ({
        date: new Date(note.reminder.date),
        title: note.title || 'Untitled',
        type: note.important ? 'important' : 'reminder',
        noteId: note._id,
        time: note.reminder.time || null,
      }));
  }, [allNotes]);

  const getFilteredNotes = () => {
    return allNotes.filter(note => {
      const matchesSearch =
        (note.title && note.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase()));
      let matchesFilter = true;
      if (activeFilter === 'pinned') matchesFilter = note.pinned;
      if (activeFilter === 'important') matchesFilter = note.important;
      return matchesSearch && matchesFilter;
    });
  };

  const filteredNotes = getFilteredNotes();

  const filteredFolders = allFolders.filter(folder =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
    setIsCreateNoteOpen(false);
    setIsEditNoteOpen(false);
    setSelectedNote(null);
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setIsCreateNoteOpen(false);
    setIsEditNoteOpen(false);
  };

  const handleCreateNote = () => {
    setIsCreateNoteOpen(true);
    setIsEditNoteOpen(false);
    setSelectedNote(null);
  };

  const handleEditNoteClick = (note) => {
    setSelectedNote(note);
    setIsEditNoteOpen(true);
    setIsCreateNoteOpen(false);
  };

  const handleSaveNote = async (savedNote) => {
    try {
      if (isCreateNoteOpen) {
        await onCreateNote(savedNote);
      } else if (isEditNoteOpen) {
        await onEditNote(savedNote);
      }
      await fetchNotes();
      setIsCreateNoteOpen(false);
      setIsEditNoteOpen(false);
      setSelectedNote(null);
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note. Please try again.');
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await onDeleteNote(noteId);
        await fetchNotes();
        setSelectedNote(null);
        setIsEditNoteOpen(false);
      } catch (error) {
        console.error('Error deleting note:', error);
        alert('Failed to delete note. Please try again.');
      }
    }
  };

  const handleCloseModal = () => {
    setIsCreateNoteOpen(false);
    setIsEditNoteOpen(false);
    setSelectedNote(null);
  };

  const handleBackFromNoteView = () => {
    setSelectedNote(null);
    setIsEditNoteOpen(false);
  };

  return (
    <main
      className={`flex-1 p-2 md:p-6 overflow-y-auto theme-transition ${
        darkMode ? 'bg-[var(--bg-primary-dark)]' : 'bg-[var(--bg-primary-light)]'
      }`}
      style={{
        '--bg-primary-light': 'linear-gradient(135deg, #f9fafb, #e5e7eb)',
        '--bg-primary-dark': 'linear-gradient(135deg, #111827, #1f2937)',
        '--text-primary': darkMode ? '#f3f4f6' : '#1f2937',
        '--text-secondary': darkMode ? '#9ca3af' : '#4b5563',
        '--accent-primary': darkMode ? '#a5b4fc' : '#4f46e5',
        '--accent-hover': darkMode ? '#c7d2fe' : '#4338ca',
        '--card-bg': darkMode ? '#1f2937' : '#ffffff',
        '--border-color': darkMode ? '#374151' : '#e5e7eb',
        '--shadow': darkMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
      }}
    >
      <style>
        {`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease-in;
            z-index: 1000;
          }
          .modal-content {
            max-width: 90%;
            width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            border-radius: 12px;
            box-shadow: var(--shadow);
            animation: slideIn 0.3s ease-in;
            background: ${darkMode ? '#1f2937' : '#ffffff'};
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      {/* Create Note Modal */}
      {isCreateNoteOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <CreateNote
              darkMode={darkMode}
              onClose={handleCloseModal}
              onSave={handleSaveNote}
              folders={allFolders}
            />
          </div>
        </div>
      )}

      {/* Edit Note Modal - Only show when explicitly editing */}
      {isEditNoteOpen && selectedNote && (
        <div className="modal-overlay">
          <div className="modal-content">
            <EditNote
              note={selectedNote}
              darkMode={darkMode}
              onClose={handleCloseModal}
              onSave={handleSaveNote}
              folders={allFolders}
            />
          </div>
        </div>
      )}

      {/* Note View - Show when viewing a note (not editing) */}
      {selectedNote && !isCreateNoteOpen && !isEditNoteOpen && (
        <div className="flex flex-1">
          <div className="hidden lg:block lg:w-65">
            <NotesListPanel
              notes={allNotes}
              selectedNote={selectedNote}
              setSelectedNote={setSelectedNote}
              darkMode={darkMode}
            />
          </div>
          <div className="flex-1">
            <NoteView
              note={selectedNote}
              onBack={handleBackFromNoteView}
              darkMode={darkMode}
              allNotes={allNotes}
              onEdit={handleEditNoteClick}
              onDelete={handleDeleteNote}
            />
          </div>
        </div>
      )}

      {/* Main List View */}
      {!selectedNote && !isCreateNoteOpen && !isEditNoteOpen && (
        <>
          {selectedFolder ? (
            <div className="flex-1">
              <FolderView
                folder={selectedFolder}
                notes={allNotes}
                darkMode={darkMode}
                onBack={() => setSelectedFolder(null)}
                onOpenNote={handleNoteClick}
                onEditFolder={onEditFolder}
                onDeleteFolder={onDeleteFolder}
              />
            </div>
          ) : activeCategory === 'calendar' ? (
            <div className="flex-1 p-6">
              <Calendar darkMode={darkMode} events={calendarEvents} />
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-4">
                <div>
                  <h1 className={`text-xl md:text-2xl font-bold theme-transition text-[var(--text-primary)]`}>
                    {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
                  </h1>
                  <p className={`text-sm mt-1 theme-transition text-[var(--text-secondary)]`}>
                    {activeCategory === 'all' && `${allNotes.length} notes • ${allFolders.length} folders`}
                    {activeCategory === 'notes' && `${allNotes.length} notes`}
                    {activeCategory === 'folders' && `${allFolders.length} folders`}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={onCreateFolder}
                    className={`px-3 py-2 sm:px-4 rounded-lg font-medium transition-all text-sm sm:text-base bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800`}
                    aria-label="Create new folder"
                  >
                    📁 <span className="hidden sm:inline">New Folder</span>
                    <span className="sm:hidden">Folder</span>
                  </button>
                  <button
                    onClick={handleCreateNote}
                    className="px-3 py-2 sm:px-4 rounded-lg font-medium text-white bg-gradient-to-r from-cyan-600 to-purple-700 hover:from-cyan-700 hover:to-purple-800 transition-all text-sm sm:text-base"
                    aria-label="Create new note"
                  >
                    + <span className="hidden sm:inline">New Note</span>
                    <span className="sm:hidden">Note</span>
                  </button>
                </div>
              </div>

              {/* Folder View */}
              {(activeCategory === 'all' || activeCategory === 'folders') && (
                <div className="mb-8">
                  <h2 className={`text-lg font-semibold mb-3 theme-transition text-[var(--text-primary)]`}>Folders</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredFolders.map(folder => (
                      <FolderCard
                        key={folder._id}
                        folder={folder}
                        darkMode={darkMode}
                        onEdit={onEditFolder}
                        onDelete={onDeleteFolder}
                        onClick={handleFolderClick}
                        isSelected={selectedFolder?._id === folder._id}
                      />
                    ))}
                    <button
                      onClick={onCreateFolder}
                      className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center hover:border-purple-600 transition-all duration-200 shadow-sm theme-transition bg-[var(--card-bg)]`}
                      aria-label="Create new folder"
                    >
                      <svg className={`w-8 h-8 mb-2 text-purple-600 dark:text-purple-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span className={`font-medium text-[var(--text-primary)]`}>New Folder</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Notes View */}
              {(activeCategory === 'all' || activeCategory === 'notes') && (
                <div className="mb-8">
                  <div className={`flex gap-6 mb-6 pb-2 border-b border-[var(--border-color)]`}>
                    {['all', 'important', 'pinned'].map(filter => (
                      <button
                        key={filter}
                        className={`relative pb-2 text-sm font-medium transition-all duration-200 theme-transition ${
                          activeFilter === filter
                            ? 'text-[var(--accent-primary)]'
                            : 'text-[var(--text-secondary)] hover:text-[var(--accent-hover)]'
                        }`}
                        onClick={() => setActiveFilter(filter)}
                        aria-label={`Filter by ${filter}`}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        {activeFilter === filter && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-600 to-purple-700" />
                        )}
                      </button>
                    ))}
                  </div>

                  <h2 className={`text-lg font-semibold mb-3 theme-transition text-[var(--text-primary)]`}>My Notes</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredNotes.map(note => (
                      <NoteCard
                        key={note._id}
                        note={note}
                        onClick={handleNoteClick}
                        darkMode={darkMode}
                      />
                    ))}
                    <button
                      onClick={handleCreateNote}
                      className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center hover:border-cyan-600 transition-all duration-200 shadow-sm theme-transition bg-[var(--card-bg)]`}
                      aria-label="Create new note"
                    >
                      <svg className={`w-8 h-8 mb-2 text-cyan-600 dark:text-cyan-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span className={`font-medium text-[var(--text-primary)]`}>New Note</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </main>
  );
};

export default MainContent;