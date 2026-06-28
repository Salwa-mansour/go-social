import { Router } from 'express';

import { generateUploadSignture } from '../middleware/cloudinary'
import authenticateToken from '../middleware/authMiddleware'; // Your boilerplate auth
import { updateProfile } from '../controllers/userController'; 
// Configure the Cloudinary SDK with your hidden environment variables
const router = Router();

// GET /api/user/generate-upload-signature
// Authenticated users hit this to get permission to upload an image
router.get('/generate-upload-signature', authenticateToken, generateUploadSignature);
router.patch(authenticateToken,)

module.exports = router;