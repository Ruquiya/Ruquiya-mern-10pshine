import React from 'react';

const NotesListPanel = ({ notes, selectedNote, setSelectedNote, darkMode }) => {
  return (
    <aside
      className={`w-64 theme-transition overflow-y-auto border-r ${
        darkMode
          ? 'bg-gray-800/90 border-white/10 backdrop-blur-sm'
          : 'bg-white/90 border-gray-200 backdrop-blur-sm'
      }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3
            className={`text-base font-semibold theme-transition ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            All Notes
          </h3>
          <button
            className={`text-sm theme-transition ${
              darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ▾
          </button>
        </div>
        <div className="space-y-1">
          {notes.map((note) => (
            <button
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 theme-transition ${
                selectedNote?.id === note.id
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30'
                  : darkMode
                  ? 'hover:bg-gray-700/50 border border-transparent'
                  : 'hover:bg-gray-100 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {note.type === 'todo' && '✅'}
                {note.type === 'code' && '💻'}
                {note.type === 'audio' && '🎤'}
                {note.type === 'drawing' && '🎨'}
                <h4
                  className={`font-medium text-sm theme-transition ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {note.title}
                </h4>
              </div>
              <p
                className={`text-xs line-clamp-1 mb-1 theme-transition ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {note.type === 'todo' ? 'Todo List' : 
                 note.type === 'code' ? 'Code Snippet' :
                 note.type === 'audio' ? 'Voice Recording' :
                 note.type === 'drawing' ? 'Drawing' : note.content}
              </p>
              <div
                className={`flex items-center text-xs theme-transition ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {note.date}
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default NotesListPanel;