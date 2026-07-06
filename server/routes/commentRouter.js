import {Router} from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import * as commentController from '../controllers/commentController.js';   

const router = Router();

router.get('/all/:postId', authenticateToken, commentController.getCommentsByPostId);
router.post('/create/:postId', authenticateToken, commentController.createComment);
router.patch('/edit/:commentId', authenticateToken, commentController.editComment);
router.delete('/delete/:commentId', authenticateToken, commentController.deleteComment);


export default router;