import React, { useState, useEffect } from 'react';

const CodeNoteEditor = ({ content, onChange, darkMode }) => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(content || '// Write your code here\nfunction hello() {\n  console.log("Hello, World!");\n}');

  const languages = [
    'javascript', 'python', 'java', 'cpp', 'csharp', 'php', 'ruby', 'go', 
    'rust', 'typescript', 'html', 'css', 'sql', 'json', 'xml', 'markdown'
  ];

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    onChange(newCode);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  const formatCode = () => {
    const formatted = code
      .split('\n')
      .map(line => line.trim())
      .join('\n');
    setCode(formatted);
    onChange(formatted);
  };

  useEffect(() => {
    if (content && content !== code) {
      setCode(content);
    }
  }, [content]);

  return (
    <div className={`rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-900'}`}>
      {/* Toolbar */}
      <div className={`p-3 border-b ${darkMode ? 'border-gray-600' : 'border-gray-700'} flex items-center gap-4`}>
        <select 
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className={`px-3 py-1 rounded border text-sm ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-gray-800 border-gray-700 text-white'
          }`}
        >
          {languages.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
        
        <div className="flex gap-2">
          <button 
            onClick={copyToClipboard}
            className={`p-2 rounded hover:bg-opacity-20 ${darkMode ? 'hover:bg-white' : 'hover:bg-gray-700'}`} 
            title="Copy Code"
          >
            📋
          </button>
          <button 
            onClick={formatCode}
            className={`p-2 rounded hover:bg-opacity-20 ${darkMode ? 'hover:bg-white' : 'hover:bg-gray-700'}`} 
            title="Format Code"
          >
            🧹
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          className={`w-full h-64 p-4 font-mono text-sm resize-none border-none outline-none ${
            darkMode ? 'bg-gray-800 text-green-400' : 'bg-gray-900 text-green-300'
          }`}
          spellCheck="false"
          style={{ 
            tabSize: 2,
            paddingLeft: '3.5rem',
            lineHeight: '1.5'
          }}
          placeholder="// Start writing your code here..."
        />
        
        {/* Line Numbers */}
        <div className={`absolute left-0 top-0 bottom-0 w-12 p-4 text-right font-mono text-sm border-r ${
          darkMode ? 'border-gray-600 text-gray-400 bg-gray-900' : 'border-gray-700 text-gray-500 bg-gray-800'
        }`}>
          {code.split('\n').map((_, i) => (
            <div key={i} className="leading-6">{i + 1}</div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className={`p-3 border-t ${darkMode ? 'border-gray-600' : 'border-gray-700'} text-xs flex justify-between ${
        darkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <span>Lines: {code.split('\n').length}</span>
        <span>Language: {language}</span>
        <span>Characters: {code.length}</span>
      </div>
    </div>
  );
};

export default CodeNoteEditor;