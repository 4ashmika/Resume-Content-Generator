
export interface PersonalInfo {
  name: string;
  title: string;
  phone: string;
  email: string;
  linkedin: string;
}

export interface Experience {
  title: string;
  company: string;
  dates: string;
  achievements: string[];
}

export interface Education {
  institution: string;
  degree: string;
  dates: string;
  details: string;
}

export interface Skills {
  Technical: string[];
  Soft: string[];
  Certifications: string[];
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skills;
}
