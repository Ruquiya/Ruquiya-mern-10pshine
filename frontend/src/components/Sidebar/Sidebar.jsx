import React from 'react';
import { FaBook, FaFileAlt, FaFolder, FaCalendar, FaStar, FaArchive, FaTrash, FaPlus, FaFileExport, FaCog, FaLightbulb } from 'react-icons/fa';

const Sidebar = ({ 
  activeCategory, 
  setActiveCategory, 
  isOpen, 
  darkMode, 
  notes = [], 
  folders = [],
  onExportNotes,
  onOpenSettings,
  onCreateFolder,
  onClose
}) => {
  const totalNotes = notes.length;
  const importantNotes = notes.filter(note => note.important).length;
  const pinnedNotes = notes.filter(note => note.pinned).length;
  const totalFolders = folders.length;

  const categories = [
    { id: 'all', label: 'All Notes', icon: <FaBook />, count: totalNotes },
    { id: 'notes', label: 'Notes', icon: <FaFileAlt />, count: totalNotes },
    { id: 'folders', label: 'Folders', icon: <FaFolder />, count: totalFolders },
    { id: 'calendar', label: 'Calendar', icon: <FaCalendar />, count: 0 },
    { id: 'important', label: 'Important', icon: <FaStar />, count: importantNotes },
    { id: 'pinned', label: 'Pinned', icon: <FaLightbulb />, count: pinnedNotes },
    { id: 'trash', label: 'Trash', icon: <FaTrash />, count: 0 }
  ];


  const handleExportNotes = () => {
    if (onExportNotes) {
      onExportNotes();
    } else {

      const data = {
        notes: notes,
        folders: folders,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `notes-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };


  const handleOpenSettings = () => {
    if (onOpenSettings) {
      onOpenSettings();
    } else {

      alert('Settings panel would open here');
    }
  };


  const handleCreateFolder = () => {
    if (onCreateFolder) {
      onCreateFolder();
    } else {

      const folderName = prompt('Enter folder name:');
      if (folderName) {
        console.log('Creating folder:', folderName);

      }
    }
  };

  if (!isOpen) return null;

  return (
    <aside
      className={`fixed lg:relative w-64 h-full z-50 theme-transition overflow-y-auto border-r ${
        darkMode
          ? 'bg-gray-800/95 border-white/10 backdrop-blur-sm'
          : 'bg-white/95 border-gray-200 backdrop-blur-sm'
      }`}
    >
      {/* Mobile Close Button */}
      <div className="lg:hidden flex justify-end p-4">
        <button
          onClick={onClose}
          className={`p-2 rounded-lg transition-all ${
            darkMode 
              ? 'text-gray-300 hover:bg-gray-700' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-4">
        {/* Categories */}
        <nav className="mb-6">
          <h3 className={`text-sm font-semibold mb-3 uppercase tracking-wider theme-transition ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Categories
          </h3>
          <ul className="space-y-1">
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 theme-transition ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30'
                      : darkMode
                      ? 'hover:bg-gray-700/50 border border-transparent'
                      : 'hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-lg theme-transition ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>{category.icon}</span>
                    <span className={`font-medium text-sm theme-transition ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {category.label}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded theme-transition ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {category.count}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Folders */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-sm font-semibold uppercase tracking-wider theme-transition ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Folders
            </h3>
            <button 
              onClick={handleCreateFolder}
              className={`p-1 rounded theme-transition ${
                darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
              }`}
              title="Create New Folder"
            >
              <FaPlus />
            </button>
          </div>
          <ul className="space-y-2">
            {folders.map((folder, index) => (
              <li key={folder.id || folder._id || index}>
                <button className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 theme-transition ${
                  darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${folder.color || 'from-gray-500 to-gray-600'}`}></div>
                    <span className={`text-sm theme-transition ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {folder.name}
                    </span>
                  </div>
                  <span className={`text-xs px-1.5 py-0.5 rounded theme-transition ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {folder.noteCount || 0}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Actions */}
        <div className={`p-4 rounded-lg theme-transition ${
          darkMode ? 'bg-gray-700/30' : 'bg-gray-100'
        }`}>
          <h4 className={`font-semibold mb-2 text-sm theme-transition ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Quick Actions
          </h4>
          <div className="space-y-2">
            <button 
              onClick={() => alert('Quick Note feature would open here')}
              className={`w-full flex items-center gap-2 text-left p-2 rounded text-sm transition-all theme-transition ${
                darkMode ? 'text-cyan-400 hover:bg-cyan-900/20' : 'text-cyan-600 hover:bg-cyan-100'
              }`}
            >
              <FaFileAlt />
              Quick Note
            </button>
            <button 
              onClick={handleExportNotes}
              className={`w-full flex items-center gap-2 text-left p-2 rounded text-sm transition-all theme-transition ${
                darkMode ? 'text-green-400 hover:bg-green-900/20' : 'text-green-600 hover:bg-green-100'
              }`}
            >
              <FaFileExport />
              Export All
            </button>
            <button 
              onClick={handleOpenSettings}
              className={`w-full flex items-center gap-2 text-left p-2 rounded text-sm transition-all theme-transition ${
                darkMode ? 'text-purple-400 hover:bg-purple-900/20' : 'text-purple-600 hover:bg-purple-100'
              }`}
            >
              <FaCog />
              Settings
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;