import { Router } from 'express';
import { getDashboardStats, getRecentActivity, getUpcomingAppointments } from '../controllers/student.controller';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';

const router = Router();

// Only students can access these routes
router.use(authenticate, requireRole('STUDENT'));

router.get('/dashboard-stats', getDashboardStats);
router.get('/recent-activity', getRecentActivity);
router.get('/upcoming-appointments', getUpcomingAppointments);

export default router;
