import React, { forwardRef } from 'react';
import { ResumeData } from '../types';
import MailIcon from './icons/MailIcon';
import PhoneIcon from './icons/PhoneIcon';
import LinkedinIcon from './icons/LinkedinIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import AcademicCapIcon from './icons/AcademicCapIcon';


interface CvPreviewProps {
  data: ResumeData;
  theme: 'light' | 'dark';
  primaryColor: string;
  includedSections?: {
    summary: boolean;
    experience: boolean;
    education: boolean;
    skills: boolean;
  }
}

const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};


const CvPreview = forwardRef<HTMLDivElement, CvPreviewProps>(({ data, theme, primaryColor, includedSections }, ref) => {
  const { personalInfo, summary, experience, education, skills } = data;

  const skillTagStyle = {
    backgroundColor: hexToRgba(primaryColor, 0.15),
    color: primaryColor,
  };
  
  const showSection = (section: keyof NonNullable<CvPreviewProps['includedSections']>) => {
    return includedSections?.[section] ?? true;
  }

  return (
    <div ref={ref} className={`w-full p-8 font-sans text-sm rounded-lg shadow-2xl transition-colors duration-300 ${
        theme === 'dark' 
          ? 'dark bg-slate-800 text-slate-300' 
          : 'bg-white text-gray-700'
      }`}>
      {/* Header */}
      <header className="text-center border-b-2 dark:border-slate-600 pb-6 mb-6" style={{ borderColor: theme === 'light' ? hexToRgba(primaryColor, 0.2) : hexToRgba(primaryColor, 0.5) }}>
        <h1 className="text-4xl font-bold tracking-tight" style={{ color: primaryColor }}>{personalInfo.name}</h1>
        <h2 className="text-xl font-semibold text-gray-600 dark:text-slate-400 mt-2">{personalInfo.title}</h2>
        <div className="flex justify-center items-center gap-x-6 gap-y-2 mt-4 text-gray-500 dark:text-slate-400 flex-wrap">
          <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" style={{'--hover-color': primaryColor} as React.CSSProperties} onMouseOver={e => e.currentTarget.style.color = primaryColor} onMouseOut={e => e.currentTarget.style.color = ''}>
            <MailIcon className="w-4 h-4 flex-shrink-0" />
            <span>{personalInfo.email}</span>
          </a>
          <div className="flex items-center gap-2">
            <PhoneIcon className="w-4 h-4 flex-shrink-0" />
            <span>{personalInfo.phone}</span>
          </div>
          <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" style={{'--hover-color': primaryColor} as React.CSSProperties} onMouseOver={e => e.currentTarget.style.color = primaryColor} onMouseOut={e => e.currentTarget.style.color = ''}>
            <LinkedinIcon className="w-4 h-4 flex-shrink-0" />
            <span>{personalInfo.linkedin.replace('https://', '').replace('www.','')}</span>
          </a>
        </div>
      </header>

      {/* Summary */}
      {showSection('summary') && (
        <section className="mb-6">
            <h3 className="text-xl font-bold border-b border-gray-200 dark:border-slate-700 pb-2 mb-3" style={{ color: primaryColor }}>Professional Summary</h3>
            <p className="leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {showSection('experience') && (
        <section className="mb-6">
            <h3 className="text-xl font-bold border-b border-gray-200 dark:border-slate-700 pb-2 mb-4 flex items-center gap-3" style={{ color: primaryColor }}>
            <BriefcaseIcon className="w-5 h-5 flex-shrink-0" />
            Work Experience
            </h3>
            <div className="space-y-4">
              {experience.map((job, index) => (
              <div key={index} className="pl-4 border-l-2" style={{borderColor: hexToRgba(primaryColor, 0.4)}}>
                  <div className="flex justify-between items-baseline">
                  <h4 className="text-lg font-bold text-gray-800 dark:text-slate-100">{job.title}</h4>
                  <p className="text-sm font-medium text-gray-500 dark:text-slate-400">{job.dates}</p>
                  </div>
                  <p className="text-md font-semibold" style={{ color: primaryColor }}>{job.company}</p>
                  <ul className="mt-2 list-disc list-inside text-gray-600 dark:text-slate-300 space-y-1">
                  {job.achievements.map((ach, i) => (
                      <li key={i}>{ach}</li>
                  ))}
                  </ul>
              </div>
              ))}
            </div>
        </section>
      )}
      
      {/* Education */}
      {showSection('education') && (
        <section className="mb-6">
            <h3 className="text-xl font-bold border-b border-gray-200 dark:border-slate-700 pb-2 mb-4 flex items-center gap-3" style={{ color: primaryColor }}>
            <AcademicCapIcon className="w-6 h-6 flex-shrink-0" />
            Education
            </h3>
            <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index} className="pl-4 border-l-2" style={{borderColor: hexToRgba(primaryColor, 0.4)}}>
                  <div className="flex justify-between items-baseline">
                      <h4 className="text-lg font-bold text-gray-800 dark:text-slate-100">{edu.institution}</h4>
                      <p className="text-sm font-medium text-gray-500 dark:text-slate-400">{edu.dates}</p>
                  </div>
                  <p className="text-md italic text-gray-600 dark:text-slate-400">{edu.degree}</p>
                  {edu.details && <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">{edu.details}</p>}
              </div>
            ))}
            </div>
        </section>
      )}

      {/* Skills */}
      {showSection('skills') && (
        <section>
            <h3 className="text-xl font-bold border-b border-gray-200 dark:border-slate-700 pb-2 mb-4" style={{ color: primaryColor }}>Skills</h3>
            <div className="space-y-4">
                {Object.entries(skills).map(([category, skillList]) => {
                    if (!Array.isArray(skillList) || skillList.length === 0) {
                        return null;
                    }
                    return (
                        <div key={category}>
                            <h4 className="font-semibold tracking-wider uppercase text-xs text-gray-600 dark:text-slate-400 mb-2">{category}</h4>
                            <div className="flex flex-wrap gap-2">
                                {skillList.map((skill, i) => (
                                    <span key={i} className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={skillTagStyle}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
      )}
    </div>
  );
});

CvPreview.displayName = 'CvPreview';

export default CvPreview;
