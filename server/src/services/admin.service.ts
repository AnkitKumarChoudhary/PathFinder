import prisma from '../config/database'

type AdminUserQueryParams = {
  search?: string
  role?: string
  status?: string
  page: number
  limit: number
  sort?: string
}

type AdminCareerQueryParams = {
  search?: string
  category?: string
  page: number
  limit: number
}

type ContactInquiriesQueryParams = {
  status?: string
  page: number
  limit: number
}

const startOfMonth = (base: Date) => new Date(base.getFullYear(), base.getMonth(), 1)

const startOfWeekMonday = (base: Date) => {
  const current = new Date(base)
  const day = current.getDay()
  const diff = day === 0 ? -6 : 1 - day
  current.setDate(current.getDate() + diff)
  current.setHours(0, 0, 0, 0)
  return current
}

const formatMonthLabel = (date: Date) =>
  date.toLocaleString('en-IN', {
    month: 'short',
    year: 'numeric',
  })

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const mapSortToOrderBy = (sort?: string) => {
  switch (sort) {
    case 'name_asc':
      return [{ firstName: 'asc' as const }]
    case 'name_desc':
      return [{ firstName: 'desc' as const }]
    case 'email_asc':
      return [{ email: 'asc' as const }]
    case 'email_desc':
      return [{ email: 'desc' as const }]
    case 'oldest':
      return [{ createdAt: 'asc' as const }]
    case 'newest':
    default:
      return [{ createdAt: 'desc' as const }]
  }
}

export const getAdminDashboardStats = async () => {
  return prisma.$transaction(async (tx) => {
    const now = new Date()
    const monthStart = startOfMonth(now)
    const weekStart = startOfWeekMonday(now)

    const roleCounts = await tx.user.groupBy({
      by: ['role'],
      _count: { id: true },
    })

    const roleMap = roleCounts.reduce(
      (acc, item) => {
        if (item.role === 'STUDENT') acc.students = item._count.id
        if (item.role === 'COUNSELLOR') acc.counsellors = item._count.id
        if (item.role === 'PARENT') acc.parents = item._count.id
        if (item.role === 'ADMIN') acc.admins = item._count.id
        return acc
      },
      { students: 0, counsellors: 0, parents: 0, admins: 0 }
    )

    const [
      totalCareers,
      totalAssessments,
      totalAttempts,
      totalAppointments,
      appointmentByStatus,
      newUsersThisMonth,
      newUsersThisWeek,
      attemptsThisMonth,
      appointmentsThisMonth,
      popularCareerGroups,
      recentActivity,
    ] = await Promise.all([
      tx.career.count({ where: { isPublished: true } }),
      tx.assessment.count({ where: { isActive: true } }),
      tx.assessmentAttempt.count(),
      tx.appointment.count(),
      tx.appointment.groupBy({ by: ['status'], _count: { id: true } }),
      tx.user.count({ where: { createdAt: { gte: monthStart } } }),
      tx.user.count({ where: { createdAt: { gte: weekStart } } }),
      tx.assessmentAttempt.count({ where: { createdAt: { gte: monthStart } } }),
      tx.appointment.count({ where: { createdAt: { gte: monthStart } } }),
      tx.savedCareer.groupBy({
        by: ['careerId'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      }),
      tx.activityLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              role: true,
            },
          },
        },
      }),
    ])

    const careerIds = popularCareerGroups.map((item) => item.careerId)
    const careers = careerIds.length
      ? await tx.career.findMany({
          where: { id: { in: careerIds } },
          select: { id: true, title: true },
        })
      : []

    const careersMap = new Map(careers.map((item) => [item.id, item.title]))

    const popularCareers = popularCareerGroups.map((item) => ({
      careerId: item.careerId,
      title: careersMap.get(item.careerId) || 'Unknown Career',
      count: item._count.id,
    }))

    const registrationTrend: Array<{ month: string; count: number }> = []
    for (let i = 5; i >= 0; i -= 1) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
      const count = await tx.user.count({
        where: {
          createdAt: {
            gte: monthDate,
            lt: nextMonthDate,
          },
        },
      })

      registrationTrend.push({
        month: formatMonthLabel(monthDate),
        count,
      })
    }

    return {
      userCounts: {
        ...roleMap,
        total: roleMap.students + roleMap.counsellors + roleMap.parents + roleMap.admins,
      },
      totalCareers,
      totalAssessments,
      totalAttempts,
      totalAppointments,
      appointmentBreakdown: appointmentByStatus.map((item) => ({
        status: item.status,
        count: item._count.id,
      })),
      newUsersThisMonth,
      newUsersThisWeek,
      attemptsThisMonth,
      appointmentsThisMonth,
      registrationTrend,
      popularCareers,
      recentActivity,
    }
  })
}

export const getUsers = async (params: AdminUserQueryParams) => {
  const { search, role, status, page, limit, sort } = params
  const where: any = {}

  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (role) {
    where.role = role
  }

  if (status === 'active') {
    where.isActive = true
  } else if (status === 'inactive') {
    where.isActive = false
  }

  const skip = (page - 1) * limit

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        avatar: true,
        isEmailVerified: true,
        isActive: true,
        createdAt: true,
        phone: true,
        _count: {
          select: {
            appointmentsAsStudent: true,
            assessmentAttempts: true,
          },
        },
      },
      orderBy: mapSortToOrderBy(sort),
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ])

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      studentProfile: true,
      counsellorProfile: true,
      parentProfile: true,
      _count: {
        select: {
          appointmentsAsStudent: true,
          appointmentsAsCounsellor: true,
          assessmentAttempts: true,
          activityLogs: true,
        },
      },
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  return user
}

export const updateUserStatus = async (userId: string, isActive: boolean) => {
  return prisma.user.update({
    where: { id: userId },
    data: { isActive },
  })
}

export const getCareersList = async (params: AdminCareerQueryParams) => {
  const { search, category, page, limit } = params
  const where: any = {}

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (category) {
    where.category = category
  }

  const skip = (page - 1) * limit

  const [careers, total] = await Promise.all([
    prisma.career.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        category: true,
        description: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            savedBy: true,
          },
        },
      },
    }),
    prisma.career.count({ where }),
  ])

  return {
    careers: careers.map((career) => ({
      ...career,
      isActive: career.isPublished,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export const createCareer = async (data: Record<string, any>) => {
  const { title, category, description } = data
  if (!title || !category || !description) {
    throw new Error('title, category, and description are required')
  }

  const baseSlug = slugify(title)
  const slug = `${baseSlug}-${Date.now().toString().slice(-6)}`

  return prisma.career.create({
    data: {
      title,
      slug,
      category,
      description,
      shortDescription: data.shortDescription || String(description).slice(0, 280),
      averageSalary: data.averageSalary || { entry: 0, mid: 0, senior: 0 },
      requiredSkills: data.skills || data.requiredSkills || [],
      requiredEducation: data.requiredEducation || [data.educationPath || 'Any Graduation'],
      eligibility: data.eligibility || null,
      entranceExams: data.popularExams || data.entranceExams || [],
      topColleges: data.topColleges || [],
      topCompanies: data.industries || data.topCompanies || [],
      growthOutlook: data.growthOutlook || 'Moderate',
      demandLevel: data.demandLevel || 'Moderate',
      workLifeBalance: data.workLifeBalance ?? 7,
      jobSatisfaction: data.jobSatisfaction ?? 8,
      dayInLife: data.dayInLife || null,
      riasecCodes: data.riasecCodes || [],
      relatedCareers: data.relatedCareers || [],
      roadmapSteps: data.roadmapSteps || null,
      resources: data.resources || null,
      isPublished: data.isActive ?? true,
      imageUrl: data.imageUrl || null,
      iconName: data.iconName || null,
      subCategory: data.subCategory || null,
      requiredTraits: data.requiredTraits || null,
      viewCount: 0,
    },
  })
}

export const updateCareer = async (careerId: string, data: Record<string, any>) => {
  const updatePayload: Record<string, any> = { ...data }

  if (data.isActive !== undefined) {
    updatePayload.isPublished = data.isActive
    delete updatePayload.isActive
  }

  if (data.skills !== undefined && updatePayload.requiredSkills === undefined) {
    updatePayload.requiredSkills = data.skills
    delete updatePayload.skills
  }

  if (data.popularExams !== undefined && updatePayload.entranceExams === undefined) {
    updatePayload.entranceExams = data.popularExams
    delete updatePayload.popularExams
  }

  if (data.industries !== undefined && updatePayload.topCompanies === undefined) {
    updatePayload.topCompanies = data.industries
    delete updatePayload.industries
  }

  if (data.educationPath !== undefined && updatePayload.requiredEducation === undefined) {
    updatePayload.requiredEducation = [data.educationPath]
    delete updatePayload.educationPath
  }

  return prisma.career.update({
    where: { id: careerId },
    data: updatePayload,
  })
}

export const deleteCareer = async (careerId: string) => {
  await prisma.career.update({
    where: { id: careerId },
    data: { isPublished: false },
  })

  return { deleted: true }
}

export const getAssessmentsList = async () => {
  const assessments = await prisma.assessment.findMany({
    include: {
      _count: {
        select: {
          questions: true,
          attempts: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return assessments.map((assessment) => ({
    ...assessment,
    totalQuestions: assessment._count.questions,
    totalAttempts: assessment._count.attempts,
  }))
}

export const getContactInquiries = async (params: ContactInquiriesQueryParams) => {
  const { status, page, limit } = params

  const where: any = {}
  if (status === 'resolved') where.isResolved = true
  if (status === 'open' || status === 'pending') where.isResolved = false

  const skip = (page - 1) * limit

  const [inquiries, total] = await Promise.all([
    prisma.contactInquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.contactInquiry.count({ where }),
  ])

  return {
    inquiries,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}
