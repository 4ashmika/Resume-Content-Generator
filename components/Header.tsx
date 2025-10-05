import React from 'react';
import KeyIcon from './icons/KeyIcon';

interface HeaderProps {
  onApiKeyClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onApiKeyClick }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-6 text-center relative">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400">
          AI Resume Content Generator
        </h1>
        <p className="mt-2 text-md text-gray-600 dark:text-gray-300">
          Transform your raw notes into a professional, achievement-focused resume with the power of AI.
        </p>
         <button
            onClick={onApiKeyClick}
            className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Set API Key"
            aria-label="Set API Key"
        >
            <KeyIcon className="w-4 h-4" />
            <span>API Key</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
