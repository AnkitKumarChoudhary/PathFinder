import { Prisma } from '@prisma/client';
import prisma from '../config/database';

type CareerQueryParams = {
  search?: string;
  category?: string;
  salary?: 'low' | 'medium' | 'high';
  growth?: 'High' | 'Moderate' | 'Stable' | 'Emerging';
  exam?: string;
  page: number;
  limit: number;
  sort?: 'title_asc' | 'title_desc' | 'salary_high' | 'salary_low' | 'newest' | 'relevance';
};

const extractAverageSalaryText = (averageSalary: Prisma.JsonValue | null): string | null => {
  if (averageSalary === null || averageSalary === undefined) return null;
  if (typeof averageSalary === 'string') return averageSalary;
  if (typeof averageSalary === 'number') return String(averageSalary);
  if (typeof averageSalary === 'object') {
    if (Array.isArray(averageSalary)) return averageSalary.join(', ');
    const salaryObj = averageSalary as Record<string, unknown>;
    if (typeof salaryObj.display === 'string') return salaryObj.display;
    if (typeof salaryObj.range === 'string') return salaryObj.range;
    if (typeof salaryObj.value === 'string') return salaryObj.value;
    return JSON.stringify(averageSalary);
  }
  return null;
};

const parseSalaryLpa = (averageSalary: Prisma.JsonValue | null): number | null => {
  const salaryText = extractAverageSalaryText(averageSalary);
  if (!salaryText) return null;
  const matches = salaryText.match(/\d+(?:\.\d+)?/g);
  if (!matches || matches.length === 0) return null;
  const numbers = matches.map(Number).filter((n) => !Number.isNaN(n));
  if (numbers.length === 0) return null;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
};

const mapCareer = (career: any) => ({
  id: career.id,
  title: career.title,
  category: career.category,
  description: career.description,
  averageSalary: extractAverageSalaryText(career.averageSalary),
  growthOutlook: career.growthOutlook ?? null,
  educationPath: (career.requiredEducation || []).join(', ') || null,
  skills: career.requiredSkills || [],
  roadmap: career.roadmapSteps ?? null,
  dayInLife: career.dayInLife ?? null,
  industries: career.topCompanies || [],
  popularExams: career.entranceExams || [],
  topColleges: career.topColleges || [],
  resources: career.resources ?? null,
  imageUrl: career.imageUrl ?? null,
  isActive: career.isPublished,
  createdAt: career.createdAt,
  updatedAt: career.updatedAt,
});

export const getCareers = async (params: CareerQueryParams) => {
  const { search, category, salary, growth, exam, page, limit, sort } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.CareerWhereInput = {
    isPublished: true,
  };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (category) {
    const categories = category
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    if (categories.length > 0) {
      const categoryTerms = categories
        .flatMap((item) => item.split(/&|and/i))
        .map((item) => item.trim())
        .filter((item) => item.length >= 2);

      const categoryOr: Prisma.CareerWhereInput[] = [
        { category: { in: categories } },
        ...categories.map((item) => ({
          category: { contains: item, mode: Prisma.QueryMode.insensitive },
        })),
        ...categoryTerms.map((term) => ({
          category: { contains: term, mode: Prisma.QueryMode.insensitive },
        })),
      ];

      if (where.AND) {
        const andConditions = Array.isArray(where.AND) ? where.AND : [where.AND];
        where.AND = [...andConditions, { OR: categoryOr }];
      } else {
        where.AND = [{ OR: categoryOr }];
      }
    }
  }

  if (growth) {
    where.growthOutlook = { contains: growth, mode: 'insensitive' };
  }

  if (exam) {
    const exams = exam
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    if (exams.length > 0) {
      where.entranceExams = { hasSome: exams };
    }
  }

  let orderBy: Prisma.CareerOrderByWithRelationInput = { title: 'asc' };
  if (sort === 'title_asc') orderBy = { title: 'asc' };
  else if (sort === 'title_desc') orderBy = { title: 'desc' };
  else if (sort === 'newest') orderBy = { createdAt: 'desc' };
  else if (sort === 'relevance' || !sort) orderBy = { title: 'asc' };

  const useInMemorySalarySort = sort === 'salary_high' || sort === 'salary_low';

  if (useInMemorySalarySort) {
    const allCareers = await prisma.career.findMany({ where });

    const filteredBySalary = allCareers.filter((career) => {
      if (!salary) return true;
      const avg = parseSalaryLpa(career.averageSalary);
      if (avg === null) return false;
      if (salary === 'low') return avg < 5;
      if (salary === 'medium') return avg >= 5 && avg <= 15;
      return avg > 15;
    });

    filteredBySalary.sort((a, b) => {
      const aText = extractAverageSalaryText(a.averageSalary) || '';
      const bText = extractAverageSalaryText(b.averageSalary) || '';
      return sort === 'salary_high' ? bText.localeCompare(aText) : aText.localeCompare(bText);
    });

    const total = filteredBySalary.length;
    const careers = filteredBySalary.slice(skip, skip + limit).map(mapCareer);

    return {
      careers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  const [rawCareers, total] = await prisma.$transaction([
    prisma.career.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.career.count({ where }),
  ]);

  const salaryFiltered = rawCareers.filter((career) => {
    if (!salary) return true;
    const avg = parseSalaryLpa(career.averageSalary);
    if (avg === null) return false;
    if (salary === 'low') return avg < 5;
    if (salary === 'medium') return avg >= 5 && avg <= 15;
    return avg > 15;
  });

  return {
    careers: salary ? salaryFiltered.map(mapCareer) : rawCareers.map(mapCareer),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getCareerById = async (careerId: string, userId?: string) => {
  const career = await prisma.career.findUnique({ where: { id: careerId } });
  if (!career) {
    return null;
  }

  let isSaved = false;
  if (userId) {
    const savedCareer = await prisma.savedCareer.findUnique({
      where: {
        userId_careerId: {
          userId,
          careerId,
        },
      },
    });
    isSaved = Boolean(savedCareer);
  }

  return {
    ...mapCareer(career),
    isSaved,
  };
};

export const getRelatedCareers = async (careerId: string, limit = 6) => {
  const targetCareer = await prisma.career.findUnique({ where: { id: careerId } });
  if (!targetCareer) {
    return [];
  }

  const relatedCareers = await prisma.career.findMany({
    where: {
      id: { not: careerId },
      isPublished: true,
      OR: [
        { category: targetCareer.category },
        {
          requiredSkills: {
            hasSome: targetCareer.requiredSkills,
          },
        },
      ],
    },
    take: 50,
  });

  const sorted = relatedCareers.sort((a, b) => {
    const aCategoryMatch = a.category === targetCareer.category ? 1 : 0;
    const bCategoryMatch = b.category === targetCareer.category ? 1 : 0;
    if (aCategoryMatch !== bCategoryMatch) return bCategoryMatch - aCategoryMatch;
    return a.title.localeCompare(b.title);
  });

  return sorted.slice(0, limit).map(mapCareer);
};

export const getCategories = async () => {
  const categories = await prisma.career.groupBy({
    by: ['category'],
    _count: { id: true },
    where: { isPublished: true },
    orderBy: { category: 'asc' },
  });

  return categories.map((item) => ({
    name: item.category,
    count: item._count.id,
  }));
};

export const getRecommendedCareers = async (userId: string) => {
  const savedCareerRows = await prisma.savedCareer.findMany({
    where: { userId },
    select: { careerId: true },
  });

  const savedSet = new Set(savedCareerRows.map((item) => item.careerId));

  const careers = await prisma.career.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  return careers.map((career) => ({
    ...mapCareer(career),
    isSaved: savedSet.has(career.id),
  }));
};

export const compareCareers = async (careerIds: string[]) => {
  const careers = await prisma.career.findMany({
    where: {
      id: { in: careerIds },
      isPublished: true,
    },
  });

  return careers.map(mapCareer);
};

export const toggleSaveCareer = async (userId: string, careerId: string) => {
  const existing = await prisma.savedCareer.findUnique({
    where: {
      userId_careerId: {
        userId,
        careerId,
      },
    },
  });

  if (existing) {
    await prisma.savedCareer.delete({
      where: {
        userId_careerId: {
          userId,
          careerId,
        },
      },
    });

    return { isSaved: false };
  }

  const career = await prisma.career.findUnique({ where: { id: careerId } });
  if (!career || !career.isPublished) {
    const error = new Error('Career not found');
    (error as any).statusCode = 404;
    throw error;
  }

  await prisma.savedCareer.create({
    data: {
      userId,
      careerId,
    },
  });

  return { isSaved: true };
};

export const getSavedCareers = async (userId: string) => {
  const savedCareers = await prisma.savedCareer.findMany({
    where: { userId },
    include: { career: true },
    orderBy: { createdAt: 'desc' },
  });

  return savedCareers.map((saved) => ({
    id: saved.id,
    userId: saved.userId,
    careerId: saved.careerId,
    notes: saved.notes,
    savedAt: saved.createdAt,
    career: mapCareer(saved.career),
  }));
};

export const updateSavedCareerNote = async (userId: string, careerId: string, notes?: string) => {
  return prisma.savedCareer.update({
    where: {
      userId_careerId: {
        userId,
        careerId,
      },
    },
    data: {
      notes: notes ?? null,
    },
  });
};
