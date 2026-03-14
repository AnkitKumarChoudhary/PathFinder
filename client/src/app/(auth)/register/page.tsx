'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  GraduationCap,
  UserCheck,
  Heart,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useAuthStore, type Role, type RegisterData } from '@/store/authStore';
import { cn } from '@/lib/utils';

// =================== VALIDATION SCHEMAS ===================

const step1BaseSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain a special character'),
  confirmPassword: z.string(),
});

const step2Schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

const step3Schema = z.object({
  role: z.enum(['STUDENT', 'COUNSELLOR', 'PARENT']),
});

// Step 4 schemas vary by role
const studentProfileSchema = z.object({
  educationLevel: z.string().optional(),
  stream: z.string().optional(),
  board: z.string().optional(),
  institution: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  interests: z.array(z.string()).optional(),
});

const counsellorProfileSchema = z.object({
  qualifications: z.string().optional(),
  experienceYears: z.coerce.number().optional(),
  specializations: z.array(z.string()).optional(),
  organization: z.string().optional(),
  bio: z.string().max(500, 'Bio must be under 500 characters').optional(),
});

const parentProfileSchema = z.object({
  childEmail: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  occupation: z.string().optional(),
});

// Full schema (for validation)
const fullSchema = step1BaseSchema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(studentProfileSchema.partial())
  .merge(counsellorProfileSchema.partial())
  .merge(parentProfileSchema.partial())
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Infer the FormData type from the schema
type FormData = z.infer<typeof fullSchema>;

// =================== PASSWORD STRENGTH ===================

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { level: 'weak', color: 'bg-status-error', text: 'Weak' };
  if (score <= 3) return { level: 'medium', color: 'bg-status-warning', text: 'Medium' };
  return { level: 'strong', color: 'bg-status-success', text: 'Strong' };
}

// =================== CONSTANTS ===================

const STEPS = [
  { number: 1, title: 'Account' },
  { number: 2, title: 'Personal' },
  { number: 3, title: 'Role' },
  { number: 4, title: 'Profile' },
];

const EDUCATION_LEVELS = [
  { value: 'CLASS_9', label: 'Class 9' },
  { value: 'CLASS_10', label: 'Class 10' },
  { value: 'CLASS_11', label: 'Class 11' },
  { value: 'CLASS_12', label: 'Class 12' },
  { value: 'UNDERGRADUATE', label: 'Undergraduate' },
  { value: 'POSTGRADUATE', label: 'Postgraduate' },
];

const STREAMS = [
  { value: 'SCIENCE_PCM', label: 'Science (PCM)' },
  { value: 'SCIENCE_PCB', label: 'Science (PCB)' },
  { value: 'COMMERCE', label: 'Commerce' },
  { value: 'ARTS_HUMANITIES', label: 'Arts / Humanities' },
  { value: 'VOCATIONAL', label: 'Vocational' },
  { value: 'NOT_DECIDED', label: 'Not Decided' },
];

const BOARDS = [
  { value: 'CBSE', label: 'CBSE' },
  { value: 'ICSE', label: 'ICSE' },
  { value: 'State Board', label: 'State Board' },
  { value: 'IB', label: 'IB' },
  { value: 'Other', label: 'Other' },
];

const GENDERS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
  { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' },
];

const INTERESTS = [
  'Technology',
  'Medicine',
  'Business',
  'Arts',
  'Law',
  'Sports',
  'Government',
  'Design',
  'Media',
  'Science',
  'Education',
  'Finance',
];

const SPECIALIZATIONS = [
  'Career Guidance',
  'College Admissions',
  'Aptitude Testing',
  'Study Abroad',
  'Skill Development',
  'Resume Building',
  'Interview Prep',
  'Industry Insights',
];

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Bihar',
  'Delhi',
  'Gujarat',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'West Bengal',
  'Other',
];

// =================== ROLE CARDS ===================

const ROLE_OPTIONS = [
  {
    value: 'STUDENT' as Role,
    icon: GraduationCap,
    title: 'Student',
    description: "I'm a student looking for career guidance and assessment tools.",
  },
  {
    value: 'COUNSELLOR' as Role,
    icon: UserCheck,
    title: 'Career Counsellor',
    description: "I'm a professional career counsellor looking to connect with students.",
  },
  {
    value: 'PARENT' as Role,
    icon: Heart,
    title: 'Parent',
    description: "I want to track my child's career assessment results and progress.",
  },
];

// =================== COMPONENT ===================

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(fullSchema) as any,
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      role: 'STUDENT',
      interests: [],
      specializations: [],
    },
  });

  const password = watch('password');
  const selectedRole = watch('role');
  const passwordStrength = useMemo(() => getPasswordStrength(password || ''), [password]);

  // Step navigation
  const canGoNext = async () => {
    let isValid = false;
    switch (currentStep) {
      case 1:
        isValid = await trigger(['email', 'password', 'confirmPassword']);
        break;
      case 2:
        isValid = await trigger(['firstName', 'lastName']);
        break;
      case 3:
        isValid = await trigger(['role']);
        break;
      default:
        isValid = true;
    }
    return isValid;
  };

  const handleNext = async () => {
    const isValid = await canGoNext();
    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleInterest = (interest: string) => {
    const updated = selectedInterests.includes(interest)
      ? selectedInterests.filter((i) => i !== interest)
      : [...selectedInterests, interest];
    setSelectedInterests(updated);
    setValue('interests', updated);
  };

  const toggleSpecialization = (spec: string) => {
    const updated = selectedSpecializations.includes(spec)
      ? selectedSpecializations.filter((s) => s !== spec)
      : [...selectedSpecializations, spec];
    setSelectedSpecializations(updated);
    setValue('specializations', updated);
  };

  const onSubmit = async (data: FormData) => {
    try {
      // Prepare data based on role
      const submitData: RegisterData = {
        email: data.email as string,
        password: data.password as string,
        firstName: data.firstName as string,
        lastName: data.lastName as string,
        phone: (data.phone as string) || undefined,
        gender: (data.gender as string) || undefined,
        dateOfBirth: (data.dateOfBirth as string) || undefined,
        role: data.role as Role,
        // Role-specific fields
        ...(data.role === 'STUDENT' && {
          educationLevel: data.educationLevel as string,
          stream: data.stream as string,
          board: data.board as string,
          institution: data.institution as string,
          city: data.city as string,
          state: data.state as string,
          interests: selectedInterests,
        }),
        ...(data.role === 'COUNSELLOR' && {
          qualifications: data.qualifications ? [data.qualifications as string] : undefined,
          experienceYears: data.experienceYears as number,
          specializations: selectedSpecializations,
          organization: data.organization as string,
          bio: data.bio as string,
        }),
        ...(data.role === 'PARENT' && {
          childEmail: (data.childEmail as string) || undefined,
          occupation: data.occupation as string,
        }),
      };

      await registerUser(submitData);
      toast.success('Registration successful! Please verify your email.');
      router.push(`/verify-email?email=${encodeURIComponent(data.email as string)}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-brand-cream dark:bg-dark-bg">
      {/* Header */}
      <header className="border-b border-border bg-surface px-6 py-4 dark:border-dark-border dark:bg-dark-surface">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link
            href="/"
            className="font-heading text-heading-3 font-bold text-brand-forest dark:text-brand-mint"
          >
            PathFinder
          </Link>
          <p className="text-body-sm text-muted dark:text-dark-muted">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-brand-forest hover:underline dark:text-brand-mint"
            >
              Sign in
            </Link>
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-2xl">
          {/* Step Indicator */}
          <div className="mb-10">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  {/* Step Circle */}
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full text-body font-medium transition-all',
                      currentStep > step.number
                        ? 'bg-brand-forest text-white'
                        : currentStep === step.number
                          ? 'bg-brand-forest text-white ring-4 ring-brand-mint/30'
                          : 'bg-border text-muted dark:bg-dark-border dark:text-dark-muted'
                    )}
                  >
                    {currentStep > step.number ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  {/* Connecting Line */}
                  {index < STEPS.length - 1 && (
                    <div
                      className={cn(
                        'mx-2 h-1 w-12 rounded-full sm:w-20 md:w-28',
                        currentStep > step.number
                          ? 'bg-brand-forest'
                          : 'bg-border dark:bg-dark-border'
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between text-caption text-muted dark:text-dark-muted">
              {STEPS.map((step) => (
                <span
                  key={step.number}
                  className={cn(
                    'w-10 text-center',
                    currentStep >= step.number && 'text-brand-forest dark:text-brand-mint'
                  )}
                >
                  {step.title}
                </span>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Account Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="font-heading text-heading-2 font-bold text-charcoal dark:text-dark-text">
                    Create your account
                  </h1>
                  <p className="mt-2 text-body text-muted dark:text-dark-muted">
                    Start your career discovery journey
                  </p>
                </div>

                <div className="space-y-5 rounded-2xl bg-surface p-6 shadow-soft dark:bg-dark-surface">
                  <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    leftIcon={<Mail className="h-5 w-5" />}
                    error={errors.email?.message}
                    {...register('email')}
                  />

                  <div>
                    <Input
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      leftIcon={<Lock className="h-5 w-5" />}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="cursor-pointer"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      }
                      error={errors.password?.message}
                      {...register('password')}
                    />
                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="mt-2">
                        <div className="mb-1 flex items-center gap-2">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-border dark:bg-dark-border">
                            <div
                              className={cn(
                                'h-full transition-all',
                                passwordStrength.color,
                                passwordStrength.level === 'weak' && 'w-1/3',
                                passwordStrength.level === 'medium' && 'w-2/3',
                                passwordStrength.level === 'strong' && 'w-full'
                              )}
                            />
                          </div>
                          <span className="text-caption text-muted dark:text-dark-muted">
                            {passwordStrength.text}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <Input
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    leftIcon={<Lock className="h-5 w-5" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="cursor-pointer"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    }
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword')}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Personal Info */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="font-heading text-heading-2 font-bold text-charcoal dark:text-dark-text">
                    Personal Information
                  </h1>
                  <p className="mt-2 text-body text-muted dark:text-dark-muted">
                    Tell us a bit about yourself
                  </p>
                </div>

                <div className="space-y-5 rounded-2xl bg-surface p-6 shadow-soft dark:bg-dark-surface">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Input
                      label="First Name"
                      placeholder="Your first name"
                      leftIcon={<User className="h-5 w-5" />}
                      error={errors.firstName?.message}
                      {...register('firstName')}
                    />
                    <Input
                      label="Last Name"
                      placeholder="Your last name"
                      leftIcon={<User className="h-5 w-5" />}
                      error={errors.lastName?.message}
                      {...register('lastName')}
                    />
                  </div>

                  <Input
                    label="Phone Number (Optional)"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    leftIcon={<Phone className="h-5 w-5" />}
                    error={errors.phone?.message}
                    {...register('phone')}
                  />

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Select
                      label="Gender (Optional)"
                      placeholder="Select gender"
                      {...register('gender')}
                    >
                      {GENDERS.map((g) => (
                        <option key={g.value} value={g.value}>
                          {g.label}
                        </option>
                      ))}
                    </Select>

                    <Input
                      label="Date of Birth (Optional)"
                      type="date"
                      {...register('dateOfBirth')}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Role Selection */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="font-heading text-heading-2 font-bold text-charcoal dark:text-dark-text">
                    I am a...
                  </h1>
                  <p className="mt-2 text-body text-muted dark:text-dark-muted">
                    Select the option that best describes you
                  </p>
                </div>

                <div className="space-y-4">
                  {ROLE_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const isSelected = selectedRole === option.value;
                    return (
                      <label
                        key={option.value}
                        className={cn(
                          'flex cursor-pointer items-start gap-4 rounded-2xl border-2 bg-surface p-5 transition-all dark:bg-dark-surface',
                          isSelected
                            ? 'border-brand-forest shadow-soft'
                            : 'border-transparent hover:border-border dark:hover:border-dark-border'
                        )}
                      >
                        <input
                          type="radio"
                          value={option.value}
                          className="sr-only"
                          {...register('role')}
                        />
                        <div
                          className={cn(
                            'rounded-xl p-3',
                            isSelected
                              ? 'bg-brand-forest text-white'
                              : 'bg-brand-cream text-brand-forest dark:bg-dark-elevated dark:text-brand-mint'
                          )}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-heading text-heading-4 font-semibold text-charcoal dark:text-dark-text">
                            {option.title}
                          </h3>
                          <p className="mt-1 text-body-sm text-muted dark:text-dark-muted">
                            {option.description}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="ml-auto">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-forest text-white">
                              <Check className="h-4 w-4" />
                            </div>
                          </div>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Profile Details */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="font-heading text-heading-2 font-bold text-charcoal dark:text-dark-text">
                    Complete your profile
                  </h1>
                  <p className="mt-2 text-body text-muted dark:text-dark-muted">
                    {selectedRole === 'STUDENT' && 'Help us personalize your experience'}
                    {selectedRole === 'COUNSELLOR' && 'Tell students about your expertise'}
                    {selectedRole === 'PARENT' && 'Link your account to your child'}
                  </p>
                </div>

                <div className="space-y-5 rounded-2xl bg-surface p-6 shadow-soft dark:bg-dark-surface">
                  {/* STUDENT PROFILE */}
                  {selectedRole === 'STUDENT' && (
                    <>
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <Select
                          label="Education Level"
                          placeholder="Select level"
                          {...register('educationLevel')}
                        >
                          {EDUCATION_LEVELS.map((l) => (
                            <option key={l.value} value={l.value}>
                              {l.label}
                            </option>
                          ))}
                        </Select>
                        <Select
                          label="Stream"
                          placeholder="Select stream"
                          {...register('stream')}
                        >
                          {STREAMS.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </Select>
                      </div>

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <Select label="Board" placeholder="Select board" {...register('board')}>
                          {BOARDS.map((b) => (
                            <option key={b.value} value={b.value}>
                              {b.label}
                            </option>
                          ))}
                        </Select>
                        <Input
                          label="Institution Name"
                          placeholder="Your school or college"
                          {...register('institution')}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <Input label="City" placeholder="Your city" {...register('city')} />
                        <Select label="State" placeholder="Select state" {...register('state')}>
                          {INDIAN_STATES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </Select>
                      </div>

                      {/* Interests */}
                      <div>
                        <label className="mb-3 block text-body-sm font-medium text-charcoal dark:text-dark-text">
                          Interests (Select all that apply)
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {INTERESTS.map((interest) => (
                            <button
                              key={interest}
                              type="button"
                              onClick={() => toggleInterest(interest)}
                              className={cn(
                                'rounded-full px-4 py-2 text-body-sm transition-all',
                                selectedInterests.includes(interest)
                                  ? 'bg-brand-forest text-white'
                                  : 'bg-brand-cream text-charcoal hover:bg-brand-sand/30 dark:bg-dark-elevated dark:text-dark-text'
                              )}
                            >
                              {interest}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* COUNSELLOR PROFILE */}
                  {selectedRole === 'COUNSELLOR' && (
                    <>
                      <Input
                        label="Qualifications"
                        placeholder="e.g., M.A. Psychology, Career Counselling Certification"
                        {...register('qualifications')}
                      />

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <Input
                          label="Years of Experience"
                          type="number"
                          min={0}
                          placeholder="Years"
                          {...register('experienceYears')}
                        />
                        <Input
                          label="Organization/School"
                          placeholder="Where you work"
                          {...register('organization')}
                        />
                      </div>

                      {/* Specializations */}
                      <div>
                        <label className="mb-3 block text-body-sm font-medium text-charcoal dark:text-dark-text">
                          Specializations
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {SPECIALIZATIONS.map((spec) => (
                            <button
                              key={spec}
                              type="button"
                              onClick={() => toggleSpecialization(spec)}
                              className={cn(
                                'rounded-full px-4 py-2 text-body-sm transition-all',
                                selectedSpecializations.includes(spec)
                                  ? 'bg-brand-forest text-white'
                                  : 'bg-brand-cream text-charcoal hover:bg-brand-sand/30 dark:bg-dark-elevated dark:text-dark-text'
                              )}
                            >
                              {spec}
                            </button>
                          ))}
                        </div>
                      </div>

                      <Textarea
                        label="Bio"
                        placeholder="Tell students about yourself and your approach to career counselling..."
                        maxLength={500}
                        {...register('bio')}
                      />
                      <p className="text-caption text-muted dark:text-dark-muted">
                        {(watch('bio') || '').length}/500 characters
                      </p>
                    </>
                  )}

                  {/* PARENT PROFILE */}
                  {selectedRole === 'PARENT' && (
                    <>
                      <Input
                        label="Child's Email (Optional)"
                        type="email"
                        placeholder="Your child's registered email"
                        helperText="If your child already has an account, enter their email to link accounts"
                        {...register('childEmail')}
                      />
                      <Input
                        label="Occupation"
                        placeholder="Your profession"
                        {...register('occupation')}
                      />
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between">
              {currentStep > 1 ? (
                <Button type="button" variant="ghost" onClick={handleBack}>
                  <ChevronLeft className="h-5 w-5" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <Button type="button" variant="primary" onClick={handleNext}>
                  Next
                  <ChevronRight className="h-5 w-5" />
                </Button>
              ) : (
                <Button type="submit" variant="primary" loading={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
