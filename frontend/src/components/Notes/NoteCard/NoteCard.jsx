import React from 'react';

const NoteCard = ({ note, onClick, darkMode = true }) => {
  const getNoteColor = () => {
    // Prefer explicit color saved on the note
    if (note && note.color) {
      return note.color;
    }
    const colors = [
      { light: 'from-red-100 to-pink-200', dark: 'from-red-600/20 to-pink-600/30' },
      { light: 'from-blue-100 to-indigo-200', dark: 'from-blue-600/20 to-indigo-600/30' },
      { light: 'from-green-100 to-emerald-200', dark: 'from-green-600/20 to-emerald-600/30' },
      { light: 'from-purple-100 to-violet-200', dark: 'from-purple-600/20 to-violet-600/30' },
      { light: 'from-yellow-100 to-amber-200', dark: 'from-yellow-600/20 to-amber-600/30' },
      { light: 'from-orange-100 to-rose-200', dark: 'from-orange-600/20 to-rose-600/30' },
      { light: 'from-cyan-100 to-teal-200', dark: 'from-cyan-600/20 to-teal-600/30' },
      { light: 'from-lime-100 to-emerald-200', dark: 'from-lime-600/20 to-emerald-600/30' }
    ];
    const index = note._id ? parseInt(note._id.slice(-2), 16) % colors.length : 0;
    return darkMode ? colors[index].dark : colors[index].light;
  };


  const renderTodoPreview = () => {
    if (note.type === 'todo' && note.content) {
      try {
        const tasks = JSON.parse(note.content);
        const completedCount = tasks.filter(task => task.completed).length;
        return (
          <div className="mb-2">
            <div className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {completedCount} of {tasks.length} tasks completed
            </div>
            <div className="space-y-1">
              {tasks.slice(0, 3).map((task, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded border flex items-center justify-center ${
                    task.completed
                      ? 'bg-green-500 border-green-500'
                      : darkMode
                      ? 'border-gray-400'
                      : 'border-gray-500'
                  }`}>
                    {task.completed && (
                      <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-xs truncate ${task.completed ? 'line-through opacity-60' : ''} ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {task.text}
                  </span>
                </div>
              ))}
              {tasks.length > 3 && (
                <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  +{tasks.length - 3} more tasks...
                </div>
              )}
            </div>
          </div>
        );
      } catch (e) {
        return null;
      }
    }
    return null;
  };


  const renderCodePreview = () => {
    if (note.type === 'code') {
      return (
        <div className={`font-mono text-xs p-2 rounded mb-2 ${darkMode ? 'bg-gray-700 text-green-400' : 'bg-gray-100 text-green-600'}`}>
          <div className="truncate">{note.content?.split('\n')[0] || '// Code snippet'}</div>
          <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {note.content?.split('\n').length || 0} lines of code
          </div>
        </div>
      );
    }
    return null;
  };


  const renderAudioPreview = () => {
    if (note.type === 'audio') {
      return (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🎤</span>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Voice Recording</span>
        </div>
      );
    }
    return null;
  };


  const renderDrawingPreview = () => {
    if (note.type === 'drawing') {
      return (
        <div className="mb-2 text-center">
          <span className="text-lg">🎨</span>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Drawing</div>
        </div>
      );
    }
    return null;
  };


  const getCardBackground = () => {
    const colorGradient = getNoteColor();
    if (darkMode) {
      return `bg-gradient-to-br ${colorGradient} bg-gray-800/70 border-gray-700/50 hover:bg-gray-750/70 hover:border-gray-600/50`;
    } else {
      return `bg-gradient-to-br ${colorGradient} bg-white/90 border-gray-200/50 hover:bg-gray-50/90 hover:border-gray-300/50`;
    }
  };

  return (
    <div
      className={`rounded-xl p-4 shadow-sm border transition-all duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer theme-transition ${getCardBackground()}`}
      onClick={() => onClick(note)}
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


      <div className="absolute top-2 left-2">
        {note.type === 'todo' && '✅'}
        {note.type === 'code' && '💻'}
        {note.type === 'audio' && '🎤'}
        {note.type === 'drawing' && '🎨'}
        {(!note.type || note.type === 'text') && '📝'}
      </div>
      

      <div className="flex justify-between items-start mb-2">
        <h3 className={`font-semibold text-sm truncate pr-6 theme-transition ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {note.title || 'Untitled Note'}
        </h3>
      </div>
      

      {renderTodoPreview()}
      {renderCodePreview()}
      {renderAudioPreview()}
      {renderDrawingPreview()}
      

      {(!note.type || note.type === 'text') && note.content && (
        <div
          className={`text-xs mb-3 line-clamp-3 leading-relaxed theme-transition ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
      )}
      

      <div className={`flex items-center justify-between text-xs theme-transition ${
        darkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <span>
          {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'Unknown date'}
        </span>
        {note.reminder?.isActive && (
          <span className="flex items-center gap-1">
            ⏰
          </span>
        )}
      </div>

 
      {note.folder && (
        <div className={`mt-2 inline-block px-2 py-1 rounded-full text-xs theme-transition ${
          darkMode 
            ? 'bg-purple-900/50 text-purple-300' 
            : 'bg-purple-100 text-purple-700'
        }`}>
          {note.folder}
        </div>
      )}

    
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