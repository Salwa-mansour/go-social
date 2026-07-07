import * as commentService from "../servises/commentService.js";
import catchAsync from "../utils/catchAsyncError.js";

export const getCommentsByPostId = catchAsync(async (req, res, next) => {   
    const {postId} = req.params;
    const comments = await commentService.getPostComments(postId);
    return res.status(200).json(comments);

});
 export const createComment = catchAsync(async (req, res, next) => {
    const userId = req.user?.id || req.user?.userId;
    const {postId} = req.params;
    const commentData = {   
        content: req.body.content,
    };
    const comment = await commentService.createComment(userId, postId, commentData);
    return res.status(201).json(comment);
});

export const editComment = catchAsync(async (req, res, next) => {
    const userId = req.user?.id || req.user?.userId;
    const {commentId} = req.params; 
    const commentData = {
        content: req.body.content,
    };
    const comment = await commentService.editComment(commentId, userId, commentData);
    if (comment.count === 0) {
        return res.status(404).json({ message: 'Comment not found or you are not authorized to edit this comment.' });
    }
    return res.status(200).json(comment);
});

export const deleteComment = catchAsync(async (req, res, next) => {
    const userId = req.user?.id || req.user?.userId;
    const {commentId} = req.params; 
    const comment = await commentService.deleteComment(commentId, userId);
    if (comment.count === 0) {
        return res.status(404).json({ message: 'Comment not found or you are not authorized to delete this comment.' });
    }
    return res.status(200).json({ message: 'Comment deleted successfully.' });
});