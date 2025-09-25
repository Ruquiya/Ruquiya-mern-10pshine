// FolderCard.jsx
import React from 'react';

const FolderCard = ({ folder, darkMode = true }) => {
  return (
    <div
      className={`bg-gradient-to-br rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer relative group backdrop-blur-sm theme-transition ${
        folder.color
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className={`text-base font-semibold theme-transition ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>{folder.name}</h3>
        <button className={`p-1 rounded-lg transition-all duration-200 theme-transition ${
          darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
        }`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </button>
      </div>
      <p className={`text-sm line-clamp-3 mb-3 theme-transition ${
        darkMode ? 'text-gray-200' : 'text-gray-600'
      }`}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      <div className={`text-xs theme-transition ${
        darkMode ? 'text-gray-300' : 'text-gray-500'
      }`}>{folder.date}</div>
    </div>
  );
};

export default FolderCard;