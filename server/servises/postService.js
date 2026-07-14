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
        select: {id:true, name: true, avatarUrl: true } 
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
export const getAuthorPosts = async (authorId,currentUserId) => {
   const authorPosts = await prisma.post.findMany({
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

    return authorPosts;
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
                    id:true,
                    name: true,
                    avatarUrl: true,
                },
            },
            comments: {
              
                include: {
                    author: {
                        select: {
                            id:true,
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
            },
            _count: {
              select: { likes: true, comments: true } //  gets totals
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
export const likePost = async (userId, postId) => {
  // Use upsert or create. upsert avoids duplicates if clicked rapidly
  const like = await prisma.like.create({
    data: {
      userId: userId,
      postId: postId,
    },
  });
  return like;
};


export const unlikePost = async (userId, postId) => {
  // deleteMany is safer here because if the like doesn't exist, 
  // it returns { count: 0 } instead of throwing a hard Prisma error crash.
  const result = await prisma.like.deleteMany({
    where: {
      userId: userId,
      postId: postId,
    },
  });
  
  // Return true if something was actually deleted, false if there was no like to remove
  return result.count > 0;
};