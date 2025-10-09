import React, { useState } from 'react';
import NoteTypeSelector from './NoteTypeSelector';
import TextNoteEditor from './NoteEditor';
import TodoNoteEditor from './TodoNoteEditor';
import CodeNoteEditor from './CodeNoteEditor';
import DrawingCanvas from './DrawingCanvas';
import AudioRecorder from './AudioRecorder';
import NoteTemplates from '../NoteTemplates/NoteTemplates';
import { noteService } from '../../../services/noteService';

const CreateNote = ({ darkMode, onClose, onSave, folders = [] }) => {
  const [selectedType, setSelectedType] = useState('text');
  const [currentStep, setCurrentStep] = useState('type'); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [noteData, setNoteData] = useState({
    title: '',
    content: '',
    type: 'text',
    tags: [],
    folder: 'General',
    color: darkMode ? 'from-blue-900/50 to-blue-800/50' : 'from-blue-100 to-blue-200',
    pinned: false,
    important: false,
    reminder: {
      date: '',
      time: '',
      isActive: false
    },
    collaborators: []
  });

  const noteTypes = [
    { 
      type: 'text', 
      label: 'Text Note', 
      icon: '📝',
      description: 'Rich text with formatting',
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

  const colorOptions = [
    { value: 'from-blue-900/50 to-blue-800/50', label: 'Blue', dark: true, light: 'from-blue-100 to-blue-200' },
    { value: 'from-green-900/50 to-green-800/50', label: 'Green', dark: true, light: 'from-green-100 to-green-200' },
    { value: 'from-purple-900/50 to-purple-800/50', label: 'Purple', dark: true, light: 'from-purple-100 to-purple-200' },
    { value: 'from-yellow-900/50 to-yellow-800/50', label: 'Yellow', dark: true, light: 'from-yellow-100 to-yellow-200' },
    { value: 'from-pink-900/50 to-pink-800/50', label: 'Pink', dark: true, light: 'from-pink-100 to-pink-200' },
    { value: 'from-gray-900/50 to-gray-800/50', label: 'Gray', dark: true, light: 'from-gray-100 to-gray-200' }
  ];

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setNoteData(prev => ({ ...prev, type }));
    setCurrentStep('content');
  };

  const handleContentUpdate = (content) => {
    setNoteData(prev => ({ ...prev, content }));
  };

  const handleSave = async () => {
    if (!noteData.title.trim()) {
      setError('Please add a title to your note');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const reminderData = noteData.reminder.date ? {
        date: noteData.reminder.date,
        time: noteData.reminder.time || '',
        isActive: true
      } : {
        date: null,
        time: null,
        isActive: false
      };

      const finalNote = {
        title: noteData.title.trim(),
        content: noteData.content,
        type: noteData.type,
        tags: noteData.tags,
        folder: noteData.folder,
        color: noteData.color,
        pinned: noteData.pinned,
        important: noteData.important,
        reminder: reminderData
      };

      console.log('💾 Saving note:', finalNote);
      
      const result = await noteService.createNote(finalNote);
      
      console.log('Save response:', result);
      
      if (result.success) {
        onSave(result.data);
        onClose();
      } else {
        setError(result.message || 'Failed to save note');
      }
    } catch (error) {
      console.error(' Error saving note:', error);
      setError(error.message || 'Failed to save note. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderEditor = () => {
    switch (selectedType) {
      case 'text':
        return <TextNoteEditor content={noteData.content} onChange={handleContentUpdate} darkMode={darkMode} />;
      case 'todo':
        return <TodoNoteEditor content={noteData.content} onChange={handleContentUpdate} darkMode={darkMode} />;
      case 'code':
        return <CodeNoteEditor content={noteData.content} onChange={handleContentUpdate} darkMode={darkMode} />;
      case 'drawing':
        return <DrawingCanvas content={noteData.content} onChange={handleContentUpdate} darkMode={darkMode} />;
      case 'audio':
        return <AudioRecorder content={noteData.content} onChange={handleContentUpdate} darkMode={darkMode} />;
      default:
        return <TextNoteEditor content={noteData.content} onChange={handleContentUpdate} darkMode={darkMode} />;
    }
  };

  const handleTagAdd = (tagText) => {
    const tag = tagText.trim();
    if (tag && !noteData.tags.includes(tag)) {
      setNoteData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleTagRemove = (index) => {
    setNoteData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const ScaleIndicator = () => (
    <div className="flex justify-center items-center gap-1 mt-2">
      {['type', 'content', 'details'].map((step, index) => (
        <div
          key={step}
          className={`w-2 h-2 rounded-full transition-all ${
            currentStep === step
              ? 'bg-gradient-to-r from-cyan-500 to-purple-600'
              : darkMode
              ? 'bg-gray-600'
              : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`relative rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`p-6 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex justify-between items-center">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Create New Note
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentStep('type')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  darkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Change Type
              </button>
              <button
                onClick={onClose}
                disabled={isLoading}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                  darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className={`mt-3 p-3 rounded-lg flex items-center gap-2 ${
              darkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-100 text-red-700'
            }`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Step 1: Type Selection */}
          {currentStep === 'type' && (
            <NoteTypeSelector 
              noteTypes={noteTypes}
              selectedType={selectedType}
              onTypeSelect={handleTypeSelect}
              darkMode={darkMode}
            />
          )}

          {/* Step 2: Content Creation */}
          {currentStep === 'content' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  {/* Title Input */}
                  <div className="mb-6">
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Title *
                    </label>
                    <input
                      type="text"
                      value={noteData.title}
                      onChange={(e) => setNoteData(prev => ({ ...prev, title: e.target.value }))}
                      className={`w-full p-3 rounded-lg border transition-all ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-cyan-400'
                      }`}
                      placeholder="Enter note title..."
                    />
                  </div>

                  {/* Content Editor */}
                  {renderEditor()}
                </div>

                <div className="space-y-6">
                  {/* Quick Actions */}
                  <div className={`p-4 rounded-xl ${
                    darkMode ? 'bg-gray-700/50' : 'bg-gray-100'
                  }`}>
                    <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Quick Actions
                    </h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => setNoteData(prev => ({ ...prev, pinned: !prev.pinned }))}
                        className={`w-full flex items-center gap-2 p-2 rounded-lg transition-all ${
                          noteData.pinned
                            ? 'bg-yellow-500/20 text-yellow-600'
                            : darkMode
                            ? 'text-gray-400 hover:text-yellow-400'
                            : 'text-gray-600 hover:text-yellow-600'
                        }`}
                      >
                        📌 {noteData.pinned ? 'Pinned' : 'Pin Note'}
                      </button>
                      <button
                        onClick={() => setNoteData(prev => ({ ...prev, important: !prev.important }))}
                        className={`w-full flex items-center gap-2 p-2 rounded-lg transition-all ${
                          noteData.important
                            ? 'bg-purple-500/20 text-purple-600'
                            : darkMode
                            ? 'text-gray-400 hover:text-purple-400'
                            : 'text-gray-600 hover:text-purple-600'
                        }`}
                      >
                        ⭐ {noteData.important ? 'Important' : 'Mark Important'}
                      </button>
                    </div>
                  </div>

                  {/* Folder Selection */}
                  <div className={`p-4 rounded-xl ${
                    darkMode ? 'bg-gray-700/50' : 'bg-gray-100'
                  }`}>
                    <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Folder
                    </h3>
                    <select
                      value={noteData.folder}
                      onChange={(e) => setNoteData(prev => ({ ...prev, folder: e.target.value }))}
                      className={`w-full p-2 rounded-lg border text-sm ${
                        darkMode 
                          ? 'bg-gray-600 border-gray-500 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="General">General</option>
                      {folders.map(folder => (
                        <option key={folder._id || folder.id} value={folder.name}>
                          {folder.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Templates */}
                  <NoteTemplates 
                    onTemplateSelect={(template) => {
                      setNoteData(prev => ({ ...prev, ...template }));
                    }}
                    darkMode={darkMode}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Additional Details */}
          {currentStep === 'details' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Color Selection */}
                <div>
                  <label className={`block text-sm font-medium mb-3 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Note Color
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setNoteData(prev => ({ 
                          ...prev, 
                          color: darkMode ? color.value : color.light 
                        }))}
                        className={`p-3 rounded-lg text-white font-medium bg-gradient-to-br ${
                          color.value
                        } transition-transform hover:scale-105 ${
                          noteData.color === (darkMode ? color.value : color.light) 
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800' 
                            : ''
                        }`}
                      >
                        {color.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className={`block text-sm font-medium mb-3 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {noteData.tags.map((tag, index) => (
                      <span key={index} className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                        darkMode ? 'bg-cyan-900/30 text-cyan-300' : 'bg-cyan-100 text-cyan-700'
                      }`}>
                        #{tag}
                        <button
                          onClick={() => handleTagRemove(index)}
                          className="text-xs hover:scale-110 transition-transform"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add tag and press Enter..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          handleTagAdd(e.target.value.trim());
                          e.target.value = '';
                        }
                      }}
                      className={`flex-1 p-2 rounded-lg border text-sm ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                    <button
                      onClick={(e) => {
                        const input = e.target.previousElementSibling;
                        if (input.value.trim()) {
                          handleTagAdd(input.value.trim());
                          input.value = '';
                        }
                      }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${
                        darkMode 
                          ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                          : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                      }`}
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Reminder */}
                <div>
                  <label className={`block text-sm font-medium mb-3 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Set Reminder
                  </label>
                  <div className="space-y-2">
                    <input
                      type="date"
                      value={noteData.reminder.date}
                      onChange={(e) => setNoteData(prev => ({ 
                        ...prev, 
                        reminder: { ...prev.reminder, date: e.target.value }
                      }))}
                      className={`w-full p-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    <input
                      type="time"
                      value={noteData.reminder.time}
                      onChange={(e) => setNoteData(prev => ({ 
                        ...prev, 
                        reminder: { ...prev.reminder, time: e.target.value }
                      }))}
                      className={`w-full p-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  {noteData.reminder.date && (
                    <button
                      onClick={() => setNoteData(prev => ({ 
                        ...prev, 
                        reminder: { date: '', time: '', isActive: false }
                      }))}
                      className={`mt-2 text-sm ${
                        darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'
                      }`}
                    >
                      Clear reminder
                    </button>
                  )}
                </div>

                {/* Note Preview */}
                <div>
                  <label className={`block text-sm font-medium mb-3 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Preview
                  </label>
                  <div className={`p-3 rounded-lg border ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                  }`}>
                    <div className={`text-sm mb-2 truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <strong>Title:</strong> {noteData.title || 'No title'}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <strong>Type:</strong> {noteData.type} | 
                      <strong> Tags:</strong> {noteData.tags.length} | 
                      <strong> Pinned:</strong> {noteData.pinned ? 'Yes' : 'No'} | 
                      <strong> Important:</strong> {noteData.important ? 'Yes' : 'No'} |
                      <strong> Reminder:</strong> {noteData.reminder.date ? new Date(noteData.reminder.date).toLocaleDateString() : 'None'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-6 border-t ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-start">
              <button
                onClick={() => {
                  if (currentStep === 'content') setCurrentStep('type');
                  else if (currentStep === 'details') setCurrentStep('content');
                  else onClose();
                }}
                disabled={isLoading}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  darkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {currentStep === 'type' ? 'Cancel' : 'Back'}
              </button>
              {/* Scale indicator below cancel/back button */}
              <ScaleIndicator />
            </div>

            <div className="flex gap-3">
              {currentStep === 'details' && (
                <button
                  onClick={() => {
                    setNoteData({
                      title: '',
                      content: '',
                      type: 'text',
                      tags: [],
                      folder: 'General',
                      color: darkMode ? 'from-blue-900/50 to-blue-800/50' : 'from-blue-100 to-blue-200',
                      pinned: false,
                      important: false,
                      reminder: {
                        date: '',
                        time: '',
                        isActive: false
                      },
                      collaborators: []
                    });
                    setError('');
                  }}
                  disabled={isLoading}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    darkMode 
                      ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' 
                      : 'text-red-600 hover:text-red-700 hover:bg-red-100'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Clear All
                </button>
              )}
              
              <button
                onClick={() => {
                  if (currentStep === 'type') setCurrentStep('content');
                  else if (currentStep === 'content') setCurrentStep('details');
                  else handleSave();
                }}
                disabled={isLoading}
                className="px-6 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  currentStep === 'details' ? 'Create Note' : 'Continue'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNote;