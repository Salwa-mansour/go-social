import * as postService from '../servises/postService.js';
import * as userService from '../servises/userService.js';
import catchAsync from '../utils/catchAsyncError.js';

export const homeFeed= catchAsync(async (req, res, next)=> {
  // 1. Fetch only the IDs of accounts the current user follows
   const currentUserId = req.user?.id || req.user?.userId;

  const followedAccounts = await userService.getFollowedAccounts(currentUserId);

  // Extract the IDs into a flat array of strings, and include the user's own ID 
  // so they see their own posts on their feed too.
  const authorsIds = [
    currentUserId, 
    ...followedAccounts.map(follow => follow.receiverId)
  ];

  // 2. Fetch the posts matching those authors
  const feedPosts = await postService.getHomeFeed(authorsIds);

  return res.status(200).json(feedPosts);

});
export const userPosts = catchAsync(async (req, res, next)=> {
    const userId = req.user?.id || req.user?.userId;

    const userPosts = await postService.getUserPosts(userId);
    return res.status(200).json(userPosts);
});

export const getPost = catchAsync(async (req, res, next) => {
    const { postId } = req.params;
     const post = await postService.getPostById(postId);
    return res.status(200).json(post);
});

export const postDetails = catchAsync(async (req, res, next) => {
    const { postId } = req.params;
    const post = await postService.getPostDetails(postId);
    return res.status(200).json(post);
});  

export const createPost = catchAsync(async (req, res, next) => {
   
   const postData = {
        content: req.body.content,
    };
    const userId = req.user?.id || req.user?.userId;
    const post = await postService.createPost(userId, postData);
    return res.status(201).json(post);
});

export const editPost = catchAsync(async (req, res, next) => {
    const userId = req.user?.id || req.user?.userId;
    const { postId } = req.params;
    const postData = {
        content: req.body.content,
    };
    const post = await postService.editPost(postId, userId, postData);
    if (post.count === 0) {
        return res.status(404).json({ message: 'Post not found or you are not authorized to edit this post.' });
    }
    return res.status(200).json(post);
});

export const deletePost = catchAsync(async (req, res, next) => {
    const userId = req.user?.id || req.user?.userId;
    const { postId } = req.params;
    const post = await postService.deletePost(postId, userId);
    if (post.count === 0) {
        return res.status(404).json({ message: 'Post not found or you are not authorized to delete this post.' });
    }
    return res.status(200).json({ message: 'Post deleted successfully.' });
});

