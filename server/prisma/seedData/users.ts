import { Role, Gender, EducationLevel, Stream } from '@prisma/client';
import bcrypt from 'bcryptjs';

const hashPassword = (password: string) => bcrypt.hashSync(password, 10);

export const usersData = [
  {
    email: 'admin@pathfinder.in',
    passwordHash: hashPassword('Password@123'),
    firstName: 'Rajesh',
    lastName: 'Kumar',
    role: Role.ADMIN,
    isActive: true,
  },
  {
    email: 'priya.sharma@gmail.com',
    passwordHash: hashPassword('Password@123'),
    firstName: 'Priya',
    lastName: 'Sharma',
    role: Role.STUDENT,
    isActive: true,
    studentProfile: {
      create: {
        educationLevel: EducationLevel.CLASS_12,
        stream: Stream.SCIENCE_PCM,
        institution: 'DPS New Delhi',
        board: 'CBSE',
        skills: ['Mathematics', 'Physics', 'Coding', 'Problem Solving'],
        interests: ['Technology', 'Space Science', 'Robotics'],
        city: 'New Delhi',
        state: 'Delhi',
        profileCompletion: 80,
      },
    },
  },
  {
    email: 'arjun.patel@gmail.com',
    passwordHash: hashPassword('Password@123'),
    firstName: 'Arjun',
    lastName: 'Patel',
    role: Role.STUDENT,
    isActive: true,
    studentProfile: {
      create: {
        educationLevel: EducationLevel.CLASS_12,
        stream: Stream.COMMERCE,
        institution: "St. Xavier's Ahmedabad",
        board: 'CBSE',
        skills: ['Accounting', 'Economics', 'Communication', 'Leadership'],
        interests: ['Business', 'Finance', 'Entrepreneurship'],
        city: 'Ahmedabad',
        state: 'Gujarat',
        profileCompletion: 75,
      },
    },
  },
  {
    email: 'ananya.reddy@gmail.com',
    passwordHash: hashPassword('Password@123'),
    firstName: 'Ananya',
    lastName: 'Reddy',
    role: Role.STUDENT,
    isActive: true,
    studentProfile: {
      create: {
        educationLevel: EducationLevel.CLASS_11,
        stream: Stream.SCIENCE_PCB,
        institution: 'Narayana Junior College',
        board: 'State Board',
        skills: ['Biology', 'Chemistry', 'Research', 'Empathy'],
        interests: ['Medicine', 'Psychology', 'Social Work'],
        city: 'Hyderabad',
        state: 'Telangana',
        profileCompletion: 85,
      },
    },
  },
  {
    email: 'rahul.verma@gmail.com',
    passwordHash: hashPassword('Password@123'),
    firstName: 'Rahul',
    lastName: 'Verma',
    role: Role.STUDENT,
    isActive: true,
    studentProfile: {
      create: {
        educationLevel: EducationLevel.UNDERGRADUATE,
        stream: Stream.OTHER,
        institution: 'NIT Trichy',
        skills: ['Python', 'JavaScript', 'Data Structures', 'Machine Learning'],
        interests: ['AI', 'Startups', 'Gaming'],
        city: 'Tiruchirappalli',
        state: 'Tamil Nadu',
        profileCompletion: 90,
      },
    },
  },
  {
    email: 'sneha.das@gmail.com',
    passwordHash: hashPassword('Password@123'),
    firstName: 'Sneha',
    lastName: 'Das',
    role: Role.STUDENT,
    isActive: true,
    studentProfile: {
      create: {
        educationLevel: EducationLevel.CLASS_12,
        stream: Stream.ARTS_HUMANITIES,
        institution: 'La Martiniere Kolkata',
        board: 'ICSE',
        skills: ['Writing', 'Painting', 'Public Speaking', 'Creativity'],
        interests: ['Journalism', 'Film Making', 'Literature'],
        city: 'Kolkata',
        state: 'West Bengal',
        profileCompletion: 80,
      },
    },
  },
  {
    email: 'dr.meera.nair@pathfinder.in',
    passwordHash: hashPassword('Password@123'),
    firstName: 'Meera',
    lastName: 'Nair',
    role: Role.COUNSELLOR,
    isActive: true,
    counsellorProfile: {
      create: {
        specializations: ['Career Counselling', 'Psychology', 'Student Wellness', 'STEM Guidance'],
        qualifications: [
          'Ph.D. Clinical Psychology — NIMHANS',
          'M.A. Counselling Psychology — TISS Mumbai',
          'Certified Career Counsellor — NCDA',
        ],
        experienceYears: 12,
        hourlyRate: 800,
        rating: 4.8,
        totalSessions: 342,
        bio: 'Dr. Meera Nair has over 12 years of experience in career counselling and student psychology. Having worked with 5000+ students across India, she specializes in helping students discover their strengths through psychometric assessments and guided exploration. She is particularly experienced with students confused between engineering, medicine, and emerging career paths.',
        isVerified: true,
        availableSlots: {
          monday: [
            { start: '09:00', end: '12:00' },
            { start: '14:00', end: '17:00' },
          ],
          tuesday: [
            { start: '10:00', end: '13:00' },
            { start: '15:00', end: '18:00' },
          ],
          wednesday: [{ start: '09:00', end: '12:00' }],
          thursday: [
            { start: '10:00', end: '13:00' },
            { start: '14:00', end: '16:00' },
          ],
          friday: [
            { start: '09:00', end: '11:00' },
            { start: '14:00', end: '17:00' },
          ],
        },
      },
    },
  },
  {
    email: 'prof.sanjay.gupta@pathfinder.in',
    passwordHash: hashPassword('Password@123'),
    firstName: 'Sanjay',
    lastName: 'Gupta',
    role: Role.COUNSELLOR,
    isActive: true,
    counsellorProfile: {
      create: {
        specializations: ['Engineering Careers', 'IIT/NIT Guidance', 'Higher Education Abroad', 'Competitive Exams'],
        qualifications: ['M.Tech — IIT Bombay', 'B.Tech — NIT Trichy', 'Certified Education Counsellor — IECA'],
        experienceYears: 8,
        hourlyRate: 1200,
        rating: 4.9,
        totalSessions: 189,
        bio: 'Prof. Sanjay Gupta is an IIT Bombay alumnus who spent 5 years in the tech industry at Microsoft and Google before transitioning to education counselling. He specializes in guiding students through the engineering career landscape, JEE preparation strategy, and international education opportunities. He has mentored 200+ students who went on to IITs, NITs, and top global universities.',
        isVerified: true,
        availableSlots: {
          monday: [{ start: '11:00', end: '14:00' }],
          wednesday: [
            { start: '10:00', end: '13:00' },
            { start: '15:00', end: '18:00' },
          ],
          friday: [
            { start: '11:00', end: '14:00' },
            { start: '16:00', end: '19:00' },
          ],
          saturday: [{ start: '10:00', end: '13:00' }],
        },
      },
    },
  },
  {
    email: 'ms.kavitha.ram@pathfinder.in',
    passwordHash: hashPassword('Password@123'),
    firstName: 'Kavitha',
    lastName: 'Raman',
    role: Role.COUNSELLOR,
    isActive: true,
    counsellorProfile: {
      create: {
        specializations: ['Arts & Humanities', 'Creative Careers', 'Government Jobs', 'UPSC Preparation'],
        qualifications: ['M.A. English Literature — JNU', 'B.Ed — Delhi University', 'UPSC Interview Board Member (Retd.)'],
        experienceYears: 15,
        hourlyRate: 600,
        rating: 4.7,
        totalSessions: 456,
        bio: 'Ms. Kavitha Ram brings 15 years of diverse experience spanning creative careers, civil services, and humanities education. As a former UPSC interview board member, she offers unparalleled insight into government career paths. She is passionate about helping students who are interested in arts, literature, journalism, law, and public service — careers that are often undervalued but incredibly fulfilling.',
        isVerified: true,
        availableSlots: {
          tuesday: [
            { start: '09:00', end: '12:00' },
            { start: '13:00', end: '16:00' },
          ],
          thursday: [
            { start: '09:00', end: '12:00' },
            { start: '14:00', end: '17:00' },
          ],
          saturday: [{ start: '10:00', end: '14:00' }],
        },
      },
    },
  },
  {
    email: 'vikram.sharma@gmail.com',
    passwordHash: hashPassword('Password@123'),
    firstName: 'Vikram',
    lastName: 'Sharma',
    role: Role.PARENT,
    isActive: true,
    parentProfile: {
      create: {
        occupation: 'Senior Manager, Tata Consultancy Services',
        childrenIds: [], // Will link later via explicit update once Priya is created
      },
    },
  },
];
