import { Router } from 'express';
import { getResources, getFeaturedResources, getRecommendedResources } from '../controllers/resource.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// /api/resources
router.get('/', getResources);
router.get('/featured', getFeaturedResources);
router.get('/recommended', authenticate, getRecommendedResources);

export default router;
