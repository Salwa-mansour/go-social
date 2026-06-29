import { Router } from 'express';
import { generateUploadSignture } from '../middleware/cloudinary.js';
import { authenticateToken } from '../middleware/authMiddleware.js'; 
import { updateProfile } from '../controllers/userController.js'; 

const router = Router();

// 1. Signature route for Cloudinary
router.get('/generate-upload-signature', authenticateToken, generateUploadSignture);

// 2. Profile update endpoint
router.patch('/updateprofile', authenticateToken, updateProfile);

export default router;