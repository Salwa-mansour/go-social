import * as userService from '../servises/userService.js';
import catchAsync from '../utils/catchAsyncError.js';

export const authorData = catchAsync(async(req,res,nest)=>{
    const currentUserId = req.user?.id || req.user?.userId;
    const {authorId} = req.params;
    const userData = await userService.getAuthorData(authorId,currentUserId);
    if(!userData){
      return res.status(404).json({message:"no author data"});
    }
    return res.status(200).json(userData);
});

export const getAllUsers = catchAsync(async (req, res, next) => {
  // 1. Extract the current logged-in user's ID from the JWT payload
  const currentUserId = req.user?.userId || req.user?.id;

  // 2. Fetch all users from the database except the logged-in user themselves
  const allUsersFromDb = await userService.userswithFollowStatus(currentUserId);

  // 3. Map over the data to turn the Prisma relation array into explicit status booleans
  const usersWithFollowStatus = allUsersFromDb.map((user) => {
    // Check if there's an active request sent by the logged-in user
    const dynamicRequest = user.receivedRequests[0]; 

    return {
      id: user.id,
      email: user.email,
      username: user.name, // Mapping 'name' to 'username' for your React component
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      // true if an ACCEPTED request exists
      isFollowing: dynamicRequest?.status === 'ACCEPTED',
      // true if a request is waiting for approval
      isPending: dynamicRequest?.status === 'PENDING',
    };
  });

  return res.status(200).json(usersWithFollowStatus);
});

 export const updateProfile = catchAsync(async (req, res, next) => {
  try {
    // 1. Grab values from the frontend JSON payload
    const { bio, avatarUrl } = req.body;
    
    // 2. req.user is set by your boilerplate's authenticateToken middleware
   const userId = req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: Missing user context" });
    }

    // 3. Construct a dynamic update object (only changes fields the user sent)
    const updateData = {};
    if (bio !== undefined) updateData.bio = bio;
    if (avatarUrl !== undefined && avatarUrl !== '') updateData.avatarUrl = avatarUrl;

    // 4. Update the record in your database via Prisma
    const updatedUser = await userService.updateProfile(userId,updateData);

    // 5. Send back the updated information
    return res.status(200).json({
      message: "Profile updated successfully!",
      user: updatedUser
    });

  } catch (error) {
    console.error("Error in updateProfile controller:", error);
    
    // Catch-all for database errors (e.g., if user record wasn't found)
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "User profile record not found" });
    }

    return res.status(500).json({ error: "An internal server error occurred" });
  }
});

// POST /user/follow/:id
export const followUserUser = catchAsync(async (req, res) => {
  const currentUserId = req.user.userId || req.user.id;
  const targetUserId = req.params.id;

  if (currentUserId === targetUserId) {
    return res.status(400).json({ error: "You cannot follow yourself" });
  }

  // Create connection in your Prisma join schema
  await userService.followRequest(currentUserId, targetUserId);

  return res.status(200).json({ message: "Successfully followed user" });
});

// DELETE /user/unfollow/:id
export const unfollowUserUser = catchAsync(async (req, res) => {
  const currentUserId = req.user.userId || req.user.id;
  const targetUserId = req.params.id;

  if (currentUserId === targetUserId) {
    return res.status(400).json({ error: "You cannot unfollow yourself" });
  }
  // Remove connection in your Prisma join schema
  await userService.deleteFollowRequest(currentUserId, targetUserId);

  return res.status(200).json({ message: "Successfully unfollowed user" });
});

// GET /user/requests
export const getPendingRequests = catchAsync(async (req, res, next) => {
  const currentUserId = req.user?.userId || req.user?.id;

  // Execute database lookup through the service layer
  const pendingRequests = await userService.findPendingRequests(currentUserId);

  // Fallback to an empty array to prevent client mapping breaks if no records exist
  return res.status(200).json(pendingRequests || []);
});

// PATCH /user/requests/accept/:id
export const acceptFollowRequest = catchAsync(async (req, res, next) => {
  const requestId = req.params.id;

  // Execute database mutation through the service layer
  await userService.acceptRequest(requestId);

  return res.status(200).json({ 
    status: 'success',
    message: "Follow request accepted successfully." 
  });
});

// DELETE /user/requests/reject/:id
export const rejectFollowRequest = catchAsync(async (req, res, next) => {
  const requestId = req.params.id;

  // Execute database removal through the service layer
  await userService.rejectRequest(requestId);

  return res.status(200).json({ 
    status: 'success',
    message: "Follow request rejected and removed." 
  });
});