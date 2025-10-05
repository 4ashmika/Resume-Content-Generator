import React from 'react';

interface InputAreaProps {
  rawText: string;
  setRawText: (text: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  hasApiKey: boolean;
  onApiKeyClick: () => void;
}

const InputArea: React.FC<InputAreaProps> = ({ rawText, setRawText, onGenerate, isLoading, hasApiKey, onApiKeyClick }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg h-full flex flex-col">
      <h2 className="text-2xl font-semibold mb-4 text-primary-700 dark:text-primary-300">Your Raw Details</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Paste your name, contact info, work history, education, and skills below. The more detail, the better!
      </p>
      <textarea
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        placeholder="Paste your resume details here..."
        className="flex-grow w-full p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-200 resize-none"
        rows={20}
      />
      
      {!hasApiKey && (
        <div className="mt-4 text-center p-3 bg-amber-100 dark:bg-amber-900/30 rounded-md border border-amber-400/50">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Please set your Google Gemini API key to enable generation.
          </p>
          <button onClick={onApiKeyClick} className="mt-1 text-sm font-bold text-primary-600 dark:text-primary-400 hover:underline">
            Set API Key
          </button>
        </div>
      )}

      <button
        onClick={onGenerate}
        disabled={isLoading || !hasApiKey}
        className="mt-6 w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          'Generate Resume Content'
        )}
      </button>
    </div>
  );
};

export default InputArea;
