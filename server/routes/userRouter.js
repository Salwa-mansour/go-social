import { Router } from 'express';
import { generateUploadSignture } from '../middleware/cloudinary.js';
import { authenticateToken } from '../middleware/authMiddleware.js'; 
import * as userController from '../controllers/userController.js'; 

const router = Router();

// 1. Signature route for Cloudinary
router.get('/generate-upload-signature', authenticateToken, generateUploadSignture);
router.get('/allusers',authenticateToken,userController.getAllUsers)

// 2. Profile update endpoint
router.patch('/updateprofile', authenticateToken, userController.updateProfile);

// POST /user/follow/:id -> Begins following a target creator
router.post('/follow/:id', authenticateToken, userController.followUserUser);

// DELETE /user/unfollow/:id -> Breaks a follow pairing
router.delete('/unfollow/:id', authenticateToken, userController.unfollowUserUser);

// Get all pending requests received by the logged-in user
router.get('/requests', authenticateToken, userController.getPendingRequests);

// Accept a specific request (updates status to ACCEPTED)
router.patch('/requests/accept/:id', authenticateToken, userController.acceptFollowRequest);

// Reject/Delete a specific request (removes the row)
router.delete('/requests/reject/:id', authenticateToken, userController.rejectFollowRequest);
export default router;