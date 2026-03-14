import { Router } from 'express';
import mentorshipController from '../controllers/mentorship.controller';
import { authenticate } from '../middleware/auth';
import { roleGuard } from '../middleware/roleGuard';

const router = Router();

router.get('/mentors', mentorshipController.getMentors);
router.get('/mentors/:id', mentorshipController.getMentorById);
router.get('/mentors/:id/availability', mentorshipController.getMentorAvailability);

router.post('/appointments', authenticate, roleGuard(['STUDENT']), mentorshipController.bookAppointment);
router.get(
  '/appointments',
  authenticate,
  roleGuard(['STUDENT', 'COUNSELLOR', 'ADMIN']),
  mentorshipController.getMyAppointments
);
router.patch(
  '/appointments/:id',
  authenticate,
  roleGuard(['STUDENT', 'COUNSELLOR', 'ADMIN']),
  mentorshipController.updateAppointment
);

router.put('/availability', authenticate, roleGuard(['COUNSELLOR']), mentorshipController.updateAvailability);

export default router;
