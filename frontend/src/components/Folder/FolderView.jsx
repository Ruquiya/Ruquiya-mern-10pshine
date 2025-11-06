import React, { useMemo } from 'react';
import NoteCard from '../Notes/NoteCard/NoteCard';

const FolderView = ({ folder, notes = [], darkMode, onBack, onOpenNote, onEditFolder, onDeleteFolder }) => {
  const folderNotes = useMemo(() => {
    if (!folder || !folder.notes) return [];
    
    return folder.notes.map(folderNote => {
      const fullNote = notes.find(note => note._id === folderNote._id);
      return fullNote || folderNote; 
    });
  }, [notes, folder]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            darkMode 
              ? 'text-cyan-400 hover:text-cyan-300 bg-gray-800 hover:bg-gray-700' 
              : 'text-cyan-600 hover:text-cyan-700 bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Folders
        </button>
        
        <div className="flex items-center gap-3">
          <div className={`text-sm px-3 py-1 rounded-full ${
            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
          }`}>
            {folderNotes.length} {folderNotes.length === 1 ? 'note' : 'notes'}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => onEditFolder?.(folder)}
              className={`p-2 rounded-lg transition-all ${
                darkMode 
                  ? 'text-gray-400 hover:text-cyan-400 hover:bg-gray-700' 
                  : 'text-gray-500 hover:text-cyan-600 hover:bg-gray-100'
              }`}
              title="Edit Folder"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            
            <button
              onClick={() => onDeleteFolder?.(folder._id)}
              className={`p-2 rounded-lg transition-all ${
                darkMode 
                  ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' 
                  : 'text-gray-500 hover:text-red-600 hover:bg-gray-100'
              }`}
              title="Delete Folder"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Folder Info */}
      <div className={`rounded-2xl p-6 bg-gradient-to-br ${folder.color} shadow-lg`}>
        <div className="flex items-center gap-4">
          <div className="text-4xl">📁</div>
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {folder?.name || 'Folder'}
            </h1>
            <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Created on {folder?.date || 'Unknown date'} • {folderNotes.length} notes
            </p>
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      {folderNotes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {folderNotes.map(note => (
            <NoteCard
              key={note._id || note.id}
              note={note}
              darkMode={darkMode}
              onClick={() => onOpenNote(note)}
            />
          ))}
        </div>
      ) : (
        <div className={`text-center py-12 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
          <div className="text-6xl mb-4">📝</div>
          <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            No notes in this folder
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Add notes to this folder to see them here
          </p>
        </div>
      )}
    </div>
  );
};

export default FolderView;









