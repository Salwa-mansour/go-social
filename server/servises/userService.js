import prisma from '../data/connection.js';

export const getAuthorData = async (authorId, currentUserId) => {
  const authorData = await prisma.user.findUnique({
    where: {
      id: authorId,
    },
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      bio: true,
      // 🚀 FIX 1: Look at requests RECEIVED by this profile owner
      receivedRequests: {
        where: {
          senderId: currentUserId, // Sent by the logged-in user
        },
        select: {
          status: true, // Assuming your schema tracks 'PENDING' or 'ACCEPTED'
        }
      },
      posts: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          author: {
            select: { name: true, avatarUrl: true }
          },
          likes: {
            where: {
              userId: currentUserId,
            },
          },
          _count: {
            select: { likes: true, comments: true },
          },
        },
      },
    },
  });

  if (!authorData) return { user: null, posts: [] };

  // 🚀 FIX 2: Check the array to dynamically build flags for your FollowButton
  const activeRelation = authorData.receivedRequests?.[0];
  
  // Adjust these strings based on your Prisma Enum (e.g., 'ACCEPTED', 'PENDING')
  const isFollowing = activeRelation?.status === 'ACCEPTED'; 
  const isPending = activeRelation?.status === 'PENDING';

  const { posts, receivedRequests, ...userFields } = authorData;
  
  // Combine user details with the boolean states your frontend expects
  const user = {
    ...userFields,
    isFollowing,
    isPending
  };

  return { user, posts };
};
export const updateProfile = async(userId,updateData)=>{
 return   prisma.user.update({
      where: { 
        id: userId 
      },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        avatarUrl: true,
      }
    });
}
export const allUsers = async()=> {
  return prisma.user.findMany();
}
export const userswithFollowStatus = async(currentUserId) => {
  const allUsersFromDb = await prisma.user.findMany({
    where: {
      NOT: {
        id: currentUserId, // Don't show the logged-in user in the discover list
      }
    },
       select: {
      id: true,
      email: true,
      name: true, // Note: your schema defines this as 'name' instead of 'username'
      bio: true,
      avatarUrl: true,
      // Include received requests matching the logged-in user's sender ID
      receivedRequests: {
        where: {
          senderId: currentUserId,
        },
        select: {
          status: true,
          
        },
      },
    },

});
 return allUsersFromDb;
}  
export const followRequest = async(senderId, receiverId) => {
  return prisma.followRequest.create({
    data: {
      senderId,
      receiverId,
      status: 'PENDING', // Initial status is PENDING
    },
  });
}

export const deleteFollowRequest = async(senderId, receiverId) => {
  return prisma.followRequest.deleteMany({
    where: {
      senderId,
      receiverId,
    },
  });
}

export const findPendingRequests = async (currentUserId) => {
  return await prisma.followRequest.findMany({
    where: {
      receiverId: currentUserId,
      status: 'PENDING'
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          avatarUrl: true
        }
      }
    }
  });
};

export const acceptRequest = async (requestId) => {
  return await prisma.followRequest.update({
    where: { 
      id: requestId 
    },
    data: { 
      status: 'ACCEPTED' 
    }
  });
};

export const rejectRequest = async (requestId) => {
  return await prisma.followRequest.delete({
    where: { 
      id: requestId 
    }
  });
};


export const getFollowedAccounts = async (currentUserId) => { 
   const followedAccounts = await prisma.followRequest.findMany({
    where: {
      senderId: currentUserId,
      status: 'ACCEPTED',
    },
    select: {
      receiverId: true, // Only pull the string ID, keeping the payload tiny
    },
  });
   return followedAccounts;
}