
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400">
          AI Resume Content Generator
        </h1>
        <p className="mt-2 text-md text-gray-600 dark:text-gray-300">
          Transform your raw notes into a professional, achievement-focused resume with the power of AI.
        </p>
      </div>
    </header>
  );
};

export default Header;
