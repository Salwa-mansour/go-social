import prisma from "../data/connection.js";

export const getPostComments = async (postId) => {
    const comments = await prisma.comment.findMany({
        where: {
            postId: postId,
        },
        include: {  
         id:true,
         content: true,
            author: {
                select: {
                    id: true,
                    name: true,
                    avatarUrl:true
                }
            },
        },
    });
    return comments;
}   
export const createComment = async (userId, postId, commentData) => {
    const comment = await prisma.comment.create({
        data: {
           authorId: userId,
            postId,
            ...commentData,
        },
    });
    return comment;
}

export const editComment = async (commentId, userId, commentData) => {
    const comment = await prisma.comment.updateMany({
        where: {
            id: commentId,
            authorId: userId,
        },
        data: commentData,
    });
    return comment;
}
export const deleteComment = async (commentId, userId) => {
  const result = await prisma.comment.deleteMany({
    where: {
      id: commentId,
      OR: [
        {
          // Condition A: The user is the author of the comment
          authorId: userId,
        },
        {
          // Condition B: The user is the author of the main post this comment belongs to
          post: {
            authorId: userId,
          },
        },
      ],
    },
  });
  
  // Returns { count: 1 } if successful, or { count: 0 } if unauthorized/not found
  return result; 
};