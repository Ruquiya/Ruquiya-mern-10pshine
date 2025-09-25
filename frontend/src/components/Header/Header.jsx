// Header.jsx
import React from 'react';

const Header = ({ searchTerm, setSearchTerm, sidebarOpen, setSidebarOpen, darkMode, setDarkMode }) => {
  return (
    <header className={`sticky top-0 z-50 theme-transition ${
      darkMode 
        ? 'bg-gray-800/80 backdrop-blur-md border-b border-white/10' 
        : 'bg-white/80 backdrop-blur-md border-b border-gray-200'
    } px-6 py-3 flex items-center justify-between shadow-sm`}>
      <div className="flex items-center gap-3">
        <button
          className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
            darkMode 
              ? 'text-gray-300 hover:text-white' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div className="relative flex-1 max-w-md">
          <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 theme-transition ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search notes, folders, tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border-0 rounded-lg focus:ring-1 focus:ring-cyan-500 text-sm outline-none transition-all duration-200 theme-transition ${
              darkMode 
                ? 'bg-gray-700/50 text-white placeholder-gray-400 focus:bg-gray-600/50' 
                : 'bg-gray-100 text-gray-900 placeholder-gray-500 focus:bg-white shadow-sm'
            }`}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
            darkMode 
              ? 'text-yellow-400 hover:text-yellow-300' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM12 15a3 3 0 100-6 3 3 0 000 6zm0-1.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM12 19.5a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V20.25a.75.75 0 01.75-.75zM4.5 12a.75.75 0 01-.75.75H1.5a.75.75 0 010-1.5h2.25a.75.75 0 01.75.75zm16.5 0a.75.75 0 01-.75.75H20.25a.75.75 0 010-1.5H22.5a.75.75 0 01.75.75zM6.343 6.343a.75.75 0 011.061 0l1.5 1.5a.75.75 0 01-1.061 1.061l-1.5-1.5a.75.75 0 010-1.061zm12.728 12.728a.75.75 0 011.061 0l1.5 1.5a.75.75 0 01-1.061 1.061l-1.5-1.5a.75.75 0 010-1.061zM18 12a6 6 0 11-12 0 6 6 0 0112 0z"/>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/>
            </svg>
          )}
        </button>

        <button className={`p-2 rounded-lg relative transition-all duration-200 hover:scale-105 ${
          darkMode 
            ? 'text-gray-300 hover:text-white' 
            : 'text-gray-600 hover:text-gray-900'
        }`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-4.66-6.24M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className={`absolute -top-1 -right-1 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center ${
            darkMode ? 'bg-gradient-to-r from-cyan-500 to-purple-600' : 'bg-gradient-to-r from-cyan-400 to-purple-500'
          }`}>3</span>
        </button>

        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
          alt="Profile"
          className={`w-8 h-8 rounded-lg border shadow-sm transition-all duration-200 hover:scale-105 ${
            darkMode ? 'border-white/20' : 'border-gray-200'
          }`}
        />
      </div>
    </header>
  );
};

export default Header;