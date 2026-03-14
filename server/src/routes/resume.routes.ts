import { Router } from 'express';
import resumeController from '../controllers/resume.controller';
import { authenticate } from '../middleware/auth';
import { roleGuard } from '../middleware/roleGuard';

const router = Router();

router.use(authenticate, roleGuard(['STUDENT']));

router.post('/', resumeController.createResume);
router.get('/', resumeController.getUserResumes);
router.get('/:id', resumeController.getResumeById);
router.patch('/:id', resumeController.updateResume);
router.delete('/:id', resumeController.deleteResume);
router.post('/:id/duplicate', resumeController.duplicateResume);

export default router;
