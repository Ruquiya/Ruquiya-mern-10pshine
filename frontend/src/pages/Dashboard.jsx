import React, { useState, useEffect } from 'react';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import MainContent from '../components/MainContent/MainContent';

const Dashboard = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [createNoteModal, setCreateNoteModal] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .theme-transition * {
        transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
      }
      .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className={`min-h-screen theme-transition ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 to-indigo-900 text-white' 
        : 'bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900'
    }`}>
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onCreateNote={() => setCreateNoteModal(true)}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          isOpen={sidebarOpen}
          darkMode={darkMode}
        />
        <MainContent
          activeCategory={activeCategory}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          searchTerm={searchTerm}
          selectedNote={selectedNote}
          setSelectedNote={setSelectedNote}
          darkMode={darkMode}
          sidebarOpen={sidebarOpen}
          onCreateNote={() => setCreateNoteModal(true)}
        />
      </div>

      {/* Create Note Modal */}
      {createNoteModal && (
        <CreateNoteModal 
          darkMode={darkMode} 
          onClose={() => setCreateNoteModal(false)} 
        />
      )}
    </div>
  );
};

// Create Note Modal Component
const CreateNoteModal = ({ darkMode, onClose }) => {
  const [selectedType, setSelectedType] = useState('text');

  const noteTypes = [
    { 
      type: 'text', 
      label: 'Text Note', 
      icon: '📝',
      description: 'Simple text note with formatting',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      type: 'todo', 
      label: 'To-Do List', 
      icon: '✅',
      description: 'Checklist with tasks',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      type: 'code', 
      label: 'Code Snippet', 
      icon: '💻',
      description: 'Code with syntax highlighting',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      type: 'drawing', 
      label: 'Drawing', 
      icon: '🎨',
      description: 'Sketch and draw',
      color: 'from-orange-500 to-red-500'
    },
    { 
      type: 'audio', 
      label: 'Voice Note', 
      icon: '🎤',
      description: 'Record audio notes',
      color: 'from-indigo-500 to-purple-500'
    },
    { 
      type: 'link', 
      label: 'Web Link', 
      icon: '🔗',
      description: 'Save and organize links',
      color: 'from-cyan-500 to-blue-500'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`relative rounded-2xl shadow-2xl max-w-2xl w-full mx-4 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Create New Note
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

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {noteTypes.map((noteType) => (
              <button
                key={noteType.type}
                onClick={() => setSelectedType(noteType.type)}
                className={`p-4 rounded-xl text-left transition-all duration-200 transform hover:scale-105 ${
                  selectedType === noteType.type
                    ? `bg-gradient-to-r ${noteType.color} text-white shadow-lg`
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

          {/* Preview based on selected type */}
          <div className={`p-4 rounded-xl mb-6 ${
            darkMode ? 'bg-gray-700/30' : 'bg-gray-100'
          }`}>
            <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Preview - {noteTypes.find(t => t.type === selectedType)?.label}
            </h3>
            {selectedType === 'todo' ? (
              <div className="space-y-2">
                {['Task 1', 'Task 2', 'Task 3'].map((task, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      darkMode ? 'border-gray-400' : 'border-gray-500'
                    }`}>
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500`} />
                    </div>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{task}</span>
                  </div>
                ))}
                <div className="flex items-center gap-3 opacity-50">
                  <div className={`w-5 h-5 rounded border-2 ${darkMode ? 'border-gray-600' : 'border-gray-400'}`} />
                  <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>Add new task...</span>
                </div>
              </div>
            ) : (
              <div className={`p-3 rounded-lg ${
                darkMode ? 'bg-gray-600/30 text-gray-300' : 'bg-white text-gray-600'
              }`}>
                Start typing your {selectedType} note here...
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
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
              onClick={() => {
                // Handle note creation
                onClose();
              }}
              className="flex-1 py-3 px-4 rounded-lg font-medium text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              Create Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;