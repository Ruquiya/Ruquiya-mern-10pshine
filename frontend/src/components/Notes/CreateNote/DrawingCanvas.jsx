import React, { useRef, useState, useEffect } from 'react';

const DrawingCanvas = ({ content, onChange, darkMode }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#3b82f6');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState('brush');

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#000000', '#ffffff'];
  const brushSizes = [1, 3, 5, 8, 12, 20];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 400;
  
    ctx.fillStyle = darkMode ? '#1f2937' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (content) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = content;
    }
  }, [content, darkMode]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.closePath();
    setIsDrawing(false);
    
    // Save drawing
    onChange(canvas.toDataURL());
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = darkMode ? '#1f2937' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    onChange('');
  };

  return (
    <div className={`rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'}`}>
      {/* Toolbar */}
      <div className={`p-3 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'} flex flex-wrap gap-4 items-center`}>
        {/* Tools */}
        <div className="flex gap-2">
          <button 
            onClick={() => setTool('brush')}
            className={`p-2 rounded ${tool === 'brush' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
          >
            🖌️
          </button>
          <button 
            onClick={() => setTool('eraser')}
            className={`p-2 rounded ${tool === 'eraser' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
          >
            🧽
          </button>
        </div>

        {/* Colors */}
        <div className="flex gap-2">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded border-2 ${
                color === c ? 'border-white ring-2 ring-blue-500' : darkMode ? 'border-gray-600' : 'border-gray-300'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Brush Sizes */}
        <div className="flex gap-2 items-center">
          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Size:</span>
          {brushSizes.map((size) => (
            <button
              key={size}
              onClick={() => setBrushSize(size)}
              className={`w-8 h-8 rounded flex items-center justify-center ${
                brushSize === size ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}
            >
              ●
            </button>
          ))}
        </div>

        <div className="flex-1"></div>

        <button 
          onClick={clearCanvas}
          className={`px-3 py-2 rounded ${
            darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
          } text-white text-sm`}
        >
          Clear
        </button>
      </div>

      {/* Canvas */}
      <div className="p-4">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className={`w-full h-64 border-2 ${
            darkMode ? 'border-gray-600' : 'border-gray-300'
          } cursor-crosshair rounded`}
        />
      </div>

      {/* Instructions */}
      <div className={`p-3 border-t ${darkMode ? 'border-gray-600 text-gray-400' : 'border-gray-200 text-gray-500'} text-xs`}>
        💡 Click and drag to draw. Use different colors and brush sizes for variety.
      </div>
    </div>
  );
};

export default DrawingCanvas;