import React, { useRef, useState, useEffect } from "react";
import { 
  FaBold, 
  FaItalic, 
  FaUnderline, 
  FaListUl, 
  FaListOl, 
  FaHeading, 
  FaFont, 
  FaLink, 
  FaImage, 
  FaCode,
  FaUndo,
  FaRedo,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaQuoteRight,
  FaTable,
  FaPalette,
  FaChevronDown,
  FaUpload,
  FaFileImage
} from 'react-icons/fa';

const TextNoteEditor = ({ content, onChange, darkMode }) => {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isToolbarOpen, setIsToolbarOpen] = useState(true);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    heading: false,
    list: false,
    blockquote: false,
    alignment: 'left'
  });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const textColors = [
    { name: 'Default', value: darkMode ? '#ffffff' : '#000000' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Yellow', value: '#f59e0b' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
  ];

  const fontSizes = [
    { label: 'Small', value: '1' },
    { label: 'Normal', value: '3' },
    { label: 'Large', value: '5' },
    { label: 'X-Large', value: '6' },
    { label: 'XX-Large', value: '7' },
  ];

  // Initialize with empty content if needed
  useEffect(() => {
    if (editorRef.current && !content) {
      editorRef.current.innerHTML = '';
      updateEditorState();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showColorPicker || showFontSize) {
        setShowColorPicker(false);
        setShowFontSize(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColorPicker, showFontSize]);

  // Save to history when content changes
  useEffect(() => {
    if (content && history[historyIndex] !== content) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(content);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [content]);

  const updateEditorState = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || '';
      setWordCount(text.trim() ? text.split(/\s+/).length : 0);
      setCharCount(text.length);
 
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const node = range.startContainer.parentElement;
        
        // Check if we're in a list
        const inList = node.closest('ul, ol');
        const inBlockquote = node.closest('blockquote');
        const heading = node.tagName && node.tagName.match(/^H[1-6]$/i);
        
        // Check alignment
        let alignment = 'left';
        const computedStyle = window.getComputedStyle(node);
        const textAlign = computedStyle.textAlign;
        if (textAlign === 'center') alignment = 'center';
        else if (textAlign === 'right') alignment = 'right';
        else if (textAlign === 'justify') alignment = 'justify';
        
        setActiveFormats({
          bold: document.queryCommandState('bold'),
          italic: document.queryCommandState('italic'),
          underline: document.queryCommandState('underline'),
          heading: !!heading,
          list: !!inList,
          blockquote: !!inBlockquote,
          alignment: alignment
        });
      }
    }
  };

  const applyFormat = (command, value = null) => {
    if (!editorRef.current) return;
    // Focus editor first
    editorRef.current.focus();
    
    // Save current selection
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    try {
      // Enable styleWithCSS for better formatting
      document.execCommand("styleWithCSS", false, true);
      
      // Apply the command
      const success = document.execCommand(command, false, value);
      
      if (!success) {
        console.warn(`Command ${command} failed`);
        // Fallback for some commands
        if (command === 'formatBlock' && value) {
          document.execCommand('formatBlock', false, value);
        }
      }
      
      updateEditorState();
      onChange(editorRef.current.innerHTML);
    } catch (error) {
      console.error('Error applying format:', error);
    }
  };

  const insertHTML = (html) => {
    if (!editorRef.current) return;
    document.execCommand('insertHTML', false, html);
    editorRef.current.focus();
    updateEditorState();
    onChange(editorRef.current.innerHTML);
  };

  const addLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      
      // Check if there's selected text
      const selection = window.getSelection();
      if (selection.toString().trim() === '') {
        // No text selected, insert link with URL as text
        insertHTML(`<a href="${formattedUrl}" target="_blank" rel="noopener noreferrer">${formattedUrl}</a>`);
      } else {
        // Use selected text as link text
        applyFormat('createLink', formattedUrl);
      }
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        alert('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxWidth = 400;
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          const imgHTML = `<img src="${e.target.result}" alt="Uploaded image" style="max-width: ${width}px; height: ${height}px; border-radius: 8px; margin: 10px 0;" />`;
          insertHTML(imgHTML);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
      
      event.target.value = '';
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const addTable = () => {
    const html = `
      <table style="width: 100%; border-collapse: collapse; margin: 10px 0; border: 1px solid ${darkMode ? '#4b5563' : '#d1d5db'};">
        <tr>
          <td style="border: 1px solid ${darkMode ? '#4b5563' : '#d1d5db'}; padding: 12px; text-align: left;">Cell 1</td>
          <td style="border: 1px solid ${darkMode ? '#4b5563' : '#d1d5db'}; padding: 12px; text-align: left;">Cell 2</td>
        </tr>
        <tr>
          <td style="border: 1px solid ${darkMode ? '#4b5563' : '#d1d5db'}; padding: 12px; text-align: left;">Cell 3</td>
          <td style="border: 1px solid ${darkMode ? '#4b5563' : '#d1d5db'}; padding: 12px; text-align: left;">Cell 4</td>
        </tr>
      </table>
      <div><br></div>
    `;
    insertHTML(html);
  };

  const clearFormatting = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      
      // Remove formatting
      document.execCommand('removeFormat', false, null);
      document.execCommand('unlink', false, null);
      
      // Remove specific formatting that removeFormat might miss
      if (range.toString().length > 0) {
        const selectedHtml = range.cloneContents();
        const tempDiv = document.createElement('div');
        tempDiv.appendChild(selectedHtml);
        
        // Remove style attributes and specific tags
        tempDiv.querySelectorAll('*').forEach(el => {
          el.removeAttribute('style');
          el.removeAttribute('class');
          el.removeAttribute('color');
          el.removeAttribute('face');
          el.removeAttribute('size');
          
          if (el.tagName.toLowerCase() === 'font') {
            const parent = el.parentNode;
            while (el.firstChild) {
              parent.insertBefore(el.firstChild, el);
            }
            parent.removeChild(el);
          }
        });
        
        range.deleteContents();
        range.insertNode(tempDiv);
      }
      
      updateEditorState();
      onChange(editorRef.current.innerHTML);
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      if (editorRef.current) {
        editorRef.current.innerHTML = history[newIndex];
        updateEditorState();
      }
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      if (editorRef.current) {
        editorRef.current.innerHTML = history[newIndex];
        updateEditorState();
      }
    }
  };

  const focusEditor = () => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    const range = document.createRange();
    range.selectNodeContents(editorRef.current);
    range.collapse(false);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const sanitizeContent = (html) => {
    if (!html) return '';

    let sanitized = html
      .replace(/style="[^"]*direction:\s*rtl[^"]*"/gi, '')
      .replace(/style="[^"]*unicode-bidi:[^"]*"/gi, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/<div><br><\/div>/gi, '<br>')
      .replace(/<div>/gi, '<br>')
      .replace(/<\/div>/gi, '');

    return sanitized;
  };

  useEffect(() => {
    if (editorRef.current && content !== undefined && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content || '';
      updateEditorState();
    }
  }, [content]);

  const handleContentChange = (newContent) => {
    const sanitizedContent = sanitizeContent(newContent);
    onChange(sanitizedContent);
  };

  const handleToolbarClick = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    if (editorRef.current) {
      editorRef.current.focus();
    }
    setTimeout(action, 10);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    
    // Get plain text from clipboard
    const text = e.clipboardData.getData('text/plain');
    
    // Insert text at cursor position
    document.execCommand('insertText', false, text);
    
    setTimeout(() => {
      handleContentChange(editorRef.current.innerHTML);
      updateEditorState();
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          applyFormat('bold');
          break;
        case 'i':
          e.preventDefault();
          applyFormat('italic');
          break;
        case 'u':
          e.preventDefault();
          applyFormat('underline');
          break;
        case 'z':
          if (!e.shiftKey) {
            e.preventDefault();
            undo();
          }
          break;
        case 'y':
          e.preventDefault();
          redo();
          break;
        default:
          break;
      }
    }
  };

  // Fixed text color application
  const applyTextColor = (colorValue) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    
    // Use both methods for better browser compatibility
    document.execCommand('styleWithCSS', false, true);
    document.execCommand('foreColor', false, colorValue);
    
    // Alternative method using insertHTML for better reliability
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = selection.toString();
      
      // Create span with color
      const span = document.createElement('span');
      span.style.color = colorValue;
      span.textContent = selectedText;
      
      range.deleteContents();
      range.insertNode(span);
    }
    
    updateEditorState();
    onChange(editorRef.current.innerHTML);
  };

  // Fixed font size application
  const applyFontSize = (sizeValue) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    
    // Use traditional font size command
    document.execCommand('fontSize', false, sizeValue);
    
    // Fix the font tags that get created
    const fontTags = editorRef.current.querySelectorAll('font');
    fontTags.forEach(font => {
      if (font.size === sizeValue) {
        const span = document.createElement('span');
        span.style.fontSize = getFontSizeFromValue(sizeValue);
        while (font.firstChild) {
          span.appendChild(font.firstChild);
        }
        font.parentNode.replaceChild(span, font);
      }
    });
    
    updateEditorState();
    onChange(editorRef.current.innerHTML);
  };

  const getFontSizeFromValue = (value) => {
    const sizes = {
      '1': '0.75rem',
      '2': '0.875rem',
      '3': '1rem',
      '4': '1.125rem',
      '5': '1.25rem',
      '6': '1.5rem',
      '7': '2rem'
    };
    return sizes[value] || '1rem';
  };

  // Fixed list functionality
  const applyList = (command) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    
    // Simple execCommand for lists - browsers handle this well
    document.execCommand(command, false, null);
    
    updateEditorState();
    onChange(editorRef.current.innerHTML);
  };

  // Fixed heading functionality
  const applyHeading = () => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const node = range.startContainer.parentElement;
      
      // Check if already a heading
      if (node.tagName && node.tagName.match(/^H[1-6]$/i)) {
        // Convert back to normal paragraph
        document.execCommand('formatBlock', false, '<p>');
      } else {
        // Apply heading
        document.execCommand('formatBlock', false, '<h3>');
      }
    }
    
    updateEditorState();
    onChange(editorRef.current.innerHTML);
  };

  // Fixed blockquote functionality
  const applyBlockquote = () => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const node = range.startContainer.parentElement;
      
      // Check if already in blockquote
      if (node.closest('blockquote')) {
        // Remove blockquote
        document.execCommand('formatBlock', false, '<p>');
      } else {
        // Apply blockquote
        document.execCommand('formatBlock', false, '<blockquote>');
      }
    }
    
    updateEditorState();
    onChange(editorRef.current.innerHTML);
  };

  // Fixed alignment functionality
  const applyAlignment = (alignment) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand('justify' + alignment.charAt(0).toUpperCase() + alignment.slice(1));
    updateEditorState();
    onChange(editorRef.current.innerHTML);
  };

  return (
    <div 
      className={`rounded-xl border-2 shadow-lg transition-all duration-300 ${
        darkMode 
          ? "border-gray-600 bg-gray-800/50 hover:border-gray-500" 
          : "border-gray-300 bg-white hover:border-gray-400"
      }`}
      onClick={(e) => e.stopPropagation()} 
    >
      {/* Hidden file input for image upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* Toolbar Header */}
      <div className={`flex justify-between items-center p-3 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Rich Text Editor
          </span>
          <div className={`text-xs px-2 py-1 rounded-full ${
            darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
          }`}>
            Auto-save
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => handleToolbarClick(e, () => setIsToolbarOpen(!isToolbarOpen))}
            className={`p-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
              darkMode 
                ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {isToolbarOpen ? 'Hide Tools' : 'Show Tools'}
            <FaChevronDown className={`w-3 h-3 transition-transform ${isToolbarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Enhanced Toolbar */}
      {isToolbarOpen && (
        <div
          className={`p-3 border-b ${darkMode ? "border-gray-600 bg-gray-700/30" : "border-gray-200 bg-gray-50"} flex flex-wrap gap-1`}
          onClick={(e) => e.stopPropagation()} 
        >
          {/* Undo/Redo */}
          <div className="flex border-r mr-2 pr-2">
            <button
              onClick={(e) => handleToolbarClick(e, undo)}
              disabled={historyIndex <= 0}
              className={`p-2 rounded transition-all duration-200 ${
                historyIndex <= 0 
                  ? 'opacity-50 cursor-not-allowed text-gray-400' 
                  : darkMode 
                    ? 'text-gray-300 hover:bg-gray-600 hover:text-white' 
                    : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
              title="Undo"
            >
              <FaUndo className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => handleToolbarClick(e, redo)}
              disabled={historyIndex >= history.length - 1}
              className={`p-2 rounded transition-all duration-200 ${
                historyIndex >= history.length - 1
                  ? 'opacity-50 cursor-not-allowed text-gray-400' 
                  : darkMode 
                    ? 'text-gray-300 hover:bg-gray-600 hover:text-white' 
                    : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
              title="Redo"
            >
              <FaRedo className="w-4 h-4" />
            </button>
          </div>

          {/* Text Formatting */}
          <div className="flex border-r mr-2 pr-2">
            <button
              onClick={(e) => handleToolbarClick(e, () => applyFormat("bold"))}
              className={`p-2 rounded transition-all duration-200 ${
                activeFormats.bold 
                  ? 'bg-blue-500 text-white' 
                  : darkMode 
                    ? 'text-gray-300 hover:bg-gray-600 hover:text-white' 
                    : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
              title="Bold"
            >
              <FaBold className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => handleToolbarClick(e, () => applyFormat("italic"))}
              className={`p-2 rounded transition-all duration-200 ${
                activeFormats.italic 
                  ? 'bg-blue-500 text-white' 
                  : darkMode 
                    ? 'text-gray-300 hover:bg-gray-600 hover:text-white' 
                    : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
              title="Italic"
            >
              <FaItalic className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => handleToolbarClick(e, () => applyFormat("underline"))}
              className={`p-2 rounded transition-all duration-200 ${
                activeFormats.underline 
                  ? 'bg-blue-500 text-white' 
                  : darkMode 
                    ? 'text-gray-300 hover:bg-gray-600 hover:text-white' 
                    : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
              title="Underline"
            >
              <FaUnderline className="w-4 h-4" />
            </button>
          </div>

          {/* Alignment */}
          <div className="flex border-r mr-2 pr-2">
            <button
              onClick={(e) => handleToolbarClick(e, () => applyAlignment("left"))}
              className={`p-2 rounded transition-all duration-200 ${
                activeFormats.alignment === 'left' 
                  ? 'bg-blue-500 text-white' 
                  : darkMode 
                    ? 'text-gray-300 hover:bg-gray-600 hover:text-white' 
                    : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
              title="Align Left"
            >
              <FaAlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => handleToolbarClick(e, () => applyAlignment("center"))}
              className={`p-2 rounded transition-all duration-200 ${
                activeFormats.alignment === 'center' 
                  ? 'bg-blue-500 text-white' 
                  : darkMode 
                    ? 'text-gray-300 hover:bg-gray-600 hover:text-white' 
                    : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
              title="Align Center"
            >
              <FaAlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => handleToolbarClick(e, () => applyAlignment("right"))}
              className={`p-2 rounded transition-all duration-200 ${
                activeFormats.alignment === 'right' 
                  ? 'bg-blue-500 text-white' 
                  : darkMode 
                    ? 'text-gray-300 hover:bg-gray-600 hover:text-white' 
                    : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
              title="Align Right"
            >
              <FaAlignRight className="w-4 h-4" />
            </button>
          </div>

          {/* Lists - FIXED */}
          <div className="flex border-r mr-2 pr-2">
            <button
              onClick={(e) => handleToolbarClick(e, () => applyList("insertUnorderedList"))}
              className={`p-2 rounded transition-all duration-200 ${
                activeFormats.list 
                  ? 'bg-blue-500 text-white' 
                  : darkMode 
                    ? 'text-gray-300 hover:bg-gray-600 hover:text-white' 
                    : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
              title="Bullet List"
            >
              <FaListUl className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => handleToolbarClick(e, () => applyList("insertOrderedList"))}
              className={`p-2 rounded transition-all duration-200 ${
                activeFormats.list 
                  ? 'bg-blue-500 text-white' 
                  : darkMode 
                    ? 'text-gray-300 hover:bg-gray-600 hover:text-white' 
                    : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
              title="Numbered List"
            >
              <FaListOl className="w-4 h-4" />
            </button>
          </div>

          {/* Headings & Blocks - FIXED */}
          <div className="flex border-r mr-2 pr-2">
            <button
              onClick={(e) => handleToolbarClick(e, applyHeading)}
              className={`p-2 rounded transition-all duration-200 ${
                activeFormats.heading 
                  ? 'bg-blue-500 text-white' 
                  : darkMode 
                    ? 'text-gray-300 hover:bg-gray-600 hover:text-white' 
                    : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
              title="Heading"
            >
              <FaHeading className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => handleToolbarClick(e, applyBlockquote)}
              className={`p-2 rounded transition-all duration-200 ${
                activeFormats.blockquote 
                  ? 'bg-blue-500 text-white' 
                  : darkMode 
                    ? 'text-gray-300 hover:bg-gray-600 hover:text-white' 
                    : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
              title="Blockquote"
            >
              <FaQuoteRight className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => handleToolbarClick(e, () => insertHTML('<code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace; border: 1px solid #e2e8f0;">code</code>'))}
              className={`p-2 rounded transition-all duration-200 ${
                darkMode ? 'text-gray-300 hover:bg-gray-600 hover:text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
              title="Code"
            >
              <FaCode className="w-4 h-4" />
            </button>
          </div>

          {/* Media & Links */}
          <div className="flex border-r mr-2 pr-2">
            <button
              onClick={(e) => handleToolbarClick(e, addLink)}
              className={`p-2 rounded transition-all duration-200 ${
                darkMode ? 'text-gray-300 hover:bg-gray-600 hover:text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
              title="Insert Link"
            >
              <FaLink className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => handleToolbarClick(e, triggerImageUpload)}
              className={`p-2 rounded transition-all duration-200 ${
                darkMode ? 'text-gray-300 hover:bg-gray-600 hover:text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
              title="Upload Image"
            >
              <FaUpload className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => handleToolbarClick(e, addTable)}
              className={`p-2 rounded transition-all duration-200 ${
                darkMode ? 'text-gray-300 hover:bg-gray-600 hover:text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
              title="Insert Table"
            >
              <FaTable className="w-4 h-4" />
            </button>
          </div>

          {/* Color Picker - FIXED */}
          <div className="flex border-r mr-2 pr-2 relative">
            <button
              onClick={(e) => handleToolbarClick(e, () => setShowColorPicker(!showColorPicker))}
              className={`p-2 rounded transition-all duration-200 ${
                darkMode ? 'text-gray-300 hover:bg-gray-600 hover:text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
              title="Text Color"
            >
              <FaPalette className="w-4 h-4" />
            </button>
            {showColorPicker && (
              <div 
                className={`absolute top-10 left-0 z-50 p-3 rounded-lg shadow-xl border min-w-32 ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="grid grid-cols-4 gap-2">
                  {textColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={(e) => {
                        e.stopPropagation();
                        applyTextColor(color.value);
                        setShowColorPicker(false);
                      }}
                      className="w-6 h-6 rounded border-2 border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
                <div className={`mt-2 text-xs text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Text Color
                </div>
              </div>
            )}
          </div>

          {/* Font Size - FIXED */}
          <div className="flex relative">
            <button
              onClick={(e) => handleToolbarClick(e, () => setShowFontSize(!showFontSize))}
              className={`p-2 rounded transition-all duration-200 ${
                darkMode ? 'text-gray-300 hover:bg-gray-600 hover:text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
              title="Font Size"
            >
              <FaFont className="w-4 h-4" />
            </button>
            {showFontSize && (
              <div 
                className={`absolute top-10 left-0 z-50 p-2 rounded-lg shadow-xl border min-w-28 ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-1">
                  {fontSizes.map((size) => (
                    <button
                      key={size.value}
                      onClick={(e) => {
                        e.stopPropagation();
                        applyFontSize(size.value);
                        setShowFontSize(false);
                      }}
                      className={`block w-full text-left px-2 py-1 rounded text-sm hover:bg-blue-500 hover:text-white transition-all ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Clear Formatting */}
          <div className="flex-1"></div>
          <button
            onClick={(e) => handleToolbarClick(e, clearFormatting)}
            className={`px-3 py-2 rounded text-sm font-medium transition-all ${
              darkMode 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
            title="Clear All Formatting"
          >
            Clear
          </button>
        </div>
      )}

      {/* Enhanced Editable Area */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          role="textbox"
          aria-multiline="true"
          aria-label="Rich Text Editor"
          suppressContentEditableWarning={true}
          onInput={(e) => {
            handleContentChange(e.currentTarget.innerHTML);
            updateEditorState();
          }}
          onPaste={handlePaste}
          onKeyUp={updateEditorState}
          onKeyDown={handleKeyDown}
          onClick={updateEditorState}
          onFocus={() => {
            if (editorRef.current) {
              editorRef.current.classList.add('ring-2', 'ring-blue-500');
            }
          }}
          onBlur={() => {
            if (editorRef.current) {
              editorRef.current.classList.remove('ring-2', 'ring-blue-500');
            }
          }}
          className={`w-full min-h-64 max-h-96 p-6 outline-none text-base leading-relaxed overflow-y-auto transition-all duration-300 ${
            darkMode
              ? "bg-transparent text-white placeholder-gray-400"
              : "bg-transparent text-gray-900 placeholder-gray-500"
          }`}
          style={{ 
            minHeight: '256px',
            textAlign: 'left',
            direction: 'ltr'
          }}
        />
        
        {/* Floating Action Button */}
        {(!content || content === '<br>' || content === '') && (
          <button
            onClick={(e) => handleToolbarClick(e, focusEditor)}
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg ${
              darkMode
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-600 hover:to-purple-700'
                : 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white hover:from-cyan-500 hover:to-purple-600'
            }`}
          >
            <FaFileImage className="inline w-5 h-5 mr-2" />
            Start Writing...
          </button>
        )}
      </div>

      {/* Enhanced Footer */}
      <div
        className={`p-3 border-t ${
          darkMode ? "border-gray-600 bg-gray-700/30" : "border-gray-200 bg-gray-50"
        } text-xs flex justify-between items-center`}
      >
        <div className="flex items-center gap-4">
          <div className={`px-2 py-1 rounded ${
            darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
          }`}>
            Words: <span className="font-semibold">{wordCount}</span>
          </div>
          <div className={`px-2 py-1 rounded ${
            darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
          }`}>
            Characters: <span className="font-semibold">{charCount}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded ${
            darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
          }`}>
            ✓ Rich Text Enabled
          </span>
        </div>
      </div>

      {/* Quick Tips */}
      <div className={`p-2 text-center border-t ${
        darkMode ? 'border-gray-600 text-gray-400' : 'border-gray-200 text-gray-500'
      } text-xs`}>
        💡 <strong>Pro Tip:</strong> Use <kbd>Ctrl+B</kbd> for Bold, <kbd>Ctrl+I</kbd> for Italic, <kbd>Ctrl+U</kbd> for Underline
      </div>
    </div>
  );
};

export default TextNoteEditor;