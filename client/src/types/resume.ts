export type ResumeTemplate = 'classic' | 'modern' | 'minimal' | 'professional'

export interface Resume {
  id: string
  userId: string
  title: string
  template: ResumeTemplate
  data: ResumeData
  isDefault: boolean
  lastEdited: string
  createdAt: string
  updatedAt: string
}

export interface ResumeSummary {
  id: string
  title: string
  template: ResumeTemplate
  isDefault: boolean
  lastEdited: string
  createdAt: string
}

export interface ResumeData {
  personalInfo: PersonalInfo
  education: Education[]
  experience: Experience[]
  skills: Skills
  projects: Project[]
  certifications: Certification[]
  achievements: Achievement[]
  extraCurricular: ExtraCurricular[]
}

export interface PersonalInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  portfolio: string
  summary: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  startDate: string
  endDate: string
  grade: string
  current: boolean
  highlights: string[]
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  location: string
  description: string[]
}

export interface Skills {
  technical: string[]
  soft: string[]
  tools: string[]
  languages: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  link: string
  liveUrl: string
  startDate: string
  endDate: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  credentialUrl: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  date: string
}

export interface ExtraCurricular {
  id: string
  activity: string
  description: string
  duration: string
}

export const defaultResumeData: ResumeData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    summary: '',
  },
  education: [],
  experience: [],
  skills: {
    technical: [],
    soft: [],
    tools: [],
    languages: [],
  },
  projects: [],
  certifications: [],
  achievements: [],
  extraCurricular: [],
}
