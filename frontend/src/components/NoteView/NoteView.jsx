// NoteView.jsx
import React from 'react';
import Calendar from '../Calendar/Calendar';

const NoteView = ({ note, onBack, darkMode = true }) => {
  const calendarEvents = [
    { date: 15, title: note.title, type: 'important' },
    { date: 15, title: 'Related meeting', type: 'note' },
  ];

  return (
    <div className={`p-6 theme-transition ${
      darkMode ? 'bg-gradient-to-br from-gray-900 to-indigo-900' : 'bg-gradient-to-br from-gray-50 to-blue-50'
    }`}>
      <button onClick={onBack} className={`flex items-center mb-4 transition-all duration-200 theme-transition ${
        darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'
      }`}>
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className={`rounded-xl p-6 shadow-lg mb-6 theme-transition ${
            darkMode ? 'bg-gray-800/50' : 'bg-white'
          }`}>
            <h1 className={`text-2xl font-bold mb-4 theme-transition ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>{note.title}</h1>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {note.tags.map(tag => (
                <span key={tag} className={`px-3 py-1 rounded-full text-xs font-medium theme-transition ${
                  darkMode ? 'bg-cyan-900/30 text-cyan-300' : 'bg-cyan-100 text-cyan-700'
                }`}>#{tag}</span>
              ))}
            </div>
            
            <p className={`leading-relaxed theme-transition ${
              darkMode ? 'text-gray-200' : 'text-gray-600'
            }`}>{note.content} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl shadow-lg theme-transition ${
              darkMode ? 'bg-gray-800/50' : 'bg-white'
            }`}>
              <h3 className={`font-semibold mb-2 theme-transition ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>Markdown Support</h3>
              <p className={`text-sm theme-transition ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Edit your note with markdown formatting.</p>
            </div>
            <div className={`p-4 rounded-xl shadow-lg theme-transition ${
              darkMode ? 'bg-gray-800/50' : 'bg-white'
            }`}>
              <h3 className={`font-semibold mb-2 theme-transition ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>Backlog</h3>
              <ul className={`text-sm list-disc pl-4 theme-transition ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <li>Task 1</li>
                <li>Task 2</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <Calendar darkMode={darkMode} events={calendarEvents} />
          
          <div className="space-y-3">
            <div className={`p-4 rounded-xl shadow-lg theme-transition ${
              darkMode ? 'bg-gray-800/50' : 'bg-white'
            }`}>
              <h4 className={`font-semibold mb-1 theme-transition ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>Google Drive</h4>
              <p className={`text-sm theme-transition ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Integrate with Google Drive</p>
            </div>
            <div className={`p-4 rounded-xl shadow-lg theme-transition ${
              darkMode ? 'bg-gray-800/50' : 'bg-white'
            }`}>
              <h4 className={`font-semibold mb-1 theme-transition ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>Twilio Integration</h4>
              <p className={`text-sm theme-transition ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Send SMS reminders</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteView;