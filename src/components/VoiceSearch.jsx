import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const VoiceSearch = ({ onVoiceResult }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const handleStart = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: false });
  };

  const handleStop = () => {
    SpeechRecognition.stopListening();
    if (transcript) {
      onVoiceResult(transcript);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser doesn’t support voice input.</span>;
  }

  return (
    <div className="flex items-center gap-2 mt-2">
      <button
        type="button"
        onClick={handleStart}
        className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
      >
        🎙️ Start
      </button>
      <button
        type="button"
        onClick={handleStop}
        className="px-3 py-1 rounded bg-gray-300 text-black hover:bg-gray-400"
      >
        ⏹ Stop
      </button>
      <span className="text-sm text-gray-600 dark:text-gray-300">
        {listening ? 'Listening...' : transcript}
      </span>
    </div>
  );
};

export default VoiceSearch;
