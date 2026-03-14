import { Prisma } from '@prisma/client';
import prisma from '../config/database';
import { CreateResumeInput, UpdateResumeInput } from '../validators/resume.validator';

const withDefault = (value: Partial<CreateResumeInput> | undefined): Required<CreateResumeInput> => ({
  title: value?.title || 'My Resume',
  template: value?.template || 'classic',
  data: value?.data || {},
});

const getDefaultResumeData = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { firstName: true, lastName: true, email: true },
  });

  return {
    personalInfo: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
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
  };
};

export const createResume = async (userId: string, payload: CreateResumeInput) => {
  const resumeCount = await prisma.resume.count({ where: { userId } });
  const normalized = withDefault(payload);

  return prisma.resume.create({
    data: {
      userId,
      title: normalized.title,
      template: normalized.template,
      data: (Object.keys(normalized.data || {}).length
        ? normalized.data
        : await getDefaultResumeData(userId)) as Prisma.InputJsonValue,
      isDefault: resumeCount === 0,
    },
  });
};

export const getUserResumes = async (userId: string) => {
  return prisma.resume.findMany({
    where: { userId },
    orderBy: { lastEdited: 'desc' },
    select: {
      id: true,
      title: true,
      template: true,
      isDefault: true,
      lastEdited: true,
      createdAt: true,
    },
  });
};

export const getResumeById = async (resumeId: string, userId: string) => {
  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
  });

  if (!resume) {
    throw new Error('Resume not found');
  }

  return resume;
};

export const updateResume = async (resumeId: string, userId: string, updates: UpdateResumeInput) => {
  const existing = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
    select: { id: true },
  });

  if (!existing) {
    throw new Error('Resume not found');
  }

  if (updates.isDefault) {
    await prisma.resume.updateMany({
      where: { userId, id: { not: resumeId } },
      data: { isDefault: false },
    });
  }

  return prisma.resume.update({
    where: { id: resumeId },
    data: {
      ...updates,
      lastEdited: new Date(),
    },
  });
};

export const deleteResume = async (resumeId: string, userId: string) => {
  const existing = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
    select: { id: true, isDefault: true },
  });

  if (!existing) {
    throw new Error('Resume not found');
  }

  await prisma.resume.delete({ where: { id: resumeId } });

  if (existing.isDefault) {
    const newest = await prisma.resume.findFirst({
      where: { userId },
      orderBy: { lastEdited: 'desc' },
      select: { id: true },
    });

    if (newest) {
      await prisma.resume.update({
        where: { id: newest.id },
        data: { isDefault: true },
      });
    }
  }

  return { deleted: true };
};

export const duplicateResume = async (resumeId: string, userId: string) => {
  const existing = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
  });

  if (!existing) {
    throw new Error('Resume not found');
  }

  return prisma.resume.create({
    data: {
      userId,
      title: `${existing.title} (Copy)`,
      template: existing.template,
      data: (existing.data ?? {}) as Prisma.InputJsonValue,
      isDefault: false,
      lastEdited: new Date(),
    },
  });
};
