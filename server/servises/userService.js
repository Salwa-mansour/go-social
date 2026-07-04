import prisma from '../data/connection.js';

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


