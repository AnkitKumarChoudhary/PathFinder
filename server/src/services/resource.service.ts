import prisma from '../config/database';
import { ResourceType } from '@prisma/client';

export const getResources = async (params: { page?: number; limit?: number; type?: string; category?: string; featured?: string }) => {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (params.type) where.type = params.type as ResourceType;
  if (params.category) where.category = params.category;
  if (params.featured === 'true') where.isFeatured = true;

  const [resources, total] = await Promise.all([
    prisma.resource.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.resource.count({ where })
  ]);

  return {
    resources,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getFeaturedResources = async () => {
  return prisma.resource.findMany({
    where: { isFeatured: true },
    take: 6,
    orderBy: { createdAt: 'desc' }
  });
};

export const getRecommendedResources = async (userId: string) => {
  const profile = await prisma.studentProfile.findUnique({
    where: { userId }
  });

  if (!profile) return [];

  const searchTerms = [...(profile.interests || []), ...(profile.preferredCareers || [])];

  if (searchTerms.length === 0) {
    return prisma.resource.findMany({ take: 6, orderBy: { viewCount: 'desc' } });
  }

  const resources = await prisma.resource.findMany({
    where: {
      OR: searchTerms.map(term => ({
        category: { contains: term, mode: 'insensitive' }
      }))
    },
    take: 6,
    orderBy: { createdAt: 'desc' }
  });

  if (resources.length === 0) {
    return prisma.resource.findMany({ take: 6, orderBy: { viewCount: 'desc' } });
  }

  return resources;
};
