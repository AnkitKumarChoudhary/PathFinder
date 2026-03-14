import { Router } from 'express';
import { getAppointments, getAppointmentById, cancelAppointment, submitFeedback } from '../controllers/appointment.controller';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';

const router = Router();

router.use(authenticate);

router.get('/', getAppointments);
router.get('/:id', getAppointmentById);
router.put('/:id/cancel', cancelAppointment);
router.put('/:id/feedback', requireRole('STUDENT'), submitFeedback);

export default router;
