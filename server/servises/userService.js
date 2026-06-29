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