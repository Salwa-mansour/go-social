import prisma from '../data/connection';

export const updateProfile = async(userId,bio,avatarUrl)=>{
 return   prisma.user.update({
      where: { 
        id: userId 
      },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        avatarUrl: true,
        portfolioUrl: true,
        githubUrl: true,
        createdAt: true
      }
    });
}