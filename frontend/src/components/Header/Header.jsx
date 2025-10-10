import React, { useState, useRef, useEffect } from 'react';

const Header = ({ 
  searchTerm, 
  setSearchTerm, 
  sidebarOpen, 
  setSidebarOpen, 
  darkMode, 
  setDarkMode, 
  onCreateNote,
  onEditProfile 
}) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('savedEmail');
    localStorage.removeItem('rememberMe');
    window.location.href = '/';
  };

  const handleEditProfile = () => {
    setShowProfileDropdown(false);
    if (onEditProfile) {
      onEditProfile();
    }
  };

  const getUserInitial = () => {
    if (user && user.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className={`border-b theme-transition relative z-50 ${
      darkMode 
        ? 'bg-gray-800/90 border-white/10 backdrop-blur-sm' 
        : 'bg-white/90 border-gray-200 backdrop-blur-sm'
    }`}>
      <div className="flex items-center justify-between p-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-lg transition-all duration-200 theme-transition ${
              darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className={`text-lg font-semibold theme-transition ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            NotesApp
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notes..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg border theme-transition ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-cyan-400'
              }`}
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 theme-transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Create Note Button */}
          <button 
            onClick={onCreateNote}
            className={`p-2 rounded-lg relative transition-all duration-200 hover:scale-105 ${
              darkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title="Create New Note"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg transition-all duration-200 theme-transition ${
              darkMode ? 'text-yellow-400 hover:bg-yellow-900/20' : 'text-gray-600 hover:bg-gray-100'
            }`}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* User Avatar with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold theme-transition hover:scale-105 transition-transform ${
                darkMode ? 'bg-cyan-500 text-white hover:bg-cyan-600' : 'bg-cyan-100 text-cyan-600 hover:bg-cyan-200'
              }`}
              title="User Profile"
            >
              {getUserInitial()}
            </button>

            {/* Profile Dropdown */}
            {showProfileDropdown && (
              <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-[100] ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                {/* User Info */}
                {user && (
                  <div className={`px-4 py-3 border-b ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <p className={`text-sm font-medium ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {user.name}
                    </p>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {user.email}
                    </p>
                  </div>
                )}
                
                <div className="py-1">
                  <button
                    onClick={handleEditProfile}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      darkMode 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Edit Profile
                    </div>
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      darkMode 
                        ? 'text-red-400 hover:bg-gray-700' 
                        : 'text-red-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;