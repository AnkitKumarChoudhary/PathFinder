import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import careerRoutes from './career.routes';
import studentRoutes from './student.routes';
import notificationRoutes from './notification.routes';
import resourceRoutes from './resource.routes';
import appointmentRoutes from './appointment.routes';
import assessmentRoutes from './assessment.routes';
import mentorshipRoutes from './mentorship.routes';
import resumeRoutes from './resume.routes';
import counsellorRoutes from './counsellor.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/careers', careerRoutes);
router.use('/student', studentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/resources', resourceRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/mentorship', mentorshipRoutes);
router.use('/resumes', resumeRoutes);
router.use('/counsellor', counsellorRoutes);
router.use('/admin', adminRoutes);

export default router;
