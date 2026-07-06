import {Router} from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import * as postController from '../controllers/postController.js';

const router = Router();

router.get('/feed', authenticateToken, postController.homeFeed);
router.get('/userposts', authenticateToken, postController.userPosts);
router.get('/:postId', authenticateToken, postController.getPost);
router.get('/details/:postId', authenticateToken, postController.postDetails);
router.post('/create', authenticateToken, postController.createPost);
router.patch('/edit/:postId', authenticateToken, postController.editPost);
router.delete('/:postId', authenticateToken, postController.deletePost);

export default router;