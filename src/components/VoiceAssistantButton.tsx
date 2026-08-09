import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceAssistantButtonProps {
  onSpeechResult: (text: string) => void;
  className?: string;
}

export const VoiceAssistantButton: React.FC<VoiceAssistantButtonProps> = ({
  onSpeechResult,
  className = '',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSupported(false);
    }
  }, []);

  const toggleListen = () => {
    if (!supported) {
      alert('Speech recognition Web API is not supported in this browser environment.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onSpeechResult(transcript);
        setIsListening(false);
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech Recognition error', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition error', err);
      setIsListening(false);
    }
  };

  return (
    <button
      onClick={toggleListen}
      title={isListening ? 'Listening... click to stop' : 'Voice Assistant Speech Command'}
      className={`p-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold ${
        isListening
          ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-900/50'
          : 'bg-[#080b12] hover:bg-slate-800 text-blue-400 border border-slate-800'
      } ${className}`}
    >
      {isListening ? <Mic className="w-4 h-4 text-white animate-bounce" /> : <Mic className="w-4 h-4 text-blue-400" />}
      <span className="hidden sm:inline text-[11px]">
        {isListening ? 'Listening...' : 'Voice AI'}
      </span>
    </button>
  );
};
