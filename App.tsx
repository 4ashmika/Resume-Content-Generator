import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import InputArea from './components/InputArea';
import OutputArea from './components/OutputArea';
import { generateResumeJson } from './services/geminiService';
import { PLACEHOLDER_TEXT } from './constants';
import { ResumeData } from './types';

const App: React.FC = () => {
  const [rawText, setRawText] = useState<string>(PLACEHOLDER_TEXT);
  const [generatedJson, setGeneratedJson] = useState<string>('');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cvTheme, setCvTheme] = useState<'light' | 'dark'>('light');
  const [primaryColor, setPrimaryColor] = useState<string>('#0D9488'); // Default primary color

  const handleGenerate = useCallback(async () => {
    if (!rawText.trim() || rawText.trim() === PLACEHOLDER_TEXT.trim()) {
      setError('Please enter your resume details before generating.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedJson('');
    setResumeData(null);

    try {
      const result = await generateResumeJson(rawText);
      // Attempt to parse and then stringify to format it nicely
      const parsedJson = JSON.parse(result);
      setResumeData(parsedJson);
      setGeneratedJson(JSON.stringify(parsedJson, null, 2));
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(`Failed to generate resume. Please check your input and try again. Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [rawText]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InputArea
            rawText={rawText}
            setRawText={setRawText}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
          <OutputArea
            jsonContent={generatedJson}
            resumeData={resumeData}
            isLoading={isLoading}
            error={error}
            cvTheme={cvTheme}
            setCvTheme={setCvTheme}
            primaryColor={primaryColor}
            setPrimaryColor={setPrimaryColor}
          />
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-gray-500">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;