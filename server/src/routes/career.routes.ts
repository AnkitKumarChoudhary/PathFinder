import { Router } from 'express';
import careerController from '../controllers/career.controller';
import { authenticate, optionalAuth } from '../middleware/auth';
import { roleGuard } from '../middleware/roleGuard';

const router = Router();

router.get('/', careerController.getCareers);
router.get('/categories', careerController.getCategories);
router.get('/recommended', authenticate, roleGuard(['STUDENT']), careerController.getRecommendedCareers);

router.get('/saved', authenticate, roleGuard(['STUDENT']), careerController.getSavedCareers);

router.post('/compare', careerController.compareCareers);

router.get('/:id', optionalAuth, careerController.getCareerById);
router.get('/:id/related', careerController.getRelatedCareers);

router.post('/:id/save', authenticate, roleGuard(['STUDENT']), careerController.toggleSaveCareer);
router.patch('/:id/note', authenticate, roleGuard(['STUDENT']), careerController.updateSavedCareerNote);

export default router;
