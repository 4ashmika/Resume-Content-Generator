import React, { useState, useEffect } from 'react';
import KeyIcon from './icons/KeyIcon';
import XIcon from './icons/XIcon';

interface ApiKeyModalProps {
  isOpen: boolean;
  onSave: (apiKey: string) => void;
  onClose: () => void;
  currentKey: string;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onSave, onClose, currentKey }) => {
  const [localApiKey, setLocalApiKey] = useState('');

  useEffect(() => {
    if (isOpen) {
        setLocalApiKey(currentKey);
    }
  }, [isOpen, currentKey]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    onSave(localApiKey);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md animate-fade-in-up relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" aria-label="Close modal">
          <XIcon className="w-6 h-6" />
        </button>
        <div className="flex items-center mb-4">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-full mr-4 flex-shrink-0">
            <KeyIcon className="w-6 h-6 text-primary-600 dark:text-primary-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Set Your Gemini API Key</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
          To use this application, you need a Google Gemini API key. Your key is stored securely in your browser's session storage and is not sent to any server.
        </p>
        <input
          type="password"
          value={localApiKey}
          onChange={(e) => setLocalApiKey(e.target.value)}
          placeholder="Enter your API key here"
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-primary-500 focus:border-primary-500"
          aria-label="Gemini API Key"
        />
        <a 
          href="https://aistudio.google.com/app/apikey" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-primary-600 dark:text-primary-400 hover:underline mt-2 inline-block"
        >
          Get an API key from Google AI Studio &rarr;
        </a>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={!localApiKey.trim()}
            className="bg-primary-600 text-white font-bold py-2 px-6 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Save Key
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
