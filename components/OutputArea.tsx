import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import Loader from './Loader';
import ClipboardIcon from './icons/ClipboardIcon';
import CheckIcon from './icons/CheckIcon';
import DownloadIcon from './icons/DownloadIcon';
import CvPreview from './CvPreview';
import { ResumeData } from '../types';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';
import PrinterIcon from './icons/PrinterIcon';
import XIcon from './icons/XIcon';

// Declare global libraries loaded via CDN
declare const html2canvas: any;
declare const jspdf: any;

interface OutputAreaProps {
  jsonContent: string;
  resumeData: ResumeData | null;
  isLoading: boolean;
  error: string | null;
  cvTheme: 'light' | 'dark';
  setCvTheme: (theme: 'light' | 'dark') => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
}

type ActiveTab = 'preview' | 'json';

interface ExportOptions {
    paperSize: 'a4' | 'letter' | 'legal';
    orientation: 'portrait' | 'landscape';
    theme: 'light' | 'dark';
    includeSummary: boolean;
    includeExperience: boolean;
    includeEducation: boolean;
    includeSkills: boolean;
}

const OutputArea: React.FC<OutputAreaProps> = ({ jsonContent, resumeData, isLoading, error, cvTheme, setCvTheme, primaryColor, setPrimaryColor }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('preview');
  const [isExporting, setIsExporting] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    paperSize: 'a4',
    orientation: 'portrait',
    theme: 'light',
    includeSummary: true,
    includeExperience: true,
    includeEducation: true,
    includeSkills: true,
  });

  const cvPreviewRef = useRef<HTMLDivElement>(null);
  const exportRenderRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (jsonContent) {
      setCopied(false);
    }
    if (resumeData) {
        setActiveTab('preview');
    }
  }, [jsonContent, resumeData]);

  // Effect to run the PDF export process after the hidden component has rendered
  useEffect(() => {
    if (!isExporting || !exportRenderRef.current || !resumeData) return;

    const performPdfExport = async () => {
        const input = exportRenderRef.current?.firstChild as HTMLElement;
        if (!input) {
            console.error("Could not find the element to export.");
            setIsExporting(false);
            return;
        }

        try {
            // Ensure we capture from the top of the element
            window.scrollTo(0, 0);
            const canvas = await html2canvas(input, {
                scale: 3, // Higher scale for better resolution and crisper fonts
                useCORS: true,
                logging: false,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jspdf.jsPDF({
                orientation: exportOptions.orientation,
                unit: 'mm',
                format: exportOptions.paperSize,
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            const pdfRatio = pdfWidth / pdfHeight;
            const imgRatio = imgWidth / imgHeight;

            let finalImgWidth, finalImgHeight;

            // Calculate the final dimensions to fit the page while maintaining aspect ratio
            if (imgRatio > pdfRatio) {
                // Image is wider relative to the page, so width is the limiting factor
                finalImgWidth = pdfWidth;
                finalImgHeight = pdfWidth / imgRatio;
            } else {
                // Image is taller or equal relative to the page, so height is the limiting factor
                finalImgHeight = pdfHeight;
                finalImgWidth = pdfHeight * imgRatio;
            }

            // Calculate offsets to center the image on the page
            const xOffset = (pdfWidth - finalImgWidth) / 2;
            const yOffset = (pdfHeight - finalImgHeight) / 2;
            
            // Add the perfectly scaled and centered image to the PDF
            pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalImgWidth, finalImgHeight);
            
            pdf.save('resume.pdf');

        } catch (e) {
            console.error("Error exporting to PDF:", e);
        } finally {
            setIsExporting(false); // Reset export state
        }
    };

    // A short timeout allows the DOM to update with the hidden div before we capture it.
    setTimeout(performPdfExport, 100);

  }, [isExporting, resumeData, exportOptions, primaryColor]);


  const handleCopy = () => {
    if (jsonContent) {
      navigator.clipboard.writeText(jsonContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (jsonContent) {
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleConfirmExport = () => {
      setIsExportModalOpen(false);
      setIsExporting(true); // This will trigger the useEffect for exporting
  };

  const handleThemeToggle = () => {
    setCvTheme(cvTheme === 'light' ? 'dark' : 'light');
  };

  const TabButton: React.FC<{tabName: ActiveTab, children: React.ReactNode}> = ({ tabName, children }) => (
      <button
          onClick={() => setActiveTab(tabName)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tabName
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
      >
          {children}
      </button>
  );

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex items-center justify-center h-full"><Loader /></div>;
    }
    if (error) {
      return (
        <div className="text-red-500 bg-red-100 dark:bg-red-900/20 p-4 rounded-md border border-red-500/50">
          <h3 className="font-bold">Error</h3>
          <p>{error}</p>
        </div>
      );
    }
    if (resumeData && jsonContent) {
      return (
        <div className="w-full h-full flex flex-col">
          <div className="flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-900/50 rounded-t-md border-b border-gray-200 dark:border-gray-600">
             <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <TabButton tabName="preview">CV Preview</TabButton>
                    <TabButton tabName="json">JSON</TabButton>
                </div>
                {activeTab === 'preview' && (
                  <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setIsExportModalOpen(true)}
                        disabled={isExporting}
                        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        title="Export as PDF"
                    >
                        {isExporting ? (
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                           <PrinterIcon className="h-5 w-5" />
                        )}
                    </button>
                    <div className="relative">
                       <label htmlFor="color-picker" className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer" style={{ backgroundColor: primaryColor }} title="Change accent color">
                         <span className="sr-only">Change accent color</span>
                       </label>
                      <input
                        id="color-picker"
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                    <button
                        onClick={handleThemeToggle}
                        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        title={`Switch to ${cvTheme === 'light' ? 'dark' : 'light'} mode`}
                        aria-label="Toggle CV theme"
                    >
                        {cvTheme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
                    </button>
                  </div>
                )}
             </div>
          </div>
          <div className="flex-grow overflow-auto p-4 bg-gray-200 dark:bg-gray-900">
             {activeTab === 'preview' && <CvPreview ref={cvPreviewRef} data={resumeData} theme={cvTheme} primaryColor={primaryColor} />}
             {activeTab === 'json' && (
                <div className="relative bg-gray-50 dark:bg-gray-700 p-4 rounded-b-md h-full">
                    <div className="absolute top-2 right-2 flex items-center space-x-2">
                        <button
                            onClick={handleDownload}
                            className="p-2 rounded-md bg-gray-200/50 dark:bg-gray-800/50 hover:bg-gray-300/70 dark:hover:bg-gray-600/70 transition-colors"
                            title="Download JSON file"
                        >
                            <DownloadIcon className="h-5 w-5" />
                        </button>
                        <button
                            onClick={handleCopy}
                            className="p-2 rounded-md bg-gray-200/50 dark:bg-gray-800/50 hover:bg-gray-300/70 dark:hover:bg-gray-600/70 transition-colors"
                            title="Copy to clipboard"
                        >
                            {copied ? <CheckIcon className="h-5 w-5 text-green-500" /> : <ClipboardIcon className="h-5 w-5" />}
                        </button>
                    </div>
                    <pre className="bg-transparent p-0 text-sm whitespace-pre-wrap break-words h-full overflow-auto">
                        <code>{jsonContent}</code>
                    </pre>
                </div>
             )}
          </div>
        </div>
      );
    }
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        <p>Your generated resume JSON will appear here.</p>
        <p className="mt-2 text-sm">A visual preview will also be available.</p>
      </div>
    );
  };

  const includedSections = {
      summary: exportOptions.includeSummary,
      experience: exportOptions.includeExperience,
      education: exportOptions.includeEducation,
      skills: exportOptions.includeSkills,
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg h-full flex flex-col">
      <h2 className="text-2xl font-semibold mb-4 text-primary-700 dark:text-primary-300">Generated Output</h2>
      <div className="flex-grow w-full bg-gray-50 dark:bg-gray-700 rounded-md flex items-center justify-center min-h-[300px] overflow-hidden">
        {renderContent()}
      </div>
      
      {/* Hidden renderer for PDF export */}
      {isExporting && resumeData && (
          <div ref={exportRenderRef} style={{ width: '800px', position: 'absolute', top: 0, left: '-9999px', zIndex: -1 }}>
              <CvPreview 
                  data={resumeData} 
                  theme={exportOptions.theme}
                  primaryColor={primaryColor}
                  includedSections={includedSections}
              />
          </div>
      )}

      {/* Export Options Modal */}
      {isExportModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md animate-fade-in-up">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Export Options</h3>
                      <button onClick={() => setIsExportModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                          <XIcon className="w-6 h-6" />
                      </button>
                  </div>

                  <div className="space-y-6">
                      {/* Paper Size */}
                      <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Paper Size</label>
                          <select value={exportOptions.paperSize} onChange={e => setExportOptions(prev => ({...prev, paperSize: e.target.value as ExportOptions['paperSize']}))} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-primary-500 focus:border-primary-500">
                              <option value="a4">A4</option>
                              <option value="letter">Letter</option>
                              <option value="legal">Legal</option>
                          </select>
                      </div>

                      {/* Orientation */}
                      <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Orientation</label>
                          <div className="flex space-x-4">
                              <label className="flex items-center">
                                  <input type="radio" name="orientation" value="portrait" checked={exportOptions.orientation === 'portrait'} onChange={e => setExportOptions(prev => ({...prev, orientation: e.target.value as ExportOptions['orientation']}))} className="form-radio text-primary-600 focus:ring-primary-500" />
                                  <span className="ml-2">Portrait</span>
                              </label>
                              <label className="flex items-center">
                                  <input type="radio" name="orientation" value="landscape" checked={exportOptions.orientation === 'landscape'} onChange={e => setExportOptions(prev => ({...prev, orientation: e.target.value as ExportOptions['orientation']}))} className="form-radio text-primary-600 focus:ring-primary-500" />
                                  <span className="ml-2">Landscape</span>
                              </label>
                          </div>
                      </div>

                      {/* Theme */}
                      <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
                          <div className="flex space-x-4">
                              <label className="flex items-center">
                                  <input type="radio" name="theme" value="light" checked={exportOptions.theme === 'light'} onChange={e => setExportOptions(prev => ({...prev, theme: e.target.value as ExportOptions['theme']}))} className="form-radio text-primary-600 focus:ring-primary-500" />
                                  <span className="ml-2">Light</span>
                              </label>
                              <label className="flex items-center">
                                  <input type="radio" name="theme" value="dark" checked={exportOptions.theme === 'dark'} onChange={e => setExportOptions(prev => ({...prev, theme: e.target.value as ExportOptions['theme']}))} className="form-radio text-primary-600 focus:ring-primary-500" />
                                  <span className="ml-2">Dark</span>
                              </label>
                          </div>
                      </div>

                      {/* Sections to Include */}
                      <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sections to Include</label>
                          <div className="grid grid-cols-2 gap-2">
                              {(Object.keys(exportOptions) as Array<keyof typeof exportOptions>)
                                // FIX: Cast key to string to use string methods.
                                .filter(k => String(k).startsWith('include'))
                                .map(key => (
                                  <label key={key} className="flex items-center">
                                      <input type="checkbox" checked={exportOptions[key] as boolean} onChange={e => setExportOptions(prev => ({...prev, [key]: e.target.checked}))} className="form-checkbox text-primary-600 rounded focus:ring-primary-500" />
                                      {/* FIX: Cast key to string to use string methods. */}
                                      <span className="ml-2 capitalize">{String(key).replace('include', '')}</span>
                                  </label>
                              ))}
                          </div>
                      </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                      <button 
                          onClick={handleConfirmExport}
                          className="bg-primary-600 text-white font-bold py-2 px-6 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 transition-colors"
                      >
                          Confirm & Export
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default OutputArea;