'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import { useAuthStore, User } from '@/store/authStore';
import { Camera, Loader2, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  phone: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  studentProfile: z.object({
    educationLevel: z.string().optional().nullable(),
    stream: z.string().optional().nullable(),
    institution: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    state: z.string().optional().nullable(),
  }).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function StudentProfilePage() {
  const [activeTab, setActiveTab] = useState<'personal' | 'academic'>('personal');
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await api.get('/users/profile');
      return response.data.data as User;
    },
  });

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: userProfile ? {
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      phone: userProfile.phone || '',
      gender: userProfile.gender || '',
      dateOfBirth: userProfile.dateOfBirth ? new Date(userProfile.dateOfBirth).toISOString().split('T')[0] : '',
      studentProfile: {
        educationLevel: userProfile.studentProfile?.educationLevel || '',
        stream: userProfile.studentProfile?.stream || '',
        institution: userProfile.studentProfile?.institution || '',
        city: userProfile.studentProfile?.city || '',
        state: userProfile.studentProfile?.state || '',
      }
    } : undefined
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const payload = {
         firstName: data.firstName,
         lastName: data.lastName,
         phone: data.phone || undefined,
         gender: data.gender || undefined,
         dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString() : undefined,
         educationLevel: data.studentProfile?.educationLevel || undefined,
         stream: data.studentProfile?.stream || undefined,
         institution: data.studentProfile?.institution || undefined,
         city: data.studentProfile?.city || undefined,
         state: data.studentProfile?.state || undefined,
      };
      const res = await api.put('/users/profile', payload);
      return res.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      setUser(data);
      // We could add a toast here
    },
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    setUploadingAvatar(true);
    try {
      const res = await api.put('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      setUser(res.data.data);
    } catch (error) {
      console.error('Failed to upload avatar', error);
      alert('Failed to upload avatar. Max size is 5MB.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const onSubmit = (data: ProfileFormValues) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center animate-pulse"><Loader2 className="animate-spin text-brand-forest" size={32} /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div>
          <h1 className="font-heading text-heading-2 font-bold text-charcoal dark:text-gray-100">My Profile</h1>
          <p className="text-muted mt-1">Manage your personal and academic details</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-4">
          <div className="text-sm">
            <span className="text-muted mr-2">Profile Completion:</span>
            <span className="font-bold text-brand-forest">
              {userProfile?.studentProfile ? 100 : 50}%
            </span>
          </div>
        </div>
      </div>

      <div className="card-base overflow-hidden">
        {/* Avatar Header */}
        <div className="bg-brand-cream/30 dark:bg-dark-surface p-6 md:p-8 border-b border-gray-100 dark:border-dark-border flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-white dark:border-dark-elevated shadow-sm">
              {userProfile?.avatar ? (
                <div className="relative h-full w-full">
                  <Image src={userProfile.avatar} alt="Avatar" fill className="object-cover" unoptimized />
                </div>
              ) : (
                <div className="w-full h-full bg-brand-forest/20 text-brand-forest flex items-center justify-center text-2xl font-bold">
                  {userProfile?.firstName[0]}{userProfile?.lastName[0]}
                </div>
              )}
            </div>
            
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-brand-sand text-charcoal rounded-full flex items-center justify-center cursor-pointer hover:bg-brand-sand/90 transition-colors shadow-sm">
              {uploadingAvatar ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
            </label>
          </div>
          
          <div className="text-center md:text-left">
            <h2 className="font-heading text-heading-3 font-semibold">{userProfile?.firstName} {userProfile?.lastName}</h2>
            <p className="text-muted">{userProfile?.email}</p>
            <div className="mt-2 inline-block px-3 py-1 bg-gray-100 dark:bg-dark-elevated rounded-full text-xs font-medium text-charcoal dark:text-gray-300">
              Student Account
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-dark-border px-6">
          <button 
            className={`py-4 px-4 font-medium text-sm transition-colors border-b-2 ${activeTab === 'personal' ? 'border-brand-forest text-brand-forest' : 'border-transparent text-muted hover:text-charcoal dark:hover:text-gray-200'}`}
            onClick={() => setActiveTab('personal')}
          >
            Personal Details
          </button>
          <button 
            className={`py-4 px-4 font-medium text-sm transition-colors border-b-2 ${activeTab === 'academic' ? 'border-brand-forest text-brand-forest' : 'border-transparent text-muted hover:text-charcoal dark:hover:text-gray-200'}`}
            onClick={() => setActiveTab('academic')}
          >
            Academic Profile
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
          
          {activeTab === 'personal' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-charcoal dark:text-gray-300 mb-1">First Name</label>
                <input {...register('firstName')} className="input-field" placeholder="First Name" />
                {errors.firstName && <span className="text-xs text-status-error">{errors.firstName.message}</span>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-charcoal dark:text-gray-300 mb-1">Last Name</label>
                <input {...register('lastName')} className="input-field" placeholder="Last Name" />
                {errors.lastName && <span className="text-xs text-status-error">{errors.lastName.message}</span>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-charcoal dark:text-gray-300 mb-1">Phone Number</label>
                <input {...register('phone')} className="input-field" placeholder="+91 xxxxxxxxxx" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-charcoal dark:text-gray-300 mb-1">Gender</label>
                <select {...register('gender')} className="input-field">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal dark:text-gray-300 mb-1">Date of Birth</label>
                <input {...register('dateOfBirth')} type="date" className="input-field" />
              </div>
            </motion.div>
          )}

          {activeTab === 'academic' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-charcoal dark:text-gray-300 mb-1">Education Level</label>
                <select {...register('studentProfile.educationLevel')} className="input-field">
                  <option value="">Select Level</option>
                  <option value="High School">High School (10th/12th)</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-charcoal dark:text-gray-300 mb-1">Stream / Field of Study</label>
                <input {...register('studentProfile.stream')} className="input-field" placeholder="e.g. Science, Commerce, Computer Science" />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-charcoal dark:text-gray-300 mb-1">Institution Name</label>
                <input {...register('studentProfile.institution')} className="input-field" placeholder="Name of your school or college" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-charcoal dark:text-gray-300 mb-1">City</label>
                <input {...register('studentProfile.city')} className="input-field" placeholder="City" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-charcoal dark:text-gray-300 mb-1">State</label>
                <input {...register('studentProfile.state')} className="input-field" placeholder="State" />
              </div>
            </motion.div>
          )}

          <div className="mt-8 flex justify-end">
            <button 
              type="submit" 
              disabled={updateMutation.isPending}
              className="btn-primary flex items-center gap-2 px-6"
            >
              {updateMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
