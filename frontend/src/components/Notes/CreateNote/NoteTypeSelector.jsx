import React from 'react';

const NoteTypeSelector = ({ noteTypes, selectedType, onTypeSelect, darkMode }) => {
  return (
    <div className="p-6">
      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Choose Note Type
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {noteTypes.map((noteType) => (
          <button
            key={noteType.type}
            onClick={() => onTypeSelect(noteType.type)}
            className={`p-4 rounded-xl text-left transition-all duration-200 transform hover:scale-105 ${
              selectedType === noteType.type
                ? `bg-gradient-to-r ${noteType.color} text-white shadow-lg scale-105`
                : darkMode
                ? 'bg-gray-700/50 text-gray-200 hover:bg-gray-600/50'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="text-2xl mb-2">{noteType.icon}</div>
            <h3 className="font-semibold text-sm mb-1">{noteType.label}</h3>
            <p className="text-xs opacity-80">{noteType.description}</p>
          </button>
        ))}
      </div>
      
      {/* Accessibility Features */}
      <div className={`mt-6 p-4 rounded-xl ${
        darkMode ? 'bg-gray-700/30' : 'bg-gray-100'
      }`}>
        <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Accessibility Features
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className={`p-1 rounded ${darkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>♿</span>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Screen Reader</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`p-1 rounded ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>🔍</span>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>High Contrast</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`p-1 rounded ${darkMode ? 'bg-purple-900/30' : 'bg-purple-100'}`}>🔊</span>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Voice Control</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`p-1 rounded ${darkMode ? 'bg-yellow-900/30' : 'bg-yellow-100'}`}>⌨️</span>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Keyboard Nav</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteTypeSelector;