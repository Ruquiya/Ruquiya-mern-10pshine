// Sidebar.jsx
import React from 'react';

const Sidebar = ({ activeCategory, setActiveCategory, isOpen, darkMode }) => {
  const categories = [
    { id: 'all', label: 'All', icon: '🌐', color: 'text-cyan-400' },
    { id: 'notes', label: 'Notes', icon: '📝', color: 'text-blue-400' },
    { id: 'folders', label: 'Folders', icon: '📁', color: 'text-purple-400' },
    { id: 'calendar', label: 'Calendar', icon: '📅', color: 'text-emerald-400' },
  ];

  const folders = [
    { name: 'Personal', items: ['Movie Review', 'My Notes', 'Book Lists'] },
    { name: 'Work', items: ['Mid test exam', 'Class Notes', 'January notes'] },
  ];

  return (
    <aside className={`theme-transition overflow-y-auto ${
      isOpen ? 'w-20 lg:w-64' : 'w-0'
    } ${
      darkMode 
        ? 'bg-gray-800/90 border-r border-white/10' 
        : 'bg-white border-r border-gray-200'
    }`}>
      <div className="p-4">
        <div className={`flex items-center gap-3 mb-6 p-3 rounded-xl theme-transition ${
          darkMode 
            ? 'bg-gray-700/50' 
            : 'bg-gray-100'
        } ${isOpen ? 'flex-row' : 'justify-center'}`}>
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
            alt="Profile"
            className="w-8 h-8 rounded-xl border shadow-sm"
          />
          {isOpen && (
            <div className="lg:block hidden">
              <h3 className={`font-semibold text-sm theme-transition ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>John Doe</h3>
              <p className={`text-xs theme-transition ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Premium</p>
            </div>
          )}
        </div>

        <nav className="space-y-1 mb-6">
          {categories.map(item => (
            <button
              key={item.id}
              className={`flex items-center w-full p-3 rounded-lg text-sm font-medium transition-all duration-200 theme-transition group ${
                activeCategory === item.id
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md'
                  : darkMode
                    ? 'text-gray-300 hover:text-cyan-300'
                    : 'text-gray-600 hover:text-cyan-500'
              } ${isOpen ? 'justify-start gap-3' : 'justify-center'}`}
              onClick={() => setActiveCategory(item.id)}
              title={item.label}
            >
              <span className={`text-xl ${item.color}`}>{item.icon}</span>
              {isOpen && (
                <>
                  <span className="font-semibold lg:block hidden">{item.label}</span>
                  {activeCategory === item.id && (
                    <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full lg:block hidden" />
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {isOpen && (
          <div className="lg:block hidden">
            {folders.map((group, index) => (
              <div key={index} className="mb-4">
                <h3 className={`text-xs font-semibold uppercase px-2 mb-2 tracking-wider theme-transition ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>{group.name}</h3>
                <div className="space-y-1">
                  {group.items.map((item, i) => (
                    <button
                      key={i}
                      className={`flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded transition-all duration-200 theme-transition ${
                        darkMode
                          ? 'text-gray-300 hover:text-cyan-300'
                          : 'text-gray-600 hover:text-cyan-500'
                      }`}
                    >
                      <span className="text-lg">📁</span>
                      <span className="truncate">{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;