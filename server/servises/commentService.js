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
    const comment = await prisma.comment.deleteMany({
        where: {
            id: commentId,
            authorId: userId,
        },
    });
    return comment;
}