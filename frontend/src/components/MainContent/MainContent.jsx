// MainContent.jsx
import React from 'react';
import NoteCard from '../NoteCard/NoteCard';
import FolderCard from '../FolderCard/FolderCard';
import NoteView from '../NoteView/NoteView';
import Calendar from '../Calendar/Calendar';
import NotesListPanel from '../NotesListPanel/NotesListPanel';

const MainContent = ({ activeCategory, activeFilter, setActiveFilter, searchTerm, selectedNote, setSelectedNote, darkMode, sidebarOpen }) => {
  const notes = [
    { 
      id: 1, 
      title: 'Mid test exam', 
      content: 'Unices vivens odo congue lecon felis...', 
      date: '01/10/2021', 
      folder: 'Class Notes', 
      tags: ['work', 'exam'], 
      pinned: true, 
      important: true, 
      color: darkMode ? 'from-yellow-900/50 to-yellow-800/50' : 'from-yellow-100 to-yellow-200' 
    },
    { 
      id: 2, 
      title: 'Movie Review', 
      content: 'Review of the latest sci-fi movie...', 
      date: '01/10/2021', 
      folder: 'Personal', 
      tags: ['entertainment', 'review'], 
      pinned: false, 
      important: false, 
      color: darkMode ? 'from-pink-900/50 to-pink-800/50' : 'from-pink-100 to-pink-200' 
    },
    { 
      id: 3, 
      title: 'Book Lists', 
      content: 'Books to read this month...', 
      date: '14/10/2021', 
      folder: 'Personal', 
      tags: ['reading', 'learning'], 
      pinned: true, 
      important: true, 
      color: darkMode ? 'from-blue-900/50 to-blue-800/50' : 'from-blue-100 to-blue-200' 
    },
    { 
      id: 4, 
      title: 'January notes', 
      content: 'Ready - warm odo congue lecon felis...', 
      date: '15/01/2022', 
      folder: 'Work', 
      tags: ['meeting', 'planning'], 
      pinned: false, 
      important: false, 
      color: darkMode ? 'from-purple-900/50 to-purple-800/50' : 'from-purple-100 to-purple-200' 
    },
  ];

  const folders = [
    { id: 1, name: 'Movie Review', date: '13/10/2021', color: darkMode ? 'from-cyan-900/50 to-cyan-800/50' : 'from-cyan-100 to-cyan-200' },
    { id: 2, name: 'Class Notes', date: '13/10/2021', color: darkMode ? 'from-indigo-900/50 to-indigo-800/50' : 'from-indigo-100 to-indigo-200' },
    { id: 3, name: 'Book Lists', date: '13/10/2021', color: darkMode ? 'from-purple-900/50 to-purple-800/50' : 'from-purple-100 to-purple-200' },
  ];

  const calendarEvents = [
    { date: 15, title: 'Mid test exam', type: 'important' },
    { date: 15, title: 'Team meeting', type: 'note' },
    { date: 20, title: 'Book club', type: 'event' },
  ];

  const filters = ['all', 'important', 'pinned', 'tagged', 'archived', 'draft'];

  const filteredNotes = notes.filter(note => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesFilter = true;
    if (activeFilter === 'pinned') matchesFilter = note.pinned;
    if (activeFilter === 'important') matchesFilter = note.important;
    return matchesSearch && matchesFilter;
  });

  const filteredFolders = folders.filter(folder => folder.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (selectedNote) {
    return (
      <div className="flex flex-1">
        <NotesListPanel 
          notes={notes} 
          selectedNote={selectedNote} 
          setSelectedNote={setSelectedNote} 
          darkMode={darkMode} 
        />
        <div className="flex-1">
          <NoteView note={selectedNote} onBack={() => setSelectedNote(null)} darkMode={darkMode} />
        </div>
      </div>
    );
  }

  if (activeCategory === 'calendar') {
    return (
      <div className="flex-1 p-6">
        <Calendar darkMode={darkMode} events={calendarEvents} />
      </div>
    );
  }

  return (
    <main className={`flex-1 p-6 overflow-y-auto theme-transition ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 to-indigo-900' 
        : 'bg-gradient-to-br from-gray-50 to-blue-50'
    }`}>
      <h1 className={`text-2xl font-bold mb-6 theme-transition ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>{activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}</h1>
      
      {(activeCategory === 'all' || activeCategory === 'notes') && (
        <div className="mb-8">
          <div className={`flex gap-6 mb-6 pb-2 border-b theme-transition ${
            darkMode ? 'border-white/10' : 'border-gray-200'
          }`}>
            {filters.map(filter => (
              <button
                key={filter}
                className={`relative pb-2 text-sm font-medium transition-all duration-200 theme-transition ${
                  activeFilter === filter 
                    ? darkMode ? 'text-cyan-400' : 'text-cyan-600'
                    : darkMode ? 'text-gray-400 hover:text-cyan-300' : 'text-gray-500 hover:text-cyan-500'
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                {activeFilter === filter && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-600" />
                )}
              </button>
            ))}
          </div>
          <h2 className={`text-lg font-semibold mb-3 theme-transition ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>My Notes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredNotes.map(note => (
              <NoteCard key={note.id} note={note} onClick={() => setSelectedNote(note)} darkMode={darkMode} />
            ))}
            <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center hover:border-cyan-500 transition-all duration-200 shadow-sm theme-transition ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-600' 
                : 'bg-white/80 border-gray-300'
            }`}>
              <svg className={`w-8 h-8 mb-2 theme-transition ${
                darkMode ? 'text-cyan-400' : 'text-cyan-500'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className={`font-medium theme-transition ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>New Note</span>
            </div>
          </div>
        </div>
      )}

      {(activeCategory === 'all' || activeCategory === 'folders') && (
        <div>
          <h2 className={`text-lg font-semibold mb-3 theme-transition ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>Recent Folders</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFolders.map(folder => (
              <FolderCard key={folder.id} folder={folder} darkMode={darkMode} />
            ))}
            <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center hover:border-purple-500 transition-all duration-200 shadow-sm theme-transition ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-600' 
                : 'bg-white/80 border-gray-300'
            }`}>
              <svg className={`w-8 h-8 mb-2 theme-transition ${
                darkMode ? 'text-purple-400' : 'text-purple-500'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className={`font-medium theme-transition ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>New Folder</span>
            </div>
          </div>
        </div>
      )}

      {filteredNotes.length === 0 && (activeCategory === 'all' || activeCategory === 'notes') && (
        <div className="text-center py-12">
          <svg className={`w-12 h-12 mx-auto mb-2 theme-transition ${
            darkMode ? 'text-gray-400' : 'text-gray-300'
          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className={`text-lg font-medium mb-1 theme-transition ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>No notes found</h3>
          <p className={`text-sm theme-transition ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>Try changing your search or create a new note</p>
        </div>
      )}
    </main>
  );
};

export default MainContent;