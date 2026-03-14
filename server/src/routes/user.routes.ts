import { Router } from 'express';
import { getProfile, updateProfile, uploadAvatar, changePassword } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import { upload } from '../utils/upload';

const router = Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/avatar', upload.single('avatar'), uploadAvatar);
router.put('/change-password', changePassword);

export default router;
