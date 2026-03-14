import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { roleGuard } from '../middleware/roleGuard'
import {
  createCareer,
  deleteCareer,
  getAssessmentsList,
  getCareersList,
  getContactInquiries,
  getDashboardStats,
  getUserById,
  getUsers,
  updateCareer,
  updateUserStatus,
} from '../controllers/admin.controller'

const router = Router()

router.use(authenticate)
router.use(roleGuard(['ADMIN']))

router.get('/dashboard', getDashboardStats)
router.get('/users', getUsers)
router.get('/users/:id', getUserById)
router.patch('/users/:id/status', updateUserStatus)

router.get('/careers', getCareersList)
router.post('/careers', createCareer)
router.patch('/careers/:id', updateCareer)
router.delete('/careers/:id', deleteCareer)

router.get('/assessments', getAssessmentsList)
router.get('/inquiries', getContactInquiries)

export default router
