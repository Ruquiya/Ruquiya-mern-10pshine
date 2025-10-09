import React from 'react';
const NoteTemplates = ({ onTemplateSelect, darkMode }) => {
  const templates = [
    {
      name: 'Meeting Notes',
      icon: '👥',
      content: 'Meeting Agenda:\n\nAttendees:\n- \n- \n\nDiscussion Points:\n1. \n2. \n\nAction Items:\n- [ ] \n- [ ]',
      tags: ['meeting', 'work'],
      color: 'from-blue-900/50 to-blue-800/50'
    },
    {
      name: 'Shopping List',
      icon: '🛒',
      content: JSON.stringify([
        { id: 1, text: 'Milk', completed: false },
        { id: 2, text: 'Eggs', completed: false },
        { id: 3, text: 'Bread', completed: true }
      ]),
      type: 'todo',
      tags: ['shopping', 'personal'],
      color: 'from-green-900/50 to-green-800/50'
    },
    {
      name: 'Daily Journal',
      icon: '📔',
      content: '## Today\\s Highlights\\n\\n### Gratitude\\n- \\n- \\n\\n### Goals for Tomorrow\\n- [ ] \\n- [ ]',
      tags: ['journal', 'personal'],
      color: 'from-purple-900/50 to-purple-800/50'
    }
  ];

  return (
    <div className={`p-4 rounded-xl ${
      darkMode ? 'bg-gray-700/50' : 'bg-gray-100'
    }`}>
      <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Quick Templates
      </h3>
      <div className="space-y-2">
        {templates.map((template, index) => (
          <button
            key={index}
            onClick={() => onTemplateSelect(template)}
            className={`w-full text-left p-3 rounded-lg transition-all hover:scale-105 ${
              darkMode 
                ? 'bg-gray-600/30 hover:bg-gray-600/50' 
                : 'bg-white hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{template.icon}</span>
              <span className={`font-medium text-sm ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {template.name}
              </span>
            </div>
            <div className={`text-xs ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {template.tags.map(tag => `#${tag}`).join(' ')}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NoteTemplates;