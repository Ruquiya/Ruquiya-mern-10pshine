import React, { useState } from 'react';
import Calendar from '../../Calendar/Calendar';
import { noteService } from '../../../services/noteService';

const themeStyles = {
  light: {
    '--bg-primary': 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
    '--card-bg': '#ffffff',
    '--text-primary': '#0f172a',
    '--text-secondary': '#475569',
    '--accent-primary': '#2563eb',
    '--accent-hover': '#1d4ed8',
    '--error-bg': '#fef2f2',
    '--error-text': '#dc2626',
    '--border-color': '#e2e8f0',
    '--shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '--shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '--important-bg': '#fefce8',
    '--important-text': '#854d0e',
    '--important-border': '#f59e0b',
    '--pinned-bg': '#f0f9ff',
    '--pinned-text': '#0369a1',
    '--pinned-border': '#0ea5e9',
  },
  dark: {
    '--bg-primary': 'linear-gradient(135deg, #0f172a, #1e293b)',
    '--card-bg': 'rgba(30, 41, 59, 0.8)',
    '--text-primary': '#f1f5f9',
    '--text-secondary': '#94a3b8',
    '--accent-primary': '#3b82f6',
    '--accent-hover': '#60a5fa',
    '--error-bg': 'rgba(220, 38, 38, 0.2)',
    '--error-text': '#fca5a5',
    '--border-color': '#334155',
    '--shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
    '--shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
    '--important-bg': '#422006',
    '--important-text': '#fcd34d',
    '--important-border': '#d97706',
    '--pinned-bg': '#082f49',
    '--pinned-text': '#7dd3fc',
    '--pinned-border': '#0ea5e9',
  },
};

const NoteView = ({ note, onBack, darkMode = false, onEdit, onDelete, allNotes = [] }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const sanitizeHtml = (html, type) => {
    if (!html) return '';
    // For text notes only: strip inline styles/alignments, data-URI images/audio, and convert stray divs
    if (type && type !== 'text') return html;
    return html
      .replace(/\sstyle="[^"]*"/gi, '')
      .replace(/\salign="[^"]*"/gi, '')
      .replace(/<img[^>]*src=['"]data:[^'"]+['"][^>]*>/gi, '')
      .replace(/<audio[^>]*src=['"]data:[^'"]+['"][^>]*>.*?<\/audio>/gi, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/<div><br><\/div>/gi, '<br>')
      .replace(/<div[^>]*>/gi, '<br>')
      .replace(/<\/div>/gi, '');
  };

  React.useEffect(() => {
    const theme = darkMode ? themeStyles.dark : themeStyles.light;
    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, [darkMode]);

  React.useEffect(() => {
    console.log('Current note ID:', note?._id);
    console.log('current note:', note);
  }, [note]);

  const calendarEvents = allNotes
    .filter(n => n && n.reminder && n.reminder.isActive && n.reminder.date)
    .map(n => ({
      date: new Date(n.reminder.date),
      title: n.title || 'Untitled',
      type: n.important ? 'important' : 'reminder',
      noteId: n._id,
      time: n.reminder.time || null,
    }));

  const renderTodoContent = () => {
    if (note.type === 'todo' && note.content) {
      try {
        const tasks = JSON.parse(note.content);
        return (
          <div className="space-y-3">
            {tasks.map((task, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 border border-green-200 dark:border-green-800 transition-transform hover:scale-[1.01]"
              >
                <div
                  className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                    task.completed
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-transparent'
                      : 'border-gray-400 dark:border-gray-500'
                  }`}
                >
                  {task.completed && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span
                  className={`flex-1 ${task.completed ? 'line-through opacity-60' : ''} text-[var(--text-primary)] font-medium`}
                >
                  {task.text}
                </span>
              </div>
            ))}
          </div>
        );
      } catch (e) {
        return <p className="text-[var(--text-secondary)]">{note.content}</p>;
      }
    }
    return <p className="text-[var(--text-secondary)] leading-relaxed">{note.content}</p>;
  };

  const renderCodeContent = () => {
    if (note.type === 'code') {
      return (
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-lg overflow-hidden">
          <div className="flex items-center gap-2 p-4 border-b border-[var(--border-color)] bg-gray-50 dark:bg-gray-800">
            <div className="text-lg">💻</div>
            <span className="font-semibold text-[var(--text-primary)]">Code Snippet</span>
          </div>
          {note.content ? (
            <pre className="p-4 font-mono text-sm overflow-x-auto bg-gray-900 text-green-400 m-0">
              <code>{note.content}</code>
            </pre>
          ) : (
            <div className="text-center py-8 text-[var(--text-secondary)]">
              <p>No code content available</p>
              <p className="text-sm mt-2">This code note appears to be empty.</p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const renderAudioContent = () => {
    if (note.type === 'audio') {
      return (
        <div className="text-center py-4">
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-lg p-6">
            <div className="text-4xl mb-4">🎤</div>
            {note.content ? (
              <div>
                <audio
                  controls
                  className="w-full max-w-md mx-auto rounded-lg shadow"
                  aria-label="Audio note playback"
                >
                  <source src={note.content} type="audio/wav" />
                  <source src={note.content} type="audio/mp3" />
                  <source src={note.content} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                <p className="text-sm mt-3 text-[var(--text-secondary)] font-medium">Audio recording</p>
              </div>
            ) : (
              <div className="text-center py-4 text-[var(--text-secondary)]">
                <p className="font-medium">No audio content available</p>
                <p className="text-sm mt-2">This audio note appears to be empty.</p>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderDrawingContent = () => {
    if (note.type === 'drawing' && note.content) {
      const isValidBase64Image = note.content.startsWith('data:image/');
      return (
        <div className="text-center py-4">
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-lg p-4">
            {isValidBase64Image ? (
              <img
                src={note.content}
                alt="Drawing"
                className="max-w-full h-auto mx-auto rounded-lg shadow-md border border-[var(--border-color)]"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
            ) : (
              <div className="text-center py-8 text-[var(--text-secondary)]">
                <div className="text-4xl mb-2">🎨</div>
                <p className="font-medium">Drawing data format not supported</p>
                <p className="text-sm mt-2">Expected base64 image data.</p>
              </div>
            )}
            <div className="hidden text-center py-8 text-[var(--text-secondary)]">
              <div className="text-4xl mb-2">🎨</div>
              <p className="font-medium">Drawing could not be loaded</p>
              <p className="text-sm mt-2">The drawing data may be corrupted or missing.</p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleDelete = async () => {
    if (!note?._id) {
      setDeleteError('Cannot delete: Invalid note ID');
      return;
    }

    if (window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      setIsDeleting(true);
      setDeleteError('');
      try {
        const result = await noteService.deleteNote(note._id);
        if (result.success) {
          onDelete?.(note._id);
          onBack();
        } else {
          setDeleteError(result.message || 'Failed to delete note');
        }
      } catch (error) {
        const errorMessages = {
          '404': 'Note not found. It may have been already deleted.',
          'Network error': 'Network error: Unable to connect to server. Please check your connection.',
          'Invalid note ID': 'Invalid note ID. Please refresh the page and try again.',
        };
        setDeleteError(
          errorMessages[error.message] || error.message || 'Failed to delete note. Please try again.'
        );
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = () => {
    if (!note?._id) {
      alert('Cannot edit: Invalid note data');
      return;
    }
    onEdit?.(note);
  };

  return (
    <div
      className="p-4 min-h-screen theme-transition"
      style={{ background: 'var(--bg-primary)', fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      <style>
        {`
          :root {
            --transition: all 0.3s ease;
          }
          .theme-transition {
            transition: var(--transition);
          }
          .action-button {
            transition: var(--transition), transform 0.2s ease;
          }
          .action-button:hover {
            transform: translateY(-2px);
          }
          .action-button:focus {
            outline: 2px solid var(--accent-primary);
            outline-offset: 2px;
          }
          .action-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
          }
          .fade-in {
            animation: fadeIn 0.3s ease-in;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .prose {
            line-height: 1.75;
          }
          .important-badge {
            background: var(--important-bg);
            color: var(--important-text);
            border: 1px solid var(--important-border);
          }
          .pinned-badge {
            background: var(--pinned-bg);
            color: var(--pinned-text);
            border: 1px solid var(--pinned-border);
          }
        `}
      </style>

      <button
        onClick={onBack}
        className="flex items-center mb-6 text-[var(--accent-primary)] hover:text-[var(--accent-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] rounded-md font-medium"
        aria-label="Go back to notes list"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Notes
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl p-6 bg-[var(--card-bg)] shadow-lg fade-in border border-[var(--border-color)]">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
              >
                {note.type ? note.type.charAt(0).toUpperCase() + note.type.slice(1) + ' Note' : 'Text Note'}
              </span>
              {note.pinned && (
                <span className="pinned-badge px-3 py-1 rounded-full text-xs font-semibold">
                  📌 Pinned
                </span>
              )}
              {note.important && (
                <span className="important-badge px-3 py-1 rounded-full text-xs font-semibold">
                  ⭐ Important
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold mb-4 text-[var(--text-primary)] leading-tight">
              {note.title}
            </h1>

            <div className="flex flex-wrap gap-2 mb-6">
              {(note.tags || []).map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {renderTodoContent()}
            {renderCodeContent()}
            {renderAudioContent()}
            {renderDrawingContent()}

            {(!note.type || note.type === 'text') && (
              <div
                className="prose prose-sm max-w-none text-[var(--text-secondary)] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(note.content || '', note.type) }}
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={handleEdit}
              disabled={!note?._id}
              className="action-button p-4 rounded-xl text-center bg-[var(--card-bg)] shadow border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-gray-50 dark:hover:bg-gray-700/50 font-medium"
              aria-label="Edit note"
            >
              <div className="text-2xl mb-2">📝</div>
              <div>Edit Note</div>
            </button>
            <button
              className="action-button p-4 rounded-xl text-center bg-[var(--card-bg)] shadow border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-gray-50 dark:hover:bg-gray-700/50 font-medium"
              aria-label="Share note"
            >
              <div className="text-2xl mb-2">🔗</div>
              <div>Share Note</div>
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting || !note?._id}
              className="action-button p-4 rounded-xl text-center bg-red-50 text-red-700 dark:bg-red-600/20 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-700/30 border border-red-200 dark:border-red-800 font-medium"
              aria-label="Delete note"
            >
              <div className="text-2xl mb-2">{isDeleting ? '⏳' : '🗑️'}</div>
              <div>{isDeleting ? 'Deleting...' : 'Delete Note'}</div>
            </button>
          </div>

          {deleteError && (
            <div
              className="p-4 rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-600/20 fade-in"
              role="alert"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="text-sm text-red-700 dark:text-red-300 font-medium">{deleteError}</div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Calendar darkMode={darkMode} events={calendarEvents} />
          <div className="p-5 rounded-xl bg-[var(--card-bg)] shadow-lg fade-in border border-[var(--border-color)]">
            <h4 className="font-bold mb-4 text-[var(--text-primary)] text-lg border-b border-[var(--border-color)] pb-2">
              Note Information
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-[var(--border-color)]/50">
                <span className="text-[var(--text-secondary)] font-medium">Created:</span>
                <span className="text-[var(--text-primary)] font-semibold">
                  {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[var(--border-color)]/50">
                <span className="text-[var(--text-secondary)] font-medium">Type:</span>
                <span className="text-[var(--text-primary)] font-semibold">
                  {note.type ? note.type.charAt(0).toUpperCase() + note.type.slice(1) : 'Text'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[var(--border-color)]/50">
                <span className="text-[var(--text-secondary)] font-medium">Folder:</span>
                <span className="text-[var(--text-primary)] font-semibold">{note.folder || 'General'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[var(--border-color)]/50">
                <span className="text-[var(--text-secondary)] font-medium">Words:</span>
                <span className="text-[var(--text-primary)] font-semibold">
                  {note.content ? note.content.split(/\s+/).filter(word => word.length > 0).length : 0}
                </span>
              </div>
              {note.reminder && note.reminder.isActive && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-[var(--text-secondary)] font-medium">Reminder:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">
                    {new Date(note.reminder.date).toLocaleDateString()}
                    {note.reminder.time && ` at ${note.reminder.time}`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteView;