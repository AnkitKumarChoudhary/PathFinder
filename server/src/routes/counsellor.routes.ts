import { Router } from 'express';
import counsellorController from '../controllers/counsellor.controller';
import { authenticate } from '../middleware/auth';
import { roleGuard } from '../middleware/roleGuard';

const router = Router();

router.use(authenticate, roleGuard(['COUNSELLOR']));

router.get('/dashboard', counsellorController.getDashboardStats);
router.get('/profile', counsellorController.getProfile);
router.patch('/profile', counsellorController.updateProfile);
router.get('/students', counsellorController.getStudents);
router.get('/appointments/:id', counsellorController.getAppointmentDetails);

export default router;
