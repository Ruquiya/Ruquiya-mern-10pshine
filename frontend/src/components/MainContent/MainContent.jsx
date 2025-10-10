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
  const [currentView, setCurrentView] = useState('list');

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
    setCurrentView('list');
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setCurrentView('view');
  };

  const handleCreateNote = () => {
    setCurrentView('create');
    setSelectedNote(null);
  };

  const handleEditNote = (note) => {
    setSelectedNote(note);
    setCurrentView('edit');
  };

  const handleSaveNote = async (savedNote) => {
    try {
      if (currentView === 'create') {
        await onCreateNote(savedNote);
      } else if (currentView === 'edit') {
        await onEditNote(savedNote);
      }
      await fetchNotes(); 
      setCurrentView('list');
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
        setCurrentView('list');
        setSelectedNote(null);
      } catch (error) {
        console.error('Error deleting note:', error);
        alert('Failed to delete note. Please try again.');
      }
    }
  };

  const handleCloseModal = () => {
    setCurrentView('list');
    setSelectedNote(null);
  };

  return (
    <main
      className={`flex-1 p-2 md:p-6 overflow-y-auto theme-transition ${
        darkMode
          ? 'bg-[var(--bg-primary)]'
          : 'bg-[var(--bg-primary)]'
      }`}
      style={{ '--bg-primary': darkMode ? 'linear-gradient(135deg, #1a202c, #2d3748)' : 'linear-gradient(135deg, #f7fafc, #e2e8f0)' }}
    >
      <style>
        {`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease-in;
          }
          .modal-content {
            max-width: 90%;
            width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            border-radius: 12px;
            box-shadow: var(--shadow);
            animation: slideIn 0.3s ease-in;
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
      {currentView === 'create' && (
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

      {/* Edit Note Modal */}
      {currentView === 'edit' && selectedNote && (
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

      {/* Note View */}
      {currentView === 'view' && selectedNote && (
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
              onBack={handleCloseModal}
              darkMode={darkMode}
              allNotes={allNotes}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
            />
          </div>
        </div>
      )}

      {/* Main List View */}
      {currentView === 'list' && (
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
                    className={`px-3 py-2 sm:px-4 rounded-lg font-medium transition-all text-sm sm:text-base bg-purple-500 text-white hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700`}
                    aria-label="Create new folder"
                  >
                    📁 <span className="hidden sm:inline">New Folder</span>
                    <span className="sm:hidden">Folder</span>
                  </button>
                  <button
                    onClick={handleCreateNote}
                    className="px-3 py-2 sm:px-4 rounded-lg font-medium text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 transition-all text-sm sm:text-base"
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
                      className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center hover:border-purple-500 transition-all duration-200 shadow-sm theme-transition bg-[var(--card-bg)]`}
                      aria-label="Create new folder"
                    >
                      <svg className={`w-8 h-8 mb-2 text-purple-500 dark:text-purple-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-600" />
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
                      className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center hover:border-cyan-500 transition-all duration-200 shadow-sm theme-transition bg-[var(--card-bg)]`}
                      aria-label="Create new note"
                    >
                      <svg className={`w-8 h-8 mb-2 text-cyan-500 dark:text-cyan-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span className={`font-medium text-[var(--text-primary)]`}>New Note</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Empty States */}
              {filteredNotes.length === 0 && (activeCategory === 'all' || activeCategory === 'notes') && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className={`text-lg font-medium mb-1 theme-transition text-[var(--text-primary)]`}>No notes found</h3>
                  <p className={`text-sm theme-transition text-[var(--text-secondary)]`}>Try changing your search or create a new note</p>
                  <button
                    onClick={handleCreateNote}
                    className="mt-4 px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-purple-700 transition-all"
                    aria-label="Create new note"
                  >
                    Create Your First Note
                  </button>
                </div>
              )}

              {filteredFolders.length === 0 && (activeCategory === 'all' || activeCategory === 'folders') && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📁</div>
                  <h3 className={`text-lg font-medium mb-1 theme-transition text-[var(--text-primary)]`}>No folders found</h3>
                  <p className={`text-sm theme-transition text-[var(--text-secondary)]`}>Create your first folder to organize your notes</p>
                  <button
                    onClick={onCreateFolder}
                    className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-700 transition-all"
                    aria-label="Create new folder"
                  >
                    Create Your First Folder
                  </button>
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