// NotesListPanel.jsx
import React from 'react';

const NotesListPanel = ({ notes, selectedNote, setSelectedNote, darkMode }) => {
  return (
    <aside
      className={`w-64 theme-transition overflow-y-auto border-r ${
        darkMode
          ? 'bg-gray-800/90 border-white/10'
          : 'bg-white border-gray-200'
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
              <h4
                className={`font-medium text-sm mb-1 theme-transition ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                {note.title}
              </h4>
              <p
                className={`text-xs line-clamp-1 mb-1 theme-transition ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {note.content}
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
        <button className={`fixed bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full shadow-lg transition-all duration-200 hover:scale-110 ${
          darkMode ? 'bg-cyan-500 hover:bg-cyan-600' : 'bg-cyan-600 hover:bg-cyan-700'
        } text-white`}>
          +
        </button>
      </div>
    </aside>
  );
};

export default NotesListPanel;