import { ResourceType } from '@prisma/client';

export const resourcesData = [
  { title: "CS50: Introduction to Computer Science", type: ResourceType.COURSE, url: "https://cs50.harvard.edu/", category: "Engineering & Technology", provider: "Harvard / edX", difficulty: "Beginner", isFree: true, isFeatured: true },
  { title: "Khan Academy - Career Exploration", type: ResourceType.COURSE, url: "https://www.khanacademy.org/", category: "General", provider: "Khan Academy", isFree: true },
  { title: "How to Choose the Right Career Path", type: ResourceType.ARTICLE, url: "https://example.com/blog/choose-career", category: "General", provider: "PathFinder Blog" },
  { title: "Understanding the RIASEC Model", type: ResourceType.ARTICLE, url: "https://example.com/blog/riasec", category: "Assessment", provider: "PathFinder Blog" },
  { title: "JEE Main Preparation Guide 2025", type: ResourceType.ARTICLE, url: "https://example.com/blog/jee-guide", category: "Engineering & Technology", provider: "PathFinder Blog" },
  { title: "NEET UG Complete Preparation Strategy", type: ResourceType.ARTICLE, url: "https://example.com/blog/neet-strategy", category: "Medical & Healthcare", provider: "PathFinder Blog" },
  { title: "Introduction to Financial Accounting", type: ResourceType.COURSE, url: "https://www.coursera.org/", category: "Business & Finance", provider: "Coursera", isFree: false },
  { title: "Google UX Design Certificate", type: ResourceType.COURSE, url: "https://grow.google/certificates/ux-design/", category: "Creative & Design", provider: "Google", isFree: false },
  { title: "freeCodeCamp Web Development", type: ResourceType.COURSE, url: "https://www.freecodecamp.org/", category: "Engineering & Technology", provider: "freeCodeCamp", isFree: true, isFeatured: true },
  { title: "UPSC CSE: Complete Guide for Beginners", type: ResourceType.ARTICLE, url: "https://example.com/blog/upsc-guide", category: "Government & Defence", provider: "PathFinder Blog" },
  { title: "Fundamentals of Anatomy & Physiology", type: ResourceType.VIDEO, url: "https://youtube.com/", category: "Medical & Healthcare", provider: "CrashCourse", isFree: true },
  { title: "CLAT 2025: Exam Pattern & Syllabus", type: ResourceType.ARTICLE, url: "https://example.com/blog/clat-prep", category: "Law", provider: "LegalEdge", isFree: true },
  { title: "NIFT Entrance Coaching Videos", type: ResourceType.VIDEO, url: "https://youtube.com/", category: "Creative & Design", provider: "Creative Edge", isFree: true },
  { title: "NDA Mathematics Preparation", type: ResourceType.COURSE, url: "https://unacademy.com/", category: "Government & Defence", provider: "Unacademy", isFree: false },
  { title: "National Scholarship Portal (NSP) Guide", type: ResourceType.ARTICLE, url: "https://scholarships.gov.in/", category: "Scholarship", provider: "Govt of India", isFree: true },
  { title: "INSPIRE Scholarship for Higher Education", type: ResourceType.WEBINAR, url: "https://online-inspire.gov.in/", category: "Scholarship", provider: "DST", isFree: true },
  { title: "Let Us C by Yashavant Kanetkar", type: ResourceType.BOOK, url: "https://amazon.in/", category: "Engineering & Technology", provider: "BPB Publications", isFree: false },
  { title: "Quantitative Aptitude for Competitive Examinations", type: ResourceType.BOOK, url: "https://amazon.in/", category: "General", provider: "R.S. Aggarwal", isFree: false },
  { title: "Honestly by Tanmay Bhat - Finance for Beginners", type: ResourceType.VIDEO, url: "https://youtube.com/", category: "Business & Finance", provider: "Tanmay Bhat", isFree: true },
  { title: "Psychology Fact vs Fiction", type: ResourceType.VIDEO, url: "https://youtube.com/", category: "Medical & Healthcare", provider: "SciShow Psych", isFree: true }
];
