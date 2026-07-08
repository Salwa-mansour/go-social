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
  const feedPosts = await postService.getHomeFeed(authorsIds,currentUserId);
   if(!feedPosts){
    return res.status(404).json({message:"no feed found"});
   };

  return res.status(200).json(feedPosts);

});
export const authorPosts = catchAsync(async (req, res, next)=> {
    const currentUserId = req.user?.id || req.user?.userId;
    const {authorId} = req.params;
    const authorPosts = await postService.getAuthorPosts(authorId,currentUserId);
    return res.status(200).json(authorPosts);
});

export const getPost = catchAsync(async (req, res, next) => {
    const { postId } = req.params;
     const post = await postService.getPostById(postId);
     if(!post){
      return res.status(404).json({message:"no post found"});
     }
    return res.status(200).json(post);
});

export const postDetails = catchAsync(async (req, res, next) => {
    const currentUserId = req.user?.id || req.user?.userId;
    const { postId } = req.params;

    const post = await postService.getPostDetails(postId,currentUserId);
    if(!post){
      return res.status(404).json({message:"no post found"});
    }
    return res.status(200).json(post);
});  

export const createPost = catchAsync(async (req, res, next) => {
   
   const postData = {
        content: req.body.content,
    };
    const userId = req.user?.id || req.user?.userId;
    const post = await postService.createPost(userId, postData);
    if(!post){
      return res.status(400).json("post creation failed");
    }
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
export const likePost = catchAsync(async (req, res, next) => {
  const userId = req.user?.id || req.user?.userId;
  const { postId } = req.params;

  const like = await postService.likePost(userId, postId);
  
  if (!like) {
    return res.status(400).json({ message: "Failed to like post" });
  }
  
 
  return res.status(200).json({ message: "Post liked successfully", like });
});

export const unLikePost = catchAsync(async (req, res, next) => {
  const userId = req.user?.id || req.user?.userId;
  const { postId } = req.params;

  const didUnlike = await postService.unlikePost(userId, postId);
  
 
  if (!didUnlike) {
    return res.status(404).json({ message: "Like not found or already removed" });
  }
  
  return res.status(200).json({ message: "Post unliked successfully" });
});
