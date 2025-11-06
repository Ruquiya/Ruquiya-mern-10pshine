import React, { useState, useRef, useEffect } from 'react';

const AudioRecorder = ({ content, onChange, darkMode }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(content || '');
  const [recordingTime, setRecordingTime] = useState(0);
  const [isSupported, setIsSupported] = useState(true); // Track codec support
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  // Check if the browser supports WebM/Opus
  useEffect(() => {
    const audio = new Audio();
    const isWebMSupported = !!audio.canPlayType('audio/webm;codecs=opus');
    setIsSupported(isWebMSupported);
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      });
      streamRef.current = stream;

      // Try WebM first, fallback to other formats if unsupported
      const mimeType = isSupported ? 'audio/webm;codecs=opus' : 'audio/mp3';
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: mimeType 
        });
        
        // Convert to base64 data URL
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result;
          setAudioURL(dataUrl);
          onChange(dataUrl);
        };
        reader.readAsDataURL(audioBlob);

        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.start(100); 
      setIsRecording(true);
      
      // Start timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Microphone access denied. Please allow microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const deleteRecording = () => {
    setAudioURL('');
    onChange('');
    setRecordingTime(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className={`rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'}`}>
      {/* Controls */}
      <div className="p-6 text-center">
        {!audioURL ? (
          <div className="space-y-4">
            <div className={`text-6xl mb-4 ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>
              🎤
            </div>
            
            <div className={`text-2xl font-mono mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {formatTime(recordingTime)}
            </div>

            {!isRecording ? (
              <button
                onClick={startRecording}
                className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full text-lg font-semibold hover:from-red-600 hover:to-pink-700 transition-all transform hover:scale-105"
              >
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="px-8 py-4 bg-gray-600 text-white rounded-full text-lg font-semibold hover:bg-gray-700 transition-all"
              >
                Stop Recording
              </button>
            )}

            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {isRecording ? 'Recording in progress...' : 'Click to start recording your voice note'}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-6xl text-green-500">✅</div>
            <audio controls className="w-full max-w-md mx-auto">
              <source src={audioURL} type={isSupported ? 'audio/webm' : 'audio/mp3'} />
              {!isSupported && (
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Your browser does not support WebM audio. Try a different browser or format.
                </p>
              )}
            </audio>
            <div className="flex gap-3 justify-center">
              <button
                onClick={deleteRecording}
                className={`px-4 py-2 rounded-lg ${
                  darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
                } text-white`}
              >
                Delete
              </button>
              <button
                onClick={startRecording}
                className={`px-4 py-2 rounded-lg ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Record Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Visualization */}
      {isRecording && (
        <div className="p-4">
          <div className="flex items-end justify-center gap-1 h-16">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="w-2 bg-gradient-to-t from-red-400 to-red-600 rounded-t animate-pulse"
                style={{
                  height: `${Math.random() * 40 + 10}px`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: `${0.5 + Math.random() * 0.5}s`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className={`p-3 border-t ${darkMode ? 'border-gray-600 text-gray-400' : 'border-gray-200 text-gray-500'} text-xs`}>
        💡 Make sure you allow microphone access. Recording quality may vary based on your device.
        {!isSupported && ' For best results, use a browser that supports WebM audio (e.g., Chrome, Firefox).'}
      </div>
    </div>
  );
};

export default AudioRecorder;