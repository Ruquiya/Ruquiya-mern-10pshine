import React from 'react';

const FolderCard = ({ folder, darkMode, onEdit, onDelete, onClick, isSelected }) => {
  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit?.(folder);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.(folder._id);
  };

  const getCardBackground = () => {
    if (darkMode) {
      return 'bg-gray-800 border-gray-700 hover:bg-gray-750';
    } else {
      return 'bg-white border-gray-200 hover:bg-gray-50';
    }
  };

  const getFolderContentBackground = () => {
    if (folder.color) {
      return darkMode 
        ? folder.color.replace(/from-([^/]+)\/50/g, 'from-$1/30').replace(/to-([^/]+)\/50/g, 'to-$1/30')
        : folder.color;
    }
    return darkMode 
      ? 'from-purple-800/30 to-purple-700/30' 
      : 'from-purple-100/50 to-purple-200/50';
  };

  return (
    <div
      onClick={() => onClick?.(folder)}
      className={`relative rounded-xl p-4 cursor-pointer transition-all duration-200 border shadow-sm hover:shadow-md ${
        isSelected 
          ? 'ring-2 ring-cyan-500 ring-offset-2' 
          : 'hover:scale-[1.02]'
      } theme-transition ${getCardBackground()}`}
    >
      {/* Folder Header */}
      <div className="flex items-center justify-between mb-3">
        <div className={`text-2xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          📁
        </div>
        <div className="flex gap-1">
          <button
            onClick={handleEdit}
            className={`p-1 rounded transition-all ${
              darkMode 
                ? 'text-gray-400 hover:text-cyan-400 hover:bg-gray-700' 
                : 'text-gray-500 hover:text-cyan-600 hover:bg-gray-100'
            }`}
            title="Edit Folder"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className={`p-1 rounded transition-all ${
              darkMode 
                ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' 
                : 'text-gray-500 hover:text-red-600 hover:bg-gray-100'
            }`}
            title="Delete Folder"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Folder Content */}
      <div className={`bg-gradient-to-br rounded-lg p-3 ${getFolderContentBackground()}`}>
        <h3 className={`font-semibold text-sm mb-1 truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {folder.name}
        </h3>
        <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {folder.noteCount || 0} notes
        </div>
      </div>

      {/* Folder Footer */}
      <div className="mt-2 flex justify-between items-center">
        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {folder.createdAt ? new Date(folder.createdAt).toLocaleDateString() : 'Unknown date'}
        </span>
        <div className={`text-xs px-2 py-1 rounded-full ${
          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
        }`}>
          {Math.floor((folder.usedSize || 0) / 1024)}KB / {Math.floor((folder.totalSize || 10485760) / 1024)}KB
        </div>
      </div>
    </div>
  );
};

export default FolderCard;