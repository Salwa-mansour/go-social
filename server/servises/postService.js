import prisma from '../data/connection.js';

export const getHomeFeed = async (authorsIds,currentUserId) => {

const feedPosts = await prisma.post.findMany({
    where: {
      authorId: {
        in: authorsIds, 
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      author: {
        select: { name: true, avatarUrl: true } 
      },
    likes: {
        where: {
            userId: currentUserId // Filters the likes array to only include the logged-in user's like
        }
    }
      ,
      _count: {
        select: { likes: true, comments: true } //  gets totals
      }
    },
    take: 20, 
  });

  return feedPosts;
}
export const getUserPosts = async (authorId,currentUserId) => {
   const userPosts = await prisma.post.findMany({
        where: {
            authorId: authorId,
        },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            comments: {
                select: {
                    id: true,
                    content: true,
                       }
                      },
            likes:{
                where: {
                    userId: currentUserId 
                }
            }
               }
    });

    return userPosts;
}
export const getPostById = async (postId) => {
    const post = await prisma.post.findUnique({
        where: {
            id: postId,
        },
    });
    return post;
}
export const getPostDetails = async (postId,currentUserId) => {
    const post = await prisma.post.findUnique({
        where: {
            id: postId,
        },
        include: {
            author: {
                select: {
                    name: true,
                    avatarUrl: true,
                },
            },
            comments: {
              
                include: {
                    author: {
                        select: {
                            name: true,
                            avatarUrl: true,
                        },
                    },
                },
            },
            likes: {
                where: {
                    userId: currentUserId // Filters the likes array to only include the logged-in user's like
                }
            }
        },
    });
    return post;
}
export const createPost = async (userId, postData) => { 
    const post = await prisma.post.create({
        data: {
            authorId:userId,
            ...postData,
        },
    });
    return post;
}
export const editPost = async (postId, userId, postData) => {
    const post = await prisma.post.updateMany({
        where: {
            id: postId,
            authorId: userId,
        },
        data: postData,
    });
    return post;
}

export const deletePost = async (postId, userId) => {
    const post = await prisma.post.deleteMany({
        where: {
            id: postId,
            authorId: userId,
        },
    });
    return post;
}
