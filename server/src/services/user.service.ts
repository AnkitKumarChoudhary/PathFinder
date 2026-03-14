import prisma from '../config/database';
import bcrypt from 'bcryptjs';

export const calculateProfileCompletion = (user: any, profile: any) => {
  let completion = 0;
  
  if (user.firstName && user.lastName) completion += 10;
  if (user.isEmailVerified) completion += 10;
  if (user.phone) completion += 5;
  if (user.gender) completion += 5;
  if (user.dateOfBirth) completion += 5;

  if (profile) {
    if (profile.educationLevel) completion += 10;
    if (profile.stream) completion += 5;
    if (profile.institution) completion += 5;
    if (profile.board) completion += 5;
    if (profile.skills && profile.skills.length >= 3) completion += 10;
    if (profile.interests && profile.interests.length >= 3) completion += 10;
    if (profile.city && profile.state) completion += 5;
    if (profile.resumeUrl) completion += 10;
    if (profile.linkedinUrl) completion += 5;
  }

  return Math.min(completion, 100);
};

export const getUserProfile = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      avatar: true,
      gender: true,
      dateOfBirth: true,
      role: true,
      isEmailVerified: true,
      isActive: true,
      studentProfile: true,
    }
  });
};

export const updateUserProfile = async (userId: string, userData: any, profileData: any) => {
  const currentProfile = await prisma.studentProfile.findUnique({
    where: { userId }
  });

  const dbUser = await prisma.user.findUnique({ where: { id: userId }});
  if (!dbUser) throw new Error('User not found');
  
  const mergedUser = { ...dbUser, ...userData };
  const mergedProfile = { ...currentProfile, ...profileData };
  
  const completion = calculateProfileCompletion(mergedUser, mergedProfile);

  return prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: userData,
    });

    const updatedProfile = await tx.studentProfile.upsert({
      where: { userId },
      update: {
        ...profileData,
        profileCompletion: completion
      },
      create: {
        ...profileData,
        userId,
        profileCompletion: completion
      }
    });

    return { ...updatedUser, studentProfile: updatedProfile };
  });
};

export const updateAvatar = async (userId: string, avatarUrl: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: { avatar: avatarUrl },
    select: {
      id: true,
      avatar: true
    }
  });
};

export const changePassword = async (userId: string, currentPassword: string, newPassword: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.passwordHash) {
    throw new Error('User not found or using OAuth');
  }

  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isMatch) {
    throw new Error('Invalid current password');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash }
  });
};
