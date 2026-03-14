import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiResponse } from '../utils/apiResponse'
import * as adminService from '../services/admin.service'

export const getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await adminService.getAdminDashboardStats()
  return ApiResponse.success(res, stats, 'Admin dashboard stats fetched')
})

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = req.query.page ? Number(req.query.page) : 1
  const limit = req.query.limit ? Number(req.query.limit) : 10

  const data = await adminService.getUsers({
    search: req.query.search as string | undefined,
    role: req.query.role as string | undefined,
    status: req.query.status as string | undefined,
    page,
    limit,
    sort: req.query.sort as string | undefined,
  })

  return ApiResponse.success(res, data, 'Users fetched')
})

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await adminService.getUserById(String(req.params.id))
  return ApiResponse.success(res, { user }, 'User fetched')
})

export const updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const { isActive } = req.body || {}
  if (typeof isActive !== 'boolean') {
    return ApiResponse.badRequest(res, 'isActive must be a boolean')
  }

  const user = await adminService.updateUserStatus(String(req.params.id), isActive)
  return ApiResponse.success(res, { user }, 'User status updated')
})

export const getCareersList = asyncHandler(async (req: Request, res: Response) => {
  const page = req.query.page ? Number(req.query.page) : 1
  const limit = req.query.limit ? Number(req.query.limit) : 10

  const data = await adminService.getCareersList({
    search: req.query.search as string | undefined,
    category: req.query.category as string | undefined,
    page,
    limit,
  })

  return ApiResponse.success(res, data, 'Careers fetched')
})

export const createCareer = asyncHandler(async (req: Request, res: Response) => {
  const career = await adminService.createCareer(req.body || {})
  return ApiResponse.created(res, { career }, 'Career created')
})

export const updateCareer = asyncHandler(async (req: Request, res: Response) => {
  const career = await adminService.updateCareer(String(req.params.id), req.body || {})
  return ApiResponse.success(res, { career }, 'Career updated')
})

export const deleteCareer = asyncHandler(async (req: Request, res: Response) => {
  const result = await adminService.deleteCareer(String(req.params.id))
  return ApiResponse.success(res, result, 'Career deleted')
})

export const getAssessmentsList = asyncHandler(async (_req: Request, res: Response) => {
  const assessments = await adminService.getAssessmentsList()
  return ApiResponse.success(res, { assessments }, 'Assessments fetched')
})

export const getContactInquiries = asyncHandler(async (req: Request, res: Response) => {
  const page = req.query.page ? Number(req.query.page) : 1
  const limit = req.query.limit ? Number(req.query.limit) : 10

  const data = await adminService.getContactInquiries({
    status: req.query.status as string | undefined,
    page,
    limit,
  })

  return ApiResponse.success(res, data, 'Inquiries fetched')
})

const adminController = {
  getDashboardStats,
  getUsers,
  getUserById,
  updateUserStatus,
  getCareersList,
  createCareer,
  updateCareer,
  deleteCareer,
  getAssessmentsList,
  getContactInquiries,
}

export default adminController
