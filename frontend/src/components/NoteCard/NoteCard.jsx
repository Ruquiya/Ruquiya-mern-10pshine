// NoteCard.jsx
import React from 'react';

const NoteCard = ({ note, onClick, darkMode = true }) => {
  return (
    <div
      className={`bg-gradient-to-br rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer relative group backdrop-blur-sm theme-transition ${
        note.color
      }`}
      onClick={onClick}
    >
      {note.pinned && (
        <div className={`absolute top-2 right-2 p-1 rounded-lg theme-transition ${
          darkMode ? 'text-cyan-400 bg-cyan-900/30' : 'text-cyan-600 bg-cyan-100'
        }`}>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 12V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v8l-2 2v1h4.97v5l1 1 1-1v-5H18v-1l-2-2z" />
          </svg>
        </div>
      )}
      
      <div className="flex justify-between items-start mb-2">
        <h3 className={`text-base font-semibold pr-6 theme-transition ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>{note.title}</h3>
        <button className={`p-1 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 theme-transition ${
          darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
        }`}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </button>
      </div>
      
      <p className={`text-sm line-clamp-3 mb-3 leading-relaxed theme-transition ${
        darkMode ? 'text-gray-200' : 'text-gray-600'
      }`}>{note.content}</p>
      
      <div className="flex justify-between items-center text-xs">
        <span className={`px-2 py-1 rounded-md font-medium theme-transition ${
          darkMode ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'
        }`}>{note.date}</span>
        <div className="flex gap-1">
          {note.tags.map(tag => (
            <span key={tag} className={`px-1.5 py-0.5 rounded theme-transition ${
              darkMode ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}>#{tag}</span>
          ))}
        </div>
      </div>
      
      {note.important && (
        <div className={`absolute bottom-2 right-2 p-1 rounded-lg theme-transition ${
          darkMode ? 'text-purple-400 bg-purple-900/30' : 'text-purple-600 bg-purple-100'
        }`}>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default NoteCard;