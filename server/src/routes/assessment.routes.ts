import { Router } from 'express';
import {
  getAllAssessments,
  getAssessmentById,
  submitAssessment,
  getAttempts,
  getAttemptById,
} from '../controllers/assessment.controller';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';

const router = Router();

// Apply authentication to all routes below
router.use(authenticate);

// List all active assessments (includes attempt status for current student)
router.get('/', getAllAssessments);

// Get a single assessment with its questions
// Note: Intentionally missing correctAnswer
router.get('/attempts', getAttempts);
router.get('/attempts/:id', getAttemptById);

router.get('/:id', getAssessmentById);

// Submit an assessment attempt (Only Students)
router.post('/:id/submit', requireRole('STUDENT'), submitAssessment);

export default router;
