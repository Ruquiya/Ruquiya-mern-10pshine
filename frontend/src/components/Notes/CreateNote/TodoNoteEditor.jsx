import React, { useState, useEffect } from 'react';

const TodoNoteEditor = ({ content, onChange, darkMode }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');


  useEffect(() => {
    if (content) {
      try {
        const parsedTasks = JSON.parse(content);
        setTasks(Array.isArray(parsedTasks) ? parsedTasks : []);
      } catch (e) {
        console.error('Error parsing todo content:', e);
        setTasks([]);
      }
    } else {
      setTasks([
        { id: 1, text: 'Sample task 1', completed: false },
        { id: 2, text: 'Sample task 2', completed: true },
      ]);
    }
  }, [content]);

  const addTask = () => {
    if (newTask.trim()) {
      const updatedTasks = [...tasks, { id: Date.now(), text: newTask.trim(), completed: false }];
      setTasks(updatedTasks);
      if (onChange) {
        onChange(JSON.stringify(updatedTasks));
      }
      setNewTask('');
    }
  };

  const toggleTask = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    if (onChange) {
      onChange(JSON.stringify(updatedTasks));
    }
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    if (onChange) {
      onChange(JSON.stringify(updatedTasks));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  return (
    <div
      className={`rounded-lg border ${
        darkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-300 bg-white'
      }`}
    >
      {/* Toolbar */}
      <div
        className={`p-3 border-b ${
          darkMode ? 'border-gray-600' : 'border-gray-200'
        } flex items-center gap-2`}
      >
        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {tasks.filter((t) => t.completed).length} of {tasks.length} tasks completed
        </span>
        <div className="flex-1" />
        <button
          onClick={() => {
            const updatedTasks = tasks.map((task) => ({ ...task, completed: true }));
            setTasks(updatedTasks);
            if (onChange) {
              onChange(JSON.stringify(updatedTasks));
            }
          }}
          className={`px-3 py-1 rounded text-sm ${
            darkMode
              ? 'text-green-400 hover:bg-green-900/20'
              : 'text-green-600 hover:bg-green-100'
          }`}
        >
          Complete All
        </button>
      </div>

      <div className="p-4 space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-3 group">
            <button
              onClick={() => toggleTask(task.id)}
              className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                task.completed
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-transparent'
                  : darkMode
                  ? 'bg-gray-600/50 border-gray-400 hover:border-green-400'
                  : 'bg-white border-gray-500 hover:border-green-500'
              }`}
              aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {task.completed ? (
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'} opacity-30`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>

            <input
              type="text"
              value={task.text}
              onChange={(e) => {
                const updatedTasks = tasks.map((t) =>
                  t.id === task.id ? { ...t, text: e.target.value } : t
                );
                setTasks(updatedTasks);
                if (onChange) {
                  onChange(JSON.stringify(updatedTasks));
                }
              }}
              className={`flex-1 bg-transparent border-none outline-none ${
                task.completed
                  ? 'line-through opacity-60'
                  : darkMode
                  ? 'text-white'
                  : 'text-gray-900'
              }`}
            />

            <button
              onClick={() => deleteTask(task.id)}
              className={`opacity-0 group-hover:opacity-100 p-1 rounded transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                darkMode
                  ? 'text-red-400 hover:bg-red-900/20'
                  : 'text-red-500 hover:bg-red-100'
              }`}
              aria-label="Delete task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div
        className={`p-3 border-t ${
          darkMode ? 'border-gray-600' : 'border-gray-200'
        } flex gap-2`}
      >
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new task..."
          className={`flex-1 p-2 rounded border text-sm ${
            darkMode
              ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
              : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
        />
        <button
          onClick={addTask}
          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded text-sm font-medium hover:from-green-600 hover:to-emerald-600 transition-all"
        >
          Add
        </button>
      </div>
      <div
        className={`p-3 text-xs ${
          darkMode ? 'text-gray-400 bg-gray-800/30' : 'text-gray-500 bg-gray-50'
        }`}
      >
        💡 Tip: Use Tab to navigate between tasks, Space to toggle completion, and Enter to add new tasks.
      </div>
    </div>
  );
};

export default TodoNoteEditor;